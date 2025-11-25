// Завантаження частин сторінки у правий блок (SPA-роутер)
(function(){
  const area = document.getElementById('content-area');
  const pills = Array.from(document.querySelectorAll('.pill'));

  function setBusy(b){
    area.setAttribute('aria-busy', String(b));
    if(b) area.innerHTML = '<div class="loading">Завантаження…</div>';
  }

  function activate(hash){
    pills.forEach(p => p.classList.toggle('active', p.getAttribute('href') === hash));
  }

  async function load(page){
    try{
      setBusy(true);
      const res = await fetch('pages/' + page + '.html', {cache:'no-store'});
      const html = res.ok ? await res.text() : '<h2>Помилка 404</h2><p>Сторінку не знайдено.</p>';
      area.innerHTML = html;
    }catch(e){
      area.innerHTML = '<h2>Помилка</h2><p>Не вдалося завантажити вміст.</p>';
    }finally{
      setBusy(false);
    }
  }

  function route(){
    const hash = location.hash || '#home';
    const page = hash.slice(1);
    activate(hash);
    load(page);
  }

  pills.forEach(p => {
    p.addEventListener('click', e => {
      e.preventDefault();
      const hash = p.getAttribute('href');
      if(hash !== location.hash) location.hash = hash;
      else route();
    });
  });

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', route);
})();
