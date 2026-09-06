# Contributing to Gujarat Sultanate Timeline

Thank you for your interest in contributing to this project. We welcome improvements to historical data accuracy, bug fixes, UI/UX polish, and accessibility enhancements.

---

## Code of Conduct

Please maintain a constructive, respectful, and scholarly atmosphere in all issue discussions and pull requests.

---

## How to Contribute

### 1. Reporting Inaccuracies or Issues
- Check existing issues before opening a new one.
- When reporting a historical inaccuracy, please provide verifiable primary or scholarly secondary references (e.g., *Mirat-i-Sikandari*, *Tarikh-i-Firishta*, M.S. Commissariat's *History of Gujarat*, or peer-reviewed journal papers).
- Clearly describe the year, figures involved, and the specific correction needed.

### 2. Suggesting Features or UI Improvements
- Open an issue explaining the proposed enhancement, the use case, and any relevant design or accessibility considerations.

### 3. Submitting Pull Requests
1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your modifications.
   - If adding or editing historical events, adhere strictly to the schema in `data.js`.
   - Ensure changes are written in standard Vanilla JavaScript and CSS without introducing external runtime dependencies.
   - Ensure clean formatting and verify in both light and dark themes.
3. Commit your changes with descriptive commit messages:
   ```bash
   git commit -m "Fix date attribution for Battle of Chaul in data.js"
   ```
4. Push to your branch and open a Pull Request.

---

## Dataset Schema Guidelines

When contributing historical entries to `data.js`, ensure all required fields are present:

- `id` (string): Unique identifier (e.g., `evt-1508-chaul`).
- `phaseId` (integer): Corresponding phase number (1 through 5).
- `phaseTitle` (string): Complete phase title string matching `GUJARAT_PHASES`.
- `phaseShort` (string): Short phase name.
- `year` (string): Display year format (e.g., `1508 CE` or `c. 1411 CE`).
- `numericYear` (integer): Integer year for chronological sorting.
- `category` (string): Primary thematic category (`Political`, `Military`, `Naval`, `Architectural`, `Dynastic`, `Diplomatic`, etc.).
- `title` (string): Concise summary of the event.
- `figures` (array of strings): Key individuals or rulers involved.
- `details` (string): Objective, factual narrative of the event based on chronicles.
- `isKeyMilestone` (boolean): Flag `true` only for major watershed events.

---

## Style Guidelines

- No external libraries or bloatware; keep the project lean and accessible.
- Maintain high contrast, legible typography, and semantic HTML structure.
