let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = null;

const namaInput = document.getElementById("nama");
const jumlahInput = document.getElementById("jumlah");
const tanggalInput = document.getElementById("tanggal");
const list = document.getElementById("list");
const totalSpan = document.getElementById("total");
const btnTambah = document.getElementById("btnTambah");

btnTambah.addEventListener("click", simpanPengeluaran);

render();

function simpanPengeluaran() {
  const nama = namaInput.value.trim();
  const jumlah = Number(jumlahInput.value);
  const tanggal = tanggalInput.value;

  if (!nama || !jumlah || !tanggal) {
    alert("Semua field harus diisi");
    return;
  }

  if (editIndex !== null) {
    expenses[editIndex] = { nama, jumlah, tanggal };
    editIndex = null;
    btnTambah.textContent = "Tambah";
  } else {
    expenses.push({ nama, jumlah, tanggal });
  }

  localStorage.setItem("expenses", JSON.stringify(expenses));

  namaInput.value = "";
  jumlahInput.value = "";
  tanggalInput.value = "";

  render();
}

function render() {
  list.innerHTML = "";
  let total = 0;

  expenses.forEach((e, i) => {
    total += e.jumlah;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${e.nama} - Rp ${e.jumlah}</span>
      <div>
        <button onclick="editItem(${i})">Edit</button>
        <button onclick="hapusItem(${i})">Hapus</button>
      </div>
    `;
    list.appendChild(li);
  });

  totalSpan.textContent = `Rp ${total}`;
}

function editItem(index) {
  const e = expenses[index];
  namaInput.value = e.nama;
  jumlahInput.value = e.jumlah;
  tanggalInput.value = e.tanggal;
  editIndex = index;
  btnTambah.textContent = "Update";
}

function hapusItem(index) {
  if (!confirm("Hapus pengeluaran ini?")) return;
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}
