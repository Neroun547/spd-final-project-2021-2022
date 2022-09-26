import { ApiService } from "../../../services/api-call.service.js";

const previewVideo = document.querySelector(".preview-video");
const recordingVideo = document.querySelector(".recording-video");
const startBtn = document.querySelector(".start-recording-btn");
const stopBtn = document.querySelector(".stop-recording-btn");
const wrapperStreamVideo = document.querySelector(".wrapper__preview-video");
const wrapperRecordingVideo = document.querySelector(".wrapper__recording-video");
const tryAgainBtn = document.querySelector(".try-again-btn");
const saveVideoForm = document.querySelector(".save_video");
const wrapperFormCheckBox = document.querySelector(".wrapper__form-checkbox");

const apiService = new ApiService();
let recordedBlobWebm;
let recordedBlobMp4;

function startRecording(stream) {
    let recorder = new MediaRecorder(stream);
    let data = [];

    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.start();

    let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(event.name);
    });

    return Promise.all([stopped])
        .then(() => data);
}

function stop(stream) {
    stream.getTracks().forEach((track) => track.stop());
}


startBtn.addEventListener("click", () => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream) => {
        previewVideo.srcObject = stream;
        previewVideo.captureStream = previewVideo.captureStream || previewVideo.mozCaptureStream;
        return new Promise((resolve) => previewVideo.onplaying = resolve);
    }).then(() => startRecording(previewVideo.captureStream()))
        .then ((recordedChunks) => {
            recordedBlobWebm = new Blob(recordedChunks, { type: "video/webm" });
            recordedBlobMp4 = new File(recordedChunks, "video.mp4", { type: "video/mp4" });

            recordingVideo.src = URL.createObjectURL(recordedBlobWebm);
        })
        .catch((error) => {
            if (error.name === "NotFoundError") {
                console.log("Camera or microphone not found. Can't record.");
            } else {
                console.log(error);
            }
        });
}, false);

stopBtn.addEventListener("click", () => {
   stop(previewVideo.srcObject);
   wrapperStreamVideo.remove();

   wrapperRecordingVideo.style.display = "block";
});

tryAgainBtn.addEventListener("click", () => {
   window.location.reload();
});

wrapperFormCheckBox.addEventListener("click", function () {

   if(this.value === "on") {
       this.value = "off";
   } else {
       this.value = "on";
   }
});

saveVideoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("file", recordedBlobMp4);
    formData.append("name", e.target[0].value);
    formData.append("description", e.target[1].value);
    formData.append("isPrivate", e.target[2].value);

    await fetch("/my-video/upload-new-video", {
        method: "POST",
        body: formData
    });

    window.location.reload();
});

