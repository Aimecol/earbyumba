-- Diocese of Byumba Database Schema
-- Multi-language support with English, Kinyarwanda, and French

CREATE DATABASE IF NOT EXISTS diocese_byumba CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE diocese_byumba;

-- Languages table
CREATE TABLE languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(5) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert supported languages
INSERT INTO languages (code, name, native_name) VALUES
('en', 'English', 'English'),
('rw', 'Kinyarwanda', 'Ikinyarwanda'),
('fr', 'French', 'Français');

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    national_id VARCHAR(20) UNIQUE,
    date_of_birth DATE,
    place_of_birth VARCHAR(255),
    gender ENUM('male', 'female'),
    address TEXT,
    profile_picture VARCHAR(255),
    preferred_language VARCHAR(5) DEFAULT 'en',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (preferred_language) REFERENCES languages(code)
);

-- Parishes table
CREATE TABLE parishes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    priest_name VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample parishes
INSERT INTO parishes (name, location, priest_name, contact_phone, contact_email) VALUES
('St. Mary\'s Parish', 'Byumba Sector', 'Fr. John Uwimana', '+250 788 123 456', 'stmary@diocesebyumba.rw'),
('St. Joseph\'s Parish', 'Gicumbi District', 'Fr. Paul Nzeyimana', '+250 788 234 567', 'stjoseph@diocesebyumba.rw'),
('St. Peter\'s Parish', 'Rulindo District', 'Fr. Emmanuel Habimana', '+250 788 345 678', 'stpeter@diocesebyumba.rw'),
('Holy Family Parish', 'Gakenke District', 'Fr. Vincent Mugisha', '+250 788 456 789', 'holyfamily@diocesebyumba.rw'),
('St. Paul\'s Parish', 'Burera District', 'Fr. Jean Baptiste Nsengimana', '+250 788 567 890', 'stpaul@diocesebyumba.rw');

-- User parish membership
CREATE TABLE user_parish_membership (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    parish_id INT NOT NULL,
    membership_date DATE,
    baptism_date DATE,
    confirmation_date DATE,
    role ENUM('member', 'choir', 'catechist', 'youth_leader', 'committee', 'volunteer') DEFAULT 'member',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parish_id) REFERENCES parishes(id)
);

-- Certificate types with multi-language support
CREATE TABLE certificate_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_key VARCHAR(50) NOT NULL UNIQUE,
    fee DECIMAL(10,2) NOT NULL,
    processing_days INT DEFAULT 7,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificate type translations
CREATE TABLE certificate_type_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    certificate_type_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_documents JSON,
    FOREIGN KEY (certificate_type_id) REFERENCES certificate_types(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code),
    UNIQUE KEY unique_translation (certificate_type_id, language_code)
);

-- Insert certificate types
INSERT INTO certificate_types (type_key, fee, processing_days, icon) VALUES
('baptism', 2000.00, 5, 'fa-cross'),
('confirmation', 2500.00, 5, 'fa-hands-praying'),
('marriage', 5000.00, 7, 'fa-ring'),
('ordination', 10000.00, 14, 'fa-church'),
('membership', 1500.00, 3, 'fa-users'),
('good_standing', 1500.00, 3, 'fa-certificate');

-- Insert certificate type translations
INSERT INTO certificate_type_translations (certificate_type_id, language_code, name, description, required_documents) VALUES
-- Baptism Certificate
(1, 'en', 'Baptism Certificate', 'Official record of baptism ceremony', '["National ID Copy", "Birth Certificate", "Passport Photo"]'),
(1, 'rw', 'Icyemezo cy\'Ubwiyunge', 'Inyandiko y\'ibanze y\'umuhango w\'ubwiyunge', '["Kopi y\'indangamuntu", "Icyemezo cy\'amavuko", "Ifoto y\'pasiporo"]'),
(1, 'fr', 'Certificat de Baptême', 'Enregistrement officiel de la cérémonie de baptême', '["Copie de la carte d\'identité", "Certificat de naissance", "Photo de passeport"]'),

