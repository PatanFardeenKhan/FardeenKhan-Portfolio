document.addEventListener('DOMContentLoaded', () => {

  // ===== REVEAL ANIMATION =====

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // ===== PARTICLE BACKGROUND =====

  const canvas = document.getElementById('bg-canvas');

  if (canvas) {

    const ctx = canvas.getContext('2d');

    let W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();

    window.addEventListener('resize', resize);

    class Particle {

      constructor() {
        this.reset();
      }

      reset() {

        this.x = Math.random() * W;
        this.y = Math.random() * H;

        this.r = Math.random() * 1.5;

        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;

        this.a = Math.random() * 0.5;
      }

      update() {

        this.x += this.vx;
        this.y += this.vy;

        if (
          this.x < 0 ||
          this.x > W ||
          this.y < 0 ||
          this.y > H
        ) {
          this.reset();
        }
      }

      draw() {

        ctx.beginPath();

        ctx.arc(
          this.x,
          this.y,
          this.r,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(0,200,255,${this.a})`;

        ctx.fill();
      }
    }

    const particles = Array.from(
      { length: 120 },
      () => new Particle()
    );

    function animate() {

      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ===== CONTACT FORM =====

  const form = document.getElementById('contact-form');

  const feedback = document.getElementById('form-feedback');

  if (form) {

    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      const name = document
        .getElementById('name')
        .value
        .trim();

      const email = document
        .getElementById('email')
        .value
        .trim();

      const message = document
        .getElementById('message')
        .value
        .trim();

      if (!name || !email || !message) {

        feedback.innerHTML =
          'Please fill all fields';

        feedback.style.color = '#ff6b6b';

        return;
      }

      const button = form.querySelector('button');

      button.disabled = true;

      button.innerHTML = 'Sending...';

      try {

        const response = await fetch(
          'https://formspree.io/f/xeendlna',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },

            body: JSON.stringify({
              name,
              email,
              message
            })
          }
        );

        if (response.ok) {

          feedback.innerHTML =
            'Message sent successfully!';

          feedback.style.color = '#00c8ff';

          form.reset();

        } else {

          feedback.innerHTML =
            'Failed to send message';

          feedback.style.color = '#ff6b6b';
        }

      } catch (error) {

        feedback.innerHTML =
          'Network error';

        feedback.style.color = '#ff6b6b';
      }

      button.disabled = false;

      button.innerHTML = 'Send Message';

    });

  }

});
