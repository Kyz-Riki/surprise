// Theme Management
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme") || "light";

if (currentTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.textContent = "☀️ Light";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  if (current === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.textContent = "🌙 Dark";
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️ Light";
    localStorage.setItem("theme", "dark");
  }
});

// Background Music Management
let backgroundAudio;
let musicPlaying = false;
let musicToggle = document.getElementById("musicToggle");
const musicEnabled = localStorage.getItem("musicEnabled") !== "false";

// Initialize background music
function initBackgroundMusic() {
  backgroundAudio = new Audio("audio/hbd.mp3");
  backgroundAudio.loop = true;
  backgroundAudio.volume = 0.3; // Adjust volume (0.0 to 1.0)

  // Handle audio events
  backgroundAudio.addEventListener("loadeddata", () => {
    console.log("Audio loaded successfully");
  });

  backgroundAudio.addEventListener("error", (e) => {
    console.log("Audio loading error:", e);
    console.log("Make sure audio/hbd.mp3 file exists");
  });

  backgroundAudio.addEventListener("canplaythrough", () => {
    console.log("Audio ready to play");
  });
}

function startBackgroundMusic() {
  if (!backgroundAudio) {
    initBackgroundMusic();
  }

  if (!musicPlaying) {
    backgroundAudio
      .play()
      .then(() => {
        musicPlaying = true;
        musicToggle.textContent = "🎵 ON";
        musicToggle.classList.add("playing");
        console.log("Music started playing");
      })
      .catch((error) => {
        console.log("Failed to play audio:", error);
        // Fallback: User needs to interact first due to browser autoplay policy
        showMusicPrompt();
      });
  }
}

function stopBackgroundMusic() {
  if (backgroundAudio && musicPlaying) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    musicPlaying = false;
    musicToggle.textContent = "🔇 OFF";
    musicToggle.classList.remove("playing");
    console.log("Music stopped");
  }
}

