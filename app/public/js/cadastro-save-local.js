// cadastro-save-local.js
// Intercepta formulários de cadastro existentes e salva os dados mínimos em localStorage
// para uso apenas no front-end (modo demo). Não altera o fluxo server-side se não desejar.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('main form');
  if (!form) return;
  // Não interceptar o envio dos formulários reais de cadastro do sistema.
  // Permitir o fluxo server-side em páginas:
  //  - /cadastroCliente
  //  - /cadastroProfissional
  //  - /cadastro
  const pathname = window.location.pathname || '';
  const skipIntercept = ['/cadastroCliente', '/cadastroProfissional', '/cadastro'].includes(pathname);
  if (skipIntercept) return; // deixa o envio seguir para o servidor

  form.addEventListener('submit', (e) => {
    // Interceptar e impedir envio ao servidor para modo front-end-only
    e.preventDefault();

    const nome = form.querySelector('#nome') ? form.querySelector('#nome').value.trim() : '';
    const email = form.querySelector('#email') ? form.querySelector('#email').value.trim() : '';

    // Detectar se é a página de profissional (possui #especialidades) ou cliente
    const isProfissional = !!form.querySelector('#especialidades') || !!form.querySelector('#areaAtuacao');

    let especialidade = null;
    if (isProfissional) {
      const espInput = form.querySelector('#especialidades');
      if (espInput && espInput.value.trim()) especialidade = espInput.value.trim();
      else {
        const area = form.querySelector('#areaAtuacao');
        if (area && area.value) {
          // traduzir option value para label quando possível
          const sel = area;
          const opt = sel.options[sel.selectedIndex];
          especialidade = opt ? opt.text : area.value;
        }
      }
    }

    const usuario = {
      nome: nome || 'Usuário',
      email: email || null,
      tipo: isProfissional ? 'profissional' : 'comum',
      especialidade: especialidade,
      criadoEm: new Date().toISOString()
    };

    localStorage.setItem('usuarioCadastro', JSON.stringify(usuario));

    // Redireciona para painel local que renderiza conforme tipo
    window.location.href = '/painel-local';
  });
});
