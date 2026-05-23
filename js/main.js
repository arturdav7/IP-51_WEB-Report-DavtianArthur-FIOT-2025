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
    groups.forEach(g => { g.hidden = g.getAttribute("data-lab") !== lab; });
    tabs.forEach(t => { t.classList.toggle("active", t.getAttribute("data-lab") === lab); });
  }

  function activatePill(hash) {
    const activeGroup = groups.find(g => !g.hidden);
    const pills = activeGroup ? activeGroup.querySelectorAll(".pill") : [];
    pills.forEach(p => p.classList.toggle("active", p.getAttribute("href") === hash));
  }

  function stripScripts(container) {
    container.querySelectorAll("script").forEach(s => s.remove());
  }

  async function load(lab, page) {
    try {
      setBusy(true);
      const res = await fetch(`pages/${lab}/${page}.html`, { cache: "no-store" });
      const html = res.ok
        ? await res.text()
        : `<h2>Помилка 404</h2><p>Сторінку не знайдено: <code>pages/${lab}/${page}.html</code></p>`;
      area.innerHTML = html;
      stripScripts(area);
      initPage(lab, page);
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

  tabs.forEach(t => {
    t.addEventListener("click", e => {
      const href = t.getAttribute("href");
      if (href && href.startsWith("#")) { e.preventDefault(); location.hash = href; }
    });
  });

  document.addEventListener("click", e => {
    const a = e.target.closest("a.pill");
    if (!a) return;
    const href = a.getAttribute("href");
    if (href && href.startsWith("#")) { e.preventDefault(); location.hash = href; }
  });

  window.addEventListener("hashchange", route);
  document.addEventListener("DOMContentLoaded", route);

  function initPage(lab, page) {
    if (lab === "lr4") initLr4(page);
    if (lab === "lr5") initLr5(page);
    if (lab === "lr6") initLr6(page);
  }

  // ══════════════════════════════════════════════════════════
  // ЛР4
  // ══════════════════════════════════════════════════════════
  function initLr4(page) {
    if (page === "task1") {
      window.runTask1 = function () {
        let t = prompt("Введіть час у форматі ГГ:ХВ (наприклад 10:30):");
        if (!t || t.trim() === "") { alert("Значення не введено!"); return; }
        if (!/^\d{1,2}:\d{2}$/.test(t)) { alert("Невірний формат!"); return; }
        console.log(`Введений час: ${t}`);
        let m = parseInt(t.split(":")[1]), q;
        if (m<=14) q="Перша чверть (0–14 хв)"; else if(m<=29) q="Друга чверть (15–29 хв)"; else if(m<=44) q="Третя чверть (30–44 хв)"; else q="Четверта чверть (45–59 хв)";
        alert(q);
      };
    }
    if (page === "task2") {
      window.runTask2 = function () {
        let day=prompt("Введіть номер дня тижня (1–7):"), finish;
        switch(day){case'1':finish="Понеділок";break;case'2':finish="Вівторок";break;case'3':finish="Середа";break;case'4':finish="Четвер";break;case'5':finish="П'ятниця";break;case'6':finish="Субота";break;case'7':finish="Неділя";break;default:finish="Невірне значення!";}
        console.log(finish); document.getElementById("out-task2").textContent=finish;
      };
    }
    if (page === "task3") {
      window.runTask3 = function () {
        const u=[["User1","pass1"],["User2","pass2"],["User3","pass3"]];
        let login=prompt("Введіть логін:");
        while(!login||login.trim()==="") login=prompt("Спробуйте ще раз:");
        console.log(`Логін: ${login}`);
        const f=u.find(([l])=>l===login);
        if(f){const p=prompt(`Пароль для ${login}:`);alert(p===f[1]?`Hello, ${login}`:"Невірний пароль!");}else alert("I don't know you");
      };
    }
    if (page==="task4"){const o=document.getElementById("out-task4");if(!o)return;function g(c,p,d){return`Shipping to ${c} will cost ${p+d} credits`;}const l=[g("Ukraine",500,50),g("Germany",1200,150),g("France",800,95)];l.forEach(x=>console.log(x));o.textContent=l.join("\n");}
    if (page==="task5"){const o=document.getElementById("out-task5");if(!o)return;function mt(q,p,c){let t=q*p;return t>c?"Insufficient funds!":`You ordered ${q} droids worth ${t} credits!`;}const l=[`mt(3,100,500)→${mt(3,100,500)}`,`mt(5,200,500)→${mt(5,200,500)}`,`mt(2,250,500)→${mt(2,250,500)}`];l.forEach(x=>console.log(x));o.textContent=l.join("\n");}
    if (page==="task6"){const o=document.getElementById("out-task6");if(!o)return;function ma(a,b,m){let n=a.concat(b);return n.length>m?n.slice(0,m):n;}const l=[`[1,2,3]+[4,5,6] max5→[${ma([1,2,3],[4,5,6],5)}]`,`[1,2]+[3,4] max10→[${ma([1,2],[3,4],10)}]`,`[10]+[20,30,40] max2→[${ma([10],[20,30,40],2)}]`];l.forEach(x=>console.log(x));o.textContent=l.join("\n");}
    if (page==="task7"){const o=document.getElementById("out-task7");if(!o)return;const r=v=>+v.toFixed(4),A=[3,7,2,9,1,5,4,8,6,10],B=[1,4,2,3,6,2,7,5,3,8];let C=A.map((a,i)=>a!==B[i]?1/(a-B[i]):1),mi=C.reduce((m,v,i,a)=>v>a[m]?i:m,0),Ca=[...C];[Ca[0],Ca[mi]]=[Ca[mi],Ca[0]];let Cs=[...Ca];for(let i=0;i<Cs.length-1;i++)for(let j=0;j<Cs.length-1-i;j++)if(Cs[j]>Cs[j+1])[Cs[j],Cs[j+1]]=[Cs[j+1],Cs[j]];const l=[`A:[${A}]`,`B:[${B}]`,`C до:[${C.map(r)}]`,`max idx=${mi} val=${r(C[mi])}`,`C після:[${Ca.map(r)}]`,``,`Бульбашка:`,`до:[${Ca.map(r)}]`,`після:[${Cs.map(r)}]`];l.forEach(x=>console.log(x));o.textContent=l.join("\n");}
    if (page==="task8"){const o=document.getElementById("out-task8");if(!o)return;function rn(){let v;do{v=Math.floor(Math.random()*21)-10;}while(v===0);return v;}let m=Array.from({length:3},()=>Array.from({length:4},rn)),flat=m.flat(),fe=flat[0],le=flat[flat.length-1];flat.splice(2,0,25);const l=[`2D масив:`,...m.map((r,i)=>`  рядок ${i}: [${r}]`),``,`Перший: ${fe}`,`Останній: ${le}`,``,`Після вставки 25:`,`  [${flat}]`];l.forEach(x=>console.log(x));o.textContent=l.join("\n");}
    if (page==="task9"){window.edFmt=(c,v)=>{document.execCommand(c,false,v||null);document.getElementById("editorArea").focus();};window.edCase=t=>{let s=window.getSelection();if(!s.rangeCount)return;let r=s.getRangeAt(0),tx=r.toString();if(!tx)return;let res=t==="upper"?tx.toUpperCase():t==="lower"?tx.toLowerCase():tx.replace(/\b\w/g,c=>c.toUpperCase());r.deleteContents();r.insertNode(document.createTextNode(res));};window.edClear=()=>{if(confirm("Очистити?"))document.getElementById("editorArea").innerHTML="";};const p=document.getElementById("edColorPicker");if(p)p.addEventListener("change",()=>edFmt("foreColor",p.value));}
  }

  // ══════════════════════════════════════════════════════════
  // ЛР5
  // ══════════════════════════════════════════════════════════
  function initLr5(page) {
    const set=(id,t)=>{const e=document.getElementById(id);if(e)e.textContent=t;};
    if(page==="z1-2"){const products=[{id:1,name:"Laptop",price:25000},{id:2,name:"Phone",price:12000},{id:3,name:"Tablet",price:8000}];function getProductDetails(productId,successCallback,errorCallback){const product=products.find(p=>p.id===productId);if(product)successCallback(product);else errorCallback(`Товар з id ${productId} не знайдено`);}window.runZ12=function(){const input=parseInt(prompt("Введіть id товару (1, 2 або 3):"));const out=document.getElementById("out-z1-2");getProductDetails(input,product=>{const msg="Знайдено: "+JSON.stringify(product);console.log(msg);if(out)out.textContent=msg;},error=>{const msg="Помилка: "+error;console.log(msg);if(out)out.textContent=msg;});};}
    if(page==="z1-4"){const concerts={Київ:new Date("2020-04-01"),Умань:new Date("2027-07-02"),Вінниця:new Date("2020-04-21"),Одеса:new Date("2027-03-15"),Хмельницький:new Date("2020-04-18"),Харків:new Date("2027-07-10")};const now=new Date();const r=Object.entries(concerts).filter(([,d])=>d>now).sort(([,a],[,b])=>a-b).map(([c])=>c);console.log(r);set("out-z1-4",JSON.stringify(r));}
    if(page==="z1-6"){const med=[{name:"Noshpa",price:170},{name:"Analgin",price:55},{name:"Quanil",price:310},{name:"Alphacholine",price:390}];const r=med.map((x,i)=>({id:i+1,name:x.name,price:x.price>300?+(x.price*.7).toFixed(2):x.price}));console.log(r);set("out-z1-6",r.map(x=>JSON.stringify(x)).join("\n"));}
    if(page==="z1-8"){function Storage(arr){this.items=[...arr];this.getItems=function(){return this.items;};this.addItems=function(x){this.items.push(x);};this.removeItem=function(x){const i=this.items.indexOf(x);if(i!==-1)this.items.splice(i,1);};}window._storage=new Storage(["apple","banana","mango"]);const out=document.getElementById("out-z1-8");const refresh=()=>{if(out)out.textContent="Склад: "+JSON.stringify(window._storage.getItems());};window.storageGetItems=function(){console.log(window._storage.getItems());refresh();};window.storageAddItem=function(){const item=prompt("Введіть назву товару для додавання:");if(item&&item.trim()){window._storage.addItems(item.trim());console.log("Додано:",item.trim());refresh();}};window.storageRemoveItem=function(){const item=prompt("Введіть назву товару для видалення:");if(item&&item.trim()){window._storage.removeItem(item.trim());console.log("Видалено:",item.trim());refresh();}};}
    if(page==="z1-9"){const tweets=[{id:"000",likes:5,tags:["js","nodejs"]},{id:"001",likes:2,tags:["html","css"]},{id:"002",likes:17,tags:["html","js","nodejs"]},{id:"003",likes:8,tags:["css","react"]},{id:"004",likes:0,tags:["js","nodejs","react"]}];const tc=tweets.reduce((a,t)=>{t.tags.forEach(g=>{a[g]=(a[g]||0)+1;});return a;},{});console.log(tc);set("out-z1-9",JSON.stringify(tc,null,2));}
    if(page==="z1-10"){function cb(str){const stack=[],pairs={')':'(', '}':'{', ']':'['};for(let c of str){if('({['.includes(c))stack.push(c);else if(')}]'.includes(c))if(stack.pop()!==pairs[c])return false;}return stack.length===0;}window.runCheckBrackets=function(){const input=prompt("Введіть рядок JS коду для перевірки дужок:");if(input===null)return;const result=cb(input);const msg=`checkBrackets("${input}") → ${result}`;console.log(msg);const out=document.getElementById("out-z1-10");if(out)out.textContent=msg;};}
    if(page==="z2-2"){const people=[{name:'John',age:27},{name:'Jane',age:31},{name:'Bob',age:19}];const r=people.some(p=>p.age<20);console.log(r);set("out-z2-2",`people.some(p => p.age < 20) → ${r}`);}
    if(page==="z2-4"){const n=[1,2,3,4,5];const r=n.map(x=>x**2);console.log(r);set("out-z2-4",`[${n}].map(n => n²) → [${r}]`);}
    if(page==="z2-6"){const u=[{name:'John',age:27},{name:'Jane',age:31},{name:'Bob',age:19}];const r=[...u].sort((a,b)=>a.age-b.age);console.log(r);set("out-z2-6",r.map(x=>JSON.stringify(x)).join("\n"));}
    if(page==="z2-7"){class Calculator{number(v){this.result=v;return this;}getResult(){return this.result;}add(v){this.result+=v;return this;}subtract(v){this.result-=v;return this;}multiply(v){this.result*=v;return this;}divide(v){if(v===0)throw new Error("Ділення на нуль!");this.result/=v;return this;}}window._calc=new Calculator();const out=document.getElementById("out-z2-7");const log=(msg)=>{console.log(msg);if(out)out.textContent+=(out.textContent?"\n":"")+msg;};const getVal=()=>parseFloat(document.getElementById("calcInput").value);window.calcNumber=function(){const v=getVal();window._calc.number(v);log(`number(${v}) → result = ${v}`);};window.calcAdd=function(){const v=getVal();window._calc.add(v);log(`add(${v}) → result = ${window._calc.getResult()}`);};window.calcSubtract=function(){const v=getVal();window._calc.subtract(v);log(`subtract(${v}) → result = ${window._calc.getResult()}`);};window.calcMultiply=function(){const v=getVal();window._calc.multiply(v);log(`multiply(${v}) → result = ${window._calc.getResult()}`);};window.calcDivide=function(){const v=getVal();try{window._calc.divide(v);log(`divide(${v}) → result = ${window._calc.getResult()}`);}catch(e){log(`divide(${v}) → Помилка: ${e.message}`);}};window.calcGetResult=function(){log(`getResult() → ${window._calc.getResult()}`);};window.calcReset=function(){window._calc=new Calculator();if(out)out.textContent="";log("Калькулятор скинуто");};}
  }

  // ══════════════════════════════════════════════════════════
  // ЛР6
  // ══════════════════════════════════════════════════════════
  function initLr6(page) {

    // ── Z2: SWAP ME ─────────────────────────────────────────
    if (page === "z2") {
      const btn  = document.querySelector('#swapBtn');
      const inp1 = document.querySelector('#inp1');
      const inp2 = document.querySelector('#inp2');
      if (!btn) return;
      btn.addEventListener('click', () => {
        [inp1.value, inp2.value] = [inp2.value, inp1.value];
      });
    }

    // ── Z4: Resize square ───────────────────────────────────
    if (page === "z4") {
      const square = document.querySelector('#square');
      const decBtn = document.querySelector('#decreaseBtn');
      const incBtn = document.querySelector('#increaseBtn');
      if (!square) return;
      decBtn.addEventListener('click', () => {
        const size = parseInt(square.style.width) - 15;
        if (size > 15) { square.style.width = size + 'px'; square.style.height = size + 'px'; }
      });
      incBtn.addEventListener('click', () => {
        const size = parseInt(square.style.width) + 15;
        square.style.width = size + 'px'; square.style.height = size + 'px';
      });
    }

    // ── Z6: Double list ─────────────────────────────────────
    if (page === "z6") {
      const btn = document.querySelector('#doubleBtn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        document.querySelectorAll('#numList li').forEach(li => {
          li.textContent = li.textContent * 2;
        });
      });
    }

    // ── Z7: Categories DOM ──────────────────────────────────
    if (page === "z7") {
      const categories = document.querySelectorAll('#categories li.item');
      const out = document.getElementById('out-z7');
      if (!categories.length) return;
      const lines = [`Number of categories: ${categories.length}`];
      categories.forEach(item => {
        const title = item.querySelector('h2').textContent;
        const count = item.querySelectorAll('li').length;
        lines.push(`Category: ${title}`);
        lines.push(`Elements: ${count}`);
      });
      lines.forEach(l => console.log(l));
      if (out) out.textContent = lines.join('\n');
    }

    // ── Z8: Login form ──────────────────────────────────────
    if (page === "z8") {
      const form = document.querySelector('.login-form');
      const out  = document.getElementById('out-z8');
      if (!form) return;
      form.addEventListener('submit', e => {
        e.preventDefault();
        const email    = form.elements.email.value.trim();
        const password = form.elements.password.value.trim();
        if (!email || !password) {
          alert('All form fields must be filled in');
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,4}$/;
        const validDomains = ['gmail.com','yahoo.com','outlook.com','ukr.net','i.ua','meta.ua','hotmail.com'];
        const emailDomain = email.split('@')[1];
        if (!emailRegex.test(email)) {
        alert('Введіть коректний email (наприклад user@gmail.com)');
          return;
    }
if (!validDomains.includes(emailDomain)) {
  alert(`Домен "${emailDomain}" не підтримується. Використовуйте: ${validDomains.join(', ')}`);
  return;
}
        const userData = { email, password };
        console.log(userData);
        if (out) out.textContent = 'Відправлено: ' + JSON.stringify(userData);
        form.reset();
      });
    }

    // ── Z9: Change color ────────────────────────────────────
    if (page === "z9") {
      function getRandomHexColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, 0)}`;
      }
      const btn       = document.querySelector('.change-color');
      const colorSpan = document.querySelector('.color');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const color = getRandomHexColor();
        document.body.style.backgroundColor = color;
        if (colorSpan) colorSpan.textContent = color;
      });
    }

    // ── Z10: Create/Destroy boxes ───────────────────────────
    if (page === "z10") {
      function getRandomHexColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, 0)}`;
      }
      function createBoxes(amount) {
        const boxes = document.querySelector('#boxes');
        boxes.innerHTML = '';
        for (let i = 0; i < amount; i++) {
          const size = 30 + i * 10;
          const div  = document.createElement('div');
          div.style.cssText = `width:${size}px;height:${size}px;background:${getRandomHexColor()};margin-bottom:4px;`;
          boxes.appendChild(div);
        }
      }
      function destroyBoxes() {
        const boxes = document.querySelector('#boxes');
        if (boxes) boxes.innerHTML = '';
      }
      const input      = document.querySelector('#controls input');
      const createBtn  = document.querySelector('[data-create]');
      const destroyBtn = document.querySelector('[data-destroy]');
      if (!createBtn) return;
      createBtn.addEventListener('click', () => {
        const amount = parseInt(input.value);
        if (amount >= 1 && amount <= 100) { createBoxes(amount); input.value = ''; }
        else alert('Введіть число від 1 до 100');
      });
      destroyBtn.addEventListener('click', destroyBoxes);
    }
  }

})();
