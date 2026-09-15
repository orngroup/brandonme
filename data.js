/* ============================================================
   BRANDON HALL PORTAL — DATA FILE
   Edit this file to update rooms, packages and pricing.
   AV / equipment values are DUMMY placeholders — overwrite
   from the M&E audit list when it arrives.
   Carbon values are ESTIMATED by model (see carbonModel()).
   ============================================================ */

const LOCATIONS = [
  {
    id: "brandon-hall",
    name: "Brandon Hall Hotel & Spa",
    town: "Coventry",
    address: "Main Street, Brandon, Coventry CV8 3FW",
    active: true
  }
  // future venues drop in here
];

/* ---- ROOMS (from Brandon_Hall_Sizes.xlsx) ----
   cap = capacity by layout; blank in source = null
   avStub / equipStub = DUMMY, replace from M&E audit    */
const ROOMS = [
  { id:"allkins",       name:"Allkins",        m2:53,  length:null, width:null, cap:{ boardroom:26, ushape:20, theatre:30, cabaret:null, reception:40 } },
  { id:"beech",         name:"Beech",          m2:43,  length:8.51, width:5.19, cap:{ boardroom:16, ushape:16, theatre:16, cabaret:20,  reception:40 } },
  { id:"brandon-1",     name:"Brandon 1",      m2:54,  length:13.26,width:6.55, cap:{ boardroom:26, ushape:26, theatre:26, cabaret:30,  reception:60 } },
  { id:"brandon-2",     name:"Brandon 2",      m2:76,  length:9.23, width:6.08, cap:{ boardroom:36, ushape:30, theatre:40, cabaret:60,  reception:100 } },
  { id:"brandon-suite", name:"Brandon Suite",  m2:130, length:null, width:null, combined:"Brandon 1 + Brandon 2", cap:{ boardroom:36, ushape:30, theatre:40, cabaret:90, reception:100 } },
  { id:"hunt",          name:"Hunt",           m2:49,  length:6.63, width:5.33, cap:{ boardroom:14, ushape:12, theatre:12, cabaret:0,   reception:25 } },
  { id:"johnson",       name:"Johnson",        m2:23,  length:5.08, width:4.22, cap:{ boardroom:10, ushape:10, theatre:10, cabaret:null,reception:10 } },
  { id:"jones",         name:"Jones",          m2:40,  length:8.20, width:4.88, cap:{ boardroom:14, ushape:10, theatre:10, cabaret:null,reception:20 } },
  { id:"parke",         name:"Parke",          m2:40,  length:6.98, width:6.67, cap:{ boardroom:17, ushape:16, theatre:16, cabaret:null,reception:40 } },
  { id:"warwick",       name:"Warwick",        m2:27,  length:5.7,  width:4.65, cap:{ boardroom:10, ushape:10, theatre:12, cabaret:0,   reception:20 } },
  { id:"wolston-1",     name:"Wolston 1",      m2:37,  length:7.91, width:4.75, cap:{ boardroom:14, ushape:12, theatre:12, cabaret:20,  reception:30 } },
  { id:"wolston-2",     name:"Wolston 2",      m2:38,  length:5.75, width:5.0,  cap:{ boardroom:14, ushape:12, theatre:12, cabaret:20,  reception:30 } },
  { id:"wolston-3",     name:"Wolston 3",      m2:24,  length:5.3,  width:4.75, cap:{ boardroom:10, ushape:10, theatre:12, cabaret:10,  reception:24 } },
  { id:"wolston-suite", name:"Wolston Suite",  m2:88,  length:17.9, width:4.75, cap:{ boardroom:30, ushape:28, theatre:35, cabaret:50,  reception:80 } },
  { id:"woodlands",     name:"Woodlands",      m2:279, length:19.0, width:13.05, cap:{ boardroom:112,ushape:90, theatre:120,cabaret:200, reception:280 } },
  { id:"woodlands-1",   name:"Woodlands 1",    m2:140, length:9.5,  width:13.05, cap:{ boardroom:50, ushape:40, theatre:55, cabaret:90,  reception:120 } },
  { id:"woodlands-2",   name:"Woodlands 2",    m2:140, length:19.5, width:13.05, cap:{ boardroom:50, ushape:40, theatre:55, cabaret:90,  reception:120 } }
];

/* ---- ROOM HIRE (from Meeting Packages sheet, inc VAT) ---- */
const ROOM_HIRE = {
  "allkins":{half:250,full:350}, "beech":{half:300,full:450},
  "brandon-1":{half:500,full:750}, "brandon-2":{half:300,full:400},
  "brandon-suite":{half:500,full:850}, "hunt":{half:350,full:450},
  "johnson":{half:250,full:350}, "jones":{half:250,full:350},
  "parke":{half:250,full:350}, "warwick":{half:250,full:350},
  "wolston-suite":{half:250,full:350}, "wolston-1":{half:250,full:350},
  "wolston-2":{half:250,full:350}, "wolston-3":{half:250,full:350},
  "woodlands":{half:750,full:1200}, "woodlands-1":{half:550,full:850},
  "woodlands-2":{half:550,full:850}
};

