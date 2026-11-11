document.getElementById('btnAlunos').addEventListener('click', () => {
  window.navegacao.abrirAlunos();
});

document.getElementById('btnCursos').addEventListener('click', () => {
  window.navegacao.abrirCursos();
});

document.getElementById('btnMatriculas').addEventListener('click', () => {
  window.navegacao.abrirMatriculas();
});

document.getElementById('sair').addEventListener('click', () => {
  window.auth.sair();
});
