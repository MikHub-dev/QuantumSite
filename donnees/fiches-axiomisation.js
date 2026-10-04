// Version : 1.0
/* =====================================================================
   Fiches Axiomisation — données des fiches
   ---------------------------------------------------------------------
   Les postulats physiques de la mécanique quantique et le socle
   mathématique (axiomes, structures, théorèmes) sur lequel ils reposent.
   Le bloc final « JEU_DE_FICHES » relie ces données au moteur js/fiches.js,
   fixe le symbole de chaque thème et le préambule affiché en haut de page.
   ===================================================================== */
const f=n=>Math.round(n*10)/10;
const P=(d,c,m,ms)=>`<path d="${d}" class="l ${c||''}"${m?` marker-end="url(#${m})"`:''}${ms?` marker-start="url(#${ms})"`:''}/>`;
const L=(x1,y1,x2,y2,c,m)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="l ${c||''}"${m?` marker-end="url(#${m})"`:''}/>`;
const C=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="l ${c||''}"/>`;
const D=(x,y,r,c,op)=>`<circle cx="${x}" cy="${y}" r="${r}" class="${c||'fa'}"${op?` opacity="${op}"`:''}/>`;
const R=(x,y,w,h,c,rx)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx==null?3:rx}" class="l ${c||''}"/>`;
const B=(x,y,w,h,c,op)=>`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="1.5" class="${c||'fa'}"${op?` opacity="${op}"`:''}/>`;
const E=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="l ${c||''}"/>`;
const T=(x,y,s,sz,c,a)=>`<text x="${x}" y="${y}" font-size="${sz||12}" text-anchor="${a||'middle'}" class="tx ${c||''}">${s}</text>`;
const FILL=(d,c)=>`<path d="${d}" class="${c}"/>`;
const sub=s=>`<tspan baseline-shift="sub" font-size="70%">${s}</tspan>`;
const sup=s=>`<tspan baseline-shift="super" font-size="70%">${s}</tspan>`;
/* gaussienne de largeur w posée sur la ligne y0, de hauteur h et d'écart-type s (en pixels) */
function gs(x0,y0,w,h,s){let d='';for(let i=0;i<=w+0.01;i+=1){const x=i-w/2;d+=(i?'L':'M')+f(x0+i)+' '+f(y0-h*Math.exp(-x*x/(2*s*s)))+' ';}return d.trim();}
const gsAire=(x0,y0,w,h,s)=>`M${x0} ${y0} `+gs(x0,y0,w,h,s).replace(/^M/,'L')+` L${x0+w} ${y0} Z`;
/* barres verticales posées sur la ligne yb */
function barres(v,labs,X,yb,H,w,g,c,vmax){vmax=vmax||Math.max(...v);let s='';
  v.forEach((p,i)=>{const h=p/vmax*H,x=X+i*(w+g);s+=B(x,yb-h,w,h,c);if(labs&&labs[i]!=null)s+=T(f(x+w/2),yb+13,labs[i],10,'tm');});
  return s+L(X-4,yb,f(X+v.length*(w+g)),yb,'m w1');}

const CARDS_SRC=[

/* ================= Postulats ================= */
{th:'Postulats',term:'État pur (postulat 1)',
 fx:'|ψ⟩ ∈ ℋ, ‖ψ‖ = 1, et |ψ⟩ ≡ e<sup>iθ</sup>|ψ⟩',
 def:'L’état d’un système isolé est décrit par un vecteur normé d’un espace de Hilbert ℋ, défini à une phase globale près : c’est un rayon de ℋ, un point de l’espace projectif. Toute combinaison linéaire d’états est encore un état : c’est le principe de superposition.',
 art:()=>L(30,118,30,14,'m w1','mm')+L(30,118,188,118,'m w1','mm')+P('M30 118 L182 22','m d w1')+L(30,118,118,62.4,'a','ma')
   +T(78,66,'|ψ⟩',14,'ta','end')+T(158,62,'rayon',10,'tm','start')+T(110,136,'|ψ⟩ et e'+sup('iθ')+'|ψ⟩ : même état',10,'tm')},

{th:'Postulats',term:'État mixte et opérateur densité (postulat 1′)',
 fx:'ρ = Σ<sub>k</sub> p<sub>k</sub> |ψ<sub>k</sub>⟩⟨ψ<sub>k</sub>| ; ρ ≥ 0 ; Tr ρ = 1',
 def:'Plus généralement, l’état est un opérateur densité ρ, autoadjoint, positif et de trace 1. Il décrit un mélange statistique ou l’état d’un sous-système. L’état est pur exactement quand ρ² = ρ, c’est-à-dire ρ = |ψ⟩⟨ψ|.',
 art:()=>C(100,64,50,'m')+D(100,64,2.5,'fm')+T(100,56,'I/2',9,'tm')+D(135.4,28.6,5,'fa')+T(145,24,'pur',11,'ta','start')
   +D(115,78,5,'fb')+T(115,97,'mixte',11,'tb')+T(100,134,'ρ² = ρ  ⇔  état pur',11,'tm')},

{th:'Postulats',term:'Observables (postulat 2)',
 fx:'grandeur A  ↦  Â, avec Â<sup>†</sup> = Â',
 def:'Toute grandeur physique mesurable (position, impulsion, énergie, spin…) est représentée par un opérateur autoadjoint agissant sur l’espace des états.',
 art:()=>R(14,46,66,44,'m',6)+T(47,64,'grandeur',10,'tm')+T(47,82,'A',15,'')+L(86,68,114,68,'a','ma')
   +R(120,46,66,44,'b sb',6)+T(153,74,'Â = Â'+sup('†'),14,'')+T(100,122,'opérateur autoadjoint',11,'tb')},

{th:'Postulats',term:'Résultats possibles d’une mesure (postulat 3)',
 fx:'a ∈ σ(Â) ; Â|u<sub>n</sub>⟩ = a<sub>n</sub>|u<sub>n</sub>⟩',
 def:'Le résultat d’une mesure de A est toujours un élément du spectre de Â : une valeur propre si le spectre est discret, une valeur du spectre continu sinon. C’est l’origine des grandeurs quantifiées (niveaux d’énergie, spin…).',
 art:()=>T(100,40,'a ∈ σ(Â)',16,'')+L(15,82,190,82,'m w1','mm')+D(32,82,5,'fa')+D(56,82,5,'fa')+D(78,82,5,'fa')
   +T(32,102,'a'+sub('1'),11,'ta')+T(56,102,'a'+sub('2'),11,'ta')+T(78,102,'a'+sub('3'),11,'ta')
   +B(110,78,62,8,'fb')+T(55,124,'discret',10,'tm')+T(141,124,'continu',10,'tm')},

{th:'Postulats',term:'Règle de Born (postulat 4)',
 fx:'P(a<sub>n</sub>) = ⟨ψ|P̂<sub>n</sub>|ψ⟩ = Tr(ρ P̂<sub>n</sub>)',
 def:'La probabilité d’obtenir a<sub>n</sub> est le carré de la norme de la projection de l’état sur le sous-espace propre associé : Σ<sub>i</sub> |⟨u<sub>n</sub><sup>i</sup>|ψ⟩|². Pour un spectre continu, on obtient une densité, comme |ψ(x)|². La valeur moyenne ⟨A⟩ = ⟨ψ|Â|ψ⟩ en découle.',
 art:()=>T(100,22,'P(a'+sub('n')+') = |⟨u'+sub('n')+'|ψ⟩|²',12,'tb')+barres([.15,.45,.3,.1],['a'+sub('1'),'a'+sub('2'),'a'+sub('3'),'a'+sub('4')],42,112,72,22,10,'fa')},

{th:'Postulats',term:'Réduction du paquet d’onde (postulat 5)',
 fx:'|ψ⟩  →  P̂<sub>n</sub>|ψ⟩ / ‖P̂<sub>n</sub>|ψ⟩‖',
 def:'Juste après une mesure ayant donné a<sub>n</sub>, l’état est projeté sur le sous-espace propre associé, puis renormalisé (règle de von Neumann–Lüders). Une seconde mesure immédiate de A redonne a<sub>n</sub> avec certitude.',
 art:()=>L(40,112,40,18,'m w1','mm')+L(40,112,186,112,'m w1','mm')+L(40,112,118,45.5,'b','mb')+T(126,42,'|ψ⟩',13,'tb','start')
   +P('M120 44 V112','m d w1')+L(40,112,117,112,'a','ma')+T(80,130,'P̂'+sub('n')+'|ψ⟩',12,'ta')+T(156,130,'|u'+sub('n')+'⟩',12,'tm')},

{th:'Postulats',term:'Évolution temporelle (postulat 6)',
 fx:'iħ d|ψ⟩/dt = Ĥ|ψ⟩ ; |ψ(t)⟩ = Û(t)|ψ(0)⟩',
 def:'Entre deux mesures, l’état évolue de façon déterministe et unitaire selon l’équation de Schrödinger, gouvernée par le hamiltonien Ĥ. Pour un état mixte, c’est l’équation de von Neumann : iħ dρ/dt = [Ĥ, ρ].',
 art:()=>C(100,70,48,'m d w1')+L(100,70,143,85.6,'a','ma')+L(100,70,116,26.9,'a','ma')+T(150,100,'ψ(0)',11,'ta','start')+T(122,22,'ψ(t)',11,'ta','start')
   +P('M126.3 79.6 A28 28 0 0 0 109.6 43.7','b w1','mb')+T(140,60,'Û(t)',11,'tb','start')+T(100,134,'‖ψ(t)‖ = ‖ψ(0)‖',11,'tm')},

{th:'Postulats',term:'Quantification canonique (postulat 7)',
 fx:'[x̂<sub>i</sub>, p̂<sub>j</sub>] = iħ δ<sub>ij</sub> ; p̂ = −iħ ∇ en représentation position',
 def:'On construit les observables à partir de la mécanique classique : le crochet de Poisson {f, g} devient le commutateur [f̂, ĝ]/iħ, avec symétrisation des produits pour garantir l’autoadjonction. Le spin, sans analogue classique, est postulé à part.',
 art:()=>T(100,42,'{x, p} = 1',16,'tm')+L(100,52,100,78,'a','ma')+T(100,108,'[x̂, p̂] = iħ',18,'ta')+T(100,132,'crochet de Poisson → commutateur / iħ',9,'tm')},

{th:'Postulats',term:'Systèmes composés (postulat 8)',
 fx:'ℋ = ℋ<sub>A</sub> ⊗ ℋ<sub>B</sub>',
 def:'L’espace des états d’un système composé est le produit tensoriel des espaces de ses parties. Certains états de ℋ<sub>A</sub> ⊗ ℋ<sub>B</sub> ne s’écrivent pas comme un produit |φ⟩ ⊗ |χ⟩ : ce sont les états intriqués.',
 art:()=>C(50,58,27,'b')+T(50,64,'ℋ'+sub('A'),15,'tb')+T(100,66,'⊗',24,'')+C(150,58,27,'a')+T(150,64,'ℋ'+sub('B'),15,'ta')
   +T(100,112,'|ψ⟩ ≠ |φ⟩ ⊗ |χ⟩',13,'')+T(100,132,'intrication',10,'tm')},

{th:'Postulats',term:'Particules identiques (postulat 9)',
 fx:'ψ(x<sub>2</sub>, x<sub>1</sub>) = ± ψ(x<sub>1</sub>, x<sub>2</sub>)',
 def:'Pour des particules identiques, seuls les états totalement symétriques (bosons, spin entier) ou totalement antisymétriques (fermions, spin demi-entier) sont physiques. Le principe d’exclusion de Pauli en découle. Postulé ici, le lien spin-statistique se démontre en théorie quantique des champs.',
 art:()=>T(100,20,'ψ(x'+sub('2')+', x'+sub('1')+') = ± ψ(x'+sub('1')+', x'+sub('2')+')',11,'tm')
   +L(18,105,88,105,'m')+L(18,72,88,72,'m')+L(18,42,88,42,'m')+D(37,99,5,'fb')+D(53,99,5,'fb')+D(69,99,5,'fb')+T(53,128,'bosons',11,'tb')
   +L(100,32,100,112,'m d w1')
   +L(112,105,182,105,'m')+L(112,72,182,72,'m')+L(112,42,182,42,'m')+T(138,101,'↑',15,'ta')+T(156,101,'↓',15,'ta')+T(138,68,'↑',15,'ta')+T(147,128,'fermions',11,'ta')},

/* ================= Compléments ================= */
{th:'Compléments',term:'Mesures généralisées (POVM)',
 fx:'E<sub>k</sub> ≥ 0, Σ<sub>k</sub> E<sub>k</sub> = I, P(k) = Tr(ρ E<sub>k</sub>)',
 def:'Une mesure peut être décrite par une famille d’opérateurs positifs E<sub>k</sub>, pas forcément des projecteurs, dont la somme vaut l’identité. Le théorème de Naimark montre que c’est une mesure projective (postulat 4) sur un système agrandi (postulat 8).',
 art:()=>C(100,64,45,'m d w1')+L(100,64,100,21,'a','ma')+L(100,64,62,85.5,'a','ma')+L(100,64,138,85.5,'a','ma')+D(100,64,2.5,'fm')
   +T(108,15,'E'+sub('1'),12,'ta','start')+T(52,102,'E'+sub('2'),12,'ta')+T(148,102,'E'+sub('3'),12,'ta')+T(100,132,'Σ E'+sub('k')+' = I',12,'tm')},

{th:'Compléments',term:'Opérations quantiques (forme de Kraus)',
 fx:'ρ ↦ Σ<sub>k</sub> K<sub>k</sub> ρ K<sub>k</sub><sup>†</sup>, avec Σ<sub>k</sub> K<sub>k</sub><sup>†</sup>K<sub>k</sub> = I',
 def:'L’évolution d’un système ouvert, en interaction avec un environnement, est une application complètement positive qui préserve la trace. Elle se déduit de l’évolution unitaire du système global, suivie d’une trace partielle sur l’environnement.',
 art:()=>R(20,30,160,68,'m d w1',8)+T(100,22,'évolution unitaire globale Û',10,'tm')+R(34,44,56,40,'b sb',6)+T(62,70,'ρ',17,'tb')
   +R(110,44,56,40,'m sm',6)+T(138,69,'env.',12,'tm')+L(62,98,62,118,'b','mb')+T(72,128,'ρ′ = Σ K'+sub('k')+' ρ K'+sub('k')+sup('†'),11,'tb','start')},

{th:'Compléments',term:'Règles de supersélection',
 fx:'⟨ψ<sub>Q</sub>|Â|ψ<sub>Q′</sub>⟩ = 0 pour toute observable si Q ≠ Q′',
 def:'Certaines superpositions ne sont jamais observées, par exemple entre des états de charges électriques différentes. L’espace des états se découpe alors en secteurs entre lesquels aucune observable ne crée de cohérence.',
 art:()=>R(18,40,66,54,'b sb',6)+T(51,72,'Q = 0',13,'tb')+R(116,40,66,54,'a sa',6)+T(149,72,'Q = 1',13,'ta')
   +L(88,67,112,67,'m d w1')+L(94,60,106,74,'w1')+L(106,60,94,74,'w1')+T(100,122,'aucune cohérence entre secteurs',10,'tm')},

{th:'Compléments',term:'Spin',
 fx:'Ŝ<sup>2</sup>|s, m⟩ = ħ<sup>2</sup> s(s+1) |s, m⟩ ; Ŝ<sub>z</sub>|s, m⟩ = ħ m |s, m⟩',
 def:'Moment cinétique intrinsèque, sans analogue classique. En mécanique quantique non relativiste, on le postule comme degré de liberté supplémentaire : ℋ = L²(ℝ³) ⊗ ℂ<sup>2s+1</sup>. L’équation relativiste de Dirac le fait apparaître naturellement.',
 art:()=>L(100,122,100,10,'m w1','mm')+T(108,16,'z',11,'tm','start')+L(66,92,66,40,'a','ma')+T(66,110,'+ħ/2',12,'ta')
   +L(134,40,134,92,'b','mb')+T(134,110,'−ħ/2',12,'tb')+T(100,136,'s = ½ : deux états',10,'tm')},

/* ================= Fondements logiques ================= */
{th:'Fondements logiques',term:'Logique et théorie des ensembles (ZFC)',
 fx:'axiomes de Zermelo-Fraenkel + axiome du choix',
 def:'Tout l’édifice mathématique repose sur la logique du premier ordre et sur les axiomes de la théorie des ensembles ZFC. L’axiome du choix intervient en dimension infinie, notamment pour garantir l’existence de bases hilbertiennes.',
 art:()=>T(100,72,'ZFC',42,'ta')+T(100,106,'∀   ∃   ∈   ⊂   ∅',16,'tm')+T(100,130,'+ axiome du choix',10,'tb')},

{th:'Fondements logiques',term:'Corps des réels et des complexes',
 fx:'ℂ = ℝ + iℝ, i<sup>2</sup> = −1 ; |z|<sup>2</sup> = z z̄',
 def:'Les amplitudes de probabilité sont des nombres complexes. On s’appuie sur les axiomes de corps, sur la complétude de ℝ (propriété de la borne supérieure), puis sur la construction de ℂ à partir de ℝ².',
 art:()=>L(20,84,186,84,'m w1','mm')+L(70,132,70,12,'m w1','mm')+P('M140 40 V84','m d w1')+P('M70 40 H140','m d w1')+L(70,84,137.5,41.6,'a','ma')+D(140,40,4,'fa')
   +T(140,28,'z = a + ib',11,'ta')+T(188,100,'ℝ',11,'tm','end')+T(78,18,'iℝ',11,'tm','start')+T(140,100,'a',10,'tm')+T(62,44,'b',10,'tm','end')+T(130,128,'i² = −1',12,'tb')},

/* ================= Espace de Hilbert ================= */
{th:'Espace de Hilbert',term:'Espace vectoriel complexe',
 fx:'α|φ⟩ + β|ψ⟩ ∈ ℋ pour tous α, β ∈ ℂ',
 def:'Huit axiomes : associativité et commutativité de l’addition, vecteur nul, opposé, et quatre règles de compatibilité avec la multiplication par un scalaire complexe. C’est le cadre mathématique du principe de superposition.',
 art:()=>L(30,115,108,95.5,'b','mb')+L(30,115,69,47,'a','ma')+L(30,115,147,30,'','mi')+P('M110 95 L150 25','m d w1')+P('M70 45 L150 25','m d w1')
   +T(116,110,'α|φ⟩',11,'tb','start')+T(62,42,'β|ψ⟩',11,'ta','end')+T(150,14,'α|φ⟩ + β|ψ⟩',10,'')},

{th:'Espace de Hilbert',term:'Produit scalaire hermitien',
 fx:'⟨φ|ψ⟩ = ⟨ψ|φ⟩<sup>*</sup> ; ⟨ψ|ψ⟩ > 0 si ψ ≠ 0',
 def:'Il est linéaire à droite (convention des physiciens), à symétrie hermitienne et défini positif. Il fournit la norme ‖ψ‖ = √⟨ψ|ψ⟩, l’orthogonalité et les amplitudes de probabilité ⟨φ|ψ⟩.',
 art:()=>L(40,110,176,110,'b','mb')+L(40,110,128,41.6,'a','ma')+P('M130 40 V110','m d w1')+P('M70 110 A30 30 0 0 0 63.7 91.6','m w1')
   +T(80,102,'θ',11,'tm')+T(136,38,'|ψ⟩',12,'ta','start')+T(176,128,'|φ⟩',12,'tb')+T(85,130,'⟨φ|ψ⟩',12,'')},

{th:'Espace de Hilbert',term:'Inégalité de Cauchy-Schwarz',
 fx:'|⟨φ|ψ⟩| ≤ ‖φ‖ ‖ψ‖',
 def:'Conséquence directe des axiomes du produit scalaire. Elle garantit qu’une probabilité de transition ne dépasse jamais 1 et fonde les relations d’incertitude de Robertson : ΔA · ΔB ≥ ½ |⟨[Â, B̂]⟩|.',
 art:()=>B(62,36,80,16,'fa')+T(56,48,'|⟨φ|ψ⟩|',10,'ta','end')+B(62,68,124,16,'fb')+T(56,80,'‖φ‖ ‖ψ‖',10,'tb','end')+P('M142 30 V58','m d w1')
   +T(100,122,'ΔA · ΔB ≥ ½ |⟨[Â, B̂]⟩|',11,'tm')},

{th:'Espace de Hilbert',term:'Complétude',
 fx:'‖ψ<sub>n</sub> − ψ<sub>m</sub>‖ → 0  ⇒  ψ<sub>n</sub> → ψ ∈ ℋ',
 def:'Toute suite de Cauchy converge dans l’espace : il n’y a pas de « trous ». C’est ce qui distingue un espace de Hilbert d’un simple espace préhilbertien, et ce qui donne un sens aux limites, séries et intégrales d’états.',
 art:()=>{let s='';for(let n=0;n<10;n++){const x=160-130*Math.pow(.62,n),y=66+44*Math.pow(-.62,n);s+=D(f(x),f(y),f(4.5-n*.3),'fb',f(1-n*.06));}
   return s+C(160,66,8,'a')+D(160,66,2.5,'fa')+T(42,116,'ψ'+sub('1'),11,'tb','start')+T(160,100,'ψ ∈ ℋ',12,'ta')+T(100,132,'pas de « trous »',10,'tm');}},

{th:'Espace de Hilbert',term:'Séparabilité',
 fx:'|ψ⟩ = Σ<sub>n</sub> c<sub>n</sub>|e<sub>n</sub>⟩ ; ℋ ≅ ℓ²(ℕ)',
 def:'On postule l’existence d’une base hilbertienne dénombrable. Tous les espaces de Hilbert séparables de dimension infinie sont alors isomorphes : L²(ℝ) et l’espace ℓ² des suites de carré sommable sont « le même » espace.',
 art:()=>T(100,22,'|ψ⟩ = Σ c'+sub('n')+' |e'+sub('n')+'⟩',12,'tb')+barres([.9,.6,.75,.4,.3,.22,.15,.1,.06,.04],['1','2','3','4','5','6','7','8','9','…'],24,112,74,11,5,'fa',1)},

/* ================= Opérateurs ================= */
{th:'Opérateurs',term:'Opérateurs bornés et non bornés',
 fx:'‖Âψ‖ ≤ C ‖ψ‖ (borné) ; D(x̂) ⊊ ℋ',
 def:'La position x̂ et l’impulsion p̂ ne sont pas bornées : elles ne sont définies que sur un domaine dense de ℋ. Ces questions de domaine expliquent la distinction entre opérateur symétrique et opérateur autoadjoint.',
 art:()=>E(100,66,86,50,'m')+T(172,26,'ℋ',15,'tm')+E(94,70,56,32,'a d')+T(94,76,'D(x̂)',14,'ta')+T(100,134,'domaine dense, mais ≠ ℋ',10,'tm')},

{th:'Opérateurs',term:'Adjoint, autoadjoint, unitaire',
 fx:'⟨φ|Âψ⟩ = ⟨Â<sup>†</sup>φ|ψ⟩ ; Â = Â<sup>†</sup> ; Û<sup>†</sup>Û = I',
 def:'L’adjoint généralise la transposée conjuguée. Autoadjoint (Â = Â†) : spectre réel, ce sont les observables. Unitaire (Û†Û = I) : conserve le produit scalaire, ce sont les évolutions et les symétries.',
 art:()=>L(12,70,96,70,'m w1')+D(28,70,4,'fa')+D(50,70,4,'fa')+D(80,70,4,'fa')+T(54,46,'Â = Â'+sup('†'),12,'ta')+T(54,96,'spectre réel',9,'tm')
   +L(105,30,105,112,'m d w1')+C(150,70,30,'m w1')+D(180,70,4,'fb')+D(165,44,4,'fb')+D(124,85,4,'fb')+T(150,28,'Û'+sup('†')+'Û = I',12,'tb')+T(150,120,'spectre sur le cercle',9,'tm')},

{th:'Opérateurs',term:'Projecteurs orthogonaux',
 fx:'P̂<sup>2</sup> = P̂ = P̂<sup>†</sup>',
 def:'Ils représentent les questions « oui ou non » posées au système. La décomposition spectrale d’une observable est une somme (ou une intégrale) de projecteurs, et la règle de Born s’écrit avec eux.',
 art:()=>L(20,105.6,186,75.7,'m')+L(40,102,118,32,'b','mb')+P('M120 30 L130 85.8','m d w1')+L(40,102,127.5,86.2,'a','ma')
   +T(112,24,'|ψ⟩',12,'tb')+T(92,116,'P̂|ψ⟩',12,'ta')+T(184,96,'sous-espace',9,'tm','end')+T(100,134,'P̂² = P̂ = P̂'+sup('†'),11,'tm')},

{th:'Opérateurs',term:'Commutateur et trace',
 fx:'[Â, B̂] = ÂB̂ − B̂Â ; Tr Â = Σ<sub>n</sub> ⟨e<sub>n</sub>|Â|e<sub>n</sub>⟩',
 def:'Le commutateur mesure l’incompatibilité de deux observables. La trace, définie pour les opérateurs à trace, donne les probabilités Tr(ρP̂) et les valeurs moyennes Tr(ρÂ), indépendamment de la base choisie.',
 art:()=>{let s='';for(let i=0;i<3;i++)for(let j=0;j<3;j++)s+=B(62+j*26,22+i*26,24,24,i===j?'fa':'sm');
   return s+T(100,118,'Tr Â = Σ ⟨e'+sub('n')+'|Â|e'+sub('n')+'⟩',11,'ta')+T(100,136,'[Â, B̂] ≠ 0 : incompatibles',10,'tm');}},

{th:'Opérateurs',term:'Produit tensoriel d’espaces et d’opérateurs',
 fx:'(Â ⊗ B̂)(|φ⟩ ⊗ |χ⟩) = Â|φ⟩ ⊗ B̂|χ⟩ ; dim = d<sub>A</sub> × d<sub>B</sub>',
 def:'C’est la construction mathématique derrière le postulat des systèmes composés : les dimensions se multiplient au lieu de s’additionner. D’où l’explosion de la taille de l’espace avec le nombre de qubits (2<sup>n</sup>).',
 art:()=>{let s='';for(let i=0;i<2;i++)s+=B(14,44+i*22,20,20,'fb');for(let j=0;j<3;j++)s+=B(60+j*20,56,18,18,'fa');
   for(let i=0;i<2;i++)for(let j=0;j<3;j++)s+=B(142+j*18,47+i*18,16,16,(i+j)%2?'fa':'fb',.85);
   return s+T(46,71,'⊗',16,'')+T(130,71,'=',14,'tm')+T(24,104,'2',11,'tb')+T(89,94,'3',11,'ta')+T(167,100,'6',11,'tm')+T(100,132,'n qubits : 2'+sup('n')+' dimensions',11,'tm');}},

/* ================= Théorèmes clés ================= */
{th:'Théorèmes clés',term:'Théorème spectral',
 fx:'Â = ∫ λ dÊ(λ) ; spectre discret : Â = Σ<sub>n</sub> a<sub>n</sub> P̂<sub>n</sub>',
 def:'Tout opérateur autoadjoint se décompose sur ses projecteurs spectraux (une mesure à valeurs projecteurs). C’est ce qui donne un sens rigoureux aux postulats 3 et 4, y compris pour un spectre continu.',
 art:()=>T(100,24,'Â = ∫ λ dÊ(λ)',13,'')+L(15,110,190,110,'m w1','mm')+L(35,110,35,60,'a')+D(35,60,3.5,'fa')+L(58,110,58,42,'a')+D(58,42,3.5,'fa')+L(80,110,80,75,'a')+D(80,75,3.5,'fa')
   +FILL(gsAire(108,110,74,34,14),'sb')+P(gs(108,110,74,34,14),'b')+T(57,128,'discret',10,'ta')+T(145,128,'continu',10,'tb')},

{th:'Théorèmes clés',term:'Théorème de représentation de Riesz',
 fx:'toute forme linéaire continue f sur ℋ s’écrit f = ⟨φ| · ⟩',
 def:'À chaque forme linéaire continue sur ℋ correspond un unique vecteur φ tel que f(ψ) = ⟨φ|ψ⟩. C’est la justification mathématique de la correspondance entre bras ⟨φ| et kets |φ⟩.',
 art:()=>T(52,78,'⟨φ|',30,'tb')+T(100,76,'⟷',22,'tm')+T(148,78,'|φ⟩',30,'ta')+T(52,108,'forme linéaire',10,'tb')+T(148,108,'vecteur',10,'ta')+T(100,132,'ℋ′ ≅ ℋ',12,'tm')},

{th:'Théorèmes clés',term:'Théorème de Stone',
 fx:'Û(t) = e<sup>−iĤt/ħ</sup>',
 def:'Tout groupe à un paramètre d’opérateurs unitaires fortement continu possède un unique générateur autoadjoint. Il justifie l’existence du hamiltonien Ĥ et la forme de l’équation de Schrödinger (postulat 6).',
 art:()=>C(100,64,42,'m d w1')+D(142,64,4,'fa')+D(132.2,37,4,'fa',.8)+D(107.3,22.6,4,'fa',.6)+D(79,27.6,4,'fa',.4)
   +P('M151.2 73 A52 52 0 0 0 66.6 24.2','b w1','mb')+T(100,70,'Ĥ',16,'tb')+T(100,130,'Û(t) = e'+sup('−iĤt/ħ'),13,'ta')},

{th:'Théorèmes clés',term:'Théorème de Stone–von Neumann',
 fx:'[x̂, p̂] = iħ : représentation unique, à transformation unitaire près',
 def:'Pour un nombre fini de degrés de liberté, toutes les représentations irréductibles des relations canoniques (sous leur forme de Weyl) sont unitairement équivalentes. Les mécaniques de Schrödinger et de Heisenberg sont donc la même théorie.',
 art:()=>R(6,46,78,40,'b sb',6)+T(45,71,'Schrödinger',11,'tb')+R(116,46,78,40,'a sa',6)+T(155,71,'Heisenberg',11,'ta')
   +P('M89 66 H111','m','mm','mm')+T(100,40,'Û',12,'tm')+T(100,116,'[x̂, p̂] = iħ',13,'')+T(100,134,'une seule théorie',10,'tm')},

{th:'Théorèmes clés',term:'Théorème de Gleason',
 fx:'μ(P̂) = Tr(ρ P̂) dès que dim ℋ ≥ 3',
 def:'Toute façon cohérente d’attribuer des probabilités aux projecteurs, additive sur les projecteurs orthogonaux, est de la forme Tr(ρP̂). La règle de Born est donc presque imposée par la structure de l’espace de Hilbert.',
 art:()=>L(70,95,165,100,'a','ma')+L(70,95,70,16,'a','ma')+L(70,95,28,126,'a','ma')+T(170,116,'p'+sub('1'),11,'ta','end')+T(78,20,'p'+sub('2'),11,'ta','start')+T(42,132,'p'+sub('3'),11,'ta')
   +T(146,44,'p'+sub('1')+' + p'+sub('2')+' + p'+sub('3')+' = 1',11,'tb')+T(142,134,'dim ℋ ≥ 3',11,'tm')},

{th:'Théorèmes clés',term:'Théorème de Wigner (symétries)',
 fx:'symétrie  ↦  Û unitaire ou anti-unitaire',
 def:'Toute transformation qui conserve les probabilités de transition |⟨φ|ψ⟩|² est représentée par un opérateur unitaire ou anti-unitaire. Les rotations et translations sont unitaires, le renversement du temps est anti-unitaire.',
 art:()=>L(30,100,88,100,'b','mb')+L(30,100,74,56,'a','ma')+P('M50 100 A20 20 0 0 0 44.1 85.9','m w1')+T(92,96,'φ',12,'tb','start')+T(70,48,'ψ',12,'ta')
   +L(120,100,170,71,'b','mb')+L(120,100,136.5,38.6,'a','ma')+P('M137.3 90 A20 20 0 0 0 125.2 80.7','m w1')+T(176,70,'Ûφ',12,'tb','start')+T(138,30,'Ûψ',12,'ta')
   +T(100,130,'|⟨Ûφ|Ûψ⟩|² = |⟨φ|ψ⟩|²',11,'tm')},

{th:'Théorèmes clés',term:'Théorèmes d’impossibilité',
 fx:'Bell (CHSH) : |S| ≤ 2 avec des variables cachées locales, jusqu’à 2√2 en quantique',
 def:'Kochen-Specker : pas de valeurs prédéfinies non contextuelles. Bell : pas de variables cachées locales. Non-clonage : aucun procédé ne copie un état inconnu. Tous découlent des postulats, sans hypothèse supplémentaire.',
 art:()=>P('M40 50 H172','m d w1')+T(178,54,'2',11,'tm','start')+B(60,50,30,60,'fb')+B(120,25,30,85,'fa')+L(40,110,172,110,'m w1')
   +T(158,32,'2√2',11,'ta','start')+T(75,126,'local',10,'tb')+T(135,126,'quantique',10,'ta')},

/* ================= Distributions et analyse ================= */
{th:'Distributions et analyse',term:'Triplet de Gelfand (espace de Hilbert équipé)',
 fx:'Φ ⊂ ℋ ⊂ Φ′',
 def:'Il donne un sens rigoureux aux kets non normalisables |x⟩ et |p⟩, qui vivent dans Φ′, à la distribution δ de Dirac et à la relation de fermeture continue ∫ |x⟩⟨x| dx = I.',
 art:()=>E(100,70,90,58,'b')+T(100,28,'Φ′',13,'tb')+E(100,78,62,40,'m')+T(100,54,'ℋ',13,'tm')+E(100,88,32,20,'a')+T(100,93,'Φ',13,'ta')},

{th:'Distributions et analyse',term:'Distribution δ de Dirac',
 fx:'⟨x|x′⟩ = δ(x − x′) ; ∫ δ(x) f(x) dx = f(0)',
 def:'Ce n’est pas une fonction mais une distribution, au sens de Schwartz : la limite de pics de plus en plus étroits et hauts, d’aire 1. Elle exprime la normalisation des états propres du spectre continu, comme ceux de la position.',
 art:()=>L(15,115,188,115,'m w1','mm')+P(gs(40,115,120,22,22),'m w1')+P(gs(60,115,80,46,10),'b w1')+P(gs(80,115,40,92,4.5),'a')
   +T(112,34,'δ(x)',13,'ta','start')+T(100,134,'∫ δ(x) dx = 1',11,'tm')},

{th:'Distributions et analyse',term:'Intégrale de Lebesgue et espace L²',
 fx:'L²(ℝ) = { ψ : ∫ |ψ(x)|² dx < ∞ }',
 def:'Les fonctions d’onde sont des classes de fonctions de carré intégrable au sens de Lebesgue. Deux fonctions égales presque partout représentent le même état.',
 art:()=>FILL(gsAire(30,105,140,62,22),'sa')+P(gs(30,105,140,62,22),'a')+L(15,105,188,105,'m w1','mm')+T(130,42,'|ψ(x)|²',12,'ta','start')+T(100,128,'∫ |ψ(x)|² dx < ∞',12,'ta')},

{th:'Distributions et analyse',term:'Transformée de Fourier et théorème de Plancherel',
 fx:'ψ̃(p) = (2πħ)<sup>−1/2</sup> ∫ e<sup>−ipx/ħ</sup> ψ(x) dx',
 def:'Elle relie les représentations position et impulsion. Le théorème de Plancherel assure qu’elle est unitaire sur L² : la probabilité totale est conservée. Un paquet étroit en x est large en p.',
 art:()=>L(10,100,90,100,'m w1')+P(gs(10,100,80,70,6),'b')+T(50,120,'ψ(x)',11,'tb')+P('M92 62 H110','m','mm')+T(101,52,'ℱ',13,'tm')
   +L(112,100,192,100,'m w1')+P(gs(112,100,80,26,18),'a')+T(152,120,'ψ̃(p)',11,'ta')+T(100,137,'étroit en x ⇔ large en p',10,'tm')},

{th:'Distributions et analyse',term:'Groupes de Lie et représentations',
 fx:'[Ĵ<sub>x</sub>, Ĵ<sub>y</sub>] = iħ Ĵ<sub>z</sub> ; SU(2), groupe de Galilée',
 def:'Les symétries continues (rotations, translations, changements de référentiel) agissent par des représentations unitaires de groupes de Lie. Le moment cinétique et le spin découlent des représentations de SU(2).',
 art:()=>C(100,68,48,'m')+E(100,68,48,14,'m d w1')+L(100,120,100,8,'m w1','mm')+T(108,14,'z',11,'tm','start')
   +P('M63.2 77 A48 14 0 0 0 136.8 77','a','ma')+T(150,30,'SU(2)',13,'tb','start')+T(100,136,'[Ĵ'+sub('x')+', Ĵ'+sub('y')+'] = iħ Ĵ'+sub('z'),11,'tm')},

/* ================= Débats et alternatives ================= */
{th:'Débats et alternatives',term:'Le statut de la réduction',
 fx:'évolution unitaire (postulat 6) contre réduction (postulat 5)',
 def:'Le postulat 5 est le plus discuté. L’interprétation d’Everett (mondes multiples) le rejette, la théorie de la décohérence en fait un effet apparent, et les théories de collapse objectif (GRW) le remplacent par une dynamique non linéaire.',
 art:()=>L(20,70,80,70,'')+D(80,70,4,'fi')+P('M80 70 C110 70, 120 35, 176 35','b')+P('M80 70 C110 70, 120 105, 176 105','a')
   +T(45,60,'|ψ⟩',12,'')+T(176,24,'branche « ↑ »',10,'tb','end')+T(176,124,'branche « ↓ »',10,'ta','end')},

{th:'Débats et alternatives',term:'Peut-on démontrer la règle de Born ?',
 fx:'P = |⟨u|ψ⟩|² : postulat ou théorème ?',
 def:'Plusieurs travaux cherchent à la démontrer plutôt qu’à la postuler : Gleason (structure des projecteurs), Zurek (envariance), Deutsch et Wallace (théorie de la décision). Aucune de ces dérivations ne fait l’unanimité.',
 art:()=>T(100,78,'|⟨u|ψ⟩|²',30,'ta')+T(100,118,'postulée ou démontrée ?',11,'tm')},

{th:'Débats et alternatives',term:'Reconstructions informationnelles',
 fx:'quelques axiomes sur l’information  ⇒  ℋ, ρ, règle de Born',
 def:'Hardy (2001), puis Chiribella, D’Ariano et Perinotti (2011) reconstruisent tout le formalisme à partir de quelques axiomes simples sur l’information (composition locale, purification…), sans supposer d’espace de Hilbert au départ.',
 art:()=>{let s='';[18,46,74,102].forEach((y,k)=>{s+=R(16,y,58,20,'b sb',4)+T(45,y+14,'axiome '+(k+1),9,'tb')+L(76,y+10,130,70,'m w1','mm');});
   return s+C(155,70,22,'a')+T(155,76,'ℋ',16,'ta');}},

{th:'Débats et alternatives',term:'Formulations alternatives',
 fx:'C*-algèbres ; ∫ 𝒟x e<sup>iS/ħ</sup> ; axiomes de Wightman',
 def:'La formulation algébrique (Haag-Kastler) part de l’algèbre des observables, celle de Feynman somme sur tous les chemins. En théorie quantique des champs relativiste, les axiomes de Wightman prennent le relais.',
 art:()=>P('M25 100 C70 20, 120 120, 175 40','m w1')+P('M25 100 C60 110, 140 0, 175 40','m w1')+P('M25 100 C50 40, 150 90, 175 40','m w1')+P('M25 100 C80 80, 120 60, 175 40','a')
   +D(25,100,4,'fi')+D(175,40,4,'fi')+T(25,118,'A',11,'tm')+T(175,28,'B',11,'tm')+T(100,134,'∫ 𝒟x e'+sup('iS/ħ'),12,'tb')}
];

const THEMES=[];CARDS_SRC.forEach(c=>{if(!THEMES.includes(c.th))THEMES.push(c.th);});
const CARDS=CARDS_SRC.map((c,i)=>({n:i+1,term:c.term,fx:c.fx,def:c.def,theme:c.th,art:c.art,_svg:null}));

/* ---------- Raccordement au moteur ---------- */
window.JEU_DE_FICHES = {
  id: "axiomisation",
  titre: "Axiomisation",
  cle: "qflash-axiomisation-v1",
  preambule: "Les physiciens disent plutôt «&nbsp;postulat&nbsp;», mais le sens est le même que l’axiome en Mathématiques&nbsp;: on l’admet sans démonstration, et la théorie se construit à partir de lui.",
  themes: THEMES.slice(),
  symboles: {
    "Toutes": "⊢",
    "Postulats": "|<i>ψ</i>⟩",
    "Compléments": "<i>E</i><sub><i>k</i></sub>",
    "Fondements logiques": "∀∃",
    "Espace de Hilbert": "ℋ",
    "Opérateurs": "<i>Â</i><sup>†</sup>",
    "Théorèmes clés": "∎",
    "Distributions et analyse": "<i>δ</i>",
    "Débats et alternatives": "≟",
    "À revoir": "↺"
  },
  indice: "Touchez la carte pour voir la formule et la définition",
  cartes: CARDS
};
