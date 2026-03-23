// ==================== ПЛАВНАЯ ПРОКРУТКА ====================
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ (СЛОЖНАЯ) ====================
const animatedElements = document.querySelectorAll('.term-card, .player-card, .record-block, .about-text, .mode-badges');

// Добавляем случайные задержки для каждой карточки
animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)`;
    el.style.transitionDelay = `${index * 0.03}s`; // каскадная задержка
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Добавляем небольшую "вибрацию" при появлении
            entry.target.style.animation = 'subtlePop 0.4s ease-out';
            setTimeout(() => {
                if (entry.target) entry.target.style.animation = '';
            }, 400);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

animatedElements.forEach(el => observer.observe(el));

// Анимация для хедера при скролле (изменение прозрачности и тени)
const header = document.querySelector('.header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        header.style.background = 'rgba(15, 12, 30, 0.85)';
        header.style.backdropFilter = 'blur(16px)';
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
        header.style.background = 'rgba(15, 12, 30, 0.6)';
        header.style.backdropFilter = 'blur(12px)';
        header.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
});

// ==================== ПАРАЛЛАКС-ЭФФЕКТ ДЛЯ ФОНА ====================
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) / 80;
    const moveY = (e.clientY - window.innerHeight / 2) / 80;
    const bgCircles = document.querySelector('.bg-circles');
    if (bgCircles) {
        bgCircles.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// ==================== АНИМАЦИЯ ЦИФР (PP рекордов) ====================
function animateNumbers() {
    const ppNumbers = document.querySelectorAll('.player-stats');
    ppNumbers.forEach(el => {
        const text = el.innerText;
        const match = text.match(/(\d{2,6}\s?PP)/i);
        if (match) {
            const originalText = text;
            const ppValue = parseInt(match[1].replace(/\s/g, ''));
            if (!isNaN(ppValue)) {
                let current = 0;
                const increment = ppValue / 60;
                const updateNumber = () => {
                    current += increment;
                    if (current < ppValue) {
                        const newText = text.replace(/\d{2,6}\s?PP/i, Math.floor(current) + ' PP');
                        el.innerText = newText;
                        requestAnimationFrame(updateNumber);
                    } else {
                        el.innerText = originalText;
                    }
                };
                // Запускаем анимацию, когда элемент в зоне видимости
                const numberObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateNumber();
                            numberObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                numberObserver.observe(el);
            }
        }
    });
}

// Запускаем анимацию чисел после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    animateNumbers();
});

// ==================== ДИНАМИЧЕСКОЕ СВЕЧЕНИЕ КАРТОЧЕК ПРИ НАВЕДЕНИИ (СЛОЖНЫЙ ЭФФЕКТ) ====================
const cards = document.querySelectorAll('.term-card, .player-card, .record-block');
cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        // Создаём временный элемент для свечения
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        glow.style.position = 'absolute';
        glow.style.top = '0';
        glow.style.left = '0';
        glow.style.width = '100%';
        glow.style.height = '100%';
        glow.style.borderRadius = 'inherit';
        glow.style.pointerEvents = 'none';
        glow.style.background = 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 180, 70, 0.4), transparent 70%)';
        glow.style.opacity = '0';
        glow.style.transition = 'opacity 0.2s';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(glow);
        
        const updateGlow = (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            glow.style.setProperty('--x', `${x}%`);
            glow.style.setProperty('--y', `${y}%`);
            glow.style.opacity = '1';
        };
        
        card.addEventListener('mousemove', updateGlow);
        card.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
            setTimeout(() => {
                if (glow.parentNode) glow.remove();
            }, 200);
            card.removeEventListener('mousemove', updateGlow);
        });
    });
});

// ==================== АНИМАЦИЯ ДЛЯ СЕКЦИЙ (ПОЯВЛЕНИЕ С ЭФФЕКТОМ СМЕЩЕНИЯ) ====================
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'sectionFadeInUp 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards';
            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'none';
    sectionObserver.observe(section);
});

// Добавляем ключевые кадры в CSS динамически (чтобы не загромождать style.css)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes subtlePop {
        0% { transform: scale(0.98); opacity: 0.5; }
        80% { transform: scale(1.02); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes sectionFadeInUp {
        0% { opacity: 0; transform: translateY(40px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    .card-glow {
        transition: opacity 0.2s;
    }
    .term-card, .player-card, .record-block {
        transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), box-shadow 0.3s;
    }
    .term-card:hover, .player-card:hover, .record-block:hover {
        transform: translateY(-6px) scale(1.01);
        transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    }
`;
document.head.appendChild(styleSheet);

// ==================== ЭФФЕКТ ПЕЧАТИ ДЛЯ ЗАГОЛОВКОВ (ДОПОЛНИТЕЛЬНО) ====================
// Можно добавить, но для производительности оставим опционально
console.log('🔥 osu! Гид: сложные анимации активированы');