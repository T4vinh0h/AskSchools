const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const db = require('./HTML/JAVASCRIPT/db');
const paginas = {
  login: pathToFileURL(path.join(__dirname, 'HTML/login.html')).href,
  menu: pathToFileURL(path.join(__dirname, 'HTML/menu.html')).href,
  alunos: pathToFileURL(path.join(__dirname, 'HTML/index.html')).href,
  cursos: pathToFileURL(path.join(__dirname, 'HTML/cursos.html')).href,
  matriculas: pathToFileURL(path.join(__dirname, 'HTML/matriculas.html')).href
};
let janela;
let sessao = null;

function origemValida(evento, pagina) {
  if (!janela || janela.isDestroyed()) return false;
  if (evento.sender !== janela.webContents) return false;
  if (!evento.senderFrame || evento.senderFrame !== janela.webContents.mainFrame) return false;
  const urlEsperada = paginas[pagina];
  if (!urlEsperada) return false;
  return evento.senderFrame.url === urlEsperada;
}

function mensagemErro(erro) {
  if (erro.code === 'VALIDACAO') return erro.message;
  if (erro.code === 'ER_DUP_ENTRY') return 'E-mail já cadastrado.';
  if (erro.code === 'ER_ACCESS_DENIED_ERROR') return 'Confira usuário e senha.';
  if (erro.code === 'ER_BAD_DB_ERROR' || erro.code === 'ER_NO_SUCH_TABLE') {
    return 'Execute o banco.sql no servidor correto.';
  }
  return 'Confira o serviço MySQL e a configuração no .env.';
}

function registrar(canal, acao, paginaOrigem) {
  ipcMain.handle(canal, async (evento, dados) => {
    if (!sessao) {
      return { ok: false, erro: 'Faça login para continuar.' };
    }
    if (paginaOrigem && !origemValida(evento, paginaOrigem)) {
      return { ok: false, erro: 'Origem não autorizada.' };
    }
    try {
      return { ok: true, dados: await acao(dados) };
    } catch (erro) {
      console.error('Falha no CRUD:', erro.code || 'ERRO');
      return { ok: false, erro: mensagemErro(erro) };
    }
  });
}

ipcMain.handle('auth:login', async (evento, dados) => {
  try {
    sessao = null;
    sessao = await db.autenticar(dados);
    return { ok: true };
  } catch (erro) {
    console.error('Falha no login:', erro.code || 'ERRO');
    return { ok: false, erro: mensagemErro(erro) };
  }
});

ipcMain.on('auth:abrirMenu', evento => {
  if (!sessao) return;
  janela.loadFile(path.join(__dirname, 'HTML/menu.html'));
});

ipcMain.on('navegacao:abrirAlunos', evento => {
  if (!sessao) return;
  janela.loadFile(path.join(__dirname, 'HTML/index.html'));
});
ipcMain.on('navegacao:abrirCursos', evento => {
  if (!sessao) return;
  janela.loadFile(path.join(__dirname, 'HTML/cursos.html'));
});
ipcMain.on('navegacao:abrirMatriculas', evento => {
  if (!sessao) return;
  janela.loadFile(path.join(__dirname, 'HTML/matriculas.html'));
});
ipcMain.on('navegacao:voltarMenu', evento => {
  if (!sessao) return;
  janela.loadFile(path.join(__dirname, 'HTML/menu.html'));
});
ipcMain.on('auth:sair', evento => {
  if (!sessao) return;
  sessao = null;
  janela.loadFile(path.join(__dirname, 'HTML/login.html'));
});

registrar('alunos:listar', () => db.listar(), 'alunos');
registrar('alunos:criar', dados => db.criar(dados), 'alunos');
registrar('alunos:atualizar', dados => db.atualizar(dados), 'alunos');
registrar('alunos:excluir', async id => {
  const resposta = await dialog.showMessageBox(janela, {
    type: 'question', buttons: ['Cancelar', 'Excluir'],
    defaultId: 0, cancelId: 0,
    message: `Excluir o aluno de código ${id}?`
  });
  if (resposta.response !== 1) return { cancelado: true };
  return db.excluir(id);
}, 'alunos');

registrar('cursos:listar', () => db.listarCursos(), 'cursos');
registrar('cursos:criar', dados => db.criarCurso(dados), 'cursos');
registrar('cursos:atualizar', dados => db.atualizarCurso(dados), 'cursos');
registrar('cursos:excluir', async id => {
  const resposta = await dialog.showMessageBox(janela, {
    type: 'question', buttons: ['Cancelar', 'Excluir'],
    defaultId: 0, cancelId: 0,
    message: `Excluir o curso de código ${id}?`
  });
  if (resposta.response !== 1) return { cancelado: true };
  return db.excluirCurso(id);
}, 'cursos');

registrar('matriculas:listar', () => db.listarMatriculas(), 'matriculas');
registrar('matriculas:criar', dados => db.criarMatricula(dados), 'matriculas');
registrar('matriculas:excluir', async id => {
  const resposta = await dialog.showMessageBox(janela, {
    type: 'question', buttons: ['Cancelar', 'Excluir'],
    defaultId: 0, cancelId: 0,
    message: `Excluir a matrícula de código ${id}?`
  });
  if (resposta.response !== 1) return { cancelado: true };
  return db.excluirMatricula(id);
}, 'matriculas');
registrar('matriculas:listarAlunos', () => db.listarAlunosParaSelect(), null);
registrar('matriculas:listarCursos', () => db.listarCursosParaSelect(), null);

function criarJanela() {
  sessao = null;
  janela = new BrowserWindow({
    width: 900,
    height: 720,
    minWidth: 650,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'HTML/JAVASCRIPT/preload.js')
    }
  });
  janela.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  janela.webContents.on('will-navigate', evento => evento.preventDefault());
  janela.loadFile(path.join(__dirname, 'HTML/login.html'));
  janela.on('closed', () => {
    sessao = null;
    janela = null;
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  criarJanela();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    criarJanela();
  }
});

let encerrando = false;
app.on('before-quit', evento => {
  if (encerrando) return;
  evento.preventDefault();
  encerrando = true;
  db.fechar().catch(() => {}).finally(() => app.quit());
});