/* ---- EVENT TYPES + recommended layout ---- */
const EVENT_TYPES = [
  { id:"meeting",       label:"Meeting / Conference", icon:"📊", preferredLayouts:["boardroom","ushape","theatre"] },
  { id:"wedding",       label:"Wedding",              icon:"💍", preferredLayouts:["cabaret","reception","theatre"] },
  { id:"baby-shower",   label:"Baby Shower",          icon:"🍼", preferredLayouts:["cabaret","reception"] },
  { id:"birthday",      label:"Birthday Party",       icon:"🎂", preferredLayouts:["cabaret","reception"] },
  { id:"celebration",   label:"Celebration Party",    icon:"🥂", preferredLayouts:["cabaret","reception"] },
  { id:"funeral",       label:"Celebration of Life",  icon:"🕊️", preferredLayouts:["cabaret","theatre"] },
  { id:"christmas",     label:"Christmas / NYE",      icon:"🎄", preferredLayouts:["cabaret","reception"] }
];

/* ---- RECOMMENDED EQUIPMENT PER EVENT TYPE ----
   DUMMY DATA — replace from the M&E audit list.
   Rooms flag what they physically support separately (avSupport). */
const EVENT_EQUIPMENT = {
  "meeting":     ["LCD projector & screen","Flipchart & pens","PA system (on request)","ClickShare / wireless present","Delegate WiFi"],
  "wedding":     ["PA system & microphones","Screen for slideshow","Uplighting","DJ (Sound Kicks) £385+VAT","Dancefloor (on request)"],
  "baby-shower": ["Screen for slideshow","Background music / speakers","Cake table"],
  "birthday":    ["PA & microphone","Speakers","Screen","Dancefloor (on request)"],
  "celebration": ["PA & microphone","Speakers","Screen","DJ (Sound Kicks)"],
  "funeral":     ["PA & microphone","Screen for tribute slideshow","Background music"],
  "christmas":   ["DJ (Sound Kicks) £385+VAT","Staging (on request)","PA & microphones","Uplighting"]
};

/* ---- À LA CARTE ADD-ONS (from ADDITIONAL PRICING, inc where stated) ---- */
const ADDONS = [
  { cat:"Beverages & Breaks", items:[
    { name:"Tea, coffee & cookies/biscuits", price:3.75, unit:"pp" },
    { name:"Tea, coffee & pastries", price:5.50, unit:"pp" },
    { name:"Danish pastries", price:4.50, unit:"pp" },
    { name:"Unlimited tea/coffee", price:10, unit:"pp" },
    { name:"Breakfast rolls", price:8, unit:"pp" },
    { name:"Jugs of juice (apple/orange)", price:7.50, unit:"jug" },
    { name:"Jugs of squash/cordial", price:3.50, unit:"jug" },
    { name:"Mini bar fridge (up to 10 cans)", price:25, unit:"each" },
    { name:"Can of soft drink", price:2.50, unit:"each" },
    { name:"Mineral water still 750ml", price:4.70, unit:"btl" },
    { name:"Mineral water sparkling 750ml", price:4.70, unit:"btl" },
    { name:"Small water 330ml", price:2.70, unit:"btl" },
    { name:"Arrival drink (wine/beer/soft)", price:7.50, unit:"pp" },
    { name:"Glass of Prosecco 125ml", price:8, unit:"glass" },
    { name:"House wine (white/red/rosé)", price:30, unit:"btl" },
    { name:"Prosecco (from)", price:36, unit:"btl" },
    { name:"Bucket of beer (6 bottles)", price:30, unit:"bucket" },
    { name:"Cocktails", price:10.50, unit:"each" }
  ]},
  { cat:"Food", items:[
    { name:"Restaurant cold buffet lunch", price:19.50, unit:"pp" },
    { name:"Restaurant hot buffet lunch", price:25, unit:"pp" },
    { name:"Sandwich lunch with crisps", price:12, unit:"pp" },
    { name:"Sandwich lunch with chips", price:14, unit:"pp" },
    { name:"Soup and sandwich lunch", price:13, unit:"pp" },
    { name:"Bacon & egg rolls", price:8, unit:"pp" },
    { name:"Breakfast (individual, <15)", price:18.50, unit:"pp" },
    { name:"Group breakfast (min 15)", price:15, unit:"pp" },
    { name:"Fruit platter", price:15, unit:"each" },
    { name:"Bowl of fruit", price:8, unit:"each" },
    { name:"Canapés (3 per person)", price:10, unit:"pp" },
    { name:"Cheese platter", price:12, unit:"each" }
  ]},
  { cat:"Equipment & AV", items:[
    { name:"DJ (Sound Kicks)", price:385, unit:"event", note:"+VAT, on request" },
    { name:"Speakers", price:80, unit:"event" },
    { name:"Corkage still wine", price:18, unit:"btl" },
    { name:"Corkage sparkling", price:28, unit:"btl" },
    { name:"Corkage champagne", price:40, unit:"btl" }
  ]}
];

