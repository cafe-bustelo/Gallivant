# Gallivant Mobile

This repository contains an Expo-powered React Native prototype for the Gallivant mobile experience. The first feature delivered here is a **Movie Showtime Browser** that aggregates local screenings and opens ticketing partners inside an in-app browser.

## In plain language

- Think of the app as a single place to browse what's playing in nearby theaters.
- When you tap "Buy tickets," the app simply opens the partner's website (Fandango, Atom Tickets, etc.) in a mini browser that lives inside the app—no special ticketing contracts are required to get started.
- You can swap the sample data with real listings later without redesigning the screens.

## Features

- Movie discovery cards with poster art, synopsis, runtime, and ratings.
- Theater breakdowns with auditorium notes and distances.
- Quick links to Fandango, Atom Tickets, or official exhibitor sites.
- Embedded WebView modal with an "Open in browser" escape hatch.
- Search filtering by title/genre and a manual show-date input.

## Getting started

1. Install dependencies (Node 18+ recommended):

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npm run start
   ```

3. Use the Expo Go app or an emulator/simulator to preview the experience.

## Mac terminal command reference

If you are developing on macOS, these are the most common commands you will run in Terminal:

```bash
# (Optional) Install Node.js 18 with Homebrew if you don't already have it.
brew install node@18

# Navigate to the project folder.
cd /path/to/Gallivant

# Install JavaScript dependencies.
npm install

# Launch the Expo development server (press "i" for iOS simulator, "a" for Android emulator).
npm run start

# Open the native iOS build in Xcode's simulator (requires Xcode CLI tools).
npm run ios

# Open the native Android build (requires Android Studio & an emulator configured).
npm run android

# Render the app in a desktop browser instead of a device.
npm run web

# Stop any running command with Control+C when you're done testing.
```

### Want to launch it in a browser?

Expo can render the same experience in a web tab for quick testing:

```bash
npm run web
```

This spins up a local development server and opens the app in your default browser. Interactive features (like the in-app ticketing WebView) appear as standard web modals so you can click through everything without a phone or simulator.

## Customising data

The demo uses static sample data defined in [`src/data/sampleShowtimes.ts`](src/data/sampleShowtimes.ts). Replace this with a network request to your preferred listings provider once API credentials are in place.

## Ticketing providers in WebView

The [`MovieShowtimeBrowser`](src/components/movie/MovieShowtimeBrowser.tsx) component launches ticketing provider URLs in a React Native WebView. This keeps the purchase flow inside the Gallivant app while honouring each partner's branded checkout experience.

If you onboard with partners that supply purchase APIs, you can swap out the WebView modal for native forms and reuse the same discovery layout.
