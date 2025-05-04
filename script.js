
let data = [];
const resultList = document.getElementById('result-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const catButtons = document.querySelectorAll('.cat-btn');

// Load JSON data
fetch('inventory_data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    renderList(data);
  });

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMatch(text) {
  const query = searchInput.value.trim();
  if (!query) return text;
  try {
    const safeQuery = escapeRegExp(query);
    const regex = new RegExp("(" + safeQuery + ")", "gi");
    return text.replace(regex, "<mark>$1</mark>");
  } catch (e) {
    return text; // fallback in case of regex error
  }
}

function renderList(items) {
  resultList.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `
      <span class="number">${item.Number}</span> - 
      <span class="text">${highlightMatch(item.Description)} | تعداد: ${highlightMatch(item.Quantity)} | وزن: ${highlightMatch(item.Weight)}</span>
    `;
    resultList.appendChild(div);
  });
}

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    renderList(data);
  } else {
    const filtered = data.filter(item =>
      item.Description.toLowerCase().includes(query) ||
      item.Quantity.toLowerCase().includes(query) ||
      item.Weight.toLowerCase().includes(query) ||
      item.Number.toLowerCase().includes(query)
    );
    renderList(filtered);
  }
});

searchInput.addEventListener('input', () => {
  searchBtn.click();
});

catButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.getAttribute('data-category');
    if (cat === 'All') {
      renderList(data);
    } else {
      const filtered = data.filter(item => item.Category === cat);
      renderList(filtered);
    }
  });
});
