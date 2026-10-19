const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;

/*========== loader =========*/
// Lift the loader as soon as the fonts are in, and never later than 1.5s —
// images keep loading behind the page instead of holding visitors up.
const loader = document.getElementById("loaderContainer");
document.body.classList.add("is-loading");

let loaderHidden = false;
const hideLoader = () => {
  if (loaderHidden) return;
  loaderHidden = true;
  loader.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
  // let the hero title rise once the loader has started fading
  document.querySelectorAll(".hero .kinetic").forEach((el) => el.classList.add("is-visible"));
};

Promise.race([
  document.fonts ? document.fonts.ready : Promise.resolve(),
  new Promise((resolve) => setTimeout(resolve, 1500)),
]).then(hideLoader);

/*========== toggle icon navbar =========*/
const menuIcon = document.querySelector("#menu-icon");
const menuGlyph = menuIcon.querySelector("i");
const navbar = document.querySelector(".navbar");

const setMenu = (open) => {
  navbar.classList.toggle("active", open);
  menuGlyph.classList.toggle("bx-menu", !open);
  menuGlyph.classList.toggle("bx-x", open);
  menuIcon.setAttribute("aria-expanded", String(open));
};

menuIcon.addEventListener("click", () => {
  setMenu(!navbar.classList.contains("active"));
});

navbar.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

/*========== scroll: active link, sticky header, progress, hero parallax =========*/
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("header nav a");
const header = document.querySelector("header");
const progress = document.querySelector(".scroll-progress");
const hero = document.querySelector(".hero");
const parallaxLines = reduceMotion ? [] : document.querySelectorAll("[data-parallax]");

let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  const probe = y + window.innerHeight * 0.35;

  sections.forEach((sec) => {
    if (probe >= sec.offsetTop && probe < sec.offsetTop + sec.offsetHeight) {
      const id = sec.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    }
  });

  header.classList.toggle("sticky", y > 24);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

  // hero name lines drift apart while the hero is on screen
  if (y < hero.offsetHeight) {
    parallaxLines.forEach((line) => {
      line.style.transform = `translate3d(${y * parseFloat(line.dataset.parallax)}px, 0, 0)`;
    });
  }

  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true }
);
window.addEventListener("resize", onScroll, { passive: true });
onScroll();

/*========== kinetic headings: index each masked line =========*/
document.querySelectorAll(".kinetic").forEach((heading) => {
  heading.querySelectorAll(".line").forEach((line, i) => line.style.setProperty("--i", i));
});

/*========== scroll reveal + count-up =========*/
const reveals = document.querySelectorAll(".reveal, .kinetic:not(.hero .kinetic)");

// stagger siblings that share a parent (cards in a grid, lines of copy)
reveals.forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  const index = siblings.indexOf(el);
  if (index > 0) el.style.setProperty("--reveal-delay", Math.min(index, 6) * 80 + "ms");
});

const countUp = (el) => {
  const target = parseInt(el.dataset.count, 10);
  if (reduceMotion || !target) return;
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step);
  };
  el.textContent = "0";
  requestAnimationFrame(step);
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        observer.unobserve(el);
        el.querySelectorAll("[data-count]").forEach(countUp);
        // drop the stagger once revealed so hover transitions respond immediately
        setTimeout(() => el.style.removeProperty("--reveal-delay"), 1400);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/*========== cursor-tracked card glow =========*/
if (canHover) {
  document.querySelectorAll(".glow").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - rect.left + "px");
        card.style.setProperty("--my", e.clientY - rect.top + "px");
      },
      { passive: true }
    );
  });
}

/*========== contact form: submit in the background, confirm inline =========*/
const form = document.querySelector(".contact-form");
const formStatus = form.querySelector(".form-status");
const submitBtn = form.querySelector('button[type="submit"]');
const submitLabel = submitBtn.innerHTML;

const showStatus = (type, message) => {
  formStatus.hidden = false;
  formStatus.dataset.state = type;
  formStatus.textContent = message;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  formStatus.hidden = true;

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    showStatus("success", "Thanks — your message is on its way. I'll get back to you soon.");
  } catch {
    showStatus("error", "Something went wrong sending that. Please email me at bibekbikramshahi6666@gmail.com.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = submitLabel;
  }
});
