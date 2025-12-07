/* --- FLOATING HEARTS LOGIC (for selection page) --- */
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