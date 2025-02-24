# gacha-events-tracker

This template should help get you started developing with Vue 3 in Vite.

### TODO list:

- [x] Genshin Impact events
- [x] Wuthering Waves events
- [ ] Honkai Star Rail events
- [ ] Zenless Zone Zero events
- [ ] Add a selector for different games
- [ ] Update events to show full name, image and link to official url
- [ ] Modify grouping logic to handle event overlaps and split them into different groups
- [ ] Modify start date so that it is the earliest date only for the current events
- [ ] Update favicon and page title
- [ ] Fix bug where in prod build a user is able to drag events

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
