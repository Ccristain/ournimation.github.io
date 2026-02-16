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
$username = isset($input['username']) ? trim($input['username']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? $input['password'] : '';

// Validation checks
if (empty($username) && empty($email)) {
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

if (strlen($password) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'Password must be at least 6 characters long'
    ]);
    exit;
}

try {
    // Determine if input is email or username
    $isEmail = filter_var($username, FILTER_VALIDATE_EMAIL);
    
    if ($isEmail) {
        $email = $username;
        // Extract username from email (before @)
        $username = explode('@', $email)[0];
    }
    
    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    
    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Username already exists'
        ]);
        exit;
    }
    
    // Check if email already exists
    if (!empty($email)) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        
        if ($stmt->fetch()) {
            echo json_encode([
                'success' => false,
                'message' => 'Email already registered'
            ]);
            exit;
        }
    }
    
    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, created_at) VALUES (:username, :email, :password, NOW())");
    $stmt->execute([
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword
    ]);
    
    // Get the new user ID
    $userId = $conn->lastInsertId();
    
    // Set session variables
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    $_SESSION['email'] = $email;
    
    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully',
        'user' => [
            'id' => $userId,
            'username' => $username,
            'email' => $email
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Signup error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred during registration. Please try again.'
    ]);
}
?>
