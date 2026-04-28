const CAT_ICONE = {
  alimentacao: "🥗",
  treino: "💪",
  saude: "❤️",
  sono: "🌙",
  mental: "🧠",
  outro: "✨",
};

const CAT_LABEL = {
  alimentacao: "Alimentação",
  treino: "Treino",
  saude: "Saúde",
  sono: "Sono",
  mental: "Saúde Mental",
  outro: "Outro",
};

// Estado inicial com planos de exemplo
let planos = JSON.parse(localStorage.getItem("hs_pro_planos") || "null") || [
  {
    id: "p1",
    nome: "Dieta Emagrecimento",
    categoria: "alimentacao",
    preco: 89.9,
    duracao: "semanal",
    desc: "Plano alimentar focado em déficit calórico saudável com refeições equilibradas.",
    tarefas: [
      "Café da manhã proteico",
      "Almoço low-carb",
      "Lanche saudável",
      "Jantar leve",
      "Beber 3L de água",
    ],
    vendas: 18,
    ativo: true,
  },
  {
    id: "p2",
    nome: "Treino Hipertrofia",
    categoria: "treino",
    preco: 59.9,
    duracao: "semanal",
    desc: "Treino de força com foco em ganho de massa muscular, progressão de carga.",
    tarefas: [
      "Aquecimento 10 min",
      "Série A – peito e tríceps",
      "Série B – costas e bíceps",
      "Série C – pernas",
      "Alongamento final",
    ],
    vendas: 11,
    ativo: true,
  },
  {
    id: "p3",
    nome: "Sono Regulado",
    categoria: "sono",
    preco: 49.9,
    duracao: "4semanas",
    desc: "Rotina noturna para melhorar a qualidade do sono e reduzir insônia.",
    tarefas: [
      "Desligar telas 1h antes",
      "Meditação guiada 10 min",
      "Chá relaxante",
      "Anotação de gratidão",
    ],
    vendas: 3,
    ativo: true,
  },
];

let editandoId = null;
let tarefasTemp = [];

function salvarStorage() {
  localStorage.setItem("hs_pro_planos", JSON.stringify(planos));
}

