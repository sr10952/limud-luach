/* ---- controls ---- */
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2800);}
const D1=n=>n.replace('זונטאג','א׳').replace('מאנטאג','ב׳').replace('דינסטאג','ג׳').replace('מיטוואך','ד׳').replace('דאנערשטאג','ה׳').replace('פרייטאג','ו׳').replace('שבת','ש׳');
function sync(){
  $$('#segView button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===S.view)));
  $('#inDate').value=S.date;$('#inPages').value=S.pages||1;$('#lblPages').textContent={day:'וויפיל טעג',week:'וויפיל וואכן',month:'וויפיל חדשים',tests:'וויפיל בלעטער'}[S.view]+' צו דרוקן אין איין PDF';
  const t=fromIso(S.date);$('#hdLabel').textContent=hebDateY(t);$('#hdNote').textContent=WD[wday(t)]+' · '+gregFull(t);
  const nm={day:['נעכטן','מארגן'],week:['פריערדיגע וואך','קומענדיגע וואך'],month:['פריערדיגער חודש','קומענדיגער חודש'],tests:['פריערדיגע מבחנים','קומענדיגע מבחנים']}[S.view];
  $('#lblPrev').textContent=nm[0];$('#lblNext').textContent=nm[1];
  $('#inShul').value=S.shul;$('#inTitle').value=S.title;$('#inSub').value=S.sub;$('#inFoot').value=S.foot;$('#inPaper').value=S.paper;$('#inStyle').value=S.style||'modern';$('#inOrient').value=S.orient;$('#inCm').value=S.cm;$('#inHm').value=S.hm;$('#inZip').value=S.zip;$('#zmBox').hidden=!(S.zman||S.shk||S.netz);$('#tgNetz').checked=!!S.netz;
  $$('#swTheme .sw').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===S.theme)));
  $('#tgGreg').checked=S.greg;$('#tgHol').checked=S.hol;$('#tgZman').checked=S.zman;$('#tgShk').checked=S.shk;
  $$('#limStd input[data-k]').forEach(i=>i.checked=!!S.on[i.dataset.k]);
}
const CHK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const ARR=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${d<0?'M6 15l6-6 6 6':'M6 9l6 6 6-6'}"/></svg>`;
const ICO_EDIT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>';
const ICO_DEL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
/* all limudim in one list, in the order they print; ▲▼ move them */
function buildLim(){const keys=orderKeys(),box=$('#limStd');$('#limCus').innerHTML='';$('#cusEmpty').style.display='none';
  const mv=(k,p)=>`<button type="button" class="ib" data-mv="-1" data-key="${k}" title="ארויף" aria-label="ארויף" ${p===0?'disabled':''}>${ARR(-1)}</button><button type="button" class="ib" data-mv="1" data-key="${k}" title="אראפ" aria-label="אראפ" ${p===keys.length-1?'disabled':''}>${ARR(1)}</button>`;
  box.innerHTML=keys.map((k,p)=>{const s=STD.find(x=>x.k===k);
    if(s)return `<label class="opt"><input type="checkbox" data-k="${k}" ${S.on[k]?'checked':''}><span class="chk">${CHK}</span><span class="t"><b>${s.t}</b><span>${s.d}</span></span><span class="acts">${mv(k,p)}</span></label>`;
    const i=S.custom.findIndex(c=>cusId(c)===k),c=S.custom[i];
    return `<label class="opt" data-ci="${i}"><input type="checkbox" data-i="${i}" ${c.on?'checked':''} ${c.todo?'disabled':''}><span class="chk">${CHK}</span><span class="t"><b>${esc(c.name)}</b><span>${esc(summary(c))}</span></span><span class="acts">${mv(k,p)}<button type="button" class="ib" data-edit="${i}" title="ענדערן" aria-label="ענדערן">${ICO_EDIT}</button><button type="button" class="ib" data-del="${i}" title="אראפנעמען" aria-label="אראפנעמען">${ICO_DEL}</button></span></label>`;}).join('');
  $$('input[data-k]',box).forEach(i=>i.addEventListener('change',()=>{S.on[i.dataset.k]=i.checked;save();render();}));
  $$('input[data-i]',box).forEach(i=>i.addEventListener('change',()=>{S.custom[+i.dataset.i].on=i.checked;save();render();}));
  $$('.opt[data-ci]',box).forEach(l=>{const i=+l.dataset.ci;if(S.custom[i].todo)l.addEventListener('click',e=>{if(e.target.closest('[data-del],[data-mv]'))return;e.preventDefault();openItem(i);});});
  $$('[data-mv]',box).forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const o=orderKeys(),p=o.indexOf(b.dataset.key),q=p+(+b.dataset.mv);if(q<0||q>=o.length)return;
    [o[p],o[q]]=[o[q],o[p]];S.order=o;save();buildLim();render();}));
  $$('[data-edit]',box).forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openItem(+b.dataset.edit);}));
  $$('[data-del]',box).forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();S.custom.splice(+b.dataset.del,1);save();buildLim();render();}));}
