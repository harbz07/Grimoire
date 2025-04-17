
async function loadGrimoire() {
  const res = await fetch('grimoire.json');
  const data = await res.json();
  const container = document.getElementById('grimoire-container');
  const categories = {};

  data.forEach(entry => {
    if (!categories[entry.category]) {
      categories[entry.category] = [];
    }
    categories[entry.category].push(entry);
  });

  Object.entries(categories).forEach(([category, commands]) => {
    const section = document.createElement('div');
    section.className = 'category-section';

    const toggle = document.createElement('button');
    toggle.className = 'toggle-btn';
    toggle.textContent = category;
    toggle.addEventListener('click', () => {
      list.classList.toggle('hidden');
    });

    const list = document.createElement('div');
    list.className = 'command-list';

    commands.forEach(({ name, description }) => {
      const div = document.createElement('div');
      div.className = 'command';
      div.innerHTML = `<span class='command-name'>${name}:</span> ${description}`;
      list.appendChild(div);
    });

    section.appendChild(toggle);
    section.appendChild(list);
    container.appendChild(section);
  });

  document.getElementById('search').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.command').forEach(cmd => {
      const text = cmd.textContent.toLowerCase();
      cmd.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

loadGrimoire();
