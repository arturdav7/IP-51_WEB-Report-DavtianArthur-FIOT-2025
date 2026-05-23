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
      t.classList.toggle("active", t.getAttribute("data-lab") === lab);
    });
  }

  function activatePill(hash) {
    const activeGroup = groups.find((g) => !g.hidden);
    const pills = activeGroup ? activeGroup.querySelectorAll(".pill") : [];
    pills.forEach((p) => p.classList.toggle("active", p.getAttribute("href") === hash));
  }

  function stripScripts(container) {
    container.querySelectorAll("script").forEach((s) => s.remove());
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

  tabs.forEach((t) => {
    t.addEventListener("click", (e) => {
      const href = t.getAttribute("href");
      if (href && href.startsWith("#")) { e.preventDefault(); location.hash = href; }
    });
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a.pill");
    if (!a) return;
    const href = a.getAttribute("href");
    if (href && href.startsWith("#")) { e.preventDefault(); location.hash = href; }
  });

  window.addEventListener("hashchange", route);
  document.addEventListener("DOMContentLoaded", route);

  // ══════════════════════════════════════════════════════════
  // Диспетчер сторінок
  // ══════════════════════════════════════════════════════════
  function initPage(lab, page) {
    if (lab === "lr4") initLr4(page);
    if (lab === "lr5") initLr5(page);
  }

  // ══════════════════════════════════════════════════════════
  // ЛР4
  // ══════════════════════════════════════════════════════════
  function initLr4(page) {
    if (page === "task1") {
      window.runTask1 = function () {
        let timeInput = prompt("Введіть час у форматі ГГ:ХВ (наприклад 10:30):");
        if (timeInput === null || timeInput.trim() === "") { alert("Значення не введено!"); return; }
        if (!/^\d{1,2}:\d{2}$/.test(timeInput)) { alert("Невірний формат! Введіть час у форматі ГГ:ХВ"); return; }
        console.log(`Введений час: ${timeInput}`);
        let minutes = parseInt(timeInput.split(":")[1]);
        let quarter;
        if      (minutes >= 0  && minutes <= 14) quarter = "Перша чверть години (0–14 хв)";
        else if (minutes >= 15 && minutes <= 29) quarter = "Друга чверть години (15–29 хв)";
        else if (minutes >= 30 && minutes <= 44) quarter = "Третя чверть години (30–44 хв)";
        else                                     quarter = "Четверта чверть години (45–59 хв)";
        alert(quarter);
      };
    }
    if (page === "task2") {
      window.runTask2 = function () {
        let day = prompt("Введіть номер дня тижня (1–7):");
        let finish;
        switch (day) {
          case '1': finish = "Понеділок";  break; case '2': finish = "Вівторок";   break;
          case '3': finish = "Середа";     break; case '4': finish = "Четвер";     break;
          case '5': finish = "П'ятниця";   break; case '6': finish = "Субота";     break;
          case '7': finish = "Неділя";     break;
          default:  finish = "Невірне значення! Введіть число від 1 до 7.";
        }
        console.log(finish);
        document.getElementById("out-task2").textContent = finish;
      };
    }
    if (page === "task3") {
      window.runTask3 = function () {
        const u = [["User1","pass1"],["User2","pass2"],["User3","pass3"]];
        let login = prompt("Введіть логін (User1 / User2 / User3):");
        while (login === null || login.trim() === "") login = prompt("Логін не введено. Спробуйте ще раз:");
        console.log(`Введений логін: ${login}`);
        const found = u.find(([l]) => l === login);
        if (found) {
          const password = prompt(`Введіть пароль для ${login}:`);
          alert(password === found[1] ? `Hello, ${login}` : "Невірний пароль!");
        } else { alert("I don't know you"); }
      };
    }
    if (page === "task4") {
      const out = document.getElementById("out-task4");
      if (!out) return;
      function getShippingMessage(country, price, deliveryFee) {
        return `Shipping to ${country} will cost ${price + deliveryFee} credits`;
      }
      const lines = [getShippingMessage("Ukraine",500,50),getShippingMessage("Germany",1200,150),getShippingMessage("France",800,95)];
      lines.forEach(l => console.log(l));
      out.textContent = lines.join("\n");
    }
    if (page === "task5") {
      const out = document.getElementById("out-task5");
      if (!out) return;
      function makeTransaction(q, p, c) { let t=q*p; return t>c?"Insufficient funds!":`You ordered ${q} droids worth ${t} credits!`; }
      const lines = [`makeTransaction(3,100,500) → ${makeTransaction(3,100,500)}`,`makeTransaction(5,200,500) → ${makeTransaction(5,200,500)}`,`makeTransaction(2,250,500) → ${makeTransaction(2,250,500)}`];
      lines.forEach(l=>console.log(l)); out.textContent=lines.join("\n");
    }
    if (page === "task6") {
      const out = document.getElementById("out-task6");
      if (!out) return;
      function makeArray(a,b,m){let n=a.concat(b);return n.length>m?n.slice(0,m):n;}
      const lines=[`makeArray([1,2,3],[4,5,6],5) → [${makeArray([1,2,3],[4,5,6],5)}]`,`makeArray([1,2],[3,4],10)    → [${makeArray([1,2],[3,4],10)}]`,`makeArray([10],[20,30,40],2) → [${makeArray([10],[20,30,40],2)}]`];
      lines.forEach(l=>console.log(l)); out.textContent=lines.join("\n");
    }
    if (page === "task7") {
      const out = document.getElementById("out-task7");
      if (!out) return;
      const r4=v=>+v.toFixed(4),A=[3,7,2,9,1,5,4,8,6,10],B=[1,4,2,3,6,2,7,5,3,8];
      let C=A.map((ai,i)=>ai!==B[i]?1/(ai-B[i]):1);
      let mi=C.reduce((m,v,i,a)=>v>a[m]?i:m,0);
      let Ca=[...C]; [Ca[0],Ca[mi]]=[Ca[mi],Ca[0]];
      let Cs=[...Ca]; for(let i=0;i<Cs.length-1;i++) for(let j=0;j<Cs.length-1-i;j++) if(Cs[j]>Cs[j+1])[Cs[j],Cs[j+1]]=[Cs[j+1],Cs[j]];
      const lines=[`A: [${A}]`,`B: [${B}]`,`C (до): [${C.map(r4)}]`,`max індекс=${mi}, значення=${r4(C[mi])}`,`C (після swap): [${Ca.map(r4)}]`,``,`── Сортування бульбашкою ──`,`C до: [${Ca.map(r4)}]`,`C після: [${Cs.map(r4)}]`];
      lines.forEach(l=>console.log(l)); out.textContent=lines.join("\n");
    }
    if (page === "task8") {
      const out = document.getElementById("out-task8");
      if (!out) return;
      function rnd(){let v;do{v=Math.floor(Math.random()*21)-10;}while(v===0);return v;}
      let m=Array.from({length:3},()=>Array.from({length:4},rnd));
      let flat=m.flat(),fe=flat[0],le=flat[flat.length-1];
      flat.splice(2,0,25);
      const lines=[`Двовимірний масив 3×4:`,...m.map((r,i)=>`  рядок ${i}: [${r}]`),``,`Перший елемент: ${fe}`,`Останній елемент: ${le}`,``,`Після вставки 25:`,`  [${flat}]`];
      lines.forEach(l=>console.log(l)); out.textContent=lines.join("\n");
    }
    if (page === "task9") {
      window.edFmt = (cmd,val) => { document.execCommand(cmd,false,val||null); document.getElementById("editorArea").focus(); };
      window.edCase = (type) => {
        let sel=window.getSelection(); if(!sel.rangeCount)return;
        let range=sel.getRangeAt(0),text=range.toString(); if(!text)return;
        let r=type==="upper"?text.toUpperCase():type==="lower"?text.toLowerCase():text.replace(/\b\w/g,c=>c.toUpperCase());
        range.deleteContents(); range.insertNode(document.createTextNode(r));
      };
      window.edClear = () => { if(confirm("Очистити весь текст?")) document.getElementById("editorArea").innerHTML=""; };
      const picker=document.getElementById("edColorPicker");
      if(picker) picker.addEventListener("change",()=>edFmt("foreColor",picker.value));
    }
  }

  // ══════════════════════════════════════════════════════════
  // ЛР5
  // ══════════════════════════════════════════════════════════
  function initLr5(page) {
    const set = (id, text) => { const el=document.getElementById(id); if(el) el.textContent=text; };

    // ── З1-2: getProductDetails ──────────────────────────────
    if (page === "z1-2") {
      const products = [
        { id: 1, name: "Laptop", price: 25000 },
        { id: 2, name: "Phone",  price: 12000 },
        { id: 3, name: "Tablet", price: 8000  },
      ];
      function getProductDetails(productId, successCallback, errorCallback) {
        const product = products.find(p => p.id === productId);
        if (product) successCallback(product);
        else errorCallback(`Товар з id ${productId} не знайдено`);
      }
      const lines = [];
      getProductDetails(1, p => lines.push("Знайдено: " + JSON.stringify(p)), e => lines.push("Помилка: " + e));
      getProductDetails(99, p => lines.push("Знайдено: " + JSON.stringify(p)), e => lines.push("Помилка: " + e));
      lines.forEach(l => console.log(l));
      set("out-z1-2", lines.join("\n"));
    }

    // ── З1-4: concerts ──────────────────────────────────────
    if (page === "z1-4") {
      const concerts = {
        Київ: new Date("2020-04-01"), Умань: new Date("2025-07-02"),
        Вінниця: new Date("2020-04-21"), Одеса: new Date("2025-03-15"),
        Хмельницький: new Date("2020-04-18"), Харків: new Date("2025-07-10"),
      };
      const now = new Date();
      const result = Object.entries(concerts)
        .filter(([, date]) => date > now)
        .sort(([, a], [, b]) => a - b)
        .map(([city]) => city);
      console.log(result);
      set("out-z1-4", JSON.stringify(result));
    }

    // ── З1-6: medicines discount ────────────────────────────
    if (page === "z1-6") {
      const medicines = [
        { name: "Noshpa", price: 170 }, { name: "Analgin", price: 55 },
        { name: "Quanil", price: 310 }, { name: "Alphacholine", price: 390 },
      ];
      const result = medicines.map((item, i) => ({
        id: i + 1, name: item.name,
        price: item.price > 300 ? +(item.price * 0.7).toFixed(2) : item.price,
      }));
      console.log(result);
      set("out-z1-6", result.map(r => JSON.stringify(r)).join("\n"));
    }

    // ── З1-8: Storage ───────────────────────────────────────
    if (page === "z1-8") {
      function Storage(initialItems) {
        this.items = [...initialItems];
        this.getItems   = function()     { return this.items; };
        this.addItems   = function(item) { this.items.push(item); };
        this.removeItem = function(item) { const i=this.items.indexOf(item); if(i!==-1) this.items.splice(i,1); };
      }
      const storage = new Storage(["apple","banana","mango"]);
      const lines = [];
      lines.push("Початковий склад:      " + JSON.stringify(storage.getItems()));
      storage.addItems("grape");
      lines.push("Після додавання grape: " + JSON.stringify(storage.getItems()));
      storage.removeItem("banana");
      lines.push("Після видалення banana:" + JSON.stringify(storage.getItems()));
      lines.forEach(l => console.log(l));
      set("out-z1-8", lines.join("\n"));
    }

    // ── З1-9: tag count ─────────────────────────────────────
    if (page === "z1-9") {
      const tweets = [
        { id:"000", likes:5,  tags:["js","nodejs"]          },
        { id:"001", likes:2,  tags:["html","css"]           },
        { id:"002", likes:17, tags:["html","js","nodejs"]   },
        { id:"003", likes:8,  tags:["css","react"]          },
        { id:"004", likes:0,  tags:["js","nodejs","react"]  },
      ];
      const tagCount = tweets.reduce((acc, tweet) => {
        tweet.tags.forEach(tag => { acc[tag] = (acc[tag] || 0) + 1; });
        return acc;
      }, {});
      console.log(tagCount);
      set("out-z1-9", JSON.stringify(tagCount, null, 2));
    }

    // ── З1-10: checkBrackets ────────────────────────────────
    if (page === "z1-10") {
      function checkBrackets(str) {
        const stack = [], pairs = { ')':'(', '}':'{', ']':'[' };
        for (let char of str) {
          if ('({['.includes(char)) stack.push(char);
          else if (')}]'.includes(char)) if (stack.pop() !== pairs[char]) return false;
        }
        return stack.length === 0;
      }
      const tests = [
        `checkBrackets("function test() { return [1, 2]; }") → ${checkBrackets("function test() { return [1, 2]; }")}`,
        `checkBrackets("function test( { return [1, 2]; }") → ${checkBrackets("function test( { return [1, 2]; }")}`,
        `checkBrackets("const a = (b + c) * [d - e]")       → ${checkBrackets("const a = (b + c) * [d - e]")}`,
        `checkBrackets("const x = {a: [1, 2}]")             → ${checkBrackets("const x = {a: [1, 2}]")}`,
      ];
      tests.forEach(l => console.log(l));
      set("out-z1-10", tests.join("\n"));
    }

    // ── З2-2: some age < 20 ─────────────────────────────────
    if (page === "z2-2") {
      const people = [{ name:'John',age:27 },{ name:'Jane',age:31 },{ name:'Bob',age:19 }];
      const hasYoung = people.some(p => p.age < 20);
      console.log(hasYoung);
      set("out-z2-2", `hasYoung → ${hasYoung}`);
    }

    // ── З2-4: squares ───────────────────────────────────────
    if (page === "z2-4") {
      const numbers = [1,2,3,4,5];
      const squares = numbers.map(n => n ** 2);
      console.log(squares);
      set("out-z2-4", `[${numbers}].map(n => n²) → [${squares}]`);
    }

    // ── З2-6: sort by age ───────────────────────────────────
    if (page === "z2-6") {
      const users = [{ name:'John',age:27 },{ name:'Jane',age:31 },{ name:'Bob',age:19 }];
      const sorted = [...users].sort((a,b) => a.age - b.age);
      console.log(sorted);
      set("out-z2-6", sorted.map(u => JSON.stringify(u)).join("\n"));
    }

    // ── З2-7: Calculator ────────────────────────────────────
    if (page === "z2-7") {
      class Calculator {
        number(v)   { this.result = v; return this; }
        getResult() { return this.result; }
        add(v)      { this.result += v; return this; }
        subtract(v) { this.result -= v; return this; }
        multiply(v) { this.result *= v; return this; }
        divide(v)   { if(v===0) throw new Error("Ділення на нуль неможливе!"); this.result/=v; return this; }
      }
      const result = new Calculator().number(10).add(5).subtract(3).multiply(4).divide(2).getResult();
      const lines = [`calc.number(10).add(5).subtract(3).multiply(4).divide(2).getResult() → ${result}`];
      try { new Calculator().number(10).divide(0).getResult(); }
      catch(e) { lines.push(`Ділення на 0: Помилка — ${e.message}`); }
      lines.forEach(l => console.log(l));
      set("out-z2-7", lines.join("\n"));
    }
  }

})();
