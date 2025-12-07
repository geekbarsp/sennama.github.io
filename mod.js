/* --- CONFIGURATION --- */
const totalImages = 10;
const videoFiles = [
    'fortnite.mp4', 
    'fortnite2.mp4', 
    'peak.mp4', 
    'rvty.mp4', 
    'rvty2.mp4', 
    'warframe.mp4'
];
const totalSlides = totalImages + videoFiles.length; // 16 slides total

let currentIndex = 1;
let isPlaying = true;
let autoPlayInterval = null;
const frameElement = document.querySelector('.photo-frame');

/* --- SLIDESHOW LOGIC --- */

function showSlide(index) {
    let fileName, isVideo = false;

    // Clear frame and reset interval
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    frameElement.innerHTML = '';
    
    // 1. Determine file type based on index
    if (index <= totalImages) {
        // Slides 1-10 are images
        fileName = `sweet${index}.png`;
        isVideo = false;
    } else {
        // Slides 11-16 are videos
        const videoIndex = index - totalImages; // 11 becomes index 1, 12 becomes index 2, etc.
        fileName = videoFiles[videoIndex - 1]; 
        isVideo = true;
    }

    // 2. Insert the appropriate HTML element
    if (isVideo) {
        // Use <video> tag
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
            nextPhoto(); 
        };
    
    } else {
        // Use <img> tag for photos
        frameElement.innerHTML = `
            <img id="current-media" src="${fileName}" alt="Our sweet memory">
        `;
        // Restart autoplay for static images
        startAutoPlay();
    }
}

function nextPhoto() {
    currentIndex++;
    if (currentIndex > totalSlides) currentIndex = 1; // Cycle through all 16 slides
    showSlide(currentIndex);
}

function prevPhoto() {
    currentIndex--;
    if (currentIndex < 1) currentIndex = totalSlides;
    showSlide(currentIndex);
}

/* --- AUTOPLAY & CONTROLS --- */
function startAutoPlay() {
    // Only start if not already running and we are on an image slide
    if (!autoPlayInterval && currentIndex <= totalImages) {
        autoPlayInterval = setInterval(nextPhoto, 3000); // Change every 3 seconds
    }
}

// ------------------- AUDIO PLAYER SCRIPT -------------------

// Select elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.querySelector('.progress-container');
const time = document.getElementById('time');

// ------------------- AUTOPLAY HANDLER -------------------
window.addEventListener('load', () => {
  // Start muted (browsers allow muted autoplay)
  audio.volume = 0;
  audio.muted = true;

  audio.play()
    .then(() => {
      console.log('Autoplay started (muted)');
      // Fade-in after short delay
      setTimeout(() => {
        audio.muted = false;
        let vol = 0;
        const fadeIn = setInterval(() => {
          if (vol < 0.4) {  // Target 80% volume
            vol += 0.02;
            audio.volume = vol;
          } else {
            clearInterval(fadeIn);
          }
        }, 100);
      }, 800);
      playBtn.textContent = '❚❚'; // Show pause icon
    })
    .catch(() => {
      console.log('Autoplay blocked by browser');
    });
});

// If autoplay fails, play when user first interacts
document.addEventListener('click', () => {
  if (audio.paused) {
    audio.muted = false;
    audio.volume = 0.8;
    audio.play().catch(err => console.log(err));
    playBtn.textContent = '❚❚';
  }
}, { once: true });

// ------------------- PLAY / PAUSE TOGGLE -------------------
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = '❚❚'; // Pause icon
  } else {
    audio.pause();
    playBtn.textContent = '►'; // Play icon
  }
});

// ------------------- PROGRESS BAR UPDATE -------------------
audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100 || 0;
  progressBar.style.width = percent + '%';

  let minutes = Math.floor(audio.currentTime / 60);
  let seconds = Math.floor(audio.currentTime % 60);
  if (seconds < 10) seconds = '0' + seconds;
  time.textContent = `${minutes}:${seconds}`;
});

// ------------------- SEEK FUNCTION -------------------
progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

audio.volume = 0.5; // sets volume to half (50%)

// Initialize the first slide
showSlide(currentIndex);


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