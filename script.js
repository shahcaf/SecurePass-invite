// Initialize Lucide Icons
lucide.createIcons();

// Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const nav = document.querySelector('nav');

// Intersection Observer for Reveal Animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = nav.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        // Close mobile menu
        navLinks.classList.remove('active');
        if (menuToggle) {
          const icon = menuToggle.querySelector('i');
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Mobile Menu Toggle
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
  });
}

// Navbar State on Scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.padding = '0.8rem 5%';
    nav.style.background = 'rgba(10, 11, 16, 0.95)';
    nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
  } else {
    nav.style.padding = '1.2rem 5%';
    nav.style.background = 'rgba(10, 11, 16, 0.85)';
    nav.style.boxShadow = 'none';
  }
});
