/* =====================================================================
   SHEET — builds the poster HTML for each view, fits it to the page.
   ===================================================================== */

/* ---- shared pieces ---- */
function head(sub,greg){
  return `<header class="mh"><div class="mh-top"><span class="r">בס״ד</span><span class="mh-shul">${esc(S.shul||'')}</span><span class="l">${esc(greg||'')}</span></div>`
    +`<h1 class="mh-title">${esc(S.title||'')}</h1>${sub?`<div class="mh-sub">${esc(sub)}</div>`:''}<div class="mh-rule"></div></header>`;}
function foot(){return S.foot?`<footer class="sf">${esc(S.foot)}</footer>`:'';}
const TTY={ayd:'עמוד היומי',mb:'משנה ברורה',oth:'אנדערש'};
function testMat(x){if(x.text)return x.text;if(x.ty==='oth'||!x.date||!x.from)return '';const F=fromIso(x.from),T=fromIso(x.date)-DAY;if(T<F)return '';
  if(x.ty==='ayd'){const a=amudYomi(F),b=amudYomi(T);return amStr(a)+' – '+amStr(b,b.m!==a.m);}
  let f=F,l=T;while(wday(f)>=5)f+=DAY;while(wday(l)>=5)l-=DAY;if(l<f)return '';const i=mbIdx(f),j=mbIdx(l);if(i<0||j>=MBR.length)return '';
  const b=MBR[i].split('-')[0],L=MBR[j].split('-');let e=L[1]||L[0];if(e===b)e=undefined;return mbRef(b,e);}
function gregRange(a,b){const x=new Date(a),y=new Date(b);const gy=y.getUTCFullYear();
  if(x.getUTCMonth()===y.getUTCMonth()&&x.getUTCFullYear()===gy)return GM[x.getUTCMonth()]+' '+gy;
  if(x.getUTCFullYear()===gy)return GM[x.getUTCMonth()]+' – '+GM[y.getUTCMonth()]+' '+gy;
  return GM[x.getUTCMonth()]+' '+x.getUTCFullYear()+' – '+GM[y.getUTCMonth()]+' '+gy;}
function monthFirst(t){let u=t;while(hp(u).d>1)u-=DAY;return u;}
function monthLen(first){const m=hp(first).m;let n=0,u=first;while(hp(u).m===m){n++;u+=DAY;}return n;}
function viewRange(){const t=fromIso(S.date);if(S.view==='day'||S.view==='tests')return [t,t];if(S.view==='week'){const s=t-wday(t)*DAY;return [s,s+6*DAY];}const f=monthFirst(t);return [f,f+(monthLen(f)-1)*DAY];}
/* zmanim for one day as data: candles, havdalah (+label), netz, shkiah */
function zmData(t){const z=zmFor(t)||{};return {c:z.c||null,h:z.h||null,hl:wday(t)===6?'מוצאי שבת':'מוצאי יו״ט',n:nzFor(t),s:skFor(t)};}
const rvList=x=>[].concat(x.rv||[]);

