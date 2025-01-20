const sheetApiUrl = 'https://script.google.com/macros/s/AKfycbyCWIhZ0DvVGDPDI65N4SPgI7WrX2ntkrQxGqu6R_S6Ql3L4qUUWSzw2U3IMS1OHqU/exec';
let currentPage = 1;
const rowsPerPage = 5;
let tableData = [];

// Mengelola elemen countdown secara independen
let intervalIds = [];

async function fetchData() {
    try {
        const response = await fetch(sheetApiUrl);
        tableData = await response.json();
        tableData = tableData.filter(item => !item.confirmed);
        tableData.sort((a, b) => new Date(a.time) - new Date(b.time));

        renderTable();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTable() {
    const dataBody = document.getElementById('dataBody');
    dataBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, tableData.length);
    const pageData = tableData.slice(start, end);

    pageData.forEach(item => {
        const row = document.createElement('tr');
        const chipId = `chip-${item.name.replace(/\s+/g, '-')}`;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.time}</td>
            <td><span id="${chipId}" class="chip"></span></td>
            <td><button class="button" onclick="showActionPopup('${item.name}', '${item.password}')">Confirm</button></td>
        `;
        dataBody.appendChild(row);

        // Atur countdown untuk setiap chip
        updateCountdown(chipId, item.time);
    });

    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    const maxButtons = 5; // Maksimal 5 tombol halaman

    let rangeStart = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let rangeEnd = Math.min(totalPages, rangeStart + maxButtons - 1);

    if (rangeEnd - rangeStart + 1 < maxButtons) {
        rangeStart = Math.max(1, rangeEnd - maxButtons + 1);
    }

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = '<';
        prevButton.classList.add('nav');
        prevButton.onclick = () => {
            currentPage--;
            renderTable();
        };
        pagination.appendChild(prevButton);
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.toggle('active', i === currentPage);
        button.onclick = () => {
            currentPage = i;
            renderTable();
        };
        pagination.appendChild(button);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = '>';
        nextButton.classList.add('nav');
        nextButton.onclick = () => {
            currentPage++;
            renderTable();
        };
        pagination.appendChild(nextButton);
    }
}

// Contoh data waktu: `Jumat, 16.30-18.30 WIB (22 Januari)`

function updateCountdown(chipId, time) {
    const [day, times, date] = time.split(/,|\(|\)/).map(e => e.trim());
    const [startTime] = times.split('-');
    const [hour, minute] = startTime.split('.').map(Number);

    const eventDate = new Date();
    eventDate.setHours(hour, minute, 0, 0);
    eventDate.setDate(Number(date.split(' ')[0]));
    eventDate.setMonth(new Date().getMonth());

    const updateChip = () => {
        const now = new Date();
        const diff = eventDate - now;

        const chip = document.getElementById(chipId);
        if (!chip) return;

        if (diff <= 0) {
            chip.textContent = 'Dimulai';
            chip.className = 'chip black';
            clearInterval(intervalIds[chipId]);
        } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            let chipClass;
            if (hours <= 1) {
                chipClass = 'red';
            } else if (hours <= 3) {
                chipClass = 'pink';
            } else if (hours <= 6) {
                chipClass = 'yellow';
            } else {
                chipClass = 'green';
            }

            chip.textContent = `${hours}h ${minutes}m ${seconds}s`;
            chip.className = `chip ${chipClass}`;
        }
    };

    if (intervalIds[chipId]) clearInterval(intervalIds[chipId]);
    intervalIds[chipId] = setInterval(updateChip, 1000);
    updateChip(); // Jalankan langsung pertama kali
}

function searchData() {
    const searchValue = document.getElementById('search').value.toLowerCase();

    if (searchValue === '') {
        fetchData(); // Kembalikan ke data awal jika pencarian kosong
        currentPage = 1; // Reset ke halaman pertama
        return;
    }

    const filteredData = tableData.filter(item => item.name.toLowerCase().includes(searchValue));
    if (filteredData.length > 0) {
        tableData = filteredData;
        currentPage = 1;
        renderTable();
    } else {
        alert('Tidak ditemukan data yang sesuai!');
    }
}

function showActionPopup(name, password) {
    const popup = document.getElementById('actionPopup');
    popup.classList.add('active');
    document.getElementById('popupName').value = name;
    document.getElementById('popupPassword').dataset.password = password;
}

function closePopup(id) {
    document.getElementById(id).classList.remove('active');
}

document.getElementById('submitPopup').addEventListener('click', () => {
    const name = document.getElementById('popupName').value;
    const password = document.getElementById('popupPassword').value;
    const expectedPassword = document.getElementById('popupPassword').dataset.password;

    if (password === expectedPassword) {
        closePopup('actionPopup');
        updateConfirmation(name);
    } else {
        alert('Invalid credentials!');
    }
});

fetchData();