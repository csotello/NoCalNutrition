# NoCalNutrition

NoCalNutrition is a React Native nutrition tracker for people who want a clear daily view of the macronutrients that shape their meals: protein, carbohydrates, and fat. Calorie counts have been a major focus in the past which has led to unhealthy habits. Focusing on macro's prioritizes health overall.

> **Project status:** actively developed portfolio project.

## Product highlights

- Log foods by meal and review daily protein, carbohydrate, and fat totals.
- Search branded foods through USDA FoodData Central.
- Create and edit custom foods and set personal nutrient goals.
- Navigate nutrition history by day and estimate calories from macro totals.
- Track recurring habits and one-off tasks alongside nutrition.
- Persist app data locally with encrypted storage.

## Engineering overview

- **Foundation:** React Native 0.87, React 19, and TypeScript.
- **Navigation and UI:** React Navigation, React Native Paper, and Gluestack UI.
- **Data:** encrypted on-device storage for nutrition, custom foods, goals, habits, and tasks.
- **Food search:** USDA FoodData Central API.
- **Quality:** Jest and React Native Testing Library tests for app screens, components, and core user flows.

## Run locally

### Requirements

- Node.js 22.11 or newer
- Android Studio and an Android emulator/device, or Xcode and an iOS simulator/device
- The native build tools required by React Native for your development platform

Install JavaScript dependencies from the project root:

```sh
npm install
```

Start Metro in one terminal:

```sh
npm start
```

In another terminal, launch the app on a connected device or emulator:

```sh
npm run android
# or
npm run ios
```

## Food search API

The Express service is in `server/`. It accepts either `GET /search?query=cheddar` or `POST /search` with a JSON body such as `{"query":"cheddar"}`. Successful responses use the shape `{ "foods": [...] }`.

Run the service from its directory:

```sh
cd server
npm install
npm start
```

Set `API_KEY` in the server process environment or in `server/.env`. The server listens on port `8080` by default; set `PORT` to override it.

## Tests and lint

Run the Jest suite and ESLint from the project root:

```sh
npm test -- --runInBand
npm run lint
```

## Project structure

```text
components/   Reusable food, nutrient, task, habit, and goal UI
screens/      Nutrition, food entry, settings, and habit screens
server/       Express API for USDA food search
__tests__/    Jest and React Native Testing Library coverage
```
