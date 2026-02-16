<?php
// Test if PHP is working
echo "PHP is working!<br>";

// Test database connection
$host = "localhost";
$dbname = "test";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database connection successful!<br>";
    
    // Check if users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "Users table exists!<br>";
        
        // Show table structure
        $stmt = $conn->query("DESCRIBE users");
        echo "<h3>Table Structure:</h3>";
        echo "<pre>";
        print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
        echo "</pre>";
    } else {
        echo "<strong style='color:red;'>WARNING: Users table does NOT exist!</strong><br>";
        echo "Please create the users table using the SQL below:<br>";
        echo "<pre>
CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) DEFAULT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
</pre>";
    }
    
} catch(PDOException $e) {
    echo "<strong style='color:red;'>Database connection failed: " . $e->getMessage() . "</strong><br>";
}
?>
