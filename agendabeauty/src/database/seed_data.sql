USE projeto_agenda_db;

INSERT IGNORE INTO usuarios
    (nome, email, telefone)
VALUES
    ('Fulana', 'joao@example.com', '123456789'),
    ('Marta', 'maria@example.com', '987654321');

INSERT INTO profissionais
    (profissional_nome, especialidade)
VALUES
    ('João da Silva', 'Cabeleireiro'),
    ('Maria Oliveira', 'Manicure'),
    ('Ana Souza', 'Cabeleireira')
ON DUPLICATE KEY UPDATE especialidade = VALUES(especialidade);

INSERT INTO servicos
    (profissional_nome, nome, area, duracao, preco)
VALUES
    ('João da Silva', 'Corte de Cabelo', 'Local 1', 60, 50.00),
    ('João da Silva', 'Coloração', 'Local 2', 60, 150.00),
    ('Maria Oliveira', 'Manicure Simples', 'Local 3', 80, 30.00),
    ('Maria Oliveira', 'Manicure Completa', 'Local 4', 80, 60.00),
    ('Ana Souza', 'Corte Feminino', 'Local 5', 60, 70.00)
ON DUPLICATE KEY UPDATE
    profissional_nome = VALUES(profissional_nome),
    area = VALUES(area),
    duracao = VALUES(duracao),
    preco = VALUES(preco);

INSERT INTO agendamentos
    (profissional_nome, usuario_nome, servico_nome, data_hora)
VALUES
    ('João da Silva', 'Fulana', 'Corte de Cabelo', '2024-07-01 10:00:00'),
    ('Maria Oliveira', 'Marta', 'Manicure Simples', '2024-07-01 11:00:00')
ON DUPLICATE KEY UPDATE
    profissional_nome = VALUES(profissional_nome),
    usuario_nome = VALUES(usuario_nome),
    servico_nome = VALUES(servico_nome),
    data_hora = VALUES(data_hora);