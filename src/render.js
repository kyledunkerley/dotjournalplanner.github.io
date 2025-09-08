export function drawGrid(canvas, widthDots, heightDots, { guides=true }={}) {
  const ctx = canvas.getContext('2d');
  const padding = 30;
  const usableW = canvas.width - padding*2;
  const usableH = canvas.height - padding*2;
  const dotSpacing = Math.min(usableW/widthDots, usableH/heightDots);
  const offsetX = (canvas.width - widthDots*dotSpacing)/2;
  const offsetY = (canvas.height - heightDots*dotSpacing)/2;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = '#5a6a7a';
  for(let y=0;y<heightDots;y++){
    for(let x=0;x<widthDots;x++){
      const cx = offsetX + x*dotSpacing;
      const cy = offsetY + y*dotSpacing;
      ctx.beginPath();
      ctx.arc(cx, cy, 1.25, 0, Math.PI*2);
      ctx.fill();
    }
  }

  if(guides){
    ctx.strokeStyle = '#d2d8e2';
    ctx.lineWidth = 1;
    // vertical thirds
    [1/3,2/3].forEach(fr => {
      ctx.beginPath();
      ctx.moveTo(offsetX + widthDots*dotSpacing*fr, offsetY);
      ctx.lineTo(offsetX + widthDots*dotSpacing*fr, offsetY + heightDots*dotSpacing);
      ctx.stroke();
    });
    // horizontal thirds
    [1/3,2/3].forEach(fr => {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + heightDots*dotSpacing*fr);
      ctx.lineTo(offsetX + widthDots*dotSpacing, offsetY + heightDots*dotSpacing*fr);
      ctx.stroke();
    });
  }

  ctx.strokeStyle = '#8d99a8';
  ctx.lineWidth = 2;
  ctx.strokeRect(offsetX, offsetY, widthDots*dotSpacing, heightDots*dotSpacing);
}

export function exportPNG(canvas, filename){
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function toggleGuides(){
  // Placeholder: logic handled in main.js state
}
