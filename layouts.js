/* ============================================================
   SEATING LAYOUT GENERATOR
   Draws to-scale SVG floor plans of table & chair arrangements
   for each setup, sized to the room's real dimensions.
   ============================================================ */

const LAYOUT_INFO = {
  boardroom:{ label:"Boardroom", desc:"Single large table, delegates seated around all sides. Best for board meetings and discussions up to ~30." },
  ushape:{ label:"U-Shape / Horseshoe", desc:"Open-ended U of tables, presenter at the open end. Ideal for training and presentations with interaction." },
  theatre:{ label:"Theatre", desc:"Rows of chairs facing the front, no tables. Maximises capacity for presentations and ceremonies." },
  cabaret:{ label:"Cabaret", desc:"Round tables seating 8–10, guests facing the front. Perfect for dinners, weddings and celebrations." },
  reception:{ label:"Reception", desc:"Open standing layout with scattered poseur tables. For drinks receptions and networking." }
};

/* Estimate room footprint in metres. If real dims missing, derive from m². */
function roomDims(room){
  if(room.length && room.width) return { L:room.length, W:room.width };
  const ratio=1.4; // assume 1.4:1 if unknown
  const W=Math.sqrt(room.m2/ratio), L=W*ratio;
  return { L:+L.toFixed(1), W:+W.toFixed(1) };
}

