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
  { id:"johnson",       name:"Johnson",        m2:23,  length:null, width:null, cap:{ boardroom:10, ushape:10, theatre:10, cabaret:null,reception:10 } },
  { id:"jones",         name:"Jones",          m2:40,  length:null, width:null, cap:{ boardroom:14, ushape:10, theatre:10, cabaret:null,reception:20 } },
  { id:"parke",         name:"Parke",          m2:40,  length:null, width:null, cap:{ boardroom:17, ushape:16, theatre:16, cabaret:null,reception:40 } },
  { id:"warwick",       name:"Warwick",        m2:27,  length:5.7,  width:4.65, cap:{ boardroom:10, ushape:10, theatre:12, cabaret:0,   reception:20 } },
  { id:"wolston-1",     name:"Wolston 1",      m2:37,  length:7.91, width:4.75, cap:{ boardroom:14, ushape:12, theatre:12, cabaret:20,  reception:30 } },
  { id:"wolston-2",     name:"Wolston 2",      m2:38,  length:5.75, width:5.0,  cap:{ boardroom:14, ushape:12, theatre:12, cabaret:20,  reception:30 } },
  { id:"wolston-3",     name:"Wolston 3",      m2:24,  length:5.3,  width:4.75, cap:{ boardroom:10, ushape:10, theatre:12, cabaret:10,  reception:24 } },
  { id:"wolston-suite", name:"Wolston Suite",  m2:88,  length:17.9, width:4.75, cap:{ boardroom:30, ushape:28, theatre:35, cabaret:50,  reception:80 } },
  { id:"woodlands",     name:"Woodlands",      m2:279, length:null, width:null, cap:{ boardroom:112,ushape:90, theatre:120,cabaret:200, reception:280 } },
  { id:"woodlands-1",   name:"Woodlands 1",    m2:140, length:null, width:null, cap:{ boardroom:50, ushape:40, theatre:55, cabaret:90,  reception:120 } },
  { id:"woodlands-2",   name:"Woodlands 2",    m2:140, length:null, width:null, cap:{ boardroom:50, ushape:40, theatre:55, cabaret:90,  reception:120 } }
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