/* ---- DELEGATE PACKAGES (from Meeting Packages sheet) ---- */
const PACKAGES = [
  { id:"ddr", name:"Day Delegate Package", per:"pp", from:35, min:10,
    includes:["Main meeting room hire","All-day tea, coffee, biscuits, water","Locally inspired lunch","Pens, pads, flipchart","LCD projector & screen","Complimentary WiFi"] },
  { id:"ddr-light", name:"Day Delegate (Lighter Lunch)", per:"pp", from:29, min:10,
    includes:["Main meeting room hire","All-day tea, coffee, biscuits, water","Sandwich lunch & salad","Pens, pads, flipchart","LCD projector & screen","Complimentary WiFi"] },
  { id:"24hr", name:"24-Hour Delegate Package", per:"pp", from:134, min:10,
    includes:["Everything in Day Delegate","Dinner","Overnight accommodation","Breakfast"] },
  { id:"wedding-classic", name:"Wedding — Classic", per:"pp", from:149, min:50,
    includes:["Private room hire","Arrival drink","White linen napkins & tablecloths","3-course set classic menu","Tea & coffee","Evening buffet"] },
  { id:"wedding-special", name:"Wedding — Special", per:"pp", from:163, min:50,
    includes:["Private room hire","Arrival drink","3-course set menu","½ bottle wine pp","Evening buffet","Tea, coffee & mints"] },
  { id:"celebrate-classic", name:"Celebration Party — Classic", per:"pp", from:40, min:30,
    includes:["Private room hire","2-course sit-down or buffet","White linen","Tea & coffee"] },
  { id:"celebrate-special", name:"Celebration Party — Special", per:"pp", from:53, min:30,
    includes:["Private room hire","Arrival drink","3-course set classic menu","White linen","Tea & coffee"] },
  { id:"xmas-private", name:"Christmas — Private Party", per:"pp", from:68, min:1,
    includes:["Room hire","Arrival drink","3-course menu","DJ","½ bottle wine pp"] }
];

/* ---- CARBON MODEL ----
   ESTIMATE from floor area, occupancy & event type using
   UK hospitality benchmarks. Overwrite room.carbonOverride
   (kg CO2e) in ROOMS above to force a manual figure.       */
function carbonModel(room, eventTypeId, pax) {
  // Benchmarks (indicative, UK hospitality):
  const KWH_PER_M2_DAY = 0.35;        // lighting/HVAC per m² per event-day
  const KG_CO2_PER_KWH = 0.207;       // UK grid factor (BEIS 2024, approx)
  const roomEnergy = room.m2 * KWH_PER_M2_DAY * KG_CO2_PER_KWH;

  // Catering carbon per head varies by event type
  const CATERING = { meeting:2.1, wedding:6.5, "baby-shower":3.0, birthday:3.5,
                     celebration:4.0, funeral:3.0, christmas:6.0 };
  const perHead = CATERING[eventTypeId] ?? 3.0;
  const cateringCarbon = perHead * (pax || 0);

  const total = roomEnergy + cateringCarbon;
  return {
    total: Math.round(total),
    room: Math.round(roomEnergy),
    catering: Math.round(cateringCarbon),
    perHead: perHead
  };
}

/* ============================================================
   PHASE 2 ADDITIONS — images, tech, suppliers, layouts, bot
   ============================================================ */

/* ---- ROOM & GALLERY IMAGES (linked live from hotel site) ----
   These load in a normal browser from the hotel's own server.
   To store locally instead, download and change paths to assets/. */
const IMG = "https://www.brandonhallhotelandspa.com/wp-content/uploads";
const GALLERY = {
  meetings: [
    IMG+"/2025/09/1758893100-1000x667.png",
    IMG+"/2025/09/1758893782-1000x757.png",
    IMG+"/2025/09/1758893922-1000x757.png",
    IMG+"/2025/09/brandon-hall-hotel-spa-warwickshire-brandon-warwickshire-pic-4-1000x750.jpeg",
    IMG+"/2025/09/brandon-hall-hotel-spa-warwickshire-brandon-warwickshire-pic-9-1000x750.jpeg",
    IMG+"/2025/09/brandon-hall-hotel-spa-warwickshire-brandon-warwickshire-pic-5.jpeg"
  ],
  weddings: [
    IMG+"/2025/10/d5bbd9f93d2a64416f70d2749fa4d333.jpg",
    IMG+"/2025/10/cfe352cb08f87468ed316d803dc8c01f.jpg",
    IMG+"/2025/10/5c5ab5645d3775aa1599055058995442.jpg",
    IMG+"/2025/10/90ef2b092a6f8ef4d5fc2eae8c650bf7.jpg",
    IMG+"/2025/10/7c97647c255b50400681756be21e32f8.jpg"
  ]
};
/* Per-room hero: default to a meetings image; edit to assign specific shots */
function roomImage(room){
  const idx = Math.abs([...room.id].reduce((a,c)=>a+c.charCodeAt(0),0)) % GALLERY.meetings.length;
  return GALLERY.meetings[idx];
}

