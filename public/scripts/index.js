const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

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
