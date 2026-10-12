(function () {
  const C = CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const fmt = (n) => C.currency + Number(n).toFixed(2);
  const hues = { women: "#FF1681", men: "#D6B36A", unisex: "#C90062" };

  window.bottle = (p) => `
    <svg viewBox="0 0 120 160" role="img" aria-label="${p.name} bottle placeholder">
      <defs>
        <linearGradient id="g${p.id}" x1="0" x2="1">
          <stop offset="0" stop-color="${hues[p.category]}" stop-opacity="0.95"></stop>
          <stop offset="0.5" stop-color="#fff" stop-opacity="0.5"></stop>
          <stop offset="1" stop-color="${hues[p.category]}" stop-opacity="0.8"></stop>
        </linearGradient>
      </defs>
      <rect x="46" y="8" width="28" height="24" rx="3" fill="#D6B36A"></rect>
      <rect x="52" y="30" width="16" height="10" fill="#8a6f33"></rect>
      <rect x="22" y="40" width="76" height="106" rx="10" fill="url(#g${p.id})"></rect>
      <rect x="34" y="70" width="52" height="44" fill="#100A0E" opacity="0.75"></rect>
      <text x="60" y="96" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="9" fill="#FFE1ED">${p.name}</text>
    </svg>
  `;

  window.productImg = (p, lazy = true) => {
    if (p.image) {
      return `<img src="${p.image}" alt="${p.name} by ${p.brand}" width="400" height="500" ${lazy ? 'loading="lazy"' : ""} onerror="this.outerHTML=bottle(PRODUCTS.find(x=>x.id==${p.id}))">`;
    }

    return bottle(p);
  };

  window.fmt = fmt;
  window.waLink = (p, q) =>
    `https://wa.me/${C.whatsapp}?text=` +
    encodeURIComponent(
      `Hello, I would like to order: ${p.name} (${p.brand}) x${q} at ${fmt(p.price)} each. Please confirm availability and delivery.`
    );

  const page = location.pathname.split("/").pop() || "index.html";
  const links = [
    ["index.html", "Home"],
    ["shop.html", "Shop"],
    ["about.html", "About"],
    ["about.html#contact", "Contact"],
  ];

  $("#nav").innerHTML = `
    <a class="logo" href="index.html">${C.brand}</a>
    <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu">
      <span></span>
      <span></span>
    </button>
    <nav id="menu" aria-label="Main">
      ${links.map(([h, t]) => `<a href="${h}" ${h === page ? 'aria-current="page"' : ""}>${t}</a>`).join("")}
    </nav>
  `;

  $("#foot").innerHTML = `
    <div class="fgrid">
      <div>
        <p class="logo">${C.brand}</p>
        <p>${C.tagline}</p>
      </div>
      <div>
        <h3>Explore</h3>
        ${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}
      </div>
      <div>
        <h3>Contact</h3>
        <a href="https://wa.me/${C.whatsapp}">WhatsApp</a>
        <a href="${C.instagram}">Instagram</a>
        <a href="${C.tiktok}">TikTok</a>
        <a href="mailto:${C.email}">${C.email}</a>
      </div>
      <div>
        <h3>Delivery</h3>
        <p>${C.delivery}</p>
      </div>
    </div>
    <p class="copy">© ${new Date().getFullYear()} ${C.brand}. <a href="#top">Back to top</a></p>
  `;

  document.title = document.title.replace("{brand}", C.brand);

  const nav = $("#nav");
  const b = $(".burger");

  addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 40), { passive: true });

  b.onclick = () => {
    const isOpen = nav.classList.toggle("open");
    b.setAttribute("aria-expanded", isOpen);
    b.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      b.click();
      b.focus();
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  window.observe = () => $$(".rv:not(.in)").forEach((el) => io.observe(el));

  document.documentElement.classList.add("js");
  observe();

  const w = $("#welcome");
  if (w) {
    const done = () => {
      w.classList.add("gone");
      sessionStorage.setItem("seen", "1");
      setTimeout(() => w.remove(), 700);
      document.body.classList.remove("lock");
    };

    if (sessionStorage.getItem("seen")) {
      w.remove();
    } else {
      document.body.classList.add("lock");
      $$("[data-enter]").forEach((x) => (x.onclick = done));
      setTimeout(() => w.classList.add("play"), 50);
    }
  }

  const f = $("#featured");
  if (f) {
    f.innerHTML = PRODUCTS.filter((p) => p.featured)
      .slice(0, 6)
      .map(
        (p, i) => `
          <a class="card rv" style="--d: ${i * 80}ms" href="shop.html?open=${p.id}">
            <div class="ph">${productImg(p)}</div>
            <p class="fam">${p.scentFamily} · ${p.category}</p>
            <h3>${p.name}</h3>
            <p>${p.brand}</p>
            <p class="price">${fmt(p.price)} <span>View details</span></p>
          </a>
        `
      )
      .join("");
    observe();
  }

  $$(".faq button").forEach((x) => {
    x.onclick = () => {
      const isExpanded = x.getAttribute("aria-expanded") === "true";
      x.setAttribute("aria-expanded", String(!isExpanded));
      x.nextElementSibling.style.maxHeight = isExpanded ? "0" : `${x.nextElementSibling.scrollHeight}px`;
    };
  });

  $$('[data-cfg]').forEach((el) => {
    el.textContent = C[el.dataset.cfg];
  });

  $$('[data-wa]').forEach((a) => (a.href = `https://wa.me/${C.whatsapp}`));
  $$('[data-ig]').forEach((a) => (a.href = C.instagram));
  $$('[data-tt]').forEach((a) => (a.href = C.tiktok));

  const cf = $("#contactForm");
  if (cf) {
    cf.onsubmit = (e) => {
      e.preventDefault();
      const d = new FormData(cf);
      open(
        `https://wa.me/${C.whatsapp}?text=` +
          encodeURIComponent(`Hello, I'm ${d.get("name")} (${d.get("contact")}). ${d.get("message")}`),
        "_blank",
        "noopener"
      );
    };
  }
})();
