# Layer 07: Output Dashboards

This layer presents the processed data to various stakeholders. It is built as a Next.js 14 frontend serving Citizen, Officer, Environmental Ledger, and City Command dashboards.

## Technologies Used
- Next.js 14
- React 18
- Tailwind CSS
- React-Leaflet
- Recharts

## How to Run

To run the dashboard locally for development:

`cd src/dashboards`
`npm install`
`npm run dev`

Open http://localhost:3000 in your browser.

## Features (Officer Console)
- **Map View:** Real-time spatial visualization of complaints clustered via ST-DBSCAN.
- **Decay Chart:** Recharts graph mapping the exponential growth of environmental cost and Dengue risk over time.
- **Task Dispatch:** Actionable cards ranked by ROI ratio (Environmental Harm Prevented / Estimated Repair Cost).
- **Metrics Bar:** Top-level vital statistics for Ward 78.
