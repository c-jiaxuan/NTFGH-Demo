document.getElementById("start-button").addEventListener("click", function() {
    // Hide overlay
    document.getElementById("overlay").style.display = "none";
    speak(botMessages["start_msg"][0].message, botMessages["start_msg"][0].gesture, false);
    //speak('66 Chinese male civilians were executed by Japanese hojo kempei firing squads at Changi Beach on 20 February 1942 during the Sook Ching operation. Victims were bound, forced to walk into the sea, shot, and subsequently bayoneted or drowned to ensure all were killed');
});