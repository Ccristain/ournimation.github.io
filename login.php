<?php
// Suppress any output before JSON
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

// Include database connection
require_once 'db.php';

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
$usernameOrEmail = isset($input['username']) ? trim($input['username']) : '';
$password = isset($input['password']) ? $input['password'] : '';

if (empty($usernameOrEmail)) {
    echo json_encode([
        'success' => false,
        'message' => 'Username or email is required'
    ]);
    exit;
}

if (empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Password is required'
    ]);
    exit;
}

try {
    // Determine if input is email or username
    $isEmail = filter_var($usernameOrEmail, FILTER_VALIDATE_EMAIL);
    
    if ($isEmail) {
        $stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE email = :email");
        $stmt->execute(['email' => $usernameOrEmail]);
    } else {
        $stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE username = :username");
        $stmt->execute(['username' => $usernameOrEmail]);
    }
    
    $user = $stmt->fetch();
    
    // Check if user exists
    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid username/email or password'
        ]);
        exit;
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid username/email or password'
        ]);
        exit;
    }
    
    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    
    // Handle remember me functionality
    if (isset($input['remember']) && $input['remember'] === true) {
        // Create a secure token
        $token = bin2hex(random_bytes(32));
        
        // Store token in database (you may want to create a remember_tokens table)
        // For now, we'll just set a longer session cookie
        ini_set('session.cookie_lifetime', 60 * 60 * 24 * 30); // 30 days
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred during login. Please try again.'
    ]);
}
?>
