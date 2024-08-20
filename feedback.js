// feedback.js
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.body.classList.remove(`${currentTheme}-theme`);
    document.body.classList.add(`${newTheme}-theme`);

    localStorage.setItem('theme', newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.theme-toggle-btn').addEventListener('click', toggleTheme);

    // Load the saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(`${savedTheme}-theme`);
});

document.addEventListener('DOMContentLoaded', () => {
    const feedbacks = [
        {
            name: "Alice Johnson",
            role: "Product Manager @ TaskMaster",
            photo: "https://randomuser.me/api/portraits/women/1.jpg",
            feedback: "The task manager has transformed how we organize our projects. The interface is so intuitive!"
        },
        {
            name: "Bob Smith",
            role: "Developer @ CodeBase",
            photo: "https://randomuser.me/api/portraits/men/1.jpg",
            feedback: "I love how easy it is to track our sprints and backlogs with this tool."
        },
        {
            name: "Carla Gomez",
            role: "CEO @ StartupHub",
            photo: "https://randomuser.me/api/portraits/women/2.jpg",
            feedback: "The best task manager out there! It keeps our team productive and on track."
        },
        {
            name: "Daniel Wu",
            role: "Freelancer",
            photo: "https://randomuser.me/api/portraits/men/2.jpg",
            feedback: "Managing freelance projects has never been easier. A must-have tool!"
        }
    ];

    const feedbackWrapper = document.getElementById('feedbackWrapper');

    function createFeedbackItem(feedback) {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <img src="${feedback.photo}" alt="${feedback.name}">
            <h3>${feedback.name}</h3>
            <h4>${feedback.role}</h4>
            <p>${feedback.feedback}</p>
        `;
        return feedbackItem;
    }

    // Append feedback items initially
    for (let i = 0; i < 30; i++) {
        feedbacks.forEach(feedback => {
            feedbackWrapper.appendChild(createFeedbackItem(feedback));
        });
    }

    const parentWidth = feedbackWrapper.parentElement.clientWidth;

    // Ensure at least twice the width of the parent container is covered
    while (feedbackWrapper.scrollWidth < parentWidth * 2) {
        feedbacks.forEach(feedback => {
            feedbackWrapper.appendChild(createFeedbackItem(feedback));
        });
    }
});

