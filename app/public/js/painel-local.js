// painel-local.js
// Lê `usuarioCadastro` do localStorage e renderiza painel conforme tipo/especialidade

document.addEventListener('DOMContentLoaded', () => {
  const perfilCard = document.getElementById('perfilCard');
  const statsCard = document.getElementById('statsCard');
  const tituloPainel = document.getElementById('tituloPainel');
  const listaTarefas = document.getElementById('listaTarefas');
  const searchTarefas = document.getElementById('searchTarefas');
  const statusFilter = document.getElementById('statusFilter');
  const emptyState = document.getElementById('emptyState');
  const modal = document.getElementById('modalTarefa');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalPrioridade = document.getElementById('modalPrioridade');
  const modalData = document.getElementById('modalData');
  const modalSalvar = document.getElementById('modalSalvar');
  const modalCancelar = document.getElementById('modalCancelar');
  const filtroEspecialidade = document.getElementById('filtroEspecialidade');
  const notasRapidas = document.getElementById('notasRapidas');
  const salvarNotas = document.getElementById('salvarNotas');
  const proximosCompromissos = document.getElementById('proximosCompromissos');
  const btnNovoTask = document.getElementById('btnNovoTask');

  function redirectToCadastro() {
    window.location.href = '/cadastroCliente';
  }

  function carregarUsuario() {
    const raw = localStorage.getItem('usuarioCadastro');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { localStorage.removeItem('usuarioCadastro'); return null; }
  }

  const usuario = carregarUsuario();
  if (!usuario) { redirectToCadastro(); return; }

  // Apenas profissionais usam este painel aprimorado
  if (usuario.tipo !== 'profissional') {
    // redireciona usuarios comuns para a página principal
    window.location.href = '/tomarammeutela';
    return;
  }

  // Dados iniciais por especialidade
  const tarefasPorEspecialidade = {
    'Nutrição': [
      { id: 1, titulo: 'Montar plano alimentar', concluida: false },
      { id: 2, titulo: 'Avaliar consumo diário', concluida: false },
      { id: 3, titulo: 'Ajustar suplementação', concluida: false }
    ],
    'Fisioterapia': [
      { id: 1, titulo: 'Avaliar mobilidade', concluida: false },
      { id: 2, titulo: 'Prescrever exercícios', concluida: false },
      { id: 3, titulo: 'Acompanhar evolução', concluida: false }
    ],
    'Educação Física': [
      { id: 1, titulo: 'Planejar treino semanal', concluida: false },
      { id: 2, titulo: 'Avaliar desempenho', concluida: false },
      { id: 3, titulo: 'Ajustar metas', concluida: false }
    ]
  };

  const tarefasKey = `tarefas_${usuario.email || usuario.nome}`;
  const notasKey = `notas_${usuario.email || usuario.nome}`;

  // Carrega tarefas do localStorage ou inicializa com as sugeridas
  function loadTarefas() {
    const raw = localStorage.getItem(tarefasKey);
    if (!raw) {
      const base = tarefasPorEspecialidade[usuario.especialidade] || [{ id: 1, titulo: 'Primeira tarefa', concluida: false }];
      localStorage.setItem(tarefasKey, JSON.stringify(base));
      return base;
    }
    try { return JSON.parse(raw); } catch (e) { localStorage.removeItem(tarefasKey); return loadTarefas(); }
  }

  function saveTarefas(tarefas) { localStorage.setItem(tarefasKey, JSON.stringify(tarefas)); }

  // Render perfil e ações
  function renderPerfil() {
    perfilCard.innerHTML = `
      <div class="perfil-img"><img src="/imagem/1x/logozeko.png" alt="profile"></div>
      <h2>${usuario.nome}</h2>
      <p class="especialidade">${usuario.especialidade || 'Especialidade não informada'}</p>
      <div class="perfil-acoes">
        <button id="btnEditarPerfil" class="btn-primary">Editar perfil</button>
        <button id="btnLogout" class="btn-secondary">Sair</button>
      </div>
    `;

    document.getElementById('btnLogout').addEventListener('click', () => {
      localStorage.removeItem('usuarioCadastro');
      window.location.href = '/tomarammeutela';
    });
  }

  // Render estatísticas simples
  function renderStats(tarefas) {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const pct = total ? Math.round((concluidas / total) * 100) : 0;
    statsCard.innerHTML = `
      <div class="stat-item"><strong>${total}</strong><span>Total de tarefas</span></div>
      <div class="stat-item"><strong>${concluidas}</strong><span>Concluídas</span></div>
      <div class="stat-item"><strong>${pct}%</strong><span>Progresso</span></div>
    `;
  }

  // Render lista de tarefas
  function renderLista(sourceTarefas) {
    const filtroStatus = statusFilter ? statusFilter.value : 'all';
    const termo = searchTarefas ? searchTarefas.value.trim().toLowerCase() : '';
    const filtradas = sourceTarefas.filter(t => {
      if (filtroStatus === 'pending' && t.concluida) return false;
      if (filtroStatus === 'done' && !t.concluida) return false;
      if (termo && !t.titulo.toLowerCase().includes(termo)) return false;
      return true;
    });

    if (filtradas.length === 0) {
      listaTarefas.innerHTML = '';
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      listaTarefas.innerHTML = filtradas.map(t => `
        <li class="tarefa-item ${t.concluida ? 'concluida' : ''}" data-id="${t.id}">
          <div class="tarefa-left"><input type="checkbox" class="chk" ${t.concluida ? 'checked' : ''}/> <span class="titulo">${t.titulo}</span></div>
          <div class="tarefa-right">
            <small class="priority ${t.prioridade||'medium'}">${(t.prioridade||'média')}</small>
            <button class="btn-editar">Editar</button>
            <button class="btn-apagar">Apagar</button>
          </div>
        </li>
      `).join('');
    }

    // Listeners
    listaTarefas.querySelectorAll('.chk').forEach(cb => cb.addEventListener('change', (e) => {
      const li = e.target.closest('li');
      const id = Number(li.getAttribute('data-id'));
      const t = tarefas.find(x => x.id === id);
      t.concluida = e.target.checked;
      saveTarefas(tarefas);
      renderStats(tarefas);
      li.classList.toggle('concluida', t.concluida);
    }));

    listaTarefas.querySelectorAll('.btn-apagar').forEach(btn => btn.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      const id = Number(li.getAttribute('data-id'));
      const idx = tarefas.findIndex(x => x.id === id);
      if (idx > -1) {
        tarefas.splice(idx,1);
        saveTarefas(tarefas);
        renderLista(tarefas);
        renderStats(tarefas);
      }
    }));

    listaTarefas.querySelectorAll('.btn-editar').forEach(btn => btn.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      const id = Number(li.getAttribute('data-id'));
      openModalEditar(id);
    }));
  }

  // Inicialização
  let tarefas = loadTarefas();
  renderPerfil();
  renderStats(tarefas);
  renderLista(tarefas);

  // Popular filtro (apenas a especialidade do usuário disponível aqui)
  filtroEspecialidade.innerHTML = `<option value="all">Todas</option><option value="mine">${usuario.especialidade}</option>`;

  // Notas rápidas (autosave com debounce)
  notasRapidas.value = localStorage.getItem(notasKey) || '';
  let debounceTimer = null;
  const notaStatus = document.getElementById('notaStatus');
  notasRapidas.addEventListener('input', () => {
    notaStatus.textContent = 'Alterações não salvas';
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      localStorage.setItem(notasKey, notasRapidas.value);
      notaStatus.textContent = 'Salvo';
      setTimeout(()=> notaStatus.textContent = 'Nenhuma alteração', 1200);
    }, 800);
  });

  // Próximos compromissos (demo)
  const compromissos = [
    { t: 'Consulta com João - 10/03 09:00' },
    { t: 'Avaliação presencial - 11/03 14:00' }
  ];
  proximosCompromissos.innerHTML = compromissos.map(c => `<li>${c.t}</li>`).join('');

  // Modal handling for creating/editing tasks
  let editarId = null;

  function openModalNovo() {
    editarId = null;
    modalTitle.textContent = 'Nova tarefa';
    modalTitulo.value = '';
    modalPrioridade.value = 'medium';
    modalData.value = '';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    modalTitulo.focus();
  }

  function openModalEditar(id) {
    editarId = id;
    const t = tarefas.find(x => x.id === id);
    if (!t) return;
    modalTitle.textContent = 'Editar tarefa';
    modalTitulo.value = t.titulo;
    modalPrioridade.value = t.prioridade || 'medium';
    modalData.value = t.data || '';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    modalTitulo.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
  }

  modalClose.addEventListener('click', closeModal);
  modalCancelar.addEventListener('click', closeModal);

  modalSalvar.addEventListener('click', () => {
    const titulo = modalTitulo.value.trim();
    if (!titulo) { alert('Informe o título'); modalTitulo.focus(); return; }
    const prioridade = modalPrioridade.value;
    const data = modalData.value || null;
    if (editarId) {
      const t = tarefas.find(x => x.id === editarId);
      t.titulo = titulo; t.prioridade = prioridade; t.data = data;
    } else {
      const novo = { id: Date.now(), titulo, prioridade, data, concluida: false };
      tarefas.push(novo);
    }
    saveTarefas(tarefas);
    renderLista(tarefas);
    renderStats(tarefas);
    closeModal();
  });

  btnNovoTask.addEventListener('click', openModalNovo);

  // Search / filter listeners
  if (searchTarefas) searchTarefas.addEventListener('input', () => renderLista(tarefas));
  if (statusFilter) statusFilter.addEventListener('change', () => renderLista(tarefas));

});
