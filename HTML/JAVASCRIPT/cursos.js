const formulario = document.getElementById('formulario');
const nome = document.getElementById('nome');
const carga_horaria = document.getElementById('carga_horaria');
const descricao = document.getElementById('descricao');
const lista = document.getElementById('lista');
const mensagem = document.getElementById('mensagem');

const imprimirRelatorio =
  document.getElementById('imprimirRelatorio');

const dataRelatorio =
  document.getElementById('dataRelatorio');

let ocupado = false;
let idEdicao = null;

function avisar(texto) { mensagem.textContent = texto; }

function conferir(resposta) {
  if (!resposta.ok) throw new Error(resposta.erro);
  return resposta.dados;
}

function limpar() {
  formulario.reset();
  idEdicao = null;
  document.getElementById('salvar').textContent = 'Cadastrar';
  document.getElementById('tituloFormulario').textContent = 'Novo curso';
  document.getElementById('cancelar').hidden = true;
}

document.getElementById('cancelar')
  .addEventListener('click', limpar);

function editar(curso) {
  idEdicao = curso.id;
  nome.value = curso.nome;
  carga_horaria.value = curso.carga_horaria;
  descricao.value = curso.descricao || '';
  document.getElementById('salvar').textContent = 'Salvar alterações';
  document.getElementById('tituloFormulario').textContent = 'Editar curso';
  document.getElementById('cancelar').hidden = false;
  nome.focus();
}

function botao(texto, acao) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = texto;
  btn.addEventListener('click', acao);
  return btn;
}

async function excluirCurso(id) {
  console.log('Excluindo curso...');
  const r = conferir(await window.cursos.excluir(id));
  if (r.cancelado) {
    console.log('Exclusão cancelada');
    return;
  }
  if (idEdicao === id) limpar();
  await atualizarLista('Curso excluído.');
  console.log('Curso excluído');
}

function acoesCurso(curso) {
  const celula = document.createElement('td');
  celula.appendChild(botao('Editar', () => editar(curso)));
  celula.appendChild(botao('Excluir', () => {
    executar(() => excluirCurso(curso.id));
  }));
  return celula;
}

async function carregar() {
  const cursos = conferir(await window.cursos.listar());
  lista.replaceChildren();
  for (const curso of cursos) {
    const linha = document.createElement('tr');
    for (const valor of [curso.id, curso.nome, curso.carga_horaria, curso.descricao || '']) {
      const celula = document.createElement('td');
      celula.textContent = valor;
      linha.appendChild(celula);
    }
    linha.appendChild(acoesCurso(curso));
    lista.appendChild(linha);
  }
  document.getElementById('resumo').textContent =
    `${cursos.length} curso(s) cadastrado(s)`;
}

async function executar(tarefa) {
  if (ocupado) return;
  ocupado = true;
  const campos = document.querySelectorAll('button, input, textarea');
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

imprimirRelatorio.addEventListener('click', () => {
  executar(async () => {
    await carregar();
    dataRelatorio.textContent =
      `Emitido em: ${new Date().toLocaleString('pt-BR')}`;
    window.print();
  });
});

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  executar(async () => {
    const dados = {
      nome: nome.value.trim(),
      carga_horaria: parseInt(carga_horaria.value),
      descricao: descricao.value.trim()
    };
    if (idEdicao === null) {
      console.log('Cadastrando curso...');
      conferir(await window.cursos.criar(dados));
      console.log('Curso cadastrado');
    } else {
      console.log('Atualizando curso...');
      conferir(await window.cursos.atualizar({ id: idEdicao, ...dados }));
      console.log('Curso atualizado');
    }
    limpar();
    await atualizarLista('Curso salvo.');
  });
});

document.getElementById('voltar').addEventListener('click', () => {
  if (ocupado) return;
  window.auth.abrirPrincipal();
});

document.getElementById('sair').addEventListener('click', () => {
  if (ocupado) return;
  console.log('Saindo do sistema...');
  window.auth.sair();
});

consultar();
