// Popup JavaScript

let apiBaseUrl = '';
let totalPages = 0;
let totalResults = 0;
let isScanning = false;

// DOM elementleri
const apiUrlInput = document.getElementById('apiUrl');
const detectBtn = document.getElementById('detectBtn');
const infoSection = document.getElementById('infoSection');
const qualitySection = document.getElementById('qualitySection');
const pageRangeSection = document.getElementById('pageRangeSection');
const scanBtn = document.getElementById('scanBtn');
const progressSection = document.getElementById('progressSection');
const logSection = document.getElementById('logSection');
const allPagesCheckbox = document.getElementById('allPages');
const startPageInput = document.getElementById('startPage');
const endPageInput = document.getElementById('endPage');

// Event listeners
detectBtn.addEventListener('click', detectAndFetchInfo);
scanBtn.addEventListener('click', startScanning);
document.getElementById('clearLogBtn').addEventListener('click', clearLog);
allPagesCheckbox.addEventListener('change', (e) => {
  startPageInput.disabled = e.target.checked;
  endPageInput.disabled = e.target.checked;
});

// Detect URL and fetch info
async function detectAndFetchInfo() {
  addLog('Detecting URL...', 'info');
  detectBtn.disabled = true;
  detectBtn.textContent = 'Detecting...';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('pexels.com')) {
      addLog('Error: You are not on Pexels.com!', 'error');
      detectBtn.disabled = false;
      detectBtn.textContent = 'Detect URL';
      return;
    }
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'getUserIdFromPage' }, async (response) => {
      if (chrome.runtime.lastError) {
        addLog('Failed to get page info. Please refresh the page and try again.', 'error');
        detectBtn.disabled = false;
        detectBtn.textContent = 'Detect URL';
        return;
      }
      
      if (response && response.userId) {
        // Build API URL
        const locale = tab.url.match(/pexels\.com\/([a-z]{2}-[a-z]{2})/)?.[1] || 'en-us';
        apiBaseUrl = `https://www.pexels.com/${locale}/api/v3/users/${response.userId}/media/recent?type=videos&seo_tags=true`;
        apiUrlInput.value = apiBaseUrl + '&page=1&per_page=12';
        
        addLog(`User ID: ${response.userId}`, 'success');
        
        // Fetch first page
        await fetchFirstPage();
      } else {
        // Try to extract user ID from URL manually
        const match = tab.url.match(/pexels\.com\/[a-z-]+\/@([^\/]+)/);
        if (match) {
          addLog('User ID could not be detected automatically. Manual API URL required.', 'error');
          addLog('You can copy the API URL from the Network tab.', 'info');
        } else {
          addLog('You must be on a user\'s media page.', 'error');
        }
      }
      
      detectBtn.disabled = false;
      detectBtn.textContent = 'Detect URL';
    });
  } catch (error) {
    addLog(`Error: ${error.message}`, 'error');
    detectBtn.disabled = false;
    detectBtn.textContent = 'Detect URL';
  }
}

// Fetch first page and get pagination info
async function fetchFirstPage() {
  addLog('Fetching first page info...', 'info');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const testUrl = apiBaseUrl + '&page=1&per_page=12';
    
    chrome.tabs.sendMessage(tab.id, { action: 'fetchApi', url: testUrl }, (response) => {
      if (chrome.runtime.lastError) {
        addLog('API call failed. Please refresh the page and try again.', 'error');
        return;
      }
      
      if (response.success) {
        const data = response.data;
        if (data.pagination) {
          totalPages = data.pagination.total_pages;
          totalResults = data.pagination.total_results;
          
          document.getElementById('totalPages').textContent = totalPages.toLocaleString('en-US');
          document.getElementById('totalVideos').textContent = totalResults.toLocaleString('en-US');
          document.getElementById('endPage').value = totalPages;
          document.getElementById('endPage').max = totalPages;
          
          infoSection.style.display = 'block';
          qualitySection.style.display = 'block';
          pageRangeSection.style.display = 'block';
          scanBtn.disabled = false;
          
          addLog(`Found ${totalPages} pages with ${totalResults} videos!`, 'success');
        } else {
          addLog('Could not get pagination info.', 'error');
        }
      } else {
        addLog(`API error: ${response.error}`, 'error');
      }
    });
  } catch (error) {
    addLog(`Error: ${error.message}`, 'error');
  }
}

// Start scanning and downloading
async function startScanning() {
  if (isScanning) return;
  
  isScanning = true;
  scanBtn.disabled = true;
  progressSection.style.display = 'block';
  logSection.style.display = 'block';
  
  const quality = document.querySelector('input[name="quality"]:checked').value;
  const allPages = allPagesCheckbox.checked;
  const startPage = allPages ? 1 : parseInt(startPageInput.value) || 1;
  const endPage = allPages ? totalPages : parseInt(endPageInput.value) || totalPages;
  
  addLog(`Starting scan: pages ${startPage}-${endPage}, quality: ${quality}`, 'info');
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Start bulk download in background script
  chrome.runtime.sendMessage({
    action: 'startBulkDownload',
    data: {
      apiBaseUrl: apiBaseUrl,
      startPage: startPage,
      endPage: endPage,
      quality: quality,
      tabId: tab.id
    }
  }, () => {
    // Process started, update buttons
    updateControlButtons(false, true);
  });
}

