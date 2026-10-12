(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const q = new URLSearchParams(location.search);

  let cat = "all";
  let mood = q.get("mood") || "";
  let term = "";
  let sort = "";
  let last;

  const grid = $("#grid");
  const modal = $("#modal");

  function render() {
    let list = PRODUCTS.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (!mood || p.mood === mood) &&
        `${p.name} ${p.brand}`.toLowerCase().includes(term)
    );

    if (sort) {
      list.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
    }

    $("#count").innerHTML =
      `${list.length} fragrance${list.length === 1 ? "" : "s"}` +
      (mood ? ` for mood “${mood}” <button class="link" id="clr">Clear mood</button>` : "");

    const clearButton = $("#clr");
    if (clearButton) {
      clearButton.onclick = () => {
        mood = "";
        render();
      };
    }

    grid.innerHTML = list.length
      ? list
          .map(
            (p, i) => `
              <button class="card rv" style="--d: ${i * 50}ms" data-id="${p.id}">
                <div class="ph">${productImg(p)}</div>
                <p class="fam">${p.scentFamily} · ${p.category}</p>
                <h3>${p.name}</h3>
                <p>${p.brand}</p>
                <p class="price">${fmt(p.price)}</p>
              </button>
            `
          )
          .join("")
      : '<p class="empty">No fragrance matches. Try another filter or search.</p>';

    observe();
  }

  document.querySelectorAll("[data-cat]").forEach((button) => {
    button.onclick = () => {
      cat = button.dataset.cat;
      document.querySelectorAll("[data-cat]").forEach((x) => x.setAttribute("aria-pressed", x === button));
      render();
    };
  });

  $("#search").oninput = (e) => {
    term = e.target.value.trim().toLowerCase();
    render();
  };

  $("#sort").onchange = (e) => {
    sort = e.target.value;
    render();
  };

  grid.onclick = (e) => {
    const item = e.target.closest("[data-id]");
    if (item) {
      openM(+item.dataset.id);
    }
  };

  function openM(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;

    last = document.activeElement;
    let quantity = 1;

    const draw = () => {
      modal.querySelector(".sheet").innerHTML = `
        <button class="x" aria-label="Close details">×</button>
        <div class="ph">${productImg(p, false)}</div>
        <div class="info">
          <p class="fam">${p.scentFamily} · ${p.category}</p>
          <h2 id="mt">${p.name}</h2>
          <p>${p.brand}</p>
          <p class="price">${fmt(p.price)}</p>
          <p>${p.description}</p>
          <div class="qty">
            <button aria-label="Decrease quantity" id="m">−</button>
            <output aria-live="polite">${quantity}</output>
            <button aria-label="Increase quantity" id="a">+</button>
          </div>
          <p class="tot">Total: ${fmt(p.price * quantity)}</p>
          <a class="btn" href="${waLink(p, quantity)}" target="_blank" rel="noopener">Order on WhatsApp</a>
          <small>This opens a chat. Your order is not confirmed until the seller replies.</small>
        </div>
      `;

      modal.querySelector(".x").onclick = closeM;
      modal.querySelector("#m").onclick = () => {
        quantity = Math.max(1, quantity - 1);
        draw();
        modal.querySelector("#m").focus();
      };
      modal.querySelector("#a").onclick = () => {
        quantity = Math.min(20, quantity + 1);
        draw();
        modal.querySelector("#a").focus();
      };
    };

    draw();
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("show"));
    document.body.classList.add("lock");
    modal.querySelector(".x").focus();
  }

  function closeM() {
    modal.classList.remove("show");
    document.body.classList.remove("lock");
    setTimeout(() => {
      modal.hidden = true;
      last && last.focus();
    }, 300);
  }

  modal.onclick = (e) => {
    if (e.target === modal) {
      closeM();
    }
  };

  addEventListener("keydown", (e) => {
    if (modal.hidden) return;

    if (e.key === "Escape") {
      closeM();
    }

    if (e.key === "Tab") {
      const focusables = [...modal.querySelectorAll("button,a")];
      const currentIndex = focusables.indexOf(document.activeElement);

      if (e.shiftKey && currentIndex <= 0) {
        e.preventDefault();
        focusables.at(-1).focus();
      } else if (!e.shiftKey && currentIndex === focusables.length - 1) {
        e.preventDefault();
        focusables[0].focus();
      }
    }
  });

  render();

  if (q.get("open")) {
    openM(+q.get("open"));
  }
})();

