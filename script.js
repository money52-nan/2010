/**
 * ============================================================================
 * BẢNG CẤU HÌNH NỘI DUNG (CHỈNH SỬA TRỰC TIẾP TẠI ĐÂY)
 * ============================================================================
 */
const CONFIG = {
  // 1. Nhạc nền (Để đường dẫn file nhạc của bạn, ví dụ: "./nhac.mp3")
  // Nếu để trống "" hoặc file chưa có, web sẽ tự động phát giai điệu Music Box.
  musicUrl: "Nhạc.m4a",

  // 2. Nội dung Chặng 1 (Mở Hộp Quà)
  introPrefix: "Món quà 20/10 đặc biệt dành riêng cho",
  recipientName: "Ngọc Hằng", // Cùng font và màu chữ với câu trên
  stage1Title: "Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10",
  stage1Subtitle: "Chạm vào hộp quà 3 lần để tháo nơ lụa và mở điều bất ngờ bên trong nhé!",
  openedMessage: "✨ Hộp quà yêu thương đã mở! Một bức tâm thư đang chờ bạn khám phá...",
  toStage2ButtonText: "Mở Phong Bì Tâm Thư",

  // 3. Nội dung Chặng 2 (Bức Tâm Thư)
  envelopeHeaderTitle: "Một Bức Thư Dành Riêng Cho Bạn",
  envelopeHeaderSub: "Chạm vào con dấu sáp để mở phong bì nhé",
  envelopePreviewText: "Gửi Ngọc Hằng...",
  letterDate: "Ngày 20 tháng 10",
  letterGreeting: "Gửi cô chủ Sóp hoa,",
  letterContent: `Nhân ngày 20/10, chúc bạn những điều tốt đẹp và dịu dàng nhất. Chúc bạn luôn xinh như hoa, 
  
  vượt mọi thử thách, sớm đạt được những mục tiêu của bản thân và gặp thật nhiều may mắn.`,
  typewriterSpeed: 32, // Tốc độ gõ chữ (ms) - số càng nhỏ gõ càng nhanh
  senderLabel: "Người gửi",
  senderName: "Minh Tiền",
  toStage3ButtonText: "Mở những đoá hoa",

  // 4. Nội dung Chặng 3 (Album Kỷ Niệm Polaroid)
  albumTitle: "Những Bông Hoa",
  albumTip: "✨ Mẹo nhỏ: Chạm vào từng bức ảnh để lật xem lời nhắn phía sau nha",
  toStage4ButtonText: "Khám Phá thẻ cào đặc biệt",

  // Danh sách ảnh Polaroid (Bạn có thể đổi đường dẫn sang "./images/anh1.jpg",...)
  photos: [
    {
      url: "./images/IMG_1271.jpg",
      caption: "Xinh đẹp",
      date: "20/10",
      secretNote: "Bạn xứng đáng với những điều tuyệt vời nhất."
    },
    {
      url: "./images/IMG_1273.jpg",
      caption: "Rạng rỡ",
      date: "20/10",
      secretNote: "Mong hôm nay có nhiều người làm bạn cười và mình may mắn nằm trong số đó."
    },
    {
      url: "./images/IMG_1274.jpg",
      caption: "Ngọt ngào",
      date: "20/10",
      secretNote: "Đây là món quà mình tự làm, hy vọng bạn sẽ thích."
    },
    {
      url: "./images/IMG_1276.jpg",
      caption: "Dễ thương",
      date: "20/10",
      secretNote: "Và ánh mắt của bạn đã làm trái tim của một ai đó đập sai nhịp."
    }
  ],

  // 5. Nội dung Chặng 4 (Thẻ Cào Ánh Kim)
  scratchSectionTitle: "Món Quà đặc biệt",
  scratchSectionSub: "Dùng ngón tay hoặc chuột cào lớp nhũ ánh kim bên dưới để nhận quà nhé!",
  scratchCoverText: "CÀO NHẸ ĐỂ NHẬN QUÀ 20/10 ✨",
  voucherBadge: "VOUCHER ĐẶC QUYỀN 20/10",
  voucherTitle: "Một ly trà sữa full topping",
  voucherDesc: ""
};

