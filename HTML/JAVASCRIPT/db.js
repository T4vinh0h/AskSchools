const path = require('node:path');
const { createHash } = require('node:crypto');
require('dotenv').config({
  path: path.join(__dirname, '../../.env'), quiet: true
});
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 3,
  connectTimeout: 5000
});

function falhar(texto) {
  const erro = new Error(texto);
  erro.code = 'VALIDACAO';
  throw erro;
}

function validarId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    falhar('Identificador inválido.');
  }
}

function validarAluno(dados) {
  const nome = typeof dados?.nome === 'string' ? dados.nome.trim() : '';
  const email = typeof dados?.email === 'string' ? dados.email.trim() : '';
  const telefone = typeof dados?.telefone === 'string' ? dados.telefone.trim() : '';
  if (!nome || nome.length > 100) falhar('Nome inválido.');
  if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    falhar('E-mail inválido.');
  }
  if (!telefone || telefone.length > 15) falhar('Telefone inválido.');
  return { nome, email, telefone };
}

async function autenticar(dados) {
  const usuario = typeof dados?.usuario === 'string'
    ? dados.usuario.trim() : '';
  const senha = typeof dados?.senha === 'string'
    ? dados.senha : '';
  if (!usuario || usuario.length > 100 ||
      !senha || senha.length > 128) {
    falhar('Informe usuário e senha válidos.');
  }

  const senhaMd5 = createHash('md5')
    .update(senha, 'utf8')
    .digest('hex');
  const [linhas] = await pool.execute(
    'SELECT id, usuario FROM usuarios ' +
    'WHERE usuario = ? AND senha = ? LIMIT 1',
    [usuario, senhaMd5]
  );
  if (!linhas.length) {
    falhar('Usuário ou senha inválidos.');
  }
  return linhas[0];
}

async function listar() {
  const [linhas] = await pool.execute(
    'SELECT id, nome, email, telefone FROM alunos ORDER BY id DESC'
  );
  return linhas;
}

async function criar(dados) {
  const { nome, email, telefone } = validarAluno(dados);
  const [resultado] = await pool.execute(
    'INSERT INTO alunos (nome, email, telefone) VALUES (?, ?, ?)',
    [nome, email, telefone]
  );
  return { id: resultado.insertId };
}

async function atualizar(dados) {
  validarId(dados?.id);
  const { nome, email, telefone } = validarAluno(dados);
  const [r] = await pool.execute(
    'UPDATE alunos SET nome = ?, email = ?, telefone = ? WHERE id = ?',
    [nome, email, telefone, dados.id]
  );
  if (!r.affectedRows) falhar('Aluno não encontrado.');
}

async function excluir(id) {
  validarId(id);
  const [r] = await pool.execute(
    'DELETE FROM alunos WHERE id = ?', [id]
  );
  if (!r.affectedRows) falhar('Aluno não encontrado.');
  return { id };
}

function fechar() { return pool.end(); }

// Funções para cursos
function validarCurso(dados) {
  const nome = typeof dados?.nome === 'string' ? dados.nome.trim() : '';
  const carga_horaria = typeof dados?.carga_horaria === 'number' ? dados.carga_horaria : null;
  const descricao = typeof dados?.descricao === 'string' ? dados.descricao.trim() : '';
  if (!nome || nome.length > 100) falhar('Nome inválido.');
  if (!carga_horaria || carga_horaria <= 0 || carga_horaria > 10000) falhar('Carga horária inválida.');
  return { nome, carga_horaria, descricao };
}

async function listarCursos() {
  const [linhas] = await pool.execute(
    'SELECT id, nome, carga_horaria, descricao FROM cursos ORDER BY id DESC'
  );
  return linhas;
}

async function criarCurso(dados) {
  const { nome, carga_horaria, descricao } = validarCurso(dados);
  const [resultado] = await pool.execute(
    'INSERT INTO cursos (nome, carga_horaria, descricao) VALUES (?, ?, ?)',
    [nome, carga_horaria, descricao]
  );
  return { id: resultado.insertId };
}

async function atualizarCurso(dados) {
  validarId(dados?.id);
  const { nome, carga_horaria, descricao } = validarCurso(dados);
  const [r] = await pool.execute(
    'UPDATE cursos SET nome = ?, carga_horaria = ?, descricao = ? WHERE id = ?',
    [nome, carga_horaria, descricao, dados.id]
  );
  if (!r.affectedRows) falhar('Curso não encontrado.');
}

async function excluirCurso(id) {
  validarId(id);
  const [r] = await pool.execute(
    'DELETE FROM cursos WHERE id = ?', [id]
  );
  if (!r.affectedRows) falhar('Curso não encontrado.');
  return { id };
}

// Funções para matrículas
function validarMatricula(dados) {
  const aluno_id = typeof dados?.aluno_id === 'number' ? dados.aluno_id : null;
  const curso_id = typeof dados?.curso_id === 'number' ? dados.curso_id : null;
  const data_matricula = typeof dados?.data_matricula === 'string' ? dados.data_matricula : '';
  if (!aluno_id || aluno_id <= 0) falhar('Aluno inválido.');
  if (!curso_id || curso_id <= 0) falhar('Curso inválido.');
  if (!data_matricula) falhar('Data da matrícula inválida.');
  return { aluno_id, curso_id, data_matricula };
}

async function listarMatriculas() {
  const [linhas] = await pool.execute(
    `SELECT m.id, m.aluno_id, a.nome as aluno_nome, m.curso_id, c.nome as curso_nome, m.data_matricula
     FROM matriculas m
     JOIN alunos a ON m.aluno_id = a.id
     JOIN cursos c ON m.curso_id = c.id
     ORDER BY m.id DESC`
  );
  return linhas;
}

async function criarMatricula(dados) {
  const { aluno_id, curso_id, data_matricula } = validarMatricula(dados);
  const [resultado] = await pool.execute(
    'INSERT INTO matriculas (aluno_id, curso_id, data_matricula) VALUES (?, ?, ?)',
    [aluno_id, curso_id, data_matricula]
  );
  return { id: resultado.insertId };
}

async function excluirMatricula(id) {
  validarId(id);
  const [r] = await pool.execute(
    'DELETE FROM matriculas WHERE id = ?', [id]
  );
  if (!r.affectedRows) falhar('Matrícula não encontrada.');
  return { id };
}

async function listarAlunosParaSelect() {
  const [linhas] = await pool.execute(
    'SELECT id, nome FROM alunos ORDER BY nome ASC'
  );
  return linhas;
}

async function listarCursosParaSelect() {
  const [linhas] = await pool.execute(
    'SELECT id, nome FROM cursos ORDER BY nome ASC'
  );
  return linhas;
}

module.exports = {
  listar, criar, atualizar, excluir, autenticar, fechar,
  listarCursos, criarCurso, atualizarCurso, excluirCurso,
  listarMatriculas, criarMatricula, excluirMatricula,
  listarAlunosParaSelect, listarCursosParaSelect
};
