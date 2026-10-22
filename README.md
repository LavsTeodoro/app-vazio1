# Formulário de contato — projeto completo

Projeto organizado em pastas, usando Node.js, Express, EJS, Nodemailer e dotenv.

## Estrutura

```text
contato_site_completo/
├── app.js
├── package.json
├── .env.example
├── .gitignore
├── config/
│   └── email.js
└── app/
    ├── routes/
    │   └── router.js
    ├── views/
    │   └── pages/
    │       └── contato.ejs
    └── public/
        ├── css/
        │   └── style.css
        ├── js/
        │   └── form.js
        └── imagem/
```

## Requisitos

Instale uma versão atual do Node.js. É necessário ter internet para baixar os pacotes e configurar uma conta de e-mail para o envio real.

## Instalação

Abra o terminal dentro da pasta do projeto e execute:

```bash
npm install
```

## Configuração do e-mail

1. Copie `.env.example` e renomeie a cópia para `.env`.
2. Edite o `.env` com seus dados reais.
3. `SMTP_USER` é a conta que fará o envio; `CONTACT_EMAIL` é a conta que receberá as mensagens.
4. Nunca compartilhe o arquivo `.env` nem coloque a senha em código público.

### Gmail

Use `smtp.gmail.com`, porta `587` e `SMTP_SECURE=false`. Para `SMTP_PASS`, normalmente é necessário criar uma **senha de app** na Conta Google, com a verificação em duas etapas ativada. A senha normal da conta não costuma funcionar para SMTP. Se usar outro provedor, consulte as configurações SMTP oficiais dele.

## Executar

```bash
npm start
```

Acesse http://localhost:3000

Para desenvolvimento com reinício automático:

```bash
npm run dev
```

## Como testar o envio

1. Configure corretamente todas as variáveis do `.env`.
2. Inicie o servidor com `npm start`.
3. Envie uma mensagem de teste pelo formulário.
4. Confira a caixa de entrada e a pasta de spam do `CONTACT_EMAIL`.
5. Se falhar, leia o erro SMTP mostrado no terminal e confira host, porta, autenticação, senha de app e permissões do provedor.

## Importante sobre a verificação

O código aguarda a confirmação do Nodemailer (`sendMail`) antes de mostrar sucesso. Isso confirma que o servidor SMTP aceitou a mensagem para envio, mas não garante que ela chegou à caixa de entrada. O recebimento real precisa ser confirmado na conta destinatária. Sem suas credenciais SMTP válidas, não é possível testar o envio real daqui.

## Dependências

- `express`: servidor web e rotas.
- `ejs`: página HTML dinâmica.
- `express-validator`: validação dos campos.
- `nodemailer`: envio de e-mail por SMTP.
- `dotenv`: carrega as variáveis do arquivo `.env`.
