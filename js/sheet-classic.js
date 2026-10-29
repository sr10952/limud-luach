/* =====================================================================
   SHEET — classic style builders (framed poster, navy day headers,
   a colour per limud). Uses the same data as js/sheet.js.
   ===================================================================== */
const K_PAL=['#b3402a','#1f6aa5','#2f7d4f','#7d4a9c','#b97b10','#12807f','#a83d6b','#5f6f1f','#8a4b2d','#36548f'];
/* one fixed colour per limud, in the order the limudim appear */
function kColors(){const names=orderKeys().map(limName);
  return row=>{const i=names.indexOf(row);return K_PAL[(i<0?names.length:i)%K_PAL.length];};}
function kZm(t){const z=zmData(t),o=[];if(z.c)o.push(['הדלקת נרות '+z.c,0]);if(z.h)o.push([(wday(t)===6?'מוצאי שבת ':'מוצאי יום טוב ')+z.h,0]);if(z.n)o.push(['נץ '+z.n,1]);if(z.s)o.push(['שקיעה '+z.s,1]);return o;}
const kZmHtml=t=>kZm(t).map(([s,sk])=>`<div class="k-zm${sk?' sk':''}">${esc(s)}</div>`).join('');
function kHead(sub,sub2){return `<div class="k-top"><div class="k-bh">בס״ד</div>${S.shul?`<div class="k-shul">${esc(S.shul)}</div>`:''}<h1 class="k-title">${esc(S.title||'')}</h1>${sub?`<div class="k-sub">${esc(sub)}</div>`:''}${sub2?`<div class="k-sub2">${esc(sub2)}</div>`:''}<div class="k-div"><i></i></div></div>`;}
const kFoot=()=>S.foot?`<div class="k-foot">${esc(S.foot)}</div>`:'';

function kMonth(t){
  const first=monthFirst(t),len=monthLen(first),lead=wday(first),rows=Math.ceil((lead+len)/7);
  const itemsFn=makeItems('month'),hh=hp(first),colr=kColors(),lastN={};let cells='';
  for(let i=0;i<rows*7;i++){const k=i-lead;
    if(k<0||k>=len){cells+='<div class="k-cell off"></div>';continue;}
    const u=first+k*DAY;const {info,L}=dayMeta(u);const h=hp(u);const par=info.sh&&S.on.par?parshaOn(u):null;const its=itemsFn(u);
    for(const x of its){if(x.vs!==undefined){const txt=(lastN[x.k]!==x.n)?x.v:x.vs;lastN[x.k]=x.n;x.v=txt;}
      x.v=x.v.replace(/^חזרה: /,'חז׳ ');x.rv=rvList(x).map(r=>r.replace(/^חזרה: /,'חז׳ ').replace(/^חזרת החודש: /,'חז״ח '));}
    cells+=`<div class="k-cell${info.sh?' sh':''}${info.yt?' yt':''}"><div class="k-cn"><b>${heb(h.d)}</b>${S.greg?`<span>${gregShort(u)}</span>`:''}</div>`
      +(L.length?`<div class="k-hl">${esc(L.join(' · '))}</div>`:'')+(par?`<div class="k-pr">${esc(par.join('־'))}</div>`:'')+kZmHtml(u)
      +(its.length?`<table class="k-its">${its.map(x=>{const c=colr(x.row);return (x.mark?`<tr style="--c:${c}"><th></th><td class="mk">${esc(x.mark)}</td></tr>`:'')
        +`<tr style="--c:${c}"><th>${esc(x.s)}</th><td${x.dim?' class="dim"':''}>${esc(x.v)}</td></tr>`+x.rv.map(r=>`<tr><th></th><td class="rv">${esc(r)}</td></tr>`).join('');}).join('')}</table>`:'')+'</div>';}
  return kHead(S.sub||(HM[hh.m]+' '+hebYear(hh.y)),S.greg?gregRange(first,first+(len-1)*DAY):'')
    +`<div class="k-body"><div class="k-mo-head">${WDS.map(x=>`<div>${x}</div>`).join('')}</div><div class="k-mo-grid" style="grid-template-rows:repeat(${rows},1fr);--f:11px">${cells}</div></div>`+kFoot();}

