# WeMovies — E-commerce de Filmes

Aplicação de e-commerce de filmes construída com **Next.js (App Router)**, **React**, **Zustand** e **Tailwind CSS**. Permite listar filmes, gerenciar um carrinho persistente e finalizar a compra.

## Stack

- **Next.js 16** (App Router, Server Components)
- **React 19**
- **Zustand** (estado do carrinho, com persistência em `localStorage`)
- **Tailwind CSS v4**
- **Vitest** + **Testing Library** (testes unitários e de integração)
- **Playwright** (testes end-to-end)

## Pré-requisitos

- Node.js 20+
- npm

## Configuração

Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env.local
```

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base da API de filmes | `https://wemovies-seven.vercel.app/api/movies` |

## Como rodar

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Sobe o servidor de produção |
| `npm run lint` | Executa o ESLint |
| `npm run test` | Roda os testes unitários em modo watch (Vitest) |
| `npm run test:run` | Roda os testes unitários uma vez |
| `npm run test:coverage` | Roda os testes com relatório de cobertura |
| `npm run test:e2e` | Roda os testes end-to-end (Playwright) |
| `npm run test:e2e:ui` | Abre a UI do Playwright |

## Estrutura

```
src/
  app/          # Rotas (App Router): home, /cart, /success, loading e error boundaries
  components/   # Componentes de UI (Button, MovieCard, CartItem, Header, etc.)
  hooks/        # Hooks customizados (useMovies)
  services/     # Acesso à API (getMovies)
  store/        # Estado global (useCartStore, Zustand + persist)
  types/        # Tipos compartilhados (Movie, CartItem)
  utils/        # Utilitários (formatCurrency)
  __tests__/    # Testes unitários e de integração
playwright/     # Testes end-to-end
```

## Arquitetura de dados

A página inicial é um **Server Component** que busca os filmes no servidor (com revalidação via ISR) e entrega os dados já hidratados ao componente cliente `MovieList`. Em caso de falha na busca, o cliente expõe um botão de "Tentar novamente" que refaz a requisição no navegador.

O carrinho é gerenciado por um store **Zustand** persistido em `localStorage`. Para evitar mismatch de hidratação entre servidor e cliente, valores derivados do carrinho são lidos via `useHydratedCartValue`.

## Testes

```bash
npm run test:run    # unit + integração
npm run test:e2e    # end-to-end
```

## Deploy

O deploy recomendado é via [Vercel](https://vercel.com/new). Configure a variável `NEXT_PUBLIC_API_URL` no painel do projeto caso utilize uma API diferente da padrão.
