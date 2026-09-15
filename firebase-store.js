/* ============================================================
   FIREBASE STORE — auth + Firestore with live sync
   Falls back to localStorage (demo mode) if Firebase is
   unavailable or not configured.
   ============================================================ */
let FB = { ready:false, auth:null, db:null, user:null };

(function initFirebase(){
  try{
    if(typeof firebase==="undefined" || !firebaseConfig || firebaseConfig.apiKey.startsWith("YOUR_")){
      console.info("Firebase not configured — running in demo mode.");
      return;
    }
    firebase.initializeApp(firebaseConfig);
    FB.auth = firebase.auth();
    FB.db = firebase.firestore();
    FB.ready = true;
    console.info("Firebase connected:", firebaseConfig.projectId);
  }catch(e){ console.warn("Firebase init failed, demo mode:", e.message); FB.ready=false; }
})();

/* ---- AUTH ---- */
async function fbSignIn(userKey, code){
  if(!FB.ready) return { ok:false, demo:true };
  const map = (typeof FB_LOGINS!=="undefined") ? FB_LOGINS[userKey] : null;
  if(!map) return { ok:false, error:"Unknown user" };
  if(code.toUpperCase()!==map.code) return { ok:false, error:"Incorrect access code" };
  try{
    await FB.auth.signInWithEmailAndPassword(map.email, map.pw);
    FB.user = map;
    return { ok:true, name:map.name };
  }catch(e){
    // common: user not created yet in Firebase console
    if(e.code==="auth/user-not-found" || e.code==="auth/invalid-credential")
      return { ok:false, error:"Account not set up in Firebase yet — see README step 5." };
    if(e.code==="auth/wrong-password")
      return { ok:false, error:"Password mismatch — check the padded password in Firebase." };
    return { ok:false, error:e.message };
  }
}
async function fbSignOut(){ if(FB.ready && FB.auth) try{ await FB.auth.signOut(); }catch{} FB.user=null; }

/* Public chat page has no login. To let it write an enquiry under the
   auth-only Firestore rules, sign in anonymously first. Requires
   Anonymous sign-in to be enabled in Firebase Auth. */
async function fbEnsureAnon(){
  if(!FB.ready) return false;
  if(FB.auth.currentUser) return true;
  try{ await FB.auth.signInAnonymously(); return true; }
  catch(e){ console.warn("Anon sign-in unavailable:", e.message); return false; }
}

/* ---- FIRESTORE ENQUIRY STORE ----
   Mirrors the demo Store API but backed by Firestore with a live
   listener. Falls back to the localStorage Store if not ready. */
const FBStore = {
  _cache: [],
  _listeners: [],
  live:false,

  onChange(cb){ this._listeners.push(cb); },
  _emit(){ this._listeners.forEach(cb=>cb(this._cache)); },

  start(){
    if(!FB.ready || !FB.user){ return false; }
    if(this.live) return true;
    this.live=true;
    FB.db.collection("enquiries").orderBy("created","desc")
      .onSnapshot(snap=>{
        this._cache = snap.docs.map(d=>({ id:d.id, ...d.data() }));
        this._emit();
      }, err=>{ console.warn("Firestore listener error:", err.message); });
    return true;
  },
  all(){ return this._cache; },
  async add(e){
    e.created = e.created || new Date().toISOString();
    e.status = e.status || "new";
    if(FB.ready && FB.user){
      const ref = await FB.db.collection("enquiries").add(e);
      return { id:ref.id, ...e };
    }
    return Store.add(e); // fallback
  },
  async update(id, patch){
    if(FB.ready && FB.user){ await FB.db.collection("enquiries").doc(id).update(patch); return; }
    Store.update(id, patch);
  },
  async seedOnce(samples){
    // only seed if the collection is empty AND not seeded before
    if(!FB.ready || !FB.user) return;
    const snap = await FB.db.collection("enquiries").limit(1).get();
    if(!snap.empty) return; // already has data
    const flag = await FB.db.collection("meta").doc("seeded").get();
    if(flag.exists) return;
    const batch = FB.db.batch();
    samples.forEach(s=>{ const ref=FB.db.collection("enquiries").doc();
      batch.set(ref, { ...s, created:s.created||new Date().toISOString(), status:s.status||"new" }); });
    batch.set(FB.db.collection("meta").doc("seeded"), { at:new Date().toISOString() });
    await batch.commit();
  }
};
