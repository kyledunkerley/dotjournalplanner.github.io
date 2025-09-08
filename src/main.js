import { generateIdeas } from './suggestions.js';
import { drawGrid, exportPNG, toggleGuides } from './render.js';
import { loadPromptConfig } from './promptConfig.js';

const form = document.getElementById('journal-form');
const purposeInput = document.getElementById('purpose');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const orientationSelect = document.getElementById('orientation');
const pageModeSelect = document.getElementById('page-mode');
const ideasContainer = document.getElementById('ideas');
const canvas = document.getElementById('grid-canvas');
const downloadBtn = document.getElementById('download-png');
const toggleGuidesBtn = document.getElementById('toggle-guides');
const downloadMdBtn = document.getElementById('download-md');
const downloadPdfBtn = document.getElementById('download-pdf');
const statusMsg = document.getElementById('status-msg');
const themeToggle = document.getElementById('theme-toggle');

let promptConfig = null;
let showGuides = true;
let selectedLayoutIndex = null;
let currentIdeas = [];

// Persistence helpers
const LS_KEY = 'dotJournalStateV1';
function saveState(){
  try {
  const data = { purpose: purposeInput.value, width: widthInput.value, height: heightInput.value, orientation: orientationSelect.value, pageMode: pageModeSelect.value, theme: document.body.classList.contains('dark')?'dark':'light', selected: selectedLayoutIndex };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch(err){ /* ignore */ }
}
function loadState(){
  try {
    const raw = localStorage.getItem(LS_KEY); if(!raw) return;
    const data = JSON.parse(raw);
    if(data.purpose) purposeInput.value = data.purpose;
    if(data.width) widthInput.value = data.width;
    if(data.height) heightInput.value = data.height;
  if(data.theme === 'dark') document.body.classList.add('dark');
  if(data.orientation) orientationSelect.value = data.orientation;
  if(data.pageMode) pageModeSelect.value = data.pageMode;
    if(typeof data.selected === 'number') selectedLayoutIndex = data.selected;
  } catch(err){ /* ignore */ }
}

(async () => {
  promptConfig = await loadPromptConfig();
  loadState();
  if(purposeInput.value && widthInput.value && heightInput.value){
    autoGenerate();
  }
})();

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
  saveState();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearStatus();
  const purposeRaw = purposeInput.value.trim();
  const purpose = purposeRaw || 'general';
  const w = parseInt(widthInput.value, 10);
  const h = parseInt(heightInput.value, 10);
  const orientation = orientationSelect.value;
  const pageMode = pageModeSelect.value;
  if(!Number.isInteger(w) || !Number.isInteger(h)) {
    return setStatus('Width and height must be whole numbers', true);
  }
  if(w < 5 || h < 5) return setStatus('Dimensions too small (min 5)', true);
  setStatus('Generating ideas...');
  requestAnimationFrame(() => {
    try {
  const ideas = generateIdeas({ purpose, width: w, height: h, promptConfig });
  currentIdeas = ideas;
      if(!ideas || ideas.length === 0){
        ideasContainer.innerHTML = '';
        setStatus('No specialized templates matched – showing basic layout.');
        const fallback = [{ title:'Basic Grid', description:'Generic grid layout.', sections:[] }];
        renderIdeas(fallback, { width: w, height: h });
      } else {
        setStatus(`Generated ${ideas.length} idea${ideas.length>1?'s':''}.`);
        renderIdeas(ideas, { width: w, height: h });
      }
  drawAdaptiveGrid(w, h, orientation);
      overlaySelected(ideas, w, h);
      saveState();
    } catch(err){
      console.error(err);
      setStatus('Error generating ideas', true);
    }
  });
});

downloadBtn.addEventListener('click', () => {
  exportPNG(canvas, 'dot-journal-layout.png');
});

toggleGuidesBtn.addEventListener('click', () => {
  showGuides = !showGuides;
  const w = parseInt(widthInput.value, 10) || 0;
  const h = parseInt(heightInput.value, 10) || 0;
  if(w && h) drawAdaptiveGrid(w, h, orientationSelect.value);
  toggleGuidesBtn.textContent = showGuides ? 'Hide Guides' : 'Show Guides';
});