-- Confirmation Certificate
(2, 'en', 'Confirmation Certificate', 'Official record of confirmation ceremony', '["National ID Copy", "Baptism Certificate", "Passport Photo"]'),
(2, 'rw', 'Icyemezo cy\'Iyemeza', 'Inyandiko y\'ibanze y\'umuhango w\'iyemeza', '["Kopi y\'indangamuntu", "Icyemezo cy\'ubwiyunge", "Ifoto y\'pasiporo"]'),
(2, 'fr', 'Certificat de Confirmation', 'Enregistrement officiel de la cérémonie de confirmation', '["Copie de la carte d\'identité", "Certificat de baptême", "Photo de passeport"]'),

-- Marriage Certificate
(3, 'en', 'Marriage Certificate', 'Official record of marriage ceremony', '["National ID Copy (Both)", "Birth Certificates (Both)", "Passport Photos (Both)", "Marriage Banns"]'),
(3, 'rw', 'Icyemezo cy\'Ubukwe', 'Inyandiko y\'ibanze y\'umuhango w\'ubukwe', '["Kopi z\'indangamuntu (bombi)", "Ibyemezo by\'amavuko (bombi)", "Amafoto y\'pasiporo (bombi)", "Itangazo ry\'ubukwe"]'),
(3, 'fr', 'Certificat de Mariage', 'Enregistrement officiel de la cérémonie de mariage', '["Copie de la carte d\'identité (les deux)", "Certificats de naissance (les deux)", "Photos de passeport (les deux)", "Bans de mariage"]'),

-- Ordination Certificate
(4, 'en', 'Ordination Certificate', 'Official record of ordination ceremony', '["National ID Copy", "Seminary Certificate", "Passport Photo", "Recommendation Letters"]'),
(4, 'rw', 'Icyemezo cy\'Ubwiyunge bw\'Abapadiri', 'Inyandiko y\'ibanze y\'umuhango w\'ubwiyunge bw\'abapadiri', '["Kopi y\'indangamuntu", "Icyemezo cy\'amashuri makuru", "Ifoto y\'pasiporo", "Ibaruwa z\'ubwiyunge"]'),
(4, 'fr', 'Certificat d\'Ordination', 'Enregistrement officiel de la cérémonie d\'ordination', '["Copie de la carte d\'identité", "Certificat du séminaire", "Photo de passeport", "Lettres de recommandation"]'),

-- Membership Certificate
(5, 'en', 'Membership Certificate', 'Parish membership record', '["National ID Copy", "Passport Photo"]'),
(5, 'rw', 'Icyemezo cy\'Ubwiyunge mu Paruwasi', 'Inyandiko y\'ubwiyunge mu paruwasi', '["Kopi y\'indangamuntu", "Ifoto y\'pasiporo"]'),
(5, 'fr', 'Certificat d\'Adhésion', 'Enregistrement d\'adhésion paroissiale', '["Copie de la carte d\'identité", "Photo de passeport"]'),

-- Good Standing Certificate
(6, 'en', 'Good Standing Certificate', 'Certificate of good standing in the parish', '["National ID Copy", "Passport Photo"]'),
(6, 'rw', 'Icyemezo cy\'Imyitwarire Myiza', 'Icyemezo cy\'imyitwarire myiza mu paruwasi', '["Kopi y\'indangamuntu", "Ifoto y\'pasiporo"]'),
(6, 'fr', 'Certificat de Bonne Conduite', 'Certificat de bonne conduite dans la paroisse', '["Copie de la carte d\'identité", "Photo de passeport"]');

-- Applications table
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    certificate_type_id INT NOT NULL,
    application_number VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'approved', 'completed', 'rejected') DEFAULT 'pending',
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP NULL,
    completed_date TIMESTAMP NULL,
    payment_code VARCHAR(20) NULL,
    payment_status ENUM('pending', 'paid', 'confirmed') DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (certificate_type_id) REFERENCES certificate_types(id)
);

