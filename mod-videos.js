/* --- CONFIGURATION (Videos) --- */
const videoFiles = [
    'fortnite.mp4', 
    'fortnite2.mp4', 
    'peak.mp4', 
    'rvty.mp4', 
    'rvty2.mp4', 
    'warframe.mp4'
];
const totalVideos = videoFiles.length;
let currentVideoIndex = 0; // Start at array index 0
let isPlaying = true; // This will mostly control the 'pause' behavior between videos
let autoPlayInterval = null; // Used for auto-advance in case a video doesn't end cleanly or for manual pause
const frameElement = document.querySelector('.photo-frame');


/* --- VIDEO SLIDESHOW LOGIC --- */

function showMedia(index) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    frameElement.innerHTML = ''; // Clear existing content

    const fileName = videoFiles[index]; // Use array index directly
    
    frameElement.innerHTML = `
        <video id="current-media" src="${fileName}" autoplay playsinline></video>
    `;
    const videoElement = document.getElementById('current-media');
    
    // Volume Fix: Explicitly set volume and try to play
    videoElement.volume = 1.0; 
    videoElement.play().catch(error => {
        console.warn("Autoplay failed due to sound block. User may need to interact.");
    });

    // Fullscreen Fix: Click the video to enter true fullscreen
    videoElement.addEventListener('click', () => {
        if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen();
        }
    });
    
    // Auto-Advance: Automatically move to the next slide when the video finishes
    videoElement.onended = function() {
        nextMedia(); 
    };

    // If a video doesn't end, and autoplay is on, ensure it still advances after a while
    if (isPlaying) {
        autoPlayInterval = setTimeout(nextMedia, 30000); // Advance after 30 seconds if video doesn't end
    }
}

function nextMedia() {
    currentVideoIndex++;
    if (currentVideoIndex >= totalVideos) currentVideoIndex = 0;
    showMedia(currentVideoIndex);
}

function prevMedia() {
    currentVideoIndex--;
    if (currentVideoIndex < 0) currentVideoIndex = totalVideos - 1;
    showMedia(currentVideoIndex);
}

/* --- AUTOPLAY & CONTROLS --- */
function togglePlay() {
    const btn = document.getElementById('play-pause');
    const videoElement = document.getElementById('current-media');

    if (isPlaying) {
        if (videoElement) videoElement.pause();
        clearInterval(autoPlayInterval); // Clear auto-advance timeout
        autoPlayInterval = null;
        btn.textContent = "▶ Play";
    } else {
        if (videoElement) videoElement.play();
        // If the video is playing, start the auto-advance timeout again
        if (videoElement && !videoElement.ended) {
            autoPlayInterval = setTimeout(nextMedia, 30000);
        }
        btn.textContent = "⏸ Pause";
    }
    isPlaying = !isPlaying;
}

// Initialize the first video
showMedia(currentVideoIndex);


/* --- FLOATING HEARTS LOGIC (Unchanged) --- */
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤';
    
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    heart.style.animationDuration = Math.random() * 5 + 5 + "s";
    
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

setInterval(createHeart, 300);