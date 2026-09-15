/* ============================================================
   BRANDON HALL SALES PORTAL — app logic
   Runs in DEMO MODE (localStorage) until Firebase is wired up.
   To enable Firebase: fill firebase-config.js, uncomment the
   Firebase SDK block in index.html, and set USE_FIREBASE=true.
   ============================================================ */
const USE_FIREBASE = false;

const USERS = {
  "ajay.kawa":        { name:"Ajay Kawa",        code:"BHAK", role:"admin" },
  "raj.kumar":        { name:"Raj Kumar",        code:"BHRK", role:"admin" },
  "alia.taub":        { name:"Alia Taub",        code:"BHAT", role:"admin" },
  "nicola.cartwright":{ name:"Nicola Cartwright", code:"BHNC", role:"admin" }
};

const LAYOUT_LABELS = { boardroom:"Boardroom", ushape:"U-Shape",
  theatre:"Theatre", cabaret:"Cabaret", reception:"Reception" };

const $  = s => document.querySelector(s);
const el = (t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const money = n => "£"+Number(n).toLocaleString("en-GB",{minimumFractionDigits:0,maximumFractionDigits:2});

/* ---------- simple demo store ---------- */
const Store = {
  key:"bh_enquiries",
  all(){ try{return JSON.parse(localStorage.getItem(this.key))||[]}catch{return[]} },
  save(list){ localStorage.setItem(this.key, JSON.stringify(list)); },
  add(e){ const l=this.all(); e.id="ENQ-"+Date.now().toString(36).toUpperCase();
    e.created=new Date().toISOString(); e.status=e.status||"new"; l.unshift(e); this.save(l); return e; },
  update(id,patch){ const l=this.all(); const i=l.findIndex(x=>x.id===id);
    if(i>-1){ Object.assign(l[i],patch); this.save(l);} }
};

let SESSION=null, CURRENT_TAB="rooms";

/* ============================================================ AUTH */
$("#lg-btn").onclick = ()=>{
  const u=$("#lg-user").value, pw=$("#lg-pw").value.trim().toUpperCase();
  const err=$("#lg-err"); err.textContent="";
  if(!u){ err.textContent="Please select your name."; return; }
  const user=USERS[u];
  if(!user || pw!==user.code){ err.textContent="Incorrect access code."; return; }
  SESSION=user;
  $("#login").classList.add("hidden");
  $("#app").classList.remove("hidden");
  $("#tb-who").textContent=user.name;
  boot();
};
$("#lg-pw").addEventListener("keydown",e=>{ if(e.key==="Enter")$("#lg-btn").click(); });
$("#tb-logout").onclick=()=>{ SESSION=null; $("#app").classList.add("hidden");
  $("#login").classList.remove("hidden"); $("#lg-pw").value=""; };

/* ============================================================ ROUTING */
function boot(){
  document.querySelectorAll("#tabs button").forEach(b=>{
    b.onclick=()=>{ CURRENT_TAB=b.dataset.tab;
      document.querySelectorAll("#tabs button").forEach(x=>x.classList.toggle("active",x===b));
      render(); };
  });
  // hide admin tab for non-admins (all 4 are admin for now)
  render();
}
function render(){
  const v=$("#view"); v.innerHTML="";
  ({rooms:renderRooms, packages:renderPackages, suppliers:renderSuppliers, quote:renderQuote,
    enquiries:renderEnquiries, chat:renderChat, admin:renderAdmin }[CURRENT_TAB]||renderRooms)(v);
}

/* ============================================================ ROOMS */
let roomFilter={ event:"", pax:"" };
function renderRooms(v){
  v.appendChild(head("Meeting & Event Rooms",
    "Pick an event type and headcount to see which rooms fit and how to lay them out."));
  const gal=el("div","gallery");
  gal.innerHTML=GALLERY.meetings.slice(0,4).map(u=>`<img src="${u}" loading="lazy" onerror="this.style.display='none'">`).join("");
  v.appendChild(gal);

  const bar=el("div","filters");
  bar.innerHTML=`<span class="lbl">Event type</span>`;
  const chips=el("div","chips");
  chips.appendChild(makeChip("All events","",roomFilter.event===""));
  EVENT_TYPES.forEach(et=>chips.appendChild(makeChip(et.icon+" "+et.label,et.id,roomFilter.event===et.id)));
  chips.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{roomFilter.event=c.dataset.val;renderRooms(v);});
  bar.appendChild(chips);
  const paxWrap=el("div","",`<span class="lbl" style="margin-right:8px">Guests</span>`);
  const pax=el("input"); pax.type="number"; pax.min=0; pax.placeholder="e.g. 40";
  pax.value=roomFilter.pax; pax.style.width="90px";
  pax.oninput=()=>{roomFilter.pax=pax.value;refreshRoomFit(v);};
  paxWrap.appendChild(pax); bar.appendChild(paxWrap);
  v.appendChild(bar);

  const grid=el("div","room-grid"); grid.id="room-grid";
  ROOMS.forEach(r=>grid.appendChild(roomCard(r)));
  v.appendChild(grid);
  refreshRoomFit(v);
}
function makeChip(label,val,on){ const c=el("button","chip"+(on?" on":""),label); c.dataset.val=val; return c; }

function bestLayout(room,eventId){
  const et=EVENT_TYPES.find(e=>e.id===eventId);
  const order= et? et.preferredLayouts : ["theatre","cabaret","reception","boardroom","ushape"];
  for(const lay of order){ if(room.cap[lay]) return lay; }
  return Object.keys(room.cap).find(k=>room.cap[k])||"reception";
}
function maxCap(room){ return Math.max(...Object.values(room.cap).filter(n=>n!=null)); }

