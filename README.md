# Gujarat Sultanate (1391 – 1592 CE)

[![GitHub Pages Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages-24292e?logo=github&style=flat-square)](https://jalpan04.github.io/gujarat-sultanate/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F7DF1E?logo=javascript&logoColor=black&style=flat-square)](app.js)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg?style=flat-square)](index.html)

An interactive, chronological timeline and historical explorer detailing the rise, golden age, naval conflicts, architecture, and annexation of the Gujarat Sultanate (Muzaffarid Dynasty) from 1391 to 1592 CE.

**Live Application:** [https://jalpan04.github.io/gujarat-sultanate/](https://jalpan04.github.io/gujarat-sultanate/)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Historical Scope and Phases](#historical-scope-and-phases)
- [Primary Historical Sources](#primary-historical-sources)
- [Architecture and Tech Stack](#architecture-and-tech-stack)
- [Project Structure](#project-structure)
- [Local Setup and Development](#local-setup-and-development)
- [Dataset Schema](#dataset-schema)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The Gujarat Sultanate was one of the wealthiest, most commercially vibrant, and culturally distinguished sovereign realms in medieval South Asia. From its founding by Zafar Khan (Muzaffar Shah I) in the wake of the Tughluq collapse through the expansive reign of Sultan Mahmud I (Mahmud Begada) and eventual annexation under Mughal Emperor Akbar, this project documents every major political, military, naval, architectural, and diplomatic milestone in an accessible, interactive interface.

The application is built with pure web standards (vanilla HTML5, CSS3, and modern JavaScript) without third-party frameworks or heavy dependencies, ensuring rapid load times, offline capability, and longevity.

---

## Key Features

- **Multi-View Historical Explorer**:
  - **Interactive Timeline View**: Chronological vertical layout with distinct era color ribbons, milestone markers, and figure tags.
  - **Tabular Ledger View**: Clean table representation suited for researchers, cross-referencing, and quick column sorting.
  - **Card Grid View**: Responsive card layout highlighting major events, architectural achievements, and battles.
- **Deep Historical Filtering & Real-time Search**:
  - Filter by specific dynasty phases or historical eras.
  - Filter across thematic categories: Political, Military, Naval, Architectural, Dynastic, Diplomatic, and Religious/Administrative.
  - Live search across ruler names (e.g., *Begada*, *Ahmad Shah*, *Bahadur Shah*), commanders, battle sites, architectural monuments, and dates.
- **Detailed Event Modal & Citation Tool**:
  - Expand any event for full context, associated historical figures, and source excerpts.
  - Keyboard navigation (Left/Right arrow keys for previous/next events, Escape to close).
  - One-click reference copy formatted for research notes.
- **Accessible & Adaptive Design**:
  - Light and Dark color themes with persistent user preferences.
  - High-contrast typography designed for long-form reading and reference.
  - Tailored print stylesheet for producing clean physical or PDF document exports.

---

## Historical Scope and Phases

The dataset covers two centuries across five defined historical epochs:

| Phase | Title | Period | Key Figures and Highlights |
| :--- | :--- | :--- | :--- |
| **Phase 1** | The Rise & The Founder | 1391 – 1442 CE | Zafar Khan (Muzaffar Shah I), Ahmad Shah I, foundation of Ahmedabad (1411), pacification of Saurashtra, construction of the Jama Masjid. |
| **Phase 2** | Dynastic Intrigue & Transition | 1442 – 1458 CE | Muhammad Shah II (Zar-Bakhsh), Qutb-ud-din Ahmad Shah II, conflicts with the Mewar Rana, construction of Hauz-i-Qutb (Kankaria Lake). |
| **Phase 3** | Golden Age of Mahmud Begada | 1458 – 1511 CE | Sultan Mahmud Begada, conquest of Junagadh (Uparkot) and Champaner (Pavagadh), naval alliance at the Battle of Chaul (1508) and Battle of Diu (1509), construction of Champaner-Pavagadh monuments and Adalaj Stepwell. |
| **Phase 4** | Climax, Mughal Clashes & Portuguese Wars | 1511 – 1537 CE | Muzaffar Shah II, Sultan Bahadur Shah, capture of Mandu and Chittor, invasion by Mughal Emperor Humayun, Treaty of Bassein, and death of Bahadur Shah at Diu. |
| **Phase 5** | Epilogue, Internal Strife & Mughal Annexation | 1537 – 1592 CE | Mahmud Shah III, Itimad Khan, factional disintegration, siege of Surat (1573), annexation by Akbar, final resistance of Muzaffar Shah III at Bhuchar Mori (1591). |

---

## Primary Historical Sources

All events and accounts compiled in `data.js` are cross-referenced with primary and standard secondary medieval chronicles:

- **Mirat-i-Sikandari** by Shaikh Sikandar ibn Muhammad Manjhu (1611 CE)
- **Tarikh-i-Firishta** (Gulshan-i-Ibrahimi) by Muhammad Qasim Hindu Shah Firishta (1606–1612 CE)
- **Mirat-i-Ahmadi** by Ali Muhammad Khan (1761 CE)
- **Tabakat-i-Akbari** by Khwaja Nizam-ud-din Ahmad (1593 CE)
- **A History of Gujarat (Vols. I & II)** by M. S. Commissariat (Longmans / Orient Longman)

---

## Architecture and Tech Stack

- **Markup**: Semantic HTML5 with ARIA roles and landmark regions for screen reader accessibility.
- **Styling**: Standard CSS3 using CSS Custom Properties (variables) for theme switching, CSS Grid, and Flexbox.
- **Logic**: Modular Vanilla JavaScript (ES6+), self-contained IIFE controller pattern, zero bundler required.
- **Hosting**: GitHub Pages via automatic branch publishing.

---

## Project Structure

```text
gujarat-sultanate/
├── .gitignore          # Excludes OS and editor temporary files
├── CONTRIBUTING.md     # Guidelines for data contributions and fixes
├── LICENSE             # MIT License
├── README.md           # Project documentation and historical overview
├── app.js              # Application state, UI controller, filtering, and event listeners
├── data.js             # Comprehensive historical dataset and phase definitions
├── index.html          # Main HTML markup, layout structure, and modals
└── styles.css          # Design system, themes (light/dark), layout, and print styles
```

---

## Local Setup and Development

No compilation or package installation is necessary. You can run the application directly in any modern browser.

### Option 1: Direct File Opening
Clone the repository and open `index.html` directly in your web browser:
```bash
git clone https://github.com/Jalpan04/gujarat-sultanate.git
cd gujarat-sultanate
```
Double-click `index.html` or open it with your preferred browser.

### Option 2: Local Static Server
If using a local HTTP development server (e.g. Python, Node, or VS Code Live Server):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx serve)
npx serve .
```
Navigate to `http://localhost:8000` in your browser.

---

## Dataset Schema

Events in `data.js` are defined using the following JSON object structure:

```javascript
{
  id: "evt-1458-begada",
  phaseId: 3,
  phaseTitle: "Phase 3: The Golden Age of Mahmud Begada (1458 – 1511 CE)",
  phaseShort: "Phase 3: Golden Age",
  year: "1458 CE",
  numericYear: 1458,
  hijri: "863 AH",
  category: "Dynastic",
  primaryCategory: "Dynastic",
  title: "Accession of Sultan Mahmud I (Mahmud Begada)",
  figures: ["Mahmud Begada", "Imad-ul-Mulk"],
  details: "At the age of thirteen, Prince Fateh Khan is raised to the throne following the deposition of his uncle Daud Shah...",
  isKeyMilestone: true
}
```

---

## Contributing

Contributions to improve historical accuracy, add verified citations, fix typographical errors, or enhance accessibility are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