function showMusicPrompt() {
  // Show prompt if autoplay fails
  const musicPrompt = document.createElement("div");
  musicPrompt.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--card-bg);
                border: 4px solid var(--outline);
                padding: 20px;
                text-align: center;
                z-index: 10000;
                font-size: 12px;
            `;
  musicPrompt.innerHTML = `
                <p>🎵 Klik untuk memutar musik!</p>
                <button onclick="this.parentNode.remove(); startBackgroundMusic();" 
                        style="background: var(--primary-accent); color: var(--bg-color); border: 2px solid var(--outline); padding: 10px 15px; margin-top: 10px; cursor: pointer; font-family: inherit; font-size: 10px;">
                    ▶️ Play Music
                </button>
                <button onclick="this.parentNode.remove();" 
                        style="background: var(--secondary); color: var(--bg-color); border: 2px solid var(--outline); padding: 10px 15px; margin-top: 10px; margin-left: 10px; cursor: pointer; font-family: inherit; font-size: 10px;">
                    ❌ Skip
                </button>
            `;
  document.body.appendChild(musicPrompt);
}

// Music toggle button
musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    stopBackgroundMusic();
    localStorage.setItem("musicEnabled", "false");
  } else {
    startBackgroundMusic();
    localStorage.setItem("musicEnabled", "true");
  }
});

// Initialize music state
if (!musicEnabled) {
  musicToggle.textContent = "🔇 OFF";
}

// Initialize audio object early
initBackgroundMusic();

// Function untuk auto line break pada text panjang
function formatTextForMobile(text, maxLength = 15) {
  if (window.innerWidth <= 768) {
    // Untuk mobile, bagi menjadi 2 baris yang seimbang
    const words = text.split(" ");
    const midPoint = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, midPoint).join(" ");
    const secondLine = words.slice(midPoint).join(" ");

    return `${firstLine}<br>${secondLine}`;
  }
  return text;
}

// Update initIntroText function
function initIntroText() {
  const typingText = document.getElementById("typingText");
  const originalText = "Selamat Ulang Tahun Keyshaaa! 💖";
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Untuk mobile: text dengan line break dan fade animation
    const formattedText = formatTextForMobile(originalText);
    typingText.innerHTML = formattedText;
    typingText.style.whiteSpace = "normal";
    typingText.style.overflow = "visible";
    typingText.style.borderRight = "none";
    typingText.style.width = "auto";
    typingText.style.animation = "fadeInUp 2s ease forwards";
    typingText.style.animationDelay = "1s";
    typingText.style.opacity = "0";
  } else {
    // Untuk desktop: typing animation
    typingText.textContent = originalText;
    typingText.style.whiteSpace = "nowrap";
    typingText.style.overflow = "hidden";
    typingText.style.borderRight = "3px solid var(--primary-accent)";
    typingText.style.width = "fit-content";
    typingText.style.animation =
      "typing 3s steps(30, end), blink-caret 0.75s step-end infinite";
    typingText.style.animationDelay = "0s";
    typingText.style.opacity = "1";
  }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Delay init text sedikit untuk memastikan CSS sudah loaded
  setTimeout(() => {
    initIntroText();
  }, 100);

  // Re-check saat window diresize
  window.addEventListener("resize", () => {
    if (document.getElementById("introScreen").classList.contains("hidden")) {
      return; // Skip jika intro sudah selesai
    }
    setTimeout(() => {
      initIntroText();
    }, 100);
  });
});

// Update intro animation timing
setTimeout(() => {
  document.getElementById("introScreen").classList.add("hidden");

  // Start background music after intro with delay
  setTimeout(() => {
    console.log("Attempting to start music...");
    if (musicEnabled) {
      startBackgroundMusic();
    } else {
      console.log("Music disabled by user preference");
    }
  }, 1000);
}, 4500); // Tambah sedikit delay untuk mobile animation

// Create decorative stars - Update untuk distribusi yang lebih seimbang
function createStars() {
  const stars = document.getElementById("stars");

  // Buat zona untuk distribusi bintang yang lebih merata
  const zones = [
    { x: [0, 25], y: [0, 50] }, // Kiri atas
    { x: [75, 100], y: [0, 50] }, // Kanan atas
    { x: [0, 30], y: [50, 100] }, // Kiri bawah
    { x: [70, 100], y: [50, 100] }, // Kanan bawah
    { x: [25, 75], y: [0, 30] }, // Tengah atas
    { x: [25, 75], y: [70, 100] }, // Tengah bawah
  ];

  // Buat 3-4 bintang per zona untuk distribusi merata
  zones.forEach((zone, zoneIndex) => {
    const starsInZone = 3 + Math.floor(Math.random() * 2); // 3-4 bintang per zona

    for (let i = 0; i < starsInZone; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.textContent = "✨";

      // Posisi acak dalam zona
      const x = zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]);
      const y = zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]);

      star.style.left = x + "%";
      star.style.top = y + "%";
      star.style.animationDelay = zoneIndex * 0.5 + Math.random() * 2 + "s";
      star.style.animationDuration = 2 + Math.random() * 2 + "s"; // Variasi durasi

      stars.appendChild(star);
    }
  });
}
createStars();

// Modal Management - Gabungkan semua fungsi openModal menjadi satu
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
  if (modalId === "galleryModal") {
    generateGallery();
  } else if (modalId === "surpriseModal") {
    generateSurprise();
  } else if (modalId === "playlistModal") {
    generatePlaylist();
  }
}

// Close modal - Hapus duplikasi dan gabungkan
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
  if (modalId === "playlistModal" && currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    isPlaying = false;
    document.getElementById("playPauseBtn").textContent = "▶️";
  }
}

// Love Letter
function openLetter() {
  const letterContent = document.getElementById("letterContent");
  letterContent.classList.add("show");

  // Play a simple beep sound (using Web Audio API)
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = "square";
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.5
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// Gallery
function generateGallery() {
  const gallery = document.getElementById("galleryGrid");
  gallery.innerHTML = "";

  const memories = [
    {
      text: "Senyum manismu yang selalu membuatku jatuh cinta 😍",
      image: "img/1.jpg",
    },
    {
      text: "Cantiknya kamu yang tak pernah bosan kupandang 💖",
      image: "img/2.jpg",
    },
    { text: "Pose lucumu yang bikin hari-hariku cerah ✨", image: "img/3.jpg" },
    {
      text: "Mata indahmu yang seperti bintang di langit 🌟",
      image: "img/4.jpg",
    },
    { text: "Gaya anggunmu yang membuatku bangga 👑", image: "img/5.jpg" },
    {
      text: "Tawa riang yang selalu menghangatkan hatiku 😊",
      image: "img/6.jpg",
    },
    {
      text: "Kecantikan alami yang membuatku terpesona 🌸",
      image: "img/7.jpg",
    },
    {
      text: "Ekspresi manis yang tak pernah gagal membuatku bahagia 💕",
      image: "img/8.jpg",
    },
    { text: "Pesona dirimu yang sempurna di mataku 🥰", image: "img/9.jpg" },
  ];

  memories.forEach((memory, index) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.backgroundImage = `url('${memory.image}')`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    card.onclick = () => showMemory(memory.text, memory.image);

    // Add overlay for better text visibility
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    overlay.innerHTML =
      '<span style="color: white; font-size: 20px;">👁️</span>';

    card.appendChild(overlay);

    // Show overlay on hover
    card.addEventListener("mouseenter", () => {
      overlay.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      overlay.style.opacity = "0";
    });

    gallery.appendChild(card);
  });
}

function showMemory(memoryText, imageSrc) {
  // Create modal for displaying full image
  const imageModal = document.createElement("div");
  imageModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  `;

  const image = document.createElement("img");
  image.src = imageSrc;
  image.style.cssText = `
    max-width: 90%;
    max-height: 70%;
    object-fit: contain;
    border: 4px solid var(--outline);
  `;

  const caption = document.createElement("p");
  caption.textContent = `💖 ${memoryText}`;
  caption.style.cssText = `
    color: white;
    font-family: inherit;
    font-size: 12px;
    text-align: center;
    margin-top: 20px;
    padding: 0 20px;
    line-height: 1.5;
  `;

  const closeText = document.createElement("p");
  closeText.textContent = "Klik untuk menutup";
  closeText.style.cssText = `
    color: white;
    font-size: 10px;
    margin-top: 10px;
    opacity: 0.7;
  `;

  imageModal.appendChild(image);
  imageModal.appendChild(caption);
  imageModal.appendChild(closeText);

  // Close modal when clicked
  imageModal.onclick = () => {
    document.body.removeChild(imageModal);
  };

  document.body.appendChild(imageModal);

  // Add fade in animation
  imageModal.style.opacity = "0";
  setTimeout(() => {
    imageModal.style.transition = "opacity 0.3s ease";
    imageModal.style.opacity = "1";
  }, 10);
}

