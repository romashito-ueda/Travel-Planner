# Trip Planner App

A simple, offline-first (via JSON) itinerary manager for a couple's trip to France and Switzerland.

## Google Places API Integration

This app uses the Google Places API (client-side) to fetch real photos for recommended locations.

### Setup

1.  Obtain a Google Cloud API Key with **Places API (New)** enabled.
2.  Set the environment variable in Replit Secrets (Tools > Secrets):
    *   Key: `VITE_GOOGLE_MAPS_API_KEY`
    *   Value: `Your_API_Key_Here`

### ⚠️ IMPORTANT SECURITY WARNING

Since this is a client-side application without a backend proxy, **the API key is exposed to the browser**.

To prevent misuse:
1.  **Restrict the API Key**: Go to Google Cloud Console > Credentials > Edit API Key.
    *   Under **Application restrictions**, select **HTTP referrers (websites)** and add your Replit app URL (e.g., `https://your-app-name.replit.app/*`).
    *   Under **API restrictions**, select **Restrict key** and choose only **Places API (New)**.
2.  **Set Budget Alerts**: Configure billing alerts in Google Cloud to notify you of unexpected usage.

If the key is not set, the app will gracefully fallback to showing text-only recommendations with Google Search links.

## How to Edit Trip Data

The entire trip schedule is defined in `client/src/data/trip.json`.

### Editing Format:

- **events**: List of flight, train, hotel, activity items.
  - `status`: "confirmed" (green), "planned" (amber), "todo" (dashed border).
- **constraints**: Critical constraints shown on specific days (e.g., "Must arrive by 19:30").
- **checklist**: Packing list items.
- **places**: Locations for the map view.

## Running Locally

1. `npm install`
2. `npm run dev:client`
