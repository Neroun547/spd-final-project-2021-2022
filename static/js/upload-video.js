const loading = document.querySelector(".upload-video-loading");
const uploadVideoBtn = document.querySelector(".upload-video-form-btn");
const videoNameInput = document.querySelector(".name-video");
const videoFileInput = document.querySelector(".upload-new-photo-file-input");

uploadVideoBtn.addEventListener("click", () => {
    if(videoFileInput.value && videoNameInput.value) {
        loading.style.display = "block";
    }
});