const buildStd=buildLim,buildCus=buildLim;
function summary(c){if(c.type==='amud')return c.am+' '+amd(+c.ad||2,c.as)+' · '+(c.start?gregShort(fromIso(c.start)):'')+(c.rev!==false?' · מיט חזרה':'');
  if(c.type==='mish')return c.mm+' '+heb(+c.mc||1)+' '+heb(+c.mi||1)+' · '+(c.start?gregShort(fromIso(c.start)):'');
  if(c.todo)return 'דארף אויפשטעלן — דריק ✎ און שרייב אריין וויאזוי עס גייט';if(c.type==='fix'){const ds=(c.days||[]).map((x,i)=>x?D1(WDS[i]):'').filter(Boolean);return (c.text||'')+' · '+ds.join(' ');}
  if(c.type==='list')return ((c.lines||'').split('\n').filter(x=>x.trim()).length)+' שורות · פון '+(c.start?gregShort(fromIso(c.start)):'');
  return 'פון '+(c.from||1)+(c.unit?' '+c.unit:'')+' · '+(c.per||1)+' יעדן טאג';}

/* ---- custom item dialog ---- */
const dlg=$('#dlgItem');let editIdx=-1,fDays=[false,true,true,true,true,true,false];
function buildChips(){$('#fDays').innerHTML=WDS.map((n,i)=>`<button type="button" class="chip" data-d="${i}" aria-pressed="${!!fDays[i]}">${D1(n)}</button>`).join('');
  $$('#fDays .chip').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.d;fDays[i]=!fDays[i];b.setAttribute('aria-pressed',String(fDays[i]));}));}
