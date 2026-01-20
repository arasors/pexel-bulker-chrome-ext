// Popup JavaScript

let apiBaseUrl = '';
let totalPages = 0;
let totalResults = 0;
let isScanning = false;
let currentLang = 'en';

// Initialize language
function initLanguage() {
  // Check if translations is loaded
  if (typeof translations === 'undefined') {
    console.error('Translations not loaded!');
    currentLang = 'en';
    return;
  }
  
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
    if (langSelect) {
      langSelect.value = currentLang;
    }
    
    // Apply translations
    applyTranslations();
  });
}

// Apply translations to page
function applyTranslations() {
  if (typeof translations === 'undefined') {
    console.error('Translations not loaded!');
    return;
  }
  
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
  
  // Update titles (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    if (translations[lang] && translations[lang][key]) {
      element.title = translations[lang][key];
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

// DOM elementleri (will be initialized in DOMContentLoaded)
let apiUrlInput;
let detectBtn;
let infoSection;
let qualitySection;
let pageRangeSection;
let folderSection;
let folderPathInput;
let changeFolderBtn;
let scanBtn;
let progressSection;
let logSection;
let allPagesCheckbox;
let startPageInput;
let endPageInput;
let langSelect;
let historySection;
let historyList;
let toggleHistoryBtn;
let openInTabBtn;

// Download folder setting
let downloadFolder = 'PexelBulker';

// Download history (max 7 days)
const MAX_HISTORY_DAYS = 7;

// Detect URL and fetch info
async function detectAndFetchInfo() {
  console.log('detectAndFetchInfo called');
  
  // Check if translations is loaded
  if (typeof translations === 'undefined') {
    console.error('Translations not loaded!');
    alert('Extension not fully loaded. Please try again.');
    return;
  }
  
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
          if (folderSection) folderSection.style.display = 'block';
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
      downloadFolder: downloadFolder,
      tabId: tab.id
    }
  }, () => {
    // Process started, update buttons immediately and show them
    isScanning = true;
    updateControlButtons(false, true);
  });
}

// Hide form sections when scanning
function hideFormSections() {
  document.querySelector('.url-section').style.display = 'none';
  infoSection.style.display = 'none';
  qualitySection.style.display = 'none';
  pageRangeSection.style.display = 'none';
  if (folderSection) folderSection.style.display = 'none';
}

// Show form sections when completed/cancelled
function showFormSections() {
  document.querySelector('.url-section').style.display = 'block';
  infoSection.style.display = 'block';
  qualitySection.style.display = 'block';
  pageRangeSection.style.display = 'block';
  if (folderSection) folderSection.style.display = 'block';
}