/* ---- TECH / CONNECTIVITY PER ROOM ----
   REAL DATA from M&E audit (20 Mar 2026). Standard DDR/24hr inclusions
   in every room: screen, HDMI cable, WiFi, pads & pens, flipchart.
   `sellable` and `adminNote` are shown in Admin only. */
const TECH_DEFAULT = {
  screen:"Screen provided", hdmi:true, wirelessShare:false, videoCall:false,
  laptopConnect:true, pa:false, microphones:false, wifi:true, flipchart:true,
  hearingLoop:false, blackout:true, naturalLight:true, notes:"",
  sellable:true, adminNote:""
};
const ROOM_TECH = {
  "brandon-1":{ screen:'98" 4K Smart TV on height-adjustable swivel stand', hdmi:true,
    wirelessShare:true, videoCall:true, notes:'ClickShare, HDMI + USB-C. TV hidden as room doubles for social events.',
    adminNote:'Sell breakout/refreshment area only via Brandon 1 (no separate access).' },
  "brandon-2":{ screen:'98" 4K Smart TV on height-adjustable swivel stand', hdmi:true,
    wirelessShare:true, videoCall:true, notes:'ClickShare, HDMI + USB-C. TV hidden as room doubles for social events.' },
  "brandon-suite":{ screen:'98" 4K Smart TVs (combined)', hdmi:true, wirelessShare:true, videoCall:true, pa:true,
    notes:'ClickShare, HDMI + USB-C across combined suite.' },
  "wolston-suite":{ screen:'75" 4K Smart TV + additional screen on stand', hdmi:true, wirelessShare:true,
    videoCall:true, pa:true, notes:'Long room — second screen so all guests see the presentation. ClickShare, HDMI + USB-C.',
    adminNote:'Partition now removed (was temporary/not soundproof).' },
  "beech":{ screen:'75" 4K Smart TV', hdmi:true, wirelessShare:true, videoCall:true,
    notes:'ClickShare, HDMI + USB-C.', sellable:false,
    adminNote:'NOT READY TO SELL: door needs fixing (attempted break-in, bottom panel broken), ladybird influx to clear, AV & door lock to fix.' },
  "hunt":{ screen:'Wall TV (HDMI compatibility unconfirmed)', hdmi:true, wirelessShare:false, videoCall:false,
    notes:'HDMI + USB-C, flipchart, branded pads & pens.', sellable:false,
    adminNote:'NOT READY TO SELL: damp ceiling; room currently inaccessible.' },
  "warwick":{ screen:'Wall TV (HDMI compatibility unconfirmed)', hdmi:true, wirelessShare:false, videoCall:false,
    notes:'HDMI + USB-C, flipchart, branded pads & pens.', sellable:false,
    adminNote:'NOT READY TO SELL: no corridor lighting; door key not working, room inaccessible.' },
  "johnson":{ adminNote:'AV to be confirmed (audit pending).' },
  "jones":{ adminNote:'AV to be confirmed (audit pending).' },
  "parke":{ adminNote:'AV to be confirmed (audit pending).' },
  "woodlands":{ pa:true, microphones:true, adminNote:'Theatre 28 / conference up to 220. AV to be confirmed.' },
  "woodlands-1":{ pa:true, microphones:true },
  "woodlands-2":{ pa:true, microphones:true }
};
function roomTech(room){ return Object.assign({}, TECH_DEFAULT, ROOM_TECH[room.id]||{}); }

const TECH_FIELDS = [
  ["screen","Screen / display"], ["hdmi","HDMI input"],
  ["wirelessShare","Wireless screen share"], ["videoCall","Video-call capable (Teams/Zoom)"],
  ["laptopConnect","Laptop connection"], ["pa","PA system"],
  ["microphones","Microphones"], ["wifi","Complimentary WiFi"],
  ["flipchart","Flipchart & pens"], ["hearingLoop","Hearing loop"],
  ["blackout","Blackout blinds"], ["naturalLight","Natural light"]
];

/* ---- SUPPLIER FACT SHEETS ---- */
const SUPPLIERS = [
  { id:"sound-kicks", name:"Sound Kicks", category:"DJ / AV / Live Events", featured:true,
    services:["DJ services","PA & sound hire","Live event production","Staging & lighting"],
    pricing:[["DJ (evening)","£385 + VAT"],["Speakers","£80"]],
    contact:{ note:"Book via hotel events team — confirmed on request" },
    compliance:{ pli:true, pat:true }, verified:true,
    blurb:"Preferred DJ and AV supplier for Brandon Hall. Handles DJ sets, PA hire and full live-event production including staging and lighting." },
  { id:"caterer-placeholder", name:"External Caterer (placeholder)", category:"Catering", featured:false,
    services:["To be added"], pricing:[], contact:{ note:"Add supplier details" },
    compliance:{ pli:null, pat:null }, verified:false,
    blurb:"Placeholder. External caterers must provide insurance, food hygiene certificates, PAT testing, food-handler training, menu, alcohol licence, and set-up/clean-up plan (per event FAQs)." },
  { id:"decorator-placeholder", name:"Decorator / Stylist (placeholder)", category:"Décor & Styling", featured:false,
    services:["To be added"], pricing:[], contact:{ note:"Add supplier details" },
    compliance:{ pli:null, pat:null }, verified:false,
    blurb:"Placeholder for chair covers, linen, centrepieces and styling. Note: LED candelabras only — no naked flames. Biodegradable confetti outside only." },
  { id:"entertainment-placeholder", name:"Entertainment (placeholder)", category:"Entertainment", featured:false,
    services:["Bands, performers — to be added"], pricing:[], contact:{ note:"Add supplier details" },
    compliance:{ pli:null, pat:null }, verified:false,
    blurb:"Placeholder for bands and performers (e.g. Oompah band, jazz band, Tread the Boards). External acts need PLI and PAT certificates." },
  { id:"florist-placeholder", name:"Florist (placeholder)", category:"Florals", featured:false,
    services:["To be added"], pricing:[], contact:{ note:"Add supplier details" },
    compliance:{ pli:null, pat:null }, verified:false, blurb:"Placeholder for floral arrangements and installations." }
];