function roomCard(r){
  const c=el("div","room-card"); c.dataset.id=r.id;
  const caps=Object.entries(r.cap).filter(([,n])=>n!=null&&n>0)
    .map(([k,n])=>`<span class="cap-pill"><b>${n}</b> ${LAYOUT_LABELS[k]}</span>`).join("");
  c.innerHTML=`<img class="thumb" src="${roomImage(r)}" alt="${r.name}" loading="lazy"
      onerror="this.style.display='none'">
    <h3>${r.name}</h3><div class="m2">${r.m2} m²${r.combined?" · "+r.combined:""}</div>
    <div class="caps">${caps}</div><div class="fit" data-fit></div>`;
  c.onclick=()=>openRoom(r);
  return c;
}
function refreshRoomFit(v){
  const pax=parseInt(roomFilter.pax)||0;
  document.querySelectorAll(".room-card").forEach(card=>{
    const r=ROOMS.find(x=>x.id===card.dataset.id); const fit=card.querySelector("[data-fit]");
    if(!pax){ fit.textContent=""; card.classList.remove("dim"); return; }
    const lay=bestLayout(r,roomFilter.event); const cap=r.cap[lay]||maxCap(r);
    if(maxCap(r)>=pax){ fit.className="fit yes";
      fit.textContent=`✓ Fits ${pax} — best as ${LAYOUT_LABELS[lay]} (${cap})`; card.classList.remove("dim"); }
    else { fit.className="fit no"; fit.textContent=`✗ Max ${maxCap(r)} — too small`; card.classList.add("dim"); }
  });
}

let roomModalLayout="theatre";
function openRoom(r){
  const pax=parseInt(roomFilter.pax)||Math.round(maxCap(r)*0.6);
  const evId=roomFilter.event||"meeting";
  const et=EVENT_TYPES.find(e=>e.id===evId);
  const lay=bestLayout(r,evId);
  roomModalLayout=lay;
  const carbon=carbonModel(r,evId,pax);
  const equip=EVENT_EQUIPMENT[evId]||[];
  const hire=ROOM_HIRE[r.id];
  const tech=roomTech(r);

  const caps=Object.entries(r.cap).filter(([,n])=>n!=null).map(([k,n])=>
    `<tr class="${k===lay?"best":""}"><td>${LAYOUT_LABELS[k]}</td><td>${n||"—"}</td></tr>`).join("");
  const layoutBtns=Object.keys(r.cap).filter(k=>r.cap[k]!=null)
    .map(k=>`<button class="${k===lay?"on":""}" data-lay="${k}">${LAYOUT_LABELS[k]} (${r.cap[k]})</button>`).join("");
  const techItems=TECH_FIELDS.map(([key,label])=>{
    const on=tech[key]; const val=(key==="screen")?on:on;
    return `<div class="tech-item ${on?"yes":"no"}"><span class="ic">${on?"✓":"—"}</span>
      <span>${label}${key==="screen"&&typeof on==="string"?": "+on:""}</span></div>`;
  }).join("");

  const body=`
    <img class="room-hero" src="${roomImage(r)}" alt="${r.name}" onerror="this.style.display='none'">
    <div class="detail-row">
      <div class="stat"><div class="k">Floor area</div><div class="v">${r.m2}<small> m²</small></div></div>
      ${r.length?`<div class="stat"><div class="k">Dimensions</div><div class="v">${r.length}<small>×</small>${r.width}<small> m</small></div></div>`:""}
      <div class="stat"><div class="k">Max capacity</div><div class="v">${maxCap(r)}</div></div>
      ${hire?`<div class="stat"><div class="k">Room hire</div><div class="v">${money(hire.full)}<small>/day</small></div></div>`:""}
    </div>

    <div class="sec-title">Recommended for ${et.icon} ${et.label}</div>
    <p style="font-size:14px;margin-bottom:6px">Best laid out as <b>${LAYOUT_LABELS[lay]}</b> (seats ${r.cap[lay]||maxCap(r)}).</p>

    <div class="sec-title">Seating layouts</div>
    <div class="layout-tabs" id="rm-laytabs">${layoutBtns}</div>
    <div class="layout-view"><div id="rm-layview">${seatingSVG(r,lay,r.cap[lay])}</div>
      <div class="desc" id="rm-laydesc">${LAYOUT_INFO[lay].desc}</div></div>

    <div class="sec-title">Capacity by layout</div>
    <table class="cap-table">${caps}</table>

    <div class="sec-title">Tech &amp; connectivity <span class="dummy-tag">DUMMY — awaiting M&E audit</span></div>
    <div class="tech-grid">${techItems}</div>
    ${tech.notes?`<p style="font-size:13px;color:var(--muted);margin-top:8px">${tech.notes}</p>`:""}

    <div class="sec-title">Recommended equipment <span class="dummy-tag">DUMMY — awaiting M&E audit</span></div>
    <ul class="equip-list">${equip.map(e=>`<li>${e}</li>`).join("")}</ul>

    <div class="sec-title">Estimated carbon footprint</div>
    <div class="carbon-box">
      <div class="big">${carbon.total} kg CO₂e</div>
      <div class="split">Room energy ≈ ${carbon.room} kg · Catering ≈ ${carbon.catering} kg
        (${carbon.perHead} kg/head × ${pax} guests)</div>
      <div class="split" style="margin-top:6px;font-style:italic">Estimated from floor area, occupancy &amp; event type — indicative only.</div>
    </div>

    <div class="dual-btn">
      <button class="btn" id="rm-quote">Start a quote</button>
      <button class="btn ghost" id="rm-enq">Log an enquiry</button>
    </div>`;
  showModal(r.name, `${r.m2} m² · ${r.combined||"Function room"}`, body);

  // interactive layout switcher
  document.querySelectorAll("#rm-laytabs button").forEach(b=>b.onclick=()=>{
    document.querySelectorAll("#rm-laytabs button").forEach(x=>x.classList.toggle("on",x===b));
    const k=b.dataset.lay;
    $("#rm-layview").innerHTML=seatingSVG(r,k,r.cap[k]);
    $("#rm-laydesc").textContent=LAYOUT_INFO[k].desc;
  });
  $("#rm-quote").onclick=()=>{ closeModal(); prefill={room:r.id,event:evId,pax}; switchTab("quote"); };
  $("#rm-enq").onclick=()=>{ closeModal(); openEnquiryForm({room:r.id,event:evId}); };
}
function switchTab(t){ CURRENT_TAB=t;
  document.querySelectorAll("#tabs button").forEach(x=>x.classList.toggle("active",x.dataset.tab===t)); render(); }