// Game
let gameActive = false;
let score = 0;
let gameTimer;

function startGame() {
  if (gameActive) return;

  gameActive = true;
  score = 0;
  updateScore();

  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";

  // Spawn hearts every second
  gameTimer = setInterval(() => {
    if (gameActive) {
      spawnHeart();
    }
  }, 800);

  // End game after 30 seconds
  setTimeout(() => {
    endGame();
  }, 15000);
}

function spawnHeart() {
  const gameArea = document.getElementById("gameArea");
  const heart = document.createElement("div");
  heart.className = "heart-target";
  heart.textContent = "💖";
  heart.style.left = Math.random() * (gameArea.offsetWidth - 40) + "px";
  heart.style.top = Math.random() * (gameArea.offsetHeight - 40) + "px";
  heart.style.animationDelay = Math.random() * 2 + "s";

  heart.onclick = () => {
    score += 10;
    updateScore();
    heart.remove();

    // Create floating score
    const floatingScore = document.createElement("div");
    floatingScore.textContent = "+10";
    floatingScore.style.position = "absolute";
    floatingScore.style.left = heart.style.left;
    floatingScore.style.top = heart.style.top;
    floatingScore.style.color = "var(--primary-accent)";
    floatingScore.style.fontSize = "16px";
    floatingScore.style.fontWeight = "bold";
    floatingScore.style.pointerEvents = "none";
    floatingScore.style.animation = "floatUp 1s ease forwards";
    gameArea.appendChild(floatingScore);

    setTimeout(() => floatingScore.remove(), 1000);
  };

  gameArea.appendChild(heart);

  // Remove heart after 3 seconds if not clicked
  setTimeout(() => {
    if (heart.parentNode) {
      heart.remove();
    }
  }, 3000);
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

function endGame() {
  gameActive = false;
  clearInterval(gameTimer);

  let message = "";
  if (score >= 100) {
    message = "Amazing! Kamu hebat sekali! 🏆";
  } else if (score >= 50) {
    message = "Great job! Kamu keren! 🌟";
  } else {
    message = "Good try! Ayo coba lagi! 💪";
  }

  setTimeout(() => {
    alert(`🎮 Game Over!\n\nSkor Akhir: ${score} ❤️\n${message}`);
  }, 500);
}

function resetGame() {
  gameActive = false;
  clearInterval(gameTimer);
  score = 0;
  updateScore();

  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML =
    '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 14px; text-align: center;">Klik tombol Start untuk mulai!</div>';
}

// Add confetti function
function createConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${
        ["#ff006e", "#3a86ff", "#ffbe0b", "#fb5607"][
          Math.floor(Math.random() * 4)
        ]
      };
      left: ${Math.random() * 100}%;
      top: -10px;
      z-index: 1000;
      animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
      animation-delay: ${Math.random() * 2}s;
    `;
    document.body.appendChild(confetti);

    // Remove confetti after animation
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 5000);
  }
}

// Surprise function - Updated to generate modal content
function generateSurprise() {
  const surpriseContainer = document.getElementById("surpriseContainer");
  surpriseContainer.innerHTML = "";

  // Create confetti effect
  createConfetti();

  const surprises = [
    {
      text: "🎂 Kiww siapa nichhh!",
      image: "img/surprise1.jpg", // Ganti dari .png ke .jpg
    },
    {
      text: "🎁 Lopyuu bupp",
      image: "img/surprise2.jpg",
    },
  ];

  // Add surprise message
  const messageDiv = document.createElement("div");
  messageDiv.style.cssText = `
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: var(--secondary);
    border: 3px solid var(--outline);
    color: var(--bg-color);
    font-size: 10px;
    line-height: 1.6;
  `;
  messageDiv.innerHTML = `
    <h3 style="color: var(--bg-color); margin-bottom: 15px; font-size: 12px;">🎉 SURPRISE! 🎉</h3>
    <p>Selamat ulang tahun sayang! Semoga semua impianmu terwujud! 💖</p>
  `;

  surpriseContainer.appendChild(messageDiv);

  // Create gallery grid for surprise photos
  const surpriseGrid = document.createElement("div");
  surpriseGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  `;

  surprises.forEach((surprise, index) => {
    const card = document.createElement("div");
    card.className = "surprise-card";
    card.style.cssText = `
      aspect-ratio: 1;
      background-image: url('${surprise.image}');
      background-size: cover;
      background-position: center;
      border: 3px solid var(--outline);
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      animation: slideUp 0.5s ease forwards;
      animation-delay: ${index * 0.3}s;
      opacity: 0;
    `;

    card.onclick = () => showSurpriseMemory(surprise.text, surprise.image);

    // Add overlay for better text visibility
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    overlay.innerHTML =
      '<span style="color: white; font-size: 24px;">🎁</span>';

    card.appendChild(overlay);

    // Show overlay on hover
    card.addEventListener("mouseenter", () => {
      overlay.style.opacity = "1";
      card.style.transform = "scale(1.05)";
    });

    card.addEventListener("mouseleave", () => {
      overlay.style.opacity = "0";
      card.style.transform = "scale(1)";
    });

    surpriseGrid.appendChild(card);
  });

  surpriseContainer.appendChild(surpriseGrid);
}

