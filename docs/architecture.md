# ROOTS System Architecture

## System Architecture — 7 Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 01 │ Citizen Input                                │
│           │ WhatsApp · Web PWA · USSD · IVR · UMANG     │
├─────────────────────────────────────────────────────────┤
│  Layer 02 │ Bhashini Language & Identity Layer           │
│           │ 22 Indian languages · ULB Adapter · DigiLocker│
├─────────────────────────────────────────────────────────┤
│  Layer 03 │ Vision & Geo-Enrichment                      │
│           │ Gemini Vision · PostGIS · NLP Structurer     │
├─────────────────────────────────────────────────────────┤
│  Layer 04 │ Intelligence Core                            │
│           │ ST-DBSCAN · Causal Graph · Decay Model · ROI │
├─────────────────────────────────────────────────────────┤
│  Layer 05 │ Civic Digital Twin                           │
│           │ Live ward infrastructure condition model     │
├─────────────────────────────────────────────────────────┤
│  Layer 06 │ CSR & Carbon Credit Bridge                   │
│           │ CSR Match Engine · Carbon Credit Ledger      │
├─────────────────────────────────────────────────────────┤
│  Layer 07 │ Output Dashboards                            │
│           │ Citizen · Officer · Env. Ledger · City Command│
└─────────────────────────────────────────────────────────┘
```

## Six Problem Domains

| Domain | Delhi Scale | ROOTS Output |
|--------|-------------|-------------|
| Urban Flooding | 2500+ micro-flood hotspots | 72-hr ward flood risk heatmap |
| Air Quality | Ward AQI varies up to 4x | Hyper-local PM2.5 per ward |
| Waste Management | 40% routes inefficient | Dynamic route + overflow prediction |
| Traffic & Emergency | Avg. ambulance: 18 min vs 8-min target | AI emergency corridor routing |
| Public Health | Dengue peaks 2–5 months post-monsoon | 12-day outbreak prediction |
| Infrastructure Decay | 6-year avg. inspection gap | 90-day predictive maintenance calendar |

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Spatial Database | PostgreSQL 15 + PostGIS 3.3 |
| Graph Database | Neo4j Community |
| Clustering | Python 3.11 + scikit-learn + Custom ST-DBSCAN |
| Vision AI | Google Gemini 1.5 Flash API |
| Language | Bhashini Government API (22 languages) |
| ML Models | XGBoost + statsmodels SARIMA |
| Agents | LangGraph (Python) |
| Backend | Node.js 20 + Express |
| Frontend | Next.js 14 + Leaflet.js |
| Hosting | Railway.app |
| Messaging | WhatsApp Cloud API (Meta) |
