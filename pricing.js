// pricing.js

// List of logos to display in the marquee
const logos = [
    'logos/ReadMe.svg',
    'logos/lance.75d2b96f.svg',
    'logos/qdrant.f77bf1d6 (1).svg',
    'logos/chroma.79c06944.svg',
    'logos/Llama.a78f5eee.svg',
    'logos/pinecone.1f6238a6.svg',
    'logos/openai.7105eda8.svg'
];

const marqueeContent = document.querySelector('.marquee-content');
logos.forEach(logo => {
    const img = document.createElement('img');
    img.src = logo;
    marqueeContent.appendChild(img);
});
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

// Duplicate the logo array without cloning nodes
const totalWidth = marqueeContent.scrollWidth;
const parentWidth = marqueeContent.parentElement.clientWidth;
while (marqueeContent.scrollWidth < parentWidth * 2) {
    logos.forEach(logo => {
        const img = document.createElement('img');
        img.src = logo;
        marqueeContent.appendChild(img);
    });
}
