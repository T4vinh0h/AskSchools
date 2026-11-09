const formulario = document.getElementById('formulario');
const aluno = document.getElementById('aluno');
const curso = document.getElementById('curso');
const data_matricula = document.getElementById('data_matricula');
const lista = document.getElementById('lista');
const mensagem = document.getElementById('mensagem');

let ocupado = false;

function avisar(texto) { mensagem.textContent = texto; }

function conferir(resposta) {
  if (!resposta.ok) throw new Error(resposta.erro);
  return resposta.dados;
}

async function carregarSelects() {
  const alunos = conferir(await window.matriculas.listarAlunos());
  const cursos = conferir(await window.matriculas.listarCursos());

  aluno.innerHTML = '<option value="">Selecione o aluno</option>';
  for (const a of alunos) {
    const option = document.createElement('option');
    option.value = a.id;
    option.textContent = a.nome;
    aluno.appendChild(option);
  }

  curso.innerHTML = '<option value="">Selecione o curso</option>';
  for (const c of cursos) {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.nome;
    curso.appendChild(option);
  }

  if (cursos.length === 0) {
    curso.innerHTML = '<option value="">Cadastre um curso primeiro</option>';
    curso.disabled = true;
  } else {
    curso.disabled = false;
  }
}

async function carregar() {
  const matriculas = conferir(await window.matriculas.listar());
  lista.replaceChildren();
  for (const matricula of matriculas) {
    const linha = document.createElement('tr');
    for (const valor of [matricula.id, matricula.aluno_nome, matricula.curso_nome, matricula.data_matricula]) {
      const celula = document.createElement('td');
      celula.textContent = valor;
      linha.appendChild(celula);
    }
    const celulaAcoes = document.createElement('td');
    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', () => {
      executar(() => excluirMatricula(matricula.id));
    });
    celulaAcoes.appendChild(btnExcluir);
    linha.appendChild(celulaAcoes);
    lista.appendChild(linha);
  }
  document.getElementById('resumo').textContent =
    `${matriculas.length} matrícula(s) cadastrada(s)`;
}

async function executar(tarefa) {
  if (ocupado) return;
  ocupado = true;
  const campos = document.querySelectorAll('button, input, select');
  campos.forEach(el => { el.disabled = true; });
  try { await tarefa(); }
  catch (erro) { avisar(erro.message); }
  finally {
    ocupado = false;
    campos.forEach(el => { el.disabled = false; });
  }
}

async function atualizarLista(texto) {
  try { await carregar(); avisar(texto); }
  catch (erro) {
    avisar(texto + ' Lista desatualizada. Use Atualizar lista.');
  }
}

async function excluirMatricula(id) {
  conferir(await window.matriculas.excluir(id));
  await atualizarLista('Matrícula excluída.');
}

function consultar() {
  executar(async () => {
    const botaoRecarregar = document.getElementById('recarregar');
    botaoRecarregar.classList.add('carregando');
    await carregar();
    botaoRecarregar.classList.remove('carregando');
    avisar('Lista atualizada.');

    lista.classList.add('piscando');
    setTimeout(() => {
      lista.classList.remove('piscando');
    }, 500);
  });
}

document.getElementById('recarregar')
  .addEventListener('click', consultar);

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  executar(async () => {
    const dados = {
      aluno_id: parseInt(aluno.value),
      curso_id: parseInt(curso.value),
      data_matricula: data_matricula.value
    };
    conferir(await window.matriculas.criar(dados));
    formulario.reset();
    await atualizarLista('Matrícula realizada.');
  });
});

document.getElementById('voltar').addEventListener('click', () => {
  if (ocupado) return;
  window.navegacao.voltarMenu();
});

document.getElementById('sair').addEventListener('click', () => {
  if (ocupado) return;
  window.auth.sair();
});

carregarSelects();
consultar();
