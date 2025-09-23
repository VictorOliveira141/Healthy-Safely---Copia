// === ABRIR / FECHAR CARRINHO ===
function openCartMenu() {
  document.getElementById("cartSidebar").classList.add("open");
}

function closeCartMenu() {
  document.getElementById("cartSidebar").classList.remove("open");
}

// === ADICIONAR PRODUTO NO CARRINHO ===
function addToCart(button) {
  const produto = button.closest(".produtos");
  const titulo = produto.querySelector("h3").innerText;
  const preco = parseFloat(
    produto
      .querySelector(".preco")
      .innerText.replace("R$", "")
      .replace(",", ".")
  );
  const imgSrc = produto.querySelector("img").src;

  const lista = document.querySelector("#cartSidebar ul");

  // Verifica se o produto já existe
  let itemExistente = [...lista.children].find(
    (li) => li.querySelector(".titulo-produto")?.innerText === titulo
  );

  if (itemExistente) {
    let qtdEl = itemExistente.querySelector(".quantidade");
    let qtd = parseInt(qtdEl.innerText) + 1;
    qtdEl.innerText = qtd;

    let subtotalEl = itemExistente.querySelector(".subtotal");
    subtotalEl.innerText = "R$ " + (preco * qtd).toFixed(2).replace(".", ",");
  } else {
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="produto-carrinho">
          <img src="${imgSrc}" alt="${titulo}" width="50" />
          <div class="info">
            <span class="titulo-produto">${titulo}</span><br>
            <span class="preco-unitario">R$ ${preco
              .toFixed(2)
              .replace(".", ",")}</span> x 
            <span class="quantidade">1</span> <br>
            <strong class="subtotal">R$ ${preco
              .toFixed(2)
              .replace(".", ",")}</strong>
          </div>
        </div>
        <div class="acoes">
          <button class="menos">-</button>
          <button class="mais">+</button>
          <button class="remover">Remover</button>
        </div>
      `;

    // === Eventos dos botões ===
    li.querySelector(".mais").addEventListener("click", () => {
      let qtdEl = li.querySelector(".quantidade");
      let qtd = parseInt(qtdEl.innerText) + 1;
      qtdEl.innerText = qtd;
      li.querySelector(".subtotal").innerText =
        "R$ " + (preco * qtd).toFixed(2).replace(".", ",");
      updateTotal();
    });

    li.querySelector(".menos").addEventListener("click", () => {
      let qtdEl = li.querySelector(".quantidade");
      let qtd = parseInt(qtdEl.innerText) - 1;
      if (qtd <= 0) {
        li.remove();
      } else {
        qtdEl.innerText = qtd;
        li.querySelector(".subtotal").innerText =
          "R$ " + (preco * qtd).toFixed(2).replace(".", ",");
      }
      updateTotal();
    });

    li.querySelector(".remover").addEventListener("click", () => {
      li.remove();
      updateTotal();
    });

    lista.appendChild(li);
  }

  openCartMenu();
  updateTotal();
}

// === ATUALIZAR TOTAL ===
function updateTotal() {
  const itens = document.querySelectorAll("#cartSidebar ul li .subtotal");
  let total = 0;

  itens.forEach((item) => {
    const valor = parseFloat(
      item.innerText.replace("R$", "").replace(",", ".")
    );
    total += valor;
  });

  document.getElementById("cartTotal").innerText =
    "R$ " + total.toFixed(2).replace(".", ",");
}