// Background script'ten gelen mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateProgress') {
    updateProgress(request.data);
    // Aktif işlem varsa butonları güncelle
    chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
      if (response) {
        updateControlButtons(response.isPaused, response.isDownloading);
      }
    });
  } else if (request.action === 'addLog') {
    addLog(request.message, request.type);
  } else if (request.action === 'scanComplete') {
    onScanComplete(request.data);
  }
});

// Progress güncelle
function updateProgress(data) {
  const { scannedPages, totalPages, downloadedCount, totalDownloads, currentStatus } = data;
  
  document.getElementById('scannedPages').textContent = scannedPages || 0;
  document.getElementById('totalPagesToScan').textContent = totalPages || 0;
  document.getElementById('downloadedCount').textContent = downloadedCount || 0;
  document.getElementById('totalDownloads').textContent = totalDownloads || 0;
  
  if (currentStatus) {
    document.getElementById('progressText').textContent = currentStatus;
  }
  
  if (totalPages > 0) {
    const scanProgress = (scannedPages / totalPages) * 50;
    const downloadProgress = totalDownloads > 0 ? (downloadedCount / totalDownloads) * 50 : 0;
    const totalProgress = scanProgress + downloadProgress;
    
    document.getElementById('progressFill').style.width = totalProgress + '%';
  }
}

// Update control buttons
function updateControlButtons(isPaused, isDownloading) {
  const scanBtnText = document.getElementById('scanBtnText');
  
  if (isDownloading) {
    if (isPaused) {
      scanBtn.textContent = '▶ Resume';
      scanBtn.disabled = false;
      scanBtn.onclick = resumeDownload;
    } else {
      scanBtn.textContent = '⏸ Pause';
      scanBtn.disabled = false;
      scanBtn.onclick = pauseDownload;
    }
    
    // Show cancel button
    if (!document.getElementById('cancelBtn')) {
      const cancelBtn = document.createElement('button');
      cancelBtn.id = 'cancelBtn';
      cancelBtn.className = 'btn btn-danger';
      cancelBtn.textContent = '✕ Cancel';
      cancelBtn.onclick = cancelDownload;
      scanBtn.parentElement.appendChild(cancelBtn);
    }
  } else {
    scanBtn.textContent = 'Scan & Download';
    scanBtn.onclick = startScanning;
    
    // Remove cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
      cancelBtn.remove();
    }
  }
}

// Pause download
function pauseDownload() {
  chrome.runtime.sendMessage({ action: 'pauseDownload' }, () => {
    addLog('Download paused.', 'info');
    updateControlButtons(true, true);
  });
}

// Resume download
function resumeDownload() {
  chrome.runtime.sendMessage({ action: 'resumeDownload' }, () => {
    addLog('Download resumed...', 'success');
    updateControlButtons(false, true);
  });
}

// Cancel download
function cancelDownload() {
  if (confirm('Are you sure you want to cancel the download?')) {
    chrome.runtime.sendMessage({ action: 'cancelDownload' }, () => {
      addLog('Download cancelled.', 'info');
      isScanning = false;
      updateControlButtons(false, false);
    });
  }
}

// Scan complete
function onScanComplete(data) {
  isScanning = false;
  scanBtn.disabled = false;
  scanBtn.textContent = 'Scan & Download';
  
  addLog(`Scan complete! ${data.totalDownloads} videos added to download queue.`, 'success');
  document.getElementById('progressText').textContent = 'Completed!';
}

// Add log
function addLog(message, type = 'info') {
  const logContent = document.getElementById('logContent');
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry ${type}`;
  
  const timestamp = new Date().toLocaleTimeString('en-US');
  logEntry.textContent = `[${timestamp}] ${message}`;
  
  logContent.appendChild(logEntry);
  logContent.scrollTop = logContent.scrollHeight;
}

// Log temizle
function clearLog() {
  document.getElementById('logContent').innerHTML = '';
}

// When page loads
document.addEventListener('DOMContentLoaded', async () => {
  addLog('PexelBulker ready. Click the button to detect URL.', 'info');
  
  // Restore state
  await restoreState();
});

// Restore state
async function restoreState() {
  chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
    if (response && response.stats && response.stats.isActive) {
      // Active process detected
      addLog('Active process detected.', 'info');
      
      progressSection.style.display = 'block';
      logSection.style.display = 'block';
      
      // Update progress
      updateProgress(response.stats);
      
      // Update buttons
      updateControlButtons(response.isPaused, response.isDownloading);
    }
  });
}