/* ============================================================ PACKAGES */
function renderPackages(v){
  v.appendChild(head("Packages & Pricing","Delegate rates, event packages and à la carte add-ons. All prices include VAT unless noted."));
  const grid=el("div","pkg-grid");
  PACKAGES.forEach(p=>{
    const card=el("div","pkg-card");
    card.innerHTML=`<h3>${p.name}</h3>
      <div class="price">from <b>${money(p.from)}</b> ${p.per==="pp"?"per person":""}</div>
      <ul>${p.includes.map(i=>`<li>${i}</li>`).join("")}</ul>
      <div class="min">Minimum ${p.min} ${p.min>1?"guests":"guest"}</div>`;
    grid.appendChild(card);
  });
  v.appendChild(grid);

  // add-ons
  v.appendChild(el("div","sec-title",`À la carte add-ons`));
  ADDONS.forEach(group=>{
    v.appendChild(el("h4","",`<span style="font-family:var(--serif);font-size:18px;color:var(--gold-dk);display:block;margin:14px 0 8px">${group.cat}</span>`));
    const t=el("table","data-table");
    t.innerHTML=`<tr><th>Item</th><th style="text-align:right">Price</th><th>Per</th></tr>`+
      group.items.map(i=>`<tr><td>${i.name}${i.note?` <span class="qs-sub">(${i.note})</span>`:""}</td>
        <td style="text-align:right">${money(i.price)}</td><td>${i.unit}</td></tr>`).join("");
    v.appendChild(t);
  });
}

/* ============================================================ QUOTE BUILDER */
let prefill=null;
function renderQuote(v){
  v.appendChild(head("Create a Quote","Build a costed quote and download a branded PDF to email the customer."));
  const wrap=el("div","quote-layout");

  // left: form
  const left=el("div","quote-panel");
  left.innerHTML=`<h3>Event details</h3>
    <div class="form-grid">
      <div><label>Customer name</label><input id="q-name" placeholder="Full name"></div>
      <div><label>Company (optional)</label><input id="q-co" placeholder="Company"></div>
      <div><label>Email</label><input id="q-email" type="email" placeholder="name@email.com"></div>
      <div><label>Phone</label><input id="q-phone" placeholder="Phone"></div>
      <div><label>Event type</label><select id="q-event">${EVENT_TYPES.map(e=>`<option value="${e.id}">${e.label}</option>`).join("")}</select></div>
      <div><label>Event date</label><input id="q-date" type="date"></div>
      <div><label>Room</label><select id="q-room">${ROOMS.map(r=>`<option value="${r.id}">${r.name} (${r.m2}m²)</option>`).join("")}</select></div>
      <div><label>Guests</label><input id="q-pax" type="number" min="1" value="40"></div>
      <div><label>Package</label><select id="q-pkg"><option value="">Room hire only</option>${PACKAGES.map(p=>`<option value="${p.id}">${p.name} (from ${money(p.from)}pp)</option>`).join("")}</select></div>
      <div><label>Hire basis</label><select id="q-hire"><option value="full">Full day</option><option value="half">Half day</option><option value="none">None (package incl.)</option></select></div>
    </div>
    <h3 style="margin-top:22px">Add-ons</h3>
    <div id="q-addons"></div>`;
  wrap.appendChild(left);

  // right: summary
  const right=el("div","quote-panel quote-summary");
  right.innerHTML=`<h3>Quote summary</h3><div id="q-summary"></div>
    <button class="btn block" id="q-brochure" style="margin-top:16px">Download brochure &amp; quote</button>
    <button class="btn ghost block" id="q-pdf" style="margin-top:8px">Simple quote only</button>
    <button class="btn ghost block" id="q-save" style="margin-top:8px">Save as enquiry</button>`;
  wrap.appendChild(right);
  v.appendChild(wrap);

  // add-ons list
  const ad=$("#q-addons");
  ADDONS.forEach(g=>{
    ad.appendChild(el("div","qs-sub",`<b style="color:var(--gold-dk)">${g.cat}</b>`));
    g.items.forEach((item,idx)=>{
      const key=g.cat+"|"+idx;
      const row=el("div","addon-row");
      row.innerHTML=`<span class="an">${item.name}</span><span class="ap">${money(item.price)}/${item.unit}</span>`;
      const qty=el("input"); qty.type="number"; qty.min=0; qty.value=0; qty.dataset.key=key;
      qty.dataset.price=item.price; qty.dataset.name=item.name; qty.dataset.unit=item.unit;
      qty.oninput=recalcQuote; row.appendChild(qty); ad.appendChild(row);
    });
  });

  ["q-event","q-room","q-pax","q-pkg","q-hire"].forEach(id=>$("#"+id).addEventListener("change",recalcQuote));
  $("#q-pax").addEventListener("input",recalcQuote);
  if(prefill){ $("#q-room").value=prefill.room; $("#q-event").value=prefill.event; $("#q-pax").value=prefill.pax; prefill=null; }
  recalcQuote();
  $("#q-pdf").onclick=downloadQuotePDF;
  $("#q-brochure").onclick=downloadBrochurePDF;
  $("#q-save").onclick=saveQuoteAsEnquiry;
}

