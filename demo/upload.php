<?php
// Kết nối đến MySQL
$servername = "localhost";
$username = "root"; // Thay bằng username MySQL của bạn
$password = ""; // Thay bằng password MySQL của bạn
$dbname = "demo"; // Thay bằng tên database của bạn

$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Kiểm tra dữ liệu POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lưu file ảnh
    if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = "uploads/"; // Thư mục lưu trữ ảnh
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true); // Tạo thư mục nếu chưa tồn tại
        }

        // Tạo tên file duy nhất cho mỗi ảnh
        $fileName = uniqid() . "_" . basename($_FILES['image']['name']);
        $uploadFile = $uploadDir . $fileName;

        // Di chuyển file vào thư mục lưu trữ
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            $imagePath = $uploadFile; // Đường dẫn ảnh được lưu
        } else {
            die("Failed to upload image.");
        }
    } else {
        die("Image file is required.");
    }

    // Lấy các giá trị từ form
    $name = $_POST['name'] ?? "Unknown";
    $datetime = $_POST['datetime'] ?? date("Y-m-d H:i:s");

    // Thêm dữ liệu vào bảng (lưu ảnh với thông tin mới)
    $sql = "INSERT INTO espweb (image, name, datetime) VALUES ('$imagePath', '$name', '$datetime')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully.";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Đóng kết nối
$conn->close();
?>
