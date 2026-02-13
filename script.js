// ============================
// CONFIGURATION
// ============================
const CONFIG = {
    loveMessage: [
        "Em yêu, hôm nay là Valentine và cũng là dịp Xuân Bính Ngọ 2026,",
        "Anh muốn gửi đến em những lời yêu thương chân thành nhất.",
        "",
        "Từ ngày gặp em, cuộc sống của anh đã thay đổi hoàn toàn.",
        "Em là mùa xuân trong trái tim anh, là ánh nắng ấm áp mỗi sáng,",
        "là nụ cười ngọt ngào làm anh quên đi mọi mệt mỏi.",
        "",
        "Cảm ơn em vì đã đến bên anh, vì đã yêu thương và chấp nhận anh.",
        "Anh hứa sẽ luôn ở bên, chăm sóc và bảo vệ em trọn đời.",
        "",
        "Chúc em một mùa xuân tràn đầy hạnh phúc, một Valentine ngọt ngào,",
        "và một năm mới an khang, thịnh vượng bên anh nhé!",
        "",
        "Yêu em rất nhiều! ❤️💕"
    ],
    typingSpeed: 50, // ms per character
    particleCount: 30,
    confettiCount: 150
};

// ============================
// GLOBAL VARIABLES
// ============================
let currentSlide = 0;
let isTyping = false;
let audioPlaying = false;

// ============================
// DOM ELEMENTS
// ============================
const elements = {
    lovePopup: document.getElementById('lovePopup'),
    btnYes: document.getElementById('btnYes'),
    btnNo: document.getElementById('btnNo'),
    mainContent: document.getElementById('mainContent'),
    confettiCanvas: document.getElementById('confettiCanvas'),
    particlesContainer: document.getElementById('particlesContainer'),
    ctaButton: document.getElementById('ctaButton'),
    messageSection: document.getElementById('messageSection'),
    messageContent: document.getElementById('messageContent'),
    gallerySection: document.getElementById('gallerySection'),
    sliderTrack: document.getElementById('sliderTrack'),
    sliderPrev: document.getElementById('sliderPrev'),
    sliderNext: document.getElementById('sliderNext'),
    sliderDots: document.getElementById('sliderDots'),
    bigHeart: document.getElementById('bigHeart'),
    fireworksCanvas: document.getElementById('fireworksCanvas'),
    audioBtn: document.getElementById('audioBtn'),
    audioIcon: document.getElementById('audioIcon'),
    bgMusic: document.getElementById('bgMusic')
};

// ============================
// POPUP LOGIC
// ============================
function initPopup() {
    let noButtonClickCount = 0;
    
    // Nút "Có" - phóng to dần
    let yesScale = 1;
    const yesInterval = setInterval(() => {
        yesScale += 0.01;
        elements.btnYes.style.transform = `scale(${yesScale})`;
        if (yesScale >= 1.5) {
            yesScale = 1;
        }
    }, 100);
    
    // Xử lý nút "Có"
    elements.btnYes.addEventListener('click', () => {
        clearInterval(yesInterval);
        launchConfetti();
        setTimeout(() => {
            elements.lovePopup.classList.add('hidden');
            elements.mainContent.classList.add('visible');
            createParticles();
        }, 1000);
    });
    
    // Xử lý nút "Không" - né chuột
    elements.btnNo.addEventListener('mouseenter', (e) => {
        noButtonClickCount++;
        const maxX = window.innerWidth - elements.btnNo.offsetWidth - 20;
        const maxY = window.innerHeight - elements.btnNo.offsetHeight - 20;
        
        let newX = Math.random() * maxX;
        let newY = Math.random() * maxY;
        
        // Đảm bảo nút "Không" không đè lên nút "Có"
        const yesRect = elements.btnYes.getBoundingClientRect();
        while (
            newX < yesRect.right + 50 && 
            newX + elements.btnNo.offsetWidth > yesRect.left - 50 &&
            newY < yesRect.bottom + 50 && 
            newY + elements.btnNo.offsetHeight > yesRect.top - 50
        ) {
            newX = Math.random() * maxX;
            newY = Math.random() * maxY;
        }
        
        elements.btnNo.style.left = `${newX}px`;
        elements.btnNo.style.top = `${newY}px`;
        
        // Sau 5 lần né, tự động chọn "Có"
        if (noButtonClickCount >= 5) {
            elements.btnNo.style.display = 'none';
            elements.btnYes.click();
        }
    });
    
    // Click vào "Không" cũng né
    elements.btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        elements.btnNo.dispatchEvent(new Event('mouseenter'));
    });
}

// ============================
// CONFETTI
// ============================
function launchConfetti() {
    const canvas = elements.confettiCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#ff6b9d', '#c92a49', '#ffd700', '#ffb6c1', '#ff1493'];
    
    // Tạo confetti
    for (let i = 0; i < CONFIG.confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * CONFIG.confettiCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    let animationFrame;
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((c, i) => {
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
            ctx.stroke();
            
            c.tiltAngle += c.tiltAngleIncremental;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.x += Math.sin(c.d);
            c.tilt = Math.sin(c.tiltAngle) * 15;
            
            if (c.y > canvas.height) {
                confetti[i] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: c.tilt,
                    tiltAngleIncremental: c.tiltAngleIncremental,
                    tiltAngle: c.tiltAngle
                };
            }
        });
        
        animationFrame = requestAnimationFrame(drawConfetti);
    }
    
    drawConfetti();
    
    // Dừng sau 5 giây
    setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
}

