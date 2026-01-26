-- Script para popular tabela Prayer com dados de teste
-- Execute este script no MySQL para adicionar orações de exemplo

-- Orações normais (pessoa orando por si mesma)
INSERT INTO Prayer (id, name, email, prayer, prayerForOther, otherPersonName, createdAt, updatedAt)
VALUES
  (UUID(), 'Maria Silva', 'maria@email.com', 'Senhor, peço por sabedoria em minhas decisões de trabalho. Preciso de orientação neste momento difícil.', FALSE, NULL, NOW(), NOW()),
  (UUID(), 'João Santos', 'joao@email.com', 'Pai celestial, agradeço pelas bênçãos e peço por saúde para minha família.', FALSE, NULL, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY),
  (UUID(), 'Ana Paula', 'ana@email.com', 'Deus, preciso de força para superar este momento de ansiedade. Confio em Ti.', FALSE, NULL, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
  (UUID(), 'Carlos Eduardo', NULL, 'Senhor, peço por proteção na minha viagem e que tudo corra bem.', FALSE, NULL, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
  (UUID(), 'Juliana Costa', 'juliana@email.com', 'Pai, intercedo por provisão financeira. Sei que o Senhor cuida de mim.', FALSE, NULL, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
  (UUID(), 'Pedro Henrique', 'pedro@email.com', 'Deus, agradeço por mais um dia e peço sabedoria para educar meus filhos.', FALSE, NULL, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),
  (UUID(), 'Fernanda Lima', NULL, 'Senhor Jesus, fortalece minha fé e me ajuda a confiar mais em Ti.', FALSE, NULL, NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY),
  (UUID(), 'Ricardo Souza', 'ricardo@email.com', 'Pai celestial, peço por cura emocional e paz no coração.', FALSE, NULL, NOW() - INTERVAL 12 DAY, NOW() - INTERVAL 12 DAY),
  (UUID(), 'Camila Oliveira', 'camila@email.com', 'Senhor, abençoe meu novo emprego e me dê competência para realizar bem minhas tarefas.', FALSE, NULL, NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 15 DAY),
  (UUID(), 'Roberto Alves', NULL, 'Deus, agradeço pela salvação e peço para que o Senhor me use como instrumento de benção.', FALSE, NULL, NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 20 DAY);

-- Orações por outras pessoas
INSERT INTO Prayer (id, name, email, prayer, prayerForOther, otherPersonName, createdAt, updatedAt)
VALUES
  (UUID(), 'Mariana Souza', 'mariana@email.com', 'Peço pela cura completa da minha mãe que está no hospital. Que Deus toque nela com Seu poder.', TRUE, 'Dona Aparecida', NOW(), NOW()),
  (UUID(), 'Paulo Roberto', 'paulo@email.com', 'Senhor, intercedo pelo meu irmão que está desempregado. Abra portas de trabalho para ele.', TRUE, 'Lucas Roberto', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY),
  (UUID(), 'Luciana Ferreira', NULL, 'Pai, peço pela conversão do meu esposo. Que ele conheça o Senhor.', TRUE, 'Marcos Ferreira', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
  (UUID(), 'Anderson Silva', 'anderson@email.com', 'Deus, intercedo pela minha filha que vai fazer uma cirurgia. Proteja-a.', TRUE, 'Beatriz Silva', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
  (UUID(), 'Patrícia Gomes', 'patricia@email.com', 'Senhor, peço por sabedoria para minha amiga que está passando por divórcio.', TRUE, 'Renata', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY),
  (UUID(), 'Gabriel Martins', NULL, 'Pai celestial, intercedo pelo meu pastor que está doente. Restaure sua saúde.', TRUE, 'Pastor João', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY),
  (UUID(), 'Tatiana Ribeiro', 'tatiana@email.com', 'Senhor, peço pela libertação espiritual da minha irmã.', TRUE, 'Carolina Ribeiro', NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY),
  (UUID(), 'Marcelo Costa', 'marcelo@email.com', 'Deus, intercedo pelo meu colega de trabalho que perdeu um familiar.', TRUE, 'Rodrigo', NOW() - INTERVAL 11 DAY, NOW() - INTERVAL 11 DAY),
  (UUID(), 'Vanessa Santos', NULL, 'Pai, peço por cura emocional para minha prima que está em depressão.', TRUE, 'Isabela', NOW() - INTERVAL 14 DAY, NOW() - INTERVAL 14 DAY),
  (UUID(), 'Bruno Carvalho', 'bruno@email.com', 'Senhor, intercedo pelo bebê prematuro da minha vizinha. Fortaleça-o.', TRUE, 'Miguel', NOW() - INTERVAL 18 DAY, NOW() - INTERVAL 18 DAY),
  (UUID(), 'Adriana Pinto', 'adriana@email.com', 'Deus, peço pela restauração do casamento dos meus pais.', TRUE, 'José e Rosa', NOW() - INTERVAL 21 DAY, NOW() - INTERVAL 21 DAY),
  (UUID(), 'Felipe Rocha', NULL, 'Pai celestial, intercedo pelo meu sobrinho que está com câncer. Cure-o completamente.', TRUE, 'Pedro Paulo', NOW() - INTERVAL 25 DAY, NOW() - INTERVAL 25 DAY);

-- Orações adicionais (variedade de datas do mês atual)
INSERT INTO Prayer (id, name, email, prayer, prayerForOther, otherPersonName, createdAt, updatedAt)
VALUES
  (UUID(), 'Renato Lima', 'renato@email.com', 'Senhor, dá-me paciência e amor para lidar com as situações difíceis.', FALSE, NULL, DATE_SUB(LAST_DAY(NOW()), INTERVAL 29 DAY), DATE_SUB(LAST_DAY(NOW()), INTERVAL 29 DAY)),
  (UUID(), 'Silvia Mendes', NULL, 'Pai, peço por minha filha que está estudando para concurso.', TRUE, 'Amanda', DATE_SUB(LAST_DAY(NOW()), INTERVAL 25 DAY), DATE_SUB(LAST_DAY(NOW()), INTERVAL 25 DAY)),
  (UUID(), 'Thiago Nunes', 'thiago@email.com', 'Deus, fortalece minha igreja e nosso pastor. Abençoe nosso ministério.', FALSE, NULL, DATE_SUB(LAST_DAY(NOW()), INTERVAL 20 DAY), DATE_SUB(LAST_DAY(NOW()), INTERVAL 20 DAY)),
  (UUID(), 'Letícia Barros', 'leticia@email.com', 'Senhor, intercedo pelos missionários ao redor do mundo.', TRUE, 'Missionários', DATE_SUB(LAST_DAY(NOW()), INTERVAL 15 DAY), DATE_SUB(LAST_DAY(NOW()), INTERVAL 15 DAY)),
  (UUID(), 'Diego Farias', NULL, 'Pai, agradeço pela provisão diária e peço por mais fé.', FALSE, NULL, DATE_SUB(LAST_DAY(NOW()), INTERVAL 10 DAY), DATE_SUB(LAST_DAY(NOW()), INTERVAL 10 DAY)),
  (UUID(), 'Bruna Cardoso', 'bruna@email.com', 'Deus, peço pela recuperação do meu avô internado na UTI.', TRUE, 'Sr. Antônio', DATE_SUB(LAST_DAY(NOW()), INTERVAL 5 DAY), DATE_SUB(LAST_DAY(NOW()), INTERVAL 5 DAY)),
  (UUID(), 'Gustavo Pereira', 'gustavo@email.com', 'Senhor, guia minha vida segundo Tua vontade perfeita.', FALSE, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (UUID(), 'Raquel Monteiro', NULL, 'Pai, intercedo pelas crianças órfãs e abandonadas.', TRUE, 'Crianças necessitadas', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR));

-- Confirmar inserção
SELECT 'Orações inseridas com sucesso!' as mensagem;
SELECT COUNT(*) as total_oracoes FROM Prayer;
SELECT COUNT(*) as oracoes_por_outros FROM Prayer WHERE prayerForOther = TRUE;
SELECT COUNT(*) as oracoes_proprias FROM Prayer WHERE prayerForOther = FALSE;