function typeUI(){const ty=$('#fType').value;$('#fAmud').hidden=ty!=='amud';$('#fMish').hidden=ty!=='mish';$('#lblSkipSh').hidden=ty==='amud';$('#fNum').hidden=ty!=='num';$('#fList').hidden=ty!=='list';$('#fFix').hidden=ty!=='fix';$('#fStartWrap').hidden=ty==='fix';}
function openItem(i){editIdx=i;const c=i>=0?S.custom[i]:{type:'num',name:'',start:S.date,from:1,per:1,unit:'',max:'',letters:false,lines:'',cycle:true,text:'',days:[false,true,true,true,true,true,false],skipSh:false,skipYT:false};
  $('#dlgTitle').textContent=i>=0?'ענדער דעם לימוד':'א נייער לימוד';
  $('#fName').value=c.name;$('#fAbbr').value=c.abbr||'';$('#fType').value=c.type;$('#fFrom').value=c.from||1;$('#fPer').value=c.per||1;$('#fUnit').value=c.unit||'';$('#fMax').value=c.max||'';$('#fLetters').checked=!!c.letters;$('#fMarks').value=c.marks||'';
  $('#fLines').value=c.lines||'';$('#fCycle').checked=c.cycle!==false;$('#fText').value=c.text||'';fDays=(c.days||[]).slice();while(fDays.length<7)fDays.push(false);
  $('#fMr').checked=!!c.mr;$('#fMrBox').hidden=!c.mr;$('#fMrm').value=c.mr||c.am||'עירובין';$('#fMrd').value=c.mrd||2;$('#fMrs').value=c.mrs||'a';$('#fMrStart').value=c.mrStart||c.start||S.date;
  $('#fAm').value=c.am||'עירובין';$('#fAd').value=c.ad||2;$('#fAs').value=c.as||'a';$('#fRev').checked=c.rev!==false;$('#fMm').value=c.mm||'ברכות';$('#fMc').value=c.mc||1;$('#fMi').value=c.mi||1;
  $('#fStart').value=c.start||S.date;$('#fSkipSh').checked=!!c.skipSh;$('#fSkipYT').checked=!!c.skipYT;buildChips();typeUI();
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');setTimeout(()=>$('#fName').focus(),50);}
$('#fAm').innerHTML=AMUD.map(x=>`<option>${x[0]}</option>`).join('');$('#fMrm').innerHTML=$('#fAm').innerHTML;
$('#fMr').addEventListener('change',e=>{$('#fMrBox').hidden=!e.target.checked;});$('#fMm').innerHTML=MISH.map(x=>`<option>${x[0]}</option>`).join('');
$('#fType').addEventListener('change',typeUI);
$('#fCancel').addEventListener('click',()=>dlg.close());
$('#frmItem').addEventListener('submit',e=>{e.preventDefault();const wasTodo=editIdx>=0&&S.custom[editIdx].todo;
  const ty=$('#fType').value;const c={on:true,type:ty,name:($('#fName').value||'').trim()||'מיין לימוד',abbr:($('#fAbbr').value||'').trim(),start:$('#fStart').value||S.date,from:Math.max(1,parseInt($('#fFrom').value)||1),per:Math.max(1,parseInt($('#fPer').value)||1),unit:($('#fUnit').value||'').trim(),max:parseInt($('#fMax').value)||'',letters:$('#fLetters').checked,marks:$('#fMarks').value,lines:$('#fLines').value,cycle:$('#fCycle').checked,text:($('#fText').value||'').trim(),days:fDays.slice(),skipSh:$('#fSkipSh').checked,skipYT:$('#fSkipYT').checked,am:$('#fAm').value,ad:Math.max(2,parseInt($('#fAd').value)||2),as:$('#fAs').value,rev:$('#fRev').checked,mm:$('#fMm').value,mc:Math.max(1,parseInt($('#fMc').value)||1),mi:Math.max(1,parseInt($('#fMi').value)||1)};
  if(ty==='amud'){const r=AMUD.find(x=>x[0]===c.am);if(r&&c.ad>r[1])c.ad=r[1];}
  if(ty==='mish'){const r=MISH.find(x=>x[0]===c.mm);if(r){c.mc=Math.min(c.mc,r[1].length);c.mi=Math.min(c.mi,r[1][c.mc-1]);}}
  if(ty==='list'&&!c.lines.trim()){toast('שרייב אריין אמווייניגסטנס איין שורה');return;}
  if(ty==='fix'&&!c.text){toast('שרייב אריין דעם טעקסט');return;}
  if(ty==='amud'&&$('#fMr').checked)Object.assign(c,{mr:$('#fMrm').value,mrd:Math.max(2,parseInt($('#fMrd').value)||2),mrs:$('#fMrs').value,mrStart:$('#fMrStart').value||c.start});
  if(editIdx>=0){const o=S.custom[editIdx];if(o.pid)c.pid=o.pid;if(o.top)c.top=true;c.on=wasTodo?true:o.on;S.custom[editIdx]=c;}else S.custom.push(c);
  save();buildCus();render();dlg.close();});
$('#btnAdd').addEventListener('click',()=>openItem(-1));

/* ---- tests ---- */
function buildTests(){const box=$('#tstList');
  box.innerHTML=S.tests.map((x,i)=>`<div class="tst" data-i="${i}"><div class="two">
    <div><label class="f">לימוד</label><select class="in" data-f="ty">${Object.entries(TTY).map(([k,v])=>`<option value="${k}"${x.ty===k?' selected':''}>${v}</option>`).join('')}</select></div>
    <div><label class="f">דאטום פון מבחן</label><input class="in" type="date" data-f="date" value="${esc(x.date||'')}"></div>
    ${x.ty==='oth'?`<div><label class="f">נאמען</label><input class="in" data-f="name" maxlength="30" value="${esc(x.name||'')}" placeholder="למשל: מבחן חודשי"></div>`:`<div><label class="f">חומר פון</label><input class="in" type="date" data-f="from" value="${esc(x.from||'')}"></div>`}
    <div><label class="f">חומר${x.ty==='oth'?'':' <span style="font-weight:400;color:var(--muted)">(ליידיג = אויטאמאטיש)</span>'}</label><input class="in" data-f="text" maxlength="60" value="${esc(x.text||'')}" placeholder="${esc(x.ty==='oth'?'':testMat(Object.assign({},x,{text:''})))}"></div>
  </div><div class="acts2"><button class="btn sm danger" type="button" data-tdel>אראפנעמען</button></div></div>`).join('');
  $$('.tst',box).forEach(row=>{const x=S.tests[+row.dataset.i];
    $$('[data-f]',row).forEach(el=>el.addEventListener(el.dataset.f==='text'||el.dataset.f==='name'?'input':'change',()=>{x[el.dataset.f]=el.value;save();render();if(!['text','name'].includes(el.dataset.f))buildTests();}));
    $('[data-tdel]',row).addEventListener('click',()=>{S.tests.splice(+row.dataset.i,1);save();buildTests();render();});});}
$('#btnTest').addEventListener('click',()=>{let d=fromIso(todayIso());do d+=DAY;while(wday(d)!==0);
  const prev=S.tests.filter(x=>x.ty==='ayd'&&x.date&&x.date<iso(d)).map(x=>x.date).sort().pop();
  S.tests.push({ty:'ayd',date:iso(d),from:prev||iso(d-28*DAY),name:'',text:''});save();buildTests();render();});

/* ---- navigation ---- */
function shift(dir){const t=fromIso(S.date);let n;
  if(S.view==='day')n=t+dir*DAY;
  else if(S.view==='week')n=t+dir*7*DAY;
  else if(S.view==='tests'){if(dir>0)n=fromIso(stepDate(S.date,1));else{const past=S.tests.filter(x=>x.date&&fromIso(x.date)<t).map(x=>x.date).sort();const ds=[...new Set(past)];n=ds.length?fromIso(ds[Math.max(0,ds.length-TESTS_PER_PAGE)]):t-28*DAY;}}
  else{const f=monthFirst(t);n=dir>0?f+monthLen(f)*DAY:monthFirst(f-DAY);}
  S.date=iso(n);save();sync();render();}
$('#navPrev').addEventListener('click',()=>shift(-1));$('#navNext').addEventListener('click',()=>shift(1));
$('#navToday').addEventListener('click',()=>{S.date=todayIso();save();sync();render();});
$('#inPages').addEventListener('change',e=>{S.pages=Math.max(1,Math.min(52,parseInt(e.target.value)||1));save();sync();});
$('#inDate').addEventListener('change',e=>{if(/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)){S.date=e.target.value;save();sync();render();}});
$$('#segView button').forEach(b=>b.addEventListener('click',()=>{S.view=b.dataset.v;save();sync();render();}));
$('#inShul').addEventListener('input',e=>{S.shul=e.target.value;save();render();});
$('#inFoot').addEventListener('input',e=>{S.foot=e.target.value;save();render();});
$('#inTitle').addEventListener('input',e=>{S.title=e.target.value;save();render();});
$('#inSub').addEventListener('input',e=>{S.sub=e.target.value;save();render();});
$('#inStyle').addEventListener('change',e=>{S.style=e.target.value;save();render();});
$('#inPaper').addEventListener('change',e=>{S.paper=e.target.value;save();render();});
$('#inOrient').addEventListener('change',e=>{S.orient=e.target.value;save();render();});
$$('#swTheme .sw').forEach(b=>b.addEventListener('click',()=>{S.theme=b.dataset.t;save();sync();render();}));
[['tgGreg','greg'],['tgHol','hol'],['tgZman','zman'],['tgShk','shk'],['tgNetz','netz']].forEach(([id,k])=>$('#'+id).addEventListener('change',e=>{S[k]=e.target.checked;save();sync();render();}));
$('#inCm').addEventListener('change',e=>{S.cm=Math.max(0,Math.min(90,parseInt(e.target.value)||30));save();sync();render();});
$('#inHm').addEventListener('change',e=>{S.hm=Math.max(0,Math.min(120,parseInt(e.target.value)||56));save();sync();render();});
$('#inZip').addEventListener('change',e=>{const v=(e.target.value||'').replace(/\D/g,'').slice(0,5);S.zip=v||'10952';save();sync();render();});