/* =========================== MONTH =========================== */
function buildMonth(t){
  const first=monthFirst(t),len=monthLen(first),lead=wday(first),rows=Math.ceil((lead+len)/7);
  const itemsFn=makeItems('month');const hh=hp(first);const lastN={};let cells='';
  for(let i=0;i<rows*7;i++){const k=i-lead;
    if(k<0||k>=len){cells+='<div class="c off"></div>';continue;}
    const u=first+k*DAY;const {info,L}=dayMeta(u);const h=hp(u);const gd=new Date(u).getUTCDate();
    const par=info.sh&&S.on.par?parshaOn(u):null;const z=zmData(u);const its=itemsFn(u);
    for(const x of its){if(x.vs!==undefined){const txt=(lastN[x.k]!==x.n)?x.v:x.vs;lastN[x.k]=x.n;x.v=txt;}
      x.v=x.v.replace(/^חזרה: /,'חז׳ ');x.rv=rvList(x).map(r=>r.replace(/^חזרה: /,'חז׳ ').replace(/^חזרת החודש: /,'חז״ח '));}
    const zm=[z.c&&`<span><i>הדלקה</i>${z.c}</span>`,z.h&&`<span><i>${wday(u)===6?'מוצ״ש':'מוצאי יו״ט'}</i>${z.h}</span>`,z.n&&`<span><i>נץ</i>${z.n}</span>`,z.s&&`<span><i>שקיעה</i>${z.s}</span>`].filter(Boolean).join('');
    cells+=`<div class="c${info.sh?' sh':''}${info.yt?' yt':''}"><div class="c-h"><b class="c-d">${heb(h.d)}</b>${S.greg?`<span class="c-g">${k===0||gd===1?gregShort(u):gd}</span>`:''}</div>`
      +(L.length?`<div class="c-hl">${esc(L.join(' · '))}</div>`:'')
      +(par?`<div class="c-pr">${esc(par.join('־'))}</div>`:'')
      +(zm?`<div class="c-zm">${zm}</div>`:'')
      +(its.length?`<table class="c-it">${its.map(x=>(x.mark?`<tr><th></th><td class="mk">${esc(x.mark)}</td></tr>`:'')+`<tr><th>${esc(x.s)}</th><td${x.dim?' class="dim"':''}>${esc(x.v)}</td></tr>`+x.rv.map(r=>`<tr><th></th><td class="rv">${esc(r)}</td></tr>`).join('')).join('')}</table>`:'')
      +'</div>';}
  const sub=S.sub||(HM[hh.m]+' '+hebYear(hh.y));
  return head(sub,S.greg?gregRange(first,first+(len-1)*DAY):'')
    +`<div class="sh-body"><div class="mo"><div class="mo-head">${WDS.map(x=>`<div>${x}</div>`).join('')}</div><div class="mo-grid" style="grid-template-rows:repeat(${rows},1fr);--f:11px">${cells}</div></div></div>`+foot();}

/* =========================== WEEK: a table, limudim down the side, days across =========================== */
function buildWeek(t){
  const sun=t-wday(t)*DAY,sat=sun+6*DAY,itemsFn=makeItems('week');
  const days=Array.from({length:7},(_,i)=>{const u=sun+i*DAY,m=dayMeta(u);return {u,info:m.info,L:m.L,h:hp(u),its:itemsFn(u).filter(x=>x.row!=='פרשת השבוע'),z:zmData(u)};});
  // cells per row key: a limud's own row, plus a sub-row for each kind of review it has (חזרה, חזרת החודש)
  for(const d of days){d.cell={};for(const x of d.its){d.cell[x.row]=x;for(const y of x.sub||[])d.cell[x.row+'|'+y.lab]=y;}}
  const keys=[];for(const d of days){let prev=-1;for(const x of d.its)for(const k of [x.row,...(x.sub||[]).map(y=>x.row+'|'+y.lab)]){let i=keys.indexOf(k);if(i<0){keys.splice(prev+1,0,k);i=prev+1;}prev=i;}}
  const cls=d=>(d.info.sh?'sh':d.info.yt?'yt':'');
  const ca=(d,extra)=>{const c=[cls(d),extra].filter(Boolean).join(' ');return c?` class="${c}"`:'';};
  let thead=`<tr class="dn"><th></th>${days.map((d,i)=>`<th${ca(d)}>${WD[i]}</th>`).join('')}</tr>`;
  thead+=`<tr class="dd"><th></th>${days.map((d,i)=>{const par=d.info.sh&&S.on.par?parshaOn(d.u):null;const showM=i===0||d.h.m!==days[i-1].h.m;
    return `<th${ca(d)}><b>${heb(d.h.d)}</b>${showM?`<span>${HM[d.h.m]}</span>`:''}${S.greg?`<span>${gregShort(d.u)}</span>`:''}${d.L.length?`<em>${esc(d.L.join(' · '))}</em>`:''}${par?`<strong>${esc(par.join('־'))}</strong>`:''}</th>`;}).join('')}</tr>`;
  let tbody='';
  for(const k of keys){const [row,lab]=k.split('|');let prevN=null;
    tbody+=`<tr${lab?' class="sub"':''}><th>${esc(lab||row)}</th>${days.map(d=>{const x=d.cell[k];if(!x){prevN=null;return `<td${ca(d)}></td>`;}
      const v=(prevN===x.n&&x.vs!==undefined)?x.vs:x.v;prevN=x.n;
      return `<td${ca(d,x.dim?'dim':'')}>${x.mark?`<span class="mk">${esc(x.mark)}</span>`:''}${x.rev?'<span class="tag">חזרה</span>':''}${esc(v)}</td>`;}).join('')}</tr>`;}
  // zmanim: one row each
  const zr=[['הדלקת נרות',d=>d.z.c],[days.some(d=>d.z.h&&wday(d.u)!==6)?'מוצאי שבת / יו״ט':'מוצאי שבת',d=>d.z.h],['נץ החמה',d=>d.z.n],['שקיעה',d=>d.z.s]].filter(([,f])=>days.some(f));
  tbody+=zr.map(([lab,f],i)=>`<tr class="zt${i?'':' zfirst'}"><th>${lab}</th>${days.map(d=>`<td${ca(d)}>${f(d)||''}</td>`).join('')}</tr>`).join('');
  const he=hp(sat),p=parshaOn(sat);
  const sub=S.sub||(`${hebDate(sun)} – ${hebDate(sat)} ${hebYear(he.y)}`+(p&&S.on.par?` · פרשת ${p.join('־')}`:''));
  return head(sub,S.greg?`${gregShort(sun)} – ${gregFull(sat)}`:'')
    +`<div class="sh-body"><div class="wtw" style="flex:1;min-height:0"><table class="wt"><colgroup><col class="lc">${'<col>'.repeat(7)}</colgroup><thead>${thead}</thead><tbody>${tbody||'<tr><th></th><td colspan="7"></td></tr>'}</tbody></table></div></div>`+foot();}

