-- Deleta banco de dados se existir
DROP DATABASE sistema_electron;
-- Cria banco de dados se não existir
CREATE DATABASE IF NOT EXISTS sistema_electron
CHARACTER SET utf8mb4 -- codificação UTF-8 de 4 bytes
COLLATE utf8mb4_unicode_ci; -- collation case-insensitive
USE sistema_electron; -- seleciona o banco

CREATE TABLE IF NOT EXISTS usuarios (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
usuario VARCHAR(100) NOT NULL UNIQUE,
senha CHAR(32) CHARACTER SET ascii
COLLATE ascii_bin NOT NULL
);

-- Execute uma vez, em ambiente de aula.
INSERT INTO usuarios (usuario, senha)
VALUES ('admin', MD5('Aula@123'));
-- O aplicativo precisa consultar a nova tabela.
GRANT SELECT ON sistema_electron.usuarios
TO 'crud_app'@'localhost';
SELECT id, usuario FROM usuarios;

-- Cria tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- ID auto-increment
nome VARCHAR(100) NOT NULL, -- nome obrigatório até 100 chars
email VARCHAR(150) NOT NULL UNIQUE, -- email obrigatório único até 150 chars
telefone VARCHAR(15) NOT NULL -- Telefone com até 15 caracteres
);

-- Insere alunos de teste
INSERT INTO alunos (nome, email, telefone)
VALUES
('Ana Silva', 'ana@example.com', '11987654321'),
('Lucas Oliveira', 'lucas.oliveira@example.com', '11987654322'),
('Mariana Costa', 'mariana.costa@example.com', '11987654323'),
('Pedro Santos', 'pedro.santos@example.com', '11987654324'),
('Beatriz Souza', 'beatriz.souza@example.com', '11987654325'),
('Gabriel Rodrigues', 'gabriel.rodrigues@example.com', '11987654326');

-- Mostra alunos inseridos
SELECT id, nome, email, telefone FROM alunos;

-- Cria usuário MySQL para a aplicação
CREATE USER IF NOT EXISTS
'crud_app'@'localhost' -- usuário só pode conectar de localhost
IDENTIFIED BY 'senacrs'; -- senha do usuário
GRANT SELECT, INSERT, UPDATE, DELETE -- concede permissões CRUD
ON sistema_electron.alunos -- apenas na tabela alunos
TO 'crud_app'@'localhost'; -- para o usuário criado
