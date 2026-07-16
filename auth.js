/* GeoProof — auth + usage counter + per-user sync (loaded on every page by site-chrome.js).
   - Reflects login state in the header (Sign in  <->  name + Log out).
   - Counts unique visitors (once per browser) in Firestore; shows the total live in the footer.
   - When signed in, syncs favorites (the ☆ Save buttons) and the quiz best-score to the
     user's account, so they follow them across devices and browsers.
   Safe when Firebase isn't configured yet: if FIREBASE_READY is false, this file
   does nothing and the site behaves exactly as before. */

import { auth, db, FIREBASE_READY } from "./firebase-config.js";
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, onSnapshot, increment }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

var FAV_KEY  = "gp:favorites";
var BEST_KEY = "gp:quizbestpct";
var currentUid = null;

if (FIREBASE_READY) {
  ready(init);
}

function ready(fn){
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
}

/* Wait for site-chrome to have built the header/footer, then wire everything. */
function init(){
  injectStyle();
  whenPresent(".gp-nav", buildAccountControl, 40);
  whenPresent(".gp-footer", buildVisitCounter, 40);
  countVisit();
  initSync();
}

function whenPresent(sel, fn, tries){
  var el = document.querySelector(sel);
  if (el) { fn(el); return; }
  if (tries <= 0) return;
  setTimeout(function(){ whenPresent(sel, fn, tries - 1); }, 50);
}

/* ---------- account control in the header ---------- */
function buildAccountControl(nav){
  if (document.getElementById("gp-acct-wrap")) return;
  var wrap = document.createElement("span");
  wrap.id = "gp-acct-wrap";
  wrap.className = "gp-acct-wrap";
  // insert just before the theme toggle so it sits at the end of the nav links
  var themeBtn = nav.querySelector("#gp-theme-btn");
  if (themeBtn) nav.insertBefore(wrap, themeBtn); else nav.appendChild(wrap);

  onAuthStateChanged(auth, function(user){
    if (user){
      var name = displayName(user);
      wrap.innerHTML =
        '<span class="gp-acct-name" title="' + escAttr(user.email || "") + '">' + escHtml(name) + '</span>' +
        '<button type="button" class="gp-acct-out" id="gp-logout">Log out</button>';
      var out = document.getElementById("gp-logout");
      if (out) out.addEventListener("click", function(){
        signOut(auth).catch(function(){});
      });
    } else {
      wrap.innerHTML = '<a class="gp-acct-in" href="login.html">Sign in</a>';
    }
  });
}

function displayName(user){
  if (user.displayName) return user.displayName;
  var e = user.email || "there";
  return e.split("@")[0];
}

/* ---------- unique-visitor counter in the footer ---------- */
function buildVisitCounter(footer){
  if (document.getElementById("gp-visits-wrap")) return;
  var dot = document.createElement("span");
  dot.className = "gp-dot gp-foot-sm";
  dot.innerHTML = "&middot;";
  var span = document.createElement("span");
  span.className = "gp-foot-sm";
  span.id = "gp-visits-wrap";
  span.innerHTML = '<span id="gp-visits">&hellip;</span> visitors';
  footer.appendChild(dot);
  footer.appendChild(span);
}

function countVisit(){
  var ref = doc(db, "stats", "site");
  var firstTime = false;
  try { firstTime = !localStorage.getItem("gp:visited"); } catch(e){}
  if (firstTime){
    setDoc(ref, { visitors: increment(1) }, { merge: true })
      .then(function(){ try { localStorage.setItem("gp:visited", "1"); } catch(e){} })
      .catch(function(){});
  }
  // live total, updates the footer whenever the count changes
  try {
    onSnapshot(ref, function(snap){
      var n = Number((snap.exists() && snap.data().visitors) || 0);
      var wrap = document.getElementById("gp-visits-wrap");
      if (wrap) wrap.innerHTML = '<span id="gp-visits">' + n.toLocaleString() + '</span> ' + (n === 1 ? "visitor" : "visitors");
      var hero = document.getElementById("statVisitors");   // live count in the home-page hero
      if (hero) hero.textContent = n.toLocaleString();
    });
  } catch(e){}
}

