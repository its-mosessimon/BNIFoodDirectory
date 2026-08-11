// halal: "HALAL ✓" | "HALAL ✓*" | "MUSLIM-OWNED ✓" | "NON-HALAL" | "Not verified"
// phone: plain number | "<number> (WhatsApp)" | "<number> / WhatsApp <alt>" | "<number> / <alt>" | placeholder text (TBC, "No public phone listed", "Not publicly listed", "Need ...")
let DATA = [];

const AREA_ORDER = ["Central / City","West","East","North / North-East","South / South-West","Location TBC"];
let activeArea = "all";
let query = "";
let halalOnly = false;

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

function isPlaceholderPhone(phone){
  return !phone || /^(TBC|No public phone|Not publicly listed|Need )/i.test(phone);
}

function buildPhoneHTML(phone){
  if(isPlaceholderPhone(phone)){
    return `<span class="phone-missing">${phone || 'No contact listed'}</span>`;
  }

  // handle "<number> / WhatsApp <alt>" or "<number> / <alt>" patterns
  if(phone.includes('/')){
    const segments = phone.split('/').map(s => s.trim());
    const primaryDigits = segments[0].replace(/\s/g,'');
    const primaryIsMobile = /^[89]/.test(primaryDigits);
    let html = `<a class="phone-link" href="tel:+65${primaryDigits}">${segments[0]}</a>`;
    if(primaryIsMobile){
      html += ` <span class="phone-sep">·</span> <a class="phone-link whatsapp" href="https://wa.me/65${primaryDigits}" target="_blank" rel="noopener">WhatsApp</a>`;
    }
    segments.slice(1).forEach(seg=>{
      const altDigits = seg.replace(/whatsapp/i,'').replace(/[\s-]/g,'').trim();
      if(altDigits){
        html += ` <span class="phone-sep">·</span> <a class="phone-link whatsapp" href="https://wa.me/65${altDigits}" target="_blank" rel="noopener">Alt WhatsApp</a>`;
      }
    });
    return html;
  }

  const explicitWA = /whatsapp/i.test(phone);
  const digits = phone.replace(/\(WhatsApp\)/i,'').replace(/\s/g,'').trim();

  if(explicitWA){
    return `<a class="phone-link whatsapp" href="https://wa.me/65${digits}" target="_blank" rel="noopener">${digits} (WhatsApp)</a>`;
  }

  const isMobile = /^[89]/.test(digits);
  const telLink = `<a class="phone-link" href="tel:+65${digits}">${digits}</a>`;
  if(isMobile){
    const waLink = `<a class="phone-link whatsapp" href="https://wa.me/65${digits}" target="_blank" rel="noopener">WhatsApp</a>`;
    return `${telLink} <span class="phone-sep">·</span> ${waLink}`;
  }
  return telLink;
}

function halalTagHTML(halal){
  if(!halal || /^Not verified$/i.test(halal)) return '';
  if(/^HALAL/i.test(halal)){
    const note = halal.includes('*') ? ' title="Hotel/food-operation certification context"' : '';
    return `<span class="halal-tag halal"${note}>HALAL ✓${halal.includes('*') ? ' *' : ''}</span>`;
  }
  if(/^MUSLIM-OWNED/i.test(halal)){
    return `<span class="halal-tag muslim" title="Muslim-owned; not automatically MUIS-certified">MUSLIM-OWNED</span>`;
  }
  if(/^NON-HALAL/i.test(halal)){
    return `<span class="halal-tag non-halal">NON-HALAL</span>`;
  }
  return '';
}

function isHalalPositive(halal){
  return /^HALAL/i.test(halal) || /^MUSLIM-OWNED/i.test(halal);
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
    const halalMatch = !halalOnly || isHalalPositive(d.halal);
    const text = (d.brand+' '+d.owner+' '+d.cuisine+' '+d.chapter+' '+d.location).toLowerCase();
    const searchMatch = !q || text.includes(q);
    return areaMatch && halalMatch && searchMatch;
  });

  document.getElementById('resultCount').textContent = filtered.length + ' outlet' + (filtered.length!==1?'s':'');

  if(filtered.length===0){
    main.innerHTML = '<div class="empty-state">No matches. Try a different area, or turn off Halal Only.</div>';
    return;
  }

  AREA_ORDER.forEach(area=>{
    const items = filtered.filter(d=>d.area===area);
    if(items.length===0) return;
    const block = document.createElement('div');
    block.className = 'area-block';
    block.innerHTML = `<div class="area-title">${area}</div>`;

    const brands = [...new Set(items.map(d=>d.brand))];
    brands.forEach(brandName=>{
      const outlets = items.filter(d=>d.brand===brandName);
      const first = outlets[0];
      const group = document.createElement('div');
      group.className = 'brand-group';
      group.innerHTML = `<div class="brand-group-header">${brandName}
        <span class="cuisine-inline">${first.cuisine}</span>
        ${outlets.length>1 ? `<span class="outlet-count">${outlets.length} outlets</span>` : ''}
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
          <div class="card-top">
            ${locationHTML}
            <div class="tag-group">
              ${halalTagHTML(d.halal)}
              <span class="chapter-tag">${d.chapter}</span>
            </div>
          </div>
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

document.getElementById('halalToggle').addEventListener('click', () => {
  halalOnly = !halalOnly;
  document.getElementById('halalToggle').classList.toggle('active', halalOnly);
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
