-- ============================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS: healthy_safely
-- Padrão MVC + MySQL2 (Prof. Giovani Wingter)
--
-- Como executar:
--   mysql -u root -p < app/database/schema.sql
--   (MySQL Workbench: Ctrl+Shift+Enter)
-- ============================================================

CREATE DATABASE IF NOT EXISTS healthy_safely
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE healthy_safely;

-- ============================================================
-- TABELA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  nomeusuario  VARCHAR(50)  UNIQUE,
  email        VARCHAR(150) NOT NULL UNIQUE,
  senha        VARCHAR(255) NOT NULL,
  tipo         ENUM('cliente','profissional') NOT NULL DEFAULT 'cliente',
  nivel        VARCHAR(50)  DEFAULT 'iniciante',
  pontos       INT          DEFAULT 0,
  foto_perfil  VARCHAR(255) DEFAULT NULL,
  criado_em    DATETIME     DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABELA: profissionais (dados extras do profissional)
-- ============================================================
CREATE TABLE IF NOT EXISTS profissionais (
  id                INT  AUTO_INCREMENT PRIMARY KEY,
  usuario_id        INT  NOT NULL UNIQUE,
  cref              VARCHAR(30)  DEFAULT NULL,
  area_atuacao      VARCHAR(100) DEFAULT NULL,
  tempo_experiencia INT          DEFAULT 0,
  especialidades    TEXT         DEFAULT NULL,
  disponivel        TINYINT(1)   DEFAULT 1,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABELA: tarefas
-- ============================================================
CREATE TABLE IF NOT EXISTS tarefas (
  id          INT  AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT  NOT NULL,
  titulo      VARCHAR(200) NOT NULL,
  descricao   TEXT         DEFAULT NULL,
  pontos      INT          DEFAULT 10,
  concluida   TINYINT(1)   DEFAULT 0,
  concluida_em DATETIME    DEFAULT NULL,
  categoria   ENUM('saude','sono','alimentacao','exercicio','geral') DEFAULT 'geral',
  criado_em   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABELA: tarefas_padrao (templates para novos clientes)
-- ============================================================
CREATE TABLE IF NOT EXISTS tarefas_padrao (
  id        INT  AUTO_INCREMENT PRIMARY KEY,
  titulo    VARCHAR(200) NOT NULL,
  pontos    INT          DEFAULT 10,
  categoria ENUM('saude','sono','alimentacao','exercicio','geral') DEFAULT 'geral'
);

INSERT IGNORE INTO tarefas_padrao (id, titulo, pontos, categoria) VALUES
  (1, 'Beber água (2L)',                  10, 'saude'),
  (2, 'Dormir bem (8h)',                  15, 'sono'),
  (3, 'Fazer exercício físico',           20, 'exercicio'),
  (4, 'Comer frutas e vegetais',          10, 'alimentacao'),
  (5, 'Meditar por 10 minutos',           15, 'saude'),
  (6, 'Evitar telas 1h antes de dormir', 10, 'sono'),
  (7, 'Caminhar 30 minutos',             15, 'exercicio');

-- ============================================================
-- TABELA: vinculos (paciente ↔ profissional)
-- ============================================================
CREATE TABLE IF NOT EXISTS vinculos (
  id               INT  AUTO_INCREMENT PRIMARY KEY,
  paciente_id      INT  NOT NULL,
  profissional_id  INT  NOT NULL,
  status           ENUM('solicitado','ativo','encerrado') DEFAULT 'solicitado',
  criado_em        DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unico_vinculo (paciente_id, profissional_id),
  FOREIGN KEY (paciente_id)     REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (profissional_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABELA: registros_sono
-- ============================================================
CREATE TABLE IF NOT EXISTS registros_sono (
  id             INT  AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT  NOT NULL,
  horas_dormidas DECIMAL(4,1) NOT NULL,
  qualidade      TINYINT      DEFAULT 3,
  data           DATE         DEFAULT (CURDATE()),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABELA: notificacoes
-- ============================================================
CREATE TABLE IF NOT EXISTS notificacoes (
  id         INT  AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT  NOT NULL,
  mensagem   VARCHAR(500) NOT NULL,
  lida       TINYINT(1)   DEFAULT 0,
  criado_em  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABELA: amizades
-- ============================================================
CREATE TABLE IF NOT EXISTS amizades (
  id             INT  AUTO_INCREMENT PRIMARY KEY,
  solicitante_id INT  NOT NULL,
  receptor_id    INT  NOT NULL,
  status         ENUM('pendente','aceita','recusada') DEFAULT 'pendente',
  criado_em      DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unico_par (solicitante_id, receptor_id),
  FOREIGN KEY (solicitante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (receptor_id)   REFERENCES usuarios(id) ON DELETE CASCADE
);
