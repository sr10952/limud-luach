/* ===================== UI ===================== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const pad=n=>String(n).padStart(2,'0');
const todayIso=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PLACE=n=>({on:false,todo:true,type:'num',name:n,start:todayIso(),from:1,per:1,unit:'',max:'',letters:false,lines:'',cycle:true,text:'',days:[false,true,true,true,true,true,false],skipSh:false,skipYT:false});
const PRESETS=()=>[
 {on:true,top:true,pid:'mm1',type:'amud',name:'מאמר מרדכי',abbr:'מאמר',start:'2026-10-07',am:'עירובין',ad:11,as:'b',rev:true,mr:'עירובין',mrd:3,mrs:'a',mrStart:'2026-10-12',skipYT:false,skipSh:false},
 {on:true,top:true,pid:'mm2',type:'amud',name:'מאמר מרדכי – חולין',abbr:'מאמר חולין',start:'2026-10-12',am:'חולין',ad:4,as:'a',rev:true,mr:'מנחות',mrd:102,mrs:'b',mrStart:'2026-10-12',skipYT:false,skipSh:false},
 {on:true,top:true,pid:'msm',type:'mish',name:'משניות משנת מרדכי',abbr:'משניות',start:'2026-10-07',mm:'בבא מציעא',mc:4,mi:10,skipSh:false,skipYT:false},
 {on:true,top:true,pid:'ory',type:'amud',name:'אורייתא',abbr:'אורייתא',start:'2026-10-07',am:'יבמות',ad:114,as:'b',rev:true,skipYT:false,skipSh:false},
 CHOVOS(),
 {on:false,pid:'shl',type:'list',name:'שמירת הלשון – דרשו',abbr:'שמה״ל',start:'2026-10-12',cycle:false,skipSh:false,skipYT:false,
  lines:"פרק ד׳ ׳וגם הוא׳ – ׳וכתב רבינו׳\nפרק ד׳ ׳וכתב רבינו׳ – ׳הג״ה ושמעתי׳\nפרק ד׳ ׳הג״ה ושמעתי׳ – סוף הפרק\nפרק ה׳ ׳והנה מכל׳ – ׳בא וראה׳\nפרק ה׳ ׳בא וראה׳ – ׳ואיתא במדרש׳\nפרק ה׳ ׳ואיתא במדרש׳ – ׳וכעין זה׳\nפרק ה׳ ׳וכעין זה׳ – ׳וזוכה גם׳\nפרק ה׳ ׳וזוכה גם׳ – ׳ובכלל׳\nפרק ה׳ ׳ובכלל׳ – ׳וכל זה׳\nפרק ה׳ ׳וכל זה׳ – ׳ובאמת מה׳\nפרק ה׳ ׳ובאמת מה׳ – סוף הפרק\nפרק ו׳ ׳וכל זה׳ – ׳והעיקר תלוי׳\nפרק ו׳ ׳והעיקר תלוי׳ – ׳לכן האיש׳\nפרק ו׳ ׳לכן האיש׳ – ׳ולהיפך גודל׳\nפרק ו׳ ׳ולהיפך גודל׳ – ׳ודע עוד׳\nפרק ו׳ ׳ודע עוד׳ – סוף הפרק\nפרק ז׳ ׳ובעוונותינו׳ – ׳וביותר מזה׳\nפרק ז׳ ׳וביותר מזה׳ – ׳ובאמת הוצאת׳\nפרק ז׳ ׳ובאמת הוצאת׳ – ׳ולפעמים זוכה׳\nפרק ז׳ ׳ולפעמים זוכה׳ – ׳וכזה איתא׳\nפרק ז׳ ׳וכזה איתא׳ – ׳גם כל׳\nפרק ז׳ ׳גם כל׳ – ׳וזה הוא׳\nפרק ז׳ ׳וזה הוא׳ – ׳ונציר שתי׳\nפרק ז׳ ׳ונציר שתי׳ – ׳ועתה נתבונן׳\nפרק ז׳ ׳ועתה נתבונן׳ – ׳ואם כן׳\nפרק ז׳ ׳ואם כן׳ – סוף הפרק\nפרק ח׳ ׳ויש שמורים׳ – ׳ובאמת אנו׳\nפרק ח׳ ׳ובאמת אנו׳ – ׳ואשא משלי׳\nפרק ח׳ ׳ואשא משלי׳ – ׳ואעתיק מה׳\nפרק ח׳ ׳ואעתיק מה׳ – ׳ואקדים פרט׳"}];
/* חובות הלבבות: the shiur number, counted from today's number; the day a new שער starts shows its name.
   Needs today's shiur number before it is shown (todo), so a wrong number is never printed. */