/**
 * ============================================================================
 * LOGIC XỬ LÝ TƯƠNG TÁC (KHÔNG CẦN CHỈNH SỬA PHẦN DƯỚI NÀY)
 * ============================================================================
 */
let tapCount = 0;
let isGiftOpened = false;
let typewriterTimer = null;
let isMusicPlaying = false;
let fallbackInterval = null;
let audioCtx = null;
let scratchCompleted = false;

document.addEventListener("DOMContentLoaded", () => {
  applyConfigToDOM();
  initPetalsBackground();
  initStage1Events();
  initStage2Events();
  initStage3Polaroids();
  initMusicControls();
});

// Gán toàn bộ nội dung từ CONFIG vào giao diện
function applyConfigToDOM() {
  document.getElementById("introPrefixText").textContent = CONFIG.introPrefix;
  document.getElementById("recipientNameText").textContent = CONFIG.recipientName;
  document.getElementById("stage1Title").textContent = CONFIG.stage1Title;
  document.getElementById("stage1Subtitle").textContent = CONFIG.stage1Subtitle;
  document.getElementById("openedMessage").textContent = CONFIG.openedMessage;
  document.getElementById("toStage2BtnText").textContent = CONFIG.toStage2ButtonText;

  document.getElementById("envelopeHeaderTitle").textContent = CONFIG.envelopeHeaderTitle;
  document.getElementById("envelopeHeaderSub").textContent = CONFIG.envelopeHeaderSub;
  document.getElementById("envelopePreviewText").textContent = CONFIG.envelopePreviewText;
  document.getElementById("letterDateText").textContent = CONFIG.letterDate;
  document.getElementById("letterGreetingText").textContent = CONFIG.letterGreeting;
  document.getElementById("senderLabelText").textContent = CONFIG.senderLabel;
  document.getElementById("senderNameText").textContent = CONFIG.senderName;
  document.getElementById("toStage3BtnText").textContent = CONFIG.toStage3ButtonText;

  document.getElementById("albumTitleText").textContent = CONFIG.albumTitle;
  document.getElementById("albumTipText").textContent = CONFIG.albumTip;
  document.getElementById("toStage4BtnText").textContent = CONFIG.toStage4ButtonText;

  document.getElementById("scratchSectionTitle").textContent = CONFIG.scratchSectionTitle;
  document.getElementById("scratchSectionSub").textContent = CONFIG.scratchSectionSub;
  document.getElementById("voucherBadgeText").textContent = CONFIG.voucherBadge;
  document.getElementById("voucherTitleText").textContent = CONFIG.voucherTitle;
  document.getElementById("voucherDescText").textContent = CONFIG.voucherDesc;
}

// Chuyển chặng
function goToStage(stageNumber) {
  document.querySelectorAll(".stage").forEach((el) => el.classList.remove("active"));
  const target = document.getElementById(`stage-${stageNumber}`);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Khởi tạo thẻ cào đúng kích thước ngay khi Chặng 4 hiển thị
  if (stageNumber === 4) {
    requestAnimationFrame(() => {
      initScratchCard();
    });
  }
}

// ================= CHẶNG 1: HỘP QUÀ 3 CHẠM =================
function initStage1Events() {
  const giftBoxWrapper = document.getElementById("giftBoxWrapper");
  const giftBox = document.getElementById("giftBox");
  const tapHintText = document.getElementById("tapHintText");
  const tapProgressWrap = document.getElementById("tapProgressWrap");
  const giftOpenedContent = document.getElementById("giftOpenedContent");
  const toStage2Btn = document.getElementById("toStage2Btn");

  giftBoxWrapper.addEventListener("click", () => {
    if (isGiftOpened) return;

    // Tự động bật nhạc ở lần chạm đầu tiên
    if (!isMusicPlaying) {
      startMusic();
    }

    tapCount++;
    const dot = document.getElementById(`dot-${tapCount}`);
    if (dot) dot.classList.add("filled");

    giftBox.classList.remove("shake");
    void giftBox.offsetWidth; // trigger reflow
    giftBox.classList.add("shake");

    if (tapCount < 3) {
      tapHintText.textContent = `Chạm thêm ${3 - tapCount} lần nữa để mở quà (${tapCount}/3)`;
    } else {
      isGiftOpened = true;
      giftBox.classList.add("opened");
      tapProgressWrap.classList.add("hidden");
      giftOpenedContent.classList.remove("hidden");
      fireConfettiBurst();
    }
  });

  toStage2Btn.addEventListener("click", () => {
    goToStage(2);
  });
}

