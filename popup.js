// Popup JavaScript

let apiBaseUrl = '';
let totalPages = 0;
let totalResults = 0;
let isScanning = false;
let currentLang = 'en';

// Initialize language
function initLanguage() {
  // Load saved language or use browser language
  chrome.storage.local.get(['language'], (result) => {
    if (result.language) {
      currentLang = result.language;
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        currentLang = browserLang;
      }
    }
    
    // Set language selector
    document.getElementById('langSelect').value = currentLang;
    
    // Apply translations
    applyTranslations();
  });
}

// Apply translations to page
function applyTranslations() {
  const lang = currentLang;
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      element.placeholder = translations[lang][key];
    }
  });
}

// Change language
function changeLanguage(lang) {
  currentLang = lang;
  chrome.storage.local.set({ language: lang });
  applyTranslations();
  
  // Re-add initial log with new language
  if (document.getElementById('logContent').children.length === 1) {
    clearLog();
    addLog(translations[lang].logReady, 'info');
  }
}

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
const langSelect = document.getElementById('langSelect');

// Event listeners
detectBtn.addEventListener('click', detectAndFetchInfo);
scanBtn.addEventListener('click', startScanning);
document.getElementById('clearLogBtn').addEventListener('click', clearLog);
allPagesCheckbox.addEventListener('change', (e) => {
  startPageInput.disabled = e.target.checked;
  endPageInput.disabled = e.target.checked;
});

// Initialize page range inputs state
startPageInput.disabled = allPagesCheckbox.checked;
endPageInput.disabled = allPagesCheckbox.checked;
langSelect.addEventListener('change', (e) => {
  changeLanguage(e.target.value);
});

// Detect URL and fetch info
async function detectAndFetchInfo() {
  addLog(translations[currentLang].logDetecting, 'info');
  detectBtn.disabled = true;
  detectBtn.textContent = translations[currentLang].detectingBtn;
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('pexels.com')) {
      addLog(translations[currentLang].logNotPexels, 'error');
      detectBtn.disabled = false;
      detectBtn.textContent = translations[currentLang].detectBtn;
      return;
    }
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'getUserIdFromPage' }, async (response) => {
      if (chrome.runtime.lastError) {
        addLog(translations[currentLang].logPageInfoFailed, 'error');
        detectBtn.disabled = false;
        detectBtn.textContent = translations[currentLang].detectBtn;
        return;
      }
      
      if (response && response.userId) {
        // Build API URL
        const locale = tab.url.match(/pexels\.com\/([a-z]{2}-[a-z]{2})/)?.[1] || 'en-us';
        apiBaseUrl = `https://www.pexels.com/${locale}/api/v3/users/${response.userId}/media/recent?type=videos&seo_tags=true`;
        apiUrlInput.value = apiBaseUrl + '&page=1&per_page=12';
        
        addLog(translations[currentLang].logUserIdFound.replace('{userId}', response.userId), 'success');
        
        // Fetch first page
        await fetchFirstPage();
      } else {
        // Try to extract user ID from URL manually
        const match = tab.url.match(/pexels\.com\/[a-z-]+\/@([^\/]+)/);
        if (match) {
          addLog(translations[currentLang].logUserIdFailed, 'error');
          addLog(translations[currentLang].logNetworkTab, 'info');
        } else {
          addLog(translations[currentLang].logUserPage, 'error');
        }
      }
      
      detectBtn.disabled = false;
      detectBtn.textContent = translations[currentLang].detectBtn;
    });
  } catch (error) {
    addLog(`Error: ${error.message}`, 'error');
    detectBtn.disabled = false;
    detectBtn.textContent = translations[currentLang].detectBtn;
  }
}

// Fetch first page and get pagination info
async function fetchFirstPage() {
  addLog(translations[currentLang].logFetchingFirst, 'info');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const testUrl = apiBaseUrl + '&page=1&per_page=12';
    
    chrome.tabs.sendMessage(tab.id, { action: 'fetchApi', url: testUrl }, (response) => {
      if (chrome.runtime.lastError) {
        addLog(translations[currentLang].logApiFailed, 'error');
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
          
          addLog(translations[currentLang].logFoundVideos
            .replace('{pages}', totalPages)
            .replace('{videos}', totalResults), 'success');
        } else {
          addLog(translations[currentLang].logPaginationFailed, 'error');
        }
      } else {
        addLog(translations[currentLang].logApiError.replace('{error}', response.error), 'error');
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
  
  addLog(translations[currentLang].logScanStarting
    .replace('{start}', startPage)
    .replace('{end}', endPage)
    .replace('{quality}', quality), 'info');
  
  // Hide form sections (collapsible)
  hideFormSections();
  
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
    // Process started, update buttons immediately
    setTimeout(() => {
      updateControlButtons(false, true);
    }, 100);
  });
}

