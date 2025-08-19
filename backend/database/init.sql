create database bancomindu;
use bancomindu;

CREATE TABLE planos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco_por_funcionario DECIMAL(10, 2) NOT NULL,
    duracao INT NOT NULL,
    CONSTRAINT UNIQUE (nome)
);
CREATE TABLE `cadastroempresa` (
    `ID` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(20) NOT NULL,
    `empresa` varchar(100) not null,
    `departamento` VARCHAR(100) NOT NULL,
    `qtdfuncionarios` INT NOT NULL,	
    `planosaude` VARCHAR(100) NOT NULL,
    `contato` VARCHAR(100) NOT NULL,
    `foto_perfil` VARCHAR(255),
    `pergunta_seguranca` VARCHAR(300) NULL,
    `resposta_seguranca` VARCHAR(100) NULL,
    `senha` VARCHAR(255) NOT NULL
);
CREATE TABLE `contaFuncionarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `login` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `empresa_id` INT NOT NULL,
    `nomePlano` VARCHAR(100) NOT NULL,
    `cpf` VARCHAR(11) NULL,
    `nome` VARCHAR(75) NULL,
    `cargo` VARCHAR(50) NULL,
    `telefone` VARCHAR(20) NULL,
    `pergunta_seguranca` VARCHAR(300) NULL,
    `resposta_seguranca` VARCHAR(100) NULL,
    `foto_perfil` VARCHAR(255),
    `loginMethod` ENUM('login_temporario', 'email') NOT NULL DEFAULT 'login_temporario',
    CONSTRAINT `fk_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `cadastroempresa`(`ID`) ON DELETE CASCADE,
    CONSTRAINT `fk_plano` FOREIGN KEY (`nomePlano`) REFERENCES `planos`(`nome`) ON DELETE CASCADE ON UPDATE CASCADE
);
 
CREATE TABLE `psicologos` (
    `psicologo_id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `dataNascimento` DATE NOT NULL,
    `genero` ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    `telefone` VARCHAR(20),
    `email` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `endereco` TEXT,
    `crp` VARCHAR(255),
    `certificados` BLOB,
    `especialidade` TEXT,
    `preferenciaHorario` VARCHAR(255),
    `disponibilidade` ENUM('Remoto', 'Presencial', 'Híbrido') NOT NULL,
    `localizacao` TEXT,
    `motivacao` TEXT,
    `objetivos` TEXT,
    `foto_perfil` VARCHAR(255) NULL, 
	`biografia` VARCHAR(355) NULL, 
	`especificidade` VARCHAR(255) NULL, 
    `pergunta_seguranca` VARCHAR(300) NULL,
    `resposta_seguranca` VARCHAR(100) NULL
);

CREATE TABLE `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `login` VARCHAR(50) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `tipo_usuario` ENUM('psicologo', 'empresa', 'funcionario') NOT NULL,
    `id_referencia` INT NOT NULL,  -- ID na tabela de referência (psicologos, empresas ou contaFuncionarios)
    UNIQUE(`login`)
);
-- DELIMITER //
-- CREATE TRIGGER before_insert_contaFuncionarios
-- BEFORE INSERT ON contaFuncionarios
-- FOR EACH ROW
-- BEGIN
    -- Gera o UUID para o campo login
--    SET NEW.login = SUBSTRING(UUID(), 1, 23);
    -- Gera uma senha aleatória de 12 caracteres
--    SET NEW.senha = CONCAT(
--        SUBSTRING(MD5(RAND()), 1, 6), 
--        SUBSTRING(MD5(RAND()), 1, 6)
--   -- );
-- END; //
-- DELIMITER ;
DELIMITER //
CREATE TRIGGER before_insert_contaFuncionarios
BEFORE INSERT ON contaFuncionarios
FOR EACH ROW
BEGIN
  IF NEW.login IS NULL OR NEW.login = '' THEN
    SET NEW.login = SUBSTRING(UUID(), 1, 23);
  END IF;
  
  IF NEW.senha IS NULL OR NEW.senha = '' THEN
    SET NEW.senha = CONCAT(
      SUBSTRING(MD5(RAND()), 1, 6), 
      SUBSTRING(MD5(RAND()), 1, 6)
    );
  END IF;
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_psicologo_insert
AFTER INSERT ON `psicologos`
FOR EACH ROW
BEGIN
    INSERT INTO `usuarios` (`login`, `senha`, `tipo_usuario`, `id_referencia`)
    VALUES (NEW.email, NEW.senha, 'psicologo', NEW.psicologo_id);
END; //
DELIMITER ;
DELIMITER //
CREATE TRIGGER after_cadastroempresa_insert
AFTER INSERT ON `cadastroempresa`
FOR EACH ROW
BEGIN
    INSERT INTO `usuarios` (`login`, `senha`, `tipo_usuario`, `id_referencia`)
    VALUES (NEW.email, NEW.senha, 'empresa', NEW.ID);
