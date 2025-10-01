
(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    /* Rolagem #inicio -> topo */

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const hash = a.getAttribute('href');
        if (hash === '#inicio') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    /* Tema (dark/light) c/ storage */

    const btnTema = document.getElementById('btnTema');
    const THEME_KEY = 'ml-portfolio-theme';
    const setTheme = (t) => {
      root.setAttribute('data-theme', t);
      if (btnTema) {
        btnTema.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
        btnTema.textContent = t === 'dark' ? '🌙' : '☀️';
      }
    };
    setTheme(localStorage.getItem(THEME_KEY) || 'dark');
    btnTema?.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });

 

    /* =========================
       Filtros dos projetos
    ========================== */
    const chips = document.querySelectorAll('.filters .chip');
    const cards = document.querySelectorAll('.grid .card');

    const setFilter = (filter) => {
      chips.forEach(c => c.classList.toggle(
        'active',
        c.dataset.filter === filter || (filter === 'all' && c.dataset.filter === 'all')
      ));

      cards.forEach(card => {
        const type = card.getAttribute('data-type') || '';
        const show = (filter === 'all') || type === filter;

        // mostra/oculta
        card.style.display = show ? '' : 'none';

        // micro-ani para aparecer suave
        if (show) {
          card.style.transform = 'scale(0.98)';
          card.style.opacity = '0';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .25s ease, transform .25s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        }
      });
    };

    chips.forEach(chip => chip.addEventListener('click', () => setFilter(chip.dataset.filter)));
    document.querySelector('.filters .chip.active') &&
      setFilter(document.querySelector('.filters .chip.active').dataset.filter);

    /* =========================
       Formulário de contato
    ========================== */
    window.handleSubmit = function handleSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const btn = form.querySelector('button[type="submit"]');
      const msg = form.querySelector('#formMsg');

      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();

      // validação simples
      if (!name || !email || !message) {
        if (msg) { msg.textContent = 'Por favor, preencha todos os campos.'; msg.style.color = '#ffb4b4'; }
        return false;
      }

      // “envio” fake + feedback
      btn?.setAttribute('disabled', 'true');
      btn?.classList.add('is-loading');

      setTimeout(() => {
        if (msg) { msg.textContent = 'Mensagem enviada! Obrigada pelo contato 💜'; msg.style.color = '#c9cbe1'; }
        form.reset();
        btn?.removeAttribute('disabled');
        btn?.classList.remove('is-loading');
      }, 800);

      return false;
    };
  });
})();
