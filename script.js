// URL của ESP32
const esp32Url = "http://192.168.1.142/capture"; // Thay bằng IP của ESP32
const uploadUrl = "http://localhost/demo/upload.php"; // Thay bằng IP hoặc domain của server

const captureBtn = document.getElementById("capture-btn");
const saveBtn = document.getElementById("save-btn");
const photo = document.getElementById("photo");
const nameInput = document.getElementById("photo-name");

// Hàm lấy thời gian hiện tại
function getCurrentDatetime() {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0]; // HH:MM:SS
  return `${date} ${time}`; // Kết hợp thành DATETIME
}

// Hàm chụp ảnh từ ESP32
captureBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(esp32Url);
    if (response.ok) {
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      photo.src = objectURL;
      alert("Photo captured successfully!");
    } else {
      alert("Failed to capture photo from ESP32.");
    }
  } catch (error) {
    console.error("Error capturing photo:", error);
    alert("Error capturing photo from ESP32.");
  }
});

// Hàm lưu ảnh lên server
saveBtn.addEventListener("click", async () => {
  try {
    // Create an image element to load the captured photo
    const imgBlob = await fetch(photo.src).then((res) => res.blob());
    const img = new Image();
    const objectURL = URL.createObjectURL(imgBlob);
    img.src = objectURL;

    // Wait until the image is loaded
    img.onload = async () => {
      // Create a canvas to convert the image to PNG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      // Convert the canvas content to PNG format
      canvas.toBlob(async (pngBlob) => {
        const formData = new FormData();

        // Add the PNG image data to the form
        formData.append("image", pngBlob, "photo.png"); // Save as PNG
        formData.append("name", nameInput.value); // Name of the user
        formData.append("datetime", getCurrentDatetime()); // Current datetime

        // Send POST request to upload the image
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.text();
          alert("Photo saved: " + result);
        } else {
          alert("Failed to save photo to server.");
        }
      }, "image/png"); // Ensure the format is PNG
    };
  } catch (error) {
    console.error("Error saving photo:", error);
    alert("Error saving photo to server.");
  }
});
