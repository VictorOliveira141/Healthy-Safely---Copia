# 🌿 Healthy Safely

Sistema de Monitoramento e Progressão de Hábitos saudáveis — MVC + Node.js + MySQL.

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js >= 18.0.0
- MySQL >= 8.0

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas credenciais do banco
```

### 3. Criar o banco de dados
```bash
mysql -u root -p < config/script_bd.sql
```

### 4. Rodar o servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Estrutura do projeto

```
Healthy-Safely/
├── app.js                    # Ponto de entrada
├── .env.example              # Variáveis de ambiente (modelo)
├── config/
│   └── script_bd.sql         # Script do banco de dados
├── app/
│   ├── config/
│   │   ├── database/
│   │   │   └── schema.sql
│   │   └── pool_conexoes.js
│   ├── controllers/
│   │   ├── tarefaController.js
│   │   ├── usuarioController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── Tarefa.js
│   │   ├── Usuario.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── principalRoutes.js
│   │   ├── profissionalRoutes.js
│   │   └── admRoutes.js
│   ├── views/
│   │   ├── pages/
│   │   ├── partials/
│   │   └── user/
│   └── public/
│       ├── css/
│       └── js/
└── package.json
```

## 👤 Usuários

| Tipo         | Acesso                                                       |
|--------------|--------------------------------------------------------------|
| Cliente      | Dashboard, tarefas, histórico, sono, notificações, perfil    |
| Profissional | Painel, pacientes, feedback, gestão de vínculos              |
| Admin        | `/admin` — gestão de usuários e solicitações                 |

## 🛠️ Tecnologias

- **Back-end:** Node.js, Express.js
- **Views:** EJS
- **Banco:** MySQL com mysql2
- **Validação:** express-validator
- **Senhas:** bcryptjs
- **Sessão:** express-session