/* ---- actions ---- */
function stepDate(iso0,k){let t=fromIso(iso0);if(S.view==='day')return iso(t+k*DAY);if(S.view==='week')return iso(t+k*7*DAY);
  if(S.view==='tests'){for(let i=0;i<k;i++){const g=testGroups(t).slice(0,TESTS_PER_PAGE);if(!g.length)break;t=fromIso(g[g.length-1].date)+DAY;}return iso(t);}
  t=monthFirst(t);for(let i=0;i<k;i++)t+=monthLen(t)*DAY;return iso(t);}
const H2C='vendor/html2canvas.min.js',JSPDF='vendor/jspdf.umd.min.js'; // served from this site, so web filters don't block them
const h2cOpts=scale=>({scale,backgroundColor:null,useCORS:true,logging:false,onclone:d=>{const i=d.getElementById('stageInner'),w=d.getElementById('stageWrap');if(i){i.style.transform='none';i.style.position='static';}if(w){w.style.width='auto';w.style.height='auto';}}});
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);}
/* Several pages: build the PDF file here, one sheet per page at the exact paper size.
   (The browser print dialog may force landscape paper, which splits each sheet over two pages.) */
async function makePdf(n){const d0=S.date;if(S.view==='tests')n=Math.max(1,Math.min(n,Math.ceil(testGroups(fromIso(d0)).length/TESTS_PER_PAGE))); // no empty pagestoast('מאך א PDF…');
  try{for(let k=0;k<n;k++){S.date=stepDate(d0,k);const [a,b]=viewRange();ensureZm(a,b);}S.date=d0;await zmReady();
    await loadScript(H2C);await loadScript(JSPDF);if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    const D=dims(),o=D.land?'landscape':'portrait',sc=Math.max(2,Math.min(3.5,Math.max(D.inW,D.inH)*200/D.W));
    const pdf=new window.jspdf.jsPDF({orientation:o,unit:'in',format:[D.inW,D.inH],compress:true});
    for(let k=0;k<n;k++){S.date=stepDate(d0,k);render();toast('מאך א PDF… '+(k+1)+' / '+n);
      const c=await html2canvas($('.sheet'),h2cOpts(sc));if(k)pdf.addPage([D.inW,D.inH],o);
      pdf.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',0,0,D.inW,D.inH,undefined,'FAST');}
    download(pdf.output('blob'),'limud-luach-'+S.view+'-'+d0+'-'+n+'.pdf');toast('דער PDF איז געשפיכערט ✓ — עפן אים און דרוק');}
  catch(e){toast('דער PDF־מאכער גייט נישט — פרוביר נאכאמאל');}
  finally{S.date=d0;render();}}
async function doPrint(){const n=Math.max(1,Math.min(52,parseInt(S.pages)||1));
  if(S.view==='tests')n=Math.max(1,Math.min(n,Math.ceil(testGroups(fromIso(S.date)).length/TESTS_PER_PAGE)));
  if(n>1)return makePdf(n);
  toast('גרייט צו דרוקן…');await zmReady();render();setTimeout(()=>window.print(),120);}
$('#btnPrint').addEventListener('click',doPrint);$('#mPrint').addEventListener('click',doPrint);
const LOADED=new Set();
function loadScript(src){return new Promise((res,rej)=>{if(LOADED.has(src))return res();const s=document.createElement('script');s.src=src;s.onload=()=>{LOADED.add(src);res();};s.onerror=rej;document.head.appendChild(s);});}
async function savePng(){toast('מאך א בילד…');
  try{await zmReady();render();await loadScript(H2C);
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    const el=$('.sheet');const c=await html2canvas(el,{scale:3,backgroundColor:null,useCORS:true,logging:false,onclone:d=>{const i=d.getElementById('stageInner'),w=d.getElementById('stageWrap');if(i){i.style.transform='none';i.style.position='static';}if(w){w.style.width='auto';w.style.height='auto';}}});
    c.toBlob(b=>{if(!b){toast('נישט געגאנגען — נוץ „דרוק / PDF“');return;}const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`limud-luach-${S.view}-${S.date}.png`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);toast('דער בילד איז געשפיכערט ✓');},'image/png');
  }catch(e){toast('דער בילד־מאכער גייט נישט — נוץ „דרוק / PDF“');}}