/* ---- EVENTS CONCIERGE — Natalie Freeman, warm & personal ----
   Modelled on real enquiries (arrangeMY BOT, Hitched, website leads). */
const BOT_PERSON = { name:"Natalie Freeman", role:"Events Team, Brandon Hall Hotel & Spa",
  avatar:"NF" };
const BOT_GREETINGS = [
  "Hi there! 👋 I'm Natalie from the events team here at Brandon Hall.",
  "Lovely to have you — I'd love to help plan your event with us.",
  "I'll just ask you a few quick things so I can put together exactly the right proposal for you. Shall we make a start?"
];

const BOT_COMMON_START = [
  { key:"eventType", q:"First things first — what kind of occasion are you planning?", type:"choice",
    options:[["wedding","💍 Wedding"],["meeting","📊 Meeting / Conference"],["birthday","🎂 Birthday / Celebration"],
      ["baby-shower","🍼 Baby Shower"],["funeral","🕊️ Celebration of Life"],["christmas","🎄 Christmas / NYE"],["other","Something else"]] }
];
const BOT_FLOWS = {
  meeting: [
    { key:"eventName", q:"Wonderful. Does the meeting have a name or reference? (totally fine to skip)", type:"text", optional:true },
    { key:"date", q:"When are you looking to hold it? A date or rough timeframe is perfect.", type:"text" },
    { key:"days", q:"And how many days will you need?", type:"number" },
    { key:"pax", q:"Roughly how many delegates are you expecting?", type:"number" },
    { key:"layout", q:"How would you like the room set up?", type:"choice",
      options:[["boardroom","Boardroom"],["ushape","U-shape / Horseshoe"],["theatre","Theatre"],["cabaret","Cabaret"],["unsure","Not sure yet — happy for advice"]] },
    { key:"av", q:"What AV will you need? Think screens, laptop connection, video calls (Teams/Zoom), flipcharts — just tell me in your own words.", type:"text" },
    { key:"catering", q:"How about food and drink? Arrival tea/coffee, lunch, dinner…?", type:"text" },
    { key:"accommodation", q:"Will any of your delegates need to stay overnight?", type:"choice", options:[["yes","Yes"],["no","No"],["maybe","Possibly"]] },
    { key:"budget", q:"Do you have a day-delegate rate or budget in mind? No worries if not.", type:"text", optional:true },
    { key:"agent", q:"Last one on the event itself — are you booking for a company or as an agency? (skip if it's just you)", type:"text", optional:true }
  ],
  wedding: [
    { key:"date", q:"How exciting! 🥂 When are you hoping to celebrate? A date or a rough time of year is lovely.", type:"text" },
    { key:"dateFlex", q:"And is that date set in stone, or have you got a bit of flexibility?", type:"choice", options:[["fixed","It's fixed"],["flexible","We're flexible"]] },
    { key:"paxDay", q:"Roughly how many guests are you picturing for the day?", type:"number" },
    { key:"paxEve", q:"And for the evening celebration? (skip if you're not sure yet)", type:"number", optional:true },
    { key:"accommodation", q:"Will you and your guests want to stay with us overnight?", type:"choice", options:[["yes","Yes please"],["no","No"],["maybe","Not sure yet"]] },
    { key:"catering", q:"Any early thoughts on the food — a sit-down meal, a buffet, something else? (no wrong answers!)", type:"text", optional:true },
    { key:"budget", q:"Do you have a budget in mind for the day? It helps me tailor things — but do skip if you'd rather.", type:"text", optional:true },
    { key:"extras", q:"Anything on your wishlist? Drinks reception, a band or DJ, styling and décor…", type:"text", optional:true }
  ],
  social: [
    { key:"date", q:"Lovely! What date are you thinking of?", type:"text" },
    { key:"pax", q:"Roughly how many guests will be joining you?", type:"number" },
    { key:"style", q:"What sort of thing are you imagining? A sit-down meal, a buffet, drinks and canapés…?", type:"text" },
    { key:"accommodation", q:"Will anyone need to stay overnight?", type:"choice", options:[["yes","Yes"],["no","No"],["maybe","Not sure"]] },
    { key:"budget", q:"Any budget in mind? Happy to skip this one.", type:"text", optional:true },
    { key:"extras", q:"Anything special you'd like — a DJ, décor, entertainment?", type:"text", optional:true }
  ]
};
const BOT_CONTACT = [
  { key:"name", q:"That's everything I need about the event — thank you! 😊 Could I take your name?", type:"text" },
  { key:"email", q:"Lovely to meet you, {name}! What's the best email to reach you on?", type:"text" },
  { key:"phone", q:"And a phone number, in case it's easier for me to call?", type:"text" },
  { key:"notes", q:"Anything else you'd like me to know before I pass this to the team?", type:"text", optional:true }
];
function botFlowFor(eventType){
  if(eventType==="meeting") return BOT_FLOWS.meeting;
  if(eventType==="wedding") return BOT_FLOWS.wedding;
  return BOT_FLOWS.social;
}
const BOT_SIGNOFF = "Perfect — I've got everything, {name}. I'm passing this straight to our events team and one of us will be in touch very soon with a tailored proposal. Thank you so much for thinking of Brandon Hall — we'd love to host you. 💙\n\n— Natalie";