/* =========================== DAY =========================== */
function buildDay(t){
  const {info,L}=dayMeta(t);const h=hp(t);const its=makeItems('day')(t);const z=zmData(t);
  const zm=[z.c&&['הדלקת נרות',z.c],z.h&&[z.hl,z.h],z.n&&['נץ החמה',z.n],z.s&&['שקיעה',z.s]].filter(Boolean);
  const rows=its.map(x=>`<tr><th>${esc(x.row)}${x.rev?' · חזרה':''}</th><td${x.dim?' class="dim"':''}>${x.mark?`<span class="mk">${esc(x.mark)}</span>`:''}<b>${esc(x.v)}</b>${rvList(x).map(r=>`<span class="rv">${esc(r)}</span>`).join('')}</td></tr>`).join('');
  return head(S.sub||'',S.greg?gregFull(t):'')
    +`<div class="sh-body"><div class="dv"><div class="dv-hero"><div class="dv-w">${WD[info.wd]}</div><div class="dv-d">${heb(h.d)} ${HM[h.m]}</div><div class="dv-y">${hebYear(h.y)}${S.greg?' · '+gregFull(t):''}</div>${L.length?`<div class="dv-tags">${esc(L.join(' · '))}</div>`:''}</div>`
    +`<table class="dv-t">${rows||'<tr><th>—</th><td><b>קיין לימודים נישט אויסגעקליבן</b></td></tr>'}</table>`
    +(zm.length?`<div class="dv-zm">${zm.map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join('')}</div>`:'')+'</div></div>'+foot();}

/* =========================== TESTS: every test from the chosen date on =========================== */
const TESTS_PER_PAGE=3; // test dates per tests sheet
function testGroups(t){const ts=S.tests.filter(x=>x.date&&fromIso(x.date)>=t).sort((p,q)=>p.date<q.date?-1:p.date>q.date?1:0);
  const by=[];for(const x of ts){const g=by[by.length-1];if(g&&g.date===x.date)g.list.push(x);else by.push({date:x.date,list:[x]});}return by;}