END; //
DELIMITER ;
DELIMITER //
CREATE TRIGGER after_funcionario_insert
AFTER INSERT ON `contaFuncionarios`
FOR EACH ROW
BEGIN
    INSERT INTO `usuarios` (`login`, `senha`, `tipo_usuario`, `id_referencia`)
    VALUES (NEW.login, NEW.senha, 'funcionario', NEW.ID);
END; //
DELIMITER ;

CREATE TABLE disponibilidadepsico (
    disponibilidade_id INT AUTO_INCREMENT PRIMARY KEY,
    psicologo_id INT NOT NULL,
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NULL
);

    CREATE TABLE agendamentos (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` INT NULL,
    `psicologo_id` INT NOT NULL,
    `data` DATE NOT NULL,
    `horario_inicio` TIME NOT NULL,
    `tipo` VARCHAR(50), 
    `assunto` TEXT,
	`nome_paciente` VARCHAR(255) NOT NULL,
    FOREIGN KEY (psicologo_id) REFERENCES psicologos(psicologo_id)
);
DELIMITER //
CREATE TRIGGER after_delete_cadastroempresa
AFTER DELETE ON `cadastroempresa`
FOR EACH ROW
BEGIN
    DELETE FROM `usuarios` WHERE `tipo_usuario` = 'empresa' AND `id_referencia` = OLD.ID;
END; //
DELIMITER ;
DELIMITER //
CREATE TRIGGER after_delete_psicologo
AFTER DELETE ON `psicologos`
FOR EACH ROW
BEGIN
    DELETE FROM `usuarios` WHERE `tipo_usuario` = 'psicologo' AND `id_referencia` = OLD.psicologo_id;
END; //
DELIMITER ;
DELIMITER //
CREATE TRIGGER after_delete_contaFuncionarios
AFTER DELETE ON `contaFuncionarios`
FOR EACH ROW
BEGIN
    DELETE FROM `usuarios` WHERE `tipo_usuario` = 'funcionario' AND `id_referencia` = OLD.id;
END; //
DELIMITER ;
DELIMITER //
CREATE TRIGGER after_update_cadastroempresa
AFTER UPDATE ON `cadastroempresa`
FOR EACH ROW
BEGIN
    UPDATE `usuarios`
    SET `login` = NEW.email, `senha` = NEW.senha
    WHERE `tipo_usuario` = 'empresa' AND `id_referencia` = NEW.ID;
END; //
DELIMITER ;
DELIMITER //
CREATE TRIGGER after_update_psicologos
AFTER UPDATE ON `psicologos`
FOR EACH ROW
BEGIN
    UPDATE `usuarios`
    SET `login` = NEW.email, `senha` = NEW.senha
    WHERE `tipo_usuario` = 'psicologo' AND `id_referencia` = NEW.psicologo_id;
END; //
DELIMITER ;
DELIMITER //
CREATE TRIGGER after_update_contaFuncionarios
AFTER UPDATE ON `contaFuncionarios`
FOR EACH ROW
BEGIN
    UPDATE `usuarios`
    SET `login` = NEW.login, `senha` = NEW.senha
    WHERE `tipo_usuario` = 'funcionario' AND `id_referencia` = NEW.id;
END; //
DELIMITER ;
INSERT INTO planos (nome, preco_por_funcionario, duracao) VALUES
('Bem-Estar', 250.00, 1),   
('Equilíbrio', 310.00, 1),
('Transformação', 600.00, 1);
CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_plano INT NOT NULL,
    data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    qtd_funcionarios INT NOT NULL, 
    FOREIGN KEY (id_plano) REFERENCES planos(id)
);

 
INSERT INTO psicologos (nome, dataNascimento, especialidade, localizacao, crp, telefone, email, CPF, senha, endereco, certificados, preferenciaHorario, disponibilidade, motivacao, objetivos, biografia, especificidade)
VALUES ('Usuário Demo', '2000-01-01', 'Psicólogo Psicanalista', 'São Paulo - SP', '111111 / CRP - 4ª Região', '11111111111', 'psicologo', '12345678900', '$2b$10$aJB28wSVkQ1S2Q3bslAzd.GIS6OJjw/lN6SWRBD5Dc06WNJoK/Yo6', 'Rua A, 123', NULL, '08:00-12:00', 'Remoto', 'Ajudar as pessoas', 'Ajudar meus pacientes a se desenvolverem.', 'Sou Psicóloga pela Universidade Paulista, atuo com a abordagem Psicanalítica. Tenho experiência com atendimento psicológico de pessoas que estão passando pela depressão, transtorno de ansiedade, conflitos amorosos, conflitos familiares e problemas de autoestima.', 'Depressão, Ansiedade, TEA, Relacionamentos');

INSERT INTO cadastroempresa (nome, email, telefone, empresa, departamento, qtdfuncionarios, planosaude, contato, senha)
VALUES ('Usuario', 'empresa', '11111111111', 'empresa', 'x', '5000', 'x', 'email', '$2b$10$aJB28wSVkQ1S2Q3bslAzd.GIS6OJjw/lN6SWRBD5Dc06WNJoK/Yo6');

INSERT INTO contafuncionarios (login, senha, empresa_id, nomePlano)
VALUES ('funcionario', 'senha', '1', 'Equilíbrio');
