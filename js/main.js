(function () {
  const area = document.getElementById("content-area");

  const tabs = Array.from(document.querySelectorAll(".tabs .tab"));
  const groups = Array.from(document.querySelectorAll(".sidebar-group"));

  function setBusy(b) {
    area.setAttribute("aria-busy", String(b));
    if (b) area.innerHTML = '<div class="loading">Завантаження…</div>';
  }

  function parseHash() {
    const raw = location.hash || "#lr1/home";
    const m = raw.match(/^#(lr\d+)\/([\w-]+)$/i);
    if (!m) return { lab: "lr1", page: "home", hash: "#lr1/home" };
    return { lab: m[1].toLowerCase(), page: m[2], hash: raw };
  }

  function showLab(lab) {
    groups.forEach((g) => {
      g.hidden = g.getAttribute("data-lab") !== lab;
    });
    tabs.forEach((t) => {
      const isActive = t.getAttribute("data-lab") === lab;
      t.classList.toggle("active", isActive);
    });
  }

  function activatePill(hash) {
    const activeGroup = groups.find((g) => !g.hidden);
    const pills = activeGroup ? activeGroup.querySelectorAll(".pill") : [];
    pills.forEach((p) => p.classList.toggle("active", p.getAttribute("href") === hash));
  }

  // Виконує <script> теги після вставки через innerHTML
  function runScripts(container) {
    container.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  async function load(lab, page) {
    try {
      setBusy(true);
      const res = await fetch(`pages/${lab}/${page}.html`, { cache: "no-store" });

      const html = res.ok
        ? await res.text()
        : `<h2>Помилка 404</h2>
           <p>Сторінку не знайдено: <code>pages/${lab}/${page}.html</code></p>`;

      area.innerHTML = html;
      runScripts(area); // <-- запускаємо JS після завантаження
    } catch (e) {
      area.innerHTML = "<h2>Помилка</h2><p>Не вдалося завантажити вміст.</p>";
    } finally {
      setBusy(false);
    }
  }

  function route() {
    const { lab, page, hash } = parseHash();
    showLab(lab);
    activatePill(hash);
    load(lab, page);
  }

  tabs.forEach((t) => {
    t.addEventListener("click", (e) => {
      const href = t.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        location.hash = href;
      }
    });
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a.pill");
    if (!a) return;
    const href = a.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      location.hash = href;
    }
  });

  window.addEventListener("hashchange", route);
  document.addEventListener("DOMContentLoaded", route);
})();