// Change folder name
function changeFolderName() {
  const currentLang = localStorage.getItem('pexelBulkerLang') || 'en';
  const prompts = {
    en: 'Enter folder name (files will be saved to Downloads/[folder]/):',
    tr: 'Klasör adını girin (dosyalar İndirilenler/[klasör]/ konumuna kaydedilecek):',
    es: 'Ingrese el nombre de la carpeta (los archivos se guardarán en Descargas/[carpeta]/):',
    fr: 'Entrez le nom du dossier (les fichiers seront enregistrés dans Téléchargements/[dossier]/):',
    zh: '输入文件夹名称（文件将保存到 下载/[文件夹]/）:'
  };
  
  const newFolder = prompt(prompts[currentLang] || prompts.en, downloadFolder);
  
  if (newFolder && newFolder.trim()) {
    // Sanitize folder name (remove invalid characters)
    const sanitized = newFolder.trim().replace(/[<>:"/\\|?*]/g, '-');
    downloadFolder = sanitized;
    
    // Save to storage
    chrome.storage.local.set({ downloadFolder: sanitized });
    
    // Update input
    if (folderPathInput) {
      folderPathInput.value = sanitized;
    }
    
    addLog(`Download folder changed to: ${sanitized}`, 'success');
  }
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
function updateControlButtons(isPaused, isActive) {
  const scanBtnText = document.getElementById('scanBtnText');
  
  // isActive = tarama veya indirme devam ediyor
  if (isActive || isScanning) {
    if (isPaused) {
      scanBtn.textContent = translations[currentLang].resumeBtn;
      scanBtn.disabled = false;
      scanBtn.onclick = resumeDownload;
    } else {
      scanBtn.textContent = translations[currentLang].pauseBtn;
      scanBtn.disabled = false;
      scanBtn.onclick = pauseDownload;
    }
    
    // Show cancel button - ALWAYS show when active
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
    chrome.runtime.sendMessage({ action: 'cancelDownload' }, async () => {
      addLog(translations[currentLang].logCancelled, 'info');
      isScanning = false;
      updateControlButtons(false, false);
      showFormSections();
      
      // Save to history
      await saveToHistory('cancelled');
      await loadDownloadHistory();
    });
  }
}

// Scan complete
async function onScanComplete(data) {
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
  
  // Save to history if completed
  if (data.successful > 0) {
    await saveToHistory('completed');
    await loadDownloadHistory();
  }
}

// Add log
function addLog(message, type = 'info') {
  const logContent = document.getElementById('logContent');
  if (!logContent) {
    console.log(`[LOG] ${message}`);
    return;
  }
  
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
  // Check if translations is loaded
  if (typeof translations === 'undefined') {
    console.error('CRITICAL: translations.js not loaded!');
    alert('Extension failed to load properly. Please reload the extension.');
    return;
  }
  
  console.log('PexelBulker popup loading...');
  
  // Initialize DOM elements first
  apiUrlInput = document.getElementById('apiUrl');
  detectBtn = document.getElementById('detectBtn');
  infoSection = document.getElementById('infoSection');
  qualitySection = document.getElementById('qualitySection');
  pageRangeSection = document.getElementById('pageRangeSection');
  folderSection = document.getElementById('folderSection');
  folderPathInput = document.getElementById('folderPath');
  changeFolderBtn = document.getElementById('changeFolderBtn');
  scanBtn = document.getElementById('scanBtn');
  progressSection = document.getElementById('progressSection');
  logSection = document.getElementById('logSection');
  allPagesCheckbox = document.getElementById('allPages');
  startPageInput = document.getElementById('startPage');
  endPageInput = document.getElementById('endPage');
  langSelect = document.getElementById('langSelect');
  
  console.log('DOM elements initialized');
  
  // Load saved folder setting
  chrome.storage.local.get(['downloadFolder'], (result) => {
    if (result.downloadFolder) {
      downloadFolder = result.downloadFolder;
      if (folderPathInput) {
        folderPathInput.value = downloadFolder;
      }
    }
  });
  
  // Add event listeners
  if (detectBtn) {
    detectBtn.addEventListener('click', detectAndFetchInfo);
    console.log('Detect button listener added');
  }
  if (scanBtn) {
    scanBtn.addEventListener('click', startScanning);
  }
  
  const clearLogBtn = document.getElementById('clearLogBtn');
  if (clearLogBtn) {
    clearLogBtn.addEventListener('click', clearLog);
  }
  
  if (allPagesCheckbox) {
    allPagesCheckbox.addEventListener('change', (e) => {
      startPageInput.disabled = e.target.checked;
      endPageInput.disabled = e.target.checked;
    });
  }
  
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }
  
  if (changeFolderBtn) {
    changeFolderBtn.addEventListener('click', changeFolderName);
  }
  
  historySection = document.getElementById('historySection');
  historyList = document.getElementById('historyList');
  toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
  openInTabBtn = document.getElementById('openInTabBtn');
  
  if (toggleHistoryBtn) {
    toggleHistoryBtn.addEventListener('click', toggleHistory);
  }
  
  if (openInTabBtn) {
    openInTabBtn.addEventListener('click', openInNewTab);
  }
  
  // Load and display history
  await loadDownloadHistory();
  
  // Scroll to bottom after a short delay (so user can see the detect button)
  setTimeout(() => {
    scrollToBottom();
  }, 300);
  
  // Initialize page range inputs state
  if (startPageInput && endPageInput && allPagesCheckbox) {
    startPageInput.disabled = allPagesCheckbox.checked;
    endPageInput.disabled = allPagesCheckbox.checked;
  }
  
  // Initialize language
  initLanguage();
  
  // Wait a bit for language to load, then add initial log
  setTimeout(() => {
    if (typeof translations !== 'undefined' && translations[currentLang]) {
      addLog(translations[currentLang].logReady, 'info');
    } else {
      addLog('PexelBulker ready. Click the button to detect URL.', 'info');
    }
  }, 100);
  
  // Restore state
  await restoreState();
  
  console.log('PexelBulker popup loaded successfully');
});

// Download History Management

// Save current download to history
async function saveToHistory(status) {
  chrome.runtime.sendMessage({ action: 'getState' }, async (response) => {
    if (!response || !response.stats) return;
    
    const historyItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      apiBaseUrl: apiBaseUrl,
      startPage: parseInt(startPageInput?.value) || 1,
      endPage: parseInt(endPageInput?.value) || totalPages,
      quality: document.querySelector('input[name="quality"]:checked')?.value || 'uhd',
      folder: downloadFolder,
      status: status, // 'completed', 'cancelled', 'paused'
      stats: {
        scannedPages: response.stats.scannedPages,
        totalPages: response.stats.totalPages,
        downloadedCount: response.stats.downloadedCount,
        totalDownloads: response.stats.totalDownloads
      }
    };
    
    // Load existing history
    const result = await chrome.storage.local.get(['downloadHistory']);
    let history = result.downloadHistory || [];
    
    // Clean old history (older than 7 days)
    const sevenDaysAgo = Date.now() - (MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000);
    history = history.filter(item => new Date(item.date).getTime() > sevenDaysAgo);
    
    // Add new item
    history.unshift(historyItem);
    
    // Keep max 20 items
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    // Save
    await chrome.storage.local.set({ downloadHistory: history });
  });
}