-- Application documents
CREATE TABLE application_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Meeting types with multi-language support
CREATE TABLE meeting_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_key VARCHAR(50) NOT NULL UNIQUE,
    duration_minutes INT DEFAULT 60,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meeting type translations
CREATE TABLE meeting_type_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meeting_type_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (meeting_type_id) REFERENCES meeting_types(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code),
    UNIQUE KEY unique_translation (meeting_type_id, language_code)
);

-- Insert meeting types
INSERT INTO meeting_types (type_key, duration_minutes, icon) VALUES
('counseling', 60, 'fa-heart'),
('preparation', 45, 'fa-baby'),
('consultation', 30, 'fa-comments'),
('confession', 30, 'fa-praying-hands'),
('spiritual', 45, 'fa-cross'),
('other', 30, 'fa-calendar');

-- Insert meeting type translations
INSERT INTO meeting_type_translations (meeting_type_id, language_code, name, description) VALUES
-- Marriage Counseling
(1, 'en', 'Marriage Counseling', 'Pre-marriage counseling session'),
(1, 'rw', 'Inama y\'Ubukwe', 'Inama y\'mbere y\'ubukwe'),
(1, 'fr', 'Conseil Matrimonial', 'Session de conseil pré-matrimonial'),

-- Baptism Preparation
(2, 'en', 'Baptism Preparation', 'Baptism preparation session'),
(2, 'rw', 'Kwihugura kw\'Ubwiyunge', 'Inama yo kwihugura ubwiyunge'),
(2, 'fr', 'Préparation au Baptême', 'Session de préparation au baptême'),

-- General Consultation
(3, 'en', 'General Consultation', 'General spiritual consultation'),
(3, 'rw', 'Inama Rusange', 'Inama rusange y\'umwuka'),
(3, 'fr', 'Consultation Générale', 'Consultation spirituelle générale'),

-- Confession
(4, 'en', 'Confession', 'Private confession session'),
(4, 'rw', 'Kwicuza', 'Inama y\'kwicuza'),
(4, 'fr', 'Confession', 'Session de confession privée'),

-- Spiritual Guidance
(5, 'en', 'Spiritual Guidance', 'Spiritual guidance and prayer'),
(5, 'rw', 'Ubuyobozi bw\'Umwuka', 'Ubuyobozi bw\'umwuka n\'amasengesho'),
(5, 'fr', 'Guidance Spirituelle', 'Guidance spirituelle et prière'),

-- Other
(6, 'en', 'Other', 'Other meeting purposes'),
(6, 'rw', 'Ibindi', 'Impamvu zindi z\'inama'),
(6, 'fr', 'Autre', 'Autres objectifs de réunion');

-- Meetings table
CREATE TABLE meetings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    meeting_type_id INT NOT NULL,
    meeting_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    location VARCHAR(255) DEFAULT 'Bishop\'s Office',
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (meeting_type_id) REFERENCES meeting_types(id)
);

-- Notification types with multi-language support
CREATE TABLE notification_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_key VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification type translations
CREATE TABLE notification_type_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    notification_type_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    category VARCHAR(255) NOT NULL,
    FOREIGN KEY (notification_type_id) REFERENCES notification_types(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code),
    UNIQUE KEY unique_translation (notification_type_id, language_code)
);

-- Insert notification types
INSERT INTO notification_types (type_key, icon, priority) VALUES
('application', 'fa-file-alt', 'medium'),
('meeting', 'fa-calendar', 'high'),
('payment', 'fa-credit-card', 'high'),
('general', 'fa-info-circle', 'low'),
('system', 'fa-cog', 'medium');

-- Insert notification type translations
INSERT INTO notification_type_translations (notification_type_id, language_code, category) VALUES
(1, 'en', 'Application Updates'),
(1, 'rw', 'Amakuru y\'Ubusabe'),
(1, 'fr', 'Mises à jour des demandes'),