/* Main entry — returns an SVG string for a room + layout + pax */
function seatingSVG(room, layout, pax){
  const { L, W } = roomDims(room);
  const cap = room.cap[layout] || pax || 0;
  const n = Math.min(pax || cap, cap) || cap;
  // scale: fit room into a padded viewbox
  const PAD=28, SCALE=Math.min(560/L, 320/W, 38);
  const rw=L*SCALE, rh=W*SCALE, vbw=rw+PAD*2, vbh=rh+PAD*2;
  const chairs=[], tables=[];
  const CH="#c9d1dd", CHE="#8a97ab", TB="#e8ddc9", TBE="#c9b896";

  function chair(x,y,rot=0){ return `<rect x="${x-4}" y="${y-4}" width="8" height="8" rx="2"
    fill="${CH}" stroke="${CHE}" stroke-width="0.8" transform="rotate(${rot} ${x} ${y})"/>`; }

  const cx=PAD+rw/2, cy=PAD+rh/2;

  if(layout==="boardroom"){
    const tw=rw*0.5, th=rh*0.34, tx=cx-tw/2, ty=cy-th/2;
    tables.push(`<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="6" fill="${TB}" stroke="${TBE}" stroke-width="1.2"/>`);
    const perSide=Math.ceil(n/2), gap=tw/(perSide+1);
    for(let i=0;i<perSide;i++){ chairs.push(chair(tx+gap*(i+1), ty-9));
      if(chairs.length<n) chairs.push(chair(tx+gap*(i+1), ty+th+9)); }
  }
  else if(layout==="ushape"){
    const uw=rw*0.62, uh=rh*0.58, ux=cx-uw/2, uy=cy-uh/2, t=14;
    // three arms of the U
    tables.push(`<rect x="${ux}" y="${uy}" width="${t}" height="${uh}" rx="4" fill="${TB}" stroke="${TBE}"/>`);
    tables.push(`<rect x="${ux+uw-t}" y="${uy}" width="${t}" height="${uh}" rx="4" fill="${TB}" stroke="${TBE}"/>`);
    tables.push(`<rect x="${ux}" y="${uy+uh-t}" width="${uw}" height="${t}" rx="4" fill="${TB}" stroke="${TBE}"/>`);
    const perArm=Math.ceil(n/2.4), gap=uh/(perArm+1);
    for(let i=0;i<perArm;i++){
      chairs.push(chair(ux-9, uy+gap*(i+1)));
      if(chairs.length<n) chairs.push(chair(ux+uw+9, uy+gap*(i+1)));
    }
    const bottomN=n-chairs.length, bg=uw/(bottomN+1);
    for(let i=0;i<bottomN;i++) chairs.push(chair(ux+bg*(i+1), uy+uh+9));
    // presenter marker
    tables.push(`<circle cx="${cx}" cy="${uy+8}" r="5" fill="none" stroke="#9b320f" stroke-width="1.5" stroke-dasharray="3 2"/>`);
  }
  else if(layout==="theatre"){
    const cols=Math.ceil(Math.sqrt(n*1.5)), rows=Math.ceil(n/cols);
    const gx=rw*0.7/cols, gy=rh*0.6/rows, ox=cx-(cols-1)*gx/2, oy=cy-(rows-1)*gy/2+rh*0.06;
    let c=0; for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){ if(c++>=n)break; chairs.push(chair(ox+k*gx, oy+r*gy)); }
    tables.push(`<rect x="${cx-rw*0.22}" y="${PAD+6}" width="${rw*0.44}" height="7" rx="3" fill="#9b320f" opacity="0.75"/>`);
    tables.push(`<text x="${cx}" y="${PAD+3}" font-size="8" fill="#9b320f" text-anchor="middle">Stage / Screen</text>`);
  }
  else if(layout==="cabaret"){
    const perTable=9, nTables=Math.ceil(n/perTable);
    const cols=Math.ceil(Math.sqrt(nTables*1.3)), rows=Math.ceil(nTables/cols);
    const gx=rw*0.72/cols, gy=rh*0.66/rows, ox=cx-(cols-1)*gx/2, oy=cy-(rows-1)*gy/2+rh*0.04;
    const tr=Math.min(gx,gy)*0.24;
    let t=0; for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){ if(t++>=nTables)break;
      const tx=ox+k*gx, ty=oy+r*gy;
      tables.push(`<circle cx="${tx}" cy="${ty}" r="${tr}" fill="${TB}" stroke="${TBE}" stroke-width="1.2"/>`);
      const seats=Math.min(perTable, n-(t-1)*perTable);
      for(let s=0;s<seats;s++){ const ang=(s/seats)*Math.PI*2-Math.PI/2;
        chairs.push(chair(tx+Math.cos(ang)*(tr+6), ty+Math.sin(ang)*(tr+6))); }
    }
    tables.push(`<rect x="${cx-rw*0.2}" y="${PAD+6}" width="${rw*0.4}" height="7" rx="3" fill="#9b320f" opacity="0.75"/>`);
    tables.push(`<text x="${cx}" y="${PAD+3}" font-size="8" fill="#9b320f" text-anchor="middle">Stage / Top table</text>`);
  }
  else { // reception
    const nP=Math.max(3,Math.round(n/25));
    for(let i=0;i<nP;i++){ const ang=(i/nP)*Math.PI*2, rr=Math.min(rw,rh)*0.3;
      const tx=cx+Math.cos(ang)*rr, ty=cy+Math.sin(ang)*rr;
      tables.push(`<circle cx="${tx}" cy="${ty}" r="7" fill="${TB}" stroke="${TBE}" stroke-width="1"/>`); }
    // scattered standing dots
    for(let i=0;i<Math.min(n,60);i++){ const a=Math.random()*Math.PI*2, r=Math.random()*Math.min(rw,rh)*0.42;
      chairs.push(`<circle cx="${cx+Math.cos(a)*r}" cy="${cy+Math.sin(a)*r}" r="2.5" fill="${CHE}" opacity="0.6"/>`); }
  }

  return `<svg viewBox="0 0 ${vbw} ${vbh}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fbfaf7;border-radius:8px">
    <rect x="${PAD}" y="${PAD}" width="${rw}" height="${rh}" rx="4" fill="#fff" stroke="#d9cfc0" stroke-width="1.5"/>
    <text x="${PAD}" y="${PAD-8}" font-size="9" fill="#8a8178">${L}m × ${W}m</text>
    ${tables.join("")}${chairs.join("")}
    <text x="${vbw-PAD}" y="${vbh-PAD+18}" font-size="9" fill="#8a8178" text-anchor="end">${LAYOUT_INFO[layout].label} · seats ${cap}</text>
  </svg>`;
}

/* ============================================================
   RESTAURANT SEATING PLAN — renders numbered tables to scale
   ============================================================ */
