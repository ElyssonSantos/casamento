# Larissa & Gabriel - Site de Casamento

Experiência digital completa para o casamento, focada em dispositivos móveis.

## Funcionalidades
- **Intro Animada**: Experiência imersiva inicial.
- **Confirmação**: Autenticação via CPF + Cadastro.
- **Área Protegida**: Informações exclusivas para convidados.
- **Painel Admin**: Gestão de convidados e estatísticas.
- **Backend Activo**: Banco de dados SQLite (`wedding.db`).

## Como rodar
1. Instale dependências: `npm install`
2. Rode o servidor: `npm run dev`
3. Acesse `http://localhost:3000`

## Rotas
- `/`: Intro
- `/confirmacao`: Cadastro/Login
- `/inicio`: Área do convidado (Requer login)
- `/admin`: Painel do Noivo/Noiva

## Autenticação
O sistema usa o CPF como chave única. Não há senhas.
Se o CPF não existir, um novo cadastro é criado automaticamente.

## Cores
- Verde Profundo: #2D4739
- Gold: #C5A059