/* ---------- per-user favorites + quiz best-score sync ---------- */
function lsArr(k){ try { return JSON.parse(localStorage.getItem(k)) || []; } catch(e){ return []; } }
function lsInt(k){ try { return parseInt(localStorage.getItem(k) || "0", 10) || 0; } catch(e){ return 0; } }
function lsSet(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
function union(a, b){ var out = a.slice(); for (var i = 0; i < b.length; i++){ if (out.indexOf(b[i]) < 0) out.push(b[i]); } return out; }

function initSync(){
  onAuthStateChanged(auth, function(user){
    if (user){ currentUid = user.uid; mergeOnLogin(user); }
    else { currentUid = null; }
  });
  // pushed whenever the user stars/unstars an explorer or finishes a better quiz round
  window.addEventListener("gp:favchange", pushFavorites);
  window.addEventListener("gp:quizchange", pushQuizBest);
}

// On sign-in, union this browser's data with the account's so nothing is lost,
// then write the merged result to both localStorage and the cloud.
function mergeOnLogin(user){
  var ref = doc(db, "users", user.uid);
  getDoc(ref).then(function(snap){
    var cloud = (snap && snap.exists()) ? (snap.data() || {}) : {};
    var cloudFav  = Array.isArray(cloud.favorites) ? cloud.favorites : [];
    var cloudBest = Number(cloud.quizBestPct || 0);
    var mergedFav  = union(lsArr(FAV_KEY), cloudFav);
    var mergedBest = Math.max(lsInt(BEST_KEY), cloudBest);
    lsSet(FAV_KEY, JSON.stringify(mergedFav));
    lsSet(BEST_KEY, String(mergedBest));
    setDoc(ref, { favorites: mergedFav, quizBestPct: mergedBest, email: user.email || "" }, { merge: true }).catch(function(){});
    try { window.dispatchEvent(new CustomEvent("gp:favsync")); } catch(e){}
    try { window.dispatchEvent(new CustomEvent("gp:quizsync")); } catch(e){}
  }).catch(function(){});
}

function pushFavorites(){
  if (!currentUid) return;
  setDoc(doc(db, "users", currentUid), { favorites: lsArr(FAV_KEY) }, { merge: true }).catch(function(){});
}
function pushQuizBest(){
  if (!currentUid) return;
  setDoc(doc(db, "users", currentUid), { quizBestPct: lsInt(BEST_KEY) }, { merge: true }).catch(function(){});
}

/* ---------- styles (theme-aware) ---------- */
function injectStyle(){
  if (document.getElementById("gp-auth-style")) return;
  var css =
    ".gp-acct-wrap{display:inline-flex;align-items:center;gap:10px;}" +
    ".gp-acct-in{text-decoration:none;color:#185FA5;font-size:14px;font-weight:600;}" +
    ".gp-acct-in:hover{text-decoration:underline;}" +
    ".gp-acct-name{font-size:13.5px;font-weight:600;color:#1a1a1a;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}" +
    ".gp-acct-out{border:1px solid #d8d8d8;background:#fff;color:#555;border-radius:999px;padding:6px 13px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}" +
    ".gp-acct-out:hover{border-color:#1a1a1a;color:#1a1a1a;}" +
    "html[data-theme=dark] .gp-acct-in{color:#7fb2ec;}" +
    "html[data-theme=dark] .gp-acct-name{color:#f0f0f2;}" +
    "html[data-theme=dark] .gp-acct-out{background:#2a2d35;border-color:#3a3d45;color:#cfd2d8;}" +
    "html[data-theme=dark] .gp-acct-out:hover{border-color:#6b6f78;color:#fff;}" +
    "@media(max-width:520px){.gp-acct-name{max-width:76px;}}";
  var s = document.createElement("style");
  s.id = "gp-auth-style";
  s.textContent = css;
  document.head.appendChild(s);
}

function escHtml(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escAttr(s){ return escHtml(s).replace(/"/g,"&quot;"); }