function kWeek(t){
  const sun=t-wday(t)*DAY,sat=sun+6*DAY,itemsFn=makeItems('week'),colr=kColors();let cols='';
  for(let i=0;i<7;i++){const u=sun+i*DAY;const {info,L}=dayMeta(u);const h=hp(u);const its=itemsFn(u).filter(x=>x.row!=='פרשת השבוע');const par=info.sh&&S.on.par?parshaOn(u):null;
    cols+=`<div class="k-wd${info.sh?' sh':''}${info.yt?' yt':''}"><div class="k-wd-h">${WD[i]}</div><div class="k-wd-d"><b>${heb(h.d)}</b><span>${HM[h.m]}${S.greg?' · '+gregShort(u):''}</span>${L.length?`<em>${esc(L.join(' · '))}</em>`:''}${par?`<em>${esc(par.join('־'))}</em>`:''}${kZmHtml(u)}</div><div class="k-wd-i">`
      +its.map(x=>`<div class="k-wi${x.dim?' dim':''}" style="--c:${colr(x.row)}"><small>${esc(x.k)}</small>${x.mark?`<em class="mk">${esc(x.mark)}</em>`:''}<b>${esc(x.v)}</b>${rvList(x).map(r=>`<em class="rv">${esc(r)}</em>`).join('')}</div>`).join('')+'</div></div>';}
  const he=hp(sat),p=parshaOn(sat);
  const sub=S.sub||(`${hebDate(sun)} – ${hebDate(sat)} ${hebYear(he.y)}`+(p&&S.on.par?` · פרשת ${p.join('־')}`:''));
  return kHead(sub,S.greg?`${gregShort(sun)} – ${gregFull(sat)}`:'')+`<div class="k-body"><div class="k-wk${dims().land?'':' rows'}">${cols}</div></div>`+kFoot();}

function kDay(t){
  const {info,L}=dayMeta(t);const h=hp(t);const its=makeItems('day')(t);const colr=kColors();
  const tags=L.concat(kZm(t).map(x=>x[0])).map(x=>`<span class="k-tag">${esc(x)}</span>`).join('');
  return kHead(S.sub||'','')+`<div class="k-body"><div class="k-dy"><div class="k-dy-hero"><div class="w">${WD[info.wd]}</div><div class="d">${heb(h.d)} ${HM[h.m]}</div><div class="g">${hebYear(h.y)}${S.greg?' · '+gregFull(t):''}</div>${tags?`<div class="k-tags">${tags}</div>`:''}</div>`
    +`<div class="k-dy-list">${its.map(x=>`<div class="k-dr${x.dim?' dim':''}" style="--c:${colr(x.row)}"><small>${esc(x.k)}</small>${x.mark?`<em class="mk">${esc(x.mark)}</em>`:''}<b>${esc(x.v)}</b>${rvList(x).map(r=>`<em class="rv">${esc(r)}</em>`).join('')}</div>`).join('')||'<div class="k-dr" style="--c:#999"><small>קיין לימודים נישט אויסגעקליבן</small><b>—</b></div>'}</div></div></div>`+kFoot();}

function kTests(t){const by=testGroups(t).slice(0,TESTS_PER_PAGE);
  const rows=by.map(g=>{const u=fromIso(g.date);return g.list.map((x,j)=>`<tr${j?'':' class="g"'}>${j?'':`<td class="td" rowspan="${g.list.length}"><b>${WDS[wday(u)]} ${hebDate(u)}</b>${S.greg?`<span>${gregFull(u)}</span>`:''}</td>`}<td class="tn">${esc(x.ty==='oth'?(x.name||'מבחן'):TTY[x.ty])}</td><td class="tm">${esc(testMat(x)||'—').replace(/\n/g,'<br>')}</td></tr>`).join('');}).join('');
  const last=by.length?fromIso(by[by.length-1].date):t;
  return kHead(S.sub||'מבחנים',by.length?hebDate(fromIso(by[0].date))+' – '+hebDateY(last):'')
    +`<div class="k-body"><div class="k-tt-wrap">${rows?`<table class="k-tt"><thead><tr><th>טאג</th><th>לימוד</th><th>חומר</th></tr></thead><tbody>${rows}</tbody></table>`:'<p class="k-tt-none">קיין מבחנים פון דעם דאטום און ווייטער — לייג צו אין „מבחנים“.</p>'}</div></div>`+kFoot();}

/* shrink text until everything fits (classic) */
function kFit(root,H){const sh=root.querySelector('.sheet');const over=()=>sh.scrollHeight>H+1;
  const mg=root.querySelector('.k-mo-grid');if(mg){const cs=[...mg.children];fitVar(mg,'--f',5.5,14,'px',()=>over()||cs.some(e=>e.scrollHeight>e.clientHeight+1));}
  const dl=root.querySelector('.k-dy-list');if(dl)fitVar(dl,'--ds',.4,1,'',over);
  const tw=root.querySelector('.k-tt-wrap');if(tw)fitVar(tw,'--ts',.5,1,'',over);
  const wk=root.querySelector('.k-wk');if(!wk)return;
  const dd=[...wk.querySelectorAll('.k-wd-d')];fitVar(wk,'--d',.5,1,'',()=>dd.some(e=>e.scrollHeight>e.clientHeight+1));
  const bad=()=>over()||[...wk.querySelectorAll('.k-wd,.k-wd-i,.k-wi')].some(e=>e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1);
  if(!wk.classList.contains('rows')){fitVar(wk,'--s',.4,1.2,'',bad);return;}
  // rows layout: try 3 and 4 boxes per row and keep whichever lets the text stay larger
  wk.style.setProperty('--cols',3);const a=fitVar(wk,'--s',.4,1.2,'',bad);
  wk.style.setProperty('--cols',4);const b=fitVar(wk,'--s',.4,1.2,'',bad);
  if(a>=b){wk.style.setProperty('--cols',3);fitVar(wk,'--s',.4,1.2,'',bad);}}
