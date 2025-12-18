let total = 0;


const namaInput = document.getElementById('nama');
const jumlahInput = document.getElementById('jumlah');
const list = document.getElementById('list');
const totalSpan = document.getElementById('total');
const btnTambah = document.getElementById('btnTambah');


btnTambah.addEventListener('click', tambahPengeluaran);


function tambahPengeluaran() {
const nama = namaInput.value.trim();
const jumlah = Number(jumlahInput.value);


if (!nama || !jumlah) {
alert('Nama dan jumlah harus diisi');
return;
}


const li = document.createElement('li');
li.innerHTML = `<span>${nama}</span><span>Rp ${jumlah.toLocaleString('id-ID')}</span>`;
list.appendChild(li);


total += jumlah;
totalSpan.textContent = total.toLocaleString('id-ID');


namaInput.value = '';
jumlahInput.value = '';
}