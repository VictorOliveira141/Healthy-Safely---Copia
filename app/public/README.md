# Healthy Safely - Página de Tarefas Diárias

## 📋 Descrição

Esta é uma página de tarefas diárias para a plataforma Healthy Safely. É uma aplicação web completa, desenvolvida com HTML, CSS e JavaScript puro (sem frameworks), que gerencia as atividades físicas dos usuários conforme seu nível de experiência.

## 🎯 Funcionalidades

### ✅ Implementadas
- **Autenticação de Nível**: Sistema que diferencia 3 níveis de usuário (iniciante, intermediário, avançado)
- **Geração Dinâmica de Tarefas**: As tarefas são criadas automaticamente via JavaScript baseado no nível
- **Cards Responsivos**: Interface com cards de tarefas em grid responsivo
- **Modal Interativo**: Detalhes completos das tarefas em modal elegante
- **Barra de Progresso**: Sistema visual de progresso das tarefas (0% → 50% → 100%)
- **Menu Hambúrguer**: Navegação lateral para mobile
- **Busca de Tarefas**: Campo de busca funcional para filtrar tarefas
- **Persistência de Dados**: Armazenamento em LocalStorage (sem banco de dados)
- **Reset Diário**: Progresso é resetado automaticamente a cada novo dia
- **Design Verde Escuro**: Tema visual moderno e profissional
- **Responsividade**: Mobile-first, funciona em todos os tamanhos de tela
- **Animações**: Transições e animações suaves em toda a interface

## 📁 Estrutura de Arquivos

```
/app/public/
├── index.html              # Estrutura HTML da página
├── css/
│   └── style.css          # Estilos CSS (responsivo e animações)
└── js/
    └── script.js          # Lógica JavaScript (simulação, interatividade)
```

## 🚀 Como Usar

### 1. Abrir a Página
Abra o arquivo `index.html` em um navegador web:
```bash
cd /app/public
# Abrir em um servidor local (recomendado)
python -m http.server 8000
# Depois acesse: http://localhost:8000
```

### 2. Selecionar o Nível do Usuário
Na seção "Seu Nível", use o dropdown para escolher:
- **Iniciante**: 3 tarefas básicas
- **Intermediário**: 3 tarefas moderadas
- **Avançado**: 3 tarefas intensas

### 3. Visualizar Tarefas
- As tarefas aparecem em cards na grid principal
- Cada card mostra: ícone, nome, descrição e progresso
- Clique em qualquer card ou no botão "Iniciar" para abrir os detalhes

### 4. Completar Tarefas
1. Clique em "Iniciar" em um card
2. Leia a descrição detalhada no modal
3. Clique em "Marcar como Concluída" (progresso vai 0% → 50% → 100%)
4. O card será marcado como concluído quando atingir 100%

### 5. Funcionalidades Adicionais
- **Buscar**: Use o campo de busca para filtrar tarefas pelo nome
- **Menu**: Clique no ícone hambúrguer para abrir o menu lateral
- **Perfil**: Clique no ícone de perfil para ver seu nível atual

## 📊 Tarefas por Nível

### 🟢 Iniciante
1. Caminhada 20 minutos
2. Beber 2L de água
3. Alongamento leve

### 🟡 Intermediário
1. Corrida 30 minutos
2. Treino funcional
3. Alongamento + mobilidade

### 🔴 Avançado
1. HIIT 25 minutos
2. Treino de força
3. Alongamento intenso

## 💾 Persistência de Dados

### LocalStorage
Os dados são salvos automaticamente em `localStorage` com a chave `healthySafelyUserData`:

```javascript
{
    "nivel": "iniciante",
    "tarefas": [...],
    "dataUltimaAtualizacao": "2024-01-15T10:30:00.000Z"
}
```

### Reset Diário
- O progresso é resetado automaticamente quando muda o dia
- Você pode forçar um reset usando `resetarProgressoDiario()` no console

## 🎨 Customização

### Cores
Edite as variáveis CSS em `style.css`:
```css
:root {
    --primary-dark: #1a4d3e;
    --accent-green: #5ed6c2;
    /* ... outras cores */
}
```

### Tarefas
Adicione novas tarefas em `script.js` no objeto `baseTarefas`:
```javascript
{
    id: 10,
    nome: 'Nova Tarefa',
    descricao: 'Descrição curta',
    descricaoDetalhada: 'Descrição completa...',
    duracao: '20 minutos',
    icone: '🎯',
    dificuldade: 'Médio',
    progresso: 0
}
```

### Fonte
Estamos usando a fonte **Poppins** do Google Fonts. Para mudar:
1. Edite o `<link>` no `index.html`
2. Altere a variável `font-family` em `style.css`

## 🔧 Funções JavaScript Úteis

### Console Commands
```javascript
// Imprimir relatório diário
imprimirRelatorioDiario()

// Calcular progresso total
calcularProgressoTotal()

// Limpar dados salvos
limparDadosSalvos()

// Exportar dados
exportarDados()

// Alterar nível manualmente
alternarNivel('intermediario')
```

## 📱 Responsividade

- **Mobile** (< 480px): 1 coluna, layout otimizado para toque
- **Tablet** (768px - 1023px): 2 colunas
- **Desktop** (≥ 1024px): 3 colunas

## ♿ Acessibilidade

- ✅ Atributos ARIA em botões e elementos interativos
- ✅ Suporte a preferências de movimento reduzido (`prefers-reduced-motion`)
- ✅ Contraste adequado de cores
- ✅ Navegação por teclado
- ✅ Labels em inputs

## 🔌 Integração com Backend

Esta página foi desenvolvida como frontend puro e pode ser integrada facilmente com um backend:

### Alterações Necessárias:

1. **Substituir Dados Simulados**:
   ```javascript
   // Em vez de baseTarefas local, fazer:
   fetch('/api/tarefas/' + nivelUsuario)
       .then(res => res.json())
       .then(tarefas => { ... })
   ```

2. **Salvar no Servidor**:
   ```javascript
   // Em salvarDados():
   fetch('/api/usuario/tarefas', {
       method: 'PUT',
       body: JSON.stringify(dadosAtualizados)
   })
   ```

3. **Autenticação**:
   - Adicionar verificação de token JWT
   - Carregar dados do usuário logado

## 🐛 Troubleshooting

### Tarefas Não Aparecem
- Verifique se `script.js` foi carregado (abra DevTools)
- Confirme que o arquivo está na pasta correta

### Modal Não Abre
- Verifique se há erros no console (F12)
- Certifique-se que o JavaScript está habilitado

### Dados Não Salvam
- Verifique se `localStorage` está habilitado
- Tente limpar cookies do navegador

### Estilo Não Aplica
- Verifique se `style.css` está na pasta `/css/`
- Force um refresh (Ctrl+F5)
- Verifique erros de CORS se em servidor remoto

## 📈 Próximas Melhorias Sugeridas

- [ ] Gráficos de progresso semanal/mensal
- [ ] Sistema de metas semanais
- [ ] Badges e achievements
- [ ] Integração com wearables
- [ ] Playlists de música para treinos
- [ ] Notificações de tarefas
- [ ] Exportar em PDF
- [ ] Dark mode toggle
- [ ] Multiple languages
- [ ] Modo offline

## 📜 Licença

Este código é parte do projeto Healthy Safely.

## 👤 Desenvolvedor

Desenvolvido como página de usuário para o sistema Healthy Safely.

---

**Última Atualização**: Junho 2024
