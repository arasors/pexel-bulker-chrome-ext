// Content script - Pexels sayfasında çalışır ve sayfa bilgilerini toplar

// API URL'sini tespit et
function detectApiUrl() {
  const currentUrl = window.location.href;
  
  // User media sayfası pattern'ini kontrol et
  // Örnek: https://www.pexels.com/tr-tr/@cottonbro/videos/
  const userMediaMatch = currentUrl.match(/pexels\.com\/([a-z]{2}-[a-z]{2})\/@([^\/]+)\/(videos|photos)/);
  
  if (userMediaMatch) {
    const locale = userMediaMatch[1];
    const username = userMediaMatch[2];
    const mediaType = userMediaMatch[3];
    
    // Kullanıcı ID'sini bulmak için sayfadaki data'yı kontrol et
    // Alternatif olarak, bir API çağrısı yaparak user ID'yi alabiliriz
    return {
      detected: true,
      locale: locale,
      username: username,
      mediaType: mediaType,
      message: `Kullanıcı sayfası tespit edildi: ${username} (${mediaType})`
    };
  }
  
  return {
    detected: false,
    message: 'Pexels kullanıcı medya sayfasında değilsiniz'
  };
}

// Cookie'leri al
async function getCookies() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getCookies' }, (response) => {
      resolve(response);
    });
  });
}

// API isteği yap (sayfa bağlamından, cookie ve header'larla)
async function fetchApiData(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // Cookie'leri dahil et
      mode: 'cors',
      headers: {
        'Accept': '*/*',
        'Accept-Language': navigator.language || 'tr,en-US;q=0.9,en;q=0.8',
        'Content-Type': 'application/json',
        'Secret-Key': 'H2jk9uKnhRmL6WPwh89zBezWvr',
        'X-Client-Type': 'react',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      },
      referrer: window.location.href
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Mesaj dinleyici
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'detectUrl') {
    const result = detectApiUrl();
    sendResponse(result);
  } else if (request.action === 'fetchApi') {
    fetchApiData(request.url).then(sendResponse);
    return true; // Async response için
  } else if (request.action === 'getUserIdFromPage') {
    // Sayfadan user ID'yi çıkarmayı dene
    // Pexels'in sayfa yapısına göre user ID'yi bulma
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    let userId = null;
    
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        if (data.author && data.author.url) {
          // URL'den user ID'yi çıkarmayı dene
          const match = data.author.url.match(/\/users\/(\d+)/);
          if (match) {
            userId = match[1];
          }
        }
      } catch (e) {
        // JSON parse hatası, devam et
      }
    });
    
    // Alternatif: API çağrılarını izleyerek user ID'yi bul
    if (!userId) {
      // Sayfa içinde yapılan fetch isteklerini yakalayabiliriz
      // Ancak bu daha karmaşık, şimdilik URL pattern kullanacağız
      const apiCalls = window.performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('/api/v3/users/'));
      
      if (apiCalls.length > 0) {
        const match = apiCalls[0].name.match(/\/users\/(\d+)/);
        if (match) {
          userId = match[1];
        }
      }
    }
    
    sendResponse({ userId: userId });
  }
  
  return true;
});

// Notify user when page loads
console.log('PexelBulker extension is active');