/* שיעור א׳ = י״ד כסלו תשפ״ו (4 Dec 2025), one shiur a day except Shabbos, 440 shiurim; each line of marks = the shiur a שער starts on */
function CHOVOS(){return {on:true,top:true,pid:'chv',type:'num',name:'חובות הלבבות',abbr:'חוה״ל',unit:'שיעור',from:1,per:1,max:440,letters:true,start:'2025-12-04',skipSh:true,skipYT:false,
  marks:['1 שער היחוד','25 שער הבחינה','71 שער עבודת אלוקים','133 שער הבטחון','203 שער יחוד המעשה','248 שער הכניעה','283 שער התשובה','316 שער חשבון הנפש','378 שער הפרישות','405 שער אהבת השם'].join('\n')};}
const VIZ_ORDER=['mm1','mm2','msm','ory','chv'];
const DIRSHU_TESTS=()=>DIRSHU_TESTS_5787.map(([date,name,text])=>({ty:'oth',src:'dirshu',name,date,from:'',text}));
const PRESET_TESTS=()=>[
 {ty:'oth',name:'מאמר מרדכי',date:'2026-11-01',from:'',text:'עירובין: מדף י: (אם יש) עד דף כ. תחלת העמוד ׳בעא מיניה׳ · חולין: מתחלת המסכתא עד דף י'},
 ...DIRSHU_TESTS()];
/* bring settings saved before v2 up to date: add the second מאמר מרדכי track, its חזרת החודש, חובות הלבבות and the known tests */
function migrate(s){if((s.v||1)<2)s=migrateV2(s);

  /* v3: the placeholder Dirshu tests (named "דרשו · …") are replaced by the full 5787 schedule; the user's own tests stay */
  if((s.v||1)<3){s.tests=s.tests.filter(x=>!(x.src==='dirshu'||/^דרשו · /.test(x.name||'')));s.tests.push(...DIRSHU_TESTS());s.v=3;}
  /* v4: Vizhnitz limudim (מאמר מרדכי ×2, משניות משנת מרדכי, אורייתא, חובות הלבבות) right after דף היומי; the mussar list is שמירת הלשון; classic look */
  if((s.v||1)<4){const C=s.custom;
    for(const c of C){if(c.type==='mish'&&/^משנת מרדכי$/.test(c.name)){c.name='משניות משנת מרדכי';c.pid='msm';}
      if(c.type==='amud'&&c.name==='אורייתא')c.pid='ory';
      if(c.pid==='chl'&&c.type==='list'){c.pid='shl';c.name='שמירת הלשון – דרשו';c.on=false;c.top=false;}}
    if(!C.some(c=>c.pid==='chv'))C.push(CHOVOS());
    for(const c of C)if(VIZ_ORDER.includes(c.pid))c.top=true;
    const viz=VIZ_ORDER.map(p=>C.find(c=>c.pid===p)).filter(Boolean);s.custom=[...viz,...C.filter(c=>!viz.includes(c))];
    s.style='classic';s.v=Math.max(s.v||1,4);}
  /* v5: חובות הלבבות with its real schedule (keeps the user's own if they already set one up) */
  if((s.v||1)<5){const i=s.custom.findIndex(c=>c.pid==='chv');if(i<0)s.custom.push(CHOVOS());else if(s.custom[i].todo||!s.custom[i].from)s.custom[i]=CHOVOS();s.v=5;}
  return s;}
function migrateV2(s){const P=PRESETS();
  const i=s.custom.findIndex(c=>c.pid==='mm1'||(c.type==='amud'&&c.name==='מאמר מרדכי'));
  if(i>=0){const c=s.custom[i];c.pid='mm1';c.top=true;if(!c.mr)Object.assign(c,{mr:P[0].mr,mrd:P[0].mrd,mrs:P[0].mrs,mrStart:P[0].mrStart});}
  if(!s.custom.some(c=>c.pid==='mm2'))s.custom.splice(i>=0?i+1:0,0,P[1]);
  if(!s.custom.some(c=>c.pid==='chl'))s.custom.push(P.find(c=>c.pid==='chl'));
  const mmt=PRESET_TESTS()[0];if(!s.tests.some(y=>y.date===mmt.date&&y.name===mmt.name))s.tests.push(mmt);
  s.v=2;return s;}
