const video = document.getElementById("video");
const videoPlayer = document.getElementById("videoPlayer");
const fileInput = document.getElementById("fileInput");
const toggleButton = document.querySelector(".toggleButton");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress__filled");
const sliders = document.querySelectorAll(".controls__slider");
const skipBtns = document.querySelectorAll("[data-skip]");
const fullscreenButton = document.querySelector(".fullscreenButton");

fileInput.addEventListener("change", handleFileSelect);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    video.src = fileURL;
    videoPlayer.style.display = "block";
    resetInactivityTimer();
  }
}

function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

function updateToggleButton() {
  toggleButton.innerHTML = video.paused ? "►" : "❚ ❚";
}

function handleProgress() {
  const progressPercentage = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${progressPercentage}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function handleSliderUpdate() {
  video[this.name] = this.value;
}

function handleSkip() {
  video.currentTime += +this.dataset.skip;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    videoPlayer.requestFullscreen().catch(err => {
      alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

function updateFullscreenButton() {
  fullscreenButton.innerHTML = document.fullscreenElement ? "⛶" : "⛶";
}

let inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  videoPlayer.classList.remove("hide-controls");
  inactivityTimer = setTimeout(() => {
    videoPlayer.classList.add("hide-controls");
  }, 5000);
}

function handleMouseMove() {
  resetInactivityTimer();
}

toggleButton.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateToggleButton);
video.addEventListener("pause", updateToggleButton);
video.addEventListener("timeupdate", handleProgress);

sliders.forEach((slider) => {
  slider.addEventListener("change", handleSliderUpdate);
});

skipBtns.forEach((btn) => {
  btn.addEventListener("click", handleSkip);
});

fullscreenButton.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", updateFullscreenButton);

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mouseup", () => (mousedown = false));

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") togglePlay();
});

// Hide controls after 5 seconds of mouse inactivity
videoPlayer.addEventListener("mousemove", handleMouseMove);
videoPlayer.addEventListener("mouseleave", () => videoPlayer.classList.add("hide-controls"));
videoPlayer.addEventListener("mouseenter", () => videoPlayer.classList.remove("hide-controls"));

resetInactivityTimer();  // Initialize the inactivity timer