// ============================
// PARTICLES (HOA & TIM)
// ============================
function createParticles() {
    const particles = ['🌸', '🌺', '🏮', '💖', '❤️', '💕', '✨'];
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.fontSize = `${Math.random() * 1 + 1}rem`;
        elements.particlesContainer.appendChild(particle);
    }
}

// ============================
// CTA BUTTON
// ============================
function initCTA() {
    elements.ctaButton.addEventListener('click', () => {
        elements.messageSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            startTypingEffect();
        }, 500);
    });
}

// ============================
// TYPING EFFECT
// ============================
function startTypingEffect() {
    if (isTyping) return;
    isTyping = true;
    
    elements.messageContent.innerHTML = '';
    let lineIndex = 0;
    let charIndex = 0;
    
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    
    function typeNextChar() {
        if (lineIndex >= CONFIG.loveMessage.length) {
            cursor.remove();
            isTyping = false;
            return;
        }
        
        const currentLine = CONFIG.loveMessage[lineIndex];
        
        if (charIndex < currentLine.length) {
            const p = elements.messageContent.querySelector('p:last-child') || document.createElement('p');
            if (!p.parentNode) {
                elements.messageContent.appendChild(p);
            }
            
            p.textContent = currentLine.substring(0, charIndex + 1);
            p.appendChild(cursor);
            charIndex++;
            setTimeout(typeNextChar, CONFIG.typingSpeed);
        } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeNextChar, 500);
        }
    }
    
    typeNextChar();
}

// ============================
// GALLERY SLIDER
// ============================
function initSlider() {
    const slides = elements.sliderTrack.querySelectorAll('.slider-item');
    const totalSlides = slides.length;
    
    // Tạo dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        elements.sliderDots.appendChild(dot);
    });
    
    function updateSlider() {
        const dots = elements.sliderDots.querySelectorAll('.dot');
        
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            dots[index].classList.remove('active');
        });
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        elements.sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    elements.sliderPrev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
    
    elements.sliderNext.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });
    
    // Auto slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000);
}

// ============================
// FIREWORKS
// ============================
function launchFireworks() {
    const canvas = elements.fireworksCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fireworks = [];
    const particles = [];
    
    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.5;
            this.speed = 5;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        }
        
        update() {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
                return false;
            }
            return true;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        explode() {
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(this.x, this.y, this.color));
            }
        }
    }
    
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.color = color;
            this.life = 100;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.1;
            this.life -= 2;
            return this.life > 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life / 100;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    let animationFrame;
    let frameCount = 0;
    
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (frameCount % 30 === 0 && fireworks.length < 5) {
            fireworks.push(new Firework());
        }
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            if (!fireworks[i].update()) {
                fireworks.splice(i, 1);
            } else {
                fireworks[i].draw();
            }
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }
        
        frameCount++;
        
        if (frameCount < 300) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

// ============================
// HEART CLICK
// ============================
function initHeartClick() {
    elements.bigHeart.addEventListener('click', () => {
        launchFireworks();
        elements.bigHeart.style.animation = 'none';
        setTimeout(() => {
            elements.bigHeart.style.animation = 'heartPulse 2s ease-in-out infinite';
        }, 100);
    });
}

// ============================
// AUDIO CONTROL
// ============================
function initAudio() {
    elements.audioBtn.addEventListener('click', () => {
        if (audioPlaying) {
            elements.bgMusic.pause();
            elements.audioIcon.textContent = '🔇';
            audioPlaying = false;
        } else {
            elements.bgMusic.play().catch(err => {
                console.log('Audio playback failed:', err);
            });
            elements.audioIcon.textContent = '🔊';
            audioPlaying = true;
        }
    });
    
    // Auto play (có thể bị chặn bởi browser)
    document.addEventListener('click', () => {
        if (!audioPlaying) {
            elements.bgMusic.play().catch(err => {
                console.log('Audio autoplay prevented');
            });
        }
    }, { once: true });
}

// ============================
// RESPONSIVE HANDLING
// ============================
function handleResize() {
    if (elements.confettiCanvas.width !== window.innerWidth) {
        elements.confettiCanvas.width = window.innerWidth;
        elements.confettiCanvas.height = window.innerHeight;
    }
    if (elements.fireworksCanvas.width !== window.innerWidth) {
        elements.fireworksCanvas.width = window.innerWidth;
        elements.fireworksCanvas.height = window.innerHeight;
    }
}

window.addEventListener('resize', handleResize);

// ============================
// FLOATING HEARTS IN HERO
// ============================
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💝'];
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'particle';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${Math.random() * 5 + 5}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
        heart.style.opacity = '0.6';
        container.appendChild(heart);
    }
}

// ============================
// INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', () => {
    initPopup();
    initCTA();
    initSlider();
    initHeartClick();
    initAudio();
    createFloatingHearts();
    
    // Preload
    handleResize();
    
    console.log('💝 Valentine & Xuân Bính Ngọ Website loaded successfully!');
});

// ============================
// SMOOTH SCROLL
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================
// PREVENT ERRORS
// ============================
window.addEventListener('error', (e) => {
    console.error('Error caught:', e.message);
});

// Performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        console.log('🚀 Performance optimized!');
    });
}