/* ── Renderizar grid ── */
function renderPlanos() {
  const grid = document.getElementById("planosGrid");
  const vazio = document.getElementById("planosVazio");
  grid.innerHTML = "";

  if (!planos.length) {
    vazio.style.display = "block";
    return;
  }
  vazio.style.display = "none";

  planos.forEach((p) => {
    const card = document.createElement("article");
    card.className = "plano-card";

    const tarefasHtml = p.tarefas
      .slice(0, 3)
      .map(
        (t) =>
          `<div class="plano-tarefa-item"><i class="bi bi-check2"></i>${t}</div>`,
      )
      .join("");
    const maisHtml =
      p.tarefas.length > 3
        ? `<div class="plano-tarefa-item" style="color:var(--pro-green2);font-weight:600">+${p.tarefas.length - 3} mais tarefas</div>`
        : "";

    card.innerHTML = `
      <div class="plano-card-top"></div>
      <div class="plano-card-body">
        <div class="plano-header">
          <div>
            <span class="plano-categoria">${CAT_ICONE[p.categoria]} ${CAT_LABEL[p.categoria]}</span>
            <p class="plano-titulo" style="margin-top:.4rem">${p.nome}</p>
          </div>
          <p class="plano-preco">R$&nbsp;${Number(p.preco).toFixed(2).replace(".", ",")}</p>
        </div>
        <p class="plano-desc">${p.desc || "Sem descrição."}</p>
        <div class="plano-tarefas-preview">${tarefasHtml}${maisHtml}</div>
        <div class="plano-meta">
          <span class="plano-meta-item"><i class="bi bi-people-fill"></i>${p.vendas} compradores</span>
          <span class="plano-meta-item"><i class="bi bi-arrow-repeat"></i>${duracaoLabel(p.duracao)}</span>
          <span class="badge ${p.ativo ? "badge-green" : "badge-yellow"}" style="margin-left:auto">
            ${p.ativo ? "Ativo" : "Pausado"}
          </span>
        </div>
      </div>
      <div class="plano-acoes">
        <button class="pro-btn" style="flex:1;justify-content:center;font-size:.78rem;padding:.5rem;"
          onclick="editarPlano('${p.id}')" type="button">
          <i class="bi bi-pencil-fill"></i> Editar
        </button>
        <button class="pro-btn pro-btn-ghost" style="font-size:.78rem;padding:.5rem .8rem;"
          onclick="toggleAtivo('${p.id}')" type="button" title="${p.ativo ? "Pausar" : "Ativar"}">
          <i class="bi bi-${p.ativo ? "pause-circle" : "play-circle"}"></i>
        </button>
        <button class="pro-btn pro-btn-danger" style="font-size:.78rem;padding:.5rem .8rem;"
          onclick="excluirPlano('${p.id}')" type="button" title="Excluir">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function duracaoLabel(d) {
  const m = {
    semanal: "Semanal",
    "4semanas": "4 semanas",
    "8semanas": "8 semanas",
    "12semanas": "12 semanas",
    permanente: "Permanente",
  };
  return m[d] || d;
}

/* ── Modal ── */
function abrirModalCriar() {
  editandoId = null;
  tarefasTemp = [];
  document.getElementById("modalTitulo").textContent = "Novo plano";
  document.getElementById("btnSalvar").innerHTML =
    '<i class="bi bi-check2-circle"></i> Salvar plano';
  limparCampos();
  renderTarefasBuilder();
  document.getElementById("modalOverlay").classList.add("open");
}

function editarPlano(id) {
  const p = planos.find((x) => x.id === id);
  if (!p) return;
  editandoId = id;
  tarefasTemp = [...p.tarefas];
  document.getElementById("modalTitulo").textContent = "Editar plano";
  document.getElementById("btnSalvar").innerHTML =
    '<i class="bi bi-check2-circle"></i> Atualizar plano';
  document.getElementById("inpNome").value = p.nome;
  document.getElementById("inpCategoria").value = p.categoria;
  document.getElementById("inpPreco").value = p.preco;
  document.getElementById("inpDuracao").value = p.duracao;
  document.getElementById("inpDesc").value = p.desc || "";
  document.getElementById("modalErro").style.display = "none";
  renderTarefasBuilder();
  document.getElementById("modalOverlay").classList.add("open");
}

function fecharModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

function limparCampos() {
  ["inpNome", "inpPreco", "inpDesc"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("inpCategoria").value = "alimentacao";
  document.getElementById("inpDuracao").value = "semanal";
  document.getElementById("modalErro").style.display = "none";
}

/* ── Tarefas builder ── */
function renderTarefasBuilder() {
  const lista = document.getElementById("tarefasLista");
  lista.innerHTML = "";
  tarefasTemp.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "tarefa-builder-item";
    div.innerHTML = `
      <i class="bi bi-grip-vertical" style="color:var(--pro-muted);cursor:grab;font-size:.85rem;"></i>
      <input type="text" value="${t.replace(/"/g, "&quot;")}"
        oninput="tarefasTemp[${i}]=this.value"
        placeholder="Tarefa ${i + 1}" />
      <button class="btn-remove-tarefa" onclick="removerTarefa(${i})" type="button" aria-label="Remover">
        <i class="bi bi-x-lg"></i>
      </button>
    `;
    lista.appendChild(div);
  });
}

function adicionarTarefa() {
  const inp = document.getElementById("inpNovaTarefa");
  const val = inp.value.trim();
  if (!val) return;
  tarefasTemp.push(val);
  inp.value = "";
  renderTarefasBuilder();
}

function removerTarefa(i) {
  tarefasTemp.splice(i, 1);
  renderTarefasBuilder();
}

/* ── Salvar ── */
function salvarPlano() {
  const nome = document.getElementById("inpNome").value.trim();
  const categoria = document.getElementById("inpCategoria").value;
  const precoRaw = document.getElementById("inpPreco").value;
  const duracao = document.getElementById("inpDuracao").value;
  const desc = document.getElementById("inpDesc").value.trim();
  const erroEl = document.getElementById("modalErro");

  if (!nome) {
    erroEl.textContent = "O nome do plano é obrigatório.";
    erroEl.style.display = "block";
    return;
  }
  if (!precoRaw || isNaN(precoRaw) || Number(precoRaw) < 0) {
    erroEl.textContent = "Informe um preço válido.";
    erroEl.style.display = "block";
    return;
  }
  erroEl.style.display = "none";

  const preco = Number(precoRaw);

  if (editandoId) {
    const idx = planos.findIndex((x) => x.id === editandoId);
    if (idx > -1) {
      planos[idx] = {
        ...planos[idx],
        nome,
        categoria,
        preco,
        duracao,
        desc,
        tarefas: [...tarefasTemp],
      };
    }
  } else {
    planos.unshift({
      id: "p" + Date.now(),
      nome,
      categoria,
      preco,
      duracao,
      desc,
      tarefas: [...tarefasTemp],
      vendas: 0,
      ativo: true,
    });
  }

  salvarStorage();
  fecharModal();
  renderPlanos();
}

/* ── Toggle / Excluir ── */
function toggleAtivo(id) {
  const p = planos.find((x) => x.id === id);
  if (p) {
    p.ativo = !p.ativo;
    salvarStorage();
    renderPlanos();
  }
}

function excluirPlano(id) {
  if (!confirm("Excluir este plano? Esta ação não pode ser desfeita.")) return;
  planos = planos.filter((x) => x.id !== id);
  salvarStorage();
  renderPlanos();
}

/* Fechar ao clicar fora */
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) fecharModal();
});

/* Init */
renderPlanos();
