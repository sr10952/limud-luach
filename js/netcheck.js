/* =====================================================================
   NETWORK CHECK — some users are behind web filters. On load we check
   every outside service (and our own vendored files) and, if any is
   unreachable, show a notice that says what won't work and what to ask
   the filter company to open. A filter often answers with its own
   "blocked" page (HTTP 200, HTML), so a check only passes when the
   reply really looks like the service's data.
   ===================================================================== */
const NET_CHECKS=[
  {id:'hebcal',host:'www.hebcal.com',
   url:'https://www.hebcal.com/zmanim?cfg=json&zip=10952&date=2026-01-01',
   ok:async r=>{const j=await r.json();return !!(j&&j.times&&j.times.sunset);},
   what:'די זמנים — הדלקת נרות, מוצאי שבת, נץ און שקיעה.',
   without:'אין מאנסי (10952) רעכנט דער בראוזער די זמנים אליין (בערך, מיט א ~). אנדערע ערטער ווייזן נישט קיין זמנים.'},
  {id:'pdf',local:true,
   url:'vendor/jspdf.umd.min.js',ok:async r=>(await r.text()).includes('jsPDF'),
   what:'„דרוק / PDF“ פאר מער ווי איין בלאט, און „היט אפ אלס בילד“.',
   without:'די פייל vendor/jspdf.umd.min.js איז נישט ארויפגעלייגט אויפן סערווער.'},
  {id:'img',local:true,
   url:'vendor/html2canvas.min.js',ok:async r=>(await r.text()).includes('html2canvas'),
   what:'„היט אפ אלס בילד“ און PDF פון אסאך בלעטער.',
   without:'די פייל vendor/html2canvas.min.js איז נישט ארויפגעלייגט אויפן סערווער.'}
];
const NET={}; // id -> true/false once checked

async function netProbe(c,ms=7000){
  const ac=('AbortController' in window)?new AbortController():null;const tm=setTimeout(()=>ac&&ac.abort(),ms);
  try{const r=await fetch(c.url,{cache:'no-store',signal:ac&&ac.signal,credentials:'omit'});if(!r.ok)return false;return await c.ok(r);}
  catch(e){return false;}finally{clearTimeout(tm);}}

async function runNetCheck(){
  const local=location.protocol==='file:'; // opened from disk: our own files can't be fetched, skip them
  const list=NET_CHECKS.filter(c=>!(c.local&&local));
  const res=await Promise.all(list.map(c=>netProbe(c)));
  list.forEach((c,i)=>NET[c.id]=res[i]);
  const bad=list.filter((c,i)=>!res[i]);
  const box=$('#netw');if(!box)return;
  if(!bad.length){box.classList.remove('on');return;}
  const hosts=bad.filter(c=>c.host).map(c=>c.host);
  $('#netwBody').innerHTML=`<b>עטליכע זאכן קען מען נישט דערגרייכן — אפשר בלאקירט דורך אן אינטערנעט־פילטער.</b>`
    +`<ul>${bad.map(c=>`<li><b>${esc(c.host||c.url)}</b> — ${esc(c.what)} ${esc(c.without)}</li>`).join('')}</ul>`
    +(hosts.length?`<div>בעט ביי דער פילטער־פירמע צו עפענען: <b dir="ltr">${hosts.map(esc).join(', ')}</b> — און דערנאך <a href="" onclick="location.reload();return false">לאד איבער דעם בלאט</a>.</div>`:'');
  box.classList.add('on');}