/* ---- COMPETITOR BENCHMARKING (from Nicola's comp-set sheet) ----
   Brandon Hall's own rates shown alongside for comparison. */
const COMPETITORS = [
  { name:"Brandon Hall", us:true, ddr:"—", h24:"—", wedding:"£55pp (party)", xmas:"£24.95–£29.95", aftTea:"£22.50 / £30", babyShower:"£24.95–£29.95" },
  { name:"Coombe Abbey", ddr:"£45+VAT", h24:"£165+VAT", wedding:"£115–£150pp", xmas:"£74.95", aftTea:"£37", babyShower:"£38–£41" },
  { name:"Chesford Grange", ddr:"£30 inc", h24:"—", wedding:"£84–£99pp", xmas:"£27–£32", aftTea:"£30 / £35", babyShower:"£30–£42" },
  { name:"Nailcote Hall", ddr:"£30 inc", h24:"£160", wedding:"£40–£90pp + hire", xmas:"£59pp", aftTea:"£28–£34", babyShower:"£28–£34" },
  { name:"Windmill Village", ddr:"£48 inc", h24:"£170–£185", wedding:"from £6,495", xmas:"£70pp", aftTea:"£22.50 / £30", babyShower:"£43" },
  { name:"Village Coventry", ddr:"£35 inc", h24:"on request", wedding:"£3,000–£10,000", xmas:"TBC", aftTea:"£21.50–£30", babyShower:"£21.50–£30" }
];
const COMPSET_NOTE = "Nicola's view: priced right for now given our offering; room to push rates later, but not yet.";

/* ---- CHRISTMAS PACKAGES (amended Aug 2026) — dynamic per-head ---- */
const XMAS_PACKAGES = [
  { id:"joiner", name:"Joiner Party Night", pp:55, min:1, dates:"Fri 4th & 18th Dec",
    lines:[["Room hire",3],["Arrival drink",0],["Novelties & décor",2],["3-course menu",28],["DJ",5],["Oompah Band (min 100)",17]] },
  { id:"private", name:"Private Party Night", pp:45, min:30, dates:"Your date",
    lines:[["Room hire",4],["Arrival drink",8],["3-course menu",28],["DJ",5],["½ bottle wine pp",0]] },
  { id:"xmas-lunch", name:"Christmas Lunch (24 Dec)", pp:80, min:1, dates:"24 Dec",
    lines:[["Festive afternoon tea",30],["Dinner",40],["Table décor/linen/crackers",7],["Jazz band (min 70)",20]] },
  { id:"nye", name:"New Year's Eve Gala", pp:195, min:1, dates:"31 Dec",
    lines:[["Bed & breakfast",40],["Prosecco & canapés",13],["4-course gala dinner",65],["Décor/linen/chair covers",16],
      ["Novelties",5],["Staging",5],["Entertainment (DJ/Band)",35],["Midnight Prosecco",6],["Late licence",5],["NYD brunch",5]] }
];

/* ---- UPDATED DDR / ROOM-HIRE-ONLY (Rates sheet) ---- */
const DDR_RATES = { day:35, dayLight:29, h24:124 };
const ROOM_HIRE_ONLY = { // min–max £ per Rates sheet
  "wolston-1":[100,300], "wolston-2":[100,300], "wolston-3":[200,300],
  "beech":[200,400], "brandon-1":[350,1500], "brandon-2":[350,1500]
};

/* ---- EVENT PROFITABILITY MODEL (from their wedding costing tool) ----
   Revenue − food/bev cost of sales − payroll − controllable − commission = profit.
   Defaults mirror the spreadsheet; all editable in the tool. */