function gatherQuote(){
  const room=ROOMS.find(r=>r.id===$("#q-room").value);
  const evId=$("#q-event").value, pax=parseInt($("#q-pax").value)||0;
  const pkg=PACKAGES.find(p=>p.id===$("#q-pkg").value);
  const hireBasis=$("#q-hire").value;
  const lines=[];
  if(pkg){ lines.push({label:`${pkg.name} × ${pax} guests`, amt:pkg.from*pax, sub:`${money(pkg.from)}pp`}); }
  if(hireBasis!=="none" && ROOM_HIRE[room.id]){
    const h=ROOM_HIRE[room.id][hireBasis];
    lines.push({label:`Room hire — ${room.name} (${hireBasis} day)`, amt:h});
  }
  document.querySelectorAll("#q-addons input").forEach(q=>{
    const n=parseInt(q.value)||0; if(n>0){
      const price=parseFloat(q.dataset.price);
      const mult = q.dataset.unit==="pp" ? n : n; // qty entered directly
      lines.push({label:`${q.dataset.name} × ${n} ${q.dataset.unit}`, amt:price*n});
    }
  });
  const subtotal=lines.reduce((s,l)=>s+l.amt,0);
  const carbon=carbonModel(room,evId,pax);
  return {room,evId,pax,pkg,lines,subtotal,carbon,
    customer:{ name:$("#q-name")?.value||"", co:$("#q-co")?.value||"",
      email:$("#q-email")?.value||"", phone:$("#q-phone")?.value||"",
      date:$("#q-date")?.value||"" }};
}
function recalcQuote(){
  const q=gatherQuote(); const s=$("#q-summary"); if(!s)return;
  s.innerHTML = q.lines.length
    ? q.lines.map(l=>`<div class="qs-line"><span>${l.label}${l.sub?` <span class="qs-sub">${l.sub}</span>`:""}</span><span>${money(l.amt)}</span></div>`).join("")
      +`<div class="qs-line total"><span>Total</span><span>${money(q.subtotal)}</span></div>
        <div class="qs-sub">Prices include VAT where applicable.</div>
        <div class="carbon-quote">Estimated carbon: <b>${q.carbon.total} kg CO₂e</b> for this event</div>`
    : `<div class="qs-sub">Add a package, room hire or add-ons to build the quote.</div>`;
}

