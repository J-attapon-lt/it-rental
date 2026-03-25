const API = "YOUR_APPS_SCRIPT_URL";
let allData = [];

async function loadData() {
  const res = await fetch(API + "?action=list");
  const data = await res.json();
  allData = data.data || [];
  render(allData);
}

function render(rows) {
  const tb = document.getElementById("tb");
  tb.innerHTML = "";

  rows.forEach((r) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.doc_no || ""}</td>
      <td>${r.name_th || ""}</td>
      <td>${r.company || ""}</td>
      <td>${r.items || ""}</td>
      <td>${r.doc_status || ""}</td>
      <td>
        <button class="approve-btn">อนุมัติ</button>
        <button class="reject-btn">ไม่อนุมัติ</button>
      </td>
    `;

    tr.querySelector(".approve-btn").addEventListener("click", () => {
      updateStatus(r.doc_no, "อนุมัติ");
    });

    tr.querySelector(".reject-btn").addEventListener("click", () => {
      updateStatus(r.doc_no, "ไม่อนุมัติ");
    });

    tb.appendChild(tr);
  });
}

async function updateStatus(docNo, status) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      action: "update",
      doc_no: docNo,
      status
    })
  });

  loadData();
}

document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("search");
  search.addEventListener("input", () => {
    const k = search.value.toLowerCase();
    const filtered = allData.filter((r) =>
      (r.doc_no || "").toLowerCase().includes(k) ||
      (r.name_th || "").toLowerCase().includes(k) ||
      (r.company || "").toLowerCase().includes(k)
    );
    render(filtered);
  });

  loadData();
});