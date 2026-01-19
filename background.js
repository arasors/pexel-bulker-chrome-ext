// Background service worker

let downloadQueue = [];
let isDownloading = false;
let isPaused = false;
let isCancelled = false;
let currentDownloadIndex = 0;
let downloadStats = {
  scannedPages: 0,
  totalPages: 0,
  downloadedCount: 0,
  totalDownloads: 0,
  failed: 0,
  isActive: false,
  isPaused: false
};

// State'i storage'a kaydet
async function saveState() {
  await chrome.storage.local.set({
    downloadQueue: downloadQueue,
    downloadStats: downloadStats,
    isDownloading: isDownloading,
    isPaused: isPaused,
    currentDownloadIndex: currentDownloadIndex
  });
}

// State'i storage'dan yükle
async function loadState() {
  const data = await chrome.storage.local.get([
    'downloadQueue',
    'downloadStats',
    'isDownloading',
    'isPaused',
    'currentDownloadIndex'
  ]);
  
  if (data.downloadQueue) downloadQueue = data.downloadQueue;
  if (data.downloadStats) downloadStats = data.downloadStats;
  if (data.isDownloading !== undefined) isDownloading = data.isDownloading;
  if (data.isPaused !== undefined) isPaused = data.isPaused;
  if (data.currentDownloadIndex !== undefined) currentDownloadIndex = data.currentDownloadIndex;
}

// Mesaj dinleyici
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCookies') {
    chrome.cookies.getAll({ domain: '.pexels.com' }, (cookies) => {
      sendResponse(cookies);
    });
    return true;
  } else if (request.action === 'startBulkDownload') {
    startBulkDownload(request.data);
    sendResponse({ success: true });
  } else if (request.action === 'pauseDownload') {
    pauseDownload();
    sendResponse({ success: true });
  } else if (request.action === 'resumeDownload') {
    resumeDownload();
    sendResponse({ success: true });
  } else if (request.action === 'cancelDownload') {
    cancelDownload();
    sendResponse({ success: true });
  } else if (request.action === 'getState') {
    sendResponse({
      stats: downloadStats,
      isPaused: isPaused,
      isDownloading: isDownloading,
      queueLength: downloadQueue.length
    });
  }
  return true;
});

// Toplu indirme işlemini başlat
async function startBulkDownload(config) {
  const { apiBaseUrl, startPage, endPage, quality, tabId } = config;
  
  // Reset state
  isCancelled = false;
  isPaused = false;
  currentDownloadIndex = 0;
  
  downloadStats = {
    scannedPages: 0,
    totalPages: endPage - startPage + 1,
    downloadedCount: 0,
    totalDownloads: 0,
    failed: 0,
    isActive: true,
    isPaused: false
  };
  
  downloadQueue = [];
  await saveState();
  
  sendLogToPopup('Scanning pages...', 'info');
  updateProgress('Scanning pages...');
  
  // Scan all pages
  for (let page = startPage; page <= endPage; page++) {
    if (isCancelled) {
      sendLogToPopup('Scan cancelled.', 'info');
      break;
    }
    
    const url = `${apiBaseUrl}&page=${page}&per_page=80`;
    
    try {
      const data = await fetchApiPage(url, tabId);
      
      if (data && data.data) {
        // Her video için uygun kaliteyi seç ve kuyruğa ekle
        data.data.forEach(item => {
          if (item.type === 'video' && item.attributes.video) {
            const downloadInfo = selectVideoQuality(item.attributes.video, quality, item.id);
            if (downloadInfo) {
              downloadQueue.push(downloadInfo);
            }
          }
        });
        
        downloadStats.scannedPages++;
        downloadStats.totalDownloads = downloadQueue.length;
        updateProgress(`Sayfa ${page}/${endPage} tarandı`);
        await saveState();
        
        // Rate limiting
        await sleep(500);
      }
    } catch (error) {
      sendLogToPopup(`Error scanning page ${page}: ${error.message}`, 'error');
    }
  }
  
  if (!isCancelled) {
    sendLogToPopup(`Scan complete! Found ${downloadQueue.length} videos.`, 'success');
    
    // İndirmeleri başlat
    if (downloadQueue.length > 0) {
      startDownloads();
    } else {
      downloadStats.isActive = false;
      await saveState();
      chrome.runtime.sendMessage({
        action: 'scanComplete',
        data: { totalDownloads: 0 }
      });
    }
  } else {
    downloadStats.isActive = false;
    await saveState();
  }
}

// API sayfasını fetch et
async function fetchApiPage(url, tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action: 'fetchApi', url: url }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.error));
      }
    });
  });
}

