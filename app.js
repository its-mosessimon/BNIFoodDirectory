const AREA_ORDER = ["Central / City","West","East","North / North-East","South / South-West","Location TBC"];

let DATA = [];
let activeArea = "all";
let query = "";

function splitLocation(loc){
  const parts = loc.split('—');
  if(parts.length >= 2)// Schema note: brands can now have multiple outlets (e.g. Dian Xiao Er x9).
// "location" = raw outlet/address string as printed (may or may not contain an em dash).
// "phone" = raw reservation string — can be a number, "<number> (WhatsApp)", or a placeholder like "No public phone listed".
let DATA = [];

const AREA_ORDER = ["Central / City","West","East","North / North-East","South / South-West","Location TBC"];
let activeArea = "all";
let query = "";

function splitLocation(loc){
  const parts = loc.split('—');
  if(parts.length >= 2){
    return { head: parts[0].trim(), tail: parts.slice(1).join('—').trim() };
  }
  return { head: null, tail: loc.trim() };
}

function isPlaceholderLocation(loc){
  return /not provided|not confirmed/i.test(loc);
}

function buildPhoneHTML(phone){
  if(!phone || /^No public phone/i.test(phone) || /^Need /i.test(phone)){
    return `<span class="phone-missing">${phone || 'No contact listed'}</span>`;
  }
  const explicitWA = /whatsapp/i.test(phone);
  const digits = phone.replace(/\(WhatsApp\)/i,'').replace(/\s/g,'').trim();

  if(explicitWA){
    // source already flags this as WhatsApp-only (e.g. no separate voice line given)
    return `<a class="phone-link whatsapp" href="https://wa.me/65${digits}" target="_blank" rel="noopener">${digits} (WhatsApp)</a>`;
  }

  const isMobile = /^[89]/.test(digits); // SG mobile numbers start 8 or 9; landlines start 6
  const telLink = `<a class="phone-link" href="tel:+65${digits}">${digits}</a>`;
  if(isMobile){
    const waLink = `<a class="phone-link whatsapp" href="https://wa.me/65${digits}" target="_blank" rel="noopener">WhatsApp</a>`;
    return `${telLink} <span class="phone-sep">·</span> ${waLink}`;
  }
  return telLink;
}

function buildChips(){
  const scroll = document.getElementById('chipScroll');
  scroll.innerHTML = '';
  const allChip = document.createElement('div');
  allChip.className = 'chip all' + (activeArea==='all' ? ' active' : '');
  allChip.textContent = 'ALL AREAS';
  allChip.onclick = () => { activeArea='all'; render(); };
  scroll.appendChild(allChip);

  AREA_ORDER.forEach(area=>{
    if(!DATA.some(d=>d.area===area)) return;
    const chip = document.createElement('div');
    chip.className = 'chip' + (activeArea===area ? ' active' : '');
    chip.style.background = '#A85258';
    chip.textContent = area;
    chip.onclick = () => { activeArea = (activeArea===area ? 'all' : area); render(); };
    scroll.appendChild(chip);
  });
}

function render(){
  buildChips();
  const main = document.getElementById('main');
  main.innerHTML = '';

  const q = query.trim().toLowerCase();
  const filtered = DATA.filter(d=>{
    const areaMatch = activeArea==='all' || d.area===activeArea;
    const text = (d.brand+' '+d.owner+' '+d.cuisine+' '+d.chapter+' '+d.location).toLowerCase();
    const searchMatch = !q || text.includes(q);
    return areaMatch && searchMatch;
  });

  document.getElementById('resultCount').textContent = filtered.length + ' outlet' + (filtered.length!==1?'s':'');

  if(filtered.length===0){
    main.innerHTML = '<div class="empty-state">No matches. Try a different area or search term.</div>';
    return;
  }

  AREA_ORDER.forEach(area=>{
    const items = filtered.filter(d=>d.area===area);
    if(items.length===0) return;
    const block = document.createElement('div');
    block.className = 'area-block';
    block.innerHTML = `<div class="area-title">${area}</div>`;

    // group by brand within this area so multi-outlet brands (e.g. Dian Xiao Er) read as one unit
    const brands = [...new Set(items.map(d=>d.brand))];
    brands.forEach(brandName=>{
      const outlets = items.filter(d=>d.brand===brandName);
      const first = outlets[0];
      const group = document.createElement('div');
      group.className = 'brand-group';
      group.innerHTML = `<div class="brand-group-header">${brandName}
        <span class="cuisine-inline">${first.cuisine}</span>
        ${outlets.length>1 ? `<span class="outlet-count">${outlets.length} outlets</span>` : ''}
        <span class="chapter-tag">${first.chapter}</span>
      </div>`;

      outlets.forEach(d=>{
        const loc = splitLocation(d.location);
        const placeholder = isPlaceholderLocation(d.location);
        const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(d.location + ', Singapore');
        const card = document.createElement('div');
        card.className = 'card';

        let locationHTML;
        if(placeholder){
          locationHTML = `<span class="location-line">${d.location}</span>`;
        } else if(loc.head){
          locationHTML = `<span class="location-line">${loc.head}</span><a class="maps-link" href="${mapsUrl}" target="_blank" rel="noopener">${loc.tail}</a>`;
        } else {
          locationHTML = `<a class="location-line linked" href="${mapsUrl}" target="_blank" rel="noopener">${loc.tail}</a>`;
        }

        card.innerHTML = `
          ${locationHTML}
          <div class="meta-row">
            <b>Owner</b> ${d.owner}<br>
            <b>Contact</b> ${buildPhoneHTML(d.phone)}
          </div>`;
        group.appendChild(card);
      });
      block.appendChild(group);
    });
    main.appendChild(block);
  });
}

document.getElementById('search').addEventListener('input', e=>{
  query = e.target.value;
  render();
});

fetch('./data.json')
  .then(res => {
    if(!res.ok) throw new Error('Failed to load data.json');
    return res.json();
  })
  .then(json => {
    DATA = json;
    render();
  })
  .catch(err => {
    document.getElementById('main').innerHTML =
      `<div class="error-state">Couldn't load the directory data.<br>${err.message}</div>`;
  });
{
    return { head: parts[0].trim(), tail: parts.slice(1).join('—').trim() };
  }
  return { head: loc.trim(), tail: '' };
}

