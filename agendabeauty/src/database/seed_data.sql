USE projeto_agenda_db;

INSERT INTO usuarios (nome, email, telefone) VALUES
('Fulana', 'joao@example.com', '123456789'),
('Marta', 'maria@example.com', '987654321');

INSERT INTO profissionais (profissional_nome, especialidade) VALUES
('João da Silva', 'Cabeleireiro'),
('Maria Oliveira', 'Manicure');

INSERT INTO servicos (profissional_nome, nome, duracao, preco) VALUES
('João da Silva', 'Corte de Cabelo', 60, 50.00),
('João da Silva', 'Coloração', 60, 150.00),
('Maria Oliveira', 'Manicure Simples', 80, 30.00),
('Maria Oliveira', 'Manicure Completa', 80, 60.00);

INSERT INTO agendamentos (profissional_nome, usuario_nome, servico_nome, data_hora) VALUES
('João da Silva', 'Fulana', 'Corte de Cabelo', '2024-07-01 10:00:00'),
('Maria Oliveira', 'Marta', 'Manicure Simples', '2024-07-01 11:00:00');