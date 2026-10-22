// Pequena proteção contra cliques repetidos no botão de envio.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const button = form && form.querySelector('button[type="submit"]');

  if (!form || !button) return;

  form.addEventListener('submit', () => {
    if (form.checkValidity()) {
      button.disabled = true;
      button.textContent = 'Enviando...';
    }
  });
});
