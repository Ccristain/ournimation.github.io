<?php
// Debug version - shows errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Testing Login System</h2>";

session_start();
echo "✓ Session started<br>";

// Test database connection
$host = "localhost";
$dbname = "test";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✓ Database connected<br>";
    
    // Check if users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "✓ Users table exists<br>";
        
        // Count users
        $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch();
        echo "✓ Number of users: " . $result['count'] . "<br>";
        
        // Show all users (without passwords)
        $stmt = $conn->query("SELECT id, username, email, created_at FROM users");
        $users = $stmt->fetchAll();
        echo "<h3>Registered Users:</h3>";
        echo "<pre>";
        print_r($users);
        echo "</pre>";
        
    } else {
        echo "<strong style='color:red;'>✗ Users table NOT found!</strong><br>";
        echo "Create it using the SQL in database.sql<br>";
    }
    
} catch(PDOException $e) {
    echo "<strong style='color:red;'>✗ Database error: " . $e->getMessage() . "</strong><br>";
}

echo "<hr>";
echo "<h3>Test Login</h3>";
echo "<p>Testing with username you created...</p>";

// Simulate login test
if (isset($_GET['test_user'])) {
    $testUser = $_GET['test_user'];
    
    try {
        $stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE username = :username");
        $stmt->execute(['username' => $testUser]);
        $user = $stmt->fetch();
        
        if ($user) {
            echo "✓ User found: " . $user['username'] . "<br>";
            echo "✓ Email: " . ($user['email'] ? $user['email'] : 'Not set') . "<br>";
        } else {
            echo "✗ User not found in database<br>";
        }
    } catch(PDOException $e) {
        echo "✗ Query error: " . $e->getMessage() . "<br>";
    }
}

echo '<form method="GET">';
echo 'Test username: <input type="text" name="test_user" value="naveraeron2003">';
echo '<button type="submit">Test</button>';
echo '</form>';
?>