const PROFIT_DEFAULTS = {
  vat: 0.20,
  foodCoS: 0.35,        // food cost of sales
  bevCoS: 0.31,         // beverage cost of sales
  bevSpendPP: 10,       // estimated beverage on-spend per cover (inc VAT)
  // package element split (per cover, inc VAT) — editable
  elements: { food:50, alcohol:23, soft:0, roomHire:5, dj:0, linen:1.5, toastmaster:0, eveBuffet:25, bedroom:2, av:0 },
  // payroll roles: rate £/hr (inc NI & pension), default shifts & hours
  payroll: [
    { role:"Manager",    rate:21.8, staff:1, hours:8 },
    { role:"Supervisor", rate:15,   staff:1, hours:8 },
    { role:"Associate",  rate:13,   staff:2, hours:8 },
    { role:"Chef",       rate:22,   staff:2, hours:8 },
    { role:"Steward",    rate:13,   staff:1, hours:4 }
  ],
  controllable: { equipment:0, linen:120, security:0, other:0 },
  commissionRate: 0
};

/* ---- PROFIT TOOL: EVENT-TYPE TEMPLATES ----
   Load the right price + element split + payroll for each event type,
   so the tool doesn't default to wedding assumptions every time. */
const PROFIT_TEMPLATES = {
  "wedding": { label:"Wedding (Extra Special)", price:106.50, bevSpend:10,
    elements:{ food:50, alcohol:23, soft:0, roomHire:5, dj:0, linen:1.5, toastmaster:0, eveBuffet:25, bedroom:2, av:0 },
    payroll:[{role:"Manager",rate:21.8,staff:1,hours:8},{role:"Supervisor",rate:15,staff:1,hours:8},
      {role:"Associate",rate:13,staff:2,hours:8},{role:"Chef",rate:22,staff:2,hours:8},{role:"Steward",rate:13,staff:1,hours:4}],
    controllable:{ equipment:0, linen:120, security:0, other:0 } },
  "meeting": { label:"Day Delegate Meeting", price:35, bevSpend:0,
    elements:{ food:18, alcohol:0, soft:0, roomHire:10, dj:0, linen:0, toastmaster:0, eveBuffet:0, bedroom:0, av:0 },
    payroll:[{role:"Manager",rate:21.8,staff:1,hours:4},{role:"Associate",rate:13,staff:1,hours:8},
      {role:"Chef",rate:22,staff:1,hours:6},{role:"Steward",rate:13,staff:1,hours:2}],
    controllable:{ equipment:0, linen:0, security:0, other:0 } },
  "24hr": { label:"24hr Delegate", price:124, bevSpend:5,
    elements:{ food:34, alcohol:0, soft:0, roomHire:10, dj:0, linen:0, toastmaster:0, eveBuffet:0, bedroom:90, av:0 },
    payroll:[{role:"Manager",rate:21.8,staff:1,hours:8},{role:"Associate",rate:13,staff:2,hours:8},
      {role:"Chef",rate:22,staff:2,hours:8},{role:"Steward",rate:13,staff:1,hours:4}],
    controllable:{ equipment:0, linen:0, security:0, other:0 } },
  "christmas": { label:"Christmas Party", price:55, bevSpend:8,
    elements:{ food:28, alcohol:0, soft:0, roomHire:4, dj:5, linen:1, toastmaster:0, eveBuffet:0, bedroom:0, av:0 },
    payroll:[{role:"Manager",rate:21.8,staff:1,hours:6},{role:"Supervisor",rate:15,staff:1,hours:6},
      {role:"Associate",rate:13,staff:2,hours:6},{role:"Chef",rate:22,staff:2,hours:6},{role:"Steward",rate:13,staff:1,hours:4}],
    controllable:{ equipment:0, linen:0, security:0, other:0 } },
  "celebration": { label:"Celebration / Party", price:53, bevSpend:8,
    elements:{ food:35, alcohol:0, soft:0, roomHire:5, dj:0, linen:1, toastmaster:0, eveBuffet:0, bedroom:0, av:0 },
    payroll:[{role:"Manager",rate:21.8,staff:1,hours:6},{role:"Associate",rate:13,staff:2,hours:6},
      {role:"Chef",rate:22,staff:1,hours:6},{role:"Steward",rate:13,staff:1,hours:4}],
    controllable:{ equipment:0, linen:0, security:0, other:0 } },
  "funeral": { label:"Wake / Celebration of Life", price:30, bevSpend:5,
    elements:{ food:20, alcohol:0, soft:0, roomHire:5, dj:0, linen:1, toastmaster:0, eveBuffet:0, bedroom:0, av:0 },
    payroll:[{role:"Manager",rate:21.8,staff:1,hours:4},{role:"Associate",rate:13,staff:1,hours:4},
      {role:"Chef",rate:22,staff:1,hours:4}],
    controllable:{ equipment:0, linen:0, security:0, other:0 } }
};
/* map enquiry event ids to a template */
function templateForEvent(evId){
  if(evId==="meeting") return "meeting";
  if(evId==="wedding") return "wedding";
  if(evId==="christmas") return "christmas";
  if(evId==="funeral") return "funeral";
  if(["birthday","baby-shower","celebration"].includes(evId)) return "celebration";
  return "wedding";
}

/* ============================================================
   M&E UPGRADE — equipment tracker per room
   Source: "M&E as of 20 Mar" sheet. Each item has qty, status
   (needed / ordered / delivered / installed) and optional size.
   ============================================================ */