const DEF=()=>({view:'month',date:todayIso(),on:{daf:true,ayd:true,mb:true,r3:false,r1:false,yer:false,teh:false,par:true,shn:false},v:5,style:'classic',order:null,custom:PRESETS(),tests:PRESET_TESTS(),shul:'',title:'לימוד־לוח',sub:'',foot:'',theme:'parchment',paper:'tab',orient:'auto',pages:1,netz:false,greg:true,hol:true,zman:true,shk:true,cm:30,hm:56,zip:'10952'});
const STD=[{k:'daf',t:'דף היומי',d:'גמרא בבלי · דער טעגליכער בלאט'},{k:'ayd',t:'עמוד היומי – דרשו',d:'א עמוד גמרא יעדן טאג'},{k:'mb',t:'משנה ברורה – דרשו',d:'דף היומי בהלכה · פרייטאג און שבת חזרה'},{k:'r3',t:'רמב״ם · ג׳ פרקים',d:'די נייע מחזור פון ט״ז שבט תשפ״ו'},{k:'r1',t:'רמב״ם · פרק אחד',d:'די נייע מחזור פון ט״ז שבט תשפ״ו'},{k:'yer',t:'ירושלמי יומי',d:'תלמוד ירושלמי · לויט די ווילנער דפים'},{k:'teh',t:'תהילים',d:'תהילים לויט די טעג פון חודש'},{k:'par',t:'פרשת השבוע',d:'די סדרה פון דער וואך'},{k:'shn',t:'שנים מקרא',d:'די סדרה פון דער וואך, א עליה יעדן טאג'}];
const STDK=['daf','ayd','mb','r3','r1','yer','teh','shn'];
const STDC={ayd:'var(--acc)',mb:'var(--acc)',r3:'var(--acc)',r1:'var(--acc)'};
const LS='limud-luach.v1';
const store={get(){try{return localStorage.getItem(LS);}catch(e){return null;}},set(v){try{localStorage.setItem(LS,v);}catch(e){}},del(){try{localStorage.removeItem(LS);}catch(e){}}};
function loadState(){let s=DEF();let raw=null;
  try{const m=location.hash.match(/[#&]s=([^&]+)/);if(m){raw=decodeURIComponent(escape(atob(decodeURIComponent(m[1]))));}}catch(e){raw=null;}
  if(!raw)raw=store.get();
  if(raw){try{const o=JSON.parse(raw);s=Object.assign(s,o);s.on=Object.assign(DEF().on,o.on||{});if(!Array.isArray(s.custom))s.custom=[];if(!Array.isArray(s.tests))s.tests=[];}catch(e){}}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s.date))s.date=todayIso();
  return migrate(s);}
let S=loadState();
function save(){store.set(JSON.stringify(S));}

/* ---- paper ---- */
const PAPER={tab:[11,17],letter:[8.5,11],a4:[8.27,11.69],a3:[11.69,16.54],p18:[18,24],p24:[24,36]};
function dims(){const [a,b]=PAPER[S.paper]||PAPER.tab;const nIt=STDK.filter(k=>S.on[k]).length+S.custom.filter(c=>c.on).length;const land=S.orient==='landscape'||(S.orient==='auto'&&S.view!=='tests'&&((S.view==='week'&&(S.style!=='classic'||nIt<=2))||(S.view==='month'&&nIt<=3)));const L=1300,sh=Math.round(L*a/b);const W=land?L:sh,H=land?sh:L;const k=(land?b:a)*96/W;return {W,H,land,k,pw:Math.floor(W*k)-1,ph:Math.floor(H*k)-1,inW:land?b:a,inH:land?a:b};}

/* ---- zmanim (live from Hebcal, local fallback) ---- */
const ZM=new Map(),ZS=new Map();let ZPEND=0;
const zcfg=()=>S.zip+'|'+S.cm+'|'+S.hm;
const SK=new Map();
const NZ=new Map();
function ensureZm(a,b){if(!(S.zman||S.shk||S.netz)||!/^\d{5}$/.test(S.zip))return;const cfg=zcfg();
  const y0=new Date(a),y1=new Date(b);let y=y0.getUTCFullYear(),m=y0.getUTCMonth();
  while(y<y1.getUTCFullYear()||(y===y1.getUTCFullYear()&&m<=y1.getUTCMonth())){
    const ym=y+'-'+pad(m+1),k2='sk|'+S.zip+'|'+ym;
    if((S.shk||S.netz)&&!ZS.has(k2)){ZS.set(k2,'load');ZPEND++;const zip=S.zip;
      const u=`https://www.hebcal.com/zmanim?cfg=json&zip=${zip}&start=${ym}-01&end=${ym}-${pad(new Date(Date.UTC(y,m+1,0)).getUTCDate())}`;
      (async k=>{try{const r=await fetch(u);if(!r.ok)throw 0;const j=await r.json();
        for(const [M,key] of [[SK,'sunset'],[NZ,'sunrise']])for(const [d,v] of Object.entries((j.times&&j.times[key])||{})){const mm=String(v).match(/T(\d{2}):(\d{2})/);if(mm)M.set(zip+'|'+d,((+mm[1])%12||12)+':'+mm[2]);}
        ZS.set(k,'ok');}catch(e){ZS.set(k,'fail');}ZPEND--;render();})(k2);}
    const key=cfg+'|'+ym;if(S.zman&&!ZS.has(key)){ZS.set(key,'load');ZPEND++;
      const s=y+'-'+pad(m+1)+'-01',e=y+'-'+pad(m+1)+'-'+pad(new Date(Date.UTC(y,m+1,0)).getUTCDate());
      const u=`https://www.hebcal.com/hebcal?v=1&cfg=json&c=on&zip=${S.zip}&b=${S.cm}&M=off&m=${S.hm}&maj=off&min=off&mod=off&nx=off&mf=off&ss=off&i=off&start=${s}&end=${e}`;
      (async k=>{try{const r=await fetch(u);if(!r.ok)throw 0;const j=await r.json();
        for(const it of (j.items||[])){const mm=(it.date||'').match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);if(!mm)continue;const kk=cfg+'|'+mm[1];const o=ZM.get(kk)||{};const t12=((+mm[2])%12||12)+':'+mm[3];
          if(it.category==='candles')o.c=t12;else if(it.category==='havdalah')o.h=t12;ZM.set(kk,o);}
        ZS.set(k,'ok');}catch(e){ZS.set(k,'fail');}ZPEND--;render();})(key);}
    m++;if(m>11){m=0;y++;}}}
