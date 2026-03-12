# ROOTS — Responsive Optimization of Urban Infrastructure Through AI

<p align="center">
  <img src="https://img.shields.io/badge/Version-3.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Competition-India%20Innovates%202026-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Domain-Urban%20Solutions-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge" />
</p>

<p align="center">
  <b>Cities today react to complaints. ROOTS predicts infrastructure failures before citizens suffer.</b>
</p>

---

## 📁 Project Documents & Presentation

> 🔗 **[View Full Project Documentation, Presentation & Demo →](https://drive.google.com/drive/folders/1OC40r71XZgW1ORoMWb00QkcFUai2nb1c?usp=sharing)**
>
> *(Includes: Competition Whitepaper v3.0, Pitch Deck, Architecture Diagrams, Demo Video)*

---

## 📌 What is ROOTS?

ROOTS is a **seven-layer urban intelligence operating system** that converts citizen complaints into infrastructure root-cause analysis for Indian cities.

**The problem it solves:**

Delhi generates 4,000–6,000 MCD complaints every day. A cracked underground pipe at 2am produces — over the next 72 hours — five separate complaints routed to five different departments:

| Complaint | Department |
|-----------|------------|
| Waterlogging on Street A | Horticulture |
| Pothole on Street B | Roads |
| Damp wall in Building C | Buildings |
| Mosquito breeding nearby | Health |
| Garbage pile (truck blocked) | Sanitation |

Every existing civic platform treats these as **5 independent problems**.  
ROOTS identifies them as **1 root cause: one failing pipe.**

---

## 🧠 Core Hypothesis

- **80%** of Delhi's civic complaints are symptoms of **8 recurring root infrastructure failures**
- Resolving root causes would eliminate **71% of repeat complaints**
- Every day of inaction has a **quantifiable, compounding environmental cost** in rupees

---

## 🏗️ System Architecture — 7 Layers

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

---

## ⚙️ Algorithms

### Novel Contributions
| Algorithm | Purpose |
|-----------|---------|
| **ST-DBSCAN** (Adaptive ε) | Spatiotemporal complaint clustering with dynamic radius by population density |
| **Causal Inference Graph Engine** | Identifies root infrastructure failure from complaint cluster patterns (84% confidence threshold) |
| **Environmental Decay Cost Model** | Converts unresolved complaints into real-time financial liability using exponential growth |
| **Env-ROI Budget Optimizer** | Ranks repairs by environmental return per rupee (0/1 knapsack, greedy approximation) |

### Established ML Methods Applied to Civic Data
| Algorithm | Purpose |
|-----------|---------|
| **XGBoost + SHAP** | Resolution bias auditor — Article 14 equity compliance detection |
| **SARIMA(1,1,1)(1,1,1)[7]** | 7-day complaint surge predictor with IMD rainfall as exogenous variable |
| **LangGraph Multi-Agent Council** | Flood Agent + Health Agent + AQI Agent — cross-domain risk escalation |

---

## 🌐 Six Problem Domains

| Domain | Delhi Scale | ROOTS Output |
|--------|-------------|-------------|
| Urban Flooding | 2500+ micro-flood hotspots | 72-hr ward flood risk heatmap |
| Air Quality | Ward AQI varies up to 4x | Hyper-local PM2.5 per ward |
| Waste Management | 40% routes inefficient | Dynamic route + overflow prediction |
| Traffic & Emergency | Avg. ambulance: 18 min vs 8-min target | AI emergency corridor routing |
| Public Health | Dengue peaks 2–5 months post-monsoon | 12-day outbreak prediction |
| Infrastructure Decay | 6-year avg. inspection gap | 90-day predictive maintenance calendar |

---

## 💻 Technology Stack

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

---

## 📂 Repository Structure

```
roots/
├── src/
│   ├── intake/              # Layer 01 — WhatsApp, USSD, IVR handlers
│   ├── language/            # Layer 02 — Bhashini integration, ULB adapter
│   ├── vision/              # Layer 03 — Gemini Vision pipeline, PostGIS
│   ├── intelligence/        # Layer 04 — ST-DBSCAN, Causal Graph, Decay Model
│   │   ├── clustering/      # ST-DBSCAN implementation
│   │   ├── causal/          # Knowledge graph, failure signatures
│   │   ├── decay/           # Environmental cost model
│   │   └── optimizer/       # ROI budget optimizer
│   ├── twin/                # Layer 05 — Digital Twin ward model
│   ├── funding/             # Layer 06 — CSR engine, Carbon credit ledger
│   └── dashboards/          # Layer 07 — Next.js frontend (4 dashboards)
├── data/
│   ├── ward78/              # Ward 78 (Sadar Bazaar) GeoJSON + complaint data
│   └── references/          # Public datasets used (MCD, NDMC, IMD, CPCB)
├── docs/
│   ├── whitepaper-v3.0.pdf  # Full competition whitepaper
│   ├── architecture.md      # Detailed layer architecture
│   └── algorithms.md        # Algorithm documentation with references
├── notebooks/
│   ├── decay_model.ipynb    # Environmental Decay Model calibration
│   ├── st_dbscan_demo.ipynb # ST-DBSCAN on Ward 78 data
│   └── equity_audit.ipynb   # SHAP bias analysis
├── tests/
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 📊 Projected Impact — Ward 78 Pilot

| Metric | Current Baseline | ROOTS Target |
|--------|-----------------|-------------|
| Repeat complaint rate | 71% recur within 60 days | **71% reduction** |
| Avg. resolution time | 67% take >30 days | **<7 days** for root-cause tickets |
| Dengue warning | Reactive (post-outbreak) | **12-day advance warning** |
| Environmental cost | ₹2.3 Cr/year estimated | **Up to 60% reduction** |
| Equity gap | >40% resolution time variance | SHAP auditor flags + tracks |

---

## 🏆 Competition

**India Innovates 2026**  
Bharat Mandapam, New Delhi — 28 March 2026  
Domain: Urban Solutions — Sub-theme: Smart Cities  
Alignment: Viksit Bharat 2047 (Garib pillar — equity + accessibility)

---

## 👤 Developer

**Niraj Naphade**  
Pune, Maharashtra  
[github.com/knokvik](https://github.com/knokvik)

---

## 📚 Key References

1. Birant & Kut (2007). ST-DBSCAN. *Data & Knowledge Engineering*, 60(1). [DOI](https://doi.org/10.1016/j.datak.2006.01.013)
2. Lundberg & Lee (2017). SHAP. *NeurIPS 2017*. [arXiv:1705.07874](https://arxiv.org/abs/1705.07874)
3. Chen & Guestrin (2016). XGBoost. *KDD 2016*. [DOI](https://doi.org/10.1145/2939672.2939785)
4. Singh & Chaturvedi (2021). Dengue geospatial clustering, Delhi. *BMJ Open*. [DOI](https://doi.org/10.1136/bmjopen-2020-043848)

---

<p align="center">
  <i>ROOTS — India Innovates 2026 — Urban Solutions</i><br/>
  <i>Confidential Competition Submission</i>
</p>
