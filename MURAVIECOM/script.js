/**
 * ==========================================================================
 * МУРАВЬИ-МСТИТЕЛИ vs ДОКТОР ДУМ | ОСНОВНОЙ СКРИПТ & ЗВУКОВОЙ ДВИЖОК
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. WEB AUDIO API SYNTHESIZER (Полностью автономный звук без внешних mp3)
  // ------------------------------------------------------------------------
  let audioCtx = null;
  let isSoundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Звуковые эффекты:
  const SoundFX = {
    // Выстрел репульсора Железного Муравья
    laser() {
      if (!isSoundEnabled || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.16);
      } catch (e) { console.warn(e); }
    },

    // Звонкий металлический бросок крышки-щита
    shield() {
      if (!isSoundEnabled || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.26);
      } catch (e) { console.warn(e); }
    },

    // Взрыв / Удар Халка
    explosion() {
      if (!isSoundEnabled || !audioCtx) return;
      try {
        const bufferSize = audioCtx.sampleRate * 0.25;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);
        filter.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.25);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
      } catch (e) { console.warn(e); }
    },

    // Сбор кристалла сахара (звонкий чиптюн-аккорд)
    sugarChime() {
      if (!isSoundEnabled || !audioCtx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          const start = audioCtx.currentTime + idx * 0.04;
          gain.gain.setValueAtTime(0.18, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(start);
          osc.stop(start + 0.13);
        });
      } catch (e) { console.warn(e); }
    },

    // Злодейский синтез Дума
    doomLaugh() {
      if (!isSoundEnabled || !audioCtx) return;
      try {
        const pitches = [220, 196, 174, 155, 130];
        pitches.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.18);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + i * 0.1);
          osc.stop(audioCtx.currentTime + i * 0.1 + 0.19);
        });
      } catch (e) { console.warn(e); }
    },

    // Героический синтезаторный фанфар (гимн Мстителей)
    playAnthem() {
      if (!audioCtx) initAudio();
      if (!audioCtx) return;
      const melody = [
        { f: 261.63, d: 0.18 }, // C4
        { f: 329.63, d: 0.18 }, // E4
        { f: 392.00, d: 0.25 }, // G4
        { f: 523.25, d: 0.45 }, // C5
        { f: 493.88, d: 0.20 }, // B4
        { f: 523.25, d: 0.55 }, // C5
      ];
      let t = audioCtx.currentTime;
      melody.forEach(item => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(item.f, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + item.d - 0.03);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + item.d);
        t += item.d;
      });
    }
  };

  // Переключатель звука
  const btnSound = document.getElementById('btn-sound');
  const soundIconOn = btnSound.querySelector('.sound-icon-on');
  const soundIconOff = btnSound.querySelector('.sound-icon-off');
  const soundToast = document.getElementById('sound-toast');

  function showToast(text, icon = '🔊') {
    soundToast.querySelector('.toast-icon').textContent = icon;
    soundToast.querySelector('.toast-text').textContent = text;
    soundToast.classList.remove('hidden');
    clearTimeout(soundToast._timer);
    soundToast._timer = setTimeout(() => {
      soundToast.classList.add('hidden');
    }, 2800);
  }

  btnSound.addEventListener('click', () => {
    initAudio();
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      soundIconOn.style.display = 'inline';
      soundIconOff.style.display = 'none';
      btnSound.classList.add('active');
      showToast('Звуковые эффекты включены!');
      SoundFX.sugarChime();
    } else {
      soundIconOn.style.display = 'none';
      soundIconOff.style.display = 'inline';
      btnSound.classList.remove('active');
      showToast('Звуковые эффекты выключены.', '🔇');
    }
  });

  document.getElementById('btn-anthem').addEventListener('click', () => {
    initAudio();
    SoundFX.playAnthem();
    showToast('Звучит героический синтез-гимн Муравстей!', '🎺');
  });

  // Включение аудио при любом первом клике
  window.addEventListener('click', () => {
    if (!audioCtx) initAudio();
  }, { once: true });


  // ------------------------------------------------------------------------
  // 2. ДИНАМИЧЕСКИЙ ФОНОВЫЙ CANVAS (Частицы сахара, сосновые иглы и плазма)
  // ------------------------------------------------------------------------
  const bgCanvas = document.getElementById('fx-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  let bgParticles = [];

  function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * bgCanvas.width;
      this.y = Math.random() * bgCanvas.height;
      this.size = Math.random() * 4 + 2;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = Math.random() * 0.7 + 0.3;
      this.type = Math.random() > 0.4 ? 'sugar' : 'needle';
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.04;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.spin;
      if (this.y > bgCanvas.height + 20) {
        this.y = -10;
        this.x = Math.random() * bgCanvas.width;
      }
    }
    draw(ctx, isDoom) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;

      if (isDoom) {
        // Зеленая кибер-плазма Дума
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'sugar') {
        // Блестящие кристаллы сахара
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      } else {
        // Сосновые иглы
        ctx.strokeStyle = '#854d0e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < 45; i++) {
    bgParticles.push(new Particle());
  }

  function animateBg() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    const isDoom = document.body.classList.contains('theme-doom');
    bgParticles.forEach(p => {
      p.update();
      p.draw(bgCtx, isDoom);
    });
    requestAnimationFrame(animateBg);
  }
  animateBg();


  // ------------------------------------------------------------------------
  // 3. РЕЖИМ ДУМА (ЛАТВЕРИЙСКИЙ ИСТЕР-ЭГГ)
  // ------------------------------------------------------------------------
  const btnDoomMode = document.getElementById('btn-doom-mode');
  const screenFlash = document.getElementById('screen-flash');

  btnDoomMode.addEventListener('click', () => {
    initAudio();
    const isNowDoom = document.body.classList.toggle('theme-doom');
    
    // Эффект вспышки экрана
    screenFlash.classList.add('active');
    setTimeout(() => screenFlash.classList.remove('active'), 250);

    if (isNowDoom) {
      btnDoomMode.classList.add('active');
      btnDoomMode.querySelector('.doom-btn-text').textContent = 'СВЕРГНУТЬ ДУМА';
      SoundFX.doomLaugh();
      showToast('ВНИМАНИЕ: СЕКТОР ЗАХВАЧЕН ДОКТОРОМ ДУМОМ!', '👑');
    } else {
      btnDoomMode.classList.remove('active');
      btnDoomMode.querySelector('.doom-btn-text').textContent = 'РЕЖИМ ДУМА';
      SoundFX.laser();
      showToast('Мстители восстановили контроль над Муравейником!', '🛡️');
    }
  });


  // ------------------------------------------------------------------------
  // 4. ФИЛЬТРАЦИЯ И ДОСЬЕ ГЕРОЕВ
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const charCards = document.querySelectorAll('.char-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      SoundFX.shield();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      charCards.forEach(card => {
        if (filter === 'all' || card.dataset.faction === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // База данных подробных досье
  const HeroDatabase = {
    cap: {
      name: 'Капитан Муравей',
      realName: 'Стив Роджерс-Мураш',
      role: 'Лидер Муравьев-Мстителей',
      img: 'assets/images/captain-ant.svg',
      quote: '«Я могу таскать эту крошку хлеба целый день!»',
      desc: 'Бывший щуплый рабочий муравей из туннеля №12. Получил дозу легендарной «Сыворотки Супер-Нектара», увеличившей его силу в 5000 раз. Несет нерушимый щит из крышки вишневой колы.',
      powers: ['Подъем веса в 5000×', 'Феромонное воодушевление колонии', 'Снайперский рикошет крышкой-щитом'],
      gear: 'Крышка от лимонада с нарезным зубчатым ободом, кожаная портупея из соснового лыка.',
      weakness: 'Не может пройти мимо попавшей в беду гусеницы.'
    },
    iron: {
      name: 'Железный Муравей',
      realName: 'Энтони «Тони» Стерк',
      role: 'Главный инженер и финансист коалиции',
      img: 'assets/images/iron-ant.svg',
      quote: '«Гений, миллиардер, плейбой, муравей-строитель.»',
      desc: 'Муравей-гений, создавший нано-хитиновый экзоскелет после побега из плена Термитов. Костюм запитан от компактного нектарного микро-реактора холодного синтеза.',
      powers: ['Ионные репульсоры в передних лапах', 'Сверхзвуковой полет на микро-соплах', 'Бортовой ИИ «МУРВИС»'],
      gear: 'Броня Mark-LXXXV из титанизированного панциря жука-носорога.',
      weakness: 'Постоянно требует свежий нектар элитных сортов.'
    },
    doom: {
      name: 'Доктор Муравей Дум',
      realName: 'Виктор фон Мурав',
      role: 'Владыка Латверийского Пня',
      img: 'assets/images/doctor-doom-ant.svg',
      quote: '«Перед величием Дума даже люди — лишь неуклюжие великаны!»',
      desc: 'Сверхразумный кибер-монарх, скрывающий поврежденный в опытах хитин под маской из микро-титана. Объединил магию лесных грибов и кибернетику механических тлей.',
      powers: ['Ионный расщепитель в мандибулах', 'Биоплазменные энергетические щиты', 'Управление армией Дум-ботов по радиочастотам'],
      gear: 'Плащ из бархатного мха, титановая маска с решеткой охлаждения.',
      weakness: 'Абсолютная неспособность признать чужой гений.'
    },
    thor: {
      name: 'Тор-Муравей',
      realName: 'Тор Одинсон из Асгарда',
      role: 'Бог Микро-Грома',
      img: 'assets/images/thor-ant.svg',
      quote: '«Этот часовой винтик поднимет лишь достойный!»',
      desc: 'Асгардский принц среди шестиногих. Управляет статическим электричеством, возникающим при трении лапок о шерстяной плед. Владеет священным винтиком Мьёльниром.',
      powers: ['Призыв статического удара до 50 000 милливольт', 'Неуязвимость к электрическим ловушкам', 'Полет с помощью раскрутки винтика'],
      gear: 'Мьёльнир (часовой винт со шлицем и рукоятью из зубочистки).',
      weakness: 'Слишком любит пить перебродивший яблочный сок.'
    },
    hulk: {
      name: 'Муравьиный Халк',
      realName: 'Д-р Брюс Беннет-Мураш',
      role: 'Гамма-Титан Разрушения',
      img: 'assets/images/hulk-ant.svg',
      quote: '«ХАЛК КРОШИТЬ САХАРНЫЙ ПЕСОК!»',
      desc: 'Мирный муравей-ученый, случайно упавший в чан с радиоактивным сиропом «Гамма-Кола». При стрессе превращается в гигантского зеленого лесного муравья невероятной мощи.',
      powers: ['Разрушительная сила челюстей', 'Прыжки на высоту до 2 метров', 'Регенерация хитинового слоя'],
      gear: 'Порванные шорты из лепестка фиалки.',
      weakness: 'Успокаивается, если почесать усики былинкой.'
    },
    doombot: {
      name: 'Дум-Бот «Тля-Уничтожитель»',
      realName: 'Серия DM-07',
      role: 'Штурмовой дрон Легиона Дума',
      img: 'assets/images/doom-bot.svg',
      quote: '«СЛАВА ДУМУ. ЦЕЛЬ ОБНАРУЖЕНА. АННИГИЛЯЦИЯ.»',
      desc: 'Кибернетически аугментированная садовая тля с бронированным панцирем и кислотным баком. Работает по сетевому протоколу пчелиного улья под управлением Дума.',
      powers: ['Плевок концентрированной муравьиной кислотой', 'Стальные циркулярные микро-пилы', 'Роевой интеллект'],
      gear: 'Титановый экзоскелет, лазерный визор с ночным зрением.',
      weakness: 'Замыкает при попадании обычной капли росы.'
    },
    widow: {
      name: 'Черная Муравьиха',
      realName: 'Наташа Муравьева',
      role: 'Мастер тайных операций',
      img: 'assets/images/widow-ant.svg',
      quote: '«Ты не увидишь меня, пока не станет слишком поздно.»',
      desc: 'Выпускница секретной программы «Красная Личинка». Владеет всеми видами шестиногого рукопашного боя и техникой маскировки под любой вид насекомых.',
      powers: ['Абсолютная скрытность и бесшумный шаг', 'Электро-жала в передних клешнях', 'Знание 40 диалектов феромонов'],
      gear: 'Тактический жилет из паутины каракурта, парные шокеры.',
      weakness: 'Таинственное прошлое, полное невысказанных тайн.'
    },
    hawkeye: {
      name: 'Соколиный Ус',
      realName: 'Клинт Муравсон',
      role: 'Снайпер отряда',
      img: 'assets/images/hawkeye-ant.svg',
      quote: '«Я никогда не промахиваюсь. Даже в сильный ветерок.»',
      desc: 'Муравей с феноменальной остротой фасеточного зрения. Способен рассчитать поправку на порыв сквозняка и поразить цель на расстоянии нескольких метров.',
      powers: ['100% меткость в полете и на бегу', 'Мгновенная реакция усиков на колебания воздуха'],
      gear: 'Лук из сосновой иглы и паучьего шелка, стрелы с шипами роз.',
      weakness: 'Всего 36 стрел в колчане.'
    }
  };

  // Модальное окно досье
  const modal = document.getElementById('char-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close-btn');

  function openCharModal(charKey) {
    const data = HeroDatabase[charKey];
    if (!data) return;
    initAudio();
    SoundFX.shield();

    modalContent.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
          <div style="width:140px; height:140px; background:#090e1a; border:3px solid #000; border-radius:8px; display:flex; align-items:center; justify-content:center; box-shadow:4px 4px 0px #000;">
            <img src="${data.img}" alt="${data.name}" style="max-width:90%; max-height:90%;">
          </div>
          <div style="flex:1;">
            <div style="color:var(--color-accent-gold); font-weight:bold; font-size:0.85rem; text-transform:uppercase;">${data.realName}</div>
            <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:#fff; text-shadow:2px 2px 0px #000;">${data.name}</h2>
            <div style="color:#94a3b8; font-weight:600; margin-bottom:8px;">${data.role}</div>
            <div style="background:rgba(0,0,0,0.3); padding:8px 12px; border-left:3px solid #facc15; font-style:italic; font-size:0.9rem; color:#f8fafc;">${data.quote}</div>
          </div>
        </div>
        <p style="font-size:0.95rem; color:#cbd5e1; line-height:1.6;">${data.desc}</p>
        <div>
          <h4 style="font-family:var(--font-heading); font-size:1rem; color:#38bdf8; margin-bottom:6px;">СУПЕРСПОСОБНОСТИ:</h4>
          <ul style="padding-left:20px; color:#f8fafc; font-size:0.9rem;">
            ${data.powers.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        <div style="font-size:0.9rem; color:#cbd5e1;">
          <strong style="color:#facc15;">Экипировка:</strong> ${data.gear}
        </div>
        <div style="font-size:0.9rem; color:#cbd5e1;">
          <strong style="color:#ef4444;">Уязвимость:</strong> ${data.weakness}
        </div>
        <button id="modal-cry-btn" class="btn-comic btn-primary" style="margin-top:10px;">
          🔊 БОЕВОЙ КЛИЧ
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    document.getElementById('modal-cry-btn').addEventListener('click', () => {
      initAudio();
      if (charKey === 'doom' || charKey === 'doombot') {
        SoundFX.doomLaugh();
      } else if (charKey === 'cap') {
        SoundFX.shield();
      } else if (charKey === 'iron') {
        SoundFX.laser();
      } else if (charKey === 'hulk') {
        SoundFX.explosion();
      } else {
        SoundFX.playAnthem();
      }
      showToast(data.quote, '📣');
    });
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.querySelectorAll('.btn-inspect').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCharModal(btn.dataset.target);
    });
  });

  document.querySelectorAll('.char-card').forEach(card => {
    card.addEventListener('click', () => {
      openCharModal(card.dataset.char);
    });
  });


  // ------------------------------------------------------------------------
  // 5. ИНТЕРАКТИВНАЯ АРКАДНАЯ МИНИ-ИГРА («БИТВА ЗА САХАРНЫЙ ТРОН»)
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const gameOverlay = document.getElementById('game-overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayDesc = document.getElementById('overlay-desc');
  const btnStartGame = document.getElementById('btn-start-game');
  const scoreVal = document.getElementById('game-score');
  const sugarVal = document.getElementById('game-sugar');
  const hpBarInner = document.getElementById('game-hp');
  const highscoreVal = document.getElementById('game-highscore');

  let highscore = parseInt(localStorage.getItem('ant_highscore') || '0', 10);
  highscoreVal.textContent = String(highscore).padStart(4, '0');

  let selectedHero = 'iron';
  document.querySelectorAll('.btn-picker').forEach(pBtn => {
    pBtn.addEventListener('click', () => {
      initAudio();
      SoundFX.shield();
      document.querySelectorAll('.btn-picker').forEach(b => b.classList.remove('active'));
      pBtn.classList.add('active');
      selectedHero = pBtn.dataset.hero;
    });
  });

  let gameState = 'STOPPED'; // STOPPED, PLAYING, GAMEOVER, VICTORY
  let score = 0;
  let sugarCount = 0;
  let player = {
    x: 400,
    y: 410,
    width: 44,
    height: 48,
    speed: 6.5,
    hp: 100,
    maxHp: 100,
    lastShot: 0
  };

  let keys = { left: false, right: false, fire: false };
  let bullets = [];
  let enemies = [];
  let enemyBullets = [];
  let pickups = [];
  let floatingTexts = [];
  let boss = null;
  let wave = 1;
  let spawnTimer = 0;

  // Слушатели клавиатуры
  window.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = true;
    if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = true;
    if (e.code === 'Space') {
      keys.fire = true;
      if (gameState === 'PLAYING') e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = false;
    if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = false;
    if (e.code === 'Space') keys.fire = false;
  });

  // Мобильные кнопки
  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnFire = document.getElementById('btn-fire');

  const bindTouch = (btn, key) => {
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; });
    btn.addEventListener('mousedown', () => { keys[key] = true; });
    btn.addEventListener('mouseup', () => { keys[key] = false; });
  };
  bindTouch(btnLeft, 'left');
  bindTouch(btnRight, 'right');
  bindTouch(btnFire, 'fire');

  function addFloatingText(x, y, text, color = '#facc15') {
    floatingTexts.push({ x, y, text, color, life: 30, maxLife: 30 });
  }

  function startMiniGame() {
    initAudio();
    SoundFX.laser();
    gameState = 'PLAYING';
    score = 0;
    sugarCount = 0;
    wave = 1;
    player.hp = 100;
    player.x = canvas.width / 2 - 22;
    bullets = [];
    enemies = [];
    enemyBullets = [];
    pickups = [];
    floatingTexts = [];
    boss = null;
    spawnTimer = 0;

    gameOverlay.classList.add('hidden');
    updateHUD();
  }

  btnStartGame.addEventListener('click', startMiniGame);

  function updateHUD() {
    scoreVal.textContent = String(score).padStart(4, '0');
    sugarVal.textContent = `${sugarCount} 🍬`;
    const hpPct = Math.max(0, (player.hp / player.maxHp) * 100);
    hpBarInner.style.width = `${hpPct}%`;
    if (hpPct < 30) {
      hpBarInner.style.background = '#dc2626';
    } else {
      hpBarInner.style.background = '#22c55e';
    }

    if (score > highscore) {
      highscore = score;
      localStorage.setItem('ant_highscore', String(highscore));
      highscoreVal.textContent = String(highscore).padStart(4, '0');
    }
  }

  function spawnWave() {
    if (wave === 3 && !boss) {
      // Спавн БОССА — Доктора Дума
      boss = {
        x: canvas.width / 2 - 40,
        y: 60,
        width: 80,
        height: 80,
        hp: 350,
        maxHp: 350,
        vx: 3,
        lastAttack: 0
      };
      SoundFX.doomLaugh();
      addFloatingText(canvas.width / 2, 140, 'БОСС: ДОКТОР МУРАВЕЙ ДУМ!', '#ef4444');
      return;
    }

    // Обычные волны врагов
    const count = 4 + wave * 2;
    for (let i = 0; i < count; i++) {
      enemies.push({
        x: 60 + (i % 6) * 110,
        y: 30 + Math.floor(i / 6) * 50,
        width: 34,
        height: 34,
        hp: 2,
        vx: (Math.random() - 0.5) * 2,
        type: Math.random() > 0.4 ? 'aphid' : 'wasp'
      });
    }
  }

  function shootPlayerBullet() {
    const now = Date.now();
    if (selectedHero === 'iron') {
      // Скорострельный лазер
      if (now - player.lastShot < 180) return;
      player.lastShot = now;
      bullets.push({
        x: player.x + 8,
        y: player.y,
        vx: 0,
        vy: -9,
        width: 4,
        height: 14,
        color: '#38bdf8',
        dmg: 1
      });
      bullets.push({
        x: player.x + player.width - 12,
        y: player.y,
        vx: 0,
        vy: -9,
        width: 4,
        height: 14,
        color: '#38bdf8',
        dmg: 1
      });
      SoundFX.laser();
    } else {
      // Рикошетящий вибрирующий щит Капитана
      if (now - player.lastShot < 380) return;
      player.lastShot = now;
      bullets.push({
        x: player.x + player.width / 2 - 10,
        y: player.y - 10,
        vx: (Math.random() - 0.5) * 4,
        vy: -7.5,
        width: 20,
        height: 20,
        color: '#ef4444',
        dmg: 2.5,
        isShield: true
      });
      SoundFX.shield();
    }
  }

  function gameOver(won = false) {
    gameState = won ? 'VICTORY' : 'GAMEOVER';
    gameOverlay.classList.remove('hidden');
    if (won) {
      overlayTitle.textContent = 'ТРИУМФ МСТИТЕЛЕЙ!';
      overlayDesc.textContent = `Доктор Дум повержен! Вы спасли Сахарный Кристалл! Финальный счет: ${score}.`;
      btnStartGame.textContent = '🌟 СЫГРАТЬ ЕЩЕ РАЗ';
      SoundFX.playAnthem();
    } else {
      overlayTitle.textContent = 'МУРАВЕЙНИК ПАЛ!';
      overlayDesc.textContent = `Ваш отряд не устоял. Доктор Дум захватил рафинад. Счет: ${score}.`;
      btnStartGame.textContent = '⚔️ ПОПРОБОВАТЬ СНОВА';
      SoundFX.doomLaugh();
    }
  }

  // Основной цикл игры (60 FPS)
  function gameLoop() {
    // Отрисовка фона арены
    ctx.fillStyle = '#06101e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Сетка поля боя
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }

    if (gameState === 'PLAYING') {
      // Движение игрока
      if (keys.left && player.x > 10) player.x -= player.speed;
      if (keys.right && player.x < canvas.width - player.width - 10) player.x += player.speed;
      if (keys.fire) shootPlayerBullet();

      // Спавн волн
      if (enemies.length === 0 && !boss) {
        spawnTimer++;
        if (spawnTimer > 40) {
          spawnTimer = 0;
          wave++;
          if (wave > 3 && !boss) {
            gameOver(true);
          } else {
            spawnWave();
            addFloatingText(canvas.width / 2, 200, `ВОЛНА ${wave}`, '#38bdf8');
          }
        }
      }

      // Обновление пуль игрока
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx || 0;
        b.y += b.vy;

        // Рикошет для щита
        if (b.isShield && (b.x < 10 || b.x > canvas.width - 30)) {
          b.vx = -b.vx;
        }

        // Проверка столкновения с врагами
        let hit = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (b.x < e.x + e.width && b.x + b.width > e.x &&
              b.y < e.y + e.height && b.y + b.height > e.y) {
            e.hp -= b.dmg;
            hit = true;
            SoundFX.explosion();
            addFloatingText(e.x, e.y, b.isShield ? 'ДЗЫНЬ!' : 'БАХ!');

            if (e.hp <= 0) {
              score += e.type === 'wasp' ? 30 : 20;
              // Шанс дропа сахара
              if (Math.random() > 0.4) {
                pickups.push({ x: e.x + 8, y: e.y, vy: 1.8 });
              }
              enemies.splice(j, 1);
            }
            break;
          }
        }

        // Столкновение с боссом
        if (boss && !hit) {
          if (b.x < boss.x + boss.width && b.x + b.width > boss.x &&
              b.y < boss.y + boss.height && b.y + b.height > boss.y) {
            boss.hp -= b.dmg;
            hit = true;
            SoundFX.explosion();
            addFloatingText(b.x, b.y, '-10 HP', '#22c55e');
            if (boss.hp <= 0) {
              score += 500;
              boss = null;
              gameOver(true);
            }
          }
        }

        if (b.y < -20 || (hit && !b.isShield)) {
          bullets.splice(i, 1);
        }
      }

      // Обновление врагов
      enemies.forEach(e => {
        e.x += e.vx;
        if (e.x < 20 || e.x > canvas.width - 50) e.vx = -e.vx;

        // Стрельба врагов кислотой
        if (Math.random() < 0.008) {
          enemyBullets.push({
            x: e.x + 14,
            y: e.y + 30,
            vy: 3.5,
            color: '#22c55e'
          });
        }
      });

      // Обновление Босса Дума
      if (boss) {
        boss.x += boss.vx;
        if (boss.x < 40 || boss.x > canvas.width - boss.width - 40) boss.vx = -boss.vx;

        // Атаки босса
        const now = Date.now();
        if (now - boss.lastAttack > 900) {
          boss.lastAttack = now;
          // Веерная атака
          [-2, 0, 2].forEach(vx => {
            enemyBullets.push({
              x: boss.x + boss.width / 2,
              y: boss.y + boss.height,
              vx: vx,
              vy: 4.5,
              color: '#4ade80'
            });
          });
        }
      }

      // Обновление пуль врагов
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eb = enemyBullets[i];
        eb.x += eb.vx || 0;
        eb.y += eb.vy;

        // Попадание в игрока
        if (eb.x < player.x + player.width && eb.x + 6 > player.x &&
            eb.y < player.y + player.height && eb.y + 12 > player.y) {
          player.hp -= 12;
          SoundFX.explosion();
          addFloatingText(player.x, player.y - 10, 'УРОН!', '#ef4444');
          enemyBullets.splice(i, 1);
          if (player.hp <= 0) {
            gameOver(false);
          }
          continue;
        }

        if (eb.y > canvas.height + 20) {
          enemyBullets.splice(i, 1);
        }
      }

      // Обновление дропа сахара
      for (let i = pickups.length - 1; i >= 0; i--) {
        const p = pickups[i];
        p.y += p.vy;

        // Сбор сахара
        if (p.x < player.x + player.width && p.x + 16 > player.x &&
            p.y < player.y + player.height && p.y + 16 > player.y) {
          sugarCount++;
          score += 50;
          player.hp = Math.min(player.maxHp, player.hp + 15);
          SoundFX.sugarChime();
          addFloatingText(player.x + 10, player.y - 20, '+1 САХАР! +HP', '#facc15');
          pickups.splice(i, 1);
          continue;
        }

        if (p.y > canvas.height + 20) {
          pickups.splice(i, 1);
        }
      }

      updateHUD();
    }

    // --- ОТРИСОВКА ИГРОВЫХ ОБЪЕКТОВ ---
    // Дроп сахара
    pickups.forEach(p => {
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillRect(p.x, p.y, 14, 14);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(p.x, p.y, 14, 14);
      ctx.shadowBlur = 0;
    });

    // Пули игрока
    bullets.forEach(b => {
      if (b.isShield) {
        // Щит Капитана
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(b.x + 10, b.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Лазеры Железного Муравья
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.shadowBlur = 0;
      }
    });

    // Пули врагов
    enemyBullets.forEach(eb => {
      ctx.fillStyle = eb.color;
      ctx.shadowColor = eb.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(eb.x, eb.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Враги
    enemies.forEach(e => {
      ctx.fillStyle = e.type === 'wasp' ? '#eab308' : '#334155';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.fillRect(e.x, e.y, e.width, e.height);
      ctx.strokeRect(e.x, e.y, e.width, e.height);
      // Зеленые глаза тли
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(e.x + 6, e.y + 10, 6, 6);
      ctx.fillRect(e.x + e.width - 12, e.y + 10, 6, 6);
    });

    // Босс Доктор Дум
    if (boss) {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.strokeRect(boss.x, boss.y, boss.width, boss.height);
      // Маска
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(boss.x + 18, boss.y + 20, boss.width - 36, boss.height - 35);
      // Изумрудные глаза
      ctx.fillStyle = '#4ade80';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 10;
      ctx.fillRect(boss.x + 24, boss.y + 32, 10, 8);
      ctx.fillRect(boss.x + boss.width - 34, boss.y + 32, 10, 8);
      ctx.shadowBlur = 0;

      // Полоса здоровья Босса
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(boss.x - 10, boss.y - 18, boss.width + 20, 10);
      const bossHpPct = Math.max(0, boss.hp / boss.maxHp);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(boss.x - 10, boss.y - 18, (boss.width + 20) * bossHpPct, 10);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(boss.x - 10, boss.y - 18, boss.width + 20, 10);
    }

    // Игрок (Муравей-Мститель)
    ctx.save();
    ctx.translate(player.x, player.y);
    if (selectedHero === 'iron') {
      // Железный Муравей
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(6, 12, player.width - 12, player.height - 18);
      // Золотая маска
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(12, 0, player.width - 24, 16);
      // Голубой реактор
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fillRect(player.width / 2 - 4, 20, 8, 8);
      // Сопла
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(10, player.height - 6, 6, 8);
      ctx.fillRect(player.width - 16, player.height - 6, 6, 8);
    } else {
      // Капитан Муравей
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(6, 12, player.width - 12, player.height - 18);
      // Шлем с буквой А
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(12, 0, player.width - 24, 16);
      ctx.fillStyle = '#fff';
      ctx.font = '10px Impact';
      ctx.fillText('A', player.width / 2 - 3, 12);
      // Круглый щит в лапе
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(player.width - 4, 22, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(player.width - 4, 22, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Плавающий текст (БАХ, ХРУСЬ)
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 1.2;
      ft.life--;
      ctx.save();
      ctx.font = 'bold 16px Russo One, Impact';
      ctx.fillStyle = ft.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
      if (ft.life <= 0) floatingTexts.splice(i, 1);
    }

    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);


  // ------------------------------------------------------------------------
  // 6. СКАНИРОВАНИЕ УГРОЗЫ ДУМА (КАЛЬКУЛЯТОР)
  // ------------------------------------------------------------------------
  const calcLocation = document.getElementById('calc-location');
  const calcSugarRange = document.getElementById('calc-sugar-range');
  const sugarAmountLbl = document.getElementById('sugar-amount-lbl');
  const checkShoes = document.getElementById('check-shoes');
  const checkAphids = document.getElementById('check-aphids');
  const checkRadio = document.getElementById('check-radio');
  const btnCalcThreat = document.getElementById('btn-calc-threat');
  const threatGaugeMeter = document.getElementById('gauge-meter-fill');
  const gaugePercentTxt = document.getElementById('gauge-percent-txt');
  const threatBadge = document.getElementById('threat-level-badge');
  const threatTitle = document.getElementById('threat-title');
  const threatDesc = document.getElementById('threat-desc');
  const threatAdvice = document.getElementById('threat-advice');
  const btnShareReport = document.getElementById('btn-share-report');

  calcSugarRange.addEventListener('input', () => {
    sugarAmountLbl.textContent = `${calcSugarRange.value} грамм`;
  });

  function calculateThreat() {
    initAudio();
    SoundFX.laser();

    const baseVal = parseInt(calcLocation.value, 10);
    const sugarVal = parseInt(calcSugarRange.value, 10) * 0.22;
    let modifiers = 0;
    if (checkShoes.checked) modifiers -= 15;
    if (checkAphids.checked) modifiers += 25;
    if (checkRadio.checked) modifiers += 20;

    let total = Math.min(99, Math.max(5, Math.round(baseVal + sugarVal + modifiers)));

    // Анимация стрелки (длина окружности r=42 -> 2 * PI * 42 ≈ 264)
    const maxDash = 264;
    const offset = maxDash - (maxDash * (total / 100));
    threatGaugeMeter.style.strokeDashoffset = offset;
    gaugePercentTxt.textContent = `${total}%`;

    if (total > 75) {
      threatGaugeMeter.style.stroke = '#ef4444';
      threatBadge.textContent = 'КРАСНАЯ ТРЕВОГА: КОД ДУМ';
      threatBadge.style.background = '#dc2626';
      threatTitle.textContent = 'НЕИЗБЕЖНОЕ ВТОРЖЕНИЕ ЛАТВЕРИИ!';
      threatDesc.textContent = `Концентрация сахара (${calcSugarRange.value}г) превысила критический порог. Владыка Дум лично возглавит колонну штурмовых тлей!`;
      threatAdvice.innerHTML = '<strong>РЕКОМЕНДАЦИЯ ШТАБА:</strong> Эвакуировать весь сахар, посыпать плинтус корицей и немедленно вызывать Муравьиного Халка!';
    } else if (total > 45) {
      threatGaugeMeter.style.stroke = '#f59e0b';
      threatBadge.textContent = 'ЖЕЛТЫЙ УРОВЕНЬ ОПАСНОСТИ';
      threatBadge.style.background = '#d97706';
      threatTitle.textContent = 'ВЫСОКАЯ АКТИВНОСТЬ РАЗВЕДКИ ДУМА';
      threatDesc.textContent = 'В секторе зафиксированы подозрительные вибрации. Тли-разведчики проверяют периметр.';
      threatAdvice.innerHTML = '<strong>РЕКОМЕНДАЦИЯ ШТАБА:</strong> Выставить дозор Соколиного Уса на ветку яблони и плотнее закрывать банку с медом.';
    } else {
      threatGaugeMeter.style.stroke = '#22c55e';
      threatBadge.textContent = 'ЗЕЛЕНАЯ ЗОНА: СПОКОЙНО';
      threatBadge.style.background = '#16a34a';
      threatTitle.textContent = 'УГРОЗА МИНИМАЛЬНА';
      threatDesc.textContent = 'Латверийские сканеры обошли ваш участок стороной. Рабочие муравьи спокойно несут сосновые иголки.';
      threatAdvice.innerHTML = '<strong>РЕКОМЕНДАЦИЯ ШТАБА:</strong> Поддерживать боеготовность, угостить рабочих муравьев каплей сладкого чая.';
    }
  }

  btnCalcThreat.addEventListener('click', calculateThreat);

  btnShareReport.addEventListener('click', () => {
    initAudio();
    SoundFX.shield();
    const report = `📋 [СЕКРЕТНЫЙ ОТЧЕТ РАЗВЕДКИ МУРАВСТЕЙ]\nУровень угрозы вторжения Доктора Дума: ${gaugePercentTxt.textContent}\nСтатус: ${threatTitle.textContent}\n${threatDesc.textContent}\nВселенная Земля-616-Миллиметров.`;
    navigator.clipboard.writeText(report).then(() => {
      showToast('Отчет разведки скопирован в буфер обмена!', '📋');
    }).catch(() => {
      showToast('Не удалось скопировать отчет автоматически.', '⚠️');
    });
  });


  // ------------------------------------------------------------------------
  // 7. КНОПКИ ПРИСЯГИ И ИСТЕР-ЭГГИ
  // ------------------------------------------------------------------------
  document.getElementById('btn-join-avengers').addEventListener('click', () => {
    initAudio();
    SoundFX.playAnthem();
    showToast('Поздравляем! Вам выдана каска и закреплен туннель №7!', '🎖️');
  });

  document.getElementById('btn-join-doom').addEventListener('click', () => {
    initAudio();
    SoundFX.doomLaugh();
    showToast('Вы зачислены в экипаж Дум-бота. Слава Доктору Думу!', '👑');
  });

  // Мобильное меню
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Тайный пароль
  document.getElementById('btn-secret-code').addEventListener('click', () => {
    initAudio();
    const code = prompt('Введите секретный пароль штаба Мстителей (подсказка: САХАР-616):');
    if (code && code.toUpperCase() === 'САХАР-616') {
      SoundFX.sugarChime();
      alert('🍬 ДОСТУП РАЗРЕШЕН! Секретный резерв сахара пополнен на 10 000 кристаллов! Мстители приветствуют тебя, герой!');
    } else {
      SoundFX.doomLaugh();
      alert('❌ ОШИБКА АВТОРИЗАЦИИ! Доктор Дум перехватил ваш сигнал!');
    }
  });

  // Первоначальный расчет угрозы при загрузке
  calculateThreat();
});
