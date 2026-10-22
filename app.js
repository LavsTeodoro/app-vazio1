require('dotenv').config();

const express = require('express');
const path = require('path');
const rotasContato = require('./app/routes/router');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Configurações do EJS e dos arquivos públicos.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views'));
app.use(express.static(path.join(__dirname, 'app', 'public')));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.json({ limit: '20kb' }));

app.use('/', rotasContato);

// Tratamento básico de rota inexistente.
app.use((req, res) => {
  res.status(404).send('Página não encontrada.');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor online: http://localhost:${PORT}`);
  });
}

module.exports = app;
