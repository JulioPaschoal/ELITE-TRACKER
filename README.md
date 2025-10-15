# 🚀 Projeto Tracker

> Jornada do Usuário

## ![image](/img/00001.png)

> Requisitos Funcionais (RF´s)

- O usuário deve poder se autenticar com Git;
- O usuário deve poder ser deslogar da aplicação;
- O usuário deve poder criar novos hábitos;
- O usuário deve poder lista os hábitos
- O usuário deve poder excluir os hábitos;
- O usuário deve poder marcar/desmarca hábito concluído no dia;
- O usuário deve poder visualizar as estatísticas de um hábito;
- O usuário deve poder criar um tempo de foco;
- O usuário deve poder criar um tempo de dascanso;
- O usuário deve poder visualizar estatística mensais/diasrias do tempo de foco;

> Regras de Negócio (RN´s)

- O usuário poderá ficar logado na aplicação por 8h, despois é deslogado;
- Não deve ser possível cadastra dois ou mais hábitos com o mesmo nome (independentemente de letrasmaiúsculas ou minúsculas)
- O usuário só pode listar hábitos criados por ele mesmo;
- O usuário só pode excluir os hábitos criados por ele mesmo;
- O usuário só pode marcar/desmarcar como concluido os hábitos criados por ele mesmo;
- O usuário só pode visualizar as estatísticas de um hábitos criados por ele mesmo;
- O usuário só pode visualizat as estatísticas de foco criado por ele mesmo;

> Requisitos Não Funcionais (RNF's)

- Autenticação com o GitHub + JWT;
- Backend com TypeScript + Express.js;
- Frontend com TypeScript + Reactjs;
- Banco de Dados NoSQL (MongoDB);

> Desingn da API

- POST/habits - Criar um novo hábito;
- GET/habits - Listar todos os hábitos;
- Delete/habits/:id - Excluir um hábito;
- PATCH/habits/:id/toogle - Marcar/desmarcar o hábito como cobcluido;
- GET/habits/:id/metrics?date=2025-09-01 - Mostra estatísticas de um hábito;
- POSt/focus-times - Cria um tempo de foco concluido;
- GET/focus-times/metrics?date=2025-09-01 - Mostra as estatíticas de tempo de foco no mês;
- GET/focus-times/date=2025-09-01 - Mostra as estatíticas de tempo de foco no dia;
- POST/auth -Logar com o GitHub

---

<p align="center">
  Feito com ❤️ by JulioPaschoal
</p>