function zmFor(t){if(!S.zman)return null;const cfg=zcfg();const z=ZM.get(cfg+'|'+iso(t));if(z)return z;
  const d=new Date(t);const st=ZS.get(cfg+'|'+d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1));
  if(st==='fail'&&S.zip==='10952')return zmFallback(t,S.cm,S.hm);return null;}
function nzFor(t){if(!S.netz)return null;const v=NZ.get(S.zip+'|'+iso(t));if(v)return v;const d=new Date(t);
  if(ZS.get('sk|'+S.zip+'|'+d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1))==='fail'&&S.zip==='10952')return '~'+fmt12(Math.ceil(sunriseLocalMin(t)));return null;}
function skFor(t){if(!S.shk)return null;const v=SK.get(S.zip+'|'+iso(t));if(v)return v;const d=new Date(t);
  if(ZS.get('sk|'+S.zip+'|'+d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1))==='fail'&&S.zip==='10952')return '~'+fmt12(sunsetLocalMin(t));return null;}
async function zmReady(){const t0=Date.now();while(ZPEND>0&&Date.now()-t0<6000)await new Promise(r=>setTimeout(r,120));}

/* ---- items ---- */
function counter(c){const s=c.start?fromIso(c.start):fromIso(todayIso());let lastT=s,lastN=0;
  const el=u=>!((c.skipSh&&wday(u)===6)||(c.skipYT&&dayInfo(u).yt));
  return t=>{if(t<s)return -1;if(t<lastT){lastT=s;lastN=0;}for(;lastT<t;lastT+=DAY){if(el(lastT))lastN++;}return el(t)?lastN:-1;};}