const MNE_STATUSES = ["needed","ordered","delivered","installed"];
const MNE_CATEGORIES = ["Screen","Projector","Connectivity","Software","Furniture","Power","Stationery","Other"];

/* Standard inclusions every meeting room gets (DDR/24hr standard) */
const MNE_STANDARD = ["Screen","HDMI cable","Wi-Fi","Pads & pens","Flipchart pads & pens","Branded notepads"];

/* Per-room equipment lines from the audit. size only where relevant (TV "). */
const MNE_ROOMS = {
  "brandon-1": { readyToSell:true, currentAV:"Projector screen",
    comments:"Sell as part of Brandon 1 as breakout/refreshment area — no access except through Brandon 1. TV hidden as room doubles for social gatherings.",
    items:[
      { cat:"Screen", item:'4K Smart TV', size:'98"', qty:1, status:"needed" },
      { cat:"Furniture", item:"Swivel stand, height-adjustable", qty:1, status:"needed" },
      { cat:"Connectivity", item:"HDMI cable", qty:1, status:"needed" },
      { cat:"Connectivity", item:"USB-C connectors", qty:1, status:"needed" },
      { cat:"Software", item:"ClickShare", qty:1, status:"needed" }
    ]},
  "brandon-2": { readyToSell:true, currentAV:"No equipment",
    comments:"TV hidden as room doubles for social gatherings.",
    items:[
      { cat:"Screen", item:'4K Smart TV', size:'98"', qty:1, status:"needed" },
      { cat:"Furniture", item:"Swivel stand, height-adjustable", qty:1, status:"needed" },
      { cat:"Connectivity", item:"HDMI cable", qty:1, status:"needed" },
      { cat:"Connectivity", item:"USB-C connectors", qty:1, status:"needed" },
      { cat:"Software", item:"ClickShare", qty:1, status:"needed" }
    ]},
  "wolston-suite": { readyToSell:true, currentAV:"1 x projector screen, no projector",
    comments:"Long room — additional screen needed so guests see the presentation. Partition now removed (15/9).",
    items:[
      { cat:"Screen", item:'4K Smart TV', size:'75"', qty:1, status:"needed" },
      { cat:"Screen", item:"Additional screen on stand (long room)", qty:1, status:"needed" },
      { cat:"Connectivity", item:"HDMI cable", qty:1, status:"needed" },
      { cat:"Connectivity", item:"USB-C connectors", qty:1, status:"needed" },
      { cat:"Software", item:"ClickShare", qty:1, status:"needed" }
    ]},
  "beech": { readyToSell:false, currentAV:"None",
    comments:"NOT READY: door needs fixing (attempted break-in, bottom panel broken), ladybird influx to clear, AV & door lock to fix.",
    items:[
      { cat:"Screen", item:'4K Smart TV', size:'75"', qty:1, status:"needed" },
      { cat:"Connectivity", item:"HDMI cable", qty:1, status:"needed" },
      { cat:"Connectivity", item:"USB-C connectors", qty:1, status:"needed" },
      { cat:"Software", item:"ClickShare", qty:1, status:"needed" },
      { cat:"Other", item:"Door repair & lock", qty:1, status:"needed" },
      { cat:"Other", item:"Ladybird clearance", qty:1, status:"needed" }
    ]},
  "hunt": { readyToSell:false, currentAV:"TV on wall (HDMI compatibility unconfirmed)",
    comments:"NOT READY: damp ceiling; cannot access room currently. Images to follow.",
    items:[
      { cat:"Connectivity", item:"HDMI cable", qty:1, status:"needed" },
      { cat:"Connectivity", item:"USB-C connectors", qty:1, status:"needed" },
      { cat:"Stationery", item:"Flipchart, pads & pens, branded notepads", qty:1, status:"needed" },
      { cat:"Other", item:"Damp ceiling repair", qty:1, status:"needed" }
    ]},
  "warwick": { readyToSell:false, currentAV:"TV on wall (HDMI compatibility unconfirmed)",
    comments:"NOT READY: no corridor lighting; door key not working, cannot enter. Images to follow.",
    items:[
      { cat:"Connectivity", item:"HDMI cable", qty:1, status:"needed" },
      { cat:"Connectivity", item:"USB-C connectors", qty:1, status:"needed" },
      { cat:"Stationery", item:"Flipchart, pads & pens, branded notepads", qty:1, status:"needed" },
      { cat:"Power", item:"Corridor lighting", qty:1, status:"needed" },
      { cat:"Other", item:"Door key/lock repair", qty:1, status:"needed" }
    ]},
  "johnson": { readyToSell:null, currentAV:"To confirm", comments:"AV to be audited.", items:[] },
  "jones": { readyToSell:null, currentAV:"To confirm", comments:"AV to be audited.", items:[] },
  "parke": { readyToSell:null, currentAV:"To confirm", comments:"AV to be audited.", items:[] },
  "woodlands": { readyToSell:null, currentAV:"To confirm",
    comments:"28 theatre / up to 220 conference. AV to be audited.", items:[] }
};
