// Version : 1.0
/* =====================================================================
   Fiches informatiques — données des fiches
   ---------------------------------------------------------------------
   L'informatique quantique en dix thèmes, rangés comme la pile d'un
   ordinateur quantique : du qubit jusqu'aux usages et à l'infrastructure.
   Le bloc final « JEU_DE_FICHES » relie ces données au moteur js/fiches.js,
   fixe le symbole de chaque thème et le préambule affiché en haut de page.
   ===================================================================== */
const f=n=>Math.round(n*10)/10;
const P=(d,c,m,ms)=>`<path d="${d}" class="l ${c||''}"${m?` marker-end="url(#${m})"`:''}${ms?` marker-start="url(#${ms})"`:''}/>`;
const L=(x1,y1,x2,y2,c,m)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="l ${c||''}"${m?` marker-end="url(#${m})"`:''}/>`;
const C=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="l ${c||''}"/>`;
const D=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="${c||'fa'}"/>`;
const R=(x,y,w,h,c,rx)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx==null?3:rx}" class="l ${c||''}"/>`;
const B=(x,y,w,h,c)=>`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="1.5" class="${c||'fa'}"/>`;
const E=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="l ${c||''}"/>`;
const T=(x,y,s,sz,c,a)=>`<text x="${x}" y="${y}" font-size="${sz||12}" text-anchor="${a||'middle'}" class="tx ${c||''}">${s}</text>`;
const TI=(x,y,s,sz,c)=>`<text x="${x}" y="${y}" font-size="${sz||12}" text-anchor="middle" font-style="italic" class="tx ${c||''}">${s}</text>`;
/* onde : départ (x0,y0), longueur, amplitude, période, enveloppe facultative, phase */
function wv(x0,y0,len,amp,per,env,ph){ph=ph||0;let d='';for(let i=0;i<=len+0.01;i+=1.5){const u=i/len,e=env?env(u):1;d+=(i?'L':'M')+f(x0+i)+' '+f(y0-amp*e*Math.sin(2*Math.PI*i/per+ph))+' ';}return d.trim();}
/* barres verticales posées sur la ligne yb */
function barres(v,labs,X,yb,H,w,g,c,vmax){vmax=vmax||Math.max(...v);let s='';
  v.forEach((p,i)=>{const h=p/vmax*H,x=X+i*(w+g);s+=B(x,yb-h,w,h,c);if(labs&&labs[i]!=null)s+=T(f(x+w/2),yb+13,labs[i],10,'tm');});
  return s+L(X-4,yb,f(X+v.length*(w+g)),yb,'m w1');}
/* éléments de circuit */
const gate=(x,y,s,c)=>R(x-13,y-13,26,26,c+' s'+c,3)+T(x,y+5,s,13,'t'+c);
const sq=(x,y,c)=>R(x-9,y-9,18,18,c+' s'+c,2);
const meter=(x,y)=>R(x-15,y-13,30,26,'sm',3)+P(`M${x-9} ${y+7} A9 9 0 0 1 ${x+9} ${y+7}`,'w1')+L(x,y+7,x+6,y-5,'w1');
const cnot=(x,yc,yt)=>D(x,yc,4.5,'fi')+L(x,yc,x,yt+(yt>yc?10:-10))+C(x,yt,10)+L(x-10,yt,x+10,yt);
const swapX=(x,y)=>L(x-5,y-5,x+5,y+5)+L(x+5,y-5,x-5,y+5);

const CARDS_SRC=[

/* ================= Fondements ================= */
{th:'Fondements',term:'Qubit',
 fx:'|ψ⟩ = α|0⟩ + β|1⟩ ; |α|² + |β|² = 1',
 def:'L’unité d’information quantique : un système à deux niveaux notés |0⟩ et |1⟩. Ses amplitudes α et β sont des nombres complexes ; là où le bit vaut 0 ou 1, le qubit peut se trouver dans toute combinaison de ces deux états.',
 art:()=>R(22,54,56,28,'sm',4)+T(50,73,'0 ou 1',12,'tm')+T(50,104,'bit',11,'tm')+C(145,70,38,'m w1')+E(145,70,38,10,'m w1 d')+L(145,70,169,43,'a','ma')
   +T(145,24,'|0⟩',10,'tm')+T(145,124,'|1⟩',10,'tm')+T(174,40,'ψ',13,'ta','start')},

{th:'Fondements',term:'Superposition et interférence',
 def:'Un qubit peut être dans une combinaison α|0⟩ + β|1⟩, mais la mesure ne renvoie qu’un seul résultat : il n’« essaie » pas toutes les réponses à la fois. La puissance vient de l’interférence : un algorithme fait s’annuler les amplitudes des mauvaises réponses et se renforcer celles des bonnes.',
 art:()=>{let s=L(14,100,84,100,'m w1')+L(114,100,186,100,'m w1')+L(88,80,108,80,'m','mm');
   [0,1,2,3].forEach(i=>{s+=B(20+i*16,70,10,30,'fb');const h=[6,6,62,6][i];s+=B(120+i*16,100-h,10,h,i===2?'fa':'fm');});
   return s+T(49,122,'avant',10,'tm')+T(149,122,'après interférence',10,'tm');}},

{th:'Fondements',term:'Mesure d’un qubit',
 fx:'P(0) = |α|² ; P(1) = |β|²',
 def:'La mesure projette l’état sur |0⟩ ou sur |1⟩, avec les probabilités données par la règle de Born. La superposition est perdue : mesurer, c’est lire et détruire à la fois.',
 art:()=>P('M40 40 A30 30 0 0 0 40 100 Z','b sb')+P('M40 40 A30 30 0 0 1 40 100 Z','a sa')+L(76,70,94,70,'m','mm')+meter(115,70)
   +L(133,62,152,46,'m','mm')+L(133,78,152,94,'m','mm')+T(164,51,'0',16,'tb')+T(164,103,'1',16,'ta')+T(100,130,'un seul résultat',10,'tm')},

{th:'Fondements',term:'Sphère de Bloch',
 fx:'|ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩',
 def:'Une représentation géométrique du qubit : chaque état pur est un point de la surface d’une sphère. |0⟩ et |1⟩ sont aux pôles, les superpositions équilibrées sur l’équateur. Une porte à un qubit est une rotation de cette sphère.',
 art:()=>C(100,70,50)+E(100,70,50,13,'m d w1')+L(100,20,100,120,'m d w1')+D(100,70,3,'fi')+L(100,70,134,38,'a','ma')
   +P('M100 48 A22 22 0 0 1 116 55','b w1')+T(106,44,'θ',11,'tb','start')+T(100,13,'|0⟩',11)+T(100,136,'|1⟩',11)+T(146,34,'ψ',12,'ta')},

{th:'Fondements',term:'Intrication',
 fx:'|Φ<sup>+</sup>⟩ = (|00⟩ + |11⟩)/√2',
 def:'Un état de plusieurs qubits qui ne s’écrit pas comme un produit d’états individuels. Dans l’état de Bell ci-dessus, les deux mesures donnent toujours le même résultat, sans que ces corrélations permettent de transmettre un message.',
 art:()=>C(50,46,16,'a sa')+C(150,46,16,'b sb')+P(wv(66,46,68,5,17),'m d w1')+T(50,51,'A',12,'ta')+T(150,51,'B',12,'tb')
   +T(50,92,'0',14,'ta')+T(150,92,'0',14,'tb')+T(100,91,'50 %',10,'tm')+T(50,118,'1',14,'ta')+T(150,118,'1',14,'tb')+T(100,117,'50 %',10,'tm')},

{th:'Fondements',term:'Espace d’états de n qubits',
 fx:'dimension = 2<sup>n</sup>',
 def:'L’état de n qubits est décrit par 2ⁿ amplitudes : environ 10¹⁵ pour 50 qubits et, pour 300 qubits, 2³⁰⁰ ≈ 10⁹⁰, plus que le nombre d’atomes de l’univers observable. C’est ce qui rend leur simulation classique si coûteuse.',
 art:()=>barres([1,2,4,8,16,32,64],[1,2,3,4,5,6,7],40,108,84,14,6,'fb')+T(40,26,'2ⁿ amplitudes',11,'ta','start')+T(190,121,'n',11,'tm','end')},

{th:'Fondements',term:'Théorème de non-clonage',
 fx:'|ψ⟩|0⟩ ↛ |ψ⟩|ψ⟩',
 def:'Il est impossible de copier un état quantique inconnu. Pas de « copie de sauvegarde » d’un qubit, une correction d’erreurs plus subtile qu’en classique, mais aussi le fondement de la sécurité de la distribution quantique de clés.',
 art:()=>C(36,70,14,'a sa')+T(36,75,'ψ',13,'ta')+L(52,70,72,70,'m','mm')+R(75,52,50,36,'m sm',4)+T(100,74,'copie',10,'tm')
   +L(127,62,146,46,'m','mm')+L(127,78,146,94,'m','mm')+C(162,40,13,'a sa')+T(162,45,'ψ',12,'ta')+C(162,100,13,'m d w1')
   +L(152,90,172,110,'a')+L(172,90,152,110,'a')+T(100,134,'pas de copie de sauvegarde',10,'tm')},

{th:'Fondements',term:'Décohérence',
 def:'La perte progressive du caractère quantique d’un état sous l’effet de son interaction avec l’environnement : chaleur, champs parasites, vibrations. C’est l’ennemi numéro un du calcul quantique.',
 art:()=>C(100,68,24,'a sa')+T(100,74,'ψ',16,'ta')+L(36,30,80,54,'m','mm')+L(164,30,120,54,'m','mm')+L(36,110,80,84,'m','mm')+L(164,110,120,84,'m','mm')
   +T(36,22,'chaleur',9,'tm')+T(164,22,'champs parasites',9,'tm')+T(36,126,'vibrations',9,'tm')+T(164,126,'rayonnement',9,'tm')},

/* ================= Matériel ================= */
{th:'Matériel',term:'Qubits supraconducteurs (transmons)',
 fx:'T ≈ 10 mK',
 def:'Des circuits électriques à jonctions Josephson, refroidis vers 10 mK dans un cryostat à dilution. Portes rapides (quelques dizaines de nanosecondes), fabrication proche de la microélectronique. Utilisés notamment par IBM et Google.',
 art:()=>R(27,16,130,7,'sm',2)+R(37,40,110,7,'sm',2)+R(47,64,90,7,'sm',2)+R(57,88,70,7,'a sa',2)+L(66,23,66,88,'m w1')+L(118,23,118,88,'m w1')
   +L(92,95,92,104,'a w1')+R(82,104,20,14,'a sa',2)+T(162,22,'300 K',9,'tm','start')+T(162,46,'4 K',9,'tm','start')+T(162,70,'100 mK',9,'tm','start')
   +T(162,94,'10 mK',9,'ta','start')+T(92,134,'cryostat à dilution',9,'tm')},

{th:'Matériel',term:'Ions piégés',
 def:'Des ions maintenus par des champs électromagnétiques et manipulés par laser. Excellente fidélité et connectivité totale entre qubits, mais portes plus lentes. Acteurs : Quantinuum, IonQ.',
 art:()=>{let s=R(20,26,82,8,'sm',2)+R(122,26,58,8,'sm',2)+R(20,106,160,8,'sm',2);[40,64,88,112,136,160].forEach(x=>s+=D(x,70,5,'fa'));
   return s+L(112,8,112,60,'b','mb')+T(118,16,'laser',9,'tb','start')+T(100,132,'chaîne d’ions piégés',9,'tm');}},

{th:'Matériel',term:'Atomes neutres',
 def:'Des atomes retenus par des « pinces optiques » (faisceaux laser focalisés) et intriqués en les excitant dans des états de Rydberg. On en dispose des centaines, voire des milliers, en réseaux reconfigurables. Acteurs : Pasqal (France), QuEra, Atom Computing.',
 art:()=>{let s='';[40,70,100,130,160].forEach(x=>[30,55,80,105].forEach(y=>{const r=(y===55&&(x===100||x===130));s+=D(x,y,r?5:3.5,r?'fa':'fb');}));
   return s+E(115,55,27,13,'a d w1')+T(100,132,'atomes en pinces optiques',9,'tm');}},

{th:'Matériel',term:'Photons, spins et qubits topologiques',
 def:'Les photons (Quandela en France, PsiQuantum, Xanadu) ; les spins d’électrons dans le silicium, compatibles avec l’industrie CMOS (Quobly en France, Intel) ; les qubits topologiques, protégés du bruit par construction, encore au stade de la recherche (Microsoft).',
 art:()=>P(wv(14,60,52,10,10,u=>Math.sin(Math.PI*u)),'a')+C(100,60,16,'b sb')+L(100,74,100,46,'b','mb')
   +P('M142 42 C158 42, 164 78, 180 78','a')+P('M142 78 C158 78, 164 42, 180 42','m')
   +T(40,100,'photons',10,'ta')+T(100,100,'spins',10,'tb')+T(161,100,'topologiques',10,'tm')},

{th:'Matériel',term:'Temps T1 et T2',
 fx:'T<sub>2</sub> ≤ 2 T<sub>1</sub>',
 def:'T1 est le temps de relaxation, pendant lequel un |1⟩ retombe en |0⟩ ; T2 le temps de cohérence de phase, pendant lequel la superposition reste exploitable. Ils bornent le nombre d’opérations réalisables.',
 art:()=>{let d='';for(let x=20;x<=180;x+=4)d+=(x===20?'M':'L')+x+' '+f(62-40*Math.exp(-(x-20)/45))+' ';
   return L(20,62,180,62,'m w1 d')+P(d.trim(),'a')+T(186,66,'T₁',11,'ta','start')+P(wv(20,100,160,22,20,u=>Math.exp(-2.6*u)),'b')
     +T(186,104,'T₂',11,'tb','start')+T(100,136,'relaxation et perte de phase',9,'tm');}},

{th:'Matériel',term:'Fidélité de porte',
 fx:'0,999<sup>10 000</sup> ≈ 4,5 × 10<sup>−5</sup>',
 def:'La probabilité qu’une opération se déroule sans erreur. À 99,9 %, on compte environ une erreur toutes les 1 000 portes : un circuit de 10 000 portes n’aurait quasiment aucune chance d’aboutir sans correction d’erreurs.',
 art:()=>{let d='';for(let i=0;i<=150;i+=3)d+=(i?'L':'M')+f(30+i)+' '+f(110-88*Math.pow(0.999,i/150*5000))+' ';
   const y1=f(110-88*Math.pow(0.999,1000));
   return L(30,110,186,110,'m w1','mm')+L(30,110,30,14,'m w1','mm')+P(d.trim(),'a')+P(`M60 110 V${y1} H30`,'m d w1')+D(60,y1,3.5,'fa')
     +T(60,124,'1 000',9,'tm')+T(36,22,'probabilité de succès',9,'tm','start')+T(186,124,'portes',9,'tm','end')+T(66,70,'≈ 37 %',9,'ta','start');}},

{th:'Matériel',term:'Au-delà du nombre de qubits',
 def:'Le nombre de qubits ne suffit pas à comparer deux machines : comptent aussi la fidélité des portes, la connectivité, la vitesse, le temps de cohérence et la qualité de la lecture. Cent qubits très bruités valent moins que cinquante qubits excellents.',
 art:()=>{const cx=100,cy=70,r=46,labs=['qubits','fidélité','connectivité','vitesse','cohérence'],A=[.95,.35,.4,.6,.35],Bv=[.5,.9,.85,.65,.85];
   const pt=(k,v)=>{const a=(-90+72*k)*Math.PI/180;return [f(cx+r*v*Math.cos(a)),f(cy+r*v*Math.sin(a))];};let s='';
   for(let k=0;k<5;k++){const p=pt(k,1);s+=L(cx,cy,p[0],p[1],'m w1');const a=(-90+72*k)*Math.PI/180,x=cx+(r+8)*Math.cos(a),y=cy+(r+8)*Math.sin(a)+3;
     s+=T(f(x),f(y),labs[k],9,'tm',x<cx-5?'end':x>cx+5?'start':'middle');}
   s+=P('M'+A.map((v,k)=>pt(k,v).join(' ')).join(' L')+' Z','b')+P('M'+Bv.map((v,k)=>pt(k,v).join(' ')).join(' L')+' Z','a');
   return s;}},

/* ================= Portes et circuits ================= */
{th:'Portes et circuits',term:'Porte de Hadamard',
 fx:'H|0⟩ = (|0⟩ + |1⟩)/√2 ; H|1⟩ = (|0⟩ − |1⟩)/√2',
 def:'La porte qui crée une superposition équilibrée à partir de |0⟩ ou de |1⟩. Appliquée deux fois, elle redonne l’état de départ : H² = I.',
 art:()=>T(22,74,'|0⟩',12,'tm')+L(36,70,146,70,'m w1')+gate(80,70,'H','a')+P('M165 54 A16 16 0 0 0 165 86 Z','b sb')+P('M165 54 A16 16 0 0 1 165 86 Z','a sa')
   +T(100,122,'moitié |0⟩, moitié |1⟩',10,'tm')},

{th:'Portes et circuits',term:'Portes de Pauli X et Z',
 fx:'X|0⟩ = |1⟩ ; Z|1⟩ = −|1⟩',
 def:'X échange |0⟩ et |1⟩ : c’est le NOT quantique, un demi-tour de la sphère de Bloch autour de l’axe x. Z laisse |0⟩ inchangé et change le signe de |1⟩ : elle inverse la phase, une opération sans équivalent classique.',
 art:()=>T(22,44,'|0⟩',12,'tm')+L(38,40,162,40,'m w1')+gate(100,40,'X','a')+T(178,44,'|1⟩',12,'ta')
   +T(22,98,'|1⟩',12,'tm')+L(38,94,162,94,'m w1')+gate(100,94,'Z','b')+T(178,98,'−|1⟩',12,'tb')+T(100,132,'inverser le bit, inverser la phase',9,'tm')},

{th:'Portes et circuits',term:'Porte CNOT',
 fx:'|a, b⟩ ↦ |a, a ⊕ b⟩',
 def:'Une porte à deux qubits : elle inverse le qubit cible si le qubit de contrôle vaut 1. Précédée d’une porte H, elle transforme |00⟩ en état de Bell : c’est la recette de base de l’intrication.',
 art:()=>T(14,49,'|0⟩',10,'tm','start')+T(14,99,'|0⟩',10,'tm','start')+L(34,45,158,45,'m w1')+L(34,95,158,95,'m w1')+gate(70,45,'H','a')+cnot(120,45,95)
   +P('M164 40 Q172 70 164 100','m w1')+T(176,74,'Bell',9,'tb','start')+T(100,130,'H puis CNOT',10,'tm')},

{th:'Portes et circuits',term:'Portes unitaires et réversibilité',
 fx:'U<sup>†</sup>U = I',
 def:'Toute porte quantique est une opération unitaire : elle conserve la norme de l’état (la somme des probabilités reste égale à 1) et possède une inverse. Seule la mesure est irréversible.',
 art:()=>T(18,74,'|ψ⟩',12,'ta')+L(34,70,166,70,'m w1')+gate(75,70,'U','a')+gate(125,70,'U†','b')+T(182,74,'|ψ⟩',12,'ta')
   +T(100,118,'on revient exactement au départ',10,'tm')},

{th:'Portes et circuits',term:'Jeu de portes universel',
 fx:'{H, S, T, CNOT}',
 def:'Un petit ensemble de portes qui permet d’approcher n’importe quelle opération quantique. Sans la porte T, le jeu de Clifford se simule efficacement sur un ordinateur classique (théorème de Gottesman-Knill) : c’est elle qui apporte la puissance.',
 art:()=>gate(35,60,'H','b')+gate(75,60,'S','b')+gate(115,60,'T','a')+D(160,46,4,'fi')+L(160,46,160,85)+C(160,76,9)+L(151,76,169,76)
   +T(100,118,'Clifford + T = universel',10,'tm')},

{th:'Portes et circuits',term:'Profondeur d’un circuit',
 def:'Le nombre de couches de portes à exécuter successivement. Elle doit rester assez faible pour que le calcul se termine avant que la décohérence efface l’information.',
 art:()=>{let s='';[30,60,90].forEach(y=>s+=L(20,y,180,y,'m w1'));
   s+=sq(45,30,'a')+sq(45,90,'a')+sq(85,60,'b')+cnot(125,30,60)+sq(125,90,'a')+sq(165,60,'b');
   return s+P('M30 112 H180','m','mm','mm')+T(105,130,'profondeur : 4 couches',10,'tm');}},

{th:'Portes et circuits',term:'Transpilation',
 def:'La traduction d’un circuit abstrait en portes natives du processeur, en tenant compte de sa connectivité. Si deux qubits ne sont pas voisins, on insère des portes SWAP, ce qui allonge le circuit.',
 art:()=>{let s='';[40,70,100].forEach(y=>s+=L(14,y,72,y,'m w1')+L(118,y,190,y,'m w1'));
   s+=cnot(44,40,100)+swapX(138,40)+swapX(138,70)+L(138,40,138,70)+cnot(168,70,100);
   return s+L(80,70,108,70,'m','mm')+T(43,128,'idéal',10,'tm')+T(154,128,'avec SWAP',10,'tm');}},

/* ================= Correction d'erreurs ================= */
{th:'Correction d’erreurs',term:'Correction d’erreurs quantiques',
 def:'Plus difficile qu’en classique : on ne peut ni copier un qubit (non-clonage), ni le mesurer sans le perturber, et les erreurs sont continues (petites rotations). On répartit donc l’information de façon redondante et intriquée sur plusieurs qubits, puis on détecte les erreurs indirectement.',
 art:()=>C(35,70,16,'a sa')+T(35,75,'ψ',13,'ta')+L(54,70,82,70,'m','mm')+C(110,36,12,'b sb')+C(110,70,12,'b sb')+C(110,104,12,'b sb')
   +P('M122 36 Q140 70 122 104','m d w1')+T(146,74,'encodage',10,'tm','start')},

{th:'Correction d’erreurs',term:'Qubit physique et qubit logique',
 def:'Le qubit physique est le composant matériel, bruité. Le qubit logique est encodé dans de nombreux qubits physiques et protégé par un code correcteur : ce sont les qubits logiques qui comptent pour les grands algorithmes.',
 art:()=>{let s=R(18,30,78,78,'m d w1',12);[38,57,76].forEach(x=>[49,69,89].forEach(y=>s+=C(x,y,6,'b sb')));
   return s+L(102,69,126,69,'m','mm')+C(156,69,22,'a sa')+T(156,75,'L',15,'ta')+T(57,128,'qubits physiques',9,'tb')+T(156,128,'qubit logique',9,'ta');}},

{th:'Correction d’erreurs',term:'Mesure de syndrome',
 def:'Une mesure de parités réalisée sur des qubits auxiliaires (ancillas). Elle révèle quelle erreur s’est produite sans révéler, donc sans détruire, l’information encodée.',
 art:()=>{let s='';[[60,40],[140,40],[60,100],[140,100]].forEach(([x,y])=>s+=L(100,70,x,y,'m d w1')+C(x,y,9,'b sb'));
   return s+L(107,70,152,70,'a w1')+D(100,70,7,'fa')+meter(170,70)+T(30,74,'données',9,'tb')+T(100,132,'lire la parité, pas l’état',9,'tm');}},

{th:'Correction d’erreurs',term:'Théorème du seuil',
 fx:'p<sub>L</sub> ∝ (p / p<sub>seuil</sub>)<sup>(d+1)/2</sup>',
 def:'Si le taux d’erreur physique p est inférieur à un seuil, agrandir le code (augmenter sa distance d) fait baisser exponentiellement l’erreur logique. Au-dessus du seuil, ajouter des qubits aggrave la situation.',
 art:()=>L(30,112,185,112,'m w1','mm')+L(30,112,30,14,'m w1','mm')+P('M60 40 L95 60 L130 80 L165 100','a')+P('M60 60 L95 48 L130 36 L165 24','b')
   +[[60,40],[95,60],[130,80],[165,100]].map(([x,y])=>D(x,y,3,'fa')).join('')+[[60,60],[95,48],[130,36],[165,24]].map(([x,y])=>D(x,y,3,'fb')).join('')
   +T(70,100,'sous le seuil',9,'ta')+T(184,62,'au-dessus',9,'tb','end')+T(36,22,'erreur logique',9,'tm','start')+T(185,128,'distance d',9,'tm','end')},

{th:'Correction d’erreurs',term:'Code de surface',
 fx:'2d² − 1 qubits pour une distance d',
 def:'Un code où les qubits forment une grille 2D et n’interagissent qu’avec leurs voisins. Son seuil est d’environ 1 %, mais il demande de l’ordre de centaines à milliers de qubits physiques par qubit logique.',
 art:()=>{let s=R(60,30,40,40,'sa',0)+R(100,30,40,40,'sb',0)+R(60,70,40,40,'sb',0)+R(100,70,40,40,'sa',0);
   [[80,50,'fa'],[120,50,'fb'],[80,90,'fb'],[120,90,'fa']].forEach(([x,y,c])=>s+=D(x,y,4,c));
   [60,100,140].forEach(x=>[30,70,110].forEach(y=>s+=D(x,y,4.5,'fi')));
   return s+T(100,134,'données aux sommets, mesures au centre',9,'tm');}},

{th:'Correction d’erreurs',term:'Puce Willow (Google, 2024)',
 fx:'Λ ≈ 2 : erreur divisée par deux à chaque palier',
 def:'En décembre 2024, Google montre qu’en agrandissant le code de surface (distance 3, puis 5, puis 7), l’erreur logique diminue d’environ moitié à chaque étape : une démonstration convaincante du fonctionnement « sous le seuil ».',
 art:()=>barres([4,2,1],['d = 3','d = 5','d = 7'],45,108,80,28,22,'fa')+T(100,18,'erreur logique',10,'tm')+T(84,50,'÷ 2',10,'tb')+T(134,80,'÷ 2',10,'tb')},

{th:'Correction d’erreurs',term:'Qubits de chat',
 def:'Des qubits encodés dans deux états opposés d’un oscillateur supraconducteur, qui suppriment très fortement un type d’erreur (le basculement de bit). Il reste un seul type d’erreur à corriger, ce qui réduit le nombre de qubits nécessaires. Approche portée par Alice & Bob (Paris).',
 art:()=>L(20,70,180,70,'m w1 d')+L(100,20,100,120,'m w1 d')+E(58,70,18,18,'b sb')+E(142,70,18,18,'b sb')
   +T(58,104,'|−α⟩',11,'tb')+T(142,104,'|α⟩',11,'tb')+T(100,132,'deux états cohérents opposés',9,'tm')},

/* ================= Algorithmes ================= */
{th:'Algorithmes',term:'Algorithme de Deutsch-Jozsa (1992)',
 fx:'1 appel au lieu de 2<sup>n−1</sup> + 1',
 def:'Il décide si une fonction « boîte noire » est constante ou équilibrée en un seul appel, quand un algorithme classique déterministe en exige exponentiellement plus. Problème artificiel, mais première preuve d’une accélération exponentielle.',
 art:()=>L(24,70,72,70,'a','ma')+R(76,44,48,52,'sm',4)+TI(100,78,'f',22)+L(126,62,148,46,'m','mm')+L(126,78,148,94,'m','mm')
   +T(152,46,'constante',9,'tm','start')+T(152,98,'équilibrée',9,'tm','start')+T(100,128,'un seul appel suffit',10,'tm')},

{th:'Algorithmes',term:'Algorithme de Shor (1994)',
 fx:'N = p × q',
 def:'Il factorise un entier et calcule des logarithmes discrets en temps polynomial, en ramenant le problème à la recherche de la période d’une fonction grâce à la transformée de Fourier quantique. Il menace RSA, Diffie-Hellman et la cryptographie sur courbes elliptiques.',
 art:()=>barres([1,7,4,13,1,7,4,13],null,24,100,70,14,6,'fb')+P('M24 108 V114 H98 V108','a w1')+T(61,128,'période r',10,'ta')+T(150,128,'a<tspan baseline-shift="super" font-size="70%">x</tspan> mod N',10,'tm')},

{th:'Algorithmes',term:'Algorithme de Grover (1996)',
 fx:'≈ (π/4)√N itérations',
 def:'Il trouve un élément marqué dans un ensemble non structuré de N éléments en environ √N étapes au lieu de N. L’accélération est quadratique, et on sait qu’on ne peut pas faire mieux pour ce problème.',
 art:()=>{let s=L(20,110,180,110,'m w1');[10,10,10,10,10,64,10,10].forEach((h,i)=>s+=B(26+i*19,110-h,11,h,i===5?'fa':'fb'));
   return s+T(100,130,'l’amplitude de la bonne réponse grandit',9,'tm');}},

{th:'Algorithmes',term:'Transformée de Fourier quantique',
 fx:'|j⟩ ↦ (1/√N) Σ<sub>k</sub> e<sup>2πijk/N</sup> |k⟩',
 def:'L’équivalent quantique de la transformée de Fourier discrète, réalisée sur n qubits en environ n² portes, contre n·2ⁿ opérations pour la FFT classique. Ses résultats ne se lisent pas directement : elle sert de brique dans Shor et dans l’estimation de phase.',
 art:()=>P(wv(14,70,70,18,23),'b')+L(92,70,112,70,'m','mm')+L(120,110,190,110,'m w1')+L(140,110,140,44,'a')+L(172,110,172,44,'a')+D(140,44,3,'fa')+D(172,44,3,'fa')
   +T(49,118,'signal',10,'tb')+T(156,128,'fréquences',10,'ta')},

{th:'Algorithmes',term:'Estimation de phase',
 fx:'U|u⟩ = e<sup>2πiφ</sup>|u⟩',
 def:'Un algorithme qui extrait la phase φ, c’est-à-dire la valeur propre, d’une opération unitaire. C’est le cœur de Shor et des calculs d’énergie en chimie quantique.',
 art:()=>C(100,66,46,'m w1')+L(44,66,156,66,'m w1 d')+L(100,66,132.5,33.5,'a','ma')+P('M124 66 A24 24 0 0 0 117 49','b w1')+T(128,58,'2πφ',10,'tb','start')
   +D(100,66,3,'fi')+T(100,132,'lire une phase sur le cercle',9,'tm')},

{th:'Algorithmes',term:'Simulation de systèmes quantiques',
 def:'L’idée fondatrice de Feynman (1981) : utiliser des systèmes quantiques pour simuler des systèmes quantiques, comme les molécules et les matériaux, trop coûteux pour un ordinateur classique. C’est l’application la plus naturelle du calcul quantique.',
 art:()=>{let s=L(40,44,72,74,'m')+L(72,74,40,104,'m')+D(40,44,8,'fb')+D(72,74,10,'fa')+D(40,104,8,'fb')+P('M94 74 H120','m','mm','mm')+R(128,50,50,48,'sm',4);
   [141,153,165].forEach(x=>[62,74,86].forEach(y=>s+=D(x,y,2.5,'fa')));return s+T(100,132,'la nature simulée par la nature',9,'tm');}},

{th:'Algorithmes',term:'Algorithmes variationnels (VQE, QAOA)',
 def:'Des algorithmes hybrides : un circuit quantique paramétré est exécuté, puis un optimiseur classique ajuste ses paramètres, en boucle. Conçus pour les machines bruitées actuelles, ils n’ont pas encore démontré d’avantage net.',
 art:()=>R(20,48,60,44,'a sa',6)+T(50,75,'QPU',12,'ta')+R(120,48,60,44,'b sb',6)+T(150,75,'CPU',12,'tb')
   +P('M60 46 Q100 16 140 46','m','mm')+P('M140 94 Q100 124 60 94','m','mm')+T(100,22,'mesures',9,'tm')+T(100,126,'nouveaux paramètres θ',9,'tm')},

{th:'Algorithmes',term:'Algorithme HHL (2009)',
 fx:'A x = b',
 def:'Il résout des systèmes linéaires avec une accélération exponentielle, mais sous conditions strictes : données déjà chargées dans un état quantique, matrice bien conditionnée, et une sortie qui n’est pas la solution complète, seulement un état dont on extrait des statistiques.',
 art:()=>TI(100,62,'A x = b',26)+R(8,88,56,22,'sm',4)+T(36,103,'chargement',8,'tm')+R(70,88,72,22,'sm',4)+T(106,103,'conditionnement',8,'tm')
   +R(148,88,44,22,'sm',4)+T(170,103,'lecture',8,'tm')+T(100,130,'trois conditions à réunir',9,'tm')},

/* ================= Complexité ================= */
{th:'Complexité',term:'Classe BQP',
 fx:'P ⊆ BPP ⊆ BQP ⊆ PSPACE',
 def:'L’ensemble des problèmes qu’un ordinateur quantique résout en temps polynomial avec une probabilité d’erreur bornée. La factorisation y appartient ; on pense que les problèmes NP-complets n’y sont pas.',
 art:()=>E(100,74,94,62,'m w1')+T(100,24,'PSPACE',9,'tm')+E(82,82,62,42,'a')+T(44,62,'BQP',10,'ta')+E(132,80,52,38,'b d')+T(166,62,'NP',10,'tb')
   +E(68,92,34,24,'m w1')+T(68,82,'BPP',9,'tm')+E(64,104,16,9,'m w1')+T(64,107,'P',8,'tm')+D(116,90,3,'fi')+T(118,106,'factorisation',8,'tx')},

{th:'Complexité',term:'Quantique et problèmes NP-complets',
 def:'On ne pense pas qu’un ordinateur quantique les résolve efficacement : aucun algorithme connu ne le fait, et Grover n’offre qu’une accélération quadratique sur la recherche exhaustive. Le calcul quantique n’est pas « l’essai de toutes les solutions en parallèle ».',
 art:()=>{const cur=(g,c)=>{let d='';for(let i=0;i<=150;i+=2){const n=i/150*20,y=112-g(n);if(y<16)break;d+=(i?'L':'M')+f(25+i)+' '+f(y)+' ';}return P(d.trim(),c);};
   return L(25,112,185,112,'m w1','mm')+L(25,112,25,14,'m w1','mm')+cur(n=>Math.pow(2,n)/12,'b')+cur(n=>Math.pow(2,n/2)/12,'a')+cur(n=>n*n*n/400,'m')
     +T(106,28,'2ⁿ',11,'tb','start')+T(140,22,'Grover : √2ⁿ',9,'ta')+T(186,86,'polynôme',9,'tm','end')+T(185,126,'taille n',9,'tm','end');}},

{th:'Complexité',term:'Avantage quantique',
 def:'L’exécution d’une tâche hors de portée des meilleurs ordinateurs classiques. Google l’annonce en 2019 avec Sycamore (53 qubits) sur un problème d’échantillonnage aléatoire ; de meilleures simulations classiques ont ensuite réduit l’écart. Un avantage sur un problème utile reste à établir.',
 art:()=>T(30,34,'supercalculateur',9,'tb','start')+R(30,40,150,18,'b sb',3)+T(30,80,'processeur quantique',9,'ta','start')+R(30,86,12,18,'a sa',3)
   +T(100,128,'temps pour une même tâche',9,'tm')},

{th:'Complexité',term:'Ère NISQ',
 def:'Noisy Intermediate-Scale Quantum, terme de John Preskill (2018) : des machines de quelques dizaines à quelques milliers de qubits bruités, sans correction d’erreurs complète. C’est l’ère actuelle, en transition vers la tolérance aux fautes.',
 art:()=>P('M14 70 H188','m w1','mm')+R(20,58,80,24,'b sb',4)+T(60,74,'NISQ',11,'tb')+R(110,58,72,24,'a sa',4)+T(146,74,'tolérant',11,'ta')
   +T(60,44,'aujourd’hui',9,'tm')+T(146,44,'objectif',9,'tm')+T(60,100,'bruité, sans correction',8,'tm')+T(146,100,'qubits logiques',8,'tm')},

{th:'Complexité',term:'Le goulot du chargement des données',
 def:'Charger N données classiques dans un état quantique coûte en général un temps proportionnel à N, et la mesure ne restitue que peu d’information. Les meilleurs cas d’usage ont une entrée petite et un calcul très difficile.',
 art:()=>{let s='';for(let i=0;i<4;i++)for(let j=0;j<5;j++)s+=D(18+i*12,30+j*20,3,'fb');
   return s+P('M70 26 L112 60 V80 L70 114','m')+L(116,70,130,70,'m','mm')+R(134,50,40,40,'a sa',4)+T(154,75,'QPU',10,'ta')+T(100,134,'beaucoup de données, peu de débit',9,'tm');}},

{th:'Complexité',term:'Ordinateur tolérant aux fautes',
 def:'Une machine dont les qubits logiques, corrigés en continu, peuvent exécuter des circuits arbitrairement longs. C’est la condition pour faire tourner Shor ou des simulations chimiques à grande échelle.',
 art:()=>{let s=L(20,50,180,50,'a')+L(20,90,180,90,'a');for(let x=35;x<=165;x+=26)s+=R(x-6,44,12,12,'b sb',2)+R(x-6,84,12,12,'b sb',2);
   return s+T(100,124,'corrections répétées, circuit sans limite',9,'tm');}},

/* ================= Logiciel et cloud ================= */
{th:'Logiciel et cloud',term:'Kits de développement quantique',
 def:'Qiskit (IBM, Python), Cirq (Google), CUDA-Q (NVIDIA, orienté hybride GPU-QPU), PennyLane (Xanadu, apprentissage automatique), Q# (Microsoft) et myQLM (Eviden) permettent d’écrire des circuits et de les exécuter sur simulateur ou sur machine réelle.',
 art:()=>R(18,20,164,100,'sm',6)+D(30,30,2.5,'fm')+D(38,30,2.5,'fm')+D(46,30,2.5,'fm')+T(30,54,'qc = QuantumCircuit(2)',9,'tb','start')
   +T(30,72,'qc.h(0)',9,'ta','start')+T(30,90,'qc.cx(0, 1)',9,'ta','start')+T(30,108,'qc.measure_all()',9,'tm','start')},

{th:'Logiciel et cloud',term:'QPU',
 def:'Une Quantum Processing Unit : un coprocesseur piloté par un ordinateur classique, comme un GPU. L’hôte prépare le circuit, l’envoie, récupère les mesures et les traite.',
 art:()=>R(20,40,70,60,'b sb',6)+T(55,74,'hôte',11,'tb')+R(130,48,50,44,'a sa',6)+T(155,74,'QPU',11,'ta')+P('M92 62 H126','m','mm')+P('M128 82 H94','m','mm')
   +T(110,56,'circuit',8,'tm')+T(110,96,'mesures',8,'tm')},

{th:'Logiciel et cloud',term:'Exécutions répétées (shots)',
 fx:'erreur statistique ∝ 1/√(nombre de shots)',
 def:'Chaque exécution d’un circuit ne donne qu’un résultat aléatoire. On le répète des centaines ou des milliers de fois pour estimer la distribution de probabilités des résultats.',
 art:()=>barres([480,20,30,470],['00','01','10','11'],40,104,78,24,12,'fb')+T(100,18,'1 000 exécutions',10,'tm')},

{th:'Logiciel et cloud',term:'Accès par le cloud',
 def:'La plupart des ordinateurs quantiques s’utilisent à distance : IBM Quantum, Amazon Braket, Azure Quantum… On soumet des circuits à une file d’attente, et on paie au temps ou au nombre d’exécutions.',
 art:()=>P('M62 66 Q56 44 78 44 Q86 26 108 32 Q132 24 136 46 Q156 48 150 66 Z','b sb')+T(104,58,'cloud',10,'tb')+R(14,96,46,28,'m w1',3)+T(37,114,'vous',9,'tm')
   +R(142,94,40,30,'a sa',4)+T(162,113,'QPU',9,'ta')+L(46,92,70,70,'m','mm')+L(132,70,154,90,'m','mm')},

{th:'Logiciel et cloud',term:'Simuler des qubits sur ordinateur classique',
 fx:'mémoire = 2<sup>n</sup> × 16 octets',
 def:'Stocker l’état complet de n qubits demande 2ⁿ amplitudes de 16 octets : 30 qubits occupent 16 Gio, 40 qubits 16 Tio. Au-delà d’une cinquantaine de qubits, il faut des méthodes approchées, comme les réseaux de tenseurs.',
 art:()=>B(40,84,30,24,'fb')+B(90,56,30,52,'fb')+B(140,28,30,80,'fa')+L(30,108,180,108,'m w1')+T(55,78,'16 Gio',9,'tm')+T(105,50,'512 Gio',9,'tm')
   +T(155,22,'16 Tio',9,'ta')+T(55,122,'30 qubits',9,'tm')+T(105,122,'35 qubits',9,'tm')+T(155,122,'40 qubits',9,'tm')},

{th:'Logiciel et cloud',term:'Intégration HPC-quantique',
 def:'Coupler des QPU à des supercalculateurs pour qu’ils travaillent dans un même flux de calcul, avec un ordonnanceur commun. Plusieurs centres européens, dans le cadre d’EuroHPC, accueillent ou connectent déjà des machines quantiques.',
 art:()=>{let s=R(20,26,90,90,'sm',4);for(let y=40;y<=104;y+=12)s+=L(28,y,102,y,'m w1');
   return s+L(114,70,136,70,'m','mm')+R(142,30,40,6,'a sa',1)+R(148,52,28,6,'a sa',1)+R(154,74,16,6,'a sa',1)+L(156,36,156,74,'a w1')+L(168,36,168,74,'a w1')
     +L(162,80,162,90,'a w1')+R(156,90,12,12,'a sa',2)+T(100,134,'supercalculateur et QPU',9,'tm');}},

/* ================= Cryptographie ================= */
{th:'Cryptographie',term:'RSA et courbes elliptiques face à Shor',
 def:'Leur sécurité repose sur la factorisation et le logarithme discret, deux problèmes que l’algorithme de Shor résout efficacement sur un ordinateur quantique tolérant aux fautes. Échanges de clés et signatures actuels sont donc concernés.',
 art:()=>P('M62 60 V44 A18 18 0 0 1 98 44 V60','a')+R(50,60,60,46,'a sa',6)+P('M82 64 L76 78 L84 88 L78 104','m')+T(140,70,'RSA',12,'ta')+T(140,92,'ECC',12,'ta')
   +T(100,132,'factorisation, logarithme discret',9,'tm')},

{th:'Cryptographie',term:'Ressources pour casser RSA-2048',
 fx:'&lt; 10<sup>6</sup> qubits physiques, &lt; 1 semaine (Gidney, 2025)',
 def:'Les estimations ont fortement baissé : environ 20 millions de qubits physiques en 2019, moins d’un million en 2025 selon Craig Gidney (Google), pour moins d’une semaine de calcul. Les plus grandes machines actuelles en comptent de l’ordre du millier.',
 art:()=>B(36,22,34,88,'fb')+B(86,38,34,72,'fa')+B(136,74,34,36,'fm')+L(28,110,180,110,'m w1')+T(53,16,'20 M',9,'tb')+T(103,32,'&lt; 1 M',9,'ta')+T(153,68,'≈ 10³',9,'tm')
   +T(53,123,'2019',9,'tm')+T(103,123,'2025',9,'tm')+T(153,123,'machines actuelles',9,'tm')+T(100,137,'échelle logarithmique',8,'tm')},

{th:'Cryptographie',term:'« Harvest now, decrypt later »',
 fx:'x + y > z ⇒ données exposées (inégalité de Mosca)',
 def:'Collecter aujourd’hui des données chiffrées pour les déchiffrer quand un ordinateur quantique suffisant existera. Selon l’inégalité de Mosca, si la durée de confidentialité requise (x) plus la durée de migration (y) dépasse le délai avant cet ordinateur (z), les données sont déjà exposées.',
 art:()=>T(50,32,'y : migration',8,'tb')+R(20,38,60,18,'b sb',3)+T(125,32,'x : confidentialité',8,'ta')+R(80,38,90,18,'a sa',3)+R(20,70,120,18,'sm',3)+T(80,83,'z : délai quantique',8,'tm')
   +L(140,62,140,100,'m d w1')+T(156,83,'exposé',9,'ta')+L(15,104,188,104,'m w1','mm')+T(186,120,'temps',9,'tm','end')},

{th:'Cryptographie',term:'AES et SHA-2 face au quantique',
 fx:'AES-256 : ≈ 128 bits de sécurité face à Grover',
 def:'Peu menacés : Grover n’offre qu’une accélération quadratique, difficile à exploiter en pratique. Des clés AES-256 et des empreintes de 384 bits ou plus conservent une large marge.',
 art:()=>P('M100 18 L140 32 V66 Q140 100 100 118 Q60 100 60 66 V32 Z','b sb')+T(100,74,'AES-256',11,'tb')+T(100,134,'la marge reste large',9,'tm')},

{th:'Cryptographie',term:'Standards post-quantiques du NIST',
 fx:'FIPS 203, 204 et 205 (août 2024)',
 def:'ML-KEM (ex-Kyber) pour l’échange de clés, ML-DSA (ex-Dilithium) et SLH-DSA (ex-SPHINCS+) pour les signatures. Les deux premiers reposent sur des réseaux euclidiens, le troisième sur des fonctions de hachage. HQC a été retenu en 2025 comme alternative pour l’échange de clés.',
 art:()=>{let s='';for(let i=-4;i<=4;i++)for(let j=-3;j<=3;j++){const x=100+i*28+j*10,y=66+i*6+j*24;if(x>12&&x<188&&y>14&&y<116)s+=D(x,y,2.2,'fm');}
   return s+L(100,66,128,72,'a','ma')+L(100,66,110,90,'b','mb')+D(100,66,3,'fi')+T(100,134,'réseaux euclidiens',9,'tm');}},

{th:'Cryptographie',term:'Post-quantique (PQC) ou distribution quantique de clés (QKD)',
 def:'La PQC est un ensemble d’algorithmes classiques, déployables par mise à jour logicielle. La QKD (protocole BB84) utilise des photons, demande du matériel dédié et a une portée limitée. L’ANSSI privilégie la PQC.',
 art:()=>T(50,26,'PQC',11,'ta')+R(20,40,60,44,'a sa',6)+T(50,68,'{ }',16,'ta')+T(50,104,'logiciel',9,'tm')+L(100,20,100,116,'m d w1')
   +T(150,26,'QKD',11,'tb')+L(116,62,184,62,'m w1')+D(130,62,3.5,'fb')+D(150,62,3.5,'fb')+D(170,62,3.5,'fb')+T(150,104,'photons dédiés',9,'tm')},

{th:'Cryptographie',term:'Hybridation cryptographique',
 def:'Combiner un algorithme classique éprouvé et un algorithme post-quantique, pour rester protégé tant que l’un des deux tient. C’est l’approche recommandée par l’ANSSI pendant la transition.',
 art:()=>R(14,30,70,24,'b sb',4)+T(49,46,'classique',9,'tb')+R(14,84,70,24,'a sa',4)+T(49,100,'post-quantique',9,'ta')+L(86,42,118,66,'m','mm')+L(86,96,118,74,'m','mm')
   +C(130,70,11)+L(119,70,141,70)+L(130,59,130,81)+L(143,70,163,70,'m','mm')+T(180,74,'clé',10)},

/* ================= Infrastructure ================= */
{th:'Infrastructure',term:'Un accélérateur, pas un remplaçant',
 def:'L’ordinateur quantique ne remplacera pas les serveurs : c’est un accélérateur spécialisé pour quelques classes de problèmes. Stockage, bases de données, web et l’essentiel du calcul resteront classiques.',
 art:()=>{let s='';[14,46,78,110].forEach(x=>{s+=R(x,24,26,84,'sm',3);for(let y=36;y<104;y+=12)s+=L(x+5,y,x+21,y,'m w1');});
   return s+R(146,74,34,34,'a sa',4)+T(163,95,'QPU',9,'ta')+T(100,128,'l’essentiel reste classique',9,'tm');}},

{th:'Infrastructure',term:'Migration post-quantique',
 def:'Le premier chantier quantique concret pour une équipe d’infrastructure : TLS, VPN, SSH, PKI, signatures de code et de firmware, HSM. Elle doit commencer bien avant qu’une machine soit capable de casser RSA.',
 art:()=>{let s='';['TLS','VPN','SSH','PKI','HSM','firmware'].forEach((t,i)=>{const x=12+(i%3)*44,y=i<3?34:70;s+=R(x,y,40,22,'b sb',4)+T(x+20,y+15,t,9,'tb');});
   return s+L(146,57,160,57,'m','mm')+C(178,57,16,'a sa')+T(178,61,'PQC',9,'ta')+T(100,128,'tout ce qui utilise RSA ou ECC',9,'tm');}},

{th:'Infrastructure',term:'Inventaire cryptographique',
 def:'La première étape de la migration : recenser où RSA et ECC sont utilisés (certificats, protocoles, bibliothèques, équipements), avec quelles durées de vie et quelle sensibilité des données protégées.',
 art:()=>{let s='';['certificats','protocoles','bibliothèques','équipements'].forEach((t,i)=>{const y=32+i*24;s+=R(40,y-9,11,11,'m w1',2)+T(60,y,t,10,'','start');
   if(i<2)s+=P(`M42 ${y-4} L45.5 ${y} L51 ${y-9}`,'a');});return s;}},

{th:'Infrastructure',term:'Crypto-agilité',
 def:'La capacité d’un système à changer d’algorithme cryptographique par configuration plutôt que par refonte. Elle évite de revivre la même migration à chaque nouvelle faiblesse découverte.',
 art:()=>R(20,50,70,40,'m d w1',4)+T(55,75,'RSA',11,'tm')+R(110,50,70,40,'a sa',4)+T(145,75,'ML-KEM',11,'ta')+P('M60 46 Q100 18 140 46','m','mm')
   +T(100,116,'changer par configuration',9,'tm')},

{th:'Infrastructure',term:'Échange de clés hybride déjà déployé',
 fx:'X25519MLKEM768',
 def:'L’échange de clés post-quantique est déjà en service, en mode hybride : X25519MLKEM768 est activé par défaut dans les navigateurs récents et chez de grands fournisseurs de CDN, et OpenSSH 10 utilise par défaut un échange hybride fondé sur ML-KEM.',
 art:()=>T(40,22,'client',9,'tm')+T(160,22,'serveur',9,'tm')+L(40,30,40,120,'m w1')+L(160,30,160,120,'m w1')+L(42,55,156,70,'a','ma')+L(158,90,44,105,'b','mb')
   +T(100,52,'X25519 + ML-KEM',9,'ta')+T(100,118,'réponse',9,'tb')},

{th:'Infrastructure',term:'Taille des clés et signatures',
 fx:'ML-DSA-44 : 2 420 octets ; ECDSA P-256 : 64 octets',
 def:'Les algorithmes post-quantiques ont des clés et des signatures plus volumineuses. Cela alourdit les poignées de main TLS et les chaînes de certificats, et peut saturer des équipements anciens (tampons, MTU, HSM).',
 art:()=>T(20,40,'ECDSA P-256',9,'tm','start')+B(20,48,4,16,'fb')+T(30,60,'64 o',9,'tb','start')+T(20,86,'ML-DSA-44',9,'tm','start')+B(20,94,140,16,'fa')
   +T(166,106,'2,4 Ko',9,'ta','start')+T(100,132,'taille d’une signature',9,'tm')},

{th:'Infrastructure',term:'Calendrier de transition',
 fx:'2030 : dépréciation ; 2035 : interdiction (projet NIST IR 8547)',
 def:'Le projet NIST IR 8547 (2024) propose de déprécier RSA et ECC d’ici 2030 et de les interdire d’ici 2035. La feuille de route européenne vise la migration des systèmes à haut risque d’ici 2030.',
 art:()=>P('M15 70 H188','m w1','mm')+L(25,64,25,76,'m w1')+D(100,70,5,'fb')+D(162,70,5,'fa')+T(25,92,'2024',9,'tm')+T(100,92,'2030',10,'tb')+T(162,92,'2035',10,'ta')
   +T(100,52,'dépréciation',9,'tb')+T(162,52,'interdiction',9,'ta')},

{th:'Infrastructure',term:'Exploiter un ordinateur quantique sur site',
 def:'Un cryostat ou des bancs laser, une salle stable (vibrations, champs magnétiques), des calibrations fréquentes et un ordonnanceur intégré à l’environnement HPC. De nouveaux métiers apparaissent entre physique et exploitation.',
 art:()=>R(14,18,172,100,'m w1',6)+C(56,64,22,'a sa')+C(56,64,12,'a w1')+T(56,104,'cryostat',9,'ta')+R(110,36,24,56,'sm',3)+R(140,36,24,56,'sm',3)
   +T(137,106,'contrôle',9,'tm')+T(100,134,'salle stable, calibrations fréquentes',9,'tm')},

/* ================= Applications ================= */
{th:'Applications',term:'Chimie et matériaux',
 def:'L’application la plus crédible à moyen terme : simuler des molécules et des matériaux (catalyseurs, batteries, cofacteur FeMoco de la fixation de l’azote), dont le comportement est intrinsèquement quantique.',
 art:()=>{let s='',pts=[];for(let k=0;k<6;k++){const a=(k*60-90)*Math.PI/180;pts.push([f(100+34*Math.cos(a)),f(64+34*Math.sin(a))]);}
   s+=P('M'+pts.map(p=>p.join(' ')).join(' L')+' Z','m')+C(100,64,18,'b w1 d');pts.forEach((p,i)=>s+=D(p[0],p[1],i%2?5:6,i%2?'fb':'fa'));
   return s+T(100,128,'molécules, catalyseurs, batteries',9,'tm');}},

{th:'Applications',term:'Optimisation (logistique, finance)',
 def:'Un domaine souvent cité, mais incertain : les accélérations prouvées y sont modestes (quadratiques) et les heuristiques classiques sont redoutables. Aucun avantage pratique n’est démontré à ce jour.',
 art:()=>{let d='',mx=0,my=0;for(let x=15;x<=185;x+=2){const y=62+14*Math.sin(x/9)+26*Math.exp(-Math.pow((x-122)/16,2));if(y>my){my=y;mx=x;}d+=(x===15?'M':'L')+x+' '+f(y)+' ';}
   return P(d.trim(),'b')+D(mx,f(my),4.5,'fa')+T(mx,f(my)+18,'minimum global',9,'ta')+T(100,22,'paysage de coût',9,'tm');}},

{th:'Applications',term:'Recuit quantique et modèle à portes',
 def:'Le recuit quantique (D-Wave) laisse un système évoluer vers l’état de plus basse énergie d’un problème d’optimisation. Le modèle à portes, universel, exécute des circuits arbitraires. Le recuit n’est pas un ordinateur quantique universel.',
 art:()=>P('M12 30 C20 110, 44 110, 52 60 C60 30, 70 30, 76 60 C84 120, 92 110, 96 30','m')+D(32,86,4,'fb')+P('M36 86 H80','b d w1','mb')
   +L(104,20,104,120,'m d w1')+L(112,50,190,50,'m w1')+L(112,90,190,90,'m w1')+R(124,41,18,18,'a sa',2)+D(160,50,4,'fi')+L(160,50,160,98)+C(160,90,8)+L(152,90,168,90)
   +T(52,128,'recuit',10,'tb')+T(150,128,'modèle à portes',10,'ta')},

{th:'Applications',term:'Apprentissage automatique quantique',
 def:'Un domaine de recherche actif, mais limité par le chargement des données et par l’entraînement de circuits bruités. Aucun avantage général n’a été démontré sur des données classiques.',
 art:()=>{const L1=[36,70,104],L2=[50,90];let s='';L1.forEach(a=>L2.forEach(b=>s+=L(40,a,100,b,'m w1')));L2.forEach(b=>s+=L(100,b,160,70,'m w1'));
   L1.forEach(y=>s+=C(40,y,9,'b sb'));L2.forEach(y=>s+=C(100,y,9,'a sa'));s+=C(160,70,9,'b sb');
   return s+T(100,132,'pas d’avantage général démontré',9,'tm');}},

{th:'Applications',term:'Feuilles de route vers la tolérance aux fautes',
 fx:'IBM Starling : ≈ 200 qubits logiques visés en 2029',
 def:'Les constructeurs visent des machines tolérantes aux fautes vers la fin de la décennie ; IBM annonce par exemple Starling pour 2029. Ce sont des objectifs industriels, pas des certitudes.',
 art:()=>P('M20 112 H60 V92 H100 V70 H130','a')+P('M130 70 V40 H180','a d')+L(20,112,186,112,'m w1')+T(40,126,'2024',9,'tm')+T(115,126,'2026',9,'tm')
   +T(160,126,'2029',9,'ta')+T(155,32,'tolérance aux fautes',9,'ta')+T(30,40,'qubits logiques',9,'tm','start')},

{th:'Applications',term:'Capteurs quantiques',
 def:'À ne pas confondre avec le calcul : les capteurs quantiques (horloges atomiques, magnétomètres, gravimètres) exploitent la sensibilité des états quantiques pour mesurer, et sont souvent déjà opérationnels.',
 art:()=>C(60,64,30,'m w1')+L(60,64,60,42,'a')+L(60,64,76,70,'a')+D(60,64,3,'fi')+D(146,64,5,'fa')+E(146,64,26,9,'b w1')
   +`<g transform="rotate(60 146 64)">${E(146,64,26,9,'b w1')}</g><g transform="rotate(-60 146 64)">${E(146,64,26,9,'b w1')}</g>`
   +T(60,118,'horloges',9,'tm')+T(146,118,'atomes',9,'tm')}
];

const THEMES=[];CARDS_SRC.forEach(c=>{if(!THEMES.includes(c.th))THEMES.push(c.th);});
const CARDS=CARDS_SRC.map((c,i)=>({n:i+1,term:c.term,fx:c.fx,def:c.def,theme:c.th,art:c.art,_svg:null}));

/* ---------- Raccordement au moteur ---------- */
window.JEU_DE_FICHES = {
  id: "informatique",
  titre: "Fiches informatiques",
  cle: "qflash-informatique-v1",
  preambule: "Les thèmes suivent la pile d’un ordinateur quantique&nbsp;: du qubit, refroidi à quelques millikelvins, jusqu’aux usages et à leurs effets sur l’infrastructure informatique.",
  themes: THEMES.slice(),
  symboles: {
    "Toutes": "{0,1}",
    "Fondements": "|0⟩",
    "Matériel": "<i>T</i><sub>1</sub>",
    "Portes et circuits": "<i>H</i>",
    "Correction d’erreurs": "|<i>ψ</i><sub>L</sub>⟩",
    "Algorithmes": "√<i>N</i>",
    "Complexité": "BQP",
    "Logiciel et cloud": "QPU",
    "Cryptographie": "<i>N</i>&#8202;=&#8202;<i>pq</i>",
    "Infrastructure": "TLS",
    "Applications": "<i>E</i><sub>0</sub>",
    "À revoir": "↺"
  },
  indice: "Touchez la carte pour voir la définition",
  cartes: CARDS
};
