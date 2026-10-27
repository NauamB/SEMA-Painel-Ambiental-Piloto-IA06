# Painel Ambiental — SEMA-MT (protótipo acadêmico)

## Objetivo
Demonstração de uma interface para acompanhamento de processos e indicadores ambientais, construída para o Piloto IA 06. **Não é um sistema oficial da SEMA-MT.** Todos os dados, responsáveis, códigos e números são fictícios.

## Funcionalidades
- Painel com indicadores demonstrativos.
- Tabela de processos ambientais fictícios.
- Busca por processo, tema, responsável ou status.
- Filtro por status.
- Cadastro de registro demonstrativo.
- Atualização simples de status.
- Layout responsivo e navegação acessível.

## Executar
Abra `index.html` no navegador. Para executar os testes automatizados, instale Node.js e execute:
```bash
npm install
npx playwright install chromium
npm run test:e2e
```
O Playwright inicia um servidor local pela configuração. **Os testes não foram executados ao gerar este pacote**; execute-os no seu ambiente e registre os resultados reais.

## Publicação na Vercel
Importe o repositório GitHub na Vercel. Configure como site estático / framework `Other`, sem build command e com diretório raiz `./`. Faça deploy e teste a URL realmente fornecida pela plataforma.

## Git
```bash
git init
git add .
git commit -m "feat: cria painel ambiental demonstrativo"
git branch -M main
git remote add origin URL_REAL_DO_REPOSITORIO
git push -u origin main
git rev-parse HEAD
```
Substitua `URL_REAL_DO_REPOSITORIO` pela URL do repositório criado. Não invente URL ou hash.

## Segurança, limites e governança
- Não inserir CPF, nomes reais, informações sigilosas, tokens, dados de processos reais ou credenciais.
- Os registros vivem apenas na memória da página e reiniciam ao recarregar; não existe backend ou persistência.
- A interface não consulta sistemas ambientais oficiais nem valida licenças, autos, autorizações ou dados geográficos.
- Revisar o diff, executar testes e obter aprovação humana antes de publicar.
- Reverter com base em um commit validado e avaliar possíveis efeitos de dados/configurações em qualquer sistema real.

## Evidências para o Piloto IA 06
1. Print da visão geral do painel.
2. Print da tabela filtrada ou do formulário de novo registro.
3. URL real do GitHub e hash obtido com `git rev-parse HEAD`.
4. URL da Vercel ou descrição objetiva do impedimento.
5. Saída real dos testes locais e link/resultado do GitHub Actions.
6. Relatório preenchido com as ações reais da IA, revisão humana, limites e reversão.
