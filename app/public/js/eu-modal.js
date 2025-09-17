/* ============ SCRIPT PARA O EU.EJS com os conteudos de cada botão ========= */

document.addEventListener("DOMContentLoaded", () => {
  const euModal = document.getElementById("euModal");
  const euModalBody = document.getElementById("euModalBody");
  const euCloseBtn = euModal.querySelector(".close");

  const conteudos = {
    identidade: `
          <div class="topo-modal">
            <div class="foto-editar">
              <img src="../imagem/user.png" class="modal-img" alt="Foto de perfil">
              <i class="bi bi-pencil-fill icone-editar-foto"></i>
            </div>
            <h2>Informações de Identidade</h2>
          </div>
          <div class="info-content">
            <div class="info-modal">
              <div><i class="bi bi-person"></i> <p><b>Nome Completo:</b> </p></div>
              <div><i class="bi bi-person-badge"></i> <p><b>Nome de Usuário:</b> </p></div>
              <div><i class="bi bi-envelope"></i> <p><b>Email:</b> </p></div>
              <div><i class="bi bi-telephone"></i> <p><b>Telefone:</b> </p></div>
              <div><i class="bi bi-file-text"></i> <p><b>CPF:</b> </p></div>
              <div><i class="bi bi-calendar"></i> <p><b>Data de Nascimento:</b> </p></div>
              <div><i class="bi bi-gender-male"></i> <p><b>Gênero:</b> </p></div>

              <button>Redefinir senha</button>
            </div>
            <div>
              
              <button>Salvar Alterações</button>
            </div>
          </div>
        `,
    consultas: `
          <div class="topo-modal"><h2>Consultas Online</h2></div>
          <div class="centro-modal">
            <h1>Você não tem nenhuma consulta online no momento. Deseja <a href="#">marcar</a> uma?</h1>
          </div>
        `,
    pedidos: `
          <div class="topo-modal"><h2>Meus pedidos</h2></div>
          <div class="centro-modal">
            <h1>Você não tem nenhum pedido no momento. Visite nossa <a href="/loja">loja</a>!</h1>
          </div>
        `,
    favoritos: `
          <div class="topo-modal"><h2>Favoritos</h2></div>
          <div class="centro-modal">
            <h1>Você não favoritou nenhum produto no momento. Visite nossa <a href="/loja">loja</a>!</h1>
          </div>
        `,
    cupons: `
          <div class="topo-modal"><h2>Meus cupons</h2></div>
          <div class="centro-modal">
            <h1>Você não tem nenhum cupom no momento. Visite <a href="#">cupons</a> e resgate!</h1>
          </div>
        `,
    doacoes: `
          <div class="topo-modal"><h2>Meus pedidos</h2></div>
          <div class="centro-modal">
            <h1>Você não fez nenhuma doação até o momento. Faça já a sua primeira <a href="/doação">doação</a>!</h1>
          </div>
    `,
    pagamentos: `
          <div class="topo-modal"><h2>Pagamentos</h2></div>
          <div class="centro-modal">
            <h1>Você não tem nenhum pagamento pendente no momento.</h1>
          </div>
        `,
    endereços: `
          <div class="topo-modal"><h2>Endereços</h2></div>
          <div class="centro-modal">
            <h1>Você não adicionou nenhum endereço no momento.</h1>
          </div>
        `,
    suporte: `
          <div class="topo-modal"><h2>Suporte</h2></div>
          <div class="centro-modal">
            <h1>Estamos pensando no que colocar aqui.</h1>
          </div>
        `,
    sair: `
          <div class="sair-modal">
            <h1>Você tem certeza de quer sair da conta?</h1>
            <div class="botoes-sair">
              <button class="nao">Não</button>
              <button class="sim">Sair</button>
            </div>
          </div>
        `,
  };

  // Abrir modal
  document.querySelectorAll(".open-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tipo = btn.dataset.content;
      euModalBody.innerHTML =
        conteudos[tipo] || "<p>Conteúdo não encontrado.</p>";
      euModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  // Fechar modal
  euCloseBtn.addEventListener("click", () => {
    euModal.style.display = "none";
    document.body.style.overflow = "";
  });

  window.addEventListener("click", (e) => {
    if (e.target === euModal) {
      euModal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
});