// Video kalitesini seç
function selectVideoQuality(videoData, preferredQuality, videoId) {
  if (!videoData.video_files || videoData.video_files.length === 0) {
    return null;
  }
  
  const videoFiles = videoData.video_files;
  let selectedFile = null;
  
  if (preferredQuality === 'all') {
    // En yüksek kaliteyi seç
    const qualities = ['uhd', 'hd', 'sd'];
    for (const q of qualities) {
      selectedFile = videoFiles.find(f => f.quality === q);
      if (selectedFile) break;
    }
  } else {
    // Belirtilen kaliteyi bul
    selectedFile = videoFiles.find(f => f.quality === preferredQuality);
    
    // Bulunamazsa, en yakın kaliteyi seç
    if (!selectedFile) {
      const qualityOrder = ['uhd', 'hd', 'sd'];
      const preferredIndex = qualityOrder.indexOf(preferredQuality);
      
      for (let i = preferredIndex; i < qualityOrder.length; i++) {
        selectedFile = videoFiles.find(f => f.quality === qualityOrder[i]);
        if (selectedFile) break;
      }
      
      // Hala bulunamadıysa, ilk dosyayı al
      if (!selectedFile) {
        selectedFile = videoFiles[0];
      }
    }
  }
  
  if (selectedFile) {
    return {
      id: videoId,
      url: selectedFile.link,
      filename: `pexels-${videoId}-${selectedFile.quality}-${selectedFile.width}x${selectedFile.height}.mp4`,
      quality: selectedFile.quality,
      width: selectedFile.width,
      height: selectedFile.height
    };
  }
  
  return null;
}

// Start downloads
async function startDownloads() {
  if (isDownloading) return;
  
  isDownloading = true;
  sendLogToPopup(`Downloading ${downloadQueue.length} videos...`, 'info');
  updateProgress('Downloading videos...');
  await saveState();
  
  // Download sequentially to comply with Chrome download limits
  for (let i = currentDownloadIndex; i < downloadQueue.length; i++) {
    // Pause check
    while (isPaused && !isCancelled) {
      await sleep(1000);
    }
    
    // Cancel check
    if (isCancelled) {
      sendLogToPopup('Download cancelled.', 'info');
      break;
    }
    
    const item = downloadQueue[i];
    currentDownloadIndex = i;
    
    try {
      await downloadVideo(item);
      downloadStats.downloadedCount++;
      updateProgress(`Downloading video: ${downloadStats.downloadedCount}/${downloadStats.totalDownloads}`);
      sendLogToPopup(`Downloaded: ${item.filename}`, 'success');
      await saveState();
      
      // Rate limiting
      await sleep(1000);
    } catch (error) {
      downloadStats.failed++;
      sendLogToPopup(`Download error (${item.filename}): ${error.message}`, 'error');
      await saveState();
    }
  }
  
  isDownloading = false;
  downloadStats.isActive = false;
  await saveState();
  
  if (!isCancelled) {
    sendLogToPopup(`Download complete! Successful: ${downloadStats.downloadedCount}, Failed: ${downloadStats.failed}`, 'success');
  }
  
  chrome.runtime.sendMessage({
    action: 'scanComplete',
    data: { 
      totalDownloads: downloadStats.totalDownloads,
      successful: downloadStats.downloadedCount,
      failed: downloadStats.failed
    }
  });
}

// Pause download
function pauseDownload() {
  isPaused = true;
  downloadStats.isPaused = true;
  saveState();
  sendLogToPopup('Download paused.', 'info');
  updateProgress('Paused');
}

// Resume download
function resumeDownload() {
  isPaused = false;
  downloadStats.isPaused = false;
  saveState();
  sendLogToPopup('Download resumed.', 'success');
  updateProgress(`Downloading video: ${downloadStats.downloadedCount}/${downloadStats.totalDownloads}`);
}

// Cancel download
function cancelDownload() {
  isCancelled = true;
  isPaused = false;
  isDownloading = false;
  downloadStats.isActive = false;
  downloadStats.isPaused = false;
  saveState();
  sendLogToPopup('Download cancelled.', 'info');
  updateProgress('Cancelled');
}

// Video indir
function downloadVideo(item) {
  return new Promise((resolve, reject) => {
    chrome.downloads.download({
      url: item.url,
      filename: `PexelBulker/${item.filename}`,
      saveAs: false,
      conflictAction: 'uniquify'
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      
      if (!downloadId) {
        reject(new Error('İndirme ID alınamadı'));
        return;
      }
      
      // İndirme durumunu takip et
      const listener = (delta) => {
        if (delta.id === downloadId && delta.state) {
          if (delta.state.current === 'complete') {
            chrome.downloads.onChanged.removeListener(listener);
            resolve(downloadId);
          } else if (delta.state.current === 'interrupted') {
            chrome.downloads.onChanged.removeListener(listener);
            reject(new Error('İndirme kesildi'));
          }
        }
      };
      
      chrome.downloads.onChanged.addListener(listener);
      
      // 30 saniye timeout ekle
      setTimeout(() => {
        chrome.downloads.onChanged.removeListener(listener);
        resolve(downloadId); // Timeout olsa bile başarılı say
      }, 30000);
    });
  });
}

// Progress güncelleme mesajı gönder
function updateProgress(status) {
  chrome.runtime.sendMessage({
    action: 'updateProgress',
    data: {
      scannedPages: downloadStats.scannedPages,
      totalPages: downloadStats.totalPages,
      downloadedCount: downloadStats.downloadedCount,
      totalDownloads: downloadStats.totalDownloads,
      currentStatus: status
    }
  });
}

// Popup'a log mesajı gönder
function sendLogToPopup(message, type = 'info') {
  chrome.runtime.sendMessage({
    action: 'addLog',
    message: message,
    type: type
  });
}

// Sleep fonksiyonu
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
