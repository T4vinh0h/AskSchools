const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('auth', {
  login: dados => ipcRenderer.invoke('auth:login', dados),
  abrirPrincipal: () => ipcRenderer.send('auth:abrirPrincipal'),
  sair: () => ipcRenderer.send('auth:sair')
});
contextBridge.exposeInMainWorld('navegacao', {
  abrirAlunos: () => ipcRenderer.send('navegacao:abrirAlunos'),
  abrirCursos: () => ipcRenderer.send('navegacao:abrirCursos'),
  abrirMatriculas: () => ipcRenderer.send('navegacao:abrirMatriculas'),
  voltarMenu: () => ipcRenderer.send('navegacao:voltarMenu')
});
contextBridge.exposeInMainWorld('alunos', {
  listar: () => ipcRenderer.invoke('alunos:listar'),
  criar: dados => ipcRenderer.invoke('alunos:criar', dados),
  atualizar: dados => ipcRenderer.invoke('alunos:atualizar', dados),
  excluir: id => ipcRenderer.invoke('alunos:excluir', id)
});
contextBridge.exposeInMainWorld('cursos', {
  listar: () => ipcRenderer.invoke('cursos:listar'),
  criar: dados => ipcRenderer.invoke('cursos:criar', dados),
  atualizar: dados => ipcRenderer.invoke('cursos:atualizar', dados),
  excluir: id => ipcRenderer.invoke('cursos:excluir', id)
});
contextBridge.exposeInMainWorld('matriculas', {
  listar: () => ipcRenderer.invoke('matriculas:listar'),
  criar: dados => ipcRenderer.invoke('matriculas:criar', dados),
  excluir: id => ipcRenderer.invoke('matriculas:excluir', id),
  listarAlunos: () => ipcRenderer.invoke('matriculas:listarAlunos'),
  listarCursos: () => ipcRenderer.invoke('matriculas:listarCursos')
});
