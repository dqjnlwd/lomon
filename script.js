/* ============================================================
   ✏️  EDIT EVERYTHING IN THIS BLOCK
   ============================================================ */
const CONFIG = {
  // Capitals, spaces and punctuation are ignored, so
  // "piggy", "Piggy", "PIGGY" and "Pig-gy" all work with this one entry.
  answers: ["piggy"],

  // hints[0] shows first. hints[1] shows after 2 wrong tries.
  hints: [
    "put the nickname whatever u called me ",
    "It's the name you used to call me, a cute little animal name. 🐷"
  ],

  // Your WhatsApp group invite link
  whatsappLink: "https://chat.whatsapp.com/DnEcJVXnf0UIsiKejIXtqd",

  // File name of your QR image (must sit next to index.html)
  qrImage: "qr.jpeg"
};
/* ============================================================ */

const gate     = document.getElementById("gate");
const reveal   = document.getElementById("reveal");
const form     = document.getElementById("codeForm");
const input    = document.getElementById("codeInput");
const errorEl  = document.getElementById("error");
const hintText = document.getElementById("hintText");

let attempts = 0;
let unlocked = false;

/* lenient comparison: lowercase, strip accents, spaces and punctuation */
function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

const validAnswers = CONFIG.answers.map(normalize);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (unlocked) return;

  const guess = normalize(input.value);

  if (!guess) {
    errorEl.textContent = "Type something first 🧸";
    return;
  }

  if (validAnswers.includes(guess)) {
    unlocked = true;
    errorEl.textContent = "";
    input.blur();
    unlock();
    return;
  }

  /* wrong codeword */
  attempts++;
  errorEl.textContent = "Hmm, that's not it… try again? 💭";
  gate.classList.remove("shake");
  void gate.offsetWidth;          /* restart the animation */
  gate.classList.add("shake");
  input.select();

  /* reveal the next hint after 2 wrong tries */
  if (attempts >= 2 && CONFIG.hints[1]) {
    hintText.textContent = CONFIG.hints[1];
  }
});

function unlock() {
  /* fill in the real link + QR before showing anything */
  document.getElementById("waBtn").href = CONFIG.whatsappLink;
  document.getElementById("qrImg").src = CONFIG.qrImage;

  gate.classList.add("is-out");

  let done = false;
  const swap = () => {
    if (done) return;
    done = true;
    document.getElementById("card").classList.add("revealed");
    gate.classList.add("is-hidden");
    reveal.classList.remove("is-hidden");
    reveal.classList.add("is-in");
    burst();
  };

  gate.addEventListener("animationend", swap, { once: true });
  setTimeout(swap, 500); /* fallback if animations are disabled */
}

/* little hearts + teddies floating up */
function burst() {
  const icons = ["💗", "🧸", "💖", "🌸", "💕"];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement("span");
    el.className = "pop";
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = 10 + Math.random() * 80 + "vw";
    el.style.top  = 70 + Math.random() * 20 + "vh";
    el.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
    el.style.setProperty("--rot", (Math.random() * 80 - 40) + "deg");
    el.style.animationDelay = Math.random() * 0.5 + "s";
    el.style.fontSize = 1 + Math.random() * 1.1 + "rem";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }
}
