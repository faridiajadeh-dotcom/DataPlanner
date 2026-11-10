/**
 * DATE PLANNER & LOVE LETTER - RETRO ROMANTIC ENGINE
 * Faithful recreation of the viral TikTok interactive web experience
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIGURATION & STATE
     ========================================================================== */
  const DEFAULT_CONFIG = {
    senderName: 'Ahmad Paridi',
    targetName: 'Titisan Ilahi',
    whatsappNumber: '081281278846', // User can change in settings
    envelopeTag: 'From Ahmad Paridi For Titisan Ilahi',
    dateText: 'Sabtu, 27 Juni 2026',
    timePeriod: 'Sore',
    timeText: '17:00',
    activities: ['Nonton Film', 'Main Game', 'Ngopi Bareng'],
    dressCode: 'Bebas',
    message: 'mantap'
  };

  // Load from URL params or localStorage if available
  const urlParams = new URLSearchParams(window.location.search);
  const config = {
    senderName: urlParams.get('from') || localStorage.getItem('dp_from') || DEFAULT_CONFIG.senderName,
    targetName: urlParams.get('to') || localStorage.getItem('dp_to') || DEFAULT_CONFIG.targetName,
    whatsappNumber: urlParams.get('phone') || localStorage.getItem('dp_phone') || DEFAULT_CONFIG.whatsappNumber,
    envelopeTag: urlParams.get('tag') || `From ${urlParams.get('from') || DEFAULT_CONFIG.senderName} For ${urlParams.get('to') || DEFAULT_CONFIG.targetName}`,
    dateText: DEFAULT_CONFIG.dateText,
    timePeriod: DEFAULT_CONFIG.timePeriod,
    timeText: DEFAULT_CONFIG.timeText,
    activities: [...DEFAULT_CONFIG.activities],
    dressCode: DEFAULT_CONFIG.dressCode,
    message: DEFAULT_CONFIG.message
  };

  let soundEnabled = true;
  let currentStep = 1;
  const totalSteps = 4;

  /* ==========================================================================
     2. SYNTHESIZED WEB AUDIO SOUND EFFECTS (Zero external files needed)
     ========================================================================== */
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type, duration, startVol = 0.15, endVol = 0.001) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(startVol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endVol, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  function playBowRelease() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    // Whoosh + Twang
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) { }
  }

  function playHitPop() {
    if (!soundEnabled) return;
    playTone(587.33, 'sine', 0.12, 0.25, 0.01); // D5
    setTimeout(() => playTone(880, 'sine', 0.2, 0.2, 0.01), 60); // A5
  }

  function playClick() {
    playTone(440, 'triangle', 0.06, 0.1, 0.01);
  }

  function playYayFanfare() {
    if (!soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 'sine', 0.25, 0.2, 0.01);
      }, idx * 110);
    });
  }

  /* ==========================================================================
     3. BACKGROUND FLOATING HEARTS & PARALLAX
     ========================================================================== */
  const particlesContainer = document.getElementById('bgParticles');
  const HEARTS = ['♥', '♡', '💖', '💕', '🌸', '✨'];

  function createFloatingHeart() {
    if (!particlesContainer) return;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    const duration = 8 + Math.random() * 8;
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.fontSize = (10 + Math.random() * 14) + 'px';
    particlesContainer.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, (duration + 2) * 1000);
  }

  // Pre-populate floating hearts
  for (let i = 0; i < 20; i++) {
    setTimeout(createFloatingHeart, i * 400);
  }
  setInterval(createFloatingHeart, 1200);

  // Parallax subtle drift on mouse move
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    const targetArea = document.getElementById('targetArea');
    if (targetArea) {
      targetArea.style.transform = `translate(${mouseX * 8}px, ${mouseY * 6}px)`;
    }
  });

  /* ==========================================================================
     4. PIXEL ART CAT ENGINE
     ========================================================================== */
  const catCanvas = document.getElementById('catCanvas');
  const catCtx = catCanvas ? catCanvas.getContext('2d') : null;

  // Cat color palette
  const PALETTE = {
    '.': 'transparent',
    'B': '#2a2428', // Black cat body
    'D': '#1e1a1d', // Dark outline
    'W': '#ffffff', // White eyes
    'E': '#1c1b1e', // Eye pupil
    'P': '#ff94ad', // Pink nose & blush
    'R': '#e63946', // Red heart
    'L': '#ff6374', // Heart highlight
    'A': '#d4a359', // Cupid arrow wood
    'F': '#ffffff'  // Arrow feather
  };

  // 16 wide x 14 high pixel art matrices
  const CAT_FRAMES = {
    // Idle / Curious state (big open eyes)
    idle: [
      "..B..........B..",
      ".BBB........BBB.",
      ".BBPB......BBPB.",
      ".BBBBB....BBBBB.",
      "BBBBBBBBBBBBBBBB",
      "BBWWBBBBBBBBWWBB",
      "BBWWBBBBBBBBWWBB",
      "BBWEBBBBBBBBWEBB",
      "BBPBBBBPPBBBPBBB",
      "BBBBBRRRRBBBBBBB",
      "BBBBRRRRRRBBBBBB",
      ".BBBRRRRRRABBB..",
      "..BBRRRRRRAFB...",
      "...BB..RR..BB..."
    ],
    // Mid-blink state (eyes closed into thin lines)
    blink: [
      "..B..........B..",
      ".BBB........BBB.",
      ".BBPB......BBPB.",
      ".BBBBB....BBBBB.",
      "BBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBB",
      "BBDDDBBBBBBDDDBB",
      "BBBBBBBBBBBBBBBB",
      "BBPBBBBPPBBBPBBB",
      "BBBBBRRRRBBBBBBB",
      "BBBBRRRRRRBBBBBB",
      ".BBBRRRRRRABBB..",
      "..BBRRRRRRAFB...",
      "...BB..RR..BB..."
    ],
    // Happy / Joyful state (curved anime eyes `^ ^`, mini floating heart above)
    happy: [
      ".......RR.......",
      "..B...RRRR...B..",
      ".BBB...RR...BBB.",
      ".BBPB......BBPB.",
      "BBBBBBBBBBBBBBBB",
      "BBWWBBBBBBBBWWBB",
      "BWBWBBBBBBBBWBWB",
      "BBBBBBBBBBBBBBBB",
      "BBPBBBBPPBBBPBBB",
      "BBB..RRRRRR..BBB",
      "BB..RRRRRRRR..BB",
      ".B..RRRRRRRR..B.",
      "..B..RRRRRR..B..",
      "...BB..RR..BB..."
    ]
  };

  let catState = 'idle';
  let catBlinkTimer = null;

  function drawCat(frameKey) {
    if (!catCtx || !catCanvas) return;
    const matrix = CAT_FRAMES[frameKey] || CAT_FRAMES.idle;
    const pixelSize = 8; // 16 * 8 = 128px canvas
    catCanvas.width = 16 * pixelSize;
    catCanvas.height = 14 * pixelSize;
    catCtx.clearRect(0, 0, catCanvas.width, catCanvas.height);

    for (let r = 0; r < matrix.length; r++) {
      const row = matrix[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        const color = PALETTE[char] || 'transparent';
        if (color !== 'transparent') {
          catCtx.fillStyle = color;
          catCtx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }

  function startCatAnimation() {
    drawCat('idle');
    function queueBlink() {
      const delay = 2500 + Math.random() * 2500;
      catBlinkTimer = setTimeout(() => {
        if (catState === 'idle') {
          drawCat('blink');
          setTimeout(() => {
            if (catState === 'idle') drawCat('idle');
            queueBlink();
          }, 160);
        } else {
          queueBlink();
        }
      }, delay);
    }
    queueBlink();
  }

  startCatAnimation();

  /* ==========================================================================
     5. STAGE 1: BOW & ARROW AIM & SHOOT SYSTEM
     ========================================================================== */
  const bowContainer = document.getElementById('bowContainer');
  const bowString = document.getElementById('bowString');
  const bowNock = document.getElementById('bowNock');
  const nockedArrow = document.getElementById('nockedArrow');
  const flyingArrow = document.getElementById('flyingArrow');
  const envelope = document.getElementById('envelope');
  const stageAim = document.getElementById('stageAim');
  const windowContainer = document.getElementById('windowContainer');

  let isDraggingBow = false;
  let dragStartY = 0;
  let currentPull = 0;
  const maxPull = 50;
  let isShot = false;

  function updateBowString(pull) {
    const clamped = Math.min(Math.max(pull, 0), maxPull);
    // Default bow string is at y: 30 between (25, 30) and (135, 30)
    const midY = 30 + clamped;
    if (bowString) {
      bowString.setAttribute('d', `M 25 30 Q 80 ${midY} 135 30`);
    }
    if (bowNock) {
      bowNock.setAttribute('cy', midY);
    }
    if (nockedArrow) {
      nockedArrow.style.transform = `translateX(-50%) translateY(${clamped}px)`;
    }
  }

  function shootArrow() {
    if (isShot) return;
    isShot = true;
    playBowRelease();

    // Hide resting arrow and reset bow string
    if (nockedArrow) nockedArrow.style.display = 'none';
    updateBowString(0);

    // Position flying arrow at bow location
    const bowRect = bowContainer.getBoundingClientRect();
    const envRect = envelope.getBoundingClientRect();

    flyingArrow.style.display = 'flex';
    flyingArrow.style.position = 'fixed';
    flyingArrow.style.left = (bowRect.left + bowRect.width / 2 - 7) + 'px';
    flyingArrow.style.top = (bowRect.top - 20) + 'px';
    flyingArrow.style.transition = 'top 0.42s cubic-bezier(0.25, 1, 0.5, 1)';
    flyingArrow.style.zIndex = '99';

    requestAnimationFrame(() => {
      const targetY = envRect.top + envRect.height / 2 - 40;
      flyingArrow.style.top = targetY + 'px';
    });

    // Arrow reaches target
    setTimeout(() => {
      playHitPop();
      envelope.classList.add('is-hit');
      spawnHeartBurst(envRect.left + envRect.width / 2, envRect.top + envRect.height / 2);

      setTimeout(() => {
        envelope.classList.add('is-open');
      }, 200);

      // Transition to Stage 2 (Retro Window)
      setTimeout(() => {
        flyingArrow.style.display = 'none';
        stageAim.classList.add('is-gone');
        setTimeout(() => {
          stageAim.style.display = 'none';
          windowContainer.style.display = 'block';
        }, 380);
      }, 700);
    }, 420);
  }

  function spawnHeartBurst(x, y) {
    for (let i = 0; i < 14; i++) {
      const h = document.createElement('div');
      h.textContent = '♥';
      h.style.position = 'fixed';
      h.style.left = x + 'px';
      h.style.top = y + 'px';
      h.style.color = '#e63946';
      h.style.fontSize = (14 + Math.random() * 12) + 'px';
      h.style.pointerEvents = 'none';
      h.style.zIndex = '100';
      h.style.transition = 'all 0.6s cubic-bezier(0.1, 0.8, 0.3, 1)';
      document.body.appendChild(h);

      const angle = (Math.PI * 2 / 14) * i + (Math.random() * 0.4 - 0.2);
      const dist = 40 + Math.random() * 50;
      const destX = Math.cos(angle) * dist;
      const destY = Math.sin(angle) * dist;

      requestAnimationFrame(() => {
        h.style.transform = `translate(${destX}px, ${destY}px) scale(${0.5 + Math.random() * 0.8})`;
        h.style.opacity = '0';
      });

      setTimeout(() => {
        if (h.parentNode) h.parentNode.removeChild(h);
      }, 650);
    }
  }

  // Pointer drag events for bow
  if (bowContainer) {
    const handleStart = (clientY) => {
      if (isShot) return;
      initAudio();
      isDraggingBow = true;
      dragStartY = clientY;
    };

    const handleMove = (clientY) => {
      if (!isDraggingBow || isShot) return;
      currentPull = clientY - dragStartY;
      updateBowString(currentPull);
    };

    const handleEnd = () => {
      if (!isDraggingBow || isShot) return;
      isDraggingBow = false;
      if (currentPull > 15) {
        shootArrow();
      } else {
        updateBowString(0);
      }
      currentPull = 0;
    };

    bowContainer.addEventListener('mousedown', (e) => handleStart(e.clientY));
    window.addEventListener('mousemove', (e) => handleMove(e.clientY));
    window.addEventListener('mouseup', handleEnd);

    bowContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) handleStart(e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', handleEnd);

    // Also support direct tap on bow or envelope to shoot
    bowContainer.addEventListener('click', () => {
      if (!isShot && currentPull < 10) shootArrow();
    });
  }

  // Clicking the envelope directly also fires Cupid's arrow!
  const targetArea = document.getElementById('targetArea');
  if (targetArea) {
    targetArea.addEventListener('click', () => {
      if (!isShot) shootArrow();
    });
  }

  /* ==========================================================================
     6. STAGE 2: "PLEASE" WINDOW & RUNAWAY "NO" BUTTON
     ========================================================================== */
  const btnNo = document.getElementById('btnNo');
  const btnYes = document.getElementById('btnYes');
  const askBox = document.getElementById('askBox');
  const yayBox = document.getElementById('yayBox');
  const windowInner = document.getElementById('windowInner');

  function moveNoButton() {
    if (!btnNo || !windowInner) return;
    playClick();

    const containerRect = windowInner.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const padding = 15;
    const maxX = containerRect.width - btnRect.width - padding * 2;
    const maxY = containerRect.height - btnRect.height - padding * 2;

    const randomX = padding + Math.random() * Math.max(maxX, 20);
    const randomY = padding + Math.random() * Math.max(maxY, 20);

    btnNo.style.position = 'absolute';
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
    btnNo.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      moveNoButton();
    });
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      moveNoButton();
    });
  }

  if (btnYes) {
    btnYes.addEventListener('click', () => {
      playYayFanfare();
      catState = 'happy';
      drawCat('happy');
      if (catCanvas) catCanvas.classList.add('bounce');

      // Spawn full screen confetti
      spawnConfetti();

      // Show Yay Box
      askBox.style.display = 'none';
      yayBox.style.display = 'flex';
    });
  }

  /* Confetti Explosion System */
  function spawnConfetti() {
    const layer = document.getElementById('confettiLayer');
    if (!layer) return;

    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd166', '#06d6a0', '#118ab2', '#ffffff'];
    const count = 70;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      const isHeart = Math.random() > 0.6;
      piece.textContent = isHeart ? '♥' : '';
      piece.style.position = 'absolute';
      piece.style.left = '50%';
      piece.style.top = '40%';
      piece.style.color = colors[Math.floor(Math.random() * colors.length)];
      if (!isHeart) {
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (8 + Math.random() * 12) + 'px';
        piece.style.backgroundColor = piece.style.color;
        piece.style.borderRadius = '2px';
      } else {
        piece.style.fontSize = (12 + Math.random() * 14) + 'px';
      }
      piece.style.pointerEvents = 'none';
      layer.appendChild(piece);

      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 320;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 150;
      const rot = Math.random() * 720 - 360;

      piece.animate([
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${vx}px, ${vy + 400}px) scale(0.6) rotate(${rot}deg)`, opacity: 0 }
      ], {
        duration: 1800 + Math.random() * 1200,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });

      setTimeout(() => {
        if (piece.parentNode) piece.parentNode.removeChild(piece);
      }, 3200);
    }
  }

  /* Transition to Date Planner */
  const btnNextToPlanner = document.getElementById('nextToPlanner');
  const plannerContainer = document.getElementById('plannerContainer');

  if (btnNextToPlanner) {
    btnNextToPlanner.addEventListener('click', () => {
      playClick();
      windowContainer.style.display = 'none';
      plannerContainer.style.display = 'block';
      goToStep(1);
    });
  }

  /* ==========================================================================
     7. STAGE 3: DATE PLANNER MULTI-STEP WIZARD
     ========================================================================== */
  const STEP_HEADERS = [
    { sub: () => `buat ${config.targetName}`, title: () => 'Kapan sayangku free?' },
    { sub: () => 'rencana kita', title: () => 'Nanti kita ngapain?' },
    { sub: () => 'biar makin niat', title: () => 'Dress code-nya?' },
    { sub: () => 'terakhir', title: () => `Ada pesan buat ${config.senderName}?` }
  ];

  function updateStepUI() {
    for (let i = 1; i <= totalSteps; i++) {
      const stepEl = document.getElementById(`step${i}`);
      if (stepEl) {
        stepEl.classList.toggle('is-active', i === currentStep);
      }
    }

    // Step titles & back buttons
    const backBtn = document.getElementById('btnBackStep');
    if (backBtn) {
      backBtn.style.display = currentStep > 1 ? 'block' : 'none';
    }

    // Update step header texts dynamically
    const headerData = STEP_HEADERS[currentStep - 1];
    if (headerData) {
      const subEl = document.getElementById('stepSubtitle');
      const titleEl = document.getElementById('stepTitle');
      if (subEl) subEl.textContent = headerData.sub();
      if (titleEl) titleEl.textContent = headerData.title();
    }
  }

  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;
    updateStepUI();
  }

  const btnBackStep = document.getElementById('btnBackStep');
  if (btnBackStep) {
    btnBackStep.addEventListener('click', () => {
      playClick();
      goToStep(currentStep - 1);
    });
  }

  // STEP 1: Date & Time Picker
  const dateTrigger = document.getElementById('dateTrigger');
  const dateDisplayText = document.getElementById('dateDisplayText');
  const calPopover = document.getElementById('calPopover');
  const timeDisplayBox = document.getElementById('timeDisplayBox');
  const timeWheelPopover = document.getElementById('timeWheelPopover');
  const timeDisplayText = document.getElementById('timeDisplayText');
  const btnStep1Next = document.getElementById('btnStep1Next');

  // Time Period Chips
  const timeChips = document.querySelectorAll('.time-chip');
  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playClick();
      timeChips.forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      config.timePeriod = chip.getAttribute('data-period') || chip.textContent.trim();

      // Quick default times for periods
      if (config.timePeriod === 'Pagi' && config.timeText === '17:00') setTime('09:00');
      else if (config.timePeriod === 'Siang' && config.timeText === '17:00') setTime('12:00');
      else if (config.timePeriod === 'Sore') setTime('17:00');
      else if (config.timePeriod === 'Malam' && config.timeText === '17:00') setTime('19:30');
    });
  });

  function setTime(timeStr) {
    config.timeText = timeStr;
    if (timeDisplayText) timeDisplayText.textContent = timeStr;
  }

  // Interactive Calendar Generation
  let calDate = new Date(); // Start at current month
  const INDO_MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const INDO_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  function renderCalendar() {
    const calMonthTitle = document.getElementById('calMonthTitle');
    const calDaysGrid = document.getElementById('calDaysGrid');
    if (!calDaysGrid || !calMonthTitle) return;

    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    calMonthTitle.textContent = `${INDO_MONTHS[month]} ${year}`;
    calDaysGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Empty lead slots
    for (let i = 0; i < firstDayIndex; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day is-empty';
      calDaysGrid.appendChild(empty);
    }

    // Days
    for (let d = 1; d <= totalDays; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'cal-day';
      dayEl.textContent = d;

      // Check if selected
      const dayDate = new Date(year, month, d);
      const dayName = INDO_DAYS[dayDate.getDay()];
      const formatted = `${dayName}, ${d} ${INDO_MONTHS[month]} ${year}`;
      if (formatted === config.dateText) {
        dayEl.classList.add('is-active');
      }

      dayEl.addEventListener('click', () => {
        playClick();
        config.dateText = formatted;
        if (dateDisplayText) dateDisplayText.textContent = formatted;
        calPopover.style.display = 'none';
        renderCalendar();
      });

      calDaysGrid.appendChild(dayEl);
    }
  }

  if (dateTrigger && calPopover) {
    dateTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      playClick();
      calPopover.style.display = calPopover.style.display === 'block' ? 'none' : 'block';
      if (timeWheelPopover) timeWheelPopover.style.display = 'none';
      renderCalendar();
    });

    document.getElementById('calPrev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      calDate.setMonth(calDate.getMonth() - 1);
      renderCalendar();
    });
    document.getElementById('calNext')?.addEventListener('click', (e) => {
      e.stopPropagation();
      calDate.setMonth(calDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // Time Wheel setup
  function initTimeWheel() {
    const hoursCol = document.getElementById('wheelHours');
    const minsCol = document.getElementById('wheelMins');
    if (!hoursCol || !minsCol) return;

    hoursCol.innerHTML = '';
    minsCol.innerHTML = '';

    const [curHour, curMin] = config.timeText.split(':');

    for (let h = 0; h < 24; h++) {
      const hStr = String(h).padStart(2, '0');
      const item = document.createElement('div');
      item.className = 'wheel-item' + (hStr === curHour ? ' is-selected' : '');
      item.textContent = hStr;
      item.addEventListener('click', () => {
        hoursCol.querySelectorAll('.wheel-item').forEach(i => i.classList.remove('is-selected'));
        item.classList.add('is-selected');
      });
      hoursCol.appendChild(item);
    }

    for (let m = 0; m < 60; m += 5) {
      const mStr = String(m).padStart(2, '0');
      const item = document.createElement('div');
      item.className = 'wheel-item' + (mStr === curMin ? ' is-selected' : '');
      item.textContent = mStr;
      item.addEventListener('click', () => {
        minsCol.querySelectorAll('.wheel-item').forEach(i => i.classList.remove('is-selected'));
        item.classList.add('is-selected');
      });
      minsCol.appendChild(item);
    }
  }

  if (timeDisplayBox && timeWheelPopover) {
    timeDisplayBox.addEventListener('click', (e) => {
      e.stopPropagation();
      playClick();
      timeWheelPopover.style.display = timeWheelPopover.style.display === 'block' ? 'none' : 'block';
      if (calPopover) calPopover.style.display = 'none';
      initTimeWheel();
    });

    document.getElementById('btnApplyTime')?.addEventListener('click', (e) => {
      e.stopPropagation();
      playClick();
      const selHour = document.querySelector('#wheelHours .is-selected')?.textContent || '17';
      const selMin = document.querySelector('#wheelMins .is-selected')?.textContent || '00';
      setTime(`${selHour}:${selMin}`);
      timeWheelPopover.style.display = 'none';
    });
  }

  // Close popovers on click outside
  document.addEventListener('click', () => {
    if (calPopover) calPopover.style.display = 'none';
    if (timeWheelPopover) timeWheelPopover.style.display = 'none';
  });

  if (btnStep1Next) {
    btnStep1Next.addEventListener('click', () => {
      playClick();
      goToStep(2);
    });
  }

  // STEP 2: Activities Grid
  const actCards = document.querySelectorAll('.act-card');
  const customActivityInput = document.getElementById('customActivityInput');
  const btnStep2Next = document.getElementById('btnStep2Next');

  actCards.forEach(card => {
    card.addEventListener('click', () => {
      playClick();
      card.classList.toggle('is-selected');
      const name = card.getAttribute('data-act');
      if (card.classList.contains('is-selected')) {
        if (!config.activities.includes(name)) config.activities.push(name);
      } else {
        config.activities = config.activities.filter(a => a !== name);
      }
    });
  });

  if (btnStep2Next) {
    btnStep2Next.addEventListener('click', () => {
      playClick();
      // If custom activity typed, include it
      const customVal = customActivityInput?.value.trim();
      if (customVal && !config.activities.includes(customVal)) {
        config.activities.push(customVal);
      }
      if (config.activities.length === 0) {
        config.activities = ['Jalan-Jalan'];
      }
      goToStep(3);
    });
  }

  // STEP 3: Dress Code
  const dressChips = document.querySelectorAll('.dress-chip');
  const customDressInput = document.getElementById('customDressInput');
  const btnStep3Next = document.getElementById('btnStep3Next');

  dressChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playClick();
      dressChips.forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      config.dressCode = chip.getAttribute('data-dress') || chip.textContent.trim();
    });
  });

  if (btnStep3Next) {
    btnStep3Next.addEventListener('click', () => {
      playClick();
      const customDress = customDressInput?.value.trim();
      if (customDress) {
        config.dressCode = customDress;
      }
      goToStep(4);
    });
  }

  // STEP 4: Personal Message & Generate Ticket
  const personalMessageInput = document.getElementById('personalMessageInput');
  const btnGenerateTicket = document.getElementById('btnGenerateTicket');
  const ticketStage = document.getElementById('ticketStage');

  if (btnGenerateTicket) {
    btnGenerateTicket.addEventListener('click', () => {
      playYayFanfare();
      spawnConfetti();

      const userMsg = personalMessageInput?.value.trim();
      config.message = userMsg || 'mantap';

      // Render ticket details
      renderTicket();

      // Show ticket stage
      plannerContainer.style.display = 'none';
      ticketStage.style.display = 'flex';
    });
  }

  /* ==========================================================================
     8. STAGE 4: TICKET RENDERING & IMAGE EXPORT
     ========================================================================== */
  function renderTicket() {
    document.getElementById('ticketTargetName').textContent = config.senderName;
    document.getElementById('ticketDateTime').textContent = `${config.dateText} • ${config.timePeriod} • ${config.timeText}`;
    document.getElementById('ticketActivities').textContent = config.activities.join(', ');
    document.getElementById('ticketDressCode').textContent = config.dressCode;
    document.getElementById('ticketMessage').textContent = config.message;

    // Subtitle note
    const ticketShareHint = document.getElementById('ticketShareHint');
    if (ticketShareHint) {
      ticketShareHint.textContent = `Bagikan tiketnya ke ${config.senderName} ya - langsung jadi gambar`;
    }

    // WhatsApp URL
    const btnWhatsApp = document.getElementById('btnWhatsApp');
    if (btnWhatsApp) {
      let phoneNum = config.whatsappNumber.replace(/[^0-9]/g, '');
      if (phoneNum.startsWith('0')) {
        phoneNum = '62' + phoneNum.slice(1);
      }
      const waText = encodeURIComponent(
        `Halo ${config.senderName}! Aku udah isi Date Planner kita nih ❤️\n\n` +
        `🎫 *TIKET KENCAN KITA*\n` +
        `👤 Untuk: ${config.senderName}\n` +
        `📅 Kapan: ${config.dateText} • ${config.timePeriod} • ${config.timeText}\n` +
        `✨ Acara: ${config.activities.join(', ')}\n` +
        `👗 Dress Code: ${config.dressCode}\n` +
        `💌 Pesan: "${config.message}"\n\n` +
        `Would you like to go out with me? See you on our date! 🥰`
      );
      btnWhatsApp.href = `https://wa.me/${phoneNum}?text=${waText}`;
    }
  }

  /* High Resolution Canvas Drawing Engine for Perfect Ticket Image Download */
  function generateTicketImage() {
    playClick();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 2x Retina resolution for crisp rendering
    const w = 420;
    const h = 560;
    const scale = 2;
    canvas.width = w * scale;
    canvas.height = h * scale;
    ctx.scale(scale, scale);

    // Background of outer canvas (pastel cream)
    ctx.fillStyle = '#faecee';
    ctx.fillRect(0, 0, w, h);

    // Gingham check border effect
    const boxX = 20, boxY = 20, boxW = 380, boxH = 520, radius = 24;

    // Draw Ticket Outer Card (White)
    ctx.save();
    ctx.shadowColor = 'rgba(200, 90, 106, 0.25)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, boxX, boxY, boxW, boxH, radius);
    ctx.fill();
    ctx.restore();

    // Side Scalloped Cutout Notches
    const notchY = boxY + 75;
    const notchRadius = 14;

    ctx.fillStyle = '#faecee';
    ctx.beginPath();
    ctx.arc(boxX, notchY, notchRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(boxX + boxW, notchY, notchRadius, 0, Math.PI * 2);
    ctx.fill();

    // Perforated Dashed Line between notches
    ctx.strokeStyle = '#eed2d8';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(boxX + notchRadius + 4, notchY);
    ctx.lineTo(boxX + boxW - notchRadius - 4, notchY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Header Content
    ctx.fillStyle = '#9c8389';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText('ADMIT TWO', boxX + 24, boxY + 38);

    // Heart Badge Circle
    ctx.strokeStyle = '#e88497';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(boxX + boxW - 36, boxY + 34, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#e63946';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('♥', boxX + boxW - 36, boxY + 38);
    ctx.textAlign = 'left';

    // Title: Tiket kencan
    ctx.fillStyle = '#3a272c';
    ctx.font = 'bold 30px "Caveat", "Brush Script MT", cursive';
    ctx.fillText('Tiket kencan', boxX + 24, boxY + 65);

    // Details Rows
    let curY = notchY + 38;
    const leftX = boxX + 26;
    const valX = boxX + 68;

    function drawRow(icon, label, value) {
      // Icon
      ctx.font = '16px sans-serif';
      ctx.fillText(icon, leftX, curY + 16);

      // Label
      ctx.fillStyle = '#9c8389';
      ctx.font = 'bold 11px "Courier New", monospace';
      ctx.fillText(label, valX, curY + 4);

      // Value
      ctx.fillStyle = '#3b2a2e';
      ctx.font = '600 14px "Nunito", "Quicksand", sans-serif';

      // Text wrapping for longer lines like activities
      wrapText(ctx, value, valX, curY + 22, 280, 18);
      curY += 56;
    }

    drawRow('👤', 'UNTUK', config.senderName);
    drawRow('📅', 'KAPAN', `${config.dateText} • ${config.timePeriod} • ${config.timeText}`);
    drawRow('🟡', 'ACARA', config.activities.join(', '));
    drawRow('👗', 'DRESS CODE', config.dressCode);
    drawRow('💭', 'PESAN', config.message);

    // Footer Quote
    ctx.strokeStyle = '#f2d4da';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(boxX + 24, curY);
    ctx.lineTo(boxX + boxW - 24, curY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#c85a6a';
    ctx.font = 'bold 22px "Caveat", "Brush Script MT", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('Would you like to go out with me?', boxX + boxW / 2, curY + 30);

    // Trigger download
    const link = document.createElement('a');
    link.download = `${config.senderName}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  const btnDownloadTicket = document.getElementById('btnDownloadTicket');
  if (btnDownloadTicket) {
    btnDownloadTicket.addEventListener('click', generateTicketImage);
  }

  /* ==========================================================================
     9. SETTINGS & CUSTOMIZATION MODAL
     ========================================================================== */
  const btnOpenSettings = document.getElementById('btnOpenSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const settingsModal = document.getElementById('settingsModal');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const btnCopyShareLink = document.getElementById('btnCopyShareLink');

  const inputSettingFrom = document.getElementById('inputSettingFrom');
  const inputSettingTo = document.getElementById('inputSettingTo');
  const inputSettingPhone = document.getElementById('inputSettingPhone');

  function openSettings() {
    playClick();
    if (inputSettingFrom) inputSettingFrom.value = config.senderName;
    if (inputSettingTo) inputSettingTo.value = config.targetName;
    if (inputSettingPhone) inputSettingPhone.value = config.whatsappNumber;
    settingsModal.style.display = 'flex';
  }

  function closeSettings() {
    settingsModal.style.display = 'none';
  }

  if (btnOpenSettings) btnOpenSettings.addEventListener('click', openSettings);
  if (btnCloseSettings) btnCloseSettings.addEventListener('click', closeSettings);

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      playClick();
      config.senderName = inputSettingFrom?.value.trim() || 'Ahmad Paridi';
      config.targetName = inputSettingTo?.value.trim() || 'Titisan Ilahi';
      config.whatsappNumber = inputSettingPhone?.value.trim() || '081281278846';

      localStorage.setItem('dp_from', config.senderName);
      localStorage.setItem('dp_to', config.targetName);
      localStorage.setItem('dp_phone', config.whatsappNumber);

      // Update text in envelope
      const envTag = document.getElementById('envelopeTag');
      if (envTag) envTag.innerHTML = `<span class="heart-badge">♥</span> From ${config.senderName} For ${config.targetName} <span class="heart-badge">♥</span>`;

      updateStepUI();
      closeSettings();
    });
  }

  if (btnCopyShareLink) {
    btnCopyShareLink.addEventListener('click', () => {
      playClick();
      const fromVal = encodeURIComponent(inputSettingFrom?.value.trim() || config.senderName);
      const toVal = encodeURIComponent(inputSettingTo?.value.trim() || config.targetName);
      let phoneRaw = (inputSettingPhone?.value.trim() || config.whatsappNumber).replace(/[^0-9]/g, '');
      if (phoneRaw.startsWith('0')) phoneRaw = '62' + phoneRaw.slice(1);
      const phoneVal = encodeURIComponent(phoneRaw);

      const url = `${window.location.origin}${window.location.pathname}?from=${fromVal}&to=${toVal}&phone=${phoneVal}`;
      navigator.clipboard.writeText(url).then(() => {
        btnCopyShareLink.textContent = 'Tersalin! ✓';
        setTimeout(() => {
          btnCopyShareLink.textContent = 'Salin Link';
        }, 2000);
      });
    });
  }

  // Audio mute/unmute toggle
  const btnToggleSound = document.getElementById('btnToggleSound');
  if (btnToggleSound) {
    btnToggleSound.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      btnToggleSound.textContent = soundEnabled ? '🔔' : '🔕';
      playClick();
    });
  }

  // Playful shake on close button click
  document.querySelectorAll('.winbtn--x').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClick();
      const win = btn.closest('.retro-window');
      if (win) {
        win.classList.remove('shake');
        void win.offsetWidth;
        win.classList.add('shake');
      }
    });
  });

  // Set initial tag text from config
  const envTag = document.getElementById('envelopeTag');
  if (envTag) {
    envTag.innerHTML = `<span class="heart-badge">♥</span> From ${config.senderName} For ${config.targetName} <span class="heart-badge">♥</span>`;
  }

})();