function renderIdeas(ideas, dims){
  ideasContainer.innerHTML = '';
  ideas.forEach((idea, idx) => {
    const div = document.createElement('div');
    div.className = 'idea';
    if(idx === selectedLayoutIndex) div.classList.add('selected');
    const title = document.createElement('h3');
    title.textContent = `${idx+1}. ${idea.title}`;
    const desc = document.createElement('p');
    desc.textContent = idea.description;

    if(idea.sections){
      const list = document.createElement('ul');
      list.style.margin = '.4rem 0';
      list.style.paddingLeft = '1.1rem';
      idea.sections.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.label}: ${s.bounds.w}x${s.bounds.h}`;
        li.title = JSON.stringify(s.bounds);
        list.appendChild(li);
      });
      div.appendChild(list);
    }

    const preview = document.createElement('div');
    preview.className = 'md-preview';
    preview.textContent = markdownForIdea(idea, dims.width, dims.height).split('\n').slice(0,8).join('\n') + '\n...';
    div.appendChild(preview);
    ideasContainer.appendChild(div);

    div.addEventListener('click', () => {
      selectedLayoutIndex = idx;
      document.querySelectorAll('.idea').forEach(el=>el.classList.remove('selected'));
      div.classList.add('selected');
      const w = parseInt(widthInput.value,10); const h = parseInt(heightInput.value,10);
      drawAdaptiveGrid(w, h, orientationSelect.value);
      overlaySelected([idea], w, h); // overlay only selected
      saveState();
    });
  });
}

function setStatus(msg, isError=false){
  if(!statusMsg) return;
  statusMsg.textContent = msg;
  statusMsg.classList.toggle('error', !!isError);
}

function clearStatus(){
  if(!statusMsg) return;
  statusMsg.textContent='';
  statusMsg.classList.remove('error');
}

function overlaySelected(ideas, widthDots, heightDots){
  if(selectedLayoutIndex === null && ideas.length>0) return; // only overlay when user selects
  const ctx = canvas.getContext('2d');
  const padding = 30;
  const usableW = canvas.width - padding*2;
  const usableH = canvas.height - padding*2;
  const dotSpacing = Math.min(usableW/widthDots, usableH/heightDots);
  const offsetX = (canvas.width - widthDots*dotSpacing)/2;
  const offsetY = (canvas.height - heightDots*dotSpacing)/2;
  const layout = selectedLayoutIndex !== null ? ideas[selectedLayoutIndex] : ideas[0];
  if(!layout || !layout.sections) return;
  ctx.save();
  ctx.strokeStyle = '#ff6a3d';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;
  layout.sections.forEach((s,i) => {
    const { x,y,w,h } = s.bounds;
    ctx.strokeRect(offsetX + x*dotSpacing, offsetY + y*dotSpacing, w*dotSpacing, h*dotSpacing);
    ctx.fillStyle = '#ff6a3d';
    ctx.globalAlpha = 0.18;
    ctx.fillRect(offsetX + x*dotSpacing, offsetY + y*dotSpacing, w*dotSpacing, h*dotSpacing);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#ff6a3d';
    ctx.font = '12px system-ui';
    ctx.fillText(s.label, offsetX + x*dotSpacing + 4, offsetY + y*dotSpacing + 14);
  });
  ctx.restore();
}

function autoGenerate(){
  form.dispatchEvent(new Event('submit'));
}

downloadMdBtn?.addEventListener('click', () => {
  const w = parseInt(widthInput.value,10); const h = parseInt(heightInput.value,10);
  if(!currentIdeas.length){ setStatus('Generate a layout first', true); return; }
  const idx = selectedLayoutIndex ?? 0;
  const idea = currentIdeas[idx];
  const md = markdownForIdea(idea, w, h);
  const blob = new Blob([md], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.download = slug(`${idea.title}-${w}x${h}.md`);
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(a.href);
  setStatus('Markdown downloaded');
});

function markdownForIdea(idea, widthDots, heightDots){
  const lines = [];
  lines.push(`# ${idea.title}`);
  lines.push('');
  lines.push(`Dimensions: ${widthDots} x ${heightDots} dots`);
  lines.push('');
  if(idea.description){
    lines.push(idea.description);
    lines.push('');
  }
  if(idea.sections && idea.sections.length){
    lines.push('## Sections');
    lines.push('');
    idea.sections.forEach((s,i) => {
      const b = s.bounds;
      lines.push(`- **${s.label}**: x=${b.x}, y=${b.y}, w=${b.w}, h=${b.h}`);
    });
    lines.push('');
    lines.push('### Copy Guidelines');
    lines.push('Draw boundary lines along the listed coordinates, counting from the top-left corner (0-based). The width (w) and height (h) values indicate how many dots span horizontally and vertically.');
  } else {
    lines.push('_No defined sections—free-form grid._');
  }
  lines.push('');
  lines.push('---');
  lines.push('*Generated locally by Dot Journal Planner*');
  return lines.join('\n');
}

function slug(str){
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

function drawAdaptiveGrid(w,h,orientation){
  // Adjust canvas dimensions for orientation but keep dot counts representing page dimension
  if(orientation === 'landscape'){
    canvas.width = 800; canvas.height = 550;
  } else {
    canvas.width = 600; canvas.height = 800;
  }
  drawGrid(canvas, w, h, { guides: showGuides });
}

downloadPdfBtn?.addEventListener('click', () => {
  if(!currentIdeas.length){ setStatus('Generate a layout first', true); return; }
  const idx = selectedLayoutIndex ?? 0;
  const idea = currentIdeas[idx];
  const w = parseInt(widthInput.value,10); const h = parseInt(heightInput.value,10);
  const orientation = orientationSelect.value; const pageMode = pageModeSelect.value;
  try { exportPDF(idea, { w, h, orientation, pageMode }); setStatus('PDF exported'); } catch(err){ console.error(err); setStatus('PDF export failed', true); }
});

function exportPDF(idea, { w, h, orientation, pageMode }){
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: orientation === 'landscape' ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const title = `${idea.title} (${w}x${h} dots)`;
  const sectionsText = idea.sections && idea.sections.length ? idea.sections.map(s=>`• ${s.label}: x=${s.bounds.x}, y=${s.bounds.y}, w=${s.bounds.w}, h=${s.bounds.h}`).join('\n') : 'Free-form grid';
  const body = markdownForIdea(idea, w, h);

  function addLayoutPage(layout, mirror=false){
    pdf.setFontSize(16); pdf.text(layout.title || idea.title, 40, 50);
    pdf.setFontSize(10); pdf.text(`Dimensions: ${w} x ${h} dots`, 40, 65);
    pdf.setFontSize(11);
    const lines = pdf.splitTextToSize(sectionsText, pageW - 80);
    pdf.text(lines, 40, 90);
    // Draw simplified boxes
    if(layout.sections){
      const gridMargin = 60;
      const availW = pageW - gridMargin*2;
      const availH = pageH - 300;
      const scale = Math.min(availW / w, availH / h);
      const originX = gridMargin;
      const originY = pageH - availH - 80;
      pdf.setLineWidth(0.6);
      layout.sections.forEach(s => {
        const { x,y,w:sw,h:sh } = s.bounds;
        const drawX = originX + (mirror ? (w - x - sw) : x) * scale;
        const drawY = originY + y * scale;
        pdf.rect(drawX, drawY, sw*scale, sh*scale);
        pdf.setFontSize(8);
        pdf.text(s.label, drawX + 2, drawY + 10, { maxWidth: sw*scale - 4 });
      });
      pdf.setDrawColor(120);
      pdf.rect(originX, originY, w*scale, h*scale); // outer grid boundary
    }
  }

  function addMarkdownAppendix(){
    pdf.addPage();
    pdf.setFontSize(14); pdf.text(title + ' (Markdown)', 40, 50);
    pdf.setFontSize(9);
    const lines = pdf.splitTextToSize(body, pageW - 80);
    pdf.text(lines, 40, 70);
  }

  // Page mode handling
  if(pageMode === 'single'){
    addLayoutPage(idea);
  } else if(pageMode === 'spread'){
    addLayoutPage(idea); pdf.addPage(); addLayoutPage(idea);
  } else if(pageMode === 'spread-mirrored'){
    addLayoutPage(idea); pdf.addPage(); addLayoutPage(idea, true);
  } else if(pageMode === 'spread-dual'){
    // Two trackers side by side on one page (reuse idea for left, notes for right if exists)
    addLayoutPage(idea);
    pdf.addPage();
    addLayoutPage(idea); // Placeholder: could load second selected
  } else if(pageMode === 'landscape-middle'){
    // Simulate a landscape spread meeting in the middle across two pages
    addLayoutPage(idea);
    pdf.addPage();
    addLayoutPage(idea, true);
  }

  addMarkdownAppendix();
  pdf.save(slug(`${idea.title}-${w}x${h}-${pageMode}.pdf`));
}
