# Clube Leiteiras


Apesar da proposta inicial do projeto ter sido um sistema de mercado, após alinhamento com o professor Alex, decidimos desenvolver uma solução realmente aplicável à nossa realidade. Assim nasceu o **Clube Leiteiras** — um sistema de gerenciamento para um clube de leitura formado por alunas do 2º ano da Germinare Tech.

O foco do clube é a leitura de obras cobradas pelos principais vestibulares do Brasil (como Fuvest e Enem), e o sistema tem como objetivo facilitar o empréstimo de livros, a marcação de favoritos e a organização da leitura entre as participantes.

## Membros do grupo 👩👨👩
- Carlos Eduardo Perrud
- Yasmin Barbosa
- Camilla Moreno 

## 🛠️ Tecnologias Utilizadas

- **Backend**: Python, Flask, JavaScript 
- **Frontend**: React, HTML, CSS, JavaScript 
- **Banco de Dados**: PostgreSQL (com conexão segura via SSL) (Banco hospedado no aiven)
- **Segurança**: Hash de senhas com `werkzeug.security`
- **Integração Web**: CORS configurado para integração com frontend React
- **Outros**: Logging com `logging`, tratamento de exceções globais

## Como rodar o projeto 🌻
- É indicado o uso do Visual Studio Code para rodar o projeto.
- Rode o arquivo main.py
- Abra um novo terminal e mantenha o projeto rodando, nesse novo terminal rode o comando "npm install".
- Em seguida, rode o comando "npm start".
- Uma janela irá se abrir com o projeto! Agora basta aproveitar dos nossos serviços.

## Funcionalidades 📱
- Visualizar livros;
- Favoritar um livro;
- Filtrar seus favoritos;
- Realizar o emprestimo de um livro;
- Visualizar frase e livro do dia;
- Realizar cadastro e login;
- Editar e visualizar carteirinha do clube.