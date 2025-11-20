CREATE DATABASE saepsaude;
USE saepsaude;

CREATE TABLE empresa(
id_empresa INT PRIMARY KEY auto_increment not null,
nome_empresa VARCHAR(30) UNIQUE not null,
logo_url VARCHAR(255) not null,
total_calorias INT not null,
total_atividades INT NOT NULL DEFAULT 0
);

CREATE TABLE usuarios(
id_usuario INT PRIMARY KEY auto_increment not null,
nome_usuario VARCHAR(100) not null,
email_usuario VARCHAR(50) UNIQUE not null,
senha_usuario VARCHAR(60) not null,
avatar_url VARCHAR(255) null,
data_criacao DATETIME not null default now()
);

CREATE TABLE atividades(
id_atividade INT PRIMARY KEY auto_increment not null,
id_usuario INT not null,
distancia_metros INT not null,
duracao_minutos INT not null,
calorias VARCHAR(100) not null,
titulo VARCHAR(50) not null,
tipo_atividade  ENUM('corrida',
'caminhada','trilha') not null,
data_criacao DATETIME not null default now(),
 
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE likes(
id_like INT PRIMARY KEY auto_increment not null,
id_usuario INT not null,
id_atividade INT not null,
avatar_url VARCHAR(100) null,
data_criacao DATETIME not null default now(),

FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
FOREIGN KEY (id_atividade) REFERENCES atividades(id_atividade)
);

CREATE TABLE comentarios(
id_comentario INT PRIMARY KEY auto_increment not null,
id_usuario INT not null,
id_atividade INT not null,
texto VARCHAR(500),
data_criacao DATETIME not null default now(),

FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
FOREIGN KEY (id_atividade) REFERENCES atividades(id_atividade)
);

INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario)
VALUES (
    'exeemplo',
    'exemplo@example.com',
    '1234567'
);


