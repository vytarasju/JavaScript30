const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const rgbSplitButton = document.querySelector(".rgbSplit")
const redEffectButton = document.querySelector(".redEffect")

let filterID = ""

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            video.srcObject = localMediaStream
            video.play()
        })
        .catch(err => console.error("No access to webcam", err))
} 

function paintToCanvas() {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        let pixels = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight)
        
        applyFilter(pixels)
        ctx.putImageData(pixels, 0, 0)
    }, 16)
}

function applyFilter(pixels) {
    if (filterID === "redEffect") {
        return pixels = redEffect(pixels)
    }
    if (filterID === "rgbSplit") {
        return pixels = rgbSplit(pixels)
    }
    else return
}

function takePhoto() {
    snap.currentTime = 0
    snap.play()

    const data = canvas.toDataURL("image/jpeg")
    const link = document.createElement("a")
    link.href = data
    link.setAttribute("download", "Krasotka")
    link.innerHTML = `<img src="${data}" alt="Very good looking :)">`
    strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i +=4){
        pixels.data[i + 0] += 100   //R
        pixels.data[i + 1] -= 50    //G
        pixels.data[i + 2] *= 0.5   //B
    }
    return pixels
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i +=4){
        pixels.data[i - 150] = pixels.data[i + 0]   //R
        pixels.data[i + 100] = pixels.data[i + 1]   //G
        pixels.data[i - 150] = pixels.data[i + 2]   //B
    }
    ctx.globalAlpha = 0.1
    return pixels
}

function greenScreen(pixels) {
    const levels = {}

    document.querySelectorAll(".rgb input").forEach((input) => {
        levels[input.name] = input.value
    })

    for (let i = 0; i < pixels.data.length; i += 4){
        red = pixels.data[i + 0]
        green = pixels.data[i + 1]
        blue = pixels.data[i + 2]
        alpha = pixels.data[i + 3]

        if (red >= levels.rmin
         && green >= levels.gmin
         && blue >= levels.bmin
         && red <= levels.rmax
         && green <= levels.gmax
         && blue <= levels.bmax) {
            pixels.data[i + 3] = 0
         }
    }

    return pixels
}

getVideo()

video.addEventListener("canplay", paintToCanvas)
rgbSplitButton.addEventListener("click", () => {
    if(filterID !== "rgbSplit") filterID="rgbSplit"
    else if(filterID === "rgbSplit" ) {
        filterID=""
        ctx.globalAlpha = 1
    }
})
redEffectButton.addEventListener("click", () => {
    if(filterID !== "redEffect") filterID="redEffect"
    else if(filterID === "redEffect" ) filterID=""
})