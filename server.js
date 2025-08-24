
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Simple helper to send JSON files
function sendJson(res, filePath, fallback = null) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (e) {
    if (fallback) {
      res.json(fallback);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  }
}

// API: full schedule
app.get("/api/schedule", (req, res) => {
  const file = path.join(__dirname, "data", "schedule.json");
  sendJson(res, file, { year: 2000, nitro: [], thunder: [], saturday_night: [], ppv: [] });
});

// API: list available weeks
app.get("/api/weeks", (req, res) => {
  const dir = path.join(__dirname, "data", "weeks");
  try {
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json",""))
      .sort();
    res.json({ weeks: files });
  } catch (e) {
    res.json({ weeks: [] });
  }
});

// API: specific week snapshot
app.get("/api/week/:weekKey", (req, res) => {
  const key = req.params.weekKey;
  const file = path.join(__dirname, "data", "weeks", `${key}.json`);
  const fallback = {
    weekKey: key,
    notes: "No data yet for this week. Duplicate an existing file under data/weeks and edit it.",
    titles: [], roster: [], tagTeams: [], factions: [], developmental: []
  };
  sendJson(res, file, fallback);
});

// Health
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`WCW tracker running on http://0.0.0.0:${PORT}`);
  console.log(`Open http://localhost:${PORT} on this machine.`);
});


