> ## 👩‍💻 Ma contribution à ce test
>
> J'ai pris en charge ce hiring test Aircall en avril 2026. Mon travail est intégralement documenté dans **[`phone-test/README.md`](phone-test/README.md)**.
>
> **Démo en ligne** : https://frontend-hiring-test-azure.vercel.app
>
> **Stack** : React 18 · TypeScript · Vite · Apollo Client (GraphQL) · Zustand · Dayjs
>
> **Synthèse** :
> - 🐛 **5 corrections de bugs** : 404 sur la route racine, route `/calls` dupliquée, template `Welcome {username}` cassé, persistence de session via localStorage, gestion des erreurs Apollo avec refresh token.
> - ✨ **3 nouvelles fonctionnalités** : filtres d'appels (type + direction), ajout de notes via mutation GraphQL, archivage/désarchivage des appels.
> - 🎨 **Refonte UI/UX** : page de login en split-screen, navbar custom Aircall, liste d'appels avec badges colorés, page de détail en grille avec éditeur de note inline.
>
> _— [Sarah Abila](https://github.com/Sarah-ABILA)_

---# :phone: Aircall Frontend Hiring Test

Backed by over $220 million of investment since 2015, Aircall creates technology that fuels accessible, transparent and collaborative communication to empower our base of 14,000+ customers (and growing) to make authentic, human connections. With over 1.3M calls per day, we focus on user experience, collaboration and integration with other software.

We are looking for engaged and passionate frontend software engineers to join our growing engineering team.

_Feel free to apply! Drop us a line with your LinkedIn/GitHub/X.com at jobs@aircall.io._

## Context

We ask all candidates to take either a home test or a live coding one. We've created a basic application, listing calls and displaying their details, as a support for both tests.

## Exercise

### Current state of the application

We provide an application with very basic features:

- authentication (accepting random username/password)
- listing calls, with pagination
- displaying call details

The application is not production ready. It contains several issues and existing features could be improved a lot. That's on purpose, we'll ask you to work on that. More info in the next section.

### Expectations

As said above, the application is far from being production ready. We'll ask you to fix some known issues, improve existing features and add new ones.

You won't have time to fix everything, and we don't expect you to. Also, we adjust our expectations depending on your seniority.

### Stack

The application relies on a quite common stack. It's a React/Typescript application, created with `create-react-app`, and using a GraphQL API. It uses our own lovely UI library, called Tractor. It's a public library, you can have access to its [Storybook](http://tractor.aircall.io/) and [NPM](https://www.npmjs.com/package/@aircall/tractor) page.

If you joined us, you'd work on a very similar stack.

## APIs

The application relies on a GraphQL API. You can find its documentation [here](documentation/GRAPHQL_API.md) and more information about the models [there](documentation/MODELS.md).

We've previously built a REST API for this test as well. While we suggest you to work with the GraphQL API, you could switch to the REST API if you'd like. You'd find its documentation [here](documentation/REST_API.md).

## Contact

Contact us at jobs@aircall.io if you need more details.