$('#btnPng').addEventListener('click',savePng);$('#mPng').addEventListener('click',savePng);
$('#btnLink').addEventListener('click',async()=>{const j=JSON.stringify(S);const h='#s='+encodeURIComponent(btoa(unescape(encodeURIComponent(j))));const u=location.href.split('#')[0]+h;
  try{await navigator.clipboard.writeText(u);toast('דער לינק איז קאפירט ✓');}catch(e){try{history.replaceState(null,'',h);}catch(_){}prompt('קאפיר דעם לינק:',u);}});
let rs=0;$('#btnReset').addEventListener('click',e=>{const b=e.currentTarget;if(!rs){rs=1;b.textContent='זיכער? דריק נאכאמאל';setTimeout(()=>{rs=0;b.textContent='ווידער פון אנהייב';},3000);return;}
  rs=0;b.textContent='ווידער פון אנהייב';store.del();S=DEF();try{history.replaceState(null,'',location.pathname);}catch(_){}sync();buildCus();buildTests();render();toast('אלעס איז צוריקגעשטעלט');});
const hd=$('#dlgHelp');$('#btnHelp').addEventListener('click',()=>hd.showModal?hd.showModal():hd.setAttribute('open',''));$('#helpOk').addEventListener('click',()=>hd.close());
[dlg,hd].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));

/* ---- init ---- */
buildLim();buildTests();sync();render();
runNetCheck();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>render());