(2, 'en', 'Meeting Reminders'),
(2, 'rw', 'Ibirikumbuzo by\'Inama'),
(2, 'fr', 'Rappels de réunion'),

(3, 'en', 'Payment Notifications'),
(3, 'rw', 'Amakuru y\'Ubwishyu'),
(3, 'fr', 'Notifications de paiement'),

(4, 'en', 'General Announcements'),
(4, 'rw', 'Amatangazo Rusange'),
(4, 'fr', 'Annonces générales'),

(5, 'en', 'System Notifications'),
(5, 'rw', 'Amakuru ya Sisitemu'),
(5, 'fr', 'Notifications système');

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    notification_type_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_required BOOLEAN DEFAULT FALSE,
    action_text VARCHAR(255) NULL,
    action_url VARCHAR(500) NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (notification_type_id) REFERENCES notification_types(id)
);

-- Job categories with multi-language support
CREATE TABLE job_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_key VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job category translations
CREATE TABLE job_category_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_category_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (job_category_id) REFERENCES job_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code),
    UNIQUE KEY unique_translation (job_category_id, language_code)
);

-- Insert job categories
INSERT INTO job_categories (category_key, icon) VALUES
('administration', 'fa-briefcase'),
('education', 'fa-graduation-cap'),
('pastoral', 'fa-church'),
('maintenance', 'fa-tools'),
('healthcare', 'fa-heartbeat'),
('social_services', 'fa-hands-helping');

-- Insert job category translations
INSERT INTO job_category_translations (job_category_id, language_code, name, description) VALUES
(1, 'en', 'Administration', 'Administrative and office positions'),
(1, 'rw', 'Ubuyobozi', 'Imirimo y\'ubuyobozi n\'ibiro'),
(1, 'fr', 'Administration', 'Postes administratifs et de bureau'),

(2, 'en', 'Education', 'Teaching and educational positions'),
(2, 'rw', 'Uburezi', 'Imirimo y\'ubwigisha n\'uburezi'),
(2, 'fr', 'Éducation', 'Postes d\'enseignement et d\'éducation'),

(3, 'en', 'Pastoral Care', 'Pastoral and spiritual care positions'),
(3, 'rw', 'Ubushumba', 'Imirimo y\'ubushumba n\'umwuka'),
(3, 'fr', 'Soins Pastoraux', 'Postes de soins pastoraux et spirituels'),

(4, 'en', 'Maintenance', 'Maintenance and technical positions'),
(4, 'rw', 'Ubusanasana', 'Imirimo y\'ubusanasana n\'ubuhanga'),
(4, 'fr', 'Maintenance', 'Postes de maintenance et techniques'),

(5, 'en', 'Healthcare', 'Healthcare and medical positions'),
(5, 'rw', 'Ubuvuzi', 'Imirimo y\'ubuvuzi n\'ubuzima'),
(5, 'fr', 'Soins de Santé', 'Postes de soins de santé et médicaux'),

(6, 'en', 'Social Services', 'Social work and community service positions'),
(6, 'rw', 'Serivisi z\'Abaturage', 'Imirimo y\'imibereho n\'abaturage'),
(6, 'fr', 'Services Sociaux', 'Postes de travail social et de service communautaire');

-- Jobs table
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_category_id INT NOT NULL,
    parish_id INT NULL,
    job_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    salary_range VARCHAR(100),
    employment_type ENUM('full_time', 'part_time', 'contract', 'volunteer') DEFAULT 'full_time',
    location VARCHAR(255),
    application_deadline DATE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_category_id) REFERENCES job_categories(id),
    FOREIGN KEY (parish_id) REFERENCES parishes(id)
);

-- Blog categories with multi-language support
CREATE TABLE blog_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_key VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog category translations
CREATE TABLE blog_category_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    blog_category_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (blog_category_id) REFERENCES blog_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES languages(code),
    UNIQUE KEY unique_translation (blog_category_id, language_code)
);

