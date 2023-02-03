//GET ELEMENTS

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const ranges = player.querySelectorAll('.player__slider');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');

//BUILD FUNCITONS

function togglePlay() {
    const method = video.paused ? "play" : "pause"
    video[method]()
}

function updateButton() {
    const icon = video.paused ? '▶' : '❚ ❚'
    toggle.textContent = icon
}


function skip() {
    video.currentTime += parseFloat(this.dataset.skip)
}

function handleRangesUpdate() {
    video[this.name] = this.value
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100
    progressBar.style.flexBasis = `${percent}%`
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
    video.currentTime = parseFloat(scrubTime)
}

//SETUP EVENT LISTENERS

video.addEventListener("click", togglePlay)
toggle.addEventListener("click", togglePlay)

video.addEventListener("play", updateButton)
video.addEventListener("pause", updateButton)

skipButtons.forEach(button => button.addEventListener("click", skip))

ranges.forEach(range => range.addEventListener("change", handleRangesUpdate))
ranges.forEach(range => range.addEventListener("mousemove", handleRangesUpdate))

video.addEventListener("timeupdate", handleProgress)

let mousedown = false
progress.addEventListener("mousedown", () => mousedown = true)
progress.addEventListener("mouseup", () => mousedown = false)
progress.addEventListener("mousemove", (e) => mousedown && scrub(e))
progress.addEventListener("click", scrub)