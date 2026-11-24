async function carregarOpcoes() {
  const alunos = await window.matriculas.listarAlunos();
  const cursos = await window.matriculas.listarCursos();

  const selectAluno = document.getElementById('aluno_id');
  const selectCurso = document.getElementById('curso_id');

  selectAluno.innerHTML = '<option value="">Selecione o aluno</option>';
  for (const a of alunos) {
    const option = document.createElement('option');
    option.value = a.id;
    option.textContent = a.nome;
    selectAluno.appendChild(option);
  }

  selectCurso.innerHTML = '<option value="">Selecione o curso</option>';
  for (const c of cursos) {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.nome;
    selectCurso.appendChild(option);
  }

  if (cursos.length === 0) {
    selectCurso.innerHTML = '<option value="">Cadastre um curso primeiro</option>';
    selectCurso.disabled = true;
  } else {
    selectCurso.disabled = false;
  }
}

iniciarCadastro({
  api: window.matriculas,
  tituloNovo: 'Nova matrícula',
  nomeRegistro: 'Matrícula',
  camposTabela: ['id', 'aluno_nome', 'curso_nome', 'data_matricula'],
  carregarOpcoes
});