function showSurpriseMemory(surpriseText, imageSrc) {
  // Create modal for displaying full surprise image
  const imageModal = document.createElement("div");
  imageModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10001;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  `;

  const image = document.createElement("img");
  image.src = imageSrc;
  image.style.cssText = `
    max-width: 90%;
    max-height: 70%;
    object-fit: contain;
    border: 4px solid var(--primary-accent);
  `;

  const caption = document.createElement("p");
  caption.textContent = `🎁 ${surpriseText}`;
  caption.style.cssText = `
    color: white;
    font-family: inherit;
    font-size: 12px;
    text-align: center;
    margin-top: 20px;
    padding: 0 20px;
    line-height: 1.5;
  `;

  const closeText = document.createElement("p");
  closeText.textContent = "Klik untuk menutup";
  closeText.style.cssText = `
    color: white;
    font-size: 10px;
    margin-top: 10px;
    opacity: 0.7;
  `;

  imageModal.appendChild(image);
  imageModal.appendChild(caption);
  imageModal.appendChild(closeText);

  // Close modal when clicked
  imageModal.onclick = () => {
    document.body.removeChild(imageModal);
  };

  document.body.appendChild(imageModal);

  // Add fade in animation
  imageModal.style.opacity = "0";
  setTimeout(() => {
    imageModal.style.transition = "opacity 0.3s ease";
    imageModal.style.opacity = "1";
  }, 10);
}

// Playlist Management
let currentPlaylist = [];
let currentSongIndex = 0;
let currentAudio = null;
let isPlaying = false;
let isShuffling = false;
let isRepeating = false;

// Sample playlist - nanti kamu bisa ganti sesuai lagu yang ada
const playlistData = [
  {
    title: "Anata no Koibito ni Naritai",
    artist: "ChoQmay",
    file: "audio/anata no koibito ni naritai.mp3",
    duration: "3:57",
  },
  {
    title: "bansakai 晩餐歌",
    artist: "tuki.",
    file: "audio/bansakai 晩餐歌.mp3",
    duration: "3:40",
  },
  {
    title: "Hare Hare ya 晴れ晴れや",
    artist: "Sou",
    file: "audio/hare hare ya .mp3",
    duration: "3:29",
  },
  {
    title: "「たぶん」(Tabun)",
    artist: "Yoasobi",
    file: "audio/yoasobi tabun.mp3",
    duration: "4:24",
  },
  {
    title: "Strangers",
    artist: "Proderics ft. melodybloom",
    file: "audio/proderics melodybloom strangers.mp3",
    duration: "2:16",
  },
  {
    title: "Flatline",
    artist: "Justin Bieber",
    file: "audio/justin bieber flatline.mp3",
    duration: "3:40",
  },
  {
    title: "The Strangler",
    artist: "Golden Brown",
    file: "audio/golden brown the strangler.mp3",
    duration: "3:33",
  },
  {
    title: "Headlock ",
    artist: "Imogen Heap",
    file: "audio/imogen heap headlock.mp3",
    duration: "3:35",
  },
  {
    title: "Tourner Dans Le Vide",
    artist: "Indila",
    file: "audio/indila tourner dans le vide.mp3",
    duration: "4:10",
  },
  {
    title: "Ano Yume wo Nazotte",
    artist: "Yoasobi",
    file: "audio/yoasobi ano yume wo nazotte.mp3",
    duration: "3:59",
  },
];

function generatePlaylist() {
  currentPlaylist = [...playlistData];
  const playlist = document.getElementById("playlist");
  playlist.innerHTML = "";

  currentPlaylist.forEach((song, index) => {
    const playlistItem = document.createElement("div");
    playlistItem.className = "playlist-item";
    playlistItem.onclick = () => playSong(index);

    playlistItem.innerHTML = `
      <div class="song-number">${(index + 1).toString().padStart(2, "0")}</div>
      <div class="song-details">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <div class="song-duration">${song.duration}</div>
    `;

    playlist.appendChild(playlistItem);
  });
}

function playSong(index) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  currentSongIndex = index;
  const song = currentPlaylist[currentSongIndex];

  // Update UI
  updateNowPlaying(song);
  updatePlaylistUI();

  // Create new audio
  currentAudio = new Audio(song.file);
  currentAudio.volume = document.getElementById("volumeSlider").value / 100;

  // Audio event listeners
  currentAudio.addEventListener("loadedmetadata", () => {
    document.getElementById("totalTime").textContent = formatTime(
      currentAudio.duration
    );
  });

  currentAudio.addEventListener("timeupdate", updateProgress);

  currentAudio.addEventListener("ended", () => {
    if (isRepeating) {
      currentAudio.currentTime = 0;
      currentAudio.play();
    } else {
      nextSong();
    }
  });

  currentAudio.addEventListener("error", (e) => {
    console.log(`Error loading song: ${song.file}`);
    nextSong(); // Skip to next song if current fails
  });

  // Play the song
  currentAudio
    .play()
    .then(() => {
      isPlaying = true;
      document.getElementById("playPauseBtn").textContent = "⏸️";
      document.querySelector(".vinyl-record").classList.remove("paused");
    })
    .catch((error) => {
      console.log("Failed to play audio:", error);
    });
}

function togglePlayPause() {
  if (!currentAudio) {
    if (currentPlaylist.length > 0) {
      playSong(0);
    }
    return;
  }

  if (isPlaying) {
    currentAudio.pause();
    isPlaying = false;
    document.getElementById("playPauseBtn").textContent = "▶️";
    document.querySelector(".vinyl-record").classList.add("paused");
  } else {
    currentAudio.play().then(() => {
      isPlaying = true;
      document.getElementById("playPauseBtn").textContent = "⏸️";
      document.querySelector(".vinyl-record").classList.remove("paused");
    });
  }
}

function nextSong() {
  if (isShuffling) {
    const randomIndex = Math.floor(Math.random() * currentPlaylist.length);
    playSong(randomIndex);
  } else {
    const nextIndex = (currentSongIndex + 1) % currentPlaylist.length;
    playSong(nextIndex);
  }
}

function prevSong() {
  if (currentAudio && currentAudio.currentTime > 3) {
    currentAudio.currentTime = 0;
  } else {
    const prevIndex =
      currentSongIndex === 0
        ? currentPlaylist.length - 1
        : currentSongIndex - 1;
    playSong(prevIndex);
  }
}

function toggleShuffle() {
  isShuffling = !isShuffling;
  const shuffleBtn = document.getElementById("shuffleBtn");
  shuffleBtn.classList.toggle("active", isShuffling);
}

function toggleRepeat() {
  isRepeating = !isRepeating;
  const repeatBtn = document.getElementById("repeatBtn");
  repeatBtn.classList.toggle("active", isRepeating);
}

function updateNowPlaying(song) {
  document.querySelector(".current-song-title").textContent = song.title;
  document.querySelector(".current-artist").textContent = song.artist;
}

function updatePlaylistUI() {
  const playlistItems = document.querySelectorAll(".playlist-item");
  playlistItems.forEach((item, index) => {
    item.classList.remove("active", "playing");
    if (index === currentSongIndex) {
      item.classList.add("playing");
    }
  });
}

function updateProgress() {
  if (currentAudio) {
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
    document.getElementById("progressFill").style.width = progress + "%";
    document.getElementById("currentTime").textContent = formatTime(
      currentAudio.currentTime
    );
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function setProgress(e) {
  if (currentAudio) {
    const progressBar = document.getElementById("progressBar");
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    currentAudio.currentTime = percentage * currentAudio.duration;
  }
}

function setVolume(volume) {
  if (currentAudio) {
    currentAudio.volume = volume / 100;
  }
}

// Initialize playlist controls
document.addEventListener("DOMContentLoaded", () => {
  // Player controls
  document
    .getElementById("playPauseBtn")
    .addEventListener("click", togglePlayPause);
  document.getElementById("nextBtn").addEventListener("click", nextSong);
  document.getElementById("prevBtn").addEventListener("click", prevSong);
  document
    .getElementById("shuffleBtn")
    .addEventListener("click", toggleShuffle);
  document.getElementById("repeatBtn").addEventListener("click", toggleRepeat);

  // Progress bar
  document.getElementById("progressBar").addEventListener("click", setProgress);

  // Volume control
  document.getElementById("volumeSlider").addEventListener("input", (e) => {
    setVolume(e.target.value);
  });
});
