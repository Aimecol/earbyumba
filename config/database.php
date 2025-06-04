<?php
/**
 * Database Configuration for Diocese of Byumba System
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'diocese_byumba';
    private $username = 'root';
    private $password = '';
    private $charset = 'utf8mb4';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}

/**
 * Language Helper Class
 */
class LanguageHelper {
    private $db;
    private $current_language;
    
    public function __construct($database) {
        $this->db = $database;
        $this->current_language = $this->getCurrentLanguage();
    }
    
    public function getCurrentLanguage() {
        // Check session first
        if (isset($_SESSION['language'])) {
            return $_SESSION['language'];
        }
        
        // Check cookie
        if (isset($_COOKIE['language'])) {
            $_SESSION['language'] = $_COOKIE['language'];
            return $_COOKIE['language'];
        }
        
        // Check browser language
        $browser_lang = $this->getBrowserLanguage();
        if ($browser_lang) {
            $_SESSION['language'] = $browser_lang;
            return $browser_lang;
        }
        
        // Default to English
        $_SESSION['language'] = 'en';
        return 'en';
    }
    
    public function setLanguage($language_code) {
        // Validate language code
        if ($this->isValidLanguage($language_code)) {
            $_SESSION['language'] = $language_code;
            setcookie('language', $language_code, time() + (86400 * 30), '/'); // 30 days
            $this->current_language = $language_code;
            return true;
        }
        return false;
    }
    
    public function getLanguage() {
        return $this->current_language;
    }
    
    private function getBrowserLanguage() {
        if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
            $browser_languages = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
            foreach ($browser_languages as $lang) {
                $lang_code = substr(trim($lang), 0, 2);
                if ($this->isValidLanguage($lang_code)) {
                    return $lang_code;
                }
            }
        }
        return null;
    }
    
    private function isValidLanguage($language_code) {
        $valid_languages = ['en', 'rw', 'fr'];
        return in_array($language_code, $valid_languages);
    }
    
    public function getAvailableLanguages() {
        try {
            $query = "SELECT code, name, native_name FROM languages WHERE is_active = 1 ORDER BY name";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch(PDOException $e) {
            return [
                ['code' => 'en', 'name' => 'English', 'native_name' => 'English'],
                ['code' => 'rw', 'name' => 'Kinyarwanda', 'native_name' => 'Ikinyarwanda'],
                ['code' => 'fr', 'name' => 'French', 'native_name' => 'Français']
            ];
        }
    }
}

/**
 * Translation Helper Class
 */
class TranslationHelper {
    private $db;
    private $language;
    private $translations = [];
    
    public function __construct($database, $language_code) {
        $this->db = $database;
        $this->language = $language_code;
        $this->loadTranslations();
    }
    
    private function loadTranslations() {
        // Load system setting translations
        try {
            $query = "SELECT setting_key, setting_value FROM system_setting_translations WHERE language_code = :lang";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':lang', $this->language);
            $stmt->execute();
            
            while ($row = $stmt->fetch()) {
                $this->translations['settings'][$row['setting_key']] = $row['setting_value'];
            }
        } catch(PDOException $e) {
            // Handle error silently
        }
    }
    
    public function translate($key, $default = '') {
        $keys = explode('.', $key);
        $value = $this->translations;
        
        foreach ($keys as $k) {
            if (isset($value[$k])) {
                $value = $value[$k];
            } else {
                return $default ?: $key;
            }
        }
        
        return $value ?: $default ?: $key;
    }
    
    public function getSiteName() {
        return $this->translate('settings.site_name', 'Diocese of Byumba');
    }
    
    public function getSiteDescription() {
        return $this->translate('settings.site_description', 'Official website of the Diocese of Byumba');
    }
}

/**
 * Response Helper Class
 */
class ResponseHelper {
    public static function json($data, $status_code = 200) {
        http_response_code($status_code);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    public static function success($data = null, $message = 'Success') {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }
    
    public static function error($message = 'Error', $status_code = 400, $data = null) {
        self::json([
            'success' => false,
            'message' => $message,
            'data' => $data
        ], $status_code);
    }
}

/**
 * Utility Functions
 */
function generateUniqueNumber($prefix, $length = 6) {
    $number = $prefix . str_pad(mt_rand(1, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
    return $number;
}

function formatDate($date, $format = 'Y-m-d') {
    if ($date instanceof DateTime) {
        return $date->format($format);
    }
    return date($format, strtotime($date));
}

function formatDateTime($datetime, $format = 'Y-m-d H:i:s') {
    if ($datetime instanceof DateTime) {
        return $datetime->format($format);
    }
    return date($format, strtotime($datetime));
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    // Rwanda phone number validation
    $pattern = '/^(\+250|250)?[0-9]{9}$/';
    return preg_match($pattern, $phone);
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set timezone
date_default_timezone_set('Africa/Kigali');

// Initialize database connection
$database = new Database();
$db = $database->getConnection();

// Initialize language helper
$languageHelper = new LanguageHelper($db);
$current_language = $languageHelper->getLanguage();

// Initialize translation helper
$translationHelper = new TranslationHelper($db, $current_language);

// Make helpers available globally
$GLOBALS['db'] = $db;
$GLOBALS['languageHelper'] = $languageHelper;
$GLOBALS['translationHelper'] = $translationHelper;
$GLOBALS['current_language'] = $current_language;
?>
