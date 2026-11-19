/* Personal Site — all behavior in one file (plain JavaScript). */

const $ = (id) => document.getElementById(id);
const esc = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

/* ---------- fill static text from data ---------- */
$("brandInitials").textContent = PROFILE.initials;
$("statusText").textContent = PROFILE.status;
$("heroRole").textContent = "// " + PROFILE.role;
$("heroName").textContent = PROFILE.name;
$("heroHeadline").textContent = PROFILE.headline;
$("footerName").textContent = PROFILE.name;
$("footerYear").textContent = new Date().getFullYear();
$("timerTotal").textContent = "/ " + PROFILE.challengeSeconds + "s";
$("contactMeta").textContent = PROFILE.location + " · " + PROFILE.status;

const sectionHeadings = {
  aboutHeading: { index: "02", label: "about", title: "Logic over luck" },
  skillsHeading: { index: "03", label: "skill matrix", title: "Click a node, it compiles" },
  hobbiesHeading: { index: "04", label: "off the clock", title: "What I do when the build breaks" },
  contactHeading: { index: "05", label: "exit", title: "Say hi at the terminal" },
};
for (const [id, h] of Object.entries(sectionHeadings)) {
  $(id).innerHTML =
    '<span class="label">' + esc(h.index + " // " + h.label) + "</span><h2>" + esc(h.title) + "</h2>";
}

/* ---------- boot log ---------- */
$("bootLog").innerHTML = PROFILE.bootLines
  .map((line, i) =>
    '<p style="animation-delay:' + (i * 300 + 200) + 'ms"><span class="ok">[ ok ]</span> ' + esc(line) + "</p>"
  )
  .join("");

/* ---------- ticker ---------- */
const tickerGroup = PROFILE.facts
  .map((fact) => '<span class="ticker-item"><span class="tick"></span>' + esc(fact) + "</span>")
  .join("");
$("tickerTrack").innerHTML =
  '<div style="display:flex;align-items:center;gap:3rem">' + tickerGroup + "</div>" +
  '<div style="display:flex;align-items:center;gap:3rem" aria-hidden="true">' + tickerGroup + "</div>";

/* ---------- about: bio + images ---------- */
$("bio").innerHTML = PROFILE.bio.map((p) => "<p>" + esc(p) + "</p>").join("");
$("deskImg").src = PROFILE.images.desk;
$("keyboardImg").src = PROFILE.images.keyboard;
$("synthImg").src = PROFILE.images.synth;

/* ---------- skills ---------- */
const svgPlus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const svgMinus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>';

let activeSkillId = PROFILE.skills[0].id;
let compiling = false;

function renderSkillDetail() {
  const active = PROFILE.skills.find((s) => s.id === activeSkillId) || PROFILE.skills[0];
  const chips = active.stack.split(" · ").map((c) => "<span>" + esc(c) + "</span>").join("");
  $("skillDetail").innerHTML =
    '<p class="module">module :: ' + esc(active.id) + "</p>" +
    "<h3>" + esc(active.label) + "</h3>" +
    '<p class="level">' + (compiling ? "compiling…" : "level " + active.level + "%") + "</p>" +
    '<p class="blurb">' + esc(active.blurb) + "</p>" +
    '<div class="skill-chips">' + chips + "</div>";
}

function renderSkills() {
  $("skillsList").innerHTML = PROFILE.skills
    .map((skill) => {
      const active = skill.id === activeSkillId;
      return (
        '<button type="button" data-id="' + skill.id + '" class="skill-btn' + (active ? " active" : "") + '"' +
        ' aria-pressed="' + active + '" aria-label="' + esc(skill.label + ", " + skill.level + " percent proficiency") + '">' +
        '<span class="node">node :: ' + esc(skill.id) + "</span>" +
        '<span class="name">' + esc(skill.label) + "</span>" +
        '<span class="bar-track"><span class="bar-fill" style="width:' + skill.level + '%"></span></span>' +
        "</button>"
      );
    })
    .join("");
}

$("skillsList").addEventListener("click", (event) => {
  const btn = event.target.closest(".skill-btn");
  if (!btn) return;
  const id = btn.dataset.id;
  if (id === activeSkillId) return;
  compiling = true;
  activeSkillId = id;
  renderSkills();
  renderSkillDetail();
  setTimeout(() => {
    compiling = false;
    renderSkillDetail();
  }, 420);
});
renderSkills();
renderSkillDetail();

/* ---------- hobbies ---------- */
let openHobbyId = PROFILE.hobbies[0].id;

function renderHobbies() {
  $("hobbiesGrid").innerHTML = PROFILE.hobbies
    .map((hobby) => {
      const open = hobby.id === openHobbyId;
      return (
        '<button type="button" data-id="' + hobby.id + '" class="hobby-btn' + (open ? " open" : "") + '"' +
        ' aria-expanded="' + open + '">' +
        '<span class="row">' + esc(hobby.tag) + (open ? svgMinus : svgPlus) + "</span>" +
        '<span class="name">' + esc(hobby.label) + "</span>" +
        (open ? '<span class="story">' + esc(hobby.story) + "</span>" : "") +
        "</button>"
      );
    })
    .join("");
}
$("hobbiesGrid").addEventListener("click", (event) => {
  const btn = event.target.closest(".hobby-btn");
  if (!btn) return;
  openHobbyId = btn.dataset.id === openHobbyId ? null : btn.dataset.id;
  renderHobbies();
});
renderHobbies();

/* ---------- terminal ---------- */
const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
};