function buildChips(){
  const scroll = document.getElementById('chipScroll');
  scroll.innerHTML = '';
  const allChip = document.createElement('div');
  allChip.className = 'chip all' + (activeArea==='all' ? ' active' : '');
  allChip.textContent = 'ALL AREAS';
  allChip.onclick = () => { activeArea='all'; render(); };
  scroll.appendChild(allChip);

  AREA_ORDER.forEach(area=>{
    if(!DATA.some(d=>d.area===area)) return;
    const chip = document.createElement('div');
    chip.className = 'chip' + (activeArea===area ? ' active' : '');
    chip.style.background = '#A85258';
    chip.textContent = area;
    chip.onclick = () => { activeArea = (activeArea===area ? 'all' : area); render(); };
    scroll.appendChild(chip);
  });
}

function render(){
  buildChips();
  const main = document.getElementById('main');
  main.innerHTML = '';

  const q = query.trim().toLowerCase();
  const filtered = DATA.filter(d=>{
    const areaMatch = activeArea==='all' || d.area===activeArea;
    const text = (d.brand+' '+d.owner+' '+d.cuisine+' '+d.chapter+' '+d.location).toLowerCase();
    const searchMatch = !q || text.includes(q);
    return areaMatch && searchMatch;
  });

  document.getElementById('resultCount').textContent = filtered.length + ' listing' + (filtered.length!==1?'s':'');

  if(filtered.length===0){
    main.innerHTML = '<div class="empty-state">No matches. Try a different area or search term.</div>';
    return;
  }

  AREA_ORDER.forEach(area=>{
    const items = filtered.filter(d=>d.area===area);
    if(items.length===0) return;
    const block = document.createElement('div');
    block.className = 'area-block';
    block.innerHTML = `<div class="area-title">${area}</div>`;
    items.forEach(d=>{
      const loc = splitLocation(d.location);
      const isTBC = /tbc/i.test(d.location);
      const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(d.location + ', Singapore');
      const addressHTML = loc.tail
        ? (isTBC ? loc.tail : `<a class="maps-link" href="${mapsUrl}" target="_blank" rel="noopener">${loc.tail}</a>`)
        : '';
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="location-line">${loc.head}</div>
        <div class="card-top">
          <div class="brand">${d.brand}</div>
          <div class="chapter-tag">${d.chapter}</div>
        </div>
        <div class="cuisine">${d.cuisine}</div>
        <div class="meta-row">
          <b>Owner</b> ${d.owner}${addressHTML ? `<br><span class="location">${addressHTML}</span>` : ''}
        </div>`;
      block.appendChild(card);
    });
    main.appendChild(block);
  });
}

document.getElementById('search').addEventListener('input', e=>{
  query = e.target.value;
  render();
});

fetch('./data.json')
  .then(res => {
    if(!res.ok) throw new Error('Failed to load data.json');
    return res.json();
  })
  .then(json => {
    DATA = json;
    render();
  })
  .catch(err => {
    document.getElementById('main').innerHTML =
      `<div class="error-state">Couldn't load the directory data.<br>${err.message}</div>`;
  });
