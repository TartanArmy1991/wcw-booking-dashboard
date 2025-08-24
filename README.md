
# WCW 2000 Booking Tracker (TEW 9)

A lightweight Node.js site you can run on your local network to track WCW bookings week‑by‑week for the year 2000.

- Nitro & Thunder are treated as **A shows** (2 hours).
- Saturday Night is a **B show** (1 hour) and is scheduled up to its last episode on **2000‑08‑19**.
- PPVs are **3 hours** and mapped to their real 2000 dates.

## Quick Start

1. Install Node.js 18+.
2. In this folder:
   ```bash
   npm install
   npm start
   ```
3. Open **http://localhost:3000** on this PC, or from other devices on your LAN use `http://YOUR_PC_IP:3000`.

## Adding your weekly data

- Each week is stored as a JSON file in `data/weeks/` named by the **Monday** of that week, e.g. `2000-01-03.json`.
- Duplicate the sample file and edit the arrays for `titles`, `roster`, `tagTeams`, `factions`, and `developmental`.

## Picking a date

Each page has a date picker in the header. The site snaps your chosen date to that week’s **Monday** and loads the matching snapshot.

## PPV Dates (2000)
- Souled Out — 2000‑01‑16
- SuperBrawl — 2000‑02‑20
- Uncensored — 2000‑03‑19
- Spring Stampede — 2000‑04‑16
- Slamboree — 2000‑05‑07
- The Great American Bash — 2000‑06‑11
- Bash at the Beach — 2000‑07‑09
- New Blood Rising — 2000‑08‑13
- Fall Brawl — 2000‑09‑17
- Halloween Havoc — 2000‑10‑29
- Mayhem — 2000‑11‑26
- Starrcade — 2000‑12‑17

---

**Tip:** If you prefer to regenerate the schedule, a small helper script template is in `scripts/generateSchedule.js`.
