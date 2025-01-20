# 🎉 Waiting List Zoom Meeting PKM

![Banner](./assets/banner.png)

Welcome to **Waiting List Zoom Meeting PKM**, a project designed to manage Zoom meeting waitlists efficiently. Built with simplicity and functionality in mind, this project is a perfect tool for handling participant data, countdown timers, and quick actions in a user-friendly interface.

---

## 🚀 About Me

Hi there! 👋 I'm **Nawawi Megahertz**, an **IoT Engineer** and **Frontend Enthusiast** passionate about crafting elegant, responsive, and impactful solutions for the modern web. Let's connect and build something amazing together!

---

## 🛠️ Features

- **Search Functionality**: Quickly find participants by name.
- **Countdown Timer**: Live countdowns for upcoming events.
- **Pagination**: Easy navigation through long lists.
- **Confirmation System**: Interactive popups for confirming participation.
- **Responsive Design**: Seamless experience across devices.

---

## 🖥️ Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**

---

## 🧩 Code Highlights

Here are some code snippets showcasing the project's core functionality:

### Countdown Timer
```javascript
function updateCountdown(chipId, time) {
    const eventDate = new Date(time);
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

            chip.textContent = `${hours}h ${minutes}m ${seconds}s`;
            chip.className = 'chip green';
        }
    };
    intervalIds[chipId] = setInterval(updateChip, 1000);
    updateChip();
}
```

### Search Functionality
```javascript
function searchData() {
    const searchValue = document.getElementById('search').value.toLowerCase();

    if (searchValue === '') {
        fetchData();
        return;
    }

    const filteredData = tableData.filter(item => item.name.toLowerCase().includes(searchValue));
    if (filteredData.length > 0) {
        tableData = filteredData;
        renderTable();
    } else {
        alert('No matching data found!');
    }
}
```

---

## 🌐 Deployment

Easily deploy this project on **Vercel** by following these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/nawawimegahertz/waiting-list-zoom-meeting-pkm.git
   ```
2. Navigate to the project directory:
   ```bash
   cd waiting-list-zoom-meeting-pkm
   ```
3. Push the repository to a new Vercel project:
   ```bash
   vercel deploy
   ```
4. Share your live project link with others!

---

## 🎨 Design Highlights

- Modern and minimalistic layout.
- Intuitive color scheme for better accessibility.
- Fully responsive for mobile, tablet, and desktop users.

---

## 📌 Keep in Touch

Loved the project? Want to contribute or share feedback?

👉 **[Visit the Repository](https://github.com/nawawimegahertz/waiting-list-zoom-meeting-pkm)**

👉 **[Check Live Demo](#)** *(https://virtual-pkmcenterup.vercel.app)*

💬 Feel free to reach out with your ideas or suggestions!

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

Happy coding! ✨
