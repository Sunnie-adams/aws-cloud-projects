// ─── COUNTDOWN TIMER ──────────────────────────────────────────────────────────
// Set your launch date here — change to your actual target date
const LAUNCH_DATE = new Date("2025-09-01T00:00:00").getTime();

function updateCountdown() {
  const now  = new Date().getTime();
  const diff = LAUNCH_DATE - now;

  if (diff <= 0) {
    document.getElementById("days").textContent    = "00";
    document.getElementById("hours").textContent   = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, "0");

  document.getElementById("days").textContent    = pad(days);
  document.getElementById("hours").textContent   = pad(hours);
  document.getElementById("minutes").textContent = pad(minutes);
  document.getElementById("seconds").textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ─── EMAIL FORM ───────────────────────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const input   = e.target.querySelector(".notify-input");
  const success = document.getElementById("form-success");
  const note    = e.target.querySelector(".form-note");

  // Simple email validation
  if (!input.value || !input.value.includes("@")) return;

  // In production: replace this with your actual form handler
  // e.g. Formspree, AWS SES, Mailchimp API, etc.
  console.log("Email captured:", input.value);

  // Show success state
  input.value = "";
  e.target.querySelector(".form-inner").style.opacity = "0.4";
  e.target.querySelector(".form-inner").style.pointerEvents = "none";
  note.style.display = "none";
  success.style.display = "block";
}

// ─── TYPING EFFECT FOR TAG TEXT ───────────────────────────────────────────────
const tagEl   = document.querySelector(".tag-text");
const phrases = [
  "// initializing_systems...",
  "// cloud_infrastructure.build()",
  "// deploying_to_aws...",
  "// high_availability.enabled",
  "// ssl_certificate.installed",
];
let phraseIndex = 0;
let charIndex   = 0;
let deleting    = false;
let typeTimeout;

function type() {
  const current = phrases[phraseIndex];

  if (!deleting) {
    tagEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      typeTimeout = setTimeout(type, 2200);
      return;
    }
  } else {
    tagEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  typeTimeout = setTimeout(type, deleting ? 40 : 70);
}

// Start typing after page load animation completes
setTimeout(type, 1400);
