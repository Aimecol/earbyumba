// Language Management System for Diocese of Byumba

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.availableLanguages = [];
        this.translations = {};
        this.apiBase = 'api/';
        
        this.init();
    }
    
    async init() {
        try {
            // Load current language and available languages
            await this.loadLanguageData();
            
            // Initialize language switchers
            this.initializeLanguageSwitchers();
            
            // Load page content
            await this.loadPageContent();
            
        } catch (error) {
            console.error('Failed to initialize language manager:', error);
            // Fallback to static content if API fails
            this.initializeLanguageSwitchers();
        }
    }
    
    async loadLanguageData() {
        try {
            const response = await fetch(`${this.apiBase}language`);
            const data = await response.json();
            
            if (data.success) {
                this.currentLanguage = data.data.current;
                this.availableLanguages = data.data.available;
                
                // Update HTML lang attribute
                document.documentElement.lang = this.currentLanguage;
            }
        } catch (error) {
            console.error('Failed to load language data:', error);
            // Use default values
            this.availableLanguages = [
                { code: 'en', name: 'English', native_name: 'English' },
                { code: 'rw', name: 'Kinyarwanda', native_name: 'Ikinyarwanda' },
                { code: 'fr', name: 'French', native_name: 'Français' }
            ];
        }
    }
    
    initializeLanguageSwitchers() {
        // Desktop language toggle
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            // Set active state
            if (btn.getAttribute('data-lang') === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            
            // Add click event
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = btn.getAttribute('data-lang');
                this.changeLanguage(newLang);
            });
        });
        
        // Mobile language toggle
        const mobileLangButtons = document.querySelectorAll('.mobile-lang-buttons .lang-btn');
        mobileLangButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = btn.getAttribute('data-lang');
                this.changeLanguage(newLang);
            });
        });
    }
    
    async changeLanguage(languageCode) {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Update language on server
            const response = await fetch(`${this.apiBase}language`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language: languageCode })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentLanguage = languageCode;
                
                // Update HTML lang attribute
                document.documentElement.lang = languageCode;
                
                // Update active states
                this.updateLanguageButtons();
                
                // Reload page content
                await this.loadPageContent();
                
                // Show success message
                this.showNotification(this.getLanguageText('language_changed'), 'success');
            } else {
                throw new Error(data.message || 'Failed to change language');
            }
            
        } catch (error) {
            console.error('Failed to change language:', error);
            this.showNotification(this.getLanguageText('language_change_failed'), 'error');
        } finally {
            this.hideLoadingState();
        }
    }
    
    updateLanguageButtons() {
        const allLangButtons = document.querySelectorAll('.lang-btn');
        allLangButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    async loadPageContent() {
        const currentPage = this.getCurrentPage();
        
        try {
            switch (currentPage) {
                case 'dashboard':
                    await this.loadDashboardContent();
                    break;
                case 'my-applications':
                    await this.loadApplicationsContent();
                    break;
                case 'my-meetings':
                    await this.loadMeetingsContent();
                    break;
                case 'notifications':
                    await this.loadNotificationsContent();
                    break;
                case 'profile':
                    await this.loadProfileContent();
                    break;
                default:
                    // For other pages, just update static text
                    this.updateStaticText();
            }
        } catch (error) {
            console.error('Failed to load page content:', error);
            this.updateStaticText();
        }
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('dashboard.html')) return 'dashboard';
        if (path.includes('my-applications.html')) return 'my-applications';
        if (path.includes('my-meetings.html')) return 'my-meetings';
        if (path.includes('notifications.html')) return 'notifications';
        if (path.includes('profile.html')) return 'profile';
        return 'other';
    }
    
    async loadDashboardContent() {
        try {
            const response = await fetch(`${this.apiBase}dashboard`);
            const data = await response.json();
            
            if (data.success && window.updateDashboardContent) {
                window.updateDashboardContent(data.data);
            }
        } catch (error) {
            console.error('Failed to load dashboard content:', error);
        }
    }
    
    async loadApplicationsContent() {
        try {
            const response = await fetch(`${this.apiBase}applications`);
            const data = await response.json();
            
            if (data.success && window.updateApplicationsContent) {
                window.updateApplicationsContent(data.data);
            }
        } catch (error) {
            console.error('Failed to load applications content:', error);
        }
    }
    
    async loadMeetingsContent() {
        try {
            const response = await fetch(`${this.apiBase}meetings`);
            const data = await response.json();
            
            if (data.success && window.updateMeetingsContent) {
                window.updateMeetingsContent(data.data);
            }
        } catch (error) {
            console.error('Failed to load meetings content:', error);
        }
    }
    
    async loadNotificationsContent() {
        try {
            const response = await fetch(`${this.apiBase}notifications`);
            const data = await response.json();
            
            if (data.success && window.updateNotificationsContent) {
                window.updateNotificationsContent(data.data);
            }
        } catch (error) {
            console.error('Failed to load notifications content:', error);
        }
    }
    
    async loadProfileContent() {
        // Profile content is mostly static forms, just update labels
        this.updateStaticText();
    }
    
    updateStaticText() {
        // Update site name and description
        const siteNameElements = document.querySelectorAll('.diocese-name');
        const siteSubtitleElements = document.querySelectorAll('.diocese-subtitle');
        
        siteNameElements.forEach(el => {
            el.textContent = this.getSiteName();
        });
        
        siteSubtitleElements.forEach(el => {
            el.textContent = this.getSiteSubtitle();
        });
        
        // Update navigation labels
        this.updateNavigationLabels();
        
        // Update page titles and descriptions
        this.updatePageTitles();
    }
    
    updateNavigationLabels() {
        const navLabels = {
            'en': {
                'certificates': 'Certificates',
                'jobs': 'Jobs',
                'bishop-meeting': 'Bishop Meeting',
                'blog': 'Blog',
                'dashboard': 'Dashboard',
                'profile': 'Profile',
                'my-applications': 'My Applications',
                'my-meetings': 'My Meetings',
                'notifications': 'Notifications'
            },
            'rw': {
                'certificates': 'Ibyemezo',
                'jobs': 'Akazi',
                'bishop-meeting': 'Inama na Musenyeri',
                'blog': 'Amakuru',
                'dashboard': 'Ikibaho',
                'profile': 'Umwirondoro',
                'my-applications': 'Ubusabe Bwanjye',
                'my-meetings': 'Inama Zanjye',
                'notifications': 'Ubutumwa'
            },
            'fr': {
                'certificates': 'Certificats',
                'jobs': 'Emplois',
                'bishop-meeting': 'Rencontre avec l\'Évêque',
                'blog': 'Blog',
                'dashboard': 'Tableau de Bord',
                'profile': 'Profil',
                'my-applications': 'Mes Demandes',
                'my-meetings': 'Mes Rendez-vous',
                'notifications': 'Notifications'
            }
        };
        
        const labels = navLabels[this.currentLanguage] || navLabels['en'];
        
        // Update main navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            const span = link.querySelector('span');
            if (span && href) {
                for (const [key, value] of Object.entries(labels)) {
                    if (href.includes(key)) {
                        span.textContent = value;
                        break;
                    }
                }
            }
        });
        
        // Update dashboard navigation
        document.querySelectorAll('.dashboard-nav-item').forEach(item => {
            const href = item.getAttribute('href');
            const span = item.querySelector('span');
            if (span && href) {
                for (const [key, value] of Object.entries(labels)) {
                    if (href.includes(key)) {
                        span.textContent = value;
                        break;
                    }
                }
            }
        });
    }
    
    updatePageTitles() {
        const pageTitles = {
            'en': {
                'dashboard': 'User Dashboard',
                'profile': 'My Profile',
                'my-applications': 'My Applications',
                'my-meetings': 'My Meetings',
                'notifications': 'Notifications'
            },
            'rw': {
                'dashboard': 'Ikibaho cy\'Ukoresha',
                'profile': 'Umwirondoro Wanjye',
                'my-applications': 'Ubusabe Bwanjye',
                'my-meetings': 'Inama Zanjye',
                'notifications': 'Ubutumwa'
            },
            'fr': {
                'dashboard': 'Tableau de Bord Utilisateur',
                'profile': 'Mon Profil',
                'my-applications': 'Mes Demandes',
                'my-meetings': 'Mes Rendez-vous',
                'notifications': 'Notifications'
            }
        };
        
        const currentPage = this.getCurrentPage();
        const titles = pageTitles[this.currentLanguage] || pageTitles['en'];
        
        if (titles[currentPage]) {
            document.title = `${titles[currentPage]} - ${this.getSiteName()}`;
            
            const pageTitle = document.querySelector('.page-title');
            if (pageTitle) {
                pageTitle.textContent = titles[currentPage];
            }
        }
    }
    
    getSiteName() {
        const siteNames = {
            'en': 'Diocese of Byumba',
            'rw': 'Diyosezi ya Byumba',
            'fr': 'Diocèse de Byumba'
        };
        return siteNames[this.currentLanguage] || siteNames['en'];
    }
    
    getSiteSubtitle() {
        const subtitles = {
            'en': 'Diocese of Byumba',
            'rw': 'Diyosezi ya Byumba',
            'fr': 'Diocèse de Byumba'
        };
        return subtitles[this.currentLanguage] || subtitles['en'];
    }
    
    getLanguageText(key) {
        const texts = {
            'en': {
                'language_changed': 'Language changed successfully',
                'language_change_failed': 'Failed to change language'
            },
            'rw': {
                'language_changed': 'Ururimi rwahinduwe neza',
                'language_change_failed': 'Guhindura ururimi byanze'
            },
            'fr': {
                'language_changed': 'Langue changée avec succès',
                'language_change_failed': 'Échec du changement de langue'
            }
        };
        
        return texts[this.currentLanguage]?.[key] || texts['en'][key] || key;
    }
    
    showLoadingState() {
        // Add loading class to body
        document.body.classList.add('language-loading');
        
        // Disable language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
    
    hideLoadingState() {
        // Remove loading class
        document.body.classList.remove('language-loading');
        
        // Enable language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.disabled = false;
        });
    }
    
    showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            // Fallback to console
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.languageManager = new LanguageManager();
});

// Export for use in other scripts
window.LanguageManager = LanguageManager;
