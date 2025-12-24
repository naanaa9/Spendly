const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const filterBulan = document.getElementById("filterBulan");
const totalBulanan = document.getElementById("totalBulanan");
const tabel = document.getElementById("tabelLaporan");

filterBulan.addEventListener("change", renderLaporan);

// render awal
renderLaporan();

function renderLaporan() {
  const bulan = filterBulan.value;

  const filtered = bulan
    ? expenses.filter(e => e.tanggal.startsWith(bulan))
    : expenses;

  tabel.innerHTML = "";
  let total = 0;

  if (filtered.length === 0) {
    tabel.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;">Tidak ada data</td>
      </tr>
    `;
    totalBulanan.textContent = "Rp 0";
    return;
  }

  filtered.forEach(e => {
    total += e.jumlah;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.tanggal}</td>
      <td>${e.nama}</td>
      <td>Rp ${e.jumlah}</td>
    `;
    tabel.appendChild(tr);
  });

  totalBulanan.textContent = `Rp ${total}`;
}