function customFn(c){
  if(c.type==='amud'){const s=fromIso(c.start||todayIso());const el=u=>wday(u)<=4&&!(c.skipYT&&dayInfo(u).yt);const cnt=eligCounter(s,el);const base=amudPos(c.am,+c.ad||2,c.as||'a');
    const ms=c.mr&&c.mrStart?fromIso(c.mrStart):0,mbase=c.mr?amudPos(c.mr,+c.mrd||2,c.mrs||'a'):0,mcnt=c.mr?eligCounter(ms||s,el):null;
    return t=>{const n=cnt(t);
      if(el(t)){const a=amudAt(base+n);const r=c.rev!==false?amudAt(base+n-1):null;const mm=mcnt&&t>=ms?amudAt(mbase+mcnt(t)):null;
        const sub=[r&&{lab:'חזרה',v:amStr(r),vs:amd(r.d,r.s),n:r.m},mm&&{lab:'חזרת החודש',v:amStr(mm),vs:amd(mm.d,mm.s),n:mm.m}].filter(Boolean);
        return {m:amStr(a),ms:amd(a.d,a.s),n:a.m,r:r?amStr(r,r.m!==a.m):null,rl:'חזרה',r2:mm?amStr(mm):null,sub};}
      const sun=t-wday(t)*DAY;let k=0;for(let u=sun;u<t;u+=DAY)if(el(u))k++;if(!k||c.rev===false)return null;
      // weekly chazara is split: Friday the first half of the week's amudim, Shabbos the rest (as in the luach)
      const h=Math.floor(k/2),fri=wday(t)===5,i0=fri?base+n-k:base+n-k+h,i1=fri?base+n-k+h-1:base+n-1;if(i1<i0)return null;
      const f=amudAt(i0),l=amudAt(i1);
      const sh=i0===i1?amd(f.d,f.s):f.m===l.m?amd(f.d,f.s)+' – '+amd(l.d,l.s):amStr(f)+' – '+amStr(l);
      const rs=f.m===l.m?f.m+' '+sh:sh;
      return {m:null,r:rs,rsS:sh,n:f.m,rl:'חזרה'};};}
  if(c.type==='mish'){const s=fromIso(c.start||todayIso());const el=u=>!((c.skipSh&&wday(u)===6)||(c.skipYT&&dayInfo(u).yt));const cnt=eligCounter(s,el);const base=mishPos(c.mm,+c.mc||1,+c.mi||1);
    return t=>{if(!el(t))return null;const a=mishAt(base+cnt(t));return {m:mishStr(a),ms:heb(a.c)+' '+heb(a.i),n:a.m,r:null,rl:''};};}
  if(c.type==='fix')return t=>c.days&&c.days[wday(t)]?(c.text||''):null;
  const cnt=counter(c);
  if(c.type==='list'){const arr=(c.lines||'').split('\n').map(x=>x.trim()).filter(Boolean);
    return t=>{const n=cnt(t);if(n<0||!arr.length)return null;if(!c.cycle&&n>=arr.length)return null;return arr[n%arr.length];};}
  const marks=(c.marks||'').split('\n').map(l=>l.trim().match(/^(\d{4}-\d{2}-\d{2}|\d+)\s+(.+)$/)).filter(Boolean).map(m=>({k:m[1],label:m[2]}));
  const fnum=t=>{const n=cnt(t);if(n<0)return null;const per=Math.max(1,+c.per||1);let a=(+c.from||1)+n*per,b=a+per-1;const mx=+c.max||0;
    if(mx){a=((a-1)%mx)+1;b=((b-1)%mx)+1;}const f=x=>c.letters?heb(x):String(x);
    return (c.unit?c.unit+' ':'')+(per>1?f(a)+'–'+f(b):f(a));};
  // a mark matches the day (by date) or the shiur number it starts on
  fnum.markAt=t=>{if(!marks.length)return null;const n=cnt(t);if(n<0)return null;let num=(+c.from||1)+n*Math.max(1,+c.per||1);const mx=+c.max||0;if(mx)num=((num-1)%mx)+1;
    const m=marks.find(x=>x.k===iso(t)||(/^\d+$/.test(x.k)&&+x.k===num));return m?m.label:null;};
  return fnum;}
