# Trip Planner App

A simple, offline-first (via JSON) itinerary manager for a couple's trip to France and Switzerland.

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
