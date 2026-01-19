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

// URL tespiti ve bilgi alma
async function detectAndFetchInfo() {
  addLog('URL tespiti yapılıyor...', 'info');
  detectBtn.disabled = true;
  detectBtn.textContent = 'Tespit ediliyor...';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('pexels.com')) {
      addLog('Hata: Pexels.com sitesinde değilsiniz!', 'error');
      detectBtn.disabled = false;
      detectBtn.textContent = 'URL\'yi Tespit Et';
      return;
    }
    
    // Content script'e mesaj gönder
    chrome.tabs.sendMessage(tab.id, { action: 'getUserIdFromPage' }, async (response) => {
      if (chrome.runtime.lastError) {
        addLog('Sayfa bilgisi alınamadı. Sayfayı yenileyin ve tekrar deneyin.', 'error');
        detectBtn.disabled = false;
        detectBtn.textContent = 'URL\'yi Tespit Et';
        return;
      }
      
      if (response && response.userId) {
        // API URL'sini oluştur
        const locale = tab.url.match(/pexels\.com\/([a-z]{2}-[a-z]{2})/)?.[1] || 'tr-tr';
        apiBaseUrl = `https://www.pexels.com/${locale}/api/v3/users/${response.userId}/media/recent?type=videos&seo_tags=true`;
        apiUrlInput.value = apiBaseUrl + '&page=1&per_page=12';
        
        addLog(`Kullanıcı ID: ${response.userId}`, 'success');
        
        // İlk sayfayı fetch et
        await fetchFirstPage();
      } else {
        // Manuel olarak URL'den user ID çıkarmayı dene
        const match = tab.url.match(/pexels\.com\/[a-z-]+\/@([^\/]+)/);
        if (match) {
          addLog('Kullanıcı ID otomatik tespit edilemedi. Manuel API URL\'si gerekli.', 'error');
          addLog('Network sekmesinden API URL\'sini kopyalayıp yapıştırabilirsiniz.', 'info');
        } else {
          addLog('Bir kullanıcının medya sayfasında olmanız gerekiyor.', 'error');
        }
      }
      
      detectBtn.disabled = false;
      detectBtn.textContent = 'URL\'yi Tespit Et';
    });
  } catch (error) {
    addLog(`Hata: ${error.message}`, 'error');
    detectBtn.disabled = false;
    detectBtn.textContent = 'URL\'yi Tespit Et';
  }
}

// İlk sayfayı fetch et ve pagination bilgisini al
async function fetchFirstPage() {
  addLog('İlk sayfa bilgisi alınıyor...', 'info');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const testUrl = apiBaseUrl + '&page=1&per_page=12';
    
    chrome.tabs.sendMessage(tab.id, { action: 'fetchApi', url: testUrl }, (response) => {
      if (chrome.runtime.lastError) {
        addLog('API çağrısı başarısız. Sayfa yenilenerek tekrar deneyin.', 'error');
        return;
      }
      
      if (response.success) {
        const data = response.data;
        if (data.pagination) {
          totalPages = data.pagination.total_pages;
          totalResults = data.pagination.total_results;
          
          document.getElementById('totalPages').textContent = totalPages.toLocaleString('tr-TR');
          document.getElementById('totalVideos').textContent = totalResults.toLocaleString('tr-TR');
          document.getElementById('endPage').value = totalPages;
          document.getElementById('endPage').max = totalPages;
          
          infoSection.style.display = 'block';
          qualitySection.style.display = 'block';
          pageRangeSection.style.display = 'block';
          scanBtn.disabled = false;
          
          addLog(`Toplam ${totalPages} sayfa, ${totalResults} video bulundu!`, 'success');
        } else {
          addLog('Pagination bilgisi alınamadı.', 'error');
        }
      } else {
        addLog(`API hatası: ${response.error}`, 'error');
      }
    });
  } catch (error) {
    addLog(`Hata: ${error.message}`, 'error');
  }
}

// Tarama ve indirme işlemini başlat
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
  
  addLog(`Tarama başlıyor: ${startPage}-${endPage} sayfalar, kalite: ${quality}`, 'info');
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Background script'e tarama işlemini başlat
  chrome.runtime.sendMessage({
    action: 'startBulkDownload',
    data: {
      apiBaseUrl: apiBaseUrl,
      startPage: startPage,
      endPage: endPage,
      quality: quality,
      tabId: tab.id
    }
  });
}

// Background script'ten gelen mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateProgress') {
    updateProgress(request.data);
  } else if (request.action === 'addLog') {
    addLog(request.message, request.type);
  } else if (request.action === 'scanComplete') {
    onScanComplete(request.data);
  }
});

// Progress güncelle
function updateProgress(data) {
  const { scannedPages, totalPages, downloadedCount, totalDownloads, currentStatus } = data;
  
  document.getElementById('scannedPages').textContent = scannedPages;
  document.getElementById('totalPagesToScan').textContent = totalPages;
  document.getElementById('downloadedCount').textContent = downloadedCount;
  document.getElementById('totalDownloads').textContent = totalDownloads;
  document.getElementById('progressText').textContent = currentStatus;
  
  const scanProgress = (scannedPages / totalPages) * 50;
  const downloadProgress = totalDownloads > 0 ? (downloadedCount / totalDownloads) * 50 : 0;
  const totalProgress = scanProgress + downloadProgress;
  
  document.getElementById('progressFill').style.width = totalProgress + '%';
}

// Tarama tamamlandı
function onScanComplete(data) {
  isScanning = false;
  scanBtn.disabled = false;
  scanBtn.textContent = 'Tara ve İndir';
  
  addLog(`Tarama tamamlandı! ${data.totalDownloads} video indirme kuyruğuna eklendi.`, 'success');
  document.getElementById('progressText').textContent = 'Tamamlandı!';
}

// Log ekle
function addLog(message, type = 'info') {
  const logContent = document.getElementById('logContent');
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry ${type}`;
  
  const timestamp = new Date().toLocaleTimeString('tr-TR');
  logEntry.textContent = `[${timestamp}] ${message}`;
  
  logContent.appendChild(logEntry);
  logContent.scrollTop = logContent.scrollHeight;
}

// Log temizle
function clearLog() {
  document.getElementById('logContent').innerHTML = '';
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
  addLog('PexelBulker hazır. URL tespiti için butona tıklayın.', 'info');
});
