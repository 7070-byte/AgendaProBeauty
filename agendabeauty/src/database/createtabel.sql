USE projeto_agenda_db;

CREATE TABLE
IF NOT EXISTS usuarios
(
 id INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR
(100) NOT NULL,
 email VARCHAR
(150) NOT NULL UNIQUE,
 telefone VARCHAR
(20),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_usuarios_nome
(nome)
);

CREATE TABLE
IF NOT EXISTS profissionais
(
 id INT AUTO_INCREMENT PRIMARY KEY,
 profissional_nome VARCHAR
(100) NOT NULL,
 especialidade VARCHAR
(100) NOT NULL,
 usuarios_id INT DEFAULT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_profissionais_nome
(profissional_nome),
 FOREIGN KEY
(usuarios_id) REFERENCES usuarios
(id) ON
DELETE CASCADE
);

create table
if not exists servicos
(
 id int auto_increment primary key,
 profissional_nome varchar (100) not null,
 nome varchar (100) not null,
 area varchar (100) not null,
 duracao int not null,
 CONSTRAINT chk_duracao_minima CHECK
(duracao >= 60),
 preco decimal
(10, 2) not null,
 created_at timestamp default current_timestamp,
 unique key uq_servicos_nome
(nome),
 foreign key
(profissional_nome) references profissionais
(profissional_nome) on
delete cascade
);

create table
if not exists agendamentos
(
 id int auto_increment primary key,
 profissional_nome varchar
(100) not null,
 usuario_nome varchar
(100) not null,
 servico_nome varchar
(100) not null,
 data_hora datetime not null,
 status varchar
(20) default 'agendado',
 created_at timestamp default current_timestamp,
 foreign key
(profissional_nome) references profissionais
(profissional_nome) on
delete cascade,
 foreign key (usuario_nome)
references usuarios
(nome) on
delete cascade,
 foreign key (servico_nome)
references servicos
(nome) on
delete cascade
);

create table
if not exists agenda_horarios_trabalho
(
 id int auto_increment primary key,
 profissional_nome varchar
(100) not null,
 dia_semana tinyint not null,
 hora_inicio time not null,
 hora_fim time not null,
 created_at timestamp default current_timestamp,
 unique key uq_agenda_horario_profissional_dia
(profissional_nome, dia_semana),
 constraint chk_agenda_dia_semana check
(dia_semana between 1 and 6),
 constraint chk_agenda_horario_valido check
(hora_inicio < hora_fim),
 foreign key
(profissional_nome) references profissionais
(profissional_nome) on
delete cascade
);

create table
if not exists agenda_bloqueios
(
 id int auto_increment primary key,
 profissional_nome varchar
(100) not null,
 data_inicio datetime not null,
 data_fim datetime not null,
 motivo varchar
(255),
 created_at timestamp default current_timestamp,
 constraint chk_agenda_bloqueio_valido check
(data_inicio < data_fim),
 foreign key
(profissional_nome) references profissionais
(profissional_nome) on
delete cascade
);