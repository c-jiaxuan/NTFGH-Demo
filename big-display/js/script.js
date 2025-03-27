document.addEventListener("DOMContentLoaded", () => {
    fetch("/data/appStatus") // Replace with actual API URL
        .then(response => response.json())
        .then(data => {
            const imgElement = document.querySelector("img.background-media");
            const videoElement = document.querySelector("video.background-media");

            if (data.status === 1) {
                imgElement.src = "img/prevent-virus.png";
                imgElement.style.display = "block";
                videoElement.style.display = "none";
            } else if (data.status === 2) {
                videoElement.querySelector("source").src = "vid/video.mp4";
                videoElement.load(); // Reload video source
                imgElement.style.display = "none";
                videoElement.style.display = "block";
            }
        })
        .catch(error => console.error("Error fetching API:", error));
});