/* ============================================================ QUOTE PDF (print-to-PDF) */
function downloadQuotePDF(){
  const q=gatherQuote();
  if(!q.customer.name){ alert("Please enter the customer name first."); return; }
  const et=EVENT_TYPES.find(e=>e.id===q.evId);
  const ref="BH-Q-"+Date.now().toString(36).toUpperCase();
  const win=window.open("","_blank");
  const rows=q.lines.map(l=>`<tr><td>${l.label}</td><td style="text-align:right">${money(l.amt)}</td></tr>`).join("");
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${ref}</title>
    <style>
      @page{margin:22mm}
      body{font-family:'Inter',Arial,sans-serif;color:#241f1b;font-size:12px;line-height:1.5}
      .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #BB9979;padding-bottom:14px}
      h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;color:#241f1b;margin:0}
      .muted{color:#8a8178;font-size:11px}
      h2{font-family:'Cormorant Garamond',serif;font-size:18px;margin:22px 0 8px;color:#9d7d5f}
      table{width:100%;border-collapse:collapse;margin-top:6px}
      td,th{padding:8px 6px;border-bottom:1px solid #e5ddd2;text-align:left}
      .total td{border-top:2px solid #241f1b;font-weight:700;font-size:15px;border-bottom:none}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin-top:8px}
      .grid div{font-size:12px}.grid b{color:#3a332c}
      .carbon{background:#eef5ec;border-radius:8px;padding:10px 14px;margin-top:16px;color:#4a6147;font-size:12px}
      .foot{margin-top:30px;font-size:10.5px;color:#8a8178;border-top:1px solid #e5ddd2;padding-top:12px}
    </style></head><body>
    <div class="top">
      <div><h1>Brandon Hall Hotel &amp; Spa</h1><div class="muted">Main Street, Brandon, Coventry CV8 3FW</div></div>
      <div style="text-align:right"><div class="muted">Quotation</div><b>${ref}</b><br><span class="muted">${new Date().toLocaleDateString("en-GB")}</span></div>
    </div>
    <h2>Prepared for</h2>
    <div class="grid">
      <div><b>${q.customer.name}</b></div><div>${q.customer.co||""}</div>
      <div>${q.customer.email||""}</div><div>${q.customer.phone||""}</div>
    </div>
    <h2>Event</h2>
    <div class="grid">
      <div><b>Type:</b> ${et.label}</div><div><b>Date:</b> ${q.customer.date?new Date(q.customer.date).toLocaleDateString("en-GB"):"TBC"}</div>
      <div><b>Room:</b> ${q.room.name} (${q.room.m2} m²)</div><div><b>Guests:</b> ${q.pax}</div>
    </div>
    <h2>Costs</h2>
    <table>${rows}<tr class="total"><td>Total (inc. VAT where applicable)</td><td style="text-align:right">${money(q.subtotal)}</td></tr></table>
    <div class="carbon">Estimated event carbon footprint: <b>${q.carbon.total} kg CO₂e</b> — indicative estimate from room size, occupancy and event type.</div>
    <div class="foot">This quotation is valid for 14 days and subject to availability. Prices include VAT at the current rate unless otherwise stated. Rates are non-commissionable. Cancellation terms are per individual contract.<br>
    Brandon Hall Hotel &amp; Spa · Sales: nicola.cartwright@brandonhallhotelandspa.com</div>
    <script>window.onload=()=>window.print()<\/script>
    </body></html>`);
  win.document.close();
}

function downloadBrochurePDF(){
  const q=gatherQuote();
  if(!q.customer.name){ alert("Please enter the customer name first."); return; }
  const et=EVENT_TYPES.find(e=>e.id===q.evId);
  const lay=bestLayout(q.room,q.evId);
  const ref="BH-P-"+Date.now().toString(36).toUpperCase();
  const rows=q.lines.map(l=>`<tr><td>${l.label}</td><td style="text-align:right">${money(l.amt)}</td></tr>`).join("");
  const pkg=q.pkg;
  const svg=seatingSVG(q.room,lay,q.pax).replace(/background:#fbfaf7/,'background:#fff');
  const hero=roomImage(q.room);
  const gallery=GALLERY.weddings.slice(0,3).map(u=>`<img src="${u}" style="width:32%;height:90px;object-fit:cover;border-radius:6px">`).join("");
  const win=window.open("","_blank");
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${ref}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      @page{margin:0}
      body{font-family:'Inter',Arial,sans-serif;color:#1a2230;font-size:12px;line-height:1.5;margin:0}
      .page{padding:22mm;page-break-after:always;min-height:257mm}
      .page:last-child{page-break-after:auto}
      .cover{background:linear-gradient(160deg,#1a2b47,#101d33);color:#fff;min-height:297mm;padding:0;
        display:flex;flex-direction:column;justify-content:space-between}
      .cover-img{height:44%;width:100%;object-fit:cover;opacity:.9}
      .cover-body{padding:22mm}
      .cover h1{font-family:'Cormorant Garamond',serif;font-size:46px;font-weight:600;margin:0 0 6px;line-height:1.05}
      .cover .sub{color:#BB9979;font-size:16px;letter-spacing:1px}
      .cover .for{margin-top:40px;font-size:14px;color:#c9d1dd}
      .cover .for b{color:#fff;font-size:22px;font-family:'Cormorant Garamond',serif;display:block}
      .cover .foot{padding:22mm;font-size:11px;color:#8a97ab}
      h2{font-family:'Cormorant Garamond',serif;font-size:26px;color:#1a2b47;margin:0 0 4px}
      .rule{height:2px;background:#BB9979;width:60px;margin:8px 0 18px}
      .lead{color:#3a4256;font-size:13px;margin-bottom:16px}
      .grid2{display:flex;gap:6px;margin:12px 0}
      table{width:100%;border-collapse:collapse;margin-top:8px}
      td,th{padding:8px 6px;border-bottom:1px solid #e3e7ee;text-align:left}
      .total td{border-top:2px solid #1a2b47;font-weight:700;font-size:15px;border-bottom:none}
      .box{background:#f7f8fa;border-radius:10px;padding:16px;margin:14px 0}
      .inc{columns:2;font-size:12.5px;margin-top:8px}
      .inc div{margin-bottom:4px}.inc div::before{content:"✓ ";color:#4a7c59;font-weight:700}
      .carbon{background:#eef5ec;border-radius:8px;padding:12px 16px;color:#4a6147;font-size:12px;margin-top:14px}
      .stats{display:flex;gap:14px;margin:14px 0}
      .stats div{flex:1;background:#f7f8fa;border-radius:8px;padding:12px;text-align:center}
      .stats b{display:block;font-family:'Cormorant Garamond',serif;font-size:22px;color:#1a2b47}
      .stats span{font-size:11px;color:#7a8494}
      .foot-note{margin-top:24px;font-size:10px;color:#7a8494;border-top:1px solid #e3e7ee;padding-top:12px}
    </style></head><body>
    <!-- COVER -->
    <div class="cover">
      <img class="cover-img" src="${hero}" onerror="this.style.display='none'">
      <div class="cover-body">
        <div class="sub">BRANDON HALL HOTEL &amp; SPA</div>
        <h1>${et.label}<br>Proposal</h1>
        <div class="for">Prepared for<b>${q.customer.name}</b>${q.customer.co?q.customer.co:""}</div>
      </div>
      <div class="foot">Ref ${ref} · ${new Date().toLocaleDateString("en-GB")} · Main Street, Brandon, Coventry CV8 3FW · +44 (0)247 710 2555</div>
    </div>

    <!-- VENUE + ROOM -->
    <div class="page">
      <h2>Your event at Brandon Hall</h2><div class="rule"></div>
      <p class="lead">Set within 17 acres of Warwickshire grounds, Brandon Hall offers elegant spaces for every occasion. Here's our proposal for your ${et.label.toLowerCase()}.</p>
      <div class="grid2">${gallery}</div>
      <div class="stats">
        <div><b>${q.room.name}</b><span>Your room</span></div>
        <div><b>${q.room.m2} m²</b><span>Floor area</span></div>
        <div><b>${q.pax}</b><span>Guests</span></div>
        <div><b>${LAYOUT_LABELS[lay]}</b><span>Layout</span></div>
      </div>
      <h2 style="font-size:20px;margin-top:20px">Your room, laid out for ${q.pax} guests</h2><div class="rule"></div>
      <div style="max-width:480px;margin:0 auto">${svg}</div>
    </div>

    <!-- PACKAGE + COSTS -->
    <div class="page">
      <h2>Your proposal</h2><div class="rule"></div>
      ${pkg?`<div class="box"><b style="font-family:'Cormorant Garamond',serif;font-size:18px">${pkg.name}</b>
        <div class="inc">${pkg.includes.map(i=>`<div>${i}</div>`).join("")}</div></div>`:""}
      <h2 style="font-size:18px;margin-top:18px">Costs</h2><div class="rule"></div>
      <table>${rows}<tr class="total"><td>Total (inc. VAT where applicable)</td><td style="text-align:right">${money(q.subtotal)}</td></tr></table>
      <div class="carbon">🌱 Estimated event carbon footprint: <b>${q.carbon.total} kg CO₂e</b> — we're committed to sustainable events.</div>
      <div class="foot-note">This proposal is valid for 14 days and subject to availability. Prices include VAT at the current rate unless otherwise stated. Rates are non-commissionable. Cancellation terms are per individual contract. Bio-degradable confetti outside only; LED candelabras only (no naked flames).<br><br>
      To confirm, contact our events team: nicola.cartwright@brandonhallhotelandspa.com · +44 (0)247 710 2555</div>
    </div>
    <script>window.onload=()=>setTimeout(()=>window.print(),400)<\/script>
    </body></html>`);
  win.document.close();
}

function saveQuoteAsEnquiry(){
  const q=gatherQuote();
  if(!q.customer.name){ alert("Please enter the customer name first."); return; }
  Store.add({ name:q.customer.name, email:q.customer.email, phone:q.customer.phone,
    company:q.customer.co, event:q.evId, room:q.room.id, pax:q.pax, date:q.customer.date,
    value:q.subtotal, status:"quoted", source:"quote builder", notes:`Quote built: ${money(q.subtotal)}` });
  alert("Saved to the enquiry dashboard.");
}

/* ============================================================ ENQUIRIES */
const ENQ_STAGES=[["new","New"],["contacted","Contacted"],["quoted","Quoted"],["won","Won"],["lost","Lost"]];
function renderEnquiries(v){
  const head1=head("Enquiries","Every enquiry captured through the portal or shared form.");
  v.appendChild(head1);
  const tb=el("div","enq-toolbar");
  tb.innerHTML=`<button class="btn" id="enq-new">+ New enquiry</button>
    <button class="btn ghost" id="enq-link">Copy shareable form link</button><div class="spacer"></div>`;
  v.appendChild(tb);
  $("#enq-new").onclick=()=>openEnquiryForm({});
  $("#enq-link").onclick=()=>{ const url=location.href.split("#")[0]+"#enquire";
    navigator.clipboard?.writeText(url); alert("Shareable enquiry link copied:\n"+url+"\n\n(Public form — customers can submit without logging in.)"); };

  const list=Store.all();
  if(!list.length){ v.appendChild(el("div","empty",`<div class="big">No enquiries yet</div>
    Log one manually, or share the enquiry form link with customers.`)); return; }

  const cols=el("div","enq-cols");
  ENQ_STAGES.forEach(([sid,slabel])=>{
    const items=list.filter(e=>e.status===sid);
    const col=el("div","enq-col");
    col.innerHTML=`<h4>${slabel} <span>${items.length}</span></h4>`;
    items.forEach(e=>{
      const room=ROOMS.find(r=>r.id===e.room);
      const et=EVENT_TYPES.find(t=>t.id===e.event);
      const card=el("div","enq-card");
      card.innerHTML=`<div class="nm">${e.name}</div>
        <div class="meta">${et?et.label:"—"} · ${e.pax||"?"} guests${e.date?" · "+new Date(e.date).toLocaleDateString("en-GB"):""}</div>
        <div class="tags">${room?`<span class="tag">${room.name}</span>`:""}${e.value?`<span class="tag">${money(e.value)}</span>`:""}<span class="tag">${e.source||"manual"}</span></div>`;
      card.onclick=()=>openEnquiryDetail(e);
      col.appendChild(card);
    });
    cols.appendChild(col);
  });
  v.appendChild(cols);
}
function openEnquiryForm(pre){
  const body=`<div class="form-grid">
    <div><label>Name *</label><input id="e-name" placeholder="Customer name"></div>
    <div><label>Company</label><input id="e-co"></div>
    <div><label>Email</label><input id="e-email" type="email"></div>
    <div><label>Phone</label><input id="e-phone"></div>
    <div><label>Event type</label><select id="e-event">${EVENT_TYPES.map(t=>`<option value="${t.id}" ${pre.event===t.id?"selected":""}>${t.label}</option>`).join("")}</select></div>
    <div><label>Preferred date</label><input id="e-date" type="date"></div>
    <div><label>Room of interest</label><select id="e-room"><option value="">Any / unsure</option>${ROOMS.map(r=>`<option value="${r.id}" ${pre.room===r.id?"selected":""}>${r.name}</option>`).join("")}</select></div>
    <div><label>Guests</label><input id="e-pax" type="number" min="1"></div>
    <div class="full"><label>Notes</label><textarea id="e-notes" rows="3" placeholder="Requirements, budget, questions…"></textarea></div>
  </div>
  <div style="margin-top:18px"><button class="btn" id="e-submit">Save enquiry</button></div>`;
  showModal("New enquiry","Capture a customer enquiry",body);
  $("#e-submit").onclick=()=>{
    const name=$("#e-name").value.trim();
    if(!name){ $("#e-name").focus(); return; }
    Store.add({ name, company:$("#e-co").value, email:$("#e-email").value, phone:$("#e-phone").value,
      event:$("#e-event").value, date:$("#e-date").value, room:$("#e-room").value,
      pax:parseInt($("#e-pax").value)||null, notes:$("#e-notes").value, source:"manual" });
    closeModal(); render();
  };
}
function openEnquiryDetail(e){
  const room=ROOMS.find(r=>r.id===e.room); const et=EVENT_TYPES.find(t=>t.id===e.event);
  const body=`<div class="detail-row">
      <div class="stat"><div class="k">Event</div><div class="v" style="font-size:16px">${et?et.label:"—"}</div></div>
      <div class="stat"><div class="k">Guests</div><div class="v">${e.pax||"—"}</div></div>
      <div class="stat"><div class="k">Room</div><div class="v" style="font-size:16px">${room?room.name:"Any"}</div></div>
    </div>
    <div class="sec-title">Contact</div>
    <p style="font-size:14px">${e.email||"—"} · ${e.phone||"—"} ${e.company?" · "+e.company:""}</p>
    ${(e.budget||e.accommodation||e.date)?`<div class="sec-title">Details</div>
      <p style="font-size:14px">${e.date?`Date: ${e.date} · `:""}${e.budget?`Budget: ${e.budget} · `:""}${e.accommodation?`Accommodation: ${e.accommodation}`:""}</p>`:""}
    ${e.notes?`<div class="sec-title">Enquiry brief</div><p style="font-size:14px;line-height:1.6">${e.notes}</p>`:""}
    <p class="qs-sub" style="margin-top:10px">Source: ${e.source||"manual"}</p>
    <div class="sec-title">Move to stage</div>
    <div class="chips" id="stage-chips">${ENQ_STAGES.map(([s,l])=>`<button class="chip ${e.status===s?"on":""}" data-s="${s}">${l}</button>`).join("")}</div>
    <div class="qs-sub" style="margin-top:14px">Ref ${e.id} · logged ${new Date(e.created).toLocaleString("en-GB")}</div>`;
  showModal(e.name, e.source==="quote builder"?"From quote builder":"Enquiry", body);
  document.querySelectorAll("#stage-chips .chip").forEach(c=>c.onclick=()=>{
    Store.update(e.id,{status:c.dataset.s}); closeModal(); render();
  });
}

/* ============================================================ ADMIN */
function renderAdmin(v){
  v.appendChild(head("Admin","Reference data currently loaded. Editable data tables and M&E audit import land here."));
  v.appendChild(el("div","admin-note",
    `<b>Demo mode.</b> Rooms, hire rates and packages are read from <code>data.js</code>.
     Equipment recommendations are placeholders pending the M&amp;E audit — once you upload it,
     these become editable tables saved to Firebase. Enquiries are currently stored in this browser only.`));

  v.appendChild(el("div","sec-title","Users"));
  const ut=el("table","data-table");
  ut.innerHTML=`<tr><th>Name</th><th>Access code</th><th>Role</th></tr>`+
    Object.values(USERS).map(u=>`<tr><td>${u.name}</td><td>${u.code}</td><td>${u.role}</td></tr>`).join("");
  v.appendChild(ut);

  v.appendChild(el("div","sec-title","Rooms & hire rates"));
  const rt=el("table","data-table");
  rt.innerHTML=`<tr><th>Room</th><th>m²</th><th>Max cap</th><th>Half day</th><th>Full day</th></tr>`+
    ROOMS.map(r=>{const h=ROOM_HIRE[r.id]||{};
      return `<tr><td>${r.name}</td><td>${r.m2}</td><td>${maxCap(r)}</td><td>${h.half?money(h.half):"—"}</td><td>${h.full?money(h.full):"—"}</td></tr>`;}).join("");
  v.appendChild(rt);
}

/* ============================================================ SUPPLIERS */
function renderSuppliers(v){
  v.appendChild(head("Supplier Directory","Trusted suppliers for DJs, catering, décor and entertainment. External suppliers must provide PLI and PAT certificates before an event."));
  const grid=el("div","sup-grid");
  SUPPLIERS.forEach(s=>{
    const card=el("div","sup-card"+(s.featured?" feat":""));
    const pli = s.compliance.pli===true?`<span class="badge-ok">✓ PLI</span>`:s.compliance.pli===false?`<span class="badge-no">✗ PLI</span>`:`<span class="badge-no">PLI —</span>`;
    const pat = s.compliance.pat===true?`<span class="badge-ok">✓ PAT</span>`:s.compliance.pat===false?`<span class="badge-no">✗ PAT</span>`:`<span class="badge-no">PAT —</span>`;
    card.innerHTML=`<h3>${s.name}${s.featured?`<span class="feat-tag">PREFERRED</span>`:""}</h3>
      <div class="cat">${s.category}</div>
      <div class="blurb">${s.blurb}</div>
      <div class="svc">${s.services.map(x=>`<span>${x}</span>`).join("")}</div>
      ${s.pricing.length?`<table class="cap-table" style="margin-bottom:4px">${s.pricing.map(([k,val])=>`<tr><td>${k}</td><td>${val}</td></tr>`).join("")}</table>`:""}
      <div class="compliance"><b>Compliance:</b> ${pli} ${pat}</div>
      ${s.contact.note?`<p style="font-size:12.5px;color:var(--muted);margin-top:8px">${s.contact.note}</p>`:""}`;
    grid.appendChild(card);
  });
  v.appendChild(grid);
}

/* ============================================================ EVENTS CONCIERGE CHAT */
let BOT={ active:false, steps:[], idx:0, answers:{}, eventType:null };
function renderChat(v){
  v.appendChild(head("Events Concierge","A guided chat that captures complete enquiries and drops them into your dashboard. Share the link or embed the button on the hotel website."));
  const grid=el("div","chat-intro-grid");

  // left: live preview
  const left=el("div");
  left.innerHTML=`<div class="sec-title">Live preview</div>`;
  const frame=el("div","chat-frame"); frame.id="chat-frame";
  left.appendChild(frame);
  grid.appendChild(left);

  // right: share + embed
  const right=el("div");
  const shareUrl=location.href.split("#")[0]+"#events-chat";
  const embed=`<a href="${shareUrl}" target="_blank"
  style="display:inline-flex;align-items:center;gap:8px;background:#1a2b47;color:#fff;
  padding:13px 24px;border-radius:30px;font:600 15px/1 'Inter',sans-serif;
  text-decoration:none;box-shadow:0 4px 14px rgba(26,43,71,.3)">
  💬 Chat to our events specialist</a>`;
  right.innerHTML=`
    <div class="sec-title">Shareable link</div>
    <p style="font-size:14px;margin-bottom:6px">Send this to customers, or use it as the destination for a website button:</p>
    <div class="embed-box">${shareUrl}<button class="cp" data-copy="${shareUrl}">Copy</button></div>

    <div class="sec-title">Website button (copy &amp; paste)</div>
    <p style="font-size:14px;margin-bottom:6px">Paste this HTML anywhere on the hotel website to add the button:</p>
    <div class="embed-box">${embed.replace(/</g,"&lt;")}<button class="cp" data-copy-html>Copy</button></div>

    <div class="sec-title">How it looks</div>
    <div style="padding:20px;background:var(--paper);border-radius:10px;text-align:center">
      <a class="btn-preview" href="${shareUrl}" target="_blank" style="text-decoration:none">Chat to our events specialist</a>
    </div>

    <div class="admin-note" style="margin-top:18px">
      <b>Guided mode.</b> Runs as a smart branching conversation now — no AI key or cost.
      Upgrade to the full Claude-powered assistant later via a Firebase function (see README).
    </div>`;
  grid.appendChild(right);
  v.appendChild(grid);

  right.querySelector("[data-copy]")?.addEventListener("click",e=>{
    navigator.clipboard?.writeText(e.target.dataset.copy); e.target.textContent="Copied"; });
  right.querySelector("[data-copy-html]")?.addEventListener("click",e=>{
    navigator.clipboard?.writeText(embed); e.target.textContent="Copied"; });

  startBot(frame);
}

function startBot(frame){
  BOT={ active:true, steps:[], idx:0, answers:{}, eventType:null, phase:"start" };
  frame.innerHTML=`
    <div class="chat-header"><img src="assets/bh-logo.svg" alt="">
      <div><div class="ct">Brandon Hall Events</div><div class="cs">Typically replies in minutes</div></div></div>
    <div class="chat-body" id="chat-body"></div>
    <div class="chat-opts" id="chat-opts"></div>
    <div class="chat-input" id="chat-input"><input placeholder="Type your answer…" id="chat-field">
      <button id="chat-send">→</button></div>`;
  botSay(BOT_INTRO);
  BOT.steps=BOT_COMMON_START.slice();
  setTimeout(()=>askNext(),500);
  $("#chat-send").onclick=submitChat;
  $("#chat-field").addEventListener("keydown",e=>{ if(e.key==="Enter")submitChat(); });
}
function botSay(text){ const b=$("#chat-body"); if(!b)return;
  const bub=el("div","bubble bot",text); b.appendChild(bub); b.scrollTop=b.scrollHeight; }
function userSay(text){ const b=$("#chat-body"); if(!b)return;
  const bub=el("div","bubble user",text); b.appendChild(bub); b.scrollTop=b.scrollHeight; }
function askNext(){
  const opts=$("#chat-opts"); opts.innerHTML="";
  if(BOT.idx>=BOT.steps.length){ finishBot(); return; }
  const step=BOT.steps[BOT.idx];
  botSay(step.q);
  if(step.type==="choice"){
    $("#chat-input").style.display="none";
    step.options.forEach(([val,label])=>{ const b=el("button",null,label);
      b.onclick=()=>answerStep(step,val,label); opts.appendChild(b); });
    if(step.optional){ const sk=el("button",null,"Skip"); sk.onclick=()=>answerStep(step,"","(skipped)"); opts.appendChild(sk); }
  } else {
    $("#chat-input").style.display="flex";
    $("#chat-field").value=""; $("#chat-field").focus();
    if(step.optional){ const sk=el("button",null,"Skip"); sk.onclick=()=>answerStep(step,"","(skipped)"); opts.appendChild(sk); }
  }
}
function submitChat(){ const f=$("#chat-field"); const val=f.value.trim();
  const step=BOT.steps[BOT.idx]; if(!val && !step.optional)return; answerStep(step,val,val||"(skipped)"); }
function answerStep(step,val,label){
  userSay(label);
  BOT.answers[step.key]=val;
  // branch after event type
  if(step.key==="eventType"){
    BOT.eventType=val;
    BOT.steps = [...BOT_COMMON_START, ...botFlowFor(val), ...BOT_CONTACT];
  }
  BOT.idx++;
  setTimeout(askNext,350);
}
function finishBot(){
  $("#chat-opts").innerHTML=""; $("#chat-input").style.display="none";
  botSay("Perfect — thank you! I've passed everything to our events team and they'll be in touch very soon. 🎉");
  const a=BOT.answers;
  // map to enquiry record
  const paxGuess = a.pax || a.paxDay || (a.paxEve? a.paxEve : null);
  Store.add({
    name:a.name||"(via chat)", email:a.email||"", phone:a.phone||"",
    event:a.eventType||"other",
    date:a.date||"", pax: paxGuess? parseInt(paxGuess)||paxGuess : null,
    room:"", source:"events chat",
    budget:a.budget||"", accommodation:a.accommodation||"",
    notes:[ a.eventName?`Event: ${a.eventName}`:"", a.days?`Days: ${a.days}`:"",
      a.layout?`Layout: ${a.layout}`:"", a.av?`AV: ${a.av}`:"",
      a.catering?`Catering: ${a.catering}`:"", a.style?`Style: ${a.style}`:"",
      a.dateFlex?`Date ${a.dateFlex}`:"", a.paxEve?`Evening guests: ${a.paxEve}`:"",
      a.extras?`Extras: ${a.extras}`:"", a.agent?`Agent/company: ${a.agent}`:"",
      a.notes?`Notes: ${a.notes}`:"" ].filter(Boolean).join(" · ")
  });
  const opts=$("#chat-opts");
  const again=el("button",null,"Start another enquiry"); again.onclick=()=>startBot($("#chat-frame"));
  opts.appendChild(again);
}

/* ============================================================ HELPERS */
function head(title,sub){ const h=el("div","page-head"); h.innerHTML=`<h2>${title}</h2>${sub?`<p>${sub}</p>`:""}`; return h; }
function showModal(title,sub,bodyHTML){
  const root=$("#modal-root");
  root.innerHTML=`<div class="modal-bg"><div class="modal">
    <div class="modal-head"><div><h3>${title}</h3><div class="qs-sub">${sub||""}</div></div>
    <button class="close">×</button></div>
    <div class="modal-body">${bodyHTML}</div></div></div>`;
  root.querySelector(".close").onclick=closeModal;
  root.querySelector(".modal-bg").onclick=e=>{ if(e.target.classList.contains("modal-bg"))closeModal(); };
}
function closeModal(){ $("#modal-root").innerHTML=""; }

/* ============================================================ PUBLIC CHAT PAGE
   The shareable link (#events-chat) opens the concierge WITHOUT login,
   so customers can use it straight from the hotel website. */
function openPublicChat(){
  $("#login").classList.add("hidden");
  $("#app").classList.remove("hidden");
  document.querySelector(".topbar").style.display="none";
  document.querySelector("nav.tabs").style.display="none";
  const v=$("#view"); v.innerHTML="";
  v.style.maxWidth="480px";
  const wrap=el("div"); wrap.style.cssText="padding-top:10px";
  wrap.innerHTML=`<div style="text-align:center;margin-bottom:14px">
    <img src="assets/bh-logo.svg" style="width:90px" alt="Brandon Hall"></div>`;
  const frame=el("div","chat-frame"); frame.id="chat-frame"; frame.style.margin="0 auto";
  wrap.appendChild(frame); v.appendChild(wrap);
  startBot(frame);
}
if(location.hash==="#events-chat"){ window.addEventListener("DOMContentLoaded",openPublicChat); openPublicChat(); }
