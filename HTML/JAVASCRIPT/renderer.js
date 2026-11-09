const formulario = document.getElementById('formulario');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const telefone = document.getElementById('telefone');
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
  document.getElementById('tituloFormulario').textContent = 'Novo aluno';
  document.getElementById('cancelar').hidden = true;
}

document.getElementById('cancelar')
  .addEventListener('click', limpar);

function editar(aluno) {
  idEdicao = aluno.id;
  nome.value = aluno.nome;
  email.value = aluno.email;
  telefone.value = aluno.telefone;
  document.getElementById('salvar').textContent = 'Salvar alterações';
  document.getElementById('tituloFormulario').textContent = 'Editar aluno';
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

async function excluirAluno(id) {
  const r = conferir(await window.alunos.excluir(id));
  if (r.cancelado) return;
  if (idEdicao === id) limpar();
  await atualizarLista('Aluno excluído.');
}

function acoesAluno(aluno) {
  const celula = document.createElement('td');
  celula.appendChild(botao('Editar', () => editar(aluno)));
  celula.appendChild(botao('Excluir', () => {
    executar(() => excluirAluno(aluno.id));
  }));
  return celula;
}

async function carregar() {
  const alunos = conferir(await window.alunos.listar());
  lista.replaceChildren();
  for (const aluno of alunos) {
    const linha = document.createElement('tr');
    for (const valor of [aluno.id, aluno.nome, aluno.email, aluno.telefone]) {
      const celula = document.createElement('td');
      celula.textContent = valor;
      linha.appendChild(celula);
    }
    linha.appendChild(acoesAluno(aluno));
    lista.appendChild(linha);
  }
  document.getElementById('resumo').textContent =
    `${alunos.length} aluno(s) cadastrado(s)`;
}

async function executar(tarefa) {
  if (ocupado) return;
  ocupado = true;
  const campos = document.querySelectorAll('button, input');
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

    // Adiciona efeito de piscar na tabela
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
    const dados = { nome: nome.value.trim(), email: email.value.trim(), telefone: telefone.value.trim() };
    if (idEdicao === null) conferir(await window.alunos.criar(dados));
    else conferir(await window.alunos.atualizar({ id: idEdicao, ...dados }));
    limpar();
    await atualizarLista('Aluno salvo.');
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

consultar();
