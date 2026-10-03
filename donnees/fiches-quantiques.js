/* =====================================================================
   Fiches quantiques — données des fiches
   ---------------------------------------------------------------------
   Reprise à l'identique des 50 fiches de l'ancienne page « 50 notions quantiques »
   (textes, formules et illustrations SVG calculées).
   Le bloc final « JEU_DE_FICHES » relie ces données au moteur js/fiches.js
   et fixe le symbole affiché sur la vignette de chaque thème.
   ===================================================================== */
const f=n=>Math.round(n*10)/10;
function wv(x0,y0,len,amp,per,env,ph){ph=ph||0;let d='';for(let i=0;i<=len+0.01;i+=1.5){const u=i/len,e=env?env(u):1;d+=(i?'L':'M')+f(x0+i)+' '+f(y0-amp*e*Math.sin(2*Math.PI*i/per+ph))+' ';}return d.trim();}
function gs(x0,y0,w,h,s){let d='';for(let i=0;i<=w+0.01;i+=2){const x=i-w/2;d+=(i?'L':'M')+f(x0+i)+' '+f(y0-h*Math.exp(-x*x/(2*s*s)))+' ';}return d.trim();}
const P=(d,c,m,ms)=>`<path d="${d}" class="l ${c||''}"${m?` marker-end="url(#${m})"`:''}${ms?` marker-start="url(#${ms})"`:''}/>`;
const L=(x1,y1,x2,y2,c,m)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="l ${c||''}"${m?` marker-end="url(#${m})"`:''}/>`;
const C=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="l ${c||''}"/>`;
const D=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="${c||'fa'}"/>`;
const R=(x,y,w,h,c,rx)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx==null?3:rx}" class="l ${c||''}"/>`;
const E=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="l ${c||''}"/>`;
const T=(x,y,s,sz,c,a)=>`<text x="${x}" y="${y}" font-size="${sz||12}" text-anchor="${a||'middle'}" class="tx ${c||''}">${s}</text>`;
const gaussEnv=(sig,len)=>u=>Math.exp(-Math.pow((u-.5)*len/sig,2)/2);

const ART=[
/*1*/()=>P('M30 112 L170 40','m d w1')+P('M30 112 h28 v-16 h28 v-16 h28 v-16 h28 v-16 h28','a')+T(78,62,'continu',10,'tm')+T(140,100,'par paliers',10,'ta'),
/*2*/()=>`<text x="100" y="84" font-size="74" text-anchor="middle" font-style="italic" class="tx ta">h</text>`+T(100,118,'6,626 × 10⁻³⁴ J·s',12,'tm'),
/*3*/()=>P(wv(22,64,140,24,14,u=>Math.exp(-Math.pow((u-.5)/.2,2))),'a')+L(166,64,186,64,'a','ma')+T(100,116,'E = h·f',15),
/*4*/()=>R(30,100,140,22,'m sm',2)+T(100,115,'métal',10,'tm')+`<g transform="translate(20 25) rotate(40)">${P(wv(0,0,80,5,10),'a')}</g><g transform="translate(45 15) rotate(40)">${P(wv(0,0,80,5,10),'a')}</g>`+D(125,94,4,'fb')+L(127,90,148,58,'b','mb')+D(150,94,4,'fb')+L(153,90,178,62,'b','mb')+T(62,14,'lumière',10,'ta','start')+T(178,50,'e⁻',12,'tb'),
/*5*/()=>P(wv(22,66,70,18,24),'b')+T(100,73,'⇄',22,'tm')+L(118,60,136,60,'m w1')+L(122,72,136,72,'m w1')+D(152,66,9,'fa')+T(57,112,'onde',11,'tb')+T(150,112,'particule',11,'ta'),
/*6*/()=>P(wv(20,30,160,14,48),'b')+T(100,58,'léger ou lent : grande λ',10,'tb')+P(wv(20,84,160,10,12),'a')+T(100,110,'lourd ou rapide : petite λ',10,'ta')+T(100,132,'λ = h / (m·v)',11),
/*7*/()=>L(60,28,150,28,'m')+L(60,55,150,55,'m')+L(60,110,150,110,'m')+T(50,32,'n = 3',10,'tm','end')+T(50,59,'n = 2',10,'tm','end')+T(50,114,'n = 1',10,'tm','end')+D(90,55,5,'fa')+L(90,62,90,104,'a','ma')+P(wv(100,82,55,6,11),'a')+L(158,82,176,82,'a','ma')+T(135,100,'photon',10,'ta'),
/*8*/()=>{let s=D(22,70,5,'fa')+P('M39.1 55.9 A20 20 0 0 1 39.1 84.1','b w1')+P('M53.3 41.7 A40 40 0 0 1 53.3 98.3','b w1')+R(80,15,5,40,'fi',1)+R(80,65,5,10,'fi',1)+R(80,85,5,40,'fi',1);
  ['M94.6 48.5 A15 15 0 0 1 94.6 71.5','M104.3 37 A30 30 0 0 1 104.3 83','M113.9 25.5 A45 45 0 0 1 113.9 94.5','M94.6 68.5 A15 15 0 0 1 94.6 91.5','M104.3 57 A30 30 0 0 1 104.3 103','M113.9 45.5 A45 45 0 0 1 113.9 114.5'].forEach(d=>s+=P(d,'b w1'));
  s+=L(150,15,150,125,'m');const op=[1,.7,.4,.18];for(let k=-3;k<=3;k++){s+=`<rect x="158" y="${70+16*k-4}" width="30" height="8" rx="1" class="fa" opacity="${op[Math.abs(k)]}"/>`;}
  return s+T(22,96,'source',9,'tm')+T(172,136,'écran',9,'tm');},
/*9*/()=>L(40,115,178,115,'m','mm')+L(40,115,40,18,'m','mm')+P('M140 45 V115','m d w1')+P('M40 45 H140','m d w1')+L(40,115,138,46,'a','ma')+T(154,40,'|ψ⟩',16,'ta'),
/*10*/()=>L(90,85,178,85,'m','mm')+L(90,85,90,14,'m','mm')+L(90,85,42,126,'m','mm')+L(90,85,150,36,'a','ma')+T(190,89,'|0⟩',11,'tm')+T(98,18,'|1⟩',11,'tm','start')+T(30,134,'|2⟩',11,'tm')+T(163,32,'|ψ⟩',13,'ta')+T(38,40,'… ∞',13,'tm'),
/*11*/()=>`<text x="100" y="80" font-size="42" text-anchor="middle" class="tx"><tspan class="tb">⟨φ</tspan><tspan class="tm">|</tspan><tspan class="ta">ψ⟩</tspan></text>`+T(66,114,'bra',11,'tb')+T(134,114,'ket',11,'ta'),
/*12*/()=>L(15,76,186,76,'m w1','mm')+P(gs(20,76,160,48,28),'m d w1')+P(wv(20,76,160,48,16,gaussEnv(28,160)),'b')+T(160,28,'ψ(x)',13,'tb')+T(186,92,'x',11,'tm'),
/*13*/()=>C(100,75,64,'m d w1')+L(28,75,178,75,'m w1','mm')+L(100,138,100,8,'m w1','mm')+L(100,75,150,35,'a','ma')+P('M125 75 A25 25 0 0 0 119.5 59.4','b w1')+T(134,69,'φ',12,'tb')+T(184,90,'Re',10,'tm')+T(108,14,'Im',10,'tm','start')+T(162,30,'z',12,'ta'),
/*14*/()=>{let s=L(20,45,180,45,'m w1')+P(wv(20,45,160,26,32,gaussEnv(40,160)),'b')+L(20,122,180,122,'m w1');
  for(let x=22;x<178;x+=6){const xx=x+2-20,u=xx/160,e=Math.exp(-Math.pow((u-.5)*160/40,2)/2),v=e*Math.sin(2*Math.PI*xx/32),h=42*v*v;if(h>.5)s+=`<rect x="${x}" y="${f(122-h)}" width="4" height="${f(h)}" class="fa"/>`;}
  return s+T(188,30,'ψ',12,'tb')+T(186,100,'|ψ|²',10,'ta');},
/*15*/()=>P('M100 24 A38 38 0 0 0 100 100 Z','b sb')+P('M100 24 A38 38 0 0 1 100 100 Z','a sa')+T(82,68,'0',17,'tb')+T(118,68,'1',17,'ta')+T(100,128,'α|0⟩ + β|1⟩',14),
/*16*/()=>P(wv(15,26,80,9,26),'b w1')+P(wv(15,52,80,9,26),'a w1')+T(55,78,'↓',12,'tm')+P(wv(15,104,80,18,26))+T(55,136,'constructive',10,'tm')+L(102,12,102,120,'m d w1')+P(wv(110,26,80,9,26),'b w1')+P(wv(110,52,80,9,26,null,Math.PI),'a w1')+T(150,78,'↓',12,'tm')+L(110,104,190,104)+T(150,136,'destructive',10,'tm'),
/*17*/()=>`<text x="100" y="78" font-size="24" text-anchor="middle" class="tx">iħ <tspan class="tb">∂ψ/∂t</tspan> = Ĥψ</text>`+T(100,112,'comment l’état évolue',11,'tm'),
/*18*/()=>C(100,72,45,'m w1')+D(100,72,3,'fi')+L(100,72,139,49.5,'m','mm')+L(100,72,111.6,28.5,'a','ma')+P('M144.5 39.7 A55 55 0 0 0 121.5 21.4','b w1','mb','mb')+T(100,134,'continue et réversible',11,'tm'),
/*19*/()=>{let s=P('M40 98 A60 60 0 0 1 160 98');for(let a=0;a<=180;a+=30){const r=a*Math.PI/180;s+=L(f(100+52*Math.cos(r)),f(98-52*Math.sin(r)),f(100+60*Math.cos(r)),f(98-60*Math.sin(r)),'w1');}
  return s+L(32,98,168,98,'m w1')+L(100,98,134,58,'a','ma')+D(100,98,4,'fi')+T(100,126,'énergie, position, spin…',10,'tm');},
/*20*/()=>L(15,70,185,70,'m w1')+D(40,70,6,'fa')+D(88,70,6,'fa')+D(152,70,6,'fa')+T(40,96,'a₁',12,'ta')+T(88,96,'a₂',12,'ta')+T(152,96,'a₃',12,'ta')+T(100,34,'les seuls résultats possibles',10,'tm'),
/*21*/()=>P(gs(10,100,80,30,16),'b')+L(10,100,90,100,'m w1')+L(96,80,114,80,'m','mm')+P(gs(120,100,70,70,4),'a')+L(120,100,190,100,'m w1')+T(50,124,'avant',11,'tm')+T(155,124,'après',11,'tm'),
/*22*/()=>P(wv(12,58,72,12,24),'b')+T(48,92,'Schrödinger',10,'tb')+T(100,68,'?',30,'tm')+P(gs(116,76,72,44,4),'a')+L(116,76,188,76,'m w1')+T(152,92,'mesure',10,'ta')+T(100,124,'deux règles, une frontière floue',10,'tm'),
/*23*/()=>T(100,18,'Δx · Δp ≥ ħ/2',12)+P(gs(10,108,85,72,6),'a')+L(10,108,95,108,'m w1')+T(52,128,'position précise',9,'ta')+P(gs(105,108,85,24,20),'b')+L(105,108,190,108,'m w1')+T(147,128,'vitesse floue',9,'tb'),
/*24*/()=>T(18,37,'ψ',13)+L(26,33,52,33,'m','mm')+R(55,22,26,22,'a sa')+T(68,37,'A',12,'ta')+L(83,33,93,33,'m','mm')+R(95,22,26,22,'b sb')+T(108,37,'B',12,'tb')+L(123,33,143,33,'m','mm')+D(155,33,7,'fa')
  +T(18,82,'ψ',13)+L(26,78,52,78,'m','mm')+R(55,67,26,22,'b sb')+T(68,82,'B',12,'tb')+L(83,78,93,78,'m','mm')+R(95,67,26,22,'a sa')+T(108,82,'A',12,'ta')+L(123,78,143,78,'m','mm')+D(155,78,7,'fb')+T(100,124,'A puis B ≠ B puis A',13),
/*25*/()=>C(100,66,48)+L(100,20,100,112,'m d w1')+P(wv(58,66,38,10,13),'b')+D(126,66,8,'fa')+T(76,132,'onde',11,'tb')+T(126,132,'particule',11,'ta'),
/*26*/()=>{let s=C(100,68,26,'b sb')+P(wv(80,68,40,8,13),'b');for(let i=0;i<14;i++){const a=i*2*Math.PI/14,r=i%2?50:60;s+=D(f(100+r*Math.cos(a)),f(68+r*.82*Math.sin(a)),3,'fm');if(i%4===0)s+=L(f(100+44*Math.cos(a)),f(68+44*.82*Math.sin(a)),f(100+33*Math.cos(a)),f(68+33*.82*Math.sin(a)),'m w1','mm');}
  return s+T(100,136,'l’environnement « mesure » sans cesse',9,'tm');},
/*27*/()=>R(50,58,100,62)+P('M74 58 L81 41 L88 58','a')+P('M112 58 L119 41 L126 58','a')+T(100,100,'?',26,'tm')+T(100,135,'mort et vivant ?',10,'tm'),
/*28*/()=>C(36,70,14,'a sa')+T(36,75,'ψ',13,'ta')+L(52,70,72,70,'m','mm')+R(75,52,50,36,'m sm',4)+T(100,74,'copie',10,'tm')+L(127,62,146,46,'m','mm')+L(127,78,146,94,'m','mm')+C(162,40,13,'a sa')+T(162,45,'ψ',12,'ta')+C(162,100,13,'m d w1')+L(152,90,172,110,'a')+L(172,90,152,110,'a')+T(100,134,'impossible à dupliquer',10,'tm'),
/*29*/()=>{let s='';const pts=[[32,62,'Copenhague'],[76,38,'Everett'],[124,38,'Bohm'],[168,62,'QBism']];pts.forEach(([x,y,n])=>{s+=P(`M100 105 Q100 75 ${x} ${y+1}`,'m w1')+D(x,y,3,'fb')+T(x,y-10,n,9,'tb');});
  return s+C(100,116,11,'a sa')+T(100,120,'ψ',11,'ta');},
/*30*/()=>C(65,70,22,'a sa')+E(65,70,32,9,'m w1 d')+L(65,100,65,38,'a','ma')+C(140,70,22,'b sb')+E(140,70,32,9,'m w1 d')+L(140,40,140,102,'b','mb')+T(65,130,'haut',11,'ta')+T(140,130,'bas',11,'tb'),
/*31*/()=>{let s='';[40,65,90,115].forEach(y=>{s+=L(20,y,90,y,'m w1')+L(110,y,180,y,'m w1')+D(55,y-6,5,'fa');});
  [122,137,152,167].forEach(x=>s+=D(x,109,5,'fb'));return s+T(55,22,'fermions',11,'ta')+T(145,22,'bosons',11,'tb');},
/*32*/()=>{let s='';[[35,'2p',false],[70,'2s',true],[105,'1s',true]].forEach(([y,l,two])=>{s+=L(55,y,145,y,'m')+T(42,y+4,l,10,'tm','end')+L(88,y+11,88,y-11,'a','ma');if(two)s+=L(112,y-11,112,y+11,'b','mb');});
  return s+T(100,134,'jamais deux dans le même état',10,'tm');},
/*33*/()=>D(60,62,11,'fa')+D(140,62,11,'fa')+P('M72 50 Q100 22 128 50','m','mm')+P('M128 74 Q100 102 72 74','m','mm')+T(100,128,'les échanger ne change rien',10,'tm'),
/*34*/()=>R(92,22,22,96,'m sm',2)+P(wv(12,70,80,20,24),'b')+P(wv(92,70,22,20,24,u=>Math.exp(-1.4*u),2*Math.PI*80/24),'b')+P(wv(114,70,72,20*Math.exp(-1.4),24,null,2*Math.PI*102/24),'b')+T(103,134,'barrière',10,'tm'),
/*35*/()=>P('M40 22 Q100 208 160 22')+L(53,58,147,58,'a w1 d')+L(73,96,127,96,'a')+D(100,96,4,'fa')+T(150,100,'E₀ > 0',11,'ta','start')+T(100,134,'le minimum n’est jamais nul',10,'tm'),
/*36*/()=>{let s='';[30,46,62,94,110].forEach(y=>s+=L(20,y,180,y,'m w1'));return s+P(gs(20,78,160,30,9),'a')+D(100,48,4,'fa')+T(100,133,'une particule : une vague du champ',10,'tm');},
/*37*/()=>C(40,66,18,'a sa')+L(40,78,40,56,'a','ma')+C(160,66,18,'b sb')+L(160,54,160,76,'b','mb')+P(wv(60,66,80,6,16),'m d w1')+T(100,124,'un seul état pour deux',10,'tm'),
/*38*/()=>R(12,55,24,30,'m sm',3)+R(164,55,24,30,'m sm',3)+T(24,74,'A',11,'tm')+T(176,74,'B',11,'tm')+D(100,70,6,'fi')+D(74,70,4,'fa')+L(68,70,44,70,'a','ma')+D(126,70,4,'fb')+L(132,70,156,70,'b','mb')+T(100,32,'1935',12,'tm')+T(100,122,'la quantique est-elle complète ?',10,'tm'),
/*39*/()=>D(100,24,5,'fi')+P('M100 29 L57 50','m d w1')+P('M100 29 L143 50','m d w1')+R(30,52,55,38,'',2)+P('M30 52 L57.5 74 L85 52')+T(57.5,87,'?',12,'tm')+R(115,52,55,38,'',2)+P('M115 52 L142.5 74 L170 52')+T(142.5,87,'?',12,'tm')+T(100,124,'des réponses écrites d’avance ?',10,'tm'),
/*40*/()=>L(30,112,180,112,'m')+R(45,52,35,60,'b sb',2)+R(120,27,35,85,'a sa',2)+L(35,52,175,52,'m d w1')+T(62,46,'≤ 2',10,'tb')+T(137,21,'≈ 2,83',10,'ta')+T(62,128,'classique',10,'tb')+T(137,128,'mesuré',10,'ta'),
/*41*/()=>C(40,56,14,'a sa')+C(160,56,14,'b sb')+P(wv(56,56,88,5,16),'m d w1')+L(40,96,156,96,'m','mm')+R(88,88,24,16,'sm',2)+P('M88 88 L100 97 L112 88','w1')+L(82,82,118,110,'a')+L(118,82,82,110,'a')+T(100,132,'aucun message instantané',10,'tm'),
/*42*/()=>T(40,26,'Alice',10,'tm')+T(160,26,'Bob',10,'tm')+C(40,50,14,'m d w1')+T(40,55,'ψ',12,'tm')+C(160,50,14,'b sb')+T(160,55,'ψ',12,'tb')+P(wv(56,50,88,5,16),'m d w1')+P('M44 66 Q100 118 154 68','m','mm')+T(100,110,'+ 2 bits classiques',10,'tm')+T(100,134,'l’état passe d’Alice à Bob',10,'tm'),
/*43*/()=>C(100,72,48)+E(100,72,48,12,'m d w1')+L(100,24,100,120,'m d w1')+D(100,72,3,'fi')+L(100,72,131,40,'a','ma')+T(100,16,'|0⟩',11)+T(100,136,'|1⟩',11)+T(146,38,'ψ',12,'ta'),
/*44*/()=>L(16,45,186,45,'m')+L(16,95,186,95,'m')+T(4,49,'q₀',9,'tm','start')+T(4,99,'q₁',9,'tm','start')+R(40,32,26,26,'a sa',3)+T(53,50,'H',13,'ta')+L(100,45,100,106)+D(100,45,5,'fi')+C(100,95,11)
  +R(140,32,30,26,'sm',3)+P('M146 52 A9 9 0 0 1 164 52','w1')+L(155,52,161,40,'w1')+R(140,82,30,26,'sm',3)+P('M146 102 A9 9 0 0 1 164 102','w1')+L(155,102,161,90,'w1')+T(100,132,'superposer, intriquer, mesurer',10,'tm'),
/*45*/()=>{let up='',dn='';for(let i=0;i<=170;i+=5){const e=40*Math.exp(-2.6*i/170);up+=(i?'L':'M')+f(15+i)+' '+f(70-e)+' ';dn+=(i?'L':'M')+f(15+i)+' '+f(70+e)+' ';}
  return L(15,70,185,70,'m w1')+P(up.trim(),'m d w1')+P(dn.trim(),'m d w1')+P(wv(15,70,170,40,22,u=>Math.exp(-2.6*u)),'b')+T(16,22,'cohérent',10,'tb','start')+T(165,58,'brouillé',10,'tm')+T(100,132,'la cohérence s’efface avec le temps',10,'tm');},
/*46*/()=>{let s=R(20,30,76,76,'m d w1',12);[38,58,78].forEach(x=>[48,68,88].forEach(y=>s+=C(x,y,6,'b sb')));
  return s+L(102,68,126,68,'m','mm')+C(155,68,22,'a sa')+T(155,73,'L',14,'ta')+T(58,126,'qubits physiques',9,'tb')+T(155,126,'qubit logique',9,'ta');},
/*47*/()=>{let ce='',cq='';for(let x=25;x<=182;x+=2){const y=115-2*Math.exp((x-25)/30);if(y<16)break;ce+=(x===25?'M':'L')+x+' '+f(y)+' ';}
  for(let x=25;x<=180;x+=3){cq+=(x===25?'M':'L')+x+' '+f(115-0.9*Math.pow(x-25,.8))+' ';}
  return L(25,115,182,115,'m w1','mm')+L(25,115,25,12,'m w1','mm')+P(ce.trim(),'b')+P(cq.trim(),'a')+T(118,24,'classique',9,'tb','end')+T(178,56,'quantique',9,'ta','end')+T(104,132,'taille du problème',9,'tm');},
/*48*/()=>P('M72 62 V44 A18 18 0 0 1 108 44 V50','a')+R(60,62,60,46,'a sa',6)+D(84,80,4,'fi')+P('M104 64 L98 78 L106 88 L100 106')+T(34,90,'Shor',10,'ta')+C(158,50,14,'b')+L(168,60,182,74,'b')+T(158,92,'Grover',10,'tb')+T(90,130,'N = p × q',12),
/*49*/()=>C(48,62,14,'b')+L(62,62,112,62,'b')+L(98,62,98,74,'b')+L(108,62,108,72,'b')+T(72,96,'QKD',11,'tb')+T(72,110,'par la physique',9,'tm')+P('M150 32 L178 42 V68 Q178 94 150 108 Q122 94 122 68 V42 Z','a sa')+T(150,74,'PQC',11,'ta')+T(150,126,'par les maths',9,'tm'),
/*50*/()=>E(100,106,62,12,'b sb')+P('M78 58 Q52 82 66 98','m d w1')+P('M122 58 Q148 82 134 98','m d w1')+L(100,76,100,90,'m d w1')+R(78,46,44,24,'a sa',3)+L(100,46,100,70,'a w1')+T(89,62,'N',10,'ta')+T(111,62,'S',10,'ta')+T(100,134,'un aimant en lévitation',10,'tm')
];

const TXT=[
['Quantification','Certaines grandeurs, comme l’énergie, ne varient pas de façon continue : elles ne prennent que des valeurs discrètes, par paquets appelés quanta.'],
['Constante de Planck','La constante fondamentale h ≈ 6,626 × 10⁻³⁴ J·s, qui fixe l’échelle de tous les effets quantiques. Sa petitesse explique pourquoi ils passent inaperçus à notre échelle.'],
['Photon','Le quantum de lumière. Son énergie est proportionnelle à sa fréquence : E = h·f. Une lumière plus bleue transporte des photons plus énergétiques.'],
['Effet photoélectrique','La lumière n’arrache des électrons à un métal qu’au-delà d’une certaine fréquence, quelle que soit son intensité. Einstein l’a expliqué en 1905 par les photons.'],
['Dualité onde-particule','Tout objet quantique montre des aspects d’onde (il interfère) et de particule (il laisse des impacts ponctuels), selon l’expérience réalisée.'],
['Longueur d’onde de de Broglie','Toute particule de masse m et de vitesse v a une longueur d’onde λ = h / (m·v). Plus l’objet est lourd ou rapide, plus elle est petite.'],
['Niveaux d’énergie et spectres','Les électrons d’un atome n’occupent que des niveaux d’énergie précis. En sautant de l’un à l’autre, ils émettent ou absorbent un photon d’une couleur bien définie.'],
['Fentes d’Young','Des particules envoyées une à une vers deux fentes dessinent peu à peu des franges d’interférence : chacune interfère avec elle-même.'],
['État quantique','La description complète d’un système à un instant donné. Mathématiquement, c’est un vecteur, noté |ψ⟩.'],
['Espace de Hilbert','L’espace mathématique, souvent de dimension immense voire infinie, dans lequel vivent les vecteurs d’état.'],
['Notation de Dirac','La notation « bra-ket » : |ψ⟩ (ket) désigne un état, ⟨φ| (bra) son dual, et ⟨φ|ψ⟩ leur produit, qui donne une amplitude.'],
['Fonction d’onde','L’état exprimé en fonction de la position, ψ(x). Elle s’étale dans l’espace et peut osciller.'],
['Amplitude de probabilité','Un nombre complexe associé à chaque possibilité. Il a une grandeur et une phase, et peut donc s’additionner ou s’annuler avec d’autres amplitudes.'],
['Règle de Born','La probabilité d’un résultat est le carré du module de son amplitude : P = |ψ|². C’est le pont entre le formalisme et ce qu’on mesure.'],
['Superposition','Un état peut être une combinaison de plusieurs états à la fois, comme α|0⟩ + β|1⟩, tant qu’on ne le mesure pas.'],
['Interférence et phase','Selon leur phase relative, les amplitudes se renforcent ou s’annulent. C’est le moteur de presque tous les effets quantiques, et des algorithmes quantiques.'],
['Équation de Schrödinger','L’équation qui gouverne l’évolution d’un état dans le temps : iħ ∂ψ/∂t = Ĥψ, où Ĥ représente l’énergie du système.'],
['Évolution unitaire','Entre deux mesures, l’état évolue de façon continue, déterministe et réversible. Aucune information n’est perdue.'],
['Observable','Une grandeur mesurable (énergie, position, spin), représentée par un opérateur qui agit sur les états.'],
['États propres et valeurs propres','Les seuls résultats possibles d’une mesure sont les valeurs propres de l’opérateur. Juste après, le système se trouve dans l’état propre correspondant.'],
['Mesure','La mesure donne un résultat aléatoire et fait « s’effondrer » la superposition sur l’état correspondant. On parle de réduction du paquet d’ondes.'],
['Problème de la mesure','La question ouverte de savoir pourquoi la mesure semble obéir à une autre règle que l’évolution de Schrödinger, et où passe la frontière entre les deux.'],
['Principe d’incertitude','Position et quantité de mouvement ne peuvent pas être toutes deux parfaitement définies : Δx·Δp ≥ ħ/2. Ce n’est pas une limite des instruments.'],
['Non-commutation','Appliquer deux opérations dans un ordre ou dans l’autre ne donne pas le même résultat. C’est l’origine mathématique du principe d’incertitude.'],
['Complémentarité','L’idée de Bohr : les aspects onde et particule sont complémentaires. Une expérience peut révéler l’un ou l’autre, jamais les deux en même temps.'],
['Décohérence','Les interactions avec l’environnement détruisent très vite les superpositions. C’est pourquoi le monde à notre échelle paraît classique.'],
['Chat de Schrödinger','L’expérience de pensée de 1935 : un chat enfermé, dont le sort dépend d’un atome, serait à la fois mort et vivant. Elle souligne le problème de la mesure.'],
['Théorème de non-clonage','Il est impossible de copier parfaitement un état quantique inconnu. Cela complique la correction d’erreurs et fonde la sécurité de la distribution quantique de clés.'],
['Interprétations','Copenhague, Everett (multivers), Bohm (onde pilote), effondrement objectif, QBism : mêmes prédictions, visions différentes de la réalité.'],
['Spin','Un moment cinétique intrinsèque, sans équivalent classique exact. Mesuré selon un axe, celui de l’électron ne vaut que « haut » ou « bas ».'],
['Fermions et bosons','Les fermions (spin demi-entier : électrons, quarks) forment la matière. Les bosons (spin entier : photons, gluons) transmettent les interactions et peuvent s’empiler dans le même état.'],
['Principe d’exclusion de Pauli','Deux fermions identiques ne peuvent pas occuper le même état quantique. Cela structure les couches électroniques, donc toute la chimie.'],
['Particules indiscernables','Deux électrons sont strictement identiques : les échanger ne change rien à l’état. Cela modifie profondément la façon de les compter.'],
['Effet tunnel','Une particule peut franchir une barrière d’énergie qu’elle ne pourrait pas passer classiquement. Il fait briller le Soleil et fonctionner les mémoires flash.'],
['Énergie du point zéro','Même au zéro absolu, un système quantique garde une énergie minimale non nulle. Le vide lui-même fluctue.'],
['Théorie quantique des champs','Le cadre qui réunit quantique et relativité restreinte. Les particules y sont des excitations de champs qui remplissent l’espace. C’est la base du Modèle standard.'],
['Intrication','Deux systèmes partagent un même état global : leurs mesures restent corrélées même très loin l’une de l’autre, sans que chacun ait d’état propre bien défini.'],
['Paradoxe EPR','L’argument d’Einstein, Podolsky et Rosen (1935) : l’intrication montrerait que la quantique est incomplète et cache des propriétés préexistantes.'],
['Variables cachées locales','L’hypothèse que des propriétés invisibles, fixées à l’avance et sans influence à distance, expliqueraient les corrélations de l’intrication.'],
['Inégalités de Bell','Un test proposé par John Bell en 1964. Leur violation, mesurée notamment par Aspect, Clauser et Zeilinger (Nobel 2022), écarte les variables cachées locales.'],
['Non-signalisation','Malgré l’intrication, aucune information ne peut être transmise plus vite que la lumière : chaque résultat, pris seul, est purement aléatoire.'],
['Téléportation quantique','Transférer un état quantique d’un point à un autre grâce à une paire intriquée et à deux bits envoyés classiquement. L’état d’origine est détruit au passage.'],
['Qubit et sphère de Bloch','L’unité d’information quantique : α|0⟩ + β|1⟩. Son état se représente comme un point sur une sphère, la sphère de Bloch.'],
['Portes et circuits quantiques','Les opérations élémentaires sur les qubits, enchaînées en circuits. La porte Hadamard crée une superposition, la porte CNOT de l’intrication.'],
['Temps de cohérence','La durée pendant laquelle un qubit garde son état quantique avant que le bruit ne le dégrade, mesurée par les temps T1 et T2.'],
['Correction d’erreurs et qubit logique','Regrouper de nombreux qubits physiques bruités pour former un qubit logique fiable. C’est la clé des machines tolérantes aux fautes.'],
['Avantage quantique et ère NISQ','Le point où une machine quantique surpasse les ordinateurs classiques sur une tâche utile. L’ère NISQ désigne les machines bruitées actuelles, de taille intermédiaire.'],
['Algorithmes de Shor et de Grover','Shor factorise les grands nombres en temps raisonnable et menace RSA et les courbes elliptiques. Grover accélère la recherche, mais seulement de façon quadratique.'],
['Cryptographie quantique et post-quantique','La QKD (protocole BB84) échange des clés en s’appuyant sur la physique quantique. La cryptographie post-quantique utilise des algorithmes classiques conçus pour résister aux ordinateurs quantiques.'],
['Quantique macroscopique','Supraconductivité, superfluidité, condensats de Bose-Einstein, laser : des milliards de particules adoptent un comportement quantique collectif, visible à notre échelle.']
];
const THEMES=[['Fondations',1,8],['Formalisme',9,20],['Mesure',21,29],['Particules',30,36],['Intrication',37,42],['Technologies',43,50]];
const themeOf=n=>THEMES.find(t=>n>=t[1]&&n<=t[2])[0];
const CARDS=TXT.map((t,i)=>({n:i+1,term:t[0],def:t[1],theme:themeOf(i+1),art:ART[i],_svg:null}));

/* ---------- Raccordement au moteur ---------- */
window.JEU_DE_FICHES = {
  id: "quantique",
  titre: "Fiches quantiques",
  cle: "qflash-quantique-v1",          // même clé qu'avant : les marques déjà posées sont conservées
  themes: THEMES.map(t => t[0]),
  symboles: {
    "Toutes": "Ψ",
    "Fondations": "<i>h</i>",
    "Formalisme": "|<i>ψ</i>⟩",
    "Mesure": "⟨<i>A</i>⟩",
    "Particules": "½",
    "Intrication": "|Φ<sup>+</sup>⟩",
    "Technologies": "<i>H</i>",
    "À revoir": "↺"
  },
  indice: "Touchez la carte pour voir la définition",
  cartes: CARDS
};