// Load and display download history
async function loadDownloadHistory() {
  const result = await chrome.storage.local.get(['downloadHistory']);
  let history = result.downloadHistory || [];
  
  // Clean old history
  const sevenDaysAgo = Date.now() - (MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000);
  history = history.filter(item => new Date(item.date).getTime() > sevenDaysAgo);
  
  // Save cleaned history
  if (history.length !== result.downloadHistory?.length) {
    await chrome.storage.local.set({ downloadHistory: history });
  }
  
  // Show history section if there are items
  if (history.length > 0 && historySection) {
    historySection.style.display = 'block';
  }
  
  // Display history
  displayHistory(history);
}

// Display history items
function displayHistory(history) {
  if (!historyList) return;
  
  if (history.length === 0) {
    historyList.innerHTML = `<div class="history-empty">${translations[currentLang].historyEmpty}</div>`;
    return;
  }
  
  historyList.innerHTML = '';
  
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    
    const date = new Date(item.date);
    const timeAgo = getTimeAgo(date);
    
    const percent = item.stats.totalDownloads > 0 
      ? Math.round((item.stats.downloadedCount / item.stats.totalDownloads) * 100)
      : 0;
    
    const statusText = item.status === 'completed' 
      ? translations[currentLang].historyItemCompleted
      : translations[currentLang].historyItemCancelled;
    
    div.innerHTML = `
      <div class="history-item-header">
        <span class="history-item-title">${statusText}</span>
        <span class="history-item-date">${timeAgo}</span>
      </div>
      <div class="history-item-info">
        ${translations[currentLang].historyItemPages
          .replace('{start}', item.startPage)
          .replace('{end}', item.endPage)}
        • ${translations[currentLang].historyItemQuality.replace('{quality}', item.quality.toUpperCase())}
      </div>
      <div class="history-item-progress">
        ${translations[currentLang].historyItemProgress
          .replace('{downloaded}', item.stats.downloadedCount)
          .replace('{total}', item.stats.totalDownloads)
          .replace('{percent}', percent)}
      </div>
      <div class="history-item-actions">
        ${item.status !== 'completed' && percent < 100 ? `
          <button class="btn-resume-history" onclick="resumeFromHistory(${item.id})">
            ${translations[currentLang].resumeHistory}
          </button>
        ` : ''}
        <button class="btn-delete-history" onclick="deleteFromHistory(${item.id})">
          ${translations[currentLang].deleteHistory}
        </button>
      </div>
    `;
    
    historyList.appendChild(div);
  });
}

// Toggle history visibility
function toggleHistory() {
  if (!historyList || !toggleHistoryBtn) return;
  
  if (historyList.style.display === 'none') {
    historyList.style.display = 'block';
    toggleHistoryBtn.textContent = translations[currentLang].hideHistory;
  } else {
    historyList.style.display = 'none';
    toggleHistoryBtn.textContent = translations[currentLang].showHistory;
  }
}

// Resume download from history
window.resumeFromHistory = async function(itemId) {
  const result = await chrome.storage.local.get(['downloadHistory']);
  const history = result.downloadHistory || [];
  const item = history.find(h => h.id === itemId);
  
  if (!item) return;
  
  // Restore settings
  apiBaseUrl = item.apiBaseUrl;
  downloadFolder = item.folder;
  
  if (startPageInput) startPageInput.value = item.startPage;
  if (endPageInput) endPageInput.value = item.endPage;
  if (folderPathInput) folderPathInput.value = item.folder;
  
  // Set quality
  const qualityRadio = document.querySelector(`input[name="quality"][value="${item.quality}"]`);
  if (qualityRadio) qualityRadio.checked = true;
  
  addLog(`Resuming download: Pages ${item.startPage}-${item.endPage}`, 'info');
  
  // Start scanning
  await startScanning();
}

// Delete item from history
window.deleteFromHistory = async function(itemId) {
  const result = await chrome.storage.local.get(['downloadHistory']);
  let history = result.downloadHistory || [];
  
  history = history.filter(h => h.id !== itemId);
  
  await chrome.storage.local.set({ downloadHistory: history });
  await loadDownloadHistory();
  
  addLog('History item deleted', 'info');
}

// Get time ago string
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Open extension in new tab
function openInNewTab() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('popup.html')
  });
  
  // Close the popup
  window.close();
}

// Scroll to bottom of container
function scrollToBottom() {
  const container = document.querySelector('.container');
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }
}

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