// ================= CHẶNG 2: MỞ PHONG BÌ & TỰ ĐỘNG GÕ CHỮ =================
function initStage2Events() {
  const envelopeTrigger = document.getElementById("envelopeTrigger");
  const envelopeClosedView = document.getElementById("envelopeClosedView");
  const letterOpenedView = document.getElementById("letterOpenedView");
  const toStage3Btn = document.getElementById("toStage3Btn");

  envelopeTrigger.addEventListener("click", () => {
    envelopeClosedView.classList.add("hidden");
    letterOpenedView.classList.remove("hidden");
    startTypewriter(CONFIG.letterContent);
  });

  toStage3Btn.addEventListener("click", () => {
    goToStage(3);
  });
}

function startTypewriter(fullText) {
  const textEl = document.getElementById("typewriterText");
  const cursorEl = document.getElementById("typewriterCursor");
  if (typewriterTimer) clearInterval(typewriterTimer);

  textEl.textContent = "";
  cursorEl.style.display = "inline-block";

  let index = 0;
  typewriterTimer = setInterval(() => {
    if (index < fullText.length) {
      textEl.textContent += fullText.charAt(index);
      index++;
    } else {
      clearInterval(typewriterTimer);
      cursorEl.style.display = "none";
    }
  }, CONFIG.typewriterSpeed || 32);
}

