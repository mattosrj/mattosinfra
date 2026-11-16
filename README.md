# Mattos Infra & Tecnologia — site institucional

Primeira versão independente do projeto Muitas Ofertas. Não usa frameworks, bibliotecas pagas, banco de dados ou backend. Responsivo para celular e computador.

## 1. Entenda os arquivos

- `index.html` — todos os textos e a estrutura do site.
- `styles.css` — cores, tipografia, aparência e responsividade.
- `config.js` — WhatsApp de contato configurado; e-mail profissional pendente.
- `main.js` — menu do celular, formulário que prepara mensagem e data do rodapé.
- `assets/logo-mark.svg` — monograma geométrico inicial (rascunho de identidade, não registro de marca).
- `conteudo-site.md` — cópia organizada dos textos, para facilitar revisões.

## 2. Veja no seu computador

Extraia o ZIP e abra `index.html` no navegador Edge ou Chrome. O site funciona sem servidor local.

## 3. Preencha seus contatos em `config.js`

Exemplo **fictício**, substitua pelos seus dados reais:

```js
window.MATTOS_CONFIG = {
  whatsapp: "5521999999999",
  email: "contato@seudominio.com.br"
};
```

O número deve conter código do país (55), DDD e número, sem `+`, espaços, parênteses ou hífens. Pode preencher um ou ambos. Não use os valores fictícios do exemplo.

O formulário prepara uma mensagem e abre o WhatsApp. Se o WhatsApp não estiver configurado e houver e-mail válido, abre o aplicativo de e-mail. O visitante precisa enviar a mensagem por conta própria. Nenhum dado é armazenado pelo site.

**Importante:** sem contatos configurados, o formulário informa que o site ainda é uma demonstração. Configure antes de divulgar/publicar.

## 4. Crie um repositório separado no GitHub

1. Entre em https://github.com e clique em **New repository**.
2. Nome do repositório: `mattosinfra`, já criado na conta `mattosrj`.
3. Escolha **Public** para publicar facilmente no GitHub Pages.
4. Clique em **Create repository**.
5. Abra **Add file > Upload files** e envie os arquivos *de dentro* da pasta extraída, preservando a subpasta `assets`. `index.html` precisa ficar na raiz do repositório.
6. Faça o commit.
7. Abra **Settings > Pages**. Em **Build and deployment**, selecione **Deploy from a branch**, branch `main`, pasta `/(root)` e clique **Save**.
8. Aguarde o GitHub apresentar a URL publicada e teste no celular.

O endereço previsto, após habilitar o GitHub Pages, é `https://mattosrj.github.io/mattosinfra/`.

## 5. O que personalizar antes de anunciar

- Verificar nome e eventuais conflitos de marca/denominação no INPI e registros aplicáveis; nome ainda é provisório.
- E-mail profissional ainda pendente; o WhatsApp está configurado.
- Revisar serviços de acordo com o que de fato pretende prestar.
- Revisar o monograma, se desejar uma marca visual definitiva.
- Confirmar como vai formalizar a atividade e emitir documentos fiscais antes da prestação remunerada.
- Testar o menu mobile, os links e o formulário.

## Limites

- Site informativo estático; não há envio de e-mail interno, gestão de leads ou integração com CRM.
- Sem promessa de atendimento 24 horas, prazo de resposta ou área geográfica fixa.
- Ícone e identidade visual são rascunhos originais; não representam disponibilidade de registro ou exclusividade.
