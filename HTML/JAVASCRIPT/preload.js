const { contextBridge, ipcRenderer } = require('electron');

// ===== CÓDIGO ATUAL (COMENTADO - ATIVIDADE 4) =====
// contextBridge.exposeInMainWorld('auth', {
//   login: dados => ipcRenderer.invoke('auth:login', dados),
//   abrirPrincipal: () => ipcRenderer.send('auth:abrirPrincipal'),
//   sair: () => ipcRenderer.send('auth:sair')
// });
// contextBridge.exposeInMainWorld('navegacao', {
//   abrirAlunos: () => ipcRenderer.send('navegacao:abrirAlunos'),
//   abrirCursos: () => ipcRenderer.send('navegacao:abrirCursos'),
//   abrirMatriculas: () => ipcRenderer.send('navegacao:abrirMatriculas'),
//   voltarMenu: () => ipcRenderer.send('navegacao:voltarMenu')
// });
// contextBridge.exposeInMainWorld('alunos', {
//   listar: () => ipcRenderer.invoke('alunos:listar'),
//   criar: dados => ipcRenderer.invoke('alunos:criar', dados),
//   atualizar: dados => ipcRenderer.invoke('alunos:atualizar', dados),
//   excluir: id => ipcRenderer.invoke('alunos:excluir', id)
// });
// contextBridge.exposeInMainWorld('cursos', {
//   listar: () => ipcRenderer.invoke('cursos:listar'),
//   criar: dados => ipcRenderer.invoke('cursos:criar', dados),
//   atualizar: dados => ipcRenderer.invoke('cursos:atualizar', dados),
//   excluir: id => ipcRenderer.invoke('cursos:excluir', id)
// });
// contextBridge.exposeInMainWorld('matriculas', {
//   listar: () => ipcRenderer.invoke('matriculas:listar'),
//   criar: dados => ipcRenderer.invoke('matriculas:criar', dados),
//   excluir: id => ipcRenderer.invoke('matriculas:excluir', id),
//   listarAlunos: () => ipcRenderer.invoke('matriculas:listarAlunos'),
//   listarCursos: () => ipcRenderer.invoke('matriculas:listarCursos')
// });
// ===== FIM DO CÓDIGO ATUAL =====

// ===== CÓDIGO DA AULA 4 - INÍCIO =====
contextBridge.exposeInMainWorld('auth', {
  login: dados => ipcRenderer.invoke('auth:login', dados),
  abrirPrincipal: () => ipcRenderer.send('auth:abrirPrincipal'),
  sair: () => ipcRenderer.send('auth:sair')
});

contextBridge.exposeInMainWorld('menu', {
  abrir: destino => ipcRenderer.send('menu:abrir', destino),
  inicio: () => ipcRenderer.send('menu:inicio')
});

function apiCadastro(pagina) {
  return {
    listar: () => ipcRenderer.invoke(pagina + ':listar'),
    criar: dados => ipcRenderer.invoke(pagina + ':criar', dados),
    atualizar: dados => ipcRenderer.invoke(pagina + ':atualizar', dados),
    excluir: id => ipcRenderer.invoke(pagina + ':excluir', id)
  };
}

// ===== CÓDIGO DA AULA 5 - INÍCIO =====
contextBridge.exposeInMainWorld('alunos', apiCadastro('alunos'));
contextBridge.exposeInMainWorld('cursos', apiCadastro('cursos'));
contextBridge.exposeInMainWorld('matriculas', {
  listar: () => ipcRenderer.invoke('matriculas:listar'),
  criar: dados => ipcRenderer.invoke('matriculas:criar', dados),
  excluir: id => ipcRenderer.invoke('matriculas:excluir', id),
  listarAlunos: () => ipcRenderer.invoke('matriculas:listarAlunos'),
  listarCursos: () => ipcRenderer.invoke('matriculas:listarCursos')
});
// ===== CÓDIGO DA AULA 5 - FIM =====

// ===== CÓDIGO DA AULA 4 - FIM =====
