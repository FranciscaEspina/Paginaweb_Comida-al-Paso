document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navBar = document.querySelector('.nav-bar');

  if (toggle && navBar) {
    toggle.addEventListener('click', () => {
      const isOpen = navBar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
});