// Hide form sections when scanning
function hideFormSections() {
  document.querySelector('.url-section').style.display = 'none';
  infoSection.style.display = 'none';
  qualitySection.style.display = 'none';
  pageRangeSection.style.display = 'none';
}

// Show form sections when completed/cancelled
function showFormSections() {
  document.querySelector('.url-section').style.display = 'block';
  infoSection.style.display = 'block';
  qualitySection.style.display = 'block';
  pageRangeSection.style.display = 'block';
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
      scanBtn.textContent = translations[currentLang].resumeBtn;
      scanBtn.disabled = false;
      scanBtn.onclick = resumeDownload;
    } else {
      scanBtn.textContent = translations[currentLang].pauseBtn;
      scanBtn.disabled = false;
      scanBtn.onclick = pauseDownload;
    }
    
    // Show cancel button
    if (!document.getElementById('cancelBtn')) {
      const cancelBtn = document.createElement('button');
      cancelBtn.id = 'cancelBtn';
      cancelBtn.className = 'btn btn-danger';
      cancelBtn.textContent = translations[currentLang].cancelBtn;
      cancelBtn.onclick = cancelDownload;
      scanBtn.parentElement.appendChild(cancelBtn);
    } else {
      // Update cancel button text if language changed
      document.getElementById('cancelBtn').textContent = translations[currentLang].cancelBtn;
    }
  } else {
    scanBtn.textContent = translations[currentLang].scanBtn;
    scanBtn.disabled = false;
    scanBtn.onclick = startScanning;
    
    // Remove cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
      cancelBtn.remove();
    }
    
    // Show form sections again
    showFormSections();
  }
}

// Pause download
function pauseDownload() {
  chrome.runtime.sendMessage({ action: 'pauseDownload' }, () => {
    addLog(translations[currentLang].logPaused, 'info');
    updateControlButtons(true, true);
  });
}

// Resume download
function resumeDownload() {
  chrome.runtime.sendMessage({ action: 'resumeDownload' }, () => {
    addLog(translations[currentLang].logResumed, 'success');
    updateControlButtons(false, true);
  });
}

// Cancel download
function cancelDownload() {
  if (confirm(translations[currentLang].logCancelConfirm)) {
    chrome.runtime.sendMessage({ action: 'cancelDownload' }, () => {
      addLog(translations[currentLang].logCancelled, 'info');
      isScanning = false;
      updateControlButtons(false, false);
      showFormSections();
    });
  }
}

// Scan complete
function onScanComplete(data) {
  isScanning = false;
  scanBtn.disabled = false;
  scanBtn.textContent = translations[currentLang].scanBtn;
  scanBtn.onclick = startScanning;
  
  // Remove cancel button
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.remove();
  }
  
  addLog(translations[currentLang].logScanComplete.replace('{count}', data.totalDownloads), 'success');
  document.getElementById('progressText').textContent = translations[currentLang].progressCompleted;
  
  // Show form sections again
  showFormSections();
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
  // Initialize language first
  initLanguage();
  
  // Wait a bit for language to load, then add initial log
  setTimeout(() => {
    addLog(translations[currentLang].logReady, 'info');
  }, 100);
  
  // Restore state
  await restoreState();
});

// Restore state
async function restoreState() {
  chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
    if (response && response.stats && response.stats.isActive) {
      // Active process detected
      addLog(translations[currentLang].logActiveProcess, 'info');
      
      progressSection.style.display = 'block';
      logSection.style.display = 'block';
      
      // Hide form sections since download is active
      hideFormSections();
      
      // Update progress
      updateProgress(response.stats);
      
      // Update buttons
      updateControlButtons(response.isPaused, response.isDownloading);
    }
  });
}
