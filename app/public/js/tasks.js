const formNovaTarefa = document.getElementById("formNovaTarefa")
const inputTarefa = document.getElementById("campoTarefa")
const listaTarefas = document.getElementById("listaTarefas")

formNovaTarefa.addEventListener("submit", function(e){

e.preventDefault()

const textoDaTarefa = inputTarefa.value.trim()

if(!textoDaTarefa) return

const tarefaNova = document.createElement("li")

tarefaNova.className = "card-tarefa"

tarefaNova.innerHTML = `
<span class="texto-tarefa">${textoDaTarefa}</span>
<button class="btn-concluir">✔</button>
`

tarefaNova.querySelector("button").addEventListener("click",function(){

tarefaNova.classList.toggle("tarefa-feita")

})

listaTarefas.appendChild(tarefaNova)

inputTarefa.value = ""

})