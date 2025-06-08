const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de respostas e contagem de respostas', () => {
  // cria uma pergunta
  modelo.cadastrar_pergunta('Qual a cor do céu?');
  const [pergunta] = modelo.listar_perguntas();
  const id = pergunta.id_pergunta;

  // cadastra duas respostas diferentes
  modelo.cadastrar_resposta(id, 'Azul');
  modelo.cadastrar_resposta(id, 'Cinza às vezes');

  expect(modelo.get_num_respostas(id)).toBe(2);

  const perguntasAtualizadas = modelo.listar_perguntas();
  expect(perguntasAtualizadas[0].num_respostas).toBe(2);
});

test('Testando get_pergunta retorna objeto correto', () => {
  modelo.cadastrar_pergunta('Teste de get_pergunta');
  const all = modelo.listar_perguntas();
  const id = all[0].id_pergunta;

  const p = modelo.get_pergunta(id);
  expect(p).toBeDefined();
  expect(p.id_pergunta).toBe(id);
  expect(p.texto).toBe('Teste de get_pergunta');
  // id_usuario não é testado aqui, mas deve existir e ser um campo numerico
  expect(typeof p.id_usuario).toBe('number');
});

test('Testando get_respostas retorna as respostas corretas', () => {
  modelo.cadastrar_pergunta('Pergunta para respostas');
  const { id_pergunta: id } = modelo.listar_perguntas()[0];

  // insere três respostas
  modelo.cadastrar_resposta(id, 'R1');
  modelo.cadastrar_resposta(id, 'R2');
  modelo.cadastrar_resposta(id, 'R3');

  const respostas = modelo.get_respostas(id);
  expect(respostas.length).toBe(3);

  // cada objeto deve ter id_resposta, id_pergunta e texto
  respostas.forEach((r, idx) => {
    expect(r.id_pergunta).toBe(id);
    expect(r.texto).toBe(`R${idx + 1}`);
    expect(typeof r.id_resposta).toBe('number');
  });
});
