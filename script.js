const sheetApiUrl = 'https://script.google.com/macros/s/AKfycbyCWIhZ0DvVGDPDI65N4SPgI7WrX2ntkrQxGqu6R_S6Ql3L4qUUWSzw2U3IMS1OHqU/exec';
let currentPage = 1;
const rowsPerPage = 5;
let tableData = [];

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
        const { countdown, class: chipClass } = calculateCountdown(item.time);
    
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.time}</td>
            <td><span class="chip ${chipClass}">${countdown}</span></td>
            <td><button class="button" onclick="showActionPopup('${item.name}', '${item.password}')">Confirm</button></td>
        `;
        dataBody.appendChild(row);
    });       

    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    for (let i = 1; i <= Math.min(totalPages, 10); i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.toggle('active', i === currentPage);
        button.onclick = () => {
            currentPage = i;
            renderTable();
        };
        pagination.appendChild(button);
    }

    if (totalPages > 10) {
        const dots = document.createElement('button');
        dots.textContent = '...';
        dots.disabled = true;
        pagination.appendChild(dots);
    }
}

function calculateCountdown(time) {
    const [day, times, date] = time.split(/,|\(|\)/).map(e => e.trim());
    const [startTime] = times.split('-');
    const [hour, minute] = startTime.split('.').map(Number);

    const eventTime = new Date();
    eventTime.setHours(hour, minute, 0, 0);
    eventTime.setDate(Number(date.split(' ')[0]));
    eventTime.setMonth(new Date().getMonth());

    const now = new Date();
    const diff = eventTime - now;

    if (diff <= 0) return { countdown: 'Dimulai', class: 'black' };

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
    } else if (hours >= 9) {
        chipClass = 'green';
    } else {
        chipClass = 'default';
    }

    return {
        countdown: `${hours}h ${minutes}m ${seconds}s`,
        class: chipClass,
    };
}

function searchData() {
    const searchValue = document.getElementById('search').value.toLowerCase();

    if (searchValue === '') {
        // Jika input kosong, kembalikan tabel ke data semula
        fetchData();
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

async function updateConfirmation(name) {
    try {
        await fetch(sheetApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, confirmed: true })
        });
        fetchData();
    } catch (error) {
        console.error('Error updating confirmation:', error);
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
        const zoomPopup = document.getElementById('zoomPopup');
        document.getElementById('zoomLink').href = 'YOUR_ZOOM_LINK_HERE';
        zoomPopup.classList.add('active');
        updateConfirmation(name);
    } else {
        alert('Invalid credentials!');
    }
});

function copyLink() {
    const zoomLink = document.getElementById('zoomLink').href;
    navigator.clipboard.writeText(zoomLink).then(() => {
        alert('Link copied!');
    });
}

fetchData();