function buildTestSheet(t){const by=testGroups(t).slice(0,TESTS_PER_PAGE);
  const rows=by.map(g=>{const u=fromIso(g.date);return g.list.map((x,j)=>`<tr${j?'':' class="g"'}>${j?'':`<td class="td" rowspan="${g.list.length}"><b>${WDS[wday(u)]} ${hebDate(u)}</b>${S.greg?`<span>${gregFull(u)}</span>`:''}</td>`}<td class="tn">${esc(x.ty==='oth'?(x.name||'מבחן'):TTY[x.ty])}</td><td class="tm">${esc(testMat(x)||'—').replace(/\n/g,'<br>')}</td></tr>`).join('');}).join('');
  const last=by.length?fromIso(by[by.length-1].date):t;
  return head(S.sub||'מבחנים · '+hebDate(by.length?fromIso(by[0].date):t)+' – '+hebDateY(last),S.greg&&by.length?gregShort(fromIso(by[0].date))+' – '+gregFull(last):'')
    +`<div class="sh-body">${rows?`<table class="tt"><thead><tr><th>טאג</th><th>לימוד</th><th>חומר</th></tr></thead><tbody>${rows}</tbody></table>`:'<p class="tt-none">קיין מבחנים פון דעם דאטום און ווייטער — לייג צו אין „מבחנים“.</p>'}</div>`+foot();}

/* =========================== render & fit =========================== */
const inner=$('#stageInner'),wrap=$('#stageWrap'),stage=$('#stage');
function buildBody(t){if(S.style==='classic')return S.view==='month'?kMonth(t):S.view==='week'?kWeek(t):S.view==='tests'?kTests(t):kDay(t);
  return S.view==='month'?buildMonth(t):S.view==='week'?buildWeek(t):S.view==='tests'?buildTestSheet(t):buildDay(t);}
function render(){
  const D=dims();const {W,H}=D;const t=fromIso(S.date);
  const [ra,rb]=viewRange();ensureZm(ra,rb);
  inner.innerHTML=`<div class="sheet${S.style==='classic'?' classic':''}" data-theme="${S.theme}" style="width:${W}px;height:${H}px">${buildBody(t)}</div>`;
  fitSheet(inner,H);
  $('#pageStyle').textContent=`@page{size:${D.inW}in ${D.inH}in;margin:0}@media print{#stageWrap{width:${D.pw}px!important;height:${D.ph}px!important}#stageInner{transform:scale(${D.k})!important;position:absolute!important;top:0!important;left:0!important}}`;
  fit();}
/* largest value of a CSS variable in [lo,hi] for which bad() is false (binary search) */
function fitVar(el,name,lo,hi,unit,bad){const set=v=>el.style.setProperty(name,v.toFixed(3)+unit);
  set(hi);if(!bad())return hi;set(lo);if(bad())return lo;
  for(let i=0;i<9;i++){const m=(lo+hi)/2;set(m);if(bad())hi=m;else lo=m;}set(lo);return lo;}
function fitSheet(root,H){if(S.style==='classic')return kFit(root,H);const sh=root.querySelector('.sheet');const over=()=>sh.scrollHeight>H+1;
  const mg=root.querySelector('.mo-grid');
  if(mg){const cs=[...mg.children];fitVar(mg,'--f',5.5,15,'px',()=>over()||cs.some(e=>e.scrollHeight>e.clientHeight+1));}
  const wt=root.querySelector('.wt');
  if(wt){const box=wt.parentElement,cells=[...wt.querySelectorAll('td,th')];fitVar(wt,'--s',.4,1.4,'',()=>over()||wt.offsetHeight>box.clientHeight+1||cells.some(e=>e.scrollWidth>e.clientWidth+1));}
  const dv=root.querySelector('.dv');if(dv)fitVar(dv,'--ds',.4,1.15,'',over);
  const tt=root.querySelector('.tt');if(tt)fitVar(tt,'--ts',.5,1.1,'',over);}
function fit(){const {W,H}=dims();const avail=Math.max(200,stage.clientWidth-(stage.clientWidth<500?12:28));const sc=Math.min(1,avail/W);
  wrap.style.width=(W*sc)+'px';wrap.style.height=(H*sc)+'px';inner.style.transform=`scale(${sc})`;}
if('ResizeObserver' in window)new ResizeObserver(()=>fit()).observe(stage);else addEventListener('resize',fit);
