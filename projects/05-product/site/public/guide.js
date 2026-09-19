(function () {
  "use strict";
  var send = function (path, payload) {
    try {
      return fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload), keepalive: true, credentials: "same-origin" });
    } catch (e) { return Promise.reject(e); }
  };

  // Trailer measurement: play, quartiles, complete. No identity beyond the household cookie.
  document.querySelectorAll("[data-player]").forEach(function (wrap) {
    var video = wrap.querySelector("[data-video]");
    var showId = wrap.getAttribute("data-show");
    if (!video || !showId) return;
    var sent = {};
    var mark = function (kind, pct) {
      var key = kind + ":" + pct;
      if (sent[key]) return;
      sent[key] = true;
      send("/api/events", { showId: showId, kind: kind, pct: pct });
    };
    video.addEventListener("play", function () { mark("play", 0); });
    video.addEventListener("timeupdate", function () {
      if (!video.duration) return;
      var p = (video.currentTime / video.duration) * 100;
      [25, 50, 75].forEach(function (q) { if (p >= q) mark("progress", q); });
    });
    video.addEventListener("ended", function () { mark("complete", 100); });
  });

  // Vote: one per household, changeable.
  document.querySelectorAll("[data-vote]").forEach(function (box) {
    var showId = box.getAttribute("data-show");
    var note = box.querySelector("[data-note]");
    box.querySelectorAll(".vote").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-value");
        box.querySelectorAll(".vote").forEach(function (b) { b.classList.remove("is-on"); });
        btn.classList.add("is-on");
        send("/api/vote", { showId: showId, value: value }).then(function (r) {
          if (note) note.textContent = r && r.ok ? (value === "up" ? "Counted. Thank you." : "Counted. Thanks for the honesty.") : "Could not record that. Try again.";
        }).catch(function () { if (note) note.textContent = "Could not record that. Try again."; });
      });
    });
  });

  // Parent sign-up.
  document.querySelectorAll("[data-signup]").forEach(function (form) {
    var note = form.querySelector("[data-note]");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = form.querySelector("input[name=email]");
      var parent = form.querySelector("input[name=parent]");
      send("/api/signup", { email: email ? email.value : "", parent: !!(parent && parent.checked) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (x) {
          if (note) note.textContent = x.ok ? (x.j.status === "exists" ? "You are already on the list." : "Seat saved. See you on the night.") : (x.j.error || "Could not save that.");
          if (x.ok) form.classList.add("is-done");
        })
        .catch(function () { if (note) note.textContent = "Could not save that. Try again."; });
    });
  });
})();
