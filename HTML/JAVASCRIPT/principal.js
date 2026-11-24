// ===== CÓDIGO ATUAL (COMENTADO - ATIVIDADE 4) =====
// document.getElementById('btnAlunos').addEventListener('click', () => {
//   window.navegacao.abrirAlunos();
// });

// document.getElementById('btnCursos').addEventListener('click', () => {
//   window.navegacao.abrirCursos();
// });

// document.getElementById('btnMatriculas').addEventListener('click', () => {
//   window.navegacao.abrirMatriculas();
// });

// document.getElementById('sair').addEventListener('click', () => {
//   window.auth.sair();
// });
// ===== FIM DO CÓDIGO ATUAL =====

// ===== CÓDIGO DA AULA 4 - INÍCIO =====
for (const botao of document.querySelectorAll('[data-cadastro]')) {
  botao.addEventListener('click', () => window.menu.abrir(botao.dataset.cadastro));
}

document.getElementById('sair').addEventListener('click', () => window.auth.sair());
// ===== CÓDIGO DA AULA 4 - FIM =====
