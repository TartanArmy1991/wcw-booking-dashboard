
// Common helpers used by all pages
const $ = (sel, el=document) => el.querySelector(sel);

function toISODate(d){
  const z = n => `${n}`.padStart(2,'0');
  return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`;
}
function mondayOfWeek(date){
  const d = new Date(date);
  const day = d.getUTCDay(); // 0..6 Sun..Sat
  const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0,0,0,0);
  return d;
}
function getQueryDate(){
  const p = new URLSearchParams(location.search);
  const val = p.get("date");
  const d = val ? new Date(val) : new Date("2000-01-03");
  return isNaN(d) ? new Date("2000-01-03") : d;
}
function setDatePicker(){
  const picker = $("#datePicker");
  const d = getQueryDate();
  picker.value = toISODate(d);
  picker.addEventListener("change", (e)=>{
    const v = e.target.value;
    const url = new URL(location.href);
    url.searchParams.set("date", v);
    location.href = url.toString();
  });
}
async function fetchJSON(url){ const res = await fetch(url); return res.json(); }
async function loadWeekSnapshot(){
  const d = getQueryDate();
  const monday = mondayOfWeek(d);
  const weekKey = toISODate(monday);
  const snap = await fetchJSON(`/api/week/${weekKey}`);
  return { weekKey, snap };
}
function markActiveNav(){
  const path = location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(a=>{
    const file = a.getAttribute("href").split("/").pop();
    if (file === path || (path==="" && file==="index.html")) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  setDatePicker();
  markActiveNav();
});


function shiftWeek(days){
  const d = getQueryDate();
  d.setUTCDate(d.getUTCDate() + days);
  const url = new URL(location.href);
  url.searchParams.set("date", toISODate(d));
  location.href = url.toString();
}

function wireArrows(){
  const prev = document.getElementById("btnPrev");
  const next = document.getElementById("btnNext");
  if (prev) prev.addEventListener("click", ()=>shiftWeek(-7));
  if (next) next.addEventListener("click", ()=>shiftWeek(+7));
}

document.addEventListener("DOMContentLoaded", wireArrows);


let __PEOPLE_FILES = null;
async function loadPeopleFiles(){
  if (__PEOPLE_FILES) return __PEOPLE_FILES;
  try{
    __PEOPLE_FILES = await (await fetch('/data/people-files.json')).json();
  }catch(e){ __PEOPLE_FILES = {}; }
  return __PEOPLE_FILES;
}

// Returns an absolute URL to the portrait using exact filename mapping; no wildcard search.
async function portraitUrlExact(name){
  const map = await loadPeopleFiles();
  const key = name || '';
  const file = map[key] || null;
  if (!file) return null;
  return '/amp/people/' + encodeURIComponent(file);
}
