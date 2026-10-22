const nodemailer = require('nodemailer');

function valorPreenchido(valor) {
  if (!valor) return false;

  const texto = String(valor).trim();
  const exemplos = [
    'seuemail@gmail.com',
    'destino@gmail.com',
    'sua_senha_de_app',
    'COLOQUE_SUA_SENHA_DE_APLICATIVO'
  ];

  return texto.length > 0 && !exemplos.includes(texto);
}

function emailConfigurado() {
  return Boolean(
    process.env.SMTP_HOST &&
    valorPreenchido(process.env.SMTP_USER) &&
    valorPreenchido(process.env.SMTP_PASS) &&
    valorPreenchido(process.env.CONTACT_EMAIL)
  );
}

function criarTransportador() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === 'true'
    : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      // Remove espaços que às vezes aparecem ao copiar a senha de app do Google.
      pass: (process.env.SMTP_PASS || '').replace(/\s/g, '')
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
  });
}

module.exports = { criarTransportador, emailConfigurado };
