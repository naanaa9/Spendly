const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const filterBulan = document.getElementById("filterBulan");
const totalBulanan = document.getElementById("totalBulanan");
const tabel = document.getElementById("tabelLaporan");
const ctx = document.getElementById("chartBulanan");

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

/* =========================
  Event
========================= */
filterBulan.addEventListener("change", renderLaporan);

/* =========================
  Render Chart
========================= */
function renderChart(data) {
  const group = {};

  data.forEach(e => {
    const tgl = formatTanggal(e.tanggal);
    group[tgl] = (group[tgl] || 0) + e.jumlah;
  });

  const labels = Object.keys(group);
  const values = Object.values(group);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Pengeluaran",
        data: values,
        backgroundColor: "#6366F1",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => formatRupiah(ctx.raw)
          }
        }
      },
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
  Render Laporan
========================= */
function renderLaporan() {
  const bulan = filterBulan.value;

  const filtered = expenses.filter(e =>
    bulan ? e.tanggal.startsWith(bulan) : true
  );

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
}

/* =========================
  Initial Render
========================= */
renderLaporan();
