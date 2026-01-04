// --- Destinations for ?goto=auto-redirect ---
const DESTINATIONS = {
  legal: "https://innerworklegalservices.com/",
  advisors: "https://innerworkadvisorsllp.com/",
  uk: "https://innerworkadvisors.co.uk/",
  financials: "https://innerworkfinancials.com/",
};

function route(key) {
  const base = DESTINATIONS[key];
  if (!base) return;
  // carry through common UTM params (optional)
  const carry = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  const qp = new URLSearchParams(location.search);
  const kept = new URLSearchParams();
  carry.forEach((k) => qp.has(k) && kept.set(k, qp.get(k)));
  const url = kept.toString() ? `${base}?${kept}` : base;

  // open in a new tab without giving it access to window.opener
  const w = window.open(url, "_blank");
  if (w) w.opener = null;
}

document.addEventListener("DOMContentLoaded", () => {
  // footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ?goto=legal|advisors|uk|financials
  const goto = new URLSearchParams(location.search).get("goto");
  if (goto && DESTINATIONS[goto.toLowerCase()]) route(goto.toLowerCase());

  // mobile nav toggle
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".top-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      nav.classList.toggle("show");
    });
  }

  // Office Modal Logic
  const modal = document.getElementById("office-modal");
  const closeBtn = document.querySelector(".modal-close");
  const modalCta = document.querySelector(".modal-cta");

  // Key for session storage
  const SEEN_KEY = "iwg_office_announcement_seen";

  function closeModal() {
    if (modal) {
      modal.classList.remove("show");
      // Mark as seen when closed or acted upon
      sessionStorage.setItem(SEEN_KEY, "true");
    }
  }

  // Show if not seen
  if (!sessionStorage.getItem(SEEN_KEY) && modal) {
    // Small delay for better UX (don't pop immediately on load)
    setTimeout(() => {
      modal.classList.add("show");
    }, 1500);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modalCta) modalCta.addEventListener("click", closeModal);

  // Close on outside click
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }
});
