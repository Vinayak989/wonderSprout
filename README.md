# WonderSprout

A playful, responsive game website for children ages 3–12. The frontend uses React and TypeScript; the stateless game API uses Java 17 and Spring Boot.

## Game library

The catalogue includes 15 child-friendly categories: Memory Games, Puzzle & Logic, Art & Creativity, Geography & World Explorer, Animals & Nature, Music & Rhythm, Coding & Computational Thinking, Life Skills & Good Habits, Emotions & Social Skills, Time & Calendar, History & Culture, Adventure & Treasure Hunt, Money & Financial Literacy, Sports & Movement, and Interactive Stories & Reading. Math, word, and science games are included too.

Activities include card matching, sequence memory, missing-object puzzles, Sudoku, drawing and pixel art, a monster creator, map and nature challenges, a coding maze with repeat blocks, piano and rhythm play, sound guessing, sorting, clock setting, pretend shopping, and adventure stories. The library now also includes 20 themed activities: Dino Fossil Dig, Silly Creature Creator, Mini Golf Math, Build-a-Treehouse, Underwater Treasure Hunt, Garden Grower, Robot Dance Party, Obstacle Dash, Pizza Chef Shop, Bridge Builder, Color Mixing Lab, Birdsong Mystery, Recycling Rescue, Storybook Theater, Moonbase Maze, Arctic Habitat Match, Clockwork Castle, Coin Collector Shop, Balance the Forest, and Pixel Creature Studio. Games are grouped into ages 3–5, 6–8, and 9–12; activities that need more reading or number skills are restricted to older groups.

Every game is presented as an 8–10 minute activity. The site is split into a welcome/setup page (`/`), a filtered game catalogue (`/games`), and a separate play page for each game (`/games/{gameId}`). The first page asks for an age group and language. English, Hindi, and Marathi are available; the selected preferences are saved in the browser and can be changed from the game catalogue.

Each game category also has its own page, such as `/games/category/memory-games` or `/games/category/animals-nature`. Choosing a game opens its own play page; browser Back returns to the category page.

Progress stars stay in the current browser. The site does not require an account or collect child profiles. The Java API provides the catalogue, question rounds, answer feedback, and memory cards without storing player data.

## Technology

- **React 19 + TypeScript + Vite** for a responsive, component-based frontend.
- **Three.js** for lazy-loaded, interactive 3D campaigns: Crystal Cave and Space Rescue Missions.
- **Java 17 + Spring Boot + Maven** for the REST API and game catalog.
- **REST/JSON** between the app and API. Question answers remain on the server until submitted.
- **localStorage** for browser-local stars and completed-game counts.
- **English and Hindi language packs** for the catalogue, navigation, game interfaces, memory cards, and question rounds. New language packs can be added in `frontend/src/i18n.ts`.

The API is stateless, so instances can be added behind a load balancer. PostgreSQL can be introduced through a repository layer if durable parent-managed accounts or cross-device progress are needed. A shared cache can be added later if traffic calls for one.

## Run locally

You need Java 17+, Maven 3.6.3+, and Node.js 20.19+ (Node 24 is suitable).

### 1. Start the Java API

From the project root:

```powershell
mvn spring-boot:run
```

The API starts at `http://localhost:8080`.

### 2. Start the React app

In another terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. Vite forwards `/api` requests to the Java service.

### Production frontend build

```powershell
cd frontend
npm.cmd run build
```

The optimized site files are created in `frontend/dist`.

## Deploy on Render

The root `Dockerfile` builds the React site and Java API into one container. Spring Boot serves the frontend and `/api` from the same origin, including direct visits to `/games` routes.

Create a Render Web Service from this repository using the Docker runtime and the `Dockerfile` at the repository root. The service listens on Render's `PORT` value. The app has no required secrets or external database. A free instance can sleep while idle; choose a paid instance if you need always-on service.

## API

- `GET /api/games` — game cards and supported age bands.
- `GET /api/games/{gameId}/questions?ageBand=6-8` — a shuffled five-question round for question-based games.
- `GET /api/games/{gameId}/memory-cards?ageBand=6-8` — a shuffled memory deck.
- `POST /api/games/{gameId}/answer` — checks a selected answer and returns its explanation.

Example answer body:

```json
{
  "ageBand": "6-8",
  "questionId": "ng-68-1",
  "choice": "15"
}
```
