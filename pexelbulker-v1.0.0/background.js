// Background service worker

let downloadQueue = [];
let isDownloading = false;
let downloadStats = {
  scannedPages: 0,
  totalPages: 0,
  downloadedCount: 0,
  totalDownloads: 0,
  failed: 0
};

// Cookie'leri al
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCookies') {
    chrome.cookies.getAll({ domain: '.pexels.com' }, (cookies) => {
      sendResponse(cookies);
    });
    return true;
  } else if (request.action === 'startBulkDownload') {
    startBulkDownload(request.data);
    sendResponse({ success: true });
  }
});

// Toplu indirme işlemini başlat
async function startBulkDownload(config) {
  const { apiBaseUrl, startPage, endPage, quality, tabId } = config;
  
  downloadStats = {
    scannedPages: 0,
    totalPages: endPage - startPage + 1,
    downloadedCount: 0,
    totalDownloads: 0,
    failed: 0
  };
  
  downloadQueue = [];
  
  sendLogToPopup('Sayfalar taranıyor...', 'info');
  updateProgress('Sayfalar taranıyor...');
  
  // Tüm sayfaları tara
  for (let page = startPage; page <= endPage; page++) {
    const url = `${apiBaseUrl}&page=${page}&per_page=80`; // Her sayfada daha fazla sonuç al
    
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
        
        // Rate limiting - her istekten sonra kısa bir bekleme
        await sleep(500);
      }
    } catch (error) {
      sendLogToPopup(`Sayfa ${page} taranırken hata: ${error.message}`, 'error');
    }
  }
  
  sendLogToPopup(`Tarama tamamlandı! ${downloadQueue.length} video bulundu.`, 'success');
  
  // İndirmeleri başlat
  if (downloadQueue.length > 0) {
    startDownloads();
  } else {
    chrome.runtime.sendMessage({
      action: 'scanComplete',
      data: { totalDownloads: 0 }
    });
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

// İndirmeleri başlat
async function startDownloads() {
  if (isDownloading) return;
  
  isDownloading = true;
  sendLogToPopup(`${downloadQueue.length} video indiriliyor...`, 'info');
  updateProgress('Videolar indiriliyor...');
  
  // Chrome'un indirme limitlerine uygun olarak sırayla indir
  for (const item of downloadQueue) {
    try {
      await downloadVideo(item);
      downloadStats.downloadedCount++;
      updateProgress(`Video indiriliyor: ${downloadStats.downloadedCount}/${downloadStats.totalDownloads}`);
      sendLogToPopup(`İndirildi: ${item.filename}`, 'success');
      
      // Rate limiting
      await sleep(1000);
    } catch (error) {
      downloadStats.failed++;
      sendLogToPopup(`İndirme hatası (${item.filename}): ${error.message}`, 'error');
    }
  }
  
  isDownloading = false;
  sendLogToPopup(`İndirme tamamlandı! Başarılı: ${downloadStats.downloadedCount}, Başarısız: ${downloadStats.failed}`, 'success');
  
  chrome.runtime.sendMessage({
    action: 'scanComplete',
    data: { 
      totalDownloads: downloadStats.totalDownloads,
      successful: downloadStats.downloadedCount,
      failed: downloadStats.failed
    }
  });
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
      } else {
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
      }
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