// ================= CHẶNG 3: ALBUM POLAROID LẬT 3D =================
function initStage3Polaroids() {
  const grid = document.getElementById("polaroidGrid");
  const toStage4Btn = document.getElementById("toStage4Btn");
  grid.innerHTML = "";

  CONFIG.photos.forEach((photo, idx) => {
    const card = document.createElement("div");
    card.className = "polaroid-card";
    const tilt = idx % 2 === 0 ? "-1.5deg" : "1.5deg";
    card.style.transform = `rotate(${tilt})`;

    card.innerHTML = `
      <div class="polaroid-inner">
        <div class="polaroid-front">
          <div class="polaroid-photo-wrap">
            <img src="${photo.url}" alt="${photo.caption}" loading="lazy" />
          </div>
          <div class="polaroid-caption">${photo.caption}</div>
          <div class="polaroid-date">${photo.date || ""}</div>
        </div>
        <div class="polaroid-back">
          <div class="polaroid-back-title">💌 Lời nhắn bí mật</div>
          <p class="polaroid-secret-note">${photo.secretNote || ""}</p>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    grid.appendChild(card);
  });

  toStage4Btn.addEventListener("click", () => {
    goToStage(4);
  });
}

// ================= CHẶNG 4: THẺ CÀO ÁNH KIM =================
function initScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  const box = document.getElementById("scratchCardBox");
  const statusText = document.getElementById("scratchStatusText");
  if (!canvas || !box) return;

  scratchCompleted = false;
  canvas.style.opacity = "1";
  canvas.style.pointerEvents = "auto";

  const rect = box.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // Vẽ lớp phủ nhũ vàng hồng
  const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  grad.addColorStop(0, "#e6c259");
  grad.addColorStop(0.5, "#f7e39c");
  grad.addColorStop(1, "#d49b35");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, rect.width, rect.height);

  // Họa tiết lấp lánh trên thẻ cào
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  for (let i = 0; i < 35; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 3 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Chữ hướng dẫn trên lớp nhũ
  ctx.fillStyle = "#5c3a08";
  ctx.font = "700 15px 'Be Vietnam Pro', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(CONFIG.scratchCoverText, rect.width / 2, rect.height / 2);

  let isDrawing = false;

  function scratchAt(clientX, clientY) {
    if (scratchCompleted) return;
    const bounds = canvas.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercent(ctx, canvas, statusText);
  }

  canvas.onmousedown = (e) => {
    isDrawing = true;
    scratchAt(e.clientX, e.clientY);
  };
  window.onmousemove = (e) => {
    if (isDrawing) scratchAt(e.clientX, e.clientY);
  };
  window.onmouseup = () => {
    isDrawing = false;
  };

  canvas.ontouchstart = (e) => {
    isDrawing = true;
    const touch = e.touches[0];
    scratchAt(touch.clientX, touch.clientY);
  };
  canvas.ontouchmove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    scratchAt(touch.clientX, touch.clientY);
  };
  canvas.ontouchend = () => {
    isDrawing = false;
  };
}

function checkScratchPercent(ctx, canvas, statusText) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparentPixels = 0;
  const totalSampled = pixels.length / (4 * 16);

  for (let i = 3; i < pixels.length; i += 4 * 16) {
    if (pixels[i] < 128) transparentPixels++;
  }

  const percent = (transparentPixels / totalSampled) * 100;
  if (percent > 46 && !scratchCompleted) {
    scratchCompleted = true;
    canvas.style.opacity = "0";
    canvas.style.pointerEvents = "none";
    statusText.textContent = "🎉 Chúc mừng bạn đã mở khóa món quà đặc biệt ngày 20/10!";
    fireConfettiBurst();
  }
}

// ================= NHẠC NỀN (MP3 HOẶC MUSIC BOX DỰ PHÒNG) =================
function initMusicControls() {
  const musicBtn = document.getElementById("musicBtn");
  const bgAudio = document.getElementById("bgAudio");

  if (CONFIG.musicUrl) {
    bgAudio.src = CONFIG.musicUrl;
  }

  musicBtn.addEventListener("click", () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

function startMusic() {
  const bgAudio = document.getElementById("bgAudio");
  const musicIcon = document.getElementById("musicIcon");
  const musicText = document.getElementById("musicText");

  isMusicPlaying = true;
  musicIcon.textContent = "🎵";
  musicText.textContent = "Đang phát nhạc";

  if (CONFIG.musicUrl) {
    bgAudio.play().catch(() => {
      // Nếu chưa có file nhac.mp3, tự động chuyển sang giai điệu Music Box
      playFallbackMusicBox();
    });
  } else {
    playFallbackMusicBox();
  }
}

function stopMusic() {
  const bgAudio = document.getElementById("bgAudio");
  const musicIcon = document.getElementById("musicIcon");
  const musicText = document.getElementById("musicText");

  isMusicPlaying = false;
  musicIcon.textContent = "🔇";
  musicText.textContent = "Bật nhạc";

  bgAudio.pause();
  if (fallbackInterval) {
    clearInterval(fallbackInterval);
    fallbackInterval = null;
  }
}

function playFallbackMusicBox() {
  if (fallbackInterval) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (!audioCtx) audioCtx = new AudioContextClass();
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 698.46, 880.0, 698.46];
  let step = 0;

  fallbackInterval = setInterval(() => {
    if (!isMusicPlaying) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = notes[step % notes.length];

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.15);
    step++;
  }, 550);
}

// ================= HIỆU ỨNG CÁNH HOA RƠI & PHÁO GIẤY =================
function initPetalsBackground() {
  const canvas = document.getElementById("petalCanvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const petals = Array.from({ length: 26 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 5,
    speedY: Math.random() * 0.8 + 0.4,
    speedX: Math.random() * 0.6 - 0.3,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.02
  }));

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.angle) * 0.3;
      p.angle += p.spin;

      if (p.y > canvas.height + 20) {
        p.y = -15;
        p.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = "rgba(240, 98, 146, 0.38)";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(render);
  }
  render();
}

function fireConfettiBurst() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#e91e63", "#f48fb1", "#ffd54f", "#ff80ab", "#d4af37"];
  const particles = Array.from({ length: 75 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 14,
    vy: (Math.random() - 0.75) * 15,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach((pt) => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.28;
      pt.alpha -= 0.014;

      if (pt.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}
