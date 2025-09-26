document.addEventListener('DOMContentLoaded', () => {
  const SMALL_WORDS = new Set(['and','or','the','a','an','with','of','in','on','to','for','by','at','from']);

  function toTitleCase(input) {
    return input
      .toLowerCase()
      .split(/\s+/)
      .map((word, index, arr) => {
        if (word.length === 0) return word;
        // Keep all-caps abbreviations (3+ letters) as is from original
        // Not available after lowercasing; assume none critical here
        if (index !== 0 && index !== arr.length - 1 && SMALL_WORDS.has(word)) {
          return word;
        }
        // Handle hyphenated words
        return word
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('-');
      })
      .join(' ');
  }

  document.querySelectorAll('.menu-item').forEach(item => {
    const nameSpan = item.querySelector('.name');
    const priceSpan = item.querySelector('.price');
    if (!nameSpan || !priceSpan) return;

    const original = nameSpan.textContent.trim();
    if (!original) return;

    // Split name and description by an en dash/emdash/regular dash
    const parts = original.split(/\s+[-–—]\s+/);
    const rawName = parts[0] || original;
    const rawDesc = parts.slice(1).join(' — ');

    const titleName = toTitleCase(rawName);

    // Build new structure: <strong class="item-title">Name</strong> <span class="desc">Description</span>
    const frag = document.createDocumentFragment();
    const strong = document.createElement('strong');
    strong.className = 'item-title';
    strong.textContent = titleName;
    frag.appendChild(strong);

    if (rawDesc) {
      const space = document.createTextNode(' ');
      frag.appendChild(space);
      const desc = document.createElement('span');
      desc.className = 'desc';
      desc.textContent = rawDesc;
      frag.appendChild(desc);
    }

    nameSpan.replaceChildren(frag);

    // Move price to next line by wrapping it
    priceSpan.classList.add('price-line');
  });
});


