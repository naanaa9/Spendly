const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const filterBulan = document.getElementById("filterBulan");
const totalBulanan = document.getElementById("totalBulanan");
const tabel = document.getElementById("tabelLaporan");
const ctx = document.getElementById("chartBulanan");
const compareText = document.getElementById("compareText");

let chart;

/* =========================
  Helper
========================= */
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

function formatTanggal(tgl) {
  return new Date(tgl).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

/* =========================
  Default bulan sekarang
========================= */
const today = new Date();
filterBulan.value = today.toISOString().slice(0, 7);

filterBulan.addEventListener("change", renderLaporan);

/* =========================
  Chart
========================= */
function renderChart(data) {
  const group = {};

  data.forEach(e => {
    const tgl = formatTanggal(e.tanggal);
    group[tgl] = (group[tgl] || 0) + e.jumlah;
  });

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(group),
      datasets: [{
        data: Object.values(group),
        backgroundColor: "#6366F1",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: {
            callback: value => formatRupiah(value)
          }
        }
      }
    }
  });
}

/* =========================
  Total per bulan
========================= */
function getTotalByMonth(month) {
  return expenses
    .filter(e => e.tanggal.startsWith(month))
    .reduce((sum, e) => sum + e.jumlah, 0);
}

/* =========================
  Perbandingan Bulan
========================= */
function renderPerbandinganBulan(bulanAktif) {
  const currentTotal = getTotalByMonth(bulanAktif);

  const [year, month] = bulanAktif.split("-");
  const prevDate = new Date(year, month - 2, 1);
  const prevMonth = prevDate.toISOString().slice(0, 7);

  const prevTotal = getTotalByMonth(prevMonth);

  if (prevTotal === 0) {
    compareText.textContent = "Belum ada data bulan sebelumnya";
    compareText.className = "";
    return;
  }

  const diff = currentTotal - prevTotal;
  const percent = Math.round((diff / prevTotal) * 100);
  const nominal = formatRupiah(Math.abs(diff));

  if (diff > 0) {
    compareText.textContent = `⬆️ Naik ${percent}% (+${nominal})`;
    compareText.className = "compare-up";
  } else if (diff < 0) {
    compareText.textContent = `⬇️ Turun ${Math.abs(percent)}% (-${nominal})`;
    compareText.className = "compare-down";
  } else {
    compareText.textContent = "Tidak ada perubahan dari bulan sebelumnya";
    compareText.className = "";
  }
}

/* =========================
  Render Laporan
========================= */
function renderLaporan() {
  const bulan = filterBulan.value;
  const filtered = expenses.filter(e => e.tanggal.startsWith(bulan));

  tabel.innerHTML = "";
  let total = 0;

  if (filtered.length === 0) {
    tabel.innerHTML = `
      <tr>
        <td colspan="3" class="empty">Tidak ada data pengeluaran</td>
      </tr>
    `;
    totalBulanan.textContent = formatRupiah(0);
    if (chart) chart.destroy();
    compareText.textContent = "";
    return;
  }

  filtered.forEach(e => {
    total += e.jumlah;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatTanggal(e.tanggal)}</td>
      <td>${e.nama}</td>
      <td class="amount">${formatRupiah(e.jumlah)}</td>
    `;
    tabel.appendChild(tr);
  });

  totalBulanan.textContent = formatRupiah(total);
  renderChart(filtered);
  renderPerbandinganBulan(bulan);
}

/* =========================
  Initial Render
========================= */
renderLaporan();

document.getElementById("btnExport").addEventListener("click", exportExcel);

function exportExcel() {
  const bulan = filterBulan.value;
  const filtered = expenses.filter(e =>
    e.tanggal.startsWith(bulan)
  );

  if (filtered.length === 0) {
    alert("Tidak ada data untuk diexport");
    return;
  }

  const data = filtered.map(e => ({
    Tanggal: formatTanggal(e.tanggal),
    Nama: e.nama,
    Jumlah: e.jumlah
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

  XLSX.writeFile(workbook, `Laporan-${bulan}.xlsx`);
}
