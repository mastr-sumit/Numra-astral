// =============================================
//   NUMRA ASTRAL — script.js
// =============================================


// =============================================
//   1. CUSTOM CURSOR
// =============================================
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursorDot');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
});

// Scale cursor on hover over interactive elements
document.querySelectorAll('a, button, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});


// =============================================
//   2. ANIMATED STAR CANVAS
// =============================================
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Generate random stars
const stars = Array.from({ length: 220 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.2 + 0.2,
  a: Math.random(),
  speed: Math.random() * 0.004 + 0.002,
  twinkle: Math.random() * Math.PI * 2
}));

// Shooting stars array
let shootingStars = [];

// Add a new shooting star at intervals
function addShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width * 0.7,
    y: Math.random() * canvas.height * 0.4,
    len: Math.random() * 100 + 60,
    speed: Math.random() * 6 + 4,
    a: 1,
    angle: Math.PI / 4
  });
}

setInterval(addShootingStar, 3500);

// Main draw loop
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background radial gradient
  const bg = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.8
  );
  bg.addColorStop(0, 'rgba(13,13,43,0.4)');
  bg.addColorStop(1, 'rgba(7,7,26,0.1)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw twinkling stars
  stars.forEach(s => {
    s.twinkle += s.speed;
    const alpha = s.a * (0.5 + 0.5 * Math.sin(s.twinkle));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 248, 220, ${alpha})`;
    ctx.fill();
  });

  // Draw and animate shooting stars
  shootingStars = shootingStars.filter(ss => ss.a > 0.01);
  shootingStars.forEach(ss => {
    const grad = ctx.createLinearGradient(
      ss.x, ss.y,
      ss.x - ss.len * Math.cos(ss.angle),
      ss.y - ss.len * Math.sin(ss.angle)
    );
    grad.addColorStop(0, `rgba(201,168,76,${ss.a})`);
    grad.addColorStop(1, 'rgba(201,168,76,0)');

    ctx.beginPath();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(
      ss.x - ss.len * Math.cos(ss.angle),
      ss.y - ss.len * Math.sin(ss.angle)
    );
    ctx.stroke();

    // Move the shooting star
    ss.x += ss.speed * Math.cos(ss.angle);
    ss.y += ss.speed * Math.sin(ss.angle);
    ss.a -= 0.015;
  });

  requestAnimationFrame(drawStars);
}

drawStars();

// Resize canvas on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


// =============================================
//   3. SCROLL FADE-IN ANIMATION
// =============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


// =============================================
//   4. NUMEROLOGY LIFE PATH CALCULATOR
//   Unique reading for every single DOB
// =============================================

function reduceToCore(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return n;
}

function calcLifePath() {
  const input = document.getElementById('dob-input').value;
  if (!input) { alert('Please enter your date of birth.'); return; }

  const date   = new Date(input);
  const day    = date.getDate();
  const month  = date.getMonth() + 1;
  const year   = date.getFullYear();
  const dow    = date.getDay(); // 0=Sun, 6=Sat

  // ── Core numbers ──────────────────────────────
  const lifePathRaw = day + month + year;
  const lifePath    = reduceToCore(lifePathRaw);

  const dayNum      = reduceToCore(day);
  const monthNum    = reduceToCore(month);
  const yearNum     = reduceToCore(year);

  // ── Lookup tables ──────────────────────────────

  const lifePathData = {
    1:  { title: "The Pioneer",       icon: "☀️", color: "#FFD700", trait: "bold, independent, driven",     desire: "lead and create your own path" },
    2:  { title: "The Peacemaker",    icon: "🌙", color: "#C8A2C8", trait: "intuitive, gentle, diplomatic",  desire: "build harmony and deep connections" },
    3:  { title: "The Creator",       icon: "✨", color: "#FF8C42", trait: "expressive, joyful, magnetic",   desire: "inspire the world through your gifts" },
    4:  { title: "The Architect",     icon: "🏛️", color: "#8BA888", trait: "disciplined, loyal, grounded",   desire: "build lasting foundations for others" },
    5:  { title: "The Free Spirit",   icon: "🌊", color: "#5BC0EB", trait: "adventurous, curious, fearless", desire: "experience every colour of life" },
    6:  { title: "The Nurturer",      icon: "🌸", color: "#FF9EAA", trait: "loving, responsible, wise",      desire: "protect and uplift everyone around you" },
    7:  { title: "The Mystic",        icon: "🔮", color: "#9B72CF", trait: "spiritual, analytical, deep",    desire: "uncover the hidden truths of existence" },
    8:  { title: "The Powerhouse",    icon: "⚡", color: "#C9A84C", trait: "ambitious, authoritative, bold", desire: "achieve mastery and leave a legacy" },
    9:  { title: "The Sage",          icon: "🕊️", color: "#B5D99C", trait: "compassionate, wise, selfless",  desire: "heal the world through love and wisdom" },
    11: { title: "The Visionary",     icon: "🌟", color: "#E8C97A", trait: "intuitive, spiritual, electric", desire: "awaken and illuminate others" },
    22: { title: "The Master Builder",icon: "🏗️", color: "#C9A84C", trait: "powerful, visionary, grounded",  desire: "manifest the grandest dreams into reality" },
    33: { title: "The Master Teacher",icon: "💫", color: "#FFD700", trait: "compassionate, nurturing, divine",desire: "guide humanity with pure unconditional love" },
  };

  const dayMeanings = {
    1: "You were born to initiate. You don't wait — you begin.",
    2: "Your birth day carries a deep sensitivity. You feel what others miss.",
    3: "A day of pure creative fire. Your words and ideas carry real power.",
    4: "Born on a day of structure. You are a natural problem solver.",
    5: "Your birth day vibrates with change and magnetic energy.",
    6: "You carry a natural responsibility. People instinctively trust you.",
    7: "Born on a sacred day of introspection. Your mind goes very deep.",
    8: "A day of power and manifestation. What you focus on, you attract.",
    9: "Your birth day is one of completion — you carry old-soul wisdom.",
  };

  const monthMeanings = {
    1:  "January births carry the energy of new beginnings and raw courage.",
    2:  "February births are deeply empathic, often gifted with psychic sensitivity.",
    3:  "March births burst with creativity — spring energy lives in your soul.",
    4:  "April births carry fiery initiative and a relentless drive.",
    5:  "May births are grounded yet expressive — nature and beauty guide you.",
    6:  "June births carry duality — you are both logical and deeply emotional.",
    7:  "July births are deeply intuitive, shaped by water and the moon.",
    8:  "August births radiate confidence — leadership comes naturally to you.",
    9:  "September births are analytical and refined, with a gift for precision.",
    10: "October births carry balance and beauty — you see all sides of life.",
    11: "November births are intense, transformative and magnetically powerful.",
    12: "December births carry ancient wisdom — you are an old soul.",
  };

  const dowMeanings = {
    0: "Born on a Sunday — the Sun's day. You carry solar energy: warmth, radiance and natural authority.",
    1: "Born on a Monday — the Moon's day. Your emotions run deep and your intuition is your compass.",
    2: "Born on a Tuesday — Mars' day. You have a warrior spirit and an unstoppable drive.",
    3: "Born on a Wednesday — Mercury's day. Your mind is sharp, quick and brilliantly communicative.",
    4: "Born on a Thursday — Jupiter's day. Abundance, luck and wisdom follow you through life.",
    5: "Born on a Friday — Venus' day. Love, beauty and creativity are woven into your very nature.",
    6: "Born on a Saturday — Saturn's day. You are disciplined, resilient and built to endure.",
  };

  const yearEnergy = {
    1: "Your birth year carries the number of new cycles — you are here to start something that outlasts you.",
    2: "Your birth year vibrates with partnership — relationships shape your entire destiny.",
    3: "Your birth year hums with creative energy — self-expression is your life's deepest purpose.",
    4: "Your birth year is grounded in hard work — your greatest achievements come through perseverance.",
    5: "Your birth year pulses with freedom — change is not something that happens to you, it is you.",
    6: "Your birth year carries family energy — love and responsibility define your soul's contract.",
    7: "Your birth year holds spiritual depth — you are here to ask the questions others dare not ask.",
    8: "Your birth year vibrates with abundance — you have a natural alignment with material success.",
    9: "Your birth year carries completion energy — you are here to finish what others could not.",
  };

  // Lucky elements derived from DOB
  const gems    = ["Amethyst","Citrine","Rose Quartz","Lapis Lazuli","Tiger's Eye","Moonstone","Black Tourmaline","Pyrite","Emerald","Sapphire","Ruby","Jade"];
  const colors  = ["Deep Violet","Golden Yellow","Rose Pink","Midnight Blue","Forest Green","Burnt Orange","Silver White","Royal Red","Turquoise","Ivory","Crimson","Champagne"];
  const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const chakras = ["Root Chakra","Sacral Chakra","Solar Plexus","Heart Chakra","Throat Chakra","Third Eye","Crown Chakra"];

  const luckyGem    = gems[   (day + month)     % gems.length    ];
  const luckyColor  = colors[ (day + yearNum)   % colors.length  ];
  const luckyPlanet = planets[(monthNum + dayNum) % planets.length];
  const luckyChakra = chakras[ lifePath          % chakras.length ];
  const luckyDay    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][(day * month) % 7];
  const luckyNumber = reduceToCore(day + month);

  // ── Compose reading ────────────────────────────
  const lp   = lifePathData[lifePath];
  const box  = document.getElementById('result-box');
  const text = document.getElementById('result-text');

  box.style.display = 'block';
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  text.innerHTML = `
    <div class="reading-header">
      <span class="reading-icon">${lp.icon}</span>
      <div>
        <p class="reading-number">Life Path <strong>${lifePath}</strong></p>
        <p class="reading-title" style="color:${lp.color}">${lp.title}</p>
      </div>
    </div>

    <p class="reading-trait">✦ You are <em>${lp.trait}</em> — and you are here to <em>${lp.desire}.</em></p>

    <div class="reading-grid">
      <div class="reading-block">
        <p class="rb-label">🔢 Birth Day ${day} Energy</p>
        <p class="rb-text">${dayMeanings[dayNum]}</p>
      </div>
      <div class="reading-block">
        <p class="rb-label">📅 Birth Month Energy</p>
        <p class="rb-text">${monthMeanings[month]}</p>
      </div>
      <div class="reading-block">
        <p class="rb-label">🌍 Birth Year Vibration</p>
        <p class="rb-text">${yearEnergy[yearNum]}</p>
      </div>
      <div class="reading-block">
        <p class="rb-label">🌙 Day of Birth</p>
        <p class="rb-text">${dowMeanings[dow]}</p>
      </div>
    </div>

    <div class="reading-lucky">
      <p class="rb-label" style="margin-bottom:12px;">✨ Your Personal Lucky Elements</p>
      <div class="lucky-pills">
        <span class="pill">💎 ${luckyGem}</span>
        <span class="pill">🎨 ${luckyColor}</span>
        <span class="pill">🪐 ${luckyPlanet}</span>
        <span class="pill">🧘 ${luckyChakra}</span>
        <span class="pill">📅 ${luckyDay}</span>
        <span class="pill">🔢 Lucky No. ${luckyNumber}</span>
      </div>
    </div>

    <div class="reading-cta">
      <p>Want a <strong>full personalised reading</strong> based on your complete birth chart?</p>
      <a href="https://wa.me/917038031569?text=Hi!%20I%20saw%20your%20website%20and%20I%20want%20to%20book%20an%20astrology%20reading.%20Please%20help%20me.%20My%20Life%20Path%20is%20${lifePath}.%20I%20would%20love%20a%20full%20reading!" target="_blank" class="reading-wa-btn">💬 Get My Full Reading on WhatsApp</a>
    </div>
  `;
}
