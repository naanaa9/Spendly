let editIndex = null;

const namaInput = document.getElementById("nama");
const jumlahInput = document.getElementById("jumlah");
const tanggalInput = document.getElementById("tanggal");
const btnTambah = document.getElementById("btnTambah");
const list = document.getElementById("list");
const totalEl = document.getElementById("total");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

/* =====================
  Helper
===================== */
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

/* =====================
  Render
===================== */
function render() {
  list.innerHTML = "";
  let total = 0;

  expenses.forEach((e, index) => {
    total += e.jumlah;

    const li = document.createElement("li");
    li.className = "item";

    li.innerHTML = `
      <div class="item-info">
        <span class="item-name">${e.nama}</span>
        <span class="item-price">${formatRupiah(e.jumlah)}</span>
      </div>

      <div class="item-actions">
        <button class="btn btn-edit" onclick="editItem(${index})">Edit</button>
        <button class="btn btn-delete" onclick="hapusItem(${index})">Hapus</button>
      </div>
    `;

    list.appendChild(li);
  });

  totalEl.textContent = formatRupiah(total);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

/* =====================
  Tambah
===================== */
btnTambah.addEventListener("click", () => {
  const nama = namaInput.value.trim();
  const jumlah = Number(jumlahInput.value);
  const tanggal = tanggalInput.value;

  if (!nama || !jumlah || !tanggal) {
    alert("Lengkapi semua data");
    return;
  }

  if (editIndex !== null) {
  // mode edit
  expenses[editIndex] = { nama, jumlah, tanggal };
  editIndex = null;
  btnTambah.textContent = "Tambah";
} else {
  // mode tambah
  expenses.push({ nama, jumlah, tanggal });
}


  namaInput.value = "";
  jumlahInput.value = "";
  tanggalInput.value = "";

  render();
});

/* =====================
  Hapus
===================== */
function hapusItem(index) {
  if (!confirm("Hapus pengeluaran ini?")) return;
  expenses.splice(index, 1);
  render();
}

/* =====================
  Edit
===================== */
function editItem(index) {
  const e = expenses[index];

  namaInput.value = e.nama;
  jumlahInput.value = e.jumlah;
  tanggalInput.value = e.tanggal;

  editIndex = index;
  btnTambah.textContent = "Simpan";
}

/* render awal */
render();
function render() {
  list.innerHTML = "";
  let total = 0;

  if (expenses.length === 0) {
    list.innerHTML = `
      <tr>
        <td colspan="4" class="empty">Belum ada pengeluaran</td>
      </tr>
    `;
    totalEl.textContent = formatRupiah(0);
    return;
  }

  expenses.forEach((e, index) => {
    total += e.jumlah;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(e.tanggal).toLocaleDateString("id-ID")}</td>
      <td>${e.nama}</td>
      <td><strong>${formatRupiah(e.jumlah)}</strong></td>
      <td>
        <div class="item-actions">
          <button class="btn btn-edit" onclick="editItem(${index})">Edit</button>
          <button class="btn btn-delete" onclick="hapusItem(${index})">Hapus</button>
        </div>
      </td>
    `;

    list.appendChild(tr);
  });

  totalEl.textContent = formatRupiah(total);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
