const express = require('express');
const { body, validationResult } = require('express-validator');
const { criarTransportador, emailConfigurado } = require('../../config/email');

const router = express.Router();

function renderContato(res, { dados = {}, mensagemStatus = '', tipoStatus = 'sucesso', erros = [] } = {}, status = 200) {
  return res.status(status).render('pages/contato', {
    mensagemStatus,
    tipoStatus,
    erros,
    dados: {
      nome: dados.nome || '',
      email: dados.email || '',
      telefone: dados.telefone || '',
      assunto: dados.assunto || '',
      mensagem: dados.mensagem || ''
    }
  });
}

router.get('/', (req, res) => renderContato(res));

router.post(
  '/contato',
  [
    body('nome').trim().isLength({ min: 2, max: 100 }).withMessage('Informe seu nome (de 2 a 100 caracteres).'),
    body('email').trim().isEmail().withMessage('Informe um endereço de e-mail válido.').normalizeEmail(),
    body('telefone').optional({ values: 'falsy' }).trim().isLength({ max: 30 }).withMessage('O telefone deve ter até 30 caracteres.'),
    body('assunto').trim().isLength({ min: 2, max: 150 }).withMessage('Informe um assunto (de 2 a 150 caracteres).'),
    body('mensagem').trim().isLength({ min: 5, max: 5000 }).withMessage('A mensagem deve ter entre 5 e 5.000 caracteres.')
  ],
  async (req, res) => {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return renderContato(res, {
        dados: req.body,
        mensagemStatus: 'Confira os campos indicados e tente novamente.',
        tipoStatus: 'erro',
        erros: resultado.array()
      }, 400);
    }

    if (!emailConfigurado()) {
      console.error('Envio de e-mail indisponível: faltam variáveis SMTP no arquivo .env.');
      return renderContato(res, {
        dados: req.body,
        mensagemStatus: 'O formulário está aberto, mas o e-mail ainda não foi configurado. Confira o arquivo .env.',
        tipoStatus: 'erro'
      }, 503);
    }

    const { nome, email, telefone, assunto, mensagem } = req.body;
    const transportador = criarTransportador();

    try {
      await transportador.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: { name: nome, address: email },
        subject: `Contato pelo site: ${assunto}`,
        text: [
          'Nova mensagem enviada pelo formulário do site',
          '',
          `Nome: ${nome}`,
          `E-mail: ${email}`,
          `Telefone: ${telefone || 'Não informado'}`,
          `Assunto: ${assunto}`,
          '',
          'Mensagem:',
          mensagem
        ].join('\n')
      });

      return renderContato(res, {
        mensagemStatus: 'Mensagem enviada com sucesso! Obrigado pelo contato.',
        tipoStatus: 'sucesso'
      });
    } catch (erro) {
      // Registra detalhes técnicos apenas no terminal, nunca na página do visitante.
      console.error('Falha no envio SMTP:', erro.code || '', erro.message);
      return renderContato(res, {
        dados: req.body,
        mensagemStatus: 'Não foi possível enviar agora. Confira as configurações de e-mail ou tente novamente mais tarde.',
        tipoStatus: 'erro'
      }, 502);
    }
  }
);

module.exports = router;
