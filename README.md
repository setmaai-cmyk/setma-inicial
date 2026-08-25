# SeTma.IA Wizard

Crie a interface web responsiva do aplicativo de manutenção "SeTma.IA". O visual deve ter um tema escuro (dark mode) com detalhes e botões em azul metálico. Como não temos backend ainda, utilize dados simulados (mock data) e estado local do React para que a navegação funcione perfeitamente entre as telas.

Siga este fluxo de telas (Wizard):

1. Login: Campos de e-mail e senha. Qualquer dado digitado deve permitir o acesso ao clicar em "Entrar".

2. Seleção de Máquina: Um dropdown com opções fixas (ex: Prensa Hidráulica 01, Torno CNC 03) e um botão "Avançar".

3. Triagem de Alarme: Pergunta "O equipamento gerou alarme visual?". Botões "Sim" (abre campo para digitar o código) e "Não". Botão "Avançar".

4. Chat de Diagnóstico: 

   - Campo de texto para o técnico relatar o problema.

   - Quando o técnico enviar, simule uma resposta da IA (use um atraso visual de 1 segundo para parecer que a IA está digitando). 

   - Simule a IA enviando um passo a passo em formato de card com um placeholder de imagem técnica, indicando a "Solução da Base Interna".

5. Finalização: Uma tela de resumo mostrando os dados que o usuário preencheu nos passos anteriores. Um botão "Salvar Ordem de Serviço", que exibe uma mensagem de sucesso e retorna o usuário para a tela inicial.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/70dd22d0-1ef0-4533-ae91-cbe09eca1fde).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
