
    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (navToggle) navToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    // --- EmailJS (re-using your existing IDs) ---
    window.addEventListener('DOMContentLoaded', () => {
      if (window.emailjs) {
        emailjs.init('UQjQ5SzV46YtkWIjS'); // user/public key
      }
    });

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    function validateEmail(email) {
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
    }

    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formStatus.textContent = '';

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        const inputs = [name, email, subject, message];
        let isValid = true;
        inputs.forEach((el) => {
          el.classList.remove('ring-red-400');
          if (!el.value.trim()) { el.classList.add('ring-red-400'); isValid = false; }
        });
        if (email.value && !validateEmail(email.value)) { email.classList.add('ring-red-400'); isValid = false; }
        if (!isValid) { formStatus.textContent = '❌ Please fill out all fields correctly.'; formStatus.className = 'mt-3 text-sm text-red-300'; return; }

        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.innerHTML; btn.innerHTML = 'Sending…'; btn.disabled = true;

        try {
          const templateParams = {
            user_name: name.value,
            user_email: email.value,
            user_message: message.value,
            name: name.value,
            email: email.value,
            subject: subject.value,
          };
          await emailjs.send('service_8m7gz22', 'template_5s8x9g5', templateParams);
          formStatus.textContent = '✅ Your message has been sent successfully!';
          formStatus.className = 'mt-3 text-sm text-green-300';
          contactForm.reset();
        } catch (err) {
          formStatus.textContent = '❌ Failed to send your message. Please try again.';
          formStatus.className = 'mt-3 text-sm text-red-300';
          console.error(err);
        } finally {
          btn.innerHTML = original; btn.disabled = false;
        }
      });
    }

    // --- Lenis smooth scroll ---
    let lenis;
    function raf(time) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    window.addEventListener('load', () => {
      lenis = new Lenis({
        smoothWheel: true,
        smoothTouch: false,
        lerp: 0.08,
      });
      requestAnimationFrame(raf);
    });

    // --- Active link highlighting (IntersectionObserver) ---
    const sections = document.querySelectorAll('section[id]');
    const navlinks = document.querySelectorAll('.navlink');
    const map = new Map();
    navlinks.forEach(a => map.set(a.getAttribute('href').replace('#',''), a));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const link = map.get(id);
        if (!link) return;
        if (entry.isIntersecting) {
          navlinks.forEach(l => l.dataset.active = 'false');
          link.dataset.active = 'true';
          link.classList.add('text-white');
        }
      })
    }, { threshold: 0.35 });

    sections.forEach(s => io.observe(s));

    // --- GSAP intro + scroll reveals ---
    window.addEventListener('load', () => {
      if (!window.gsap) return;
      gsap.registerPlugin(ScrollTrigger);

      // Intro
      gsap.from('header nav', { y: -30, opacity: 0, duration: 0.6, ease: 'power2.out' });
      gsap.from('#home h1, #home p, #home .flex, #home a.group', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.12,
        delay: 0.1,
      });

      // Cards + sections
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          }
        });
      });
    });


