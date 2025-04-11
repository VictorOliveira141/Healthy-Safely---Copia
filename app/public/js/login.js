function verificarUsuario(event) {
    event.preventDefault();  // Impede o envio do formulário

    console.log("Função de verificação chamada");

    const usuarioDigitado = document.getElementById('usuarioDigitado').value;
    const senhaDigitada = document.getElementById('senhaDigitada').value;

    const ContaseSenhas = {
        'rm94501@estudante.fieb.edu.br': '04062008'
    };

    if (ContaseSenhas[usuarioDigitado] === senhaDigitada) {
        console.log("Login bem-sucedido, redirecionando...");
        window.location.href = '/tela-inicial';  // Redirecionamento
    } else {
        console.log("Falha no login!");
        alert('Login ou senha não encontrados. Tente novamente.');
    }
}