-- Insert blog categories
INSERT INTO blog_categories (category_key, icon) VALUES
('announcements', 'fa-bullhorn'),
('events', 'fa-calendar-alt'),
('spiritual', 'fa-cross'),
('community', 'fa-users'),
('education', 'fa-book'),
('news', 'fa-newspaper');

-- Insert blog category translations
INSERT INTO blog_category_translations (blog_category_id, language_code, name, description) VALUES
(1, 'en', 'Announcements', 'Official diocese announcements'),
(1, 'rw', 'Amatangazo', 'Amatangazo y\'ibanze ya diyosezi'),
(1, 'fr', 'Annonces', 'Annonces officielles du diocèse'),

(2, 'en', 'Events', 'Upcoming events and activities'),
(2, 'rw', 'Ibirori', 'Ibirori n\'ibikorwa bizaza'),
(2, 'fr', 'Événements', 'Événements et activités à venir'),

(3, 'en', 'Spiritual Reflections', 'Spiritual guidance and reflections'),
(3, 'rw', 'Amateka y\'Umwuka', 'Ubuyobozi bw\'umwuka n\'amateka'),
(3, 'fr', 'Réflexions Spirituelles', 'Guidance spirituelle et réflexions'),

(4, 'en', 'Community News', 'Community updates and stories'),
(4, 'rw', 'Amakuru y\'Abaturage', 'Amakuru n\'inkuru z\'abaturage'),
(4, 'fr', 'Nouvelles Communautaires', 'Mises à jour et histoires communautaires'),

(5, 'en', 'Education', 'Educational content and resources'),
(5, 'rw', 'Uburezi', 'Ibikubiye mu burezi n\'ibikoresho'),
(5, 'fr', 'Éducation', 'Contenu éducatif et ressources'),

(6, 'en', 'Diocese News', 'Latest news from the diocese'),
(6, 'rw', 'Amakuru ya Diyosezi', 'Amakuru mashya ya diyosezi'),
(6, 'fr', 'Nouvelles du Diocèse', 'Dernières nouvelles du diocèse');

-- Blog posts table
CREATE TABLE blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    blog_category_id INT NOT NULL,
    author_id INT NULL,
    post_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_category_id) REFERENCES blog_categories(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- System settings with multi-language support
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- System setting translations
CREATE TABLE system_setting_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    setting_value TEXT,
    FOREIGN KEY (language_code) REFERENCES languages(code),
    UNIQUE KEY unique_translation (setting_key, language_code)
);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value) VALUES
('site_name', 'Diocese of Byumba'),
('site_description', 'Official website of the Diocese of Byumba'),
('contact_email', 'info@diocesebyumba.rw'),
('contact_phone', '+250 788 123 456'),
('contact_address', 'Byumba, Northern Province, Rwanda'),
('facebook_url', 'https://facebook.com/diocesebyumba'),
('twitter_url', 'https://twitter.com/diocesebyumba'),
('instagram_url', 'https://instagram.com/diocesebyumba'),
('youtube_url', 'https://youtube.com/diocesebyumba');

-- Insert system setting translations
INSERT INTO system_setting_translations (setting_key, language_code, setting_value) VALUES
('site_name', 'en', 'Diocese of Byumba'),
('site_name', 'rw', 'Diyosezi ya Byumba'),
('site_name', 'fr', 'Diocèse de Byumba'),

('site_description', 'en', 'Official website of the Diocese of Byumba'),
('site_description', 'rw', 'Urubuga rw\'ibanze rwa Diyosezi ya Byumba'),
('site_description', 'fr', 'Site officiel du Diocèse de Byumba');

-- User notification preferences
CREATE TABLE user_notification_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    notification_type_id INT NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (notification_type_id) REFERENCES notification_types(id),
    UNIQUE KEY unique_user_notification (user_id, notification_type_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_national_id ON users(national_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_meetings_user_id ON meetings(user_id);
CREATE INDEX idx_meetings_date ON meetings(meeting_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured);
