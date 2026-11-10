const path = require('node:path');
const { createHash } = require('node:crypto');
require('dotenv').config({
  path: path.join(__dirname, '../../.env'), quiet: true
});
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'escola_app',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'escola_electron_simples',
  charset: 'utf8mb4',
  connectionLimit: 3,
  connectTimeout: 5000
});

function erroValidacao(mensagem) {
  const erro = new Error(mensagem);
  erro.code = 'VALIDACAO';
  throw erro;
}

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function numero(valor) {
  return typeof valor === 'number' ? valor : Number(texto(valor));
}

function validarId(id, mensagem = 'Identificador inválido.') {
  if (!Number.isInteger(id) || id < 1 || id > 4294967295) {
    erroValidacao(mensagem);
  }
  return id;
}

function falhar(texto) {
  erroValidacao(texto);
}

function validarAluno(dados) {
  const nome = texto(dados?.nome);
  const email = texto(dados?.email);
  const telefone = texto(dados?.telefone);
  if (!nome || nome.length > 100) erroValidacao('Nome inválido.');
  if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    erroValidacao('E-mail inválido.');
  }
  if (!telefone || telefone.length > 20) erroValidacao('Telefone inválido.');
  return { nome, email, telefone };
}

async function autenticar(dados) {
  const usuario = texto(dados?.usuario);
  const senha = texto(dados?.senha);
  if (!usuario || usuario.length > 100 ||
    !senha || senha.length > 128) {
    erroValidacao('Informe usuário e senha válidos.');
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
    erroValidacao('Usuário ou senha inválidos.');
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
  if (!r.affectedRows) erroValidacao('Aluno não encontrado.');
}

async function excluir(id) {
  validarId(id);
  const [r] = await pool.execute(
    'DELETE FROM alunos WHERE id = ?', [id]
  );
  if (!r.affectedRows) erroValidacao('Aluno não encontrado.');
  return { id };
}

function fechar() { return pool.end(); }

// Funções para cursos
function validarCurso(dados) {
  const nome = texto(dados?.nome);
  const carga_horaria = numero(dados?.carga_horaria);
  const descricao = texto(dados?.descricao);
  if (!nome || nome.length > 100) erroValidacao('Nome inválido.');
  if (!carga_horaria || carga_horaria <= 0 || carga_horaria > 4294967295) erroValidacao('Carga horária inválida.');
  if (descricao.length > 2000) erroValidacao('Descrição muito longa (máximo 2000 caracteres).');
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
  if (!r.affectedRows) erroValidacao('Curso não encontrado.');
}

async function excluirCurso(id) {
  validarId(id);
  const [r] = await pool.execute(
    'DELETE FROM cursos WHERE id = ?', [id]
  );
  if (!r.affectedRows) erroValidacao('Curso não encontrado.');
  return { id };
}

// Funções para matrículas
function validarMatricula(dados) {
  const aluno_id = numero(dados?.aluno_id);
  const curso_id = numero(dados?.curso_id);
  const data_matricula = texto(dados?.data_matricula);
  if (!aluno_id || aluno_id <= 0) erroValidacao('Aluno inválido.');
  if (!curso_id || curso_id <= 0) erroValidacao('Curso inválido.');
  if (!data_matricula) erroValidacao('Data da matrícula inválida.');
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
  if (!r.affectedRows) erroValidacao('Matrícula não encontrada.');
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
