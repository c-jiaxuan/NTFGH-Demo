// To replace image with a video
export function replaceImageWithVideo(imageId, videoSrc, options = {}) {
    const imgElement = document.getElementById(imageId);
    if (!imgElement) {
        console.error(`Element with ID '${imageId}' not found.`);
        return;
    }

    const videoElement = document.createElement("video");
    videoElement.src = videoSrc;
    videoElement.controls = options.controls ?? true;
    videoElement.autoplay = options.autoplay ?? true;
    videoElement.loop = options.loop ?? false;
    videoElement.muted = options.muted ?? false;
    videoElement.style.width = options.width || "100%";
    videoElement.style.height = options.height || "auto";

    imgElement.parentNode.replaceChild(videoElement, imgElement);
}

export function util_dispatchEvent(event) {
    console.log("Dispatching event");
    console.log("event type : " + event.type);
    console.log("event      : " + event);
    document.dispatchEvent(event);
}