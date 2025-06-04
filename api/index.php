<?php
/**
 * Main API Router for Diocese of Byumba System
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database configuration
require_once '../config/database.php';

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/byumba/api', '', $path);
$path_parts = explode('/', trim($path, '/'));

// Get the endpoint
$endpoint = $path_parts[0] ?? '';

// Handle language switching
if ($endpoint === 'language' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $language_code = $input['language'] ?? '';
    
    if ($languageHelper->setLanguage($language_code)) {
        ResponseHelper::success(['language' => $language_code], 'Language updated successfully');
    } else {
        ResponseHelper::error('Invalid language code', 400);
    }
}

// Get current language
if ($endpoint === 'language' && $method === 'GET') {
    $languages = $languageHelper->getAvailableLanguages();
    $current = $languageHelper->getLanguage();
    
    ResponseHelper::success([
        'current' => $current,
        'available' => $languages
    ]);
}

// Route to specific API handlers
switch ($endpoint) {
    case 'dashboard':
        require_once 'dashboard.php';
        break;
        
    case 'applications':
        require_once 'applications.php';
        break;
        
    case 'meetings':
        require_once 'meetings.php';
        break;
        
    case 'notifications':
        require_once 'notifications.php';
        break;
        
    case 'profile':
        require_once 'profile.php';
        break;
        
    case 'certificates':
        require_once 'certificates.php';
        break;
        
    case 'jobs':
        require_once 'jobs.php';
        break;
        
    case 'blog':
        require_once 'blog.php';
        break;
        
    case 'auth':
        require_once 'auth.php';
        break;
        
    default:
        ResponseHelper::error('Endpoint not found', 404);
}
?>
