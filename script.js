// ===== 今日は何の日 =====
function searchToday() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const query = month + "月" + day + "日";
  window.open("https://ja.wikipedia.org/w/index.php?search=" + encodeURIComponent(query), "_blank");
}


// ===== Google検索 =====
function search() {
  const word = document.getElementById("search").value;
  location.href = "https://www.google.com/search?q=" + encodeURIComponent(word);
}


// ===== ブックマーク =====
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

function save() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";
  bookmarks.forEach((b, i) => {
    const div = document.createElement("div");
    div.className = "bookmark";
    div.innerHTML = `
      <a href="${b.url}" target="_blank">${b.name}</a>
      <button class="delete" onclick="removeBookmark(${i})">削除</button>
    `;
    list.appendChild(div);
  });
}

function addBookmark() {
  const name = document.getElementById("siteName").value;
  let url = document.getElementById("siteURL").value;

  if (name == "" || url == "") {
    alert("入力してね");
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  bookmarks.push({ name: name, url: url });
  save();
  render();

  document.getElementById("siteName").value = "";
  document.getElementById("siteURL").value = "";
}

function removeBookmark(i) {
  bookmarks.splice(i, 1);
  save();
  render();
}

function toggleBookmarks() {
  const list = document.getElementById("list");
  list.style.display = (list.style.display === "none") ? "block" : "none";
}


// ===== カスタム検索エンジン =====
let engines = JSON.parse(localStorage.getItem("engines")) || [];

function saveEngines() {
  localStorage.setItem("engines", JSON.stringify(engines));
}

function renderEngineButtons() {
  const container = document.getElementById("customEngineButtons");
  container.innerHTML = "";

  if (engines.length === 0) {
    container.innerHTML = "<p style='color:#888;font-size:0.9em;'>検索エンジンがまだ登録されていません。</p>";
    return;
  }

  engines.forEach((e) => {
    const btn = document.createElement("button");
    btn.textContent = e.name + "で検索";
    btn.onclick = () => searchWith(e.url);
    container.appendChild(btn);
  });
}

function renderEngineList() {
  const list = document.getElementById("engineList");
  list.innerHTML = "";

  if (engines.length === 0) {
    list.innerHTML = "<p style='color:#888;font-size:0.9em;'>登録済みの検索エンジンはありません。</p>";
    return;
  }

  engines.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "bookmark";
    div.innerHTML = `
      <span><strong>${e.name}</strong>：${e.url}</span>
      <button class="delete" onclick="removeEngine(${i})">削除</button>
    `;
    list.appendChild(div);
  });
}

function searchWith(urlTemplate) {
  const word = document.getElementById("customSearchWord").value;
  if (word === "") {
    alert("検索ワードを入力してね");
    return;
  }
  const url = urlTemplate.replace("%s", encodeURIComponent(word));
  window.open(url, "_blank");
}

// Enterキーで検索（複数登録時は最初のエンジンで検索）
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("customSearchWord");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (engines.length === 0) {
          alert("検索エンジンがまだ登録されていません。");
          return;
        }
        searchWith(engines[0].url);
      }
    });
  }
});

function addEngine() {
  const name = document.getElementById("engineName").value.trim();
  const url = document.getElementById("engineURL").value.trim();

  if (name === "" || url === "") {
    alert("名前とURLを入力してね");
    return;
  }

  if (!url.includes("%s")) {
    alert("URLに %s が含まれていません。\n検索ワードの位置を %s で指定してください。");
    return;
  }

  engines.push({ name: name, url: url });
  saveEngines();
  renderEngineButtons();
  renderEngineList();

  document.getElementById("engineName").value = "";
  document.getElementById("engineURL").value = "";
}

function removeEngine(i) {
  engines.splice(i, 1);
  saveEngines();
  renderEngineButtons();
  renderEngineList();
}

function toggleEngineList() {
  const list = document.getElementById("engineList");
  if (list.style.display === "none") {
    renderEngineList();
    list.style.display = "block";
  } else {
    list.style.display = "none";
  }
}

// 初期描画
renderEngineButtons();