function buildResponse(command) {
  switch (command) {
    case "help": return "whoami · skills · hobbies · contact · clear";
    case "whoami": return PROFILE.name + " — " + PROFILE.role + ", " + PROFILE.location + ".";
    case "skills": return PROFILE.skills.map((s) => s.label + " (" + s.level + "%)").join(" · ");
    case "hobbies": return PROFILE.hobbies.map((h) => h.label).join(" · ");
    case "contact": return "unlocked → " + PROFILE.links.email;
    case "sudo make me a sandwich": return "no. instead: " + PROFILE.funFact;
    default: return 'command not found: ' + command + ' — try "help"';
  }
}

let revealed = false;
const output = $("terminalOutput");
output.innerHTML = '<p class="out">Welcome. Type "help" and press run.</p>';

function printLine(kind, text) {
  const p = document.createElement("p");
  p.className = kind === "in" ? "in" : "out";
  p.innerHTML = (kind === "in" ? '<span class="prompt">$ </span>' : "") + esc(text);
  output.appendChild(p);
  output.scrollTop = output.scrollHeight;
}

function runCommand(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;
  if (command === "clear") {
    output.innerHTML = "";
    $("terminalInput").value = "";
    return;
  }
  printLine("in", raw.trim());
  printLine("out", buildResponse(command));
  if (command === "contact" && !revealed) {
    revealed = true;
    const links = $("contactLinks");
    links.innerHTML =
      '<a href="mailto:' + esc(PROFILE.links.email) + '">' + ICONS.mail + esc(PROFILE.links.email) + "</a>" +
      '<a href="' + esc(PROFILE.links.github) + '" target="_blank" rel="noreferrer">' + ICONS.github + "github</a>" +
      '<a href="' + esc(PROFILE.links.linkedin) + '" target="_blank" rel="noreferrer">' + ICONS.linkedin + "linkedin</a>";
    links.classList.add("visible");
    document.querySelector(".contact-locked").classList.add("hidden");
    const card = $("contactCard");
    card.classList.add("glitch");
    setTimeout(() => card.classList.remove("glitch"), 950);
  }
  $("terminalInput").value = "";
}

$("terminalForm").addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand($("terminalInput").value);
});

/* "/" anywhere focuses the terminal input */
window.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== $("terminalInput")) {
    event.preventDefault();
    $("terminalInput").focus();
  }
});

/* locked message (kept in sync with ContactCard) */
const lockedMsg = document.createElement("p");
lockedMsg.className = "contact-locked";
lockedMsg.innerHTML =
  'Locked. Type <span class="text-primary">contact</span> in the terminal and hit run.';
$("contactCard").insertBefore(lockedMsg, $("contactMeta"));

/* ---------- typewriter (hero taglines) ---------- */
let typed = "";
let lineIndex = 0;
function typeStep() {
  const full = PROFILE.taglines[lineIndex];
  if (typed.length < full.length) {
    typed = full.slice(0, typed.length + 1);
    $("typed").textContent = typed;
    setTimeout(typeStep, 40);
  } else {
    setTimeout(() => {
      typed = "";
      lineIndex = (lineIndex + 1) % PROFILE.taglines.length;
      $("typed").textContent = "";
      typeStep();
    }, 2400);
  }
}
typeStep();

/* ---------- cursor glow + hero tilt ---------- */
window.addEventListener("pointermove", (event) => {
  $("glowDot").style.transform =
    "translate3d(" + (event.clientX - 280) + "px, " + (event.clientY - 280) + "px, 0)";
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;
  $("heroHeading").style.transform = "translate3d(" + x * 16 + "px, " + y * 10 + "px, 0)";
});

/* ---------- about image parallax ---------- */
const aboutWrap = $("aboutImageWrap");
window.addEventListener("scroll", () => {
  aboutWrap.style.transform = "translateY(-" + Math.min(window.scrollY * 0.06, 70) + "px)";
}, { passive: true });

/* ---------- reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);
[
  $("aboutImages"), $("skillsList"), $("skillDetail").closest(".skill-detail-wrap"),
  $("hobbiesGrid"), $("bio"), document.querySelector(".code-block"),
].forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

/* ---------- 45s session timer ---------- */
const start = Date.now();
let cleared = false;
let minimized = false;

function setTimerVisible() {
  $("sessionTimer").classList.toggle("hidden", minimized);
  $("timerRestore").classList.toggle("hidden", !minimized);
}

$("timerMin").addEventListener("click", () => {
  minimized = true;
  setTimerVisible();
});
$("timerRestore").addEventListener("click", () => {
  minimized = false;
  setTimerVisible();
});

function timerTick() {
  const seconds = (Date.now() - start) / 1000;
  if (!minimized) {
    $("timerSec").textContent = Math.floor(seconds) + "s";
    $("timerFill").style.width = Math.min(seconds / PROFILE.challengeSeconds, 1) * 100 + "%";
  } else {
    $("timerMinLabel").textContent =
      (cleared ? PROFILE.challengeSeconds + "s cleared" : Math.floor(seconds) + "s / " + PROFILE.challengeSeconds + "s");
  }
  if (!cleared && seconds >= PROFILE.challengeSeconds) {
    cleared = true;
    if (!minimized) {
      $("timerSec").classList.add("cleared");
      $("timerMsg").innerHTML =
        '<span class="cleared-tag">cleared · </span>' + esc(PROFILE.funFact);
    }
    if (typeof confetti === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      confetti({
        particleCount: 130, spread: 85, startVelocity: 42,
        origin: { x: 0.82, y: 0.85 },
        colors: ["#00FF41", "#E0E0E0", "#24D07A"],
      });
    }
  } else if (!cleared && !minimized) {
    $("timerMsg").textContent =
      "keep scrolling — something happens at " + PROFILE.challengeSeconds + "s.";
  }
}
setInterval(timerTick, 100);
timerTick();