function restaurantSVG(area){
  if(!area.tables || !area.tables.length) return "";
  const cols=6, rows=4, cellW=95, cellH=88, padX=30, padT=54, padB=30;
  const W=cols*cellW+padX*2, H=rows*cellH+padT+padB;
  const CH="#c9d1dd", CHE="#8a97ab", TB="#e8ddc9", TBE="#c9b896", BUF="#dce8dc";

  function chairs(cx,cy,shape,seats,tw,th){
    let out="";
    if(shape==="round"){
      for(let i=0;i<seats;i++){ const a=(i/seats)*Math.PI*2-Math.PI/2;
        out+=`<circle cx="${(cx+Math.cos(a)*(tw*0.62)).toFixed(1)}" cy="${(cy+Math.sin(a)*(tw*0.62)).toFixed(1)}" r="4" fill="${CH}" stroke="${CHE}" stroke-width=".7"/>`; }
    } else if(shape==="long"){
      const per=seats/2, gap=tw/(per+1);
      for(let i=0;i<per;i++){ const x=cx-tw/2+gap*(i+1);
        out+=`<rect x="${x-4}" y="${cy-th/2-9}" width="8" height="7" rx="2" fill="${CH}" stroke="${CHE}" stroke-width=".7"/>`;
        out+=`<rect x="${x-4}" y="${cy+th/2+2}" width="8" height="7" rx="2" fill="${CH}" stroke="${CHE}" stroke-width=".7"/>`; }
    } else { // square: 1 per side
      out+=`<rect x="${cx-4}" y="${cy-th/2-9}" width="8" height="7" rx="2" fill="${CH}" stroke="${CHE}" stroke-width=".7"/>`;
      out+=`<rect x="${cx-4}" y="${cy+th/2+2}" width="8" height="7" rx="2" fill="${CH}" stroke="${CHE}" stroke-width=".7"/>`;
      out+=`<rect x="${cx-tw/2-9}" y="${cy-4}" width="7" height="8" rx="2" fill="${CH}" stroke="${CHE}" stroke-width=".7"/>`;
      out+=`<rect x="${cx+tw/2+2}" y="${cy-4}" width="7" height="8" rx="2" fill="${CH}" stroke="${CHE}" stroke-width=".7"/>`;
    }
    return out;
  }
  const tables=area.tables.map(t=>{
    const cx=padX+t.c*cellW+cellW/2, cy=padT+t.r*cellH+cellH/2;
    let tw,th,shapeEl;
    if(t.shape==="round"){ tw=th=34; shapeEl=`<circle cx="${cx}" cy="${cy}" r="17" fill="${t.buffet?BUF:TB}" stroke="${TBE}" stroke-width="1.2"/>`; }
    else if(t.shape==="long"){ tw=56; th=26; shapeEl=`<rect x="${cx-tw/2}" y="${cy-th/2}" width="${tw}" height="${th}" rx="4" fill="${t.buffet?BUF:TB}" stroke="${TBE}" stroke-width="1.2"/>`; }
    else { tw=34; th=30; shapeEl=`<rect x="${cx-tw/2}" y="${cy-th/2}" width="${tw}" height="${th}" rx="4" fill="${t.buffet?BUF:TB}" stroke="${TBE}" stroke-width="1.2"/>`; }
    return `<g>${shapeEl}${chairs(cx,cy,t.shape,t.seats,tw,th)}
      <text x="${cx}" y="${cy-1}" font-size="9" font-weight="600" fill="#3a4256" text-anchor="middle">${t.n}</text>
      <text x="${cx}" y="${cy+8}" font-size="6.5" fill="#7a8494" text-anchor="middle">${t.seats}</text></g>`;
  }).join("");

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fbfaf7;border-radius:10px">
    <rect x="${padX-8}" y="${padT-8}" width="${W-padX*2+16}" height="${H-padT-padB+16}" rx="6" fill="#fff" stroke="#d9cfc0" stroke-width="1.5"/>
    <text x="${padX}" y="26" font-size="10" font-weight="600" fill="#9b7d4f">KITCHEN IN</text>
    <text x="${W-padX}" y="26" font-size="10" font-weight="600" fill="#9b7d4f" text-anchor="end">KITCHEN OUT</text>
    <rect x="${padX-8}" y="${H-padB-2}" width="${W-padX*2+16}" height="14" rx="4" fill="#eef2f8"/>
    <text x="${W/2}" y="${H-padB+8}" font-size="8.5" fill="#3a6ea5" text-anchor="middle">SERVICE COUNTER · HOST · ENTRANCE</text>
    ${tables}
  </svg>`;
}