const ORD=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שביעי'];
const col=()=>'var(--acc)'; // one quiet accent for every limud (no rainbow)
const STDNAME={daf:'דף היומי',ayd:'עמוד היומי – דרשו',mb:'משנה ברורה – דרשו',r3:'רמב״ם · ג׳ פרקים',r1:'רמב״ם · פרק אחד',yer:'ירושלמי יומי',teh:'תהילים',shn:'שנים מקרא',par:'פרשת השבוע'};
/* every custom limud gets a stable key, so the order survives renames */
const cusId=c=>c.pid||c.id||(c.id='c'+Math.random().toString(36).slice(2,8));
function defaultOrder(){return ['daf',...S.custom.filter(c=>c.top).map(cusId),'ayd','mb','r3','r1','yer','teh','shn','par',...S.custom.filter(c=>!c.top).map(cusId)];}
/* the user's order (S.order); limudim added later go at the end */
function orderKeys(){const all=defaultOrder();const o=(S.order||[]).filter(k=>all.includes(k));for(const k of all)if(!o.includes(k))o.push(k);return o;}
const limName=k=>STDNAME[k]||((S.custom.find(c=>cusId(c)===k)||{}).name)||k;
function makeItems(view){
  const cus={};S.custom.forEach((c,i)=>{if(c.on&&!c.todo)cus[cusId(c)]={c,i,fn:customFn(c)};});
  const keys=orderKeys();
  const STDP={
    daf:(t,o)=>{const b=bavli(t);o.push({s:'דף',k:'דף היומי',v:b.m+' '+heb(b.d),vs:heb(b.d),n:b.m,col:col(0)});},
    ayd:(t,o)=>{const a=amudYomi(t);o.push({s:'עמוד',k:'עמוד היומי – דרשו',v:amStr(a),vs:amd(a.d,a.s),n:a.m,col:STDC.ayd});},
    mb:(t,o)=>{const m=mbYomi(t);if(m)o.push({s:m.rev?'מ״ב חז׳':'מ״ב',k:m.rev?'משנה ברורה – דרשו · חזרה':'משנה ברורה – דרשו',v:m.v,vs:m.vs,n:m.n,col:STDC.mb});},
    r3:(t,o)=>{const r=rambam(t,true);o.push({s:'רמב״ם',k:'רמב״ם · ג׳ פרקים',v:r.v,vs:r.vs,n:r.n,col:STDC.r3});},
    r1:(t,o)=>{const r=rambam(t,false);o.push({s:'רמב״ם א׳',k:'רמב״ם · פרק אחד',v:r.v,vs:r.vs,n:r.n,col:STDC.r1});},
    yer:(t,o)=>{const y=yerushalmi(t);o.push({s:'ירו׳',k:'ירושלמי יומי',v:y?y.m+' '+heb(y.d):'אויסגעשטעלט',vs:y?heb(y.d):'אויסגעשטעלט',n:y?y.m:'—',dim:!y,col:col(1)});},
    teh:(t,o)=>o.push({s:'תהילים',k:'תהילים',v:tehillim(t),col:col(2)}),
    shn:(t,o)=>{const p=parshaForDay(t);if(p.names)o.push({s:'ש״מ',k:'שנים מקרא',v:p.names.join('־')+' · '+ORD[wday(t)],col:col(3)});},
    par:(t,o)=>{if(view==='month')return;const p=parshaForDay(t);if(p.names)o.push({s:'פרשה',k:'פרשת השבוע',v:p.names.join('־'),col:col(9)});}};
  function cusOne({c,i,fn},t,o){const v=fn(t);if(!v)return;const mk=fn.markAt?fn.markAt(t):null;const s=c.abbr||c.name.split(' ')[0];
    if(typeof v==='object'){if(!v.m&&!v.r)return;const rv=[v.m&&v.r?v.rl+': '+v.r:null,v.r2?'חזרת החודש: '+v.r2:null].filter(Boolean);
      o.push({s:v.m?s:s+' חז׳',k:v.m?c.name:c.name+' · חזרה',v:v.m||v.r,vs:v.m?v.ms:(v.rsS||v.r),n:v.n,rv,sub:v.m?v.sub:null,col:col(4+i)});}
    else if(mk)o.push({s,k:c.name,v:v,mark:mk,col:col(4+i)});
    else{const m=String(v).match(/^(פרק \S+) (.+)$/); // a list line that starts with its perek: show the perek only when it changes
      o.push(m?{s,k:c.name,v:v,vs:m[2],n:m[1],col:col(4+i)}:{s,k:c.name,v:v,col:col(4+i)});}}
  return t=>{const o=[];
    for(const k of keys){if(STDP[k]){if(S.on[k])STDP[k](t,o);}else if(cus[k])cusOne(cus[k],t,o);}
    // row = the limud itself (a review shares its limud's row in the week table)
    for(const x of o){x.rev=/ · חזרה$/.test(x.k);x.row=x.k.replace(/ · חזרה$/,'');}
    return o;};}
function dayMeta(t){const info=dayInfo(t);let L=S.hol?info.labels.slice():[];if(S.hol&&info.sh)L=shabbosTags(t).concat(L);return {info,L};}

