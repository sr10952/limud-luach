/* ===================== CORE: Hebrew calendar · learning cycles ===================== */
const DAY=864e5;
const HFMT=new Intl.DateTimeFormat('en-u-ca-hebrew',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const hcache=new Map();
function hp(t){let v=hcache.get(t);if(v)return v;let d,m,y;for(const x of HFMT.formatToParts(new Date(t))){if(x.type==='day')d=+x.value;else if(x.type==='month')m=x.value;else if(x.type==='year')y=parseInt(x.value,10);}v={d,m,y};hcache.set(t,v);return v;}
const ep=(y,m,d)=>Date.UTC(y,m,d,12);
const wday=t=>new Date(t).getUTCDay();
const ymaps={};
function ymap(Y){ if(ymaps[Y])return ymaps[Y];
  let t=ep(Y-3761,7,20);for(let i=0;i<70;i++,t+=DAY){const h=hp(t);if(h.y===Y&&h.m==='Tishri'&&h.d===1)break;}
  const rh=t;const map=new Map();let n=0;
  for(let u=rh;;u+=DAY){const h=hp(u);if(h.y!==Y)break;map.set(h.m+'|'+h.d,u);n++;}
  return ymaps[Y]={rh,map,days:n,leap:((7*Y+1)%19)<7,get:(m,d)=>map.get(m+'|'+d)};}
const P=['בראשית','נח','לך לך','וירא','חיי שרה','תולדות','ויצא','וישלח','וישב','מקץ','ויגש','ויחי','שמות','וארא','בא','בשלח','יתרו','משפטים','תרומה','תצוה','כי תשא','ויקהל','פקודי','ויקרא','צו','שמיני','תזריע','מצורע','אחרי מות','קדושים','אמור','בהר','בחוקותי','במדבר','נשא','בהעלותך','שלח','קרח','חוקת','בלק','פינחס','מטות','מסעי','דברים','ואתחנן','עקב','ראה','שופטים','כי תצא','כי תבוא','נצבים','וילך','האזינו'];
const PB=P.slice(0,51); // בראשית..נצבים
function isYT(h){ if(h.m==='Tishri'&&(h.d<=2||h.d===10||(h.d>=15&&h.d<=23)))return true; if(h.m==='Nisan'&&h.d>=15&&h.d<=22)return true; if(h.m==='Sivan'&&(h.d===6||h.d===7))return true; return false;}
const yrc={};
function yearReadings(Y){ if(yrc[Y])return yrc[Y];
  const m=ymap(Y),n=ymap(Y+1);const out=new Map();
  let t=m.rh;while(wday(t)!==6)t+=DAY;
  const sepVay=[1,2].includes(wday(m.rh));
  const pre=[],L=[];let after=false;
  for(;t<n.rh;t+=7*DAY){const h=hp(t);
    if(!after){ if(h.m==='Tishri'&&h.d<=23){ if(!isYT(h))pre.push(t); continue;} after=true; }
    if(isYT(h))continue; L.push(t);}
  if(sepVay){out.set(pre[0],['וילך']);out.set(pre[1],['האזינו']);}else out.set(pre[0],['האזינו']);
  const comb=[4,6].includes(wday(n.rh));
  const k=Math.max(0,51-L.length);
  const shav=m.get('Sivan',6),av9=m.get('Av',9);
  const preOrd=['בהר','אחרי מות','תזריע','ויקהל'];
  const pair={'בהר':['בהר','בחוקותי'],'אחרי מות':['אחרי מות','קדושים'],'תזריע':['תזריע','מצורע'],'ויקהל':['ויקהל','פקודי'],'מטות':['מטות','מסעי'],'חוקת':['חוקת','בלק']};
  const postOrd=['מטות','חוקת'];
  function build(X,C){const set=new Set([...preOrd.slice(0,X),...postOrd.slice(0,C)]);const seq=[];for(let i=0;i<PB.length;){const nm=PB[i];if(set.has(nm)){seq.push(pair[nm]);i+=2;}else{seq.push([nm]);i++;}}
    if(comb)seq[seq.length-1]=['נצבים','וילך'];return seq;}
  let chosen=null;
  for(let X=0;X<=Math.min(4,k);X++){const C=k-X;if(C>2)continue;const seq=build(X,C);if(seq.length!==L.length)continue;
    const bi=seq.findIndex(s=>s.includes('במדבר'));const di=seq.findIndex(s=>s.includes('דברים'));
    let w=av9;while(wday(w)!==6)w-=DAY;
    if(L[bi]<shav&&L[di]===w){chosen=seq;break;}}
  if(!chosen){let X=Math.min(4,k);chosen=build(X,Math.min(2,k-X));}
  L.forEach((t,i)=>{if(chosen[i])out.set(t,chosen[i]);});
  return yrc[Y]={out,k,ok:!!chosen};}
function parshaOn(t){const h=hp(t);const r=yearReadings(h.y).out.get(t);if(r)return r;
  // Shabbos in Elul at year end belongs to same Hebrew year; Tishrei early belongs too
  return null;}

/* ---- numerals & names ---- */
function heb(n){const o=[[400,'ת'],[300,'ש'],[200,'ר'],[100,'ק'],[90,'צ'],[80,'פ'],[70,'ע'],[60,'ס'],[50,'נ'],[40,'מ'],[30,'ל'],[20,'כ'],[10,'י'],[9,'ט'],[8,'ח'],[7,'ז'],[6,'ו'],[5,'ה'],[4,'ד'],[3,'ג'],[2,'ב'],[1,'א']];let s='';while(n>0){if(n===15){s+='טו';break;}if(n===16){s+='טז';break;}for(const [v,c] of o){if(n>=v){s+=c;n-=v;break;}}}return s.length<=1?s+'׳':s.slice(0,-1)+'״'+s.slice(-1);}
const hebYear=y=>heb(y%1000);
const HM={'Tishri':'תשרי','Heshvan':'מרחשון','Kislev':'כסלו','Tevet':'טבת','Shevat':'שבט','Adar I':'אדר א׳','Adar II':'אדר ב׳','Adar':'אדר','Nisan':'ניסן','Iyar':'אייר','Sivan':'סיון','Tamuz':'תמוז','Av':'מנחם־אב','Elul':'אלול'};
const GM=['יאנואר','פעברואר','מערץ','אפריל','מיי','יוני','יולי','אויגוסט','סעפטעמבער','אקטאבער','נאוועמבער','דעצעמבער'];
const WD=['זונטאג','מאנטאג','דינסטאג','מיטוואך','דאנערשטאג','פרייטאג','שבת קודש'];
const WDS=['זונטאג','מאנטאג','דינסטאג','מיטוואך','דאנערשטאג','פרייטאג','שבת'];
const hebDate=t=>{const h=hp(t);return heb(h.d)+' '+HM[h.m];};
const hebDateY=t=>{const h=hp(t);return heb(h.d)+' '+HM[h.m]+' '+hebYear(h.y);};
const GMS=['יאנ׳','פעב׳','מערץ','אפר׳','מיי','יוני','יולי','אויג׳','סעפט׳','אקט׳','נאוו׳','דעצ׳'];
const gregShort=t=>{const d=new Date(t);return d.getUTCDate()+' '+GMS[d.getUTCMonth()];};
const gregFull=t=>{const d=new Date(t);return d.getUTCDate()+' '+GM[d.getUTCMonth()]+' '+d.getUTCFullYear();};
const iso=t=>new Date(t).toISOString().slice(0,10);
const fromIso=s=>{const [y,m,d]=s.split('-').map(Number);return ep(y,m-1,d);};

/* ---- Daf Yomi Bavli ---- */
const BAV=[['ברכות',2,64],['שבת',2,157],['עירובין',2,105],['פסחים',2,121],['שקלים',2,22],['יומא',2,88],['סוכה',2,56],['ביצה',2,40],['ראש השנה',2,35],['תענית',2,31],['מגילה',2,32],['מועד קטן',2,29],['חגיגה',2,27],['יבמות',2,122],['כתובות',2,112],['נדרים',2,91],['נזיר',2,66],['סוטה',2,49],['גיטין',2,90],['קידושין',2,82],['בבא קמא',2,119],['בבא מציעא',2,119],['בבא בתרא',2,176],['סנהדרין',2,113],['מכות',2,24],['שבועות',2,49],['עבודה זרה',2,76],['הוריות',2,14],['זבחים',2,120],['מנחות',2,110],['חולין',2,142],['בכורות',2,61],['ערכין',2,34],['תמורה',2,34],['כריתות',2,28],['מעילה',2,22],['קינים',23,25],['תמיד',26,33],['מידות',34,37],['נדה',2,73]];
const BAV_LEN=BAV.reduce((a,x)=>a+x[2]-x[1]+1,0);
function bavli(t){let n=Math.floor((t-ep(2020,0,5))/DAY);n=((n%BAV_LEN)+BAV_LEN)%BAV_LEN;for(const [nm,a,b] of BAV){const c=b-a+1;if(n<c)return{m:nm,d:a+n};n-=c;}}

/* ---- Yerushalmi Yomi (Vilna) ---- */
const YER=[['ברכות',68],['פאה',37],['דמאי',34],['כלאים',44],['שביעית',31],['תרומות',59],['מעשרות',26],['מעשר שני',33],['חלה',28],['ערלה',20],['ביכורים',13],['שבת',92],['עירובין',65],['פסחים',71],['ביצה',22],['ראש השנה',22],['יומא',42],['סוכה',26],['תענית',26],['שקלים',33],['מגילה',34],['חגיגה',22],['מועד קטן',19],['יבמות',85],['כתובות',72],['סוטה',47],['נדרים',40],['נזיר',47],['גיטין',54],['קידושין',48],['בבא קמא',44],['בבא מציעא',37],['בבא בתרא',34],['שבועות',44],['מכות',9],['סנהדרין',57],['עבודה זרה',37],['הוריות',19],['נדה',13]];
const YER_LEN=YER.reduce((a,x)=>a+x[1],0);
const YER_ANCHOR=ep(2022,10,14);
function yerSkips(Y){const m=ymap(Y);let tb=m.get('Av',9);if(wday(tb)===6)tb+=DAY;return [m.get('Tishri',10),tb];}
function yerSkipsBetween(a,b){ // count skip days in [a,b)
  let c=0;const y0=hp(a).y-1,y1=hp(b).y+1;for(let Y=y0;Y<=y1;Y++)for(const s of yerSkips(Y))if(s>=a&&s<b)c++;return c;}
function yerIsSkip(t){const Y=hp(t).y;return yerSkips(Y).includes(t);}
function yerushalmi(t){if(yerIsSkip(t))return null;let n;
  if(t>=YER_ANCHOR)n=Math.round((t-YER_ANCHOR)/DAY)-yerSkipsBetween(YER_ANCHOR,t);
  else n=-(Math.round((YER_ANCHOR-t)/DAY)-yerSkipsBetween(t,YER_ANCHOR));
  n=((n%YER_LEN)+YER_LEN)%YER_LEN;for(const [nm,c] of YER){if(n<c)return{m:nm,d:n+1};n-=c;}}

/* ---- Tehillim by Hebrew month day ---- */
const TEH=[[1,9],[10,17],[18,22],[23,28],[29,34],[35,38],[39,43],[44,48],[49,54],[55,59],[60,65],[66,68],[69,71],[72,76],[77,78],[79,82],[83,87],[88,89],[90,96],[97,103],[104,105],[106,107],[108,112],[113,118],[119,'א'],[119,'ב'],[120,134],[135,139],[140,144],[145,150]];
function tehillim(t){const h=hp(t);let d=h.d;const last=hp(t+DAY).d===1;
  const f=i=>{const [a,b]=TEH[i-1];if(a===119)return 'קי״ט · '+(b==='א'?'א–ל':'מ–ת');return a===b?heb(a):heb(a)+'–'+heb(b);};
  if(d===29&&last){const a=TEH[28][0],b=TEH[29][1];return heb(a)+'–'+heb(b);}
  return f(Math.min(d,30));}

/* ---- Holidays (diaspora) ---- */
function chanukahDay(t){const h=hp(t);if(!((h.m==='Kislev'&&h.d>=25)||(h.m==='Tevet'&&h.d<=3)))return 0;for(let i=0;i<8;i++){const u=t-i*DAY,g=hp(u);if(g.m==='Kislev'&&g.d===25)return i+1;}return 0;}
const NUM_F=['','א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ז׳','ח׳'];
function dayInfo(t){const h=hp(t),wd=wday(t);const L=[];let yt=false,fast=false,rc=false,cm=false;const sh=wd===6;
  const add=s=>L.push(s);
  if(h.m==='Tishri'){ if(h.d<=2){add('ראש השנה'+(h.d===2?' · ב׳':''));yt=true;}
    if(h.d===3&&!sh||h.d===4&&sh){add('צום גדליה');fast=true;}
    if(h.d===10){add('יום כיפור');yt=true;}
    if(h.d===15||h.d===16){add('סוכות'+(h.d===16?' · ב׳':''));yt=true;}
    if(h.d>=17&&h.d<=20){add('חול המועד סוכות');cm=true;}
    if(h.d===21)add('הושענא רבה');
    if(h.d===22){add('שמיני עצרת');yt=true;}
    if(h.d===23){add('שמחת תורה');yt=true;}}
  const n=chanukahDay(t);if(n)add('חנוכה · נר '+NUM_F[n]);
  if(h.m==='Tevet'&&h.d===10){add('עשרה בטבת');fast=true;}
  if(h.m==='Shevat'&&h.d===15)add('ט״ו בשבט');
  const adarFinal=h.m==='Adar'||h.m==='Adar II';
  if(h.m==='Adar I'&&h.d===14)add('פורים קטן');
  if(h.m==='Adar I'&&h.d===15)add('שושן פורים קטן');
  if(adarFinal){ if((h.d===13&&!sh)||(h.d===11&&wd===4)){add('תענית אסתר');fast=true;}
    if(h.d===14)add('פורים'); if(h.d===15)add('שושן פורים');}
  if(h.m==='Nisan'){ if(h.d===15||h.d===16){add('פסח'+(h.d===16?' · ב׳':''));yt=true;}
    if(h.d>=17&&h.d<=20){add('חול המועד פסח');cm=true;}
    if(h.d===21){add('שביעי של פסח');yt=true;} if(h.d===22){add('אחרון של פסח');yt=true;}}
  if(h.m==='Iyar'&&h.d===18)add('ל״ג בעומר');
  if(h.m==='Sivan'&&(h.d===6||h.d===7)){add('שבועות'+(h.d===7?' · ב׳':''));yt=true;}
  if(h.m==='Tamuz'&&((h.d===17&&!sh)||(h.d===18&&sh))){add('שבעה עשר בתמוז');fast=true;}
  if(h.m==='Av'&&((h.d===9&&!sh)||(h.d===10&&sh))){add('תשעה באב');fast=true;}
  if(h.m==='Av'&&h.d===15)add('ט״ו באב');
  const nx=hp(t+DAY);
  if(h.d===30){rc=true;add('ראש חודש '+HM[nx.m]);}
  else if(h.d===1&&h.m!=='Tishri'){rc=true;add('ראש חודש '+HM[h.m]);}
  return {h,wd,labels:L,yt,fast,rc,cm,sh};}
function shabbosTags(t){const T=[];const h=hp(t);
  const within=(m,d,a,b)=>{for(let i=a;i<=b;i++){const g=hp(t+i*DAY);if(m.includes(g.m)&&g.d===d)return true;}return false;};
  if(h.m==='Tishri'&&h.d>=3&&h.d<=9)T.push('שבת שובה');
  if(within(['Av'],9,0,7))T.push('שבת חזון');
  if(within(['Av'],9,-7,-1)||hp(t-7*DAY).m==='Av'&&hp(t-7*DAY).d===9)T.push('שבת נחמו');
  if(within(['Adar','Adar II'],1,0,6))T.push('שבת שקלים');
  if(within(['Adar','Adar II'],14,1,7))T.push('שבת זכור');
  if(within(['Nisan'],1,7,13))T.push('שבת פרה');
  if(within(['Nisan'],1,0,6))T.push('שבת החודש');
  if(within(['Nisan'],15,1,7))T.push('שבת הגדול');
  if(chanukahDay(t))T.push('שבת חנוכה');
  return T;}

/* ---- parsha lookup for any day ---- */
function parshaForDay(t){ // returns {names:[..], shabbos:t} of the coming Shabbos (or today if Shabbos)
  let s=t;while(wday(s)!==6)s+=DAY;const r=parshaOn(s);return {shabbos:s,names:r};}

/* ---- Zmanim fallback (NOAA sunset) ---- */
const LOC={lat:41.117866,lon:-74.082053,tz:'America/New_York'}; // Monsey, NY 10952
function jdn(y,m,d){if(m<=2){y-=1;m+=12;}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5;}
function sunsetUTCmin(y,m,d,lat,lon,rise){const R=Math.PI/180;const J=jdn(y,m,d)+0.5-lon/360;const T=(J-2451545)/36525;
  const L0=(280.46646+T*(36000.76983+T*0.0003032))%360,M=357.52911+T*(35999.05029-0.0001537*T),e=0.016708634-T*(0.000042037+0.0000001267*T);
  const C=Math.sin(M*R)*(1.914602-T*(0.004817+0.000014*T))+Math.sin(2*M*R)*(0.019993-0.000101*T)+Math.sin(3*M*R)*0.000289;
  const om=(125.04-1934.136*T)*R,lam=L0+C-0.00569-0.00478*Math.sin(om);
  const eps=23+(26+(21.448-T*(46.815+T*(0.00059-T*0.001813)))/60)/60+0.00256*Math.cos(om);
  const decl=Math.asin(Math.sin(eps*R)*Math.sin(lam*R));const yy=Math.tan(eps*R/2)**2;
  const eq=4*(yy*Math.sin(2*L0*R)-2*e*Math.sin(M*R)+4*e*yy*Math.sin(M*R)*Math.cos(2*L0*R)-0.5*yy*yy*Math.sin(4*L0*R)-1.25*e*e*Math.sin(2*M*R))/R;
  const H=Math.acos(Math.cos(90.833*R)/(Math.cos(lat*R)*Math.cos(decl))-Math.tan(lat*R)*Math.tan(decl))/R;
  return 720-4*(rise?lon+H:lon-H)-eq;}
function tzOffMin(t,tz){try{const p=new Intl.DateTimeFormat('en-US',{timeZone:tz,timeZoneName:'longOffset'}).formatToParts(new Date(t)).find(x=>x.type==='timeZoneName').value;const m=p.match(/GMT([+-])(\d+)(?::(\d+))?/);return m?(m[1]==='-'?-1:1)*(+m[2]*60+(+m[3]||0)):0;}catch(e){return -300;}}
function sunsetLocalMin(t,rise){const d=new Date(t);return sunsetUTCmin(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate(),LOC.lat,LOC.lon,rise)+tzOffMin(t,LOC.tz);}
const sunriseLocalMin=t=>sunsetLocalMin(t,true);
const fmt12=m=>{const r=Math.floor(m);return ((Math.floor(r/60)%12)||12)+':'+String(r%60).padStart(2,'0');};
function zmFallback(t,cm,hm){const wd=wday(t);const o={};
  if(wd===5)o.c='~'+fmt12(sunsetLocalMin(t)-cm-0.9);
  if(wd===6)o.h='~'+fmt12(Math.round(sunsetLocalMin(t)+hm+0.2));
  return (o.c||o.h)?o:null;}

