<?php
// Suppress any output before JSON
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
    echo json_encode([
        'success' => true,
        'loggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'email' => isset($_SESSION['email']) ? $_SESSION['email'] : ''
        ]
    ]);
} else {
    echo json_encode([
        'success' => true,
        'loggedIn' => false
    ]);
}
?>
