// PexelBulker Translations

const translations = {
  en: {
    // Header
    title: "PexelBulker",
    subtitle: "Bulk Video Downloader for Pexels",
    
    // URL Section
    apiUrlLabel: "API URL:",
    apiUrlPlaceholder: "https://www.pexels.com/en-us/api/v3/users/...",
    detectBtn: "Detect URL",
    detectingBtn: "Detecting...",
    
    // Info Section
    totalPages: "Total Pages:",
    totalVideos: "Total Videos:",
    
    // Quality Section
    videoQuality: "Video Quality:",
    qualityUHD: "UHD (Highest)",
    qualityHD: "HD",
    qualitySD: "SD",
    qualityAll: "All (Best Available)",
    
    // Page Range Section
    pageRange: "Page Range:",
    pageStart: "Start",
    pageEnd: "End",
    allPages: "Download all pages",
    
    // Folder Section
    downloadFolder: "Download Folder:",
    folderPlaceholder: "PexelBulker",
    changeFolder: "Change",
    folderInfo: "Files will be saved to Downloads/[folder]/",
    
    // Action Buttons
    scanBtn: "Scan & Download",
    pauseBtn: "⏸ Pause",
    resumeBtn: "▶ Resume",
    cancelBtn: "✕ Cancel",
    
    // Progress Section
    progressPreparing: "Preparing...",
    progressPaused: "Paused",
    progressCancelled: "Cancelled",
    progressCompleted: "Completed!",
    pagesScanned: "pages scanned",
    videosDownloading: "videos downloading",
    
    // Log Section
    activityLog: "Activity Log",
    clearLog: "Clear",
    
    // Footer
    footerText: "Use while browsing Pexels",
    
    // Log Messages
    logReady: "PexelBulker ready. Click the button to detect URL.",
    logDetecting: "Detecting URL...",
    logNotPexels: "Error: You are not on Pexels.com!",
    logPageInfoFailed: "Failed to get page info. Please refresh the page and try again.",
    logUserIdFound: "User ID: {userId}",
    logUserIdFailed: "User ID could not be detected automatically. Manual API URL required.",
    logNetworkTab: "You can copy the API URL from the Network tab.",
    logUserPage: "You must be on a user's media page.",
    logFetchingFirst: "Fetching first page info...",
    logApiFailed: "API call failed. Please refresh the page and try again.",
    logApiError: "API error: {error}",
    logPaginationFailed: "Could not get pagination info.",
    logFoundVideos: "Found {pages} pages with {videos} videos!",
    logScanStarting: "Starting scan: pages {start}-{end}, quality: {quality}",
    logActiveProcess: "Active process detected.",
    logPaused: "Download paused.",
    logResumed: "Download resumed...",
    logCancelled: "Download cancelled.",
    logCancelConfirm: "Are you sure you want to cancel the download?",
    logScanComplete: "Scan complete! {count} videos added to download queue.",
    
    // Language
    language: "Language:",
    languageName: "English"
  },
  
  tr: {
    // Header
    title: "PexelBulker",
    subtitle: "Pexels Toplu Video İndirici",
    
    // URL Section
    apiUrlLabel: "API URL'si:",
    apiUrlPlaceholder: "https://www.pexels.com/tr-tr/api/v3/users/...",
    detectBtn: "URL'yi Tespit Et",
    detectingBtn: "Tespit ediliyor...",
    
    // Info Section
    totalPages: "Toplam Sayfa:",
    totalVideos: "Toplam Video:",
    
    // Quality Section
    videoQuality: "Video Kalitesi:",
    qualityUHD: "UHD (En Yüksek)",
    qualityHD: "HD",
    qualitySD: "SD",
    qualityAll: "Hepsi (Mevcut en iyi)",
    
    // Page Range Section
    pageRange: "Sayfa Aralığı:",
    pageStart: "Başlangıç",
    pageEnd: "Bitiş",
    allPages: "Tüm sayfaları indir",
    
    // Folder Section
    downloadFolder: "İndirme Klasörü:",
    folderPlaceholder: "PexelBulker",
    changeFolder: "Değiştir",
    folderInfo: "Dosyalar İndirilenler/[klasör]/ konumuna kaydedilecek",
    
    // Action Buttons
    scanBtn: "Tara ve İndir",
    pauseBtn: "⏸ Duraklat",
    resumeBtn: "▶ Devam Et",
    cancelBtn: "✕ İptal Et",
    
    // Progress Section
    progressPreparing: "Hazırlanıyor...",
    progressPaused: "Duraklatıldı",
    progressCancelled: "İptal edildi",
    progressCompleted: "Tamamlandı!",
    pagesScanned: "sayfa tarandı",
    videosDownloading: "video indiriliyor",
    
    // Log Section
    activityLog: "İşlem Günlüğü",
    clearLog: "Temizle",
    
    // Footer
    footerText: "Pexels'de gezinirken kullanın",
    
    // Log Messages
    logReady: "PexelBulker hazır. URL tespiti için butona tıklayın.",
    logDetecting: "URL tespiti yapılıyor...",
    logNotPexels: "Hata: Pexels.com sitesinde değilsiniz!",
    logPageInfoFailed: "Sayfa bilgisi alınamadı. Sayfayı yenileyin ve tekrar deneyin.",
    logUserIdFound: "Kullanıcı ID: {userId}",
    logUserIdFailed: "Kullanıcı ID otomatik tespit edilemedi. Manuel API URL'si gerekli.",
    logNetworkTab: "Network sekmesinden API URL'sini kopyalayıp yapıştırabilirsiniz.",
    logUserPage: "Bir kullanıcının medya sayfasında olmanız gerekiyor.",
    logFetchingFirst: "İlk sayfa bilgisi alınıyor...",
    logApiFailed: "API çağrısı başarısız. Sayfayı yenileyin ve tekrar deneyin.",
    logApiError: "API hatası: {error}",
    logPaginationFailed: "Pagination bilgisi alınamadı.",
    logFoundVideos: "Toplam {pages} sayfa, {videos} video bulundu!",
    logScanStarting: "Tarama başlıyor: {start}-{end} sayfalar, kalite: {quality}",
    logActiveProcess: "Devam eden işlem tespit edildi.",
    logPaused: "İndirme duraklatıldı.",
    logResumed: "İndirme devam ediyor...",
    logCancelled: "İndirme iptal edildi.",
    logCancelConfirm: "İndirmeyi iptal etmek istediğinize emin misiniz?",
    logScanComplete: "Tarama tamamlandı! {count} video indirme kuyruğuna eklendi.",
    
    // Language
    language: "Dil:",
    languageName: "Türkçe"
  },
  
  es: {
    // Header
    title: "PexelBulker",
    subtitle: "Descargador masivo de videos para Pexels",
    
    // URL Section
    apiUrlLabel: "URL de API:",
    apiUrlPlaceholder: "https://www.pexels.com/es-es/api/v3/users/...",
    detectBtn: "Detectar URL",
    detectingBtn: "Detectando...",
    
    // Info Section
    totalPages: "Total de páginas:",
    totalVideos: "Total de videos:",
    
    // Quality Section
    videoQuality: "Calidad de video:",
    qualityUHD: "UHD (Máxima)",
    qualityHD: "HD",
    qualitySD: "SD",
    qualityAll: "Todo (Mejor disponible)",
    
    // Page Range Section
    pageRange: "Rango de páginas:",
    pageStart: "Inicio",
    pageEnd: "Fin",
    allPages: "Descargar todas las páginas",
    
    // Folder Section
    downloadFolder: "Carpeta de descarga:",
    folderPlaceholder: "PexelBulker",
    changeFolder: "Cambiar",
    folderInfo: "Los archivos se guardarán en Descargas/[carpeta]/",
    
    // Action Buttons
    scanBtn: "Escanear y Descargar",
    pauseBtn: "⏸ Pausar",
    resumeBtn: "▶ Reanudar",
    cancelBtn: "✕ Cancelar",
    
    // Progress Section
    progressPreparing: "Preparando...",
    progressPaused: "Pausado",
    progressCancelled: "Cancelado",
    progressCompleted: "¡Completado!",
    pagesScanned: "páginas escaneadas",
    videosDownloading: "videos descargando",
    
    // Log Section
    activityLog: "Registro de actividad",
    clearLog: "Limpiar",
    
    // Footer
    footerText: "Usar mientras navegas por Pexels",
    
    // Log Messages
    logReady: "PexelBulker listo. Haz clic en el botón para detectar URL.",
    logDetecting: "Detectando URL...",
    logNotPexels: "Error: ¡No estás en Pexels.com!",
    logPageInfoFailed: "No se pudo obtener la información de la página. Actualiza la página e intenta de nuevo.",
    logUserIdFound: "ID de usuario: {userId}",
    logUserIdFailed: "No se pudo detectar automáticamente el ID de usuario. Se requiere URL de API manual.",
    logNetworkTab: "Puedes copiar la URL de API desde la pestaña Network.",
    logUserPage: "Debes estar en la página de medios de un usuario.",
    logFetchingFirst: "Obteniendo información de la primera página...",
    logApiFailed: "Llamada a API falló. Actualiza la página e intenta de nuevo.",
    logApiError: "Error de API: {error}",
    logPaginationFailed: "No se pudo obtener información de paginación.",
    logFoundVideos: "¡Encontradas {pages} páginas con {videos} videos!",
    logScanStarting: "Iniciando escaneo: páginas {start}-{end}, calidad: {quality}",
    logActiveProcess: "Proceso activo detectado.",
    logPaused: "Descarga pausada.",
    logResumed: "Descarga reanudada...",
    logCancelled: "Descarga cancelada.",
    logCancelConfirm: "¿Estás seguro de que quieres cancelar la descarga?",
    logScanComplete: "¡Escaneo completo! {count} videos agregados a la cola de descarga.",
    
    // Language
    language: "Idioma:",
    languageName: "Español"
  },
  
  fr: {
    // Header
    title: "PexelBulker",
    subtitle: "Téléchargeur vidéo en masse pour Pexels",
    
    // URL Section
    apiUrlLabel: "URL de l'API:",
    apiUrlPlaceholder: "https://www.pexels.com/fr-fr/api/v3/users/...",
    detectBtn: "Détecter l'URL",
    detectingBtn: "Détection...",
    
    // Info Section
    totalPages: "Total des pages:",
    totalVideos: "Total des vidéos:",
    
    // Quality Section
    videoQuality: "Qualité vidéo:",
    qualityUHD: "UHD (Maximale)",
    qualityHD: "HD",
    qualitySD: "SD",
    qualityAll: "Tout (Meilleure disponible)",
    
    // Page Range Section
    pageRange: "Plage de pages:",
    pageStart: "Début",
    pageEnd: "Fin",
    allPages: "Télécharger toutes les pages",
    
    // Folder Section
    downloadFolder: "Dossier de téléchargement:",
    folderPlaceholder: "PexelBulker",
    changeFolder: "Modifier",
    folderInfo: "Les fichiers seront enregistrés dans Téléchargements/[dossier]/",
    
    // Action Buttons
    scanBtn: "Scanner et Télécharger",
    pauseBtn: "⏸ Pause",
    resumeBtn: "▶ Reprendre",
    cancelBtn: "✕ Annuler",
    
    // Progress Section
    progressPreparing: "Préparation...",
    progressPaused: "En pause",
    progressCancelled: "Annulé",
    progressCompleted: "Terminé!",
    pagesScanned: "pages scannées",
    videosDownloading: "vidéos en téléchargement",
    
    // Log Section
    activityLog: "Journal d'activité",
    clearLog: "Effacer",
    
    // Footer
    footerText: "À utiliser en naviguant sur Pexels",
    
    // Log Messages
    logReady: "PexelBulker prêt. Cliquez sur le bouton pour détecter l'URL.",
    logDetecting: "Détection de l'URL...",
    logNotPexels: "Erreur: Vous n'êtes pas sur Pexels.com!",
    logPageInfoFailed: "Échec de l'obtention des informations de la page. Veuillez actualiser la page et réessayer.",
    logUserIdFound: "ID utilisateur: {userId}",
    logUserIdFailed: "L'ID utilisateur n'a pas pu être détecté automatiquement. URL d'API manuelle requise.",
    logNetworkTab: "Vous pouvez copier l'URL de l'API depuis l'onglet Network.",
    logUserPage: "Vous devez être sur la page média d'un utilisateur.",
    logFetchingFirst: "Récupération des informations de la première page...",
    logApiFailed: "Échec de l'appel API. Veuillez actualiser la page et réessayer.",
    logApiError: "Erreur API: {error}",
    logPaginationFailed: "Impossible d'obtenir les informations de pagination.",
    logFoundVideos: "Trouvé {pages} pages avec {videos} vidéos!",
    logScanStarting: "Démarrage du scan: pages {start}-{end}, qualité: {quality}",
    logActiveProcess: "Processus actif détecté.",
    logPaused: "Téléchargement mis en pause.",
    logResumed: "Téléchargement repris...",
    logCancelled: "Téléchargement annulé.",
    logCancelConfirm: "Êtes-vous sûr de vouloir annuler le téléchargement?",
    logScanComplete: "Scan terminé! {count} vidéos ajoutées à la file de téléchargement.",
    
    // Language
    language: "Langue:",
    languageName: "Français"
  },
  
  zh: {
    // Header
    title: "PexelBulker",
    subtitle: "Pexels 批量视频下载器",
    
    // URL Section
    apiUrlLabel: "API 网址:",
    apiUrlPlaceholder: "https://www.pexels.com/zh-cn/api/v3/users/...",
    detectBtn: "检测网址",
    detectingBtn: "检测中...",
    
    // Info Section
    totalPages: "总页数:",
    totalVideos: "总视频数:",
    
    // Quality Section
    videoQuality: "视频质量:",
    qualityUHD: "超高清 (最高)",
    qualityHD: "高清",
    qualitySD: "标清",
    qualityAll: "全部 (最佳可用)",
    
    // Page Range Section
    pageRange: "页面范围:",
    pageStart: "开始",
    pageEnd: "结束",
    allPages: "下载所有页面",
    
    // Folder Section
    downloadFolder: "下载文件夹:",
    folderPlaceholder: "PexelBulker",
    changeFolder: "更改",
    folderInfo: "文件将保存到 下载/[文件夹]/",
    
    // Action Buttons
    scanBtn: "扫描并下载",
    pauseBtn: "⏸ 暂停",
    resumeBtn: "▶ 继续",
    cancelBtn: "✕ 取消",
    
    // Progress Section
    progressPreparing: "准备中...",
    progressPaused: "已暂停",
    progressCancelled: "已取消",
    progressCompleted: "完成!",
    pagesScanned: "页已扫描",
    videosDownloading: "视频下载中",
    
    // Log Section
    activityLog: "活动日志",
    clearLog: "清除",
    
    // Footer
    footerText: "浏览 Pexels 时使用",
    
    // Log Messages
    logReady: "PexelBulker 已准备就绪。点击按钮检测网址。",
    logDetecting: "正在检测网址...",
    logNotPexels: "错误：您不在 Pexels.com 上！",
    logPageInfoFailed: "无法获取页面信息。请刷新页面并重试。",
    logUserIdFound: "用户 ID：{userId}",
    logUserIdFailed: "无法自动检测用户 ID。需要手动输入 API 网址。",
    logNetworkTab: "您可以从网络选项卡复制 API 网址。",
    logUserPage: "您必须在用户的媒体页面上。",
    logFetchingFirst: "正在获取第一页信息...",
    logApiFailed: "API 调用失败。请刷新页面并重试。",
    logApiError: "API 错误：{error}",
    logPaginationFailed: "无法获取分页信息。",
    logFoundVideos: "找到 {pages} 页，共 {videos} 个视频！",
    logScanStarting: "开始扫描：第 {start}-{end} 页，质量：{quality}",
    logActiveProcess: "检测到活动进程。",
    logPaused: "下载已暂停。",
    logResumed: "下载已继续...",
    logCancelled: "下载已取消。",
    logCancelConfirm: "您确定要取消下载吗？",
    logScanComplete: "扫描完成！{count} 个视频已添加到下载队列。",
    
    // Language
    language: "语言:",
    languageName: "中文"
  }
};

// Helper function to get translation with variable replacement
function t(key, replacements = {}) {
  const currentLang = localStorage.getItem('pexelBulkerLang') || 'en';
  let text = translations[currentLang]?.[key] || translations['en'][key] || key;
  
  // Replace variables like {userId}, {pages}, etc.
  Object.keys(replacements).forEach(varKey => {
    text = text.replace(`{${varKey}}`, replacements[varKey]);
  });
  
  return text;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { translations, t };
}
