const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

// Listen for toggle click
themeToggleBtn.addEventListener('click', toggleMode)

function toggleMode() {
    // toggle icon 
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if not in localstorage
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    }
}

// tabs switcher event listener
tabs.forEach((tab) => tab.addEventListener('click', onTabClick));

function onTabClick(e) {
    tabs.forEach((tab) => {
        tab.children[0].classList.remove(
            'border-b-4'
        )
    })

    // hide panels
    panels.forEach((panel) => panel.classList.add('hidden'));

    // activate a new tab panel based on the click target
    e.target.classList.add('border-b-4');

    const dataTarget = e.target.getAttribute('data-target');
    document
        .getElementById('panels')
        .getElementsByClassName(dataTarget)[0]
        .classList.remove('hidden');
}