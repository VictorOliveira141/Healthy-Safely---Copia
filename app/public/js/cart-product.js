// === ABRIR / FECHAR CARRINHO ===
function openCartMenu() {
  document.getElementById("cartSidebar").classList.add("open");
  checkEmptyCart();
}

function closeCartMenu() {
  document.getElementById("cartSidebar").classList.remove("open");
}

// === VERIFICAR SE CARRINHO ESTÁ VAZIO ===
function checkEmptyCart() {
  const cartItems = document.querySelectorAll("#cartItems li");
  const emptyMessage = document.getElementById("emptyCartMessage");

  if (cartItems.length === 0) {
    emptyMessage.style.display = "flex";
  } else {
    emptyMessage.style.display = "none";
  }
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

  const lista = document.querySelector("#cartItems");

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
      checkEmptyCart();
    });

    li.querySelector(".remover").addEventListener("click", () => {
      li.remove();
      updateTotal();
      checkEmptyCart();
    });

    lista.appendChild(li);
  }

  openCartMenu();
  updateTotal();
  checkEmptyCart();
}

// === ATUALIZAR TOTAL ===
function updateTotal() {
  // selecionar todas as subtotais dentro do container #cartItems
  const itens = document.querySelectorAll("#cartItems .subtotal");
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
