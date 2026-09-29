![Escape Room](docs/screenshot.jpg)

# Escape Room

A booking site for escape rooms: browse quests by topic and difficulty, pick a time slot on a
map and reserve it. React 18 with Redux Toolkit, React Hook Form and Leaflet, written in
TypeScript and built with Vite.

This is a training project, my grading assignment for the "React developer" profession at HTML
Academy. I wrote it from September 9 to 16, 2024, from an archive with markup and a spec
(`VALIDATION.md`), without a pull request or a mentor review. The reviewed grading track lives at
[htmlacademy.ru/profession/react](https://htmlacademy.ru/profession/react), by mentor
[Arthur Litovko](https://htmlacademy.ru/profile/id6927).

## What you can do

Open the home page to see quests from the grading server, filter them by topic (adventure,
horror, mystic, detective, sci-fi) and by difficulty. Open a quest for its full description and a
map of its address. Sign in to book a quest: choose a date and time slot on the map, say how many
people are coming and whether children are among them, and submit the form built with React Hook
Form. Signed in, "My quests" lists your reservations and lets you cancel one.

## How it works

### Data and auth

Five thunks in `src/store/api-actions/` call the grading API through one axios instance from
`src/services/api.ts`. On login the server returns a token, which `src/services/token.ts` keeps
in `localStorage` under `escape-room-token` and a request interceptor adds to every call as
`x-token`. `src/services/router/private-route.tsx` builds both the private and the public route
from one factory, so signing out from "My quests" and opening "Login" while signed in both work
through the same `Navigate`.

### Filters

`src/utils/filter-utils.ts` filters the quest list first by topic, then by difficulty, and the
selector in `quest-selectors.ts` runs it through `createSelector` so it only recomputes when the
quests or the two filters actually change. Each filter keeps its active choice in its own local
state, separate from what is stored in the slice.

### Map

`src/components/map/use-map.tsx` creates one Leaflet map per page and keeps it in state, so
switching a booking's time slot only calls `setView` and rebuilds the marker layer, not the map
itself. The same component picks the office address for the quest page and the chosen slot's
address for the booking page.

## Run locally

```bash
git clone https://github.com/murpiano/escape-room.git
cd escape-room
npm install

npm start         # Vite dev server
npm run lint      # ESLint with the academy config
npm test          # Vitest, finds no tests
npm run build     # type check and production build into dist/
```

There are no tests, and `npm test` passes because of `--passWithNoTests`. There was no CI: this
was a solo grading submission, not a reviewed pull request. Data comes from
`https://grading.design.htmlacademy.pro/v1/escape-room`.

## Where things live

```text
markup/            the layout from the assignment archive: pages, ui-kit, sitemap.html
src/
├── index.tsx       mounts the app
├── components/     header, footer, quest card, map
├── pages/          home, quest, booking, login, my-quests, contacts
├── services/       axios instance, token storage, router
├── store/          slices, selectors and thunks
├── const/          routes, enums, static copy
└── utils/          filters and time formatting
```

`VALIDATION.md` is the assignment's own note on using React Hook Form, kept as it was given.

## Rough edges

- `npm run build` fails: `tsc` rejects the `errors` object from `useForm` in `login-form.tsx` and
  `booking-form.tsx` against `@hookform/error-message`'s types, and `form-data.tsx` uses
  `InputsProps` without its type argument. `npm start` still runs, since Vite's dev server
  doesn't type-check.
- `bookingAction` in `store/api-actions/booking-actions.ts` posts to the booking endpoint without
  a body: the collected date, time and headcount are built in `booking-form.tsx` but never
  reach the request.
- The topic and difficulty radio inputs get `checked` with no `onChange`, so React logs a
  read-only field warning; the visible filtering still works through the click handler on the
  label.
- The phone number sent with a booking is the literal string `'tel'`, not the value from the
  form.

---

<sub>[Bogdan Trotsenko](https://github.com/murpiano) · [murpiano](https://github.com/murpiano) · [Telegram](https://t.me/murpiano)</sub>
