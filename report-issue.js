/* Knovay — "Report an issue" widget.
   A small fixed button; opens a modal where a visitor types a comment and
   (optionally) their email. On submit the report is written straight to Firestore
   via window.knovayFeedback() — no email app is opened. Shows a "thanks"
   confirmation on success and a gentle retry message on failure.

   Requires window.knovayFeedback(payload) -> Promise (provided by auth.js on
   GeoProof, or an inline module on Knovay/Physica).

   Optional overrides (set on window before this script runs):
     window.REPORT_SITE   = "GeoProof";   // label stored with the report
     window.REPORT_ACCENT = "#378ADD";    // button + Send-button colour
     window.REPORT_BOTTOM = "58px";        // distance from the bottom edge (clear a fixed footer)
*/
(function(){
  if (window.__knovayReport) return; window.__knovayReport = true;

  var SITE   = window.REPORT_SITE   || "Knovay";
  var ACCENT = window.REPORT_ACCENT || "#4f6bed";
  var BOTTOM = window.REPORT_BOTTOM || "18px";

  function ready(fn){ if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }

  function injectStyle(){
    if (document.getElementById("kv-report-style")) return;
    var css = [
      "#kv-report-btn{position:fixed;right:18px;bottom:"+BOTTOM+";z-index:2147483000;display:inline-flex;",
        "align-items:center;gap:7px;background:"+ACCENT+";color:#fff;border:none;border-radius:999px;",
        "padding:11px 16px;font:600 14px/1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;cursor:pointer;",
        "box-shadow:0 6px 20px -6px rgba(0,0,0,.45);transition:transform .12s ease,box-shadow .12s ease;}",
      "#kv-report-btn:hover{transform:translateY(-2px);box-shadow:0 10px 26px -8px rgba(0,0,0,.5);}",
      "#kv-report-btn svg{display:block;}",
      "@media(max-width:560px){#kv-report-btn .kv-rlabel{display:none;}#kv-report-btn{padding:12px;}}",
      "#kv-report-ov{position:fixed;inset:0;z-index:2147483001;display:none;align-items:center;",
        "justify-content:center;background:rgba(15,17,23,.55);padding:18px;}",
      "#kv-report-ov.on{display:flex;}",
      "#kv-report-card{width:100%;max-width:440px;background:#fff;color:#1a1a1a;border-radius:16px;",
        "padding:22px 22px 18px;box-shadow:0 30px 80px -20px rgba(0,0,0,.55);box-sizing:border-box;",
        "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;}",
      "#kv-report-card h3{margin:0 0 4px;font-size:18px;font-weight:800;letter-spacing:-.01em;}",
      "#kv-report-card .kv-sub{margin:0 0 15px;font-size:13px;color:#6b7280;line-height:1.5;}",
      "#kv-report-card label{display:block;font-size:11.5px;font-weight:700;color:#374151;",
        "margin:0 0 5px;text-transform:uppercase;letter-spacing:.04em;}",
      "#kv-report-card textarea,#kv-report-card input{width:100%;box-sizing:border-box;border:1px solid #d5d8df;",
        "border-radius:10px;padding:10px 12px;font:400 14px/1.5 inherit;color:#1a1a1a;background:#fff;}",
      "#kv-report-card textarea{min-height:110px;resize:vertical;}",
      "#kv-report-card textarea:focus,#kv-report-card input:focus{outline:none;border-color:"+ACCENT+";",
        "box-shadow:0 0 0 3px rgba(120,140,230,.22);}",
      "#kv-report-card .kv-row{margin:0 0 13px;}",
      "#kv-report-actions{display:flex;align-items:center;justify-content:flex-end;gap:9px;margin-top:4px;}",
      ".kv-btn{border-radius:999px;padding:9px 16px;font:600 13.5px/1 inherit;cursor:pointer;border:1px solid transparent;}",
      ".kv-cancel{background:#fff;border-color:#d5d8df;color:#4b5563;}",
      ".kv-cancel:hover{border-color:#9aa0aa;color:#1a1a1a;}",
      ".kv-send{background:"+ACCENT+";color:#fff;}",
      ".kv-send:hover{filter:brightness(1.06);}",
      ".kv-send:disabled{opacity:.5;cursor:default;}",
      "#kv-report-actions .kv-status{flex:1;text-align:left;font-size:12px;color:#c0392b;line-height:1.35;}",
      ".kv-ok{width:46px;height:46px;border-radius:50%;background:#e7f7ee;color:#1e7a3c;display:grid;place-items:center;font-size:24px;font-weight:800;margin:2px 0 12px;}"
    ].join("");
    var s = document.createElement("style");
    s.id = "kv-report-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function buildButton(){
    if (document.getElementById("kv-report-btn")) return;
    var b = document.createElement("button");
    b.id = "kv-report-btn";
    b.type = "button";
    b.setAttribute("aria-label", "Report an issue");
    b.innerHTML =
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" ' +
      'stroke="#fff" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M12 8v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="12" cy="15" r="1" fill="#fff"/></svg>' +
      '<span class="kv-rlabel">Report an issue</span>';
    b.addEventListener("click", openModal);
    document.body.appendChild(b);
  }

  function buildModal(){
    var ov = document.createElement("div");
    ov.id = "kv-report-ov";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "Report an issue");
    ov.innerHTML =
      '<div id="kv-report-card">' +
        '<h3>Report an issue</h3>' +
        '<p class="kv-sub">Spotted a bug, a wrong answer, or something confusing? Tell us — it goes straight to the Knovay team.</p>' +
        '<div class="kv-row">' +
          '<label for="kv-msg">Your comment</label>' +
          '<textarea id="kv-msg" placeholder="Describe the issue…"></textarea>' +
        '</div>' +
        '<div class="kv-row">' +
          '<label for="kv-email">Your email (optional)</label>' +
          '<input id="kv-email" type="email" placeholder="so we can reply">' +
        '</div>' +
        '<div id="kv-report-actions">' +
          '<span class="kv-status" aria-live="polite"></span>' +
          '<button class="kv-btn kv-cancel" type="button">Cancel</button>' +
          '<button class="kv-btn kv-send" type="button" disabled>Send report</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);

    var msg    = ov.querySelector("#kv-msg");
    var email  = ov.querySelector("#kv-email");
    var send   = ov.querySelector(".kv-send");
    var cancel = ov.querySelector(".kv-cancel");

    msg.addEventListener("input", function(){ send.disabled = msg.value.trim().length === 0; });
    cancel.addEventListener("click", closeModal);
    send.addEventListener("click", function(){ submit(msg.value, email.value); });
    ov.addEventListener("click", function(e){ if (e.target === ov) closeModal(); });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && ov.classList.contains("on")) closeModal();
    });
    return ov;
  }

  function openModal(){
    injectStyle();
    var old = document.getElementById("kv-report-ov");
    if (old && old.parentNode) old.parentNode.removeChild(old);   // fresh form each open
    var ov = buildModal();
    ov.classList.add("on");
    var msg = ov.querySelector("#kv-msg");
    if (msg) setTimeout(function(){ try { msg.focus(); } catch(e){} }, 30);
  }
  function closeModal(){
    var ov = document.getElementById("kv-report-ov");
    if (ov) ov.classList.remove("on");
  }

  function submit(comment, replyEmail){
    comment = (comment || "").trim();
    if (!comment) return;
    replyEmail = (replyEmail || "").trim();
    var ov = document.getElementById("kv-report-ov");
    if (!ov) return;
    var send = ov.querySelector(".kv-send");
    var status = ov.querySelector(".kv-status");
    if (status) status.textContent = "";
    if (send){ send.disabled = true; send.textContent = "Sending…"; }
    var payload = { message: comment, email: replyEmail, site: SITE, page: location.href, ua: navigator.userAgent };
    function fail(){
      if (send){ send.disabled = false; send.textContent = "Send report"; }
      if (status) status.textContent = "Couldn't send just now — please try again.";
    }
    try {
      if (typeof window.knovayFeedback === "function") {
        window.knovayFeedback(payload).then(showThanks, fail);
      } else { fail(); }
    } catch(e){ fail(); }
  }

  function showThanks(){
    var ov = document.getElementById("kv-report-ov");
    if (!ov) return;
    var card = ov.querySelector("#kv-report-card");
    if (!card) return;
    card.innerHTML =
      '<div class="kv-ok" aria-hidden="true">&#10003;</div>' +
      '<h3>Thanks for the report!</h3>' +
      '<p class="kv-sub">It went straight to the Knovay team — we appreciate you taking the time.</p>' +
      '<div id="kv-report-actions"><button class="kv-btn kv-send kv-done" type="button">Close</button></div>';
    var d = card.querySelector(".kv-done");
    if (d) d.addEventListener("click", closeModal);
  }

  ready(function(){ injectStyle(); buildButton(); });
})();