// ---- Shows storage (per date + show slug) ----
function showSlug(name){
  return name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

// GET /api/show?date=YYYY-MM-DD&show=Show%20Name
app.get("/api/show", (req,res) => {
  const date = req.query.date;
  const showName = req.query.show || "";
  if (!date || !showName) return res.status(400).json({error:"date and show are required"});
  const file = path.join(__dirname,"data","shows",`${date}_${showSlug(showName)}.json`);
  const fallback = {
    date, show: showName, minutes: null, brand: null,
    notes: "",
    matches: [], // [{title, participants:[...], result, rating, notes}]
    segments: [] // [{title, people:[...], notes}]
  };
  sendJson(res, file, fallback);
});

// POST /api/show  {date, show, data:{}}
app.post("/api/show", (req,res) => {
  try{
    const { date, show, data } = req.body || {};
    if (!date || !show || !data) return res.status(400).json({error:"date, show, data required"});
    const dir = path.join(__dirname,"data","shows");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});
    const file = path.join(dir, `${date}_${showSlug(show)}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
    res.json({ ok:true });
  }catch(e){
    res.status(500).json({error:e.message});
  }
});

// POST /api/week/:weekKey/roster  {updates:[{name, disposition, push, status}]}
app.post("/api/week/:weekKey/roster", (req,res) => {
  const key = req.params.weekKey;
  const file = path.join(__dirname,"data","weeks",`${key}.json`);
  try{
    const json = JSON.parse(fs.readFileSync(file,"utf8"));
    const updates = req.body && req.body.updates || [];
    const byName = new Map((json.roster||[]).map(r => [r.name.toLowerCase(), r]));
    for (const u of updates){
      const k = (u.name||"").toLowerCase();
      if (!k) continue;
      const r = byName.get(k) || { name: u.name };
      if (u.disposition !== undefined) r.alignment = u.disposition; // keep internal key 'alignment'
      if (u.push !== undefined) r.push = u.push;
      if (u.status !== undefined) r.status = u.status;
      byName.set(k, r);
    }
    json.roster = [...byName.values()].sort((a,b)=>a.name.localeCompare(b.name));
    fs.writeFileSync(file, JSON.stringify(json,null,2), "utf8");
    res.json({ ok:true, count: updates.length });
  }catch(e){
    res.status(500).json({error:e.message});
  }
});


// ---- Title History storage ----

if (!fs.existsSync(TITLE_DIR)) fs.mkdirSync(TITLE_DIR, { recursive: true });

// GET /api/title-history/:slug
app.get("/api/title-history/:slug", (req,res) => {
  const slug = req.params.slug;
  const file = path.join(TITLE_DIR, `${slug}.json`);
  const fallback = { title: slug, slug, lineage: [] };
  sendJson(res, file, fallback);
});

// POST /api/title-history/:slug  { title, lineage: [] }
app.post("/api/title-history/:slug", (req,res) => {
  try {
    const slug = req.params.slug;
    const { title, lineage } = req.body || {};
    if (!slug || !Array.isArray(lineage)) return res.status(400).json({ error: "title & lineage[] required" });
    const file = path.join(TITLE_DIR, `${slug}.json`);
    fs.writeFileSync(file, JSON.stringify({ title, slug, lineage }, null, 2), "utf8");
    res.json({ ok: true, count: lineage.length });
  } catch(e){
    res.status(500).json({ error: e.message });
  }
});


// ---- Title History storage & importer (Wikipedia) ----

if (!fs.existsSync(TITLE_DIR)) fs.mkdirSync(TITLE_DIR, { recursive: true });

/.test(start) && cells.length >= 4){
            start = $(cells[2]).text().trim();
            end = $(cells[3]).text().trim();
          }
          // clean newlines
          start = start.replace(/\s+/g," ").strip?.() || start.replace(/\s+/g," ");
          end   = end.replace(/\s+/g," ").strip?.() || end.replace(/\s+/g," ");
          if (champion && (/\d{4}/.test(start) || /\d{4}/.test(end))){
            rows.push({ champion, start, end });
          }
        }
      });
    }
  });
  if (rows.length < 5) throw new Error("Could not parse enough rows for "+slug);

  // Normalize ranges, drop notes, trim
  rows = rows.map(r=>({ champion: r.champion.replace(/\[\d+\]/g,""), start: r.start, end: r.end }));

  const payload = { title: slug, slug, lineage: rows };
  const file = path.join(TITLE_DIR, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
  return { ok: true, count: rows.length, file };
}

// Read history
app.get("/api/title-history/:slug", (req,res)=>{
  const file = path.join(TITLE_DIR, `${req.params.slug}.json`);
  sendJson(res, file, { title: req.params.slug, slug: req.params.slug, lineage: [] });
});

// Manual import endpoint
}
});

// Auto-import on startup if files missing


// --- Static mounts for your TEW9 AmP folders (no wildcard search, exact filenames only) ---
const AMP_ROOT = process.env.AMP_ROOT || "C:\\Users\\benjo\\Documents\\Grey Dog Software\\TEW9\\Pictures\\AmP";
app.use('/amp/people',  express.static(path.join(AMP_ROOT, 'People')));
app.use('/amp/belts',   express.static(path.join(AMP_ROOT, 'Belts')));
app.use('/amp/logos',   express.static(path.join(AMP_ROOT, 'Logos')));
app.use('/amp/stables', express.static(path.join(AMP_ROOT, 'Stables')));
app.use('/amp/tv',      express.static(path.join(AMP_ROOT, 'TV')));
app.use('/amp/events',  express.static(path.join(AMP_ROOT, 'Events')));



// ---- Title History (file-based) ----
try { if (!fs.existsSync(TITLE_DIR)) fs.mkdirSync(TITLE_DIR, { recursive: true }); } catch(e){}

function readJsonSafe(p, fallback){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch(e){ return fallback; } }

app.get("/api/title-history/:slug", (req,res) => {
  const file = path.join(TITLE_DIR, `${req.params.slug}.json`);
  res.json(readJsonSafe(file, { title:req.params.slug, slug:req.params.slug, lineage: [] }));
});


// ---- Title History (file-based) ----
const fs = require('fs');
const TITLE_DIR = path.join(__dirname, "data", "title-history");
try { if (!fs.existsSync(TITLE_DIR)) fs.mkdirSync(TITLE_DIR, { recursive: true }); } catch(e){}
function readJsonSafe(p, fallback){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch(e){ return fallback; } }
app.get("/api/title-history/:slug", (req,res) => {
  const file = path.join(TITLE_DIR, `${req.params.slug}.json`);
  res.json(readJsonSafe(file, { title:req.params.slug, slug:req.params.slug, lineage: [] }));
});
