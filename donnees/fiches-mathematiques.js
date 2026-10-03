/* =====================================================================
   Fiches mathématiques — données des fiches
   ---------------------------------------------------------------------
   Reprise à l'identique des 100 fiches de la page « Outils Mathématiques de la quantique »
   (textes, formules et illustrations SVG calculées).
   Le bloc final « JEU_DE_FICHES » relie ces données au moteur js/fiches.js
   et fixe le symbole affiché sur la vignette de chaque thème.
   ===================================================================== */
const f=n=>Math.round(n*10)/10;
const PI=Math.PI;
const P=(d,c,m,ms)=>`<path d="${d}" class="l ${c||''}"${m?` marker-end="url(#${m})"`:''}${ms?` marker-start="url(#${ms})"`:''}/>`;
const L=(x1,y1,x2,y2,c,m)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="l ${c||''}"${m?` marker-end="url(#${m})"`:''}/>`;
const C=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="l ${c||''}"/>`;
const D=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="${c||'fa'}"/>`;
const R=(x,y,w,h,c,rx)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx==null?3:rx}" class="l ${c||''}"/>`;
const E=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="l ${c||''}"/>`;
const T=(x,y,s,sz,c,a)=>`<text x="${x}" y="${y}" font-size="${sz||12}" text-anchor="${a||'middle'}" class="tx ${c||''}">${s}</text>`;
const FILL=(d,c,op)=>`<path d="${d}" class="${c}"${op?` opacity="${op}"`:''}/>`;
const sub=s=>`<tspan baseline-shift="sub" font-size="70%">${s}</tspan>`;
const sup=s=>`<tspan baseline-shift="super" font-size="70%">${s}</tspan>`;

/* tracé d'une courbe y = g(x) pour x dans [a,b], dans la boîte [X,Y,W,H] avec y dans [y0,y1] */
function fn(g,a,b,X,Y,W,H,y0,y1,n){n=n||160;let d='',pen=false;
  for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=g(x);if(!isFinite(y)){pen=false;continue;}
    const py=Y+H-(y-y0)/(y1-y0)*H;if(py<Y-6||py>Y+H+6){pen=false;continue;}
    d+=(pen?'L':'M')+f(X+W*i/n)+' '+f(py)+' ';pen=true;}
  return d.trim();}
/* aire sous la courbe jusqu'à y = 0 */
function area(g,a,b,X,Y,W,H,y0,y1,n){const yb=f(Y+H-(0-y0)/(y1-y0)*H);return `M${X} ${yb} `+fn(g,a,b,X,Y,W,H,y0,y1,n).replace(/^M/,'L')+` L${X+W} ${yb} Z`;}
/* conversion valeur -> pixel */
const px=(x,a,b,X,W)=>f(X+(x-a)/(b-a)*W);
const py=(y,y0,y1,Y,H)=>f(Y+H-(y-y0)/(y1-y0)*H);
/* courbe paramétrée en coordonnées pixel */
function pth(g,t0,t1,n){n=n||120;let d='';for(let i=0;i<=n;i++){const [x,y]=g(t0+(t1-t0)*i/n);d+=(i?'L':'M')+f(x)+' '+f(y)+' ';}return d.trim();}
/* axes */
const AX=(X,Y,W,H,yb)=>L(X,yb,X+W+5,yb,'m w1','mm')+L(X,Y+H,X,Y-5,'m w1','mm');
/* diagramme en barres */
function bars(v,labs,X,yb,H,w,g,c,vmax,lsz){vmax=vmax||Math.max(...v);let s='';
  v.forEach((p,i)=>{const h=p/vmax*H,x=X+i*(w+g);if(h>0.3)s+=`<rect x="${f(x)}" y="${f(yb-h)}" width="${w}" height="${f(h)}" rx="1" class="${c||'fa'}"/>`;
    if(labs&&labs[i]!=null)s+=T(f(x+w/2),yb+11,labs[i],lsz||8,'tm');});
  return s+L(X-3,yb,f(X+v.length*(w+g)),yb,'m w1');}
/* matrice écrite avec crochets */
function mat(rows,cx,cy,o){o=o||{};const sz=o.sz||12,cw=o.cw||sz*2.2,rh=o.rh||sz*1.55,nr=rows.length,nc=rows[0].length,w=nc*cw,h=nr*rh,x0=cx-w/2,y0=cy-h/2;let s='';
  rows.forEach((r,i)=>r.forEach((e,j)=>{s+=T(f(x0+cw*(j+.5)),f(y0+rh*(i+.5)+sz*.35),e,sz,(o.hl&&o.hl(i,j))?'ta':'');}));
  const b=4;s+=P(`M${f(x0+b)} ${f(y0)} h${-b} v${f(h)} h${b}`,'w1')+P(`M${f(x0+w-b)} ${f(y0)} h${b} v${f(h)} h${-b}`,'w1');
  if(o.pre)s+=T(f(x0-7),f(cy+sz*.35),o.pre,o.psz||sz,'','end');return s;}
/* carte de chaleur d'une matrice */
function grid(M,X,Y,cs,cl){let s='';M.forEach((r,i)=>r.forEach((v,j)=>{const a=Math.min(1,Math.abs(v));
  s+=a<1e-9?`<rect x="${f(X+j*cs)}" y="${f(Y+i*cs)}" width="${f(cs-2)}" height="${f(cs-2)}" rx="1.5" class="sm"/>`
   :`<rect x="${f(X+j*cs)}" y="${f(Y+i*cs)}" width="${f(cs-2)}" height="${f(cs-2)}" rx="1.5" class="${cl?cl(v):(v<0?'fb':'fa')}" opacity="${f(.3+.7*a)}"/>`;}));return s;}
/* circuits */
const WI=(y,x1,x2)=>L(x1,y,x2,y,'m w1');
const G=(x,y,lab,sz)=>`<rect x="${x-11}" y="${y-10}" width="22" height="20" rx="3" class="l b sb"/>`+T(x,y+4,lab,sz||11,'tb');
const GW=(x,y,w,lab,sz)=>`<rect x="${x-w/2}" y="${y-10}" width="${w}" height="20" rx="3" class="l b sb"/>`+T(x,y+4,lab,sz||10,'tb');
const CT=(x,yc,yt)=>L(x,yc,x,yt+(yt>yc?7:-7),'w1')+D(x,yc,3.5,'fi')+C(x,yt,7,'w1')+L(x-7,yt,x+7,yt,'w1');
const MS=(x,y)=>`<rect x="${x-11}" y="${y-10}" width="22" height="20" rx="3" class="l w1 sm"/>`+P(`M${x-7} ${y+5} A8 8 0 0 1 ${x+7} ${y+5}`,'w1')+L(x,y+5,x+5,y-6,'w1');
const DBL=(x1,y1,x2,y2)=>x1===x2?L(x1-1.5,y1,x2-1.5,y2,'m w1')+L(x1+1.5,y1,x2+1.5,y2,'m w1'):L(x1,y1-1.5,x2,y2-1.5,'m w1')+L(x1,y1+1.5,x2,y2+1.5,'m w1');
/* sphère de Bloch : vs = [{th,ph,len,c}] */
function bloch(cx,cy,r,vs,o){o=o||{};const pr=(x,y,z)=>[f(cx+r*(y-0.42*x)),f(cy-r*(z-0.32*x))];
  let s=C(cx,cy,r,'m w1')+P(pth(t=>pr(Math.cos(t),Math.sin(t),0),0,2*PI,90),'m w1 d');
  s+=L(...pr(0,0,-1),...pr(0,0,1),'m w1')+L(...pr(-1,0,0),...pr(1,0,0),'m w1')+L(...pr(0,-1,0),...pr(0,1,0),'m w1');
  if(o.lab!==false)s+=T(...pr(0,0,1.2),'|0⟩',10,'tm')+T(...pr(0,0,-1.36),'|1⟩',10,'tm')+T(...pr(1.32,0,0),'x',9,'tm')+T(...pr(0,1.17,0.04),'y',9,'tm','start');
  if(o.extra)s+=o.extra(pr);
  vs.forEach(v=>{const l=v.len==null?1:v.len,x=l*Math.sin(v.th)*Math.cos(v.ph),y=l*Math.sin(v.th)*Math.sin(v.ph),z=l*Math.cos(v.th);
    if(v.drop)s+=L(...pr(x,y,z),...pr(x,y,0),'m w1 d')+L(cx,cy,...pr(x,y,0),'m w1 d');
    s+=L(cx,cy,...pr(x,y,z),v.c||'a','m'+(v.c||'a')[0])+D(...pr(x,y,z),2.6,'f'+(v.c||'a')[0]);
    if(v.t)s+=T(f(pr(x,y,z)[0]+(v.dx||8)),f(pr(x,y,z)[1]+(v.dy||-4)),v.t,10,'t'+(v.c||'a')[0],'start');});
  return s;}
const h2=p=>p<=0||p>=1?0:-p*Math.log2(p)-(1-p)*Math.log2(1-p);
const binom=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r;};

const CARDS_SRC=[
/* ───────── Nombres complexes ───────── */
{th:'Complexes',term:'Nombre complexe et module',
 fx:'z = a + ib  ;  |z|² = z z̄ = a² + b²',
 def:'Les amplitudes quantiques sont des nombres complexes. Une probabilité est toujours le carré d’un module, donc un réel positif.',
 art:()=>L(28,105,186,105,'m w1','mm')+L(50,126,50,12,'m w1','mm')+L(150,40,150,105,'m w1 d')+L(150,40,50,40,'m w1 d')+L(50,105,150,40,'a','ma')+D(150,40,3.5)
   +P('M72 105 A22 22 0 0 0 68.4 93','m w1')+T(78,99,'θ',10,'tm','start')+T(150,118,'a',11,'tm')+T(42,44,'b',11,'tm','end')+T(94,64,'|z|',12,'ta','end')+T(150,30,'z = a + ib',11,'ta')+T(186,99,'Re',9,'tm','end')+T(56,16,'Im',9,'tm','start')},
{th:'Complexes',term:'Formule d’Euler',
 fx:'e<sup>iθ</sup> = cos θ + i sin θ',
 def:'Un complexe de module 1 est un point du cercle unité repéré par sa phase θ. Toute amplitude s’écrit r·e<sup>iθ</sup>.',
 art:()=>{const b=[22,20,160,80],r=[-1.25,1.25];return AX(22,20,160,80,60)+P(fn(Math.cos,0,2*PI,...b,...r),'b')+P(fn(Math.sin,0,2*PI,...b,...r),'a')+T(182,73,'2π',9,'tm')+T(16,30,'1',9,'tm')
   +T(56,126,'cos θ',11,'tb')+T(140,126,'sin θ',11,'ta');}},
{th:'Complexes',term:'Phase globale et phase relative',
 fx:'e<sup>iγ</sup>|ψ⟩ ≡ |ψ⟩  ;  α|0⟩ + e<sup>iφ</sup>β|1⟩',
 def:'Une phase globale ne change aucun résultat de mesure. Une phase relative, elle, modifie les interférences : après une porte H, P(0) = cos²(φ/2) pour α = β.',
 art:()=>{const b=[28,22,150,80],r=[0,1.05];return AX(28,22,150,80,102)+P(fn(p=>Math.cos(p/2)**2,0,2*PI,...b,...r),'a')
   +T(22,30,'1',9,'tm','end')+T(178,116,'φ = 2π',9,'tm','end')+T(32,116,'0',9,'tm')+T(103,126,'P(0) après H = cos²(φ/2)',10,'ta')+D(28,py(1,...r,22,80),3.5,'fb')+D(103,py(0,...r,22,80),3.5,'fb')+T(36,40,'|+⟩',10,'tb','start')+T(103,92,'|−⟩',10,'tb');}},
{th:'Complexes',term:'Racines de l’unité',
 fx:'ω = e<sup>2iπ/N</sup>  ;  Σ<sub>k=0</sub><sup>N−1</sup> ω<sup>k</sup> = 0',
 def:'Les N nombres ω<sup>k</sup> sont régulièrement répartis sur le cercle unité et leur somme est nulle. C’est la clé de la transformée de Fourier quantique.',
 art:()=>{let s=L(46,66,154,66,'m w1')+L(100,14,100,118,'m w1')+C(100,66,46,'m w1 d');const pts=[];for(let k=0;k<8;k++){const a=2*PI*k/8;pts.push([f(100+46*Math.cos(a)),f(66-46*Math.sin(a))]);}
   s+=P('M'+pts.map(p=>p.join(' ')).join(' L')+' Z','b w1');pts.forEach(p=>s+=D(p[0],p[1],3.5,'fa'));
   return s+T(144,26,'ω',12,'ta','start')+T(160,70,'1',10,'tm','start')+T(100,134,'N = 8 : la somme des ωᵏ est nulle',10,'tm');}},

/* ───────── Algèbre linéaire ───────── */
{th:'Algèbre linéaire',term:'Combinaison linéaire et superposition',
 fx:'|ψ⟩ = Σ<sub>i</sub> c<sub>i</sub> |e<sub>i</sub>⟩ ∈ ℂ<sup>n</sup>',
 def:'Un état est une combinaison linéaire des vecteurs d’une base : c’est la traduction mathématique de la superposition. Les c<sub>i</sub> sont les amplitudes.',
 art:()=>L(40,110,130,110,'m','mm')+L(40,110,40,20,'m','mm')+P('M130 110 A90 90 0 0 0 40 20','m w1 d')+L(112,56,112,110,'m w1 d')+L(40,56,112,56,'m w1 d')+L(40,110,112,56,'a','ma')
   +T(142,114,'|0⟩',11,'tm','start')+T(40,13,'|1⟩',11,'tm')+T(118,50,'|ψ⟩',12,'ta','start')+T(76,124,'0,8',10,'tm')+T(32,86,'0,6',10,'tm','end')},
{th:'Algèbre linéaire',term:'Produit scalaire hermitien',
 fx:'⟨u|v⟩ = Σ<sub>i</sub> ū<sub>i</sub> v<sub>i</sub>  ;  ⟨u|v⟩ = <span style="text-decoration:overline">⟨v|u⟩</span>',
 def:'Il mesure le recouvrement de deux états. La conjugaison du premier vecteur garantit que ⟨u|u⟩ est un réel positif.',
 art:()=>L(40,110,155.9,78.9,'b','mb')+L(40,110,97.4,28.1,'a','ma')+L(97.4,28.1,114,90.2,'m w1 d')+L(40,110,114,90.2,'b')+P('M61.3 104.3 A22 22 0 0 0 52.6 92','m w1')
   +T(64,92,'θ',10,'tm','start')+T(162,82,'u',12,'tb','start')+T(100,22,'v',12,'ta','start')+T(100,132,'projection de v sur u : |v| cos θ',10,'tm')},
{th:'Algèbre linéaire',term:'Norme et normalisation',
 fx:'‖ψ‖ = √⟨ψ|ψ⟩ = 1',
 def:'Un état physique est un vecteur unitaire : la somme des probabilités de tous les résultats vaut 1. On normalise en divisant par la norme.',
 art:()=>{let s=C(100,66,48,'m w1 d')+D(100,66,2.5,'fi');[20,75,140,215,300].forEach((d,i)=>{const a=d*PI/180;s+=L(100,66,f(100+48*Math.cos(a)),f(66-48*Math.sin(a)),i%2?'b':'a',i%2?'mb':'ma');});
   return s+T(100,132,'tous les états vivent sur la sphère unité',10,'tm');}},
{th:'Algèbre linéaire',term:'Base orthonormée',
 fx:'⟨e<sub>i</sub>|e<sub>j</sub>⟩ = δ<sub>ij</sub>',
 def:'Des vecteurs deux à deux orthogonaux et de norme 1. Le symbole de Kronecker δ<sub>ij</sub> vaut 1 si i = j et 0 sinon : la matrice de Gram est l’identité.',
 art:()=>grid([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]],60,14,20)+T(100,112,'matrice des ⟨eᵢ|eⱼ⟩ : l’identité',10,'tm')+T(100,128,'δᵢⱼ = 1 si i = j, 0 sinon',10,'ta')},
{th:'Algèbre linéaire',term:'Adjoint (transconjuguée)',
 fx:'A<sup>†</sup> = Ā<sup>T</sup>  ;  (AB)<sup>†</sup> = B<sup>†</sup>A<sup>†</sup>',
 def:'On transpose la matrice puis on conjugue chaque coefficient. L’adjoint d’un ket est un bra : |ψ⟩<sup>†</sup> = ⟨ψ|.',
 art:()=>mat([['1','i'],['2','3 − i']],56,60,{sz:11,cw:28})+L(90,60,112,60,'a','ma')+T(100,50,'†',15,'ta')+mat([['1','2'],['−i','3 + i']],148,60,{sz:11,cw:28,hl:i=>i===1})+T(100,112,'transposer, puis conjuguer',10,'tm')},
{th:'Algèbre linéaire',term:'Valeurs propres et vecteurs propres',
 fx:'A|v⟩ = λ|v⟩  ;  det(A − λI) = 0',
 def:'Un vecteur propre est seulement dilaté par A, d’un facteur λ. En quantique, les valeurs propres d’une observable sont les résultats possibles de sa mesure.',
 art:()=>{const s=22;return C(100,66,s,'m w1 d')+P(pth(t=>[100+s*(2*Math.cos(t)+Math.sin(t)),66-s*(Math.cos(t)+2*Math.sin(t))],0,2*PI),'m')
   +L(100,66,146.7,19.3,'a','ma')+L(100,66,115.6,81.6,'b','mb')+T(138,13,'λ = 3',10,'ta','end')+T(122,98,'λ = 1',10,'tb','start')+T(100,134,'A = (2 1 ; 1 2) : le cercle devient une ellipse',9,'tm');}},
{th:'Algèbre linéaire',term:'Trace',
 fx:'Tr(A) = Σ<sub>i</sub> A<sub>ii</sub> = Σ<sub>i</sub> λ<sub>i</sub>  ;  Tr(AB) = Tr(BA)',
 def:'La somme des coefficients diagonaux, égale à la somme des valeurs propres. Elle ne dépend pas de la base et sert partout avec les matrices densité.',
 art:()=>mat([['2','5','1'],['0','−1','4'],['7','3','4']],100,56,{sz:13,cw:30,hl:(i,j)=>i===j})+T(100,118,'Tr A = 2 − 1 + 4 = 5',12,'ta')},
{th:'Algèbre linéaire',term:'Déterminant et diagonalisation',
 fx:'A = PDP<sup>−1</sup>  ;  det A = Π<sub>i</sub> λ<sub>i</sub>',
 def:'Diagonaliser, c’est trouver une base de vecteurs propres où A agit comme une simple dilatation. Le déterminant mesure le facteur de changement d’aire (ou de volume).',
 art:()=>P('M40 110 L80 110 L80 70 L40 70 Z','m w1 d')+P('M40 110 L100 98 L120 50 L60 62 Z','a sa')+T(60,94,'1',10,'tm')+T(92,80,'A',13,'ta')+T(100,132,'aire multipliée par det A = 1,65',10,'ta')},
{th:'Algèbre linéaire',term:'Théorème spectral',
 fx:'A = Σ<sub>i</sub> λ<sub>i</sub> |e<sub>i</sub>⟩⟨e<sub>i</sub>| = Σ<sub>i</sub> λ<sub>i</sub> P<sub>i</sub>',
 def:'Tout opérateur normal (hermitien ou unitaire) se diagonalise dans une base orthonormée : c’est une somme de projecteurs pondérés par ses valeurs propres.',
 art:()=>{let s=L(22,96,184,96,'m w1','mm')+L(70,92,70,100,'m w1')+T(70,110,'0',9,'tm');[[-1,'λ₁','P₁',.6],[0.5,'λ₂','P₂',1],[2,'λ₃','P₃',.8]].forEach(([l,n,p,h])=>{const x=70+30*l;s+=L(x,96,x,f(96-60*h),'a')+D(x,f(96-60*h),3.5)+T(x,110,n,10,'ta')+T(x,f(88-60*h),p,10,'tb');});
   return s+T(100,132,'A = λ₁P₁ + λ₂P₂ + λ₃P₃',11,'tm');}},

/* ───────── Dirac et Hilbert ───────── */
{th:'Dirac et Hilbert',term:'Ket et bra',
 fx:'|ψ⟩ = (α, β)<sup>T</sup>  ;  ⟨ψ| = |ψ⟩<sup>†</sup> = (α*, β*)',
 def:'Le ket est un vecteur colonne, le bra est le vecteur ligne conjugué. Un bra « mange » un ket pour donner un nombre.',
 art:()=>mat([['α'],['β']],60,58,{sz:14,cw:24,pre:'|ψ⟩ ='})+mat([['α*','β*']],152,58,{sz:13,cw:26,pre:'⟨ψ| ='})+T(60,112,'colonne',10,'tm')+T(152,112,'ligne conjuguée',10,'tm')},
{th:'Dirac et Hilbert',term:'Produit scalaire et produit extérieur',
 fx:'⟨φ|ψ⟩ ∈ ℂ  ;  |u⟩⟨v| est une matrice',
 def:'Ligne × colonne donne un nombre (une amplitude). Colonne × ligne donne un opérateur : par exemple |0⟩⟨0| est un projecteur.',
 art:()=>T(22,40,'⟨φ|ψ⟩',11,'tm')+R(44,31,36,9,'b sb',1)+R(86,18,9,36,'a sa',1)+T(110,40,'=',13,'tm')+`<rect x="122" y="31" width="9" height="9" rx="1" class="fi"/>`+T(140,40,'un nombre',10,'tm','start')
   +T(22,100,'|u⟩⟨v|',11,'tm')+R(44,78,9,36,'a sa',1)+R(59,91,36,9,'b sb',1)+T(110,100,'=',13,'tm')+R(122,78,36,36,'m sm',1)+T(140,128,'une matrice',10,'tm')},
{th:'Dirac et Hilbert',term:'Relation de fermeture',
 fx:'Σ<sub>i</sub> |e<sub>i</sub>⟩⟨e<sub>i</sub>| = I',
 def:'La somme des projecteurs sur une base complète est l’identité. On l’insère dans un calcul pour décomposer un état ou changer de base.',
 art:()=>L(140,45,140,110,'m w1 d')+L(140,45,50,45,'m w1 d')+L(50,110,140,110,'b','mb')+L(50,110,50,45,'b','mb')+L(50,110,140,45,'a','ma')
   +T(95,124,'|0⟩⟨0|ψ⟩',10,'tb')+T(44,80,'|1⟩⟨1|ψ⟩',10,'tb','end')+T(146,40,'|ψ⟩',12,'ta','start')+T(166,92,'somme',10,'tm')+T(166,106,'= |ψ⟩',10,'tm')},
{th:'Dirac et Hilbert',term:'Espace de Hilbert',
 fx:'⟨f|g⟩ = ∫ f*(x) g(x) dx  ;  L²(ℝ)',
 def:'Espace vectoriel complet muni d’un produit scalaire. Il peut être de dimension infinie : les fonctions d’onde de carré intégrable forment L²(ℝ).',
 art:()=>{const b=[22,20,160,85],r=[0,1.1],g1=x=>Math.exp(-((x+1)**2)/2),g2=x=>Math.exp(-((x-1)**2)/2);
   return FILL(area(x=>g1(x)*g2(x),-4,4,...b,...r),'sb')+AX(22,20,160,85,105)+P(fn(g1,-4,4,...b,...r),'a')+P(fn(g2,-4,4,...b,...r),'b')
   +T(58,30,'f',12,'ta')+T(146,30,'g',12,'tb')+T(102,126,'⟨f|g⟩ : l’aire du recouvrement',10,'tb');}},

/* ───────── Opérateurs ───────── */
{th:'Opérateurs',term:'Opérateur hermitien (observable)',
 fx:'A = A<sup>†</sup>  ⇒  λ ∈ ℝ',
 def:'Les grandeurs mesurables sont représentées par des opérateurs hermitiens : leurs valeurs propres sont réelles et leurs vecteurs propres orthogonaux.',
 art:()=>mat([['2','1 − i'],['1 + i','3']],100,52,{sz:13,cw:42,hl:(i,j)=>i===j})+T(100,102,'diagonale réelle, aᵢⱼ = a*ⱼᵢ',10,'tm')+T(100,122,'valeurs propres : 1 et 4',11,'ta')},
{th:'Opérateurs',term:'Opérateur unitaire',
 fx:'U<sup>†</sup>U = I  ;  ‖U|ψ⟩‖ = ‖ψ‖',
 def:'Il conserve les normes et les angles : c’est une rotation dans l’espace des états. Il est toujours réversible, avec U<sup>−1</sup> = U<sup>†</sup>.',
 art:()=>{const p=a=>[f(100+50*Math.cos(a*PI/180)),f(70-50*Math.sin(a*PI/180))];return C(100,70,50,'m w1 d')+L(100,70,...p(20),'b','mb')+L(100,70,...p(95),'a','ma')
   +P(pth(t=>[100+30*Math.cos(t),70-30*Math.sin(t)],28*PI/180,86*PI/180,30),'m w1','mm')+T(158,52,'|ψ⟩',11,'tb','start')+T(84,14,'U|ψ⟩',11,'ta','end')+T(126,40,'U',12,'tm')+T(100,134,'longueur conservée',10,'tm');}},
{th:'Opérateurs',term:'Projecteur',
 fx:'P² = P = P<sup>†</sup>  ;  P<sub>0</sub> = |0⟩⟨0|',
 def:'Il projette orthogonalement sur un sous-espace ; l’appliquer deux fois ne change plus rien. La mesure s’écrit avec des projecteurs.',
 art:()=>L(22,109.8,186,65.9,'m w1')+L(40,105,110,35,'a','ma')+L(110,35,122.8,82.8,'m w1 d')+L(40,105,122.8,82.8,'b','mb')+P('M115.1 84.9 L113.2 77.7 L120.9 75.6','m w1')
   +T(116,30,'|ψ⟩',12,'ta','start')+T(128,98,'P|ψ⟩',12,'tb','start')+T(178,58,'sous-espace',9,'tm','end')},
{th:'Opérateurs',term:'Opérateur positif',
 fx:'⟨ψ|A|ψ⟩ ≥ 0 pour tout |ψ⟩',
 def:'Toutes ses valeurs propres sont positives ou nulles. Matrices densité et éléments de mesure (POVM) sont des opérateurs positifs.',
 art:()=>{const b=[22,18,160,90],r=[-0.3,1.9],g=t=>1+0.7*Math.cos(2*t);return FILL(area(g,0,PI,...b,...r),'sa')+AX(22,18,160,90,py(0,...r,18,90))+P(fn(g,0,PI,...b,...r),'a')
   +T(16,f(py(0,...r,18,90)+3),'0',9,'tm','end')+T(100,128,'⟨ψ(θ)|A|ψ(θ)⟩ reste au-dessus de 0',10,'ta');}},
{th:'Opérateurs',term:'Commutateur',
 fx:'[A, B] = AB − BA  ;  [X, Y] = 2iZ',
 def:'S’il est nul, A et B ont une base propre commune et peuvent être mesurés simultanément. Sinon, l’ordre des opérations compte.',
 art:()=>L(40,110,110,110,'m','mm')+L(40,110,96,13,'a','ma')+L(40,110,96,49.4,'b','mb')+L(96,49.4,96,16,'m w1 d')
   +T(116,114,'v',11,'tm','start')+T(104,18,'AB v',10,'ta','start')+T(104,36,'[A, B] v',10,'tm','start')+T(104,56,'BA v',10,'tb','start')+T(100,132,'A : rotation de 60°, B : étirement ×1,6',9,'tm')},
{th:'Opérateurs',term:'Anticommutateur',
 fx:'{A, B} = AB + BA  ;  {σ<sub>i</sub>, σ<sub>j</sub>} = 2δ<sub>ij</sub> I',
 def:'Les matrices de Pauli anticommutent deux à deux : XY = −YX. C’est la base des calculs sur le groupe de Pauli et la correction d’erreurs.',
 art:()=>mat([['i','0'],['0','−i']],64,54,{sz:12,cw:22,pre:'XY ='})+mat([['−i','0'],['0','i']],156,54,{sz:12,cw:22,pre:'YX ='})+T(100,108,'XY + YX = 0',12,'ta')+T(100,126,'XY = iZ et YX = −iZ',10,'tm')},
{th:'Opérateurs',term:'Exponentielle de matrice',
 fx:'e<sup>A</sup> = Σ<sub>k</sub> A<sup>k</sup>/k!  ;  U = e<sup>−iHt/ħ</sup>',
 def:'Même série que pour l’exponentielle réelle. Si H est hermitien, e<sup>−iHt</sup> est unitaire ; si A est diagonalisable, on exponentie ses valeurs propres.',
 art:()=>{const b=[22,16,160,94],r=[-1,7.5];let s=AX(22,16,160,94,py(0,...r,16,94));const S=k=>x=>{let t=0,p=1;for(let i=0;i<=k;i++){t+=p;p*=x/(i+1);}return t;};
   [1,2,3].forEach(k=>s+=P(fn(S(k),-2,2,...b,...r),'b w1'+(k<3?' d':'')));s+=P(fn(Math.exp,-2,2,...b,...r),'a');
   return s+T(150,30,'eˣ',12,'ta','end')+T(170,82,'1 + x',9,'tb','start')+T(100,132,'les sommes partielles convergent vers eˣ',10,'tm');}},

/* ───────── Produit tensoriel ───────── */
{th:'Produit tensoriel',term:'Produit tensoriel d’états',
 fx:'|a⟩ ⊗ |b⟩ = |ab⟩  ;  dim = 2<sup>n</sup> pour n qubits',
 def:'L’espace de plusieurs systèmes est le produit tensoriel de leurs espaces. Sa dimension double à chaque qubit ajouté : c’est la source de la puissance quantique.',
 art:()=>{const v=[1,2,3,4,5,6,7].map(n=>2**n);let s=bars(v,[1,2,3,4,5,6,7],24,108,86,16,6,'fb');v.forEach((p,i)=>s+=T(f(32+i*22),f(104-p/128*86),p,8,'tb'));return s+T(100,134,'n qubits : 2ⁿ amplitudes',10,'tm');}},
{th:'Produit tensoriel',term:'Produit de Kronecker',
 fx:'A ⊗ B = (a<sub>ij</sub> B)  ;  (A ⊗ B)(|a⟩ ⊗ |b⟩) = A|a⟩ ⊗ B|b⟩',
 def:'Chaque coefficient de A est remplacé par le bloc a<sub>ij</sub>B. C’est ainsi qu’on écrit la matrice d’une porte agissant sur plusieurs qubits.',
 art:()=>{const X=[[0,1],[1,0]],Z=[[1,0],[0,-1]],K=[];for(let i=0;i<4;i++){K.push([]);for(let j=0;j<4;j++)K[i].push(X[i>>1][j>>1]*Z[i&1][j&1]);}
   return grid(K,60,14,20)+L(99,10,99,96,'m w1 d')+L(56,55,144,55,'m w1 d')+T(100,114,'X ⊗ Z',12,'tm')+T(100,130,'orange : +1, violet : −1',9,'tm');}},
{th:'Produit tensoriel',term:'État séparable ou intriqué',
 fx:'Σ c<sub>ij</sub>|ij⟩ séparable ⇔ det(c<sub>ij</sub>) = 0 (deux qubits)',
 def:'Un état est intriqué s’il ne peut pas s’écrire |a⟩ ⊗ |b⟩. Pour deux qubits, cela se lit sur le déterminant de la matrice des amplitudes.',
 art:()=>grid([[.707,0],[.707,0]],30,22,28)+grid([[.707,0],[0,.707]],116,22,28)+T(57,96,'|+⟩|0⟩ : séparable',10,'tm')+T(57,112,'det = 0',10,'tb')+T(143,96,'|Φ⁺⟩ : intriqué',10,'ta')+T(143,112,'det = ½',10,'ta')},

/* ───────── Mesure et probabilités ───────── */
{th:'Mesure et probabilités',term:'Règle de Born',
 fx:'P(i) = |⟨e<sub>i</sub>|ψ⟩|²',
 def:'La probabilité d’un résultat est le carré du module de l’amplitude correspondante. C’est le pont entre le formalisme et l’expérience.',
 art:()=>{const amp=[.2,.4,.8,.4];let s='';amp.forEach((a,i)=>{const x=30+i*40;s+=`<rect x="${x}" y="${f(104-a*80)}" width="12" height="${f(a*80)}" rx="1" class="fb" opacity=".5"/>`+`<rect x="${x+13}" y="${f(104-a*a*80)}" width="12" height="${f(a*a*80)}" rx="1" class="fa"/>`+T(x+12,116,['|00⟩','|01⟩','|10⟩','|11⟩'][i],9,'tm');});
   return s+L(26,104,184,104,'m w1')+T(60,134,'amplitude',10,'tb')+T(142,134,'probabilité',10,'ta');}},
{th:'Mesure et probabilités',term:'Réduction de l’état (effondrement)',
 fx:'|ψ⟩ → P<sub>i</sub>|ψ⟩ / ‖P<sub>i</sub>|ψ⟩‖',
 def:'Après une mesure donnant le résultat i, l’état est projeté sur le sous-espace correspondant puis renormalisé. Une seconde mesure redonne i à coup sûr.',
 art:()=>bars([.2,.5,.3],['0','1','2'],20,100,70,12,6,'fa',1)+L(84,70,114,70,'m','mm')+T(99,60,'résultat 1',9,'tm')+bars([0,1,0],['0','1','2'],124,100,70,12,6,'fa',1)+T(100,130,'projection puis renormalisation',10,'tm')},
{th:'Mesure et probabilités',term:'Valeur moyenne',
 fx:'⟨A⟩ = ⟨ψ|A|ψ⟩ = Σ<sub>i</sub> λ<sub>i</sub> P(λ<sub>i</sub>)',
 def:'La moyenne des résultats obtenus sur un grand nombre de mesures répétées d’états préparés à l’identique.',
 art:()=>{const p=[.1,.2,.4,.3];let s='';p.forEach((q,i)=>{const x=40+35*i;s+=`<rect x="${x-10}" y="${f(104-q*170)}" width="20" height="${f(q*170)}" rx="1" class="fb"/>`+T(x,116,['−1','0','1','2'][i],10,'tm');});
   const m=40+35*1.9;return s+L(22,104,184,104,'m w1')+L(f(m),104,f(m),18,'a d')+T(f(m),13,'⟨A⟩ = 0,9',10,'ta')+T(100,134,'résultats λ et leurs probabilités',9,'tm');}},
{th:'Mesure et probabilités',term:'Écart-type',
 fx:'ΔA = √(⟨A²⟩ − ⟨A⟩²)',
 def:'Il mesure la dispersion des résultats autour de la moyenne. Il est nul si et seulement si l’état est un vecteur propre de A.',
 art:()=>{const b=[22,16,160,92],r=[0,0.72],g=s=>x=>Math.exp(-x*x/(2*s*s))/(s*Math.sqrt(2*PI));return AX(22,16,160,92,108)+P(fn(g(1.5),-4,4,...b,...r),'b')+P(fn(g(0.6),-4,4,...b,...r),'a')
   +T(124,30,'ΔA petit',10,'ta','start')+T(160,92,'ΔA grand',10,'tb','start')+T(100,128,'même moyenne, dispersions différentes',10,'tm');}},
{th:'Mesure et probabilités',term:'Inégalité de Heisenberg',
 fx:'ΔA ΔB ≥ ½ |⟨[A, B]⟩|  ;  Δx Δp ≥ ħ/2',
 def:'Deux observables qui ne commutent pas ne peuvent pas être toutes deux précises. Une fonction d’onde étroite en x est large en p (transformée de Fourier).',
 art:()=>{const r=[0,1.05],g=s=>x=>Math.exp(-x*x/(2*s*s));return FILL(area(g(.5),-3,3,14,20,78,80,...r),'sa')+P(fn(g(.5),-3,3,14,20,78,80,...r),'a')+L(14,100,96,100,'m w1')
   +FILL(area(g(1),-3,3,106,20,78,80,...r),'sb')+P(fn(g(1),-3,3,106,20,78,80,...r),'b')+L(106,100,188,100,'m w1')+T(53,114,'|ψ(x)|², Δx petit',9,'ta')+T(147,114,'|φ(p)|², Δp grand',9,'tb')+T(100,133,'Δx · Δp ≥ ħ/2',12,'tm');}},
{th:'Mesure et probabilités',term:'Mesure généralisée (POVM)',
 fx:'E<sub>i</sub> ≥ 0  ;  Σ<sub>i</sub> E<sub>i</sub> = I  ;  P(i) = ⟨ψ|E<sub>i</sub>|ψ⟩',
 def:'Les éléments de mesure ne sont pas forcément des projecteurs orthogonaux. Exemple : la mesure « trine », trois éléments E<sub>k</sub> = ⅔|φ<sub>k</sub>⟩⟨φ<sub>k</sub>| sur un seul qubit.',
 art:()=>{let s=C(100,64,46,'m w1 d');[[90,'a','E₁'],[210,'b','E₂'],[330,'m','E₃']].forEach(([d,c,n])=>{const a=d*PI/180,x=f(100+46*Math.cos(a)),y=f(64-46*Math.sin(a));s+=L(100,64,x,y,c,'m'+c)+T(f(100+60*Math.cos(a)),f(68-58*Math.sin(a)),n,11,'t'+c);});
   return s+T(100,134,'trois directions à 120° sur la sphère de Bloch',9,'tm');}},
{th:'Mesure et probabilités',term:'Loi binomiale et répétition',
 fx:'P(k) = C(n, k) p<sup>k</sup> (1 − p)<sup>n−k</sup>',
 def:'Répéter n fois une mesure de probabilité p : le nombre k de succès suit une loi binomiale. C’est ainsi qu’on estime une probabilité sur un vrai processeur (les « shots »).',
 art:()=>{const v=[];for(let k=0;k<=20;k++)v.push(binom(20,k)*.3**k*.7**(20-k));const lb=v.map((_,k)=>k%5===0?k:null);
   return bars(v,lb,22,106,84,6,1.5,'fb')+L(70,106,70,16,'a d')+T(76,24,'np = 6',10,'ta','start')+T(100,132,'n = 20 mesures, p = 0,3',10,'tm');}},
{th:'Mesure et probabilités',term:'Borne de Chernoff (amplification)',
 fx:'P(échec du vote majoritaire) ≤ e<sup>−2nε²</sup>',
 def:'Un algorithme correct avec probabilité ½ + ε devient presque sûr si on le répète n fois et qu’on vote à la majorité : l’erreur décroît exponentiellement.',
 art:()=>{const b=[22,18,160,88],r=[0,1.05],g=n=>Math.exp(-2*n*.01);return FILL(area(g,0,300,...b,...r),'sa')+AX(22,18,160,88,106)+P(fn(g,0,300,...b,...r),'a')+D(px(150,0,300,22,160),py(g(150),...r,18,88),3.5)
   +T(16,24,'1',9,'tm','end')+T(182,118,'n',10,'tm','end')+T(110,86,'n = 150 : 5 %',9,'ta','start')+T(100,132,'ε = 0,1',10,'tm');}},

/* ───────── Dynamique ───────── */
{th:'Dynamique',term:'Équation de Schrödinger',
 fx:'iħ ∂|ψ(t)⟩/∂t = H|ψ(t)⟩',
 def:'L’équation d’évolution de tout système isolé. Elle est linéaire et du premier ordre en temps : connaître ψ(0) suffit pour connaître ψ(t).',
 art:()=>{let s='';[[48,8,30],[100,10,66],[152,13,102]].forEach(([c,w,y],i)=>{s+=L(26,y,186,y,'m w1 d')+P(pth(x=>[x,y-13*Math.exp(-((x-c)**2)/(2*w*w))*Math.cos(2*PI*(x-c)/11)],26,186,200),i===1?'a':'b')+T(20,y+3,'t'+['₀','₁','₂'][i],10,'tm','end');});
   return s+T(100,132,'un paquet d’ondes avance et s’étale',10,'tm');}},
{th:'Dynamique',term:'Évolution unitaire',
 fx:'|ψ(t)⟩ = e<sup>−iHt/ħ</sup> |ψ(0)⟩',
 def:'Solution de l’équation de Schrödinger lorsque H ne dépend pas du temps. Exemple : un qubit soumis à un champ oscille entre |0⟩ et |1⟩ (oscillation de Rabi).',
 art:()=>{const b=[22,18,160,86],r=[0,1.05],g=t=>Math.sin(t/2)**2;return AX(22,18,160,86,104)+P(fn(g,0,4*PI,...b,...r),'a')+T(16,24,'1',9,'tm','end')+T(182,116,'t',10,'tm','end')+T(100,128,'P₁(t) = sin²(Ωt/2)',11,'ta');}},
{th:'Dynamique',term:'États stationnaires',
 fx:'H|ψ<sub>n</sub>⟩ = E<sub>n</sub>|ψ<sub>n</sub>⟩  ;  |ψ<sub>n</sub>(t)⟩ = e<sup>−iE<sub>n</sub>t/ħ</sup>|ψ<sub>n</sub>⟩',
 def:'Les états propres de H ne font que tourner en phase : leur densité de probabilité ne change pas avec le temps. C’est l’équation de Schrödinger indépendante du temps.',
 art:()=>{const b=[22,18,160,84],r=[-1.25,1.3];return AX(22,18,160,84,py(0,...r,18,84))+P(fn(()=>1,0,4*PI,...b,...r),'a')+P(fn(Math.cos,0,4*PI,...b,...r),'b w1')+P(fn(t=>-Math.sin(t),0,4*PI,...b,...r),'m w1 d')
   +T(184,15,'|ψ|² = 1',9,'ta','end')+T(100,124,'parties réelle et imaginaire de e^(−iEt/ħ)',9,'tm');}},
{th:'Dynamique',term:'Hamiltonien',
 fx:'H = p²/2m + V(x)  ;  spin : H = −μ⃗·B⃗',
 def:'L’opérateur énergie. Ses valeurs propres sont les niveaux d’énergie et il engendre l’évolution dans le temps. Exemple : un double puits de potentiel.',
 art:()=>{const b=[22,14,160,100],r=[-1.2,3.2],V=x=>x**4-2*x*x;let s=P(fn(V,-1.85,1.85,...b,...r),'');
   [-0.75,0.3,1.4].forEach(E=>{const sq=Math.sqrt(1+E),yy=py(E,...r,14,100);const seg=(a,c)=>s+=L(px(a,-1.85,1.85,22,160),yy,px(c,-1.85,1.85,22,160),yy,'a w1');if(E<0){const lo=Math.sqrt(1-sq),hi=Math.sqrt(1+sq);seg(-hi,-lo);seg(lo,hi);}else{const hi=Math.sqrt(1+sq);seg(-hi,hi);}});
   return s+T(100,30,'V(x)',10,'tm')+T(100,132,'niveaux d’énergie dans un double puits',10,'tm');}},
{th:'Dynamique',term:'Formule de Trotter-Suzuki',
 fx:'e<sup>(A+B)t</sup> ≈ (e<sup>At/n</sup> e<sup>Bt/n</sup>)<sup>n</sup>  ;  erreur en O(t²/n)',
 def:'Pour simuler un hamiltonien somme de termes qui ne commutent pas, on découpe le temps en n petits pas. Plus n est grand, plus l’approximation est fine.',
 art:()=>{const b=[22,18,160,86],r=[0,1.05];let s=AX(22,18,160,86,104)+P(fn(n=>1/n,1,10,...b,...r),'m w1 d');for(let n=1;n<=10;n++)s+=D(px(n,1,10,22,160),py(1/n,...r,18,86),3.5,'fa');
   return s+T(182,118,'n',10,'tm','end')+T(100,132,'erreur proportionnelle à 1/n',10,'tm');}},

/* ───────── Analyse ───────── */
{th:'Analyse',term:'Fonction d’onde',
 fx:'ψ(x) = ⟨x|ψ⟩  ;  ∫ |ψ(x)|² dx = 1',
 def:'|ψ(x)|² est une densité de probabilité de présence : l’aire totale sous la courbe vaut 1. La fonction d’onde elle-même est complexe et oscille.',
 art:()=>{const b=[22,16,160,92],r=[-1.1,1.1],g=x=>Math.exp(-x*x/2)*Math.cos(3*x);return FILL(area(x=>g(x)**2,-4,4,...b,...r),'sa')+L(22,62,186,62,'m w1')+P(fn(g,-4,4,...b,...r),'b w1')+P(fn(x=>g(x)**2,-4,4,...b,...r),'a')
   +T(40,40,'Re ψ',10,'tb')+T(150,40,'|ψ|²',11,'ta')+T(100,128,'aire sous |ψ|² = 1',10,'ta');}},
{th:'Analyse',term:'Opérateurs position et impulsion',
 fx:'x̂ψ = xψ  ;  p̂ = −iħ ∂/∂x  ;  [x̂, p̂] = iħ',
 def:'L’impulsion agit comme une dérivée. Une onde plane e<sup>ikx</sup> est vecteur propre de p̂, de valeur propre p = ħk.',
 art:()=>{const b=[22,24,160,72],r=[-1.2,1.2];return L(22,60,186,60,'m w1')+P(fn(x=>Math.cos(x),0,6*PI,...b,...r),'b')+P(fn(x=>Math.sin(x),0,6*PI,...b,...r),'a d')
   +T(40,112,'Re e^(ikx)',9,'tb','start')+T(118,112,'Im e^(ikx)',9,'ta','start')+T(100,132,'p̂ e^(ikx) = ħk e^(ikx)',11,'tm');}},
{th:'Analyse',term:'Puits de potentiel infini',
 fx:'ψ<sub>n</sub>(x) = √(2/L) sin(nπx/L)  ;  E<sub>n</sub> = n²π²ħ²/(2mL²)',
 def:'Une particule enfermée dans une boîte : les énergies croissent comme n² et ψ<sub>n</sub> présente n − 1 nœuds. C’est le premier exemple de quantification.',
 art:()=>{let s=P('M40 12 V118 H160 V12','');[1,2,3].forEach(n=>{const y=118-10*n*n;s+=L(40,y,160,y,'m w1 d')+P(pth(x=>[x,y-7*Math.sin(n*PI*(x-40)/120)],40,160,90),'a')+T(166,y+3,'n = '+n,9,'tm','start');});return s+T(100,134,'Eₙ ∝ n²',11,'tm');}},
{th:'Analyse',term:'Oscillateur harmonique',
 fx:'E<sub>n</sub> = ħω(n + ½)  ;  [a, a<sup>†</sup>] = 1',
 def:'Ses niveaux sont équidistants. L’opérateur de création a<sup>†</sup> ajoute un quantum, l’opérateur d’annihilation a en retire un : c’est le modèle des photons dans une cavité.',
 art:()=>{const X=x=>100+25*x,Y=e=>118-18*e;let s=P(fn(x=>x*x/2,-3.2,3.2,20,16,160,102,0,5.67),'');const H=[x=>1,x=>2*x,x=>4*x*x-2,x=>8*x**3-12*x],nf=[1,Math.sqrt(2),Math.sqrt(8),Math.sqrt(48)];
   for(let n=0;n<4;n++){const E=n+.5,yy=Y(E),tp=Math.sqrt(2*E);const ex=Math.min(3.2,tp+.7);s+=L(f(X(-tp)),f(yy),f(X(tp)),f(yy),'m w1 d')+P(pth(x=>[X(x),yy-4.5*H[n](x)*Math.exp(-x*x/2)/nf[n]],-ex,ex,100),'a');}
   return s+T(100,134,'niveaux équidistants : Eₙ = ħω(n + ½)',9,'tm');}},
{th:'Analyse',term:'Transformée de Fourier',
 fx:'φ(p) = (2πħ)<sup>−1/2</sup> ∫ ψ(x) e<sup>−ipx/ħ</sup> dx',
 def:'Elle décompose une fonction en ondes planes et fait passer de la représentation position à la représentation impulsion.',
 art:()=>{const g=t=>Math.sin(2*PI*2*t)+0.6*Math.sin(2*PI*5*t),spec=k=>Math.exp(-((k-2)**2)/0.04)+0.6*Math.exp(-((k-5)**2)/0.04);
   return L(14,62,94,62,'m w1')+P(fn(g,0,1,14,26,80,72,-1.7,1.7,200),'b')+L(106,98,188,98,'m w1')+P(fn(spec,0,7,106,26,80,72,0,1.05,200),'a')+T(100,56,'ℱ',14,'tm')
   +T(54,118,'signal',10,'tb')+T(146,118,'spectre : 2 et 5',10,'ta');}},
{th:'Analyse',term:'Distribution de Dirac',
 fx:'∫ δ(x − x<sub>0</sub>) f(x) dx = f(x<sub>0</sub>)  ;  ⟨x|x′⟩ = δ(x − x′)',
 def:'Limite de gaussiennes de plus en plus étroites dont l’aire reste égale à 1. Elle normalise les états propres de la position.',
 art:()=>{const b=[22,14,160,94],r=[0,1.7],g=s=>x=>Math.exp(-x*x/(2*s*s))/(s*Math.sqrt(2*PI));return AX(22,14,160,94,108)+P(fn(g(1),-3,3,...b,...r),'m w1')+P(fn(g(.5),-3,3,...b,...r),'b')+P(fn(g(.25),-3,3,...b,...r),'a')
   +T(120,24,'σ → 0',10,'ta','start')+T(100,128,'aire toujours égale à 1',10,'tm');}},

/* ───────── Qubits et portes ───────── */
{th:'Qubits et portes',term:'Qubit',
 fx:'|ψ⟩ = α|0⟩ + β|1⟩  ;  |α|² + |β|² = 1',
 def:'Le qubit est un vecteur unitaire de ℂ². Une mesure donne 0 avec probabilité |α|² et 1 avec probabilité |β|².',
 art:()=>L(40,110,130,110,'m w1','mm')+L(40,110,40,20,'m w1','mm')+P('M120 110 A80 80 0 0 0 40 30','a')+L(40,110,88,46,'b','mb')+L(88,46,88,110,'m w1 d')+L(88,46,40,46,'m w1 d')
   +T(140,114,'|α|',10,'tm','start')+T(40,14,'|β|',10,'tm')+T(88,122,'0,6',9,'tm')+T(34,49,'0,8',9,'tm','end')+T(150,60,'P(0) = 0,36',10,'tb','start')+T(150,76,'P(1) = 0,64',10,'tb','start')},
{th:'Qubits et portes',term:'Sphère de Bloch',
 fx:'|ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩',
 def:'Tout état pur d’un qubit, à une phase globale près, correspond à un point de la sphère, repéré par ses angles θ et φ (coordonnées sphériques).',
 art:()=>bloch(100,66,46,[{th:PI/3,ph:PI/4,c:'a',t:'|ψ⟩',drop:true}])},
{th:'Qubits et portes',term:'Matrices de Pauli',
 fx:'X = (0 1 ; 1 0)  ;  Y = (0 −i ; i 0)  ;  Z = (1 0 ; 0 −1)',
 def:'Elles sont hermitiennes et unitaires, avec X² = Y² = Z² = I et XY = iZ. X inverse le bit, Z inverse la phase.',
 art:()=>mat([['0','1'],['1','0']],38,62,{sz:11,cw:18})+mat([['0','−i'],['i','0']],100,62,{sz:11,cw:20})+mat([['1','0'],['0','−1']],162,62,{sz:11,cw:20})
   +T(38,36,'X',13,'ta')+T(100,36,'Y',13,'ta')+T(162,36,'Z',13,'ta')+T(100,106,'X² = Y² = Z² = I',11,'tm')+T(100,124,'XY = iZ',11,'tb')},
{th:'Qubits et portes',term:'Porte de Hadamard',
 fx:'H = (1/√2)(1 1 ; 1 −1)  ;  H|0⟩ = |+⟩  ;  H² = I',
 def:'Elle crée une superposition à poids égaux et fait passer de la base de calcul à la base |±⟩. Sur la sphère, c’est une rotation de π autour de l’axe (x + z)/√2.',
 art:()=>bloch(100,66,46,[{th:0,ph:0,c:'m',t:''},{th:PI/2,ph:0,c:'a',t:'|+⟩',dx:8,dy:14}],{extra:pr=>P(pth(t=>pr(Math.sin(t),0,Math.cos(t)),0.15,PI/2-.12,30),'a w1 d','ma')})},
{th:'Qubits et portes',term:'Portes de phase S et T',
 fx:'S = diag(1, i)  ;  T = diag(1, e<sup>iπ/4</sup>)  ;  T² = S, S² = Z',
 def:'Elles font tourner l’état autour de l’axe z sans changer les probabilités dans la base de calcul : seule la phase relative change.',
 art:()=>{let s=C(100,64,44,'m w1 d')+D(100,64,2.5,'fi');[[0,'I'],[45,'T'],[90,'S'],[180,'Z']].forEach(([d,n])=>{const a=d*PI/180,x=f(100+44*Math.cos(a)),y=f(64-44*Math.sin(a));s+=L(100,64,x,y,'m w1')+D(x,y,4,'fa')+T(f(100+57*Math.cos(a)),f(68-56*Math.sin(a)),n,11,'ta');});
   return s+T(100,132,'vue de dessus : angle de phase φ',10,'tm');}},
{th:'Qubits et portes',term:'Portes de rotation',
 fx:'R<sub>x</sub>(θ) = e<sup>−iθX/2</sup> = cos(θ/2) I − i sin(θ/2) X',
 def:'Rotation d’angle θ de la sphère de Bloch autour d’un axe. Attention au θ/2 : une rotation de 2π donne −I, il faut 4π pour revenir exactement.',
 art:()=>{const b=[22,16,160,88],r=[-1.15,1.15];return AX(22,16,160,88,60)+P(fn(t=>Math.sin(t/2)**2,0,4*PI,...b,...r),'b w1')+P(fn(t=>Math.cos(t/2),0,4*PI,...b,...r),'a')
   +L(102,56,102,64,'m w1')+T(102,72,'2π',9,'tm')+T(182,72,'4π',9,'tm')+T(60,124,'⟨0|Rx(θ)|0⟩',9,'ta')+T(146,124,'P(1) = sin²(θ/2)',9,'tb');}},
{th:'Qubits et portes',term:'Porte CNOT',
 fx:'CNOT |a, b⟩ = |a, a ⊕ b⟩',
 def:'Elle inverse le qubit cible si le qubit de contrôle vaut 1. Associée à H, elle crée l’intrication.',
 art:()=>WI(40,30,100)+WI(80,30,100)+CT(65,40,80)+T(24,44,'a',11,'tm','end')+T(24,84,'b',11,'tm','end')+T(106,44,'a',11,'tm','start')+T(106,84,'a ⊕ b',11,'tm','start')
   +T(165,30,'00 → 00',10,'tm')+T(165,48,'01 → 01',10,'tm')+T(165,66,'10 → 11',10,'ta')+T(165,84,'11 → 10',10,'ta')+T(100,124,'cible inversée si le contrôle vaut 1',10,'tm')},
{th:'Qubits et portes',term:'SWAP, CZ et Toffoli',
 fx:'SWAP = CNOT<sub>12</sub> CNOT<sub>21</sub> CNOT<sub>12</sub>  ;  Toffoli : |a, b, c⟩ → |a, b, c ⊕ ab⟩',
 def:'SWAP échange deux qubits et se construit avec trois CNOT alternés. CZ applique Z si les deux qubits valent 1. Toffoli (CCNOT) est universelle pour le calcul classique réversible.',
 art:()=>{const x=(cx,y)=>L(cx-5,y-5,cx+5,y+5,'w1')+L(cx-5,y+5,cx+5,y-5,'w1');return WI(45,16,54)+WI(85,16,54)+L(35,45,35,85,'w1')+x(35,45)+x(35,85)+T(64,69,'=',14,'tm')
   +WI(45,76,166)+WI(85,76,166)+CT(92,45,85)+CT(121,85,45)+CT(150,45,85)+T(100,124,'SWAP = trois CNOT alternés',10,'tm');}},
{th:'Qubits et portes',term:'Universalité et Solovay-Kitaev',
 fx:'{H, T, CNOT} universel  ;  précision ε avec O(log<sup>c</sup>(1/ε)) portes',
 def:'Toute porte peut être approchée par une suite de portes d’un petit ensemble universel. Le théorème de Solovay-Kitaev garantit que cette approximation est efficace.',
 art:()=>{const cx=100,cy=64,r=46,pr=(x,y,z)=>[f(cx+r*(y-0.42*x)),f(cy-r*(z-0.32*x))];let s=C(cx,cy,r,'m w1');const seen={},q=Math.SQRT1_2;
   const H=([a,b])=>[[(a[0]+b[0])*q,(a[1]+b[1])*q],[(a[0]-b[0])*q,(a[1]-b[1])*q]],Tk=([a,b],k)=>{const c=Math.cos(k*PI/4),si=Math.sin(k*PI/4);return [a,[b[0]*c-b[1]*si,b[0]*si+b[1]*c]];};
   const go=(st,m)=>{const [a,b]=st,X=2*(a[0]*b[0]+a[1]*b[1]),Y=2*(a[0]*b[1]-a[1]*b[0]),Z=a[0]**2+a[1]**2-b[0]**2-b[1]**2,key=[X,Y,Z].map(v=>Math.round(v*22)).join();
     if(!seen[key]){seen[key]=1;const p=pr(X,Y,Z);s+=`<circle cx="${p[0]}" cy="${p[1]}" r="1.1" class="fb" opacity=".5"/>`;}};
   let seed=7;const rnd=()=>(seed=(seed*1103515245+12345)%2147483648)/2147483648;
   for(let i=0;i<1500;i++){let st=H([[1,0],[0,0]]);for(let j=0;j<16;j++)st=H(Tk(st,1+Math.floor(rnd()*7)));go(st);}
   return s+T(100,128,'états atteints par des suites de H et T',10,'tm');}},
{th:'Qubits et portes',term:'Bases de calcul et de Hadamard',
 fx:'|±⟩ = (|0⟩ ± |1⟩)/√2',
 def:'Deux bases orthonormées d’un qubit. Mesurer dans la base |±⟩ revient à appliquer H puis à mesurer dans la base de calcul. Elles sont utilisées en cryptographie quantique (BB84).',
 art:()=>L(70,75,125,75,'m','mm')+L(70,75,70,20,'m','mm')+L(70,75,108.9,36.1,'a','ma')+L(70,75,108.9,113.9,'b','mb')+P('M84 75 A14 14 0 0 0 79.9 65.1','m w1')
   +T(131,79,'|0⟩',11,'tm','start')+T(70,13,'|1⟩',11,'tm')+T(114,34,'|+⟩',11,'ta','start')+T(114,120,'|−⟩',11,'tb','start')+T(88,70,'45°',8,'tm','start')+T(165,60,'(|0⟩ ± |1⟩)/√2',9,'tm')},
{th:'Qubits et portes',term:'Circuit quantique',
 fx:'U = U<sub>n</sub> ⋯ U<sub>2</sub> U<sub>1</sub>',
 def:'Un circuit se lit de gauche à droite, mais sa matrice totale est le produit des portes dans l’ordre inverse. Exemple : H puis CNOT prépare un état de Bell.',
 art:()=>WI(45,40,144)+WI(85,40,144)+T(34,49,'|0⟩',11,'tm','end')+T(34,89,'|0⟩',11,'tm','end')+G(70,45,'H')+CT(110,45,85)+MS(155,45)+MS(155,85)+T(100,124,'|00⟩ → (|00⟩ + |11⟩)/√2',10,'ta')},

/* ───────── Intrication ───────── */
{th:'Intrication',term:'États de Bell',
 fx:'|Φ<sup>±</sup>⟩ = (|00⟩ ± |11⟩)/√2  ;  |Ψ<sup>±</sup>⟩ = (|01⟩ ± |10⟩)/√2',
 def:'Quatre états maximalement intriqués qui forment une base orthonormée de deux qubits. Les résultats de mesure des deux qubits sont parfaitement corrélés.',
 art:()=>{const v=[.5,0,0,.5];let s=bars(v,['00','01','10','11'],34,104,80,24,12,'fa',.55);s+=T(46,26,'50 %',9,'ta')+T(154,26,'50 %',9,'ta');return s+T(100,132,'mesures de |Φ⁺⟩ : toujours identiques',10,'tm');}},
{th:'Intrication',term:'États GHZ et W',
 fx:'|GHZ⟩ = (|000⟩ + |111⟩)/√2  ;  |W⟩ = (|001⟩ + |010⟩ + |100⟩)/√3',
 def:'Deux familles d’intrication à trois qubits, non équivalentes. Si on perd un qubit de GHZ, le reste n’est plus intriqué ; W résiste mieux à cette perte.',
 art:()=>bars([.5,0,0,0,0,0,0,.5],['000',null,null,null,null,null,null,'111'],14,100,70,7,2.5,'fa',.55,7)+bars([0,1/3,1/3,0,1/3,0,0,0],null,108,100,70,7,2.5,'fb',.55)+T(146,112,'001, 010, 100',8,'tb')
   +T(52,126,'GHZ',11,'ta')+T(146,126,'W',11,'tb')},
{th:'Intrication',term:'Décomposition de Schmidt',
 fx:'|ψ⟩ = Σ<sub>i</sub> √λ<sub>i</sub> |a<sub>i</sub>⟩|b<sub>i</sub>⟩',
 def:'Obtenue par décomposition en valeurs singulières (SVD) de la matrice des amplitudes. Plus d’un coefficient non nul (rang de Schmidt > 1) signifie que l’état est intriqué.',
 art:()=>{const a=PI/6,ca=Math.cos(a),sa=Math.sin(a),s1=1.6*30,s2=.6*30;return C(100,64,30,'m w1 d')+P(pth(t=>[100+s1*Math.cos(t)*ca-s2*Math.sin(t)*sa,64-(s1*Math.cos(t)*sa+s2*Math.sin(t)*ca)],0,2*PI),'')
   +L(100,64,f(100+s1*ca),f(64-s1*sa),'a','ma')+L(100,64,f(100-s2*sa),f(64-s2*ca),'b','mb')+T(f(106+s1*ca),f(62-s1*sa),'σ₁',11,'ta','start')+T(f(94-s2*sa),f(60-s2*ca),'σ₂',11,'tb','end')
   +T(100,124,'σᵢ = √λᵢ : valeurs singulières',10,'tm');}},
{th:'Intrication',term:'Inégalité CHSH',
 fx:'S = E(a,b) − E(a,b′) + E(a′,b) + E(a′,b′)  ;  |S| ≤ 2 (classique), ≤ 2√2 (quantique)',
 def:'Toute théorie à variables cachées locales respecte |S| ≤ 2. Les états intriqués atteignent 2√2 (borne de Tsirelson) : la nature n’est pas classique.',
 art:()=>{const b=[26,16,156,90],r=[0,3.05];return AX(26,16,156,90,106)+P(fn(()=>2,0,PI/2,...b,...r),'m d w1')+P(fn(()=>2*Math.SQRT2,0,PI/2,...b,...r),'b d w1')+P(fn(t=>3*Math.cos(t)-Math.cos(3*t),0,PI/2,...b,...r),'a')
   +T(22,f(py(2,...r,16,90)+3),'2',9,'tm','end')+T(22,f(py(2.83,...r,16,90)+3),'2√2',9,'tb','end')+T(182,118,'θ = π/2',9,'tm','end')+T(100,132,'S(θ) = 3 cos θ − cos 3θ',10,'ta');}},
{th:'Intrication',term:'Théorème de non-clonage',
 fx:'Aucun U tel que U|ψ⟩|0⟩ = |ψ⟩|ψ⟩ pour tout |ψ⟩',
 def:'Un tel U conserverait le produit scalaire : ⟨φ|ψ⟩ = ⟨φ|ψ⟩², ce qui impose ⟨φ|ψ⟩ = 0 ou 1. On ne peut donc pas copier un état inconnu.',
 art:()=>{const b=[30,16,140,90],r=[0,1];return AX(30,16,140,90,106)+P(fn(x=>x,0,1,...b,...r),'b')+P(fn(x=>x*x,0,1,...b,...r),'a')+D(30,106,4,'fi')+D(170,16,4,'fi')
   +T(110,52,'s',11,'tb','end')+T(130,82,'s²',11,'ta','start')+T(100,128,'s = s² seulement si s = 0 ou 1',10,'tm');}},
{th:'Intrication',term:'Téléportation quantique',
 fx:'1 paire de Bell + 2 bits classiques → 1 qubit transmis',
 def:'Alice mesure son qubit et sa moitié de paire dans la base de Bell, puis envoie 2 bits. Bob applique X<sup>m</sup>Z<sup>n</sup> et récupère l’état. Le codage superdense fait l’inverse.',
 art:()=>WI(30,34,111)+WI(65,34,111)+WI(100,34,190)+T(30,34,'|ψ⟩',10,'tm','end')+T(28,86,'|Φ⁺⟩',10,'tm','end')+P('M33 62 h-3 v41 h3','m w1')+CT(56,30,65)+G(86,30,'H')+MS(122,30)+MS(122,65)
   +DBL(133,65,150,65)+DBL(150,65,150,90)+DBL(133,30,176,30)+DBL(176,30,176,90)+G(150,100,'X')+G(176,100,'Z')+T(100,130,'Bob applique X'+sup('m')+'Z'+sup('n'),10,'tm')},

/* ───────── Matrice densité ───────── */
{th:'Matrice densité',term:'Matrice densité',
 fx:'ρ = Σ<sub>i</sub> p<sub>i</sub> |ψ<sub>i</sub>⟩⟨ψ<sub>i</sub>|  ;  Tr ρ = 1  ;  ρ ≥ 0',
 def:'Elle décrit aussi les mélanges statistiques. Les termes hors diagonale (cohérences) distinguent une superposition d’un simple mélange.',
 art:()=>grid([[.5,.5],[.5,.5]],28,20,32)+grid([[.5,0],[0,.5]],112,20,32)+T(59,100,'|+⟩ pur',10,'ta')+T(143,100,'mélange 50/50',10,'tm')+T(100,124,'hors diagonale : les cohérences',10,'tm')},
{th:'Matrice densité',term:'Pureté',
 fx:'Tr(ρ²) ∈ [1/d, 1]  ;  qubit : Tr ρ² = (1 + r²)/2',
 def:'Elle vaut 1 pour un état pur et 1/d pour l’état maximalement mélangé I/d. Pour un qubit, elle dépend de la longueur r du vecteur de Bloch.',
 art:()=>{const b=[28,16,150,88],r=[0.4,1.05];return AX(28,16,150,88,104)+P(fn(x=>(1+x*x)/2,0,1,...b,...r),'a')+L(28,py(1,...r,16,88),178,py(1,...r,16,88),'m w1 d')
   +T(22,f(py(1,...r,16,88)+3),'1',9,'tm','end')+T(22,f(py(.5,...r,16,88)+3),'½',9,'tm','end')+T(178,116,'r = 1',9,'tm','end')+T(100,132,'pur sur la sphère, mélangé au centre',10,'tm');}},
{th:'Matrice densité',term:'Boule de Bloch',
 fx:'ρ = ½(I + r⃗·σ⃗)  ;  |r⃗| ≤ 1',
 def:'Les états purs sont sur la sphère, les états mixtes à l’intérieur. Le centre correspond à l’état maximalement mélangé I/2.',
 art:()=>bloch(100,64,46,[{th:PI*50/180,ph:PI/6,len:.55,c:'b',t:'ρ'}])+D(100,64,3,'fi')+T(112,94,'I/2',9,'tm','start')},
{th:'Matrice densité',term:'Trace partielle',
 fx:'ρ<sub>A</sub> = Tr<sub>B</sub>(ρ<sub>AB</sub>) = Σ<sub>k</sub> ⟨k<sub>B</sub>|ρ<sub>AB</sub>|k<sub>B</sub>⟩',
 def:'Elle donne l’état d’un sous-système quand on ignore le reste. Pour un état de Bell, chaque qubit seul est dans l’état maximalement mélangé I/2.',
 art:()=>{const M=[[.5,0,0,.5],[0,0,0,0],[0,0,0,0],[.5,0,0,.5]],A=[[0,0],[0,0]];for(let i=0;i<2;i++)for(let j=0;j<2;j++)for(let k=0;k<2;k++)A[i][j]+=M[2*i+k][2*j+k];
   return grid(M,18,30,17)+L(96,64,122,64,'a','ma')+T(109,54,'Tr'+sub('B'),11,'ta')+grid(A,132,42,22)+T(52,114,'|Φ⁺⟩⟨Φ⁺|',10,'tm')+T(154,114,'I/2',11,'ta');}},
{th:'Matrice densité',term:'Canaux quantiques (opérateurs de Kraus)',
 fx:'ρ → Σ<sub>k</sub> K<sub>k</sub> ρ K<sub>k</sub><sup>†</sup>  ;  Σ<sub>k</sub> K<sub>k</sub><sup>†</sup>K<sub>k</sub> = I',
 def:'Toute évolution physique, bruit compris. Le canal dépolarisant contracte la boule de Bloch ; l’amortissement d’amplitude la tire vers |0⟩.',
 art:()=>{const r=44;return C(100,62,r,'m w1')+C(100,62,r/2,'b')+P(pth(t=>[100+r*Math.SQRT1_2*Math.sin(t),62-r*(.5+.5*Math.cos(t))],0,2*PI),'a')+T(100,12,'|0⟩',10,'tm')
   +T(56,128,'dépolarisant',10,'tb')+T(146,128,'amortissement',10,'ta');}},
{th:'Matrice densité',term:'Équation de Lindblad et décohérence',
 fx:'dρ/dt = −(i/ħ)[H, ρ] + Σ<sub>k</sub> (L<sub>k</sub>ρL<sub>k</sub><sup>†</sup> − ½{L<sub>k</sub><sup>†</sup>L<sub>k</sub>, ρ})',
 def:'Elle décrit un système ouvert en temps continu. Les cohérences décroissent exponentiellement : T<sub>1</sub> mesure la relaxation, T<sub>2</sub> le déphasage.',
 art:()=>{const b=[22,16,160,92],r=[-1.1,1.1],e=t=>Math.exp(-t/3);return L(22,62,186,62,'m w1')+P(fn(e,0,10,...b,...r),'m w1 d')+P(fn(t=>-e(t),0,10,...b,...r),'m w1 d')+P(fn(t=>e(t)*Math.cos(3*t),0,10,...b,...r,240),'a')
   +T(100,128,'cohérence ∝ e^(−t/T₂)',11,'ta');}},
{th:'Matrice densité',term:'Fidélité et distance de trace',
 fx:'F(ρ, σ) = (Tr √(√ρ σ √ρ))²  ;  D(ρ, σ) = ½ Tr|ρ − σ|',
 def:'Deux façons de comparer des états. F = 1 pour des états identiques ; pour deux états purs, F = |⟨ψ|φ⟩|² et D = √(1 − F).',
 art:()=>{const b=[26,16,156,88],r=[0,1.05];return AX(26,16,156,88,104)+P(fn(t=>Math.cos(t/2)**2,0,PI,...b,...r),'a')+P(fn(t=>Math.sin(t/2),0,PI,...b,...r),'b')
   +T(20,22,'1',9,'tm','end')+T(182,116,'θ = π',9,'tm','end')+T(60,126,'F = cos²(θ/2)',10,'ta')+T(144,126,'D = sin(θ/2)',10,'tb');}},

/* ───────── Information ───────── */
{th:'Information',term:'Entropie de Shannon',
 fx:'H(X) = −Σ<sub>i</sub> p<sub>i</sub> log<sub>2</sub> p<sub>i</sub>',
 def:'L’incertitude moyenne sur le résultat, en bits. Pour un tirage à deux issues, elle est maximale (1 bit) quand p = ½.',
 art:()=>{const b=[28,16,150,88],r=[0,1.05];return FILL(area(h2,0,1,...b,...r),'sa')+AX(28,16,150,88,104)+P(fn(h2,0,1,...b,...r),'a')+L(103,104,103,20,'m w1 d')
   +T(22,24,'1',9,'tm','end')+T(103,116,'p = ½',9,'tm')+T(100,132,'h(p) = −p log₂p − (1−p) log₂(1−p)',9,'ta');}},
{th:'Information',term:'Entropie de von Neumann',
 fx:'S(ρ) = −Tr(ρ log<sub>2</sub> ρ) = −Σ<sub>i</sub> λ<sub>i</sub> log<sub>2</sub> λ<sub>i</sub>',
 def:'L’analogue quantique de l’entropie de Shannon, calculé sur les valeurs propres de ρ. Elle est nulle pour un état pur et vaut log<sub>2</sub> d pour I/d.',
 art:()=>{const b=[28,16,150,88],r=[0,1.05],g=x=>h2((1+x)/2);return AX(28,16,150,88,104)+P(fn(g,0,1,...b,...r),'b')+T(22,24,'1',9,'tm','end')+T(178,116,'r = 1',9,'tm','end')
   +T(100,132,'S d’un qubit selon le rayon de Bloch r',10,'tm');}},
{th:'Information',term:'Entropie d’intrication',
 fx:'E(|ψ⟩) = S(ρ<sub>A</sub>) = S(ρ<sub>B</sub>)',
 def:'Pour un état pur bipartite, l’entropie d’un sous-système mesure l’intrication. Un état de Bell contient exactement 1 ebit.',
 art:()=>{const b=[28,16,150,88],r=[0,1.05],g=t=>h2(Math.cos(t)**2);return AX(28,16,150,88,104)+P(fn(g,0,PI/2,...b,...r),'a')+D(103,py(1,...r,16,88),4,'fb')+T(110,22,'Bell : 1 ebit',10,'tb','start')
   +T(178,116,'θ = π/2',9,'tm','end')+T(100,132,'cos θ|00⟩ + sin θ|11⟩',10,'ta');}},
{th:'Information',term:'Borne de Holevo',
 fx:'χ = S(Σ p<sub>i</sub>ρ<sub>i</sub>) − Σ p<sub>i</sub>S(ρ<sub>i</sub>)  ;  I(X:Y) ≤ χ',
 def:'Elle limite l’information classique qu’on peut extraire d’un ensemble d’états quantiques : n qubits ne transportent pas plus de n bits (sans intrication préalable).',
 art:()=>{const b=[28,16,150,88],r=[0,1.05],g=t=>h2((1+Math.cos(t/2))/2);return AX(28,16,150,88,104)+L(28,py(1,...r,16,88),178,py(1,...r,16,88),'m w1 d')+P(fn(g,0,PI,...b,...r),'b')
   +T(34,34,'1 bit au maximum',9,'tm','start')+T(178,116,'θ = π',9,'tm','end')+T(100,132,'deux états purs équiprobables, angle θ',9,'tm');}},
{th:'Information',term:'Information mutuelle',
 fx:'I(A:B) = S(A) + S(B) − S(AB)',
 def:'Toutes les corrélations, classiques et quantiques, entre A et B. Pour un état de Bell, I = 2 bits : le double du maximum possible pour deux bits classiques.',
 art:()=>`<circle cx="80" cy="62" r="40" class="sa" opacity=".8"/><circle cx="120" cy="62" r="40" class="sb" opacity=".8"/>`+C(80,62,40,'a w1')+C(120,62,40,'b w1')
   +T(64,66,'S(A)',10,'ta')+T(136,66,'S(B)',10,'tb')+T(100,66,'I',13,'tm')+T(100,124,'I(A:B) : la partie commune',10,'tm')},

/* ───────── Algorithmes ───────── */
{th:'Algorithmes',term:'Transformée de Fourier quantique (QFT)',
 fx:'|j⟩ → (1/√N) Σ<sub>k</sub> ω<sup>jk</sup> |k⟩  ;  ω = e<sup>2iπ/N</sup>',
 def:'Elle s’implémente en O(n²) portes sur n qubits, contre O(n·2<sup>n</sup>) opérations pour la FFT classique. Elle révèle la période d’une fonction.',
 art:()=>{const N=16,inp=[];for(let j=0;j<N;j++)inp.push(j%4===1?1:0);const out=[];for(let k=0;k<N;k++){let re=0,im=0;inp.forEach((a,j)=>{if(a){re+=Math.cos(2*PI*j*k/N);im+=Math.sin(2*PI*j*k/N);}});out.push((re*re+im*im)/(4*N));}
   return T(24,12,'entrée : période r = 4',9,'tm','start')+bars(inp,null,24,50,30,7,2.5,'fb',1)+T(24,74,'après la QFT : pics tous les N/r = 4',9,'tm','start')+bars(out,null,24,112,30,7,2.5,'fa',.25)+T(100,132,'N = 16',9,'tm');}},
{th:'Algorithmes',term:'Estimation de phase',
 fx:'U|u⟩ = e<sup>2iπφ</sup>|u⟩  →  m ≈ 2<sup>t</sup>φ sur t qubits',
 def:'Avec des U contrôlées et une QFT inverse, on lit une approximation binaire de φ. C’est le cœur des algorithmes de Shor et de chimie quantique.',
 art:()=>{const N=16,ph=.3,v=[];for(let m=0;m<N;m++){let re=0,im=0;for(let k=0;k<N;k++){re+=Math.cos(2*PI*k*(ph-m/N));im+=Math.sin(2*PI*k*(ph-m/N));}v.push((re*re+im*im)/(N*N));}
   const xm=f(24+4.8*9.5+3.5);return bars(v,v.map((_,m)=>m%4===0?m:null),24,104,82,7,2.5,'fa')+L(xm,104,xm,16,'b d w1')+T(f(xm+9),24,'2ᵗφ = 4,8',9,'tb','start')+T(100,132,'φ = 0,3 avec t = 4 qubits',10,'tm');}},
{th:'Algorithmes',term:'Algorithme de Grover',
 fx:'G = (2|s⟩⟨s| − I) O<sub>f</sub>  ;  ≈ (π/4)√N itérations  ;  sin θ = 1/√N',
 def:'Chaque itération fait tourner l’état de 2θ vers la solution |w⟩. On trouve un élément parmi N en O(√N) requêtes au lieu de O(N).',
 art:()=>{const o=[36,112],r=95,th=Math.asin(1/4),p=a=>[f(o[0]+r*Math.cos(a)),f(o[1]-r*Math.sin(a))];
   return L(...o,146,112,'m w1','mm')+L(...o,36,12,'m w1','mm')+P(`M${o[0]+r} ${o[1]} A${r} ${r} 0 0 0 ${o[0]} ${o[1]-r}`,'m w1 d')+L(...o,...p(th),'m','mm')+L(...o,...p(3*th),'b','mb')+L(...o,...p(5*th),'a','ma')
   +T(f(p(th)[0]+5),f(p(th)[1]+2),'|s⟩',10,'tm','start')+T(f(p(3*th)[0]+5),f(p(3*th)[1]),'G|s⟩',10,'tb','start')+T(f(p(5*th)[0]+5),f(p(5*th)[1]-2),'G²|s⟩',10,'ta','start')+T(44,12,'|w⟩',11,'tm','start')+T(152,116,'|w⊥⟩',10,'tm','start')
   +T(140,132,'N = 16',10,'tm');}},
{th:'Algorithmes',term:'Probabilité de succès de Grover',
 fx:'P(k) = sin²((2k + 1)θ)',
 def:'La probabilité de trouver la solution oscille avec le nombre k d’itérations. Itérer trop longtemps la fait redescendre : il faut s’arrêter près de (π/4)√N.',
 art:()=>{const th=Math.asin(1/8),b=[22,18,160,86],r=[0,1.05],g=k=>Math.sin((2*k+1)*th)**2;let s=AX(22,18,160,86,104)+P(fn(g,0,12,...b,...r),'m w1');for(let k=0;k<=12;k++)s+=D(px(k,0,12,22,160),py(g(k),...r,18,86),3,k===6?'fb':'fa');
   return s+T(16,24,'1',9,'tm','end')+T(182,116,'k',10,'tm','end')+T(100,132,'N = 64 : optimum vers k = 6',10,'tm');}},
{th:'Algorithmes',term:'Algorithme de Shor',
 fx:'trouver r tel que a<sup>r</sup> ≡ 1 (mod N), puis pgcd(a<sup>r/2</sup> ± 1, N)',
 def:'La factorisation se ramène à la recherche de la période de x ↦ a<sup>x</sup> mod N, que la QFT trouve en temps polynomial. Cela menace RSA.',
 art:()=>{const b=[22,14,160,90],v=[];for(let x=0;x<16;x++){let y=1;for(let i=0;i<x;i++)y=y*7%15;v.push(y);}let s=AX(22,14,160,90,104)+P('M'+v.map((y,x)=>px(x,0,15,22,160)+' '+py(y,0,15,14,90)).join(' L'),'m w1 d');
   v.forEach((y,x)=>s+=D(px(x,0,15,22,160),py(y,0,15,14,90),3.2,'fa'));const x0=px(0,0,15,22,160),x4=px(4,0,15,22,160);
   return s+P(`M${x0} 116 L${x4} 116`,'b w1','mb','mb')+T(f((x0+x4)/2),128,'r = 4',10,'tb')+T(140,128,'7ˣ mod 15',10,'ta');}},
{th:'Algorithmes',term:'Arithmétique modulaire et PGCD',
 fx:'a ≡ b (mod N)  ;  pgcd(a, b) = pgcd(b, a mod b)',
 def:'Le calcul modulaire « tourne en rond » sur N valeurs. L’algorithme d’Euclide calcule le PGCD rapidement. Pour N = 15, a = 7 : 7² ≡ 4, et pgcd(3, 15) = 3, pgcd(5, 15) = 5.',
 art:()=>{const cx=100,cy=62,r=44,p=k=>[f(cx+r*Math.sin(2*PI*k/15)),f(cy-r*Math.cos(2*PI*k/15))];let s=C(cx,cy,r,'m w1 d');for(let k=0;k<15;k++)s+=D(...p(k),1.6,'fm');
   const cyc=[1,7,4,13];s+=P('M'+cyc.map(k=>p(k).join(' ')).join(' L')+' Z','a');cyc.forEach(k=>{s+=D(...p(k),3.5,'fa');s+=T(f(cx+(r+12)*Math.sin(2*PI*k/15)),f(cy-(r+12)*Math.cos(2*PI*k/15)+3),k,10,'ta');});
   return s+T(100,128,'1 → 7 → 4 → 13 → 1 (mod 15)',10,'tm');}},
{th:'Algorithmes',term:'Fractions continues',
 fx:'x = a<sub>0</sub> + 1/(a<sub>1</sub> + 1/(a<sub>2</sub> + ⋯))',
 def:'Elles donnent les meilleures approximations rationnelles d’un réel. Dans Shor, elles retrouvent la période r à partir de la valeur mesurée m/2<sup>t</sup> ≈ s/r.',
 art:()=>{const x=11/16,cf=[];let y=x;for(let i=0;i<4;i++){const a=Math.floor(y+1e-9);cf.push(a);if(Math.abs(y-a)<1e-9)break;y=1/(y-a);}let h=[1,0],k=[0,1];const cv=[];cf.forEach(a=>{h=[a*h[0]+h[1],h[0]];k=[a*k[0]+k[1],k[0]];cv.push([h[0],k[0]]);});
   const b=[30,16,140,88],r=[0,1.1];let s=AX(30,16,140,88,104)+L(30,py(x,...r,16,88),176,py(x,...r,16,88),'b w1 d');cv.forEach(([p,q],i)=>{const X=px(i,0,3,40,120),Y=py(p/q,...r,16,88);s+=D(X,Y,3.5,'fa')+T(f(X+6),f(Y-5),q===1?p:p+'/'+q,9,'ta','start');});
   return s+T(26,f(py(x,...r,16,88)+3),'x',10,'tb','end')+T(100,128,'11/16 = [0 ; 1, 2, 5]',11,'tm');}},
{th:'Algorithmes',term:'Oracle de phase et Deutsch-Jozsa',
 fx:'|x⟩ → (−1)<sup>f(x)</sup>|x⟩  ;  H<sup>⊗n</sup>|x⟩ = 2<sup>−n/2</sup> Σ<sub>y</sub> (−1)<sup>x·y</sup>|y⟩',
 def:'L’oracle inscrit f dans la phase. Avec la transformée de Hadamard, une seule requête suffit pour savoir si f est constante ou équilibrée (aussi Bernstein-Vazirani, Simon).',
 art:()=>{const M=[];for(let x=0;x<8;x++){M.push([]);for(let y=0;y<8;y++){let c=x&y,p=0;while(c){p^=c&1;c>>=1;}M[x].push(p?-1:1);}}return grid(M,56,12,11,v=>v<0?'fa':'fb')+T(100,114,'signes (−1)^(x·y) de H⊗³',10,'tm')+T(100,130,'violet : +1, orange : −1',9,'tm');}},
{th:'Algorithmes',term:'Principe variationnel (VQE, QAOA)',
 fx:'E(θ) = ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E<sub>0</sub>',
 def:'L’énergie moyenne d’un état d’essai est toujours au-dessus de l’énergie fondamentale. Un optimiseur classique ajuste les paramètres θ du circuit pour la minimiser.',
 art:()=>{const g=t=>-Math.cos(t-2.2)-0.35*Math.cos(2*t);let mn=1e9;for(let t=0;t<=2*PI;t+=.01)mn=Math.min(mn,g(t));const E0=mn-.25,r=[E0-.15,1.6],b=[22,14,160,92];
   let s=P(fn(g,0,2*PI,...b,...r),'')+L(22,py(E0,...r,14,92),182,py(E0,...r,14,92),'b w1 d');let t=4.6;for(let i=0;i<7;i++){s+=D(px(t,0,2*PI,22,160),py(g(t),...r,14,92),3.2,'fa');const d=(g(t+1e-4)-g(t-1e-4))/2e-4;t-=.45*d;}
   return s+T(26,f(py(E0,...r,14,92)-4),'E₀',10,'tb','start')+T(100,128,'descente de gradient sur θ',10,'tm');}},
{th:'Algorithmes',term:'Classes de complexité',
 fx:'P ⊆ BPP ⊆ BQP ⊆ PSPACE',
 def:'BQP regroupe les problèmes résolus efficacement par un ordinateur quantique avec une erreur bornée. La factorisation est dans BQP ; la relation entre BQP et NP reste inconnue.',
 art:()=>E(100,66,86,54,'m w1')+E(84,74,58,36,'b')+E(70,80,34,22,'m')+E(62,84,14,10,'a')+E(132,60,42,30,'m w1 d')
   +T(100,24,'PSPACE',9,'tm')+T(92,48,'BQP',10,'tb')+T(70,68,'BPP',9,'tm')+T(62,88,'P',9,'ta')+T(152,52,'NP',10,'tm')+T(100,134,'NP en pointillé : sa place reste inconnue',9,'tm')},
{th:'Algorithmes',term:'Notation O et accélérations',
 fx:'O(N) → O(√N) (Grover)  ;  exponentiel → polynomial (Shor)',
 def:'La notation O décrit la croissance du coût avec la taille. Grover apporte un gain quadratique, Shor un gain exponentiel par rapport aux meilleurs algorithmes classiques connus.',
 art:()=>{const b=[26,14,156,92],r=[0,30];return AX(26,14,156,92,106)+P(fn(x=>x,1,100,...b,...r),'m')+P(fn(Math.sqrt,1,100,...b,...r),'a')+P(fn(x=>Math.log2(x),1,100,...b,...r),'b w1 d')
   +T(66,24,'N',11,'tm','start')+T(184,f(py(10,...r,14,92)-4),'√N',10,'ta','end')+T(184,f(py(Math.log2(100),...r,14,92)+12),'log₂ N',9,'tb','end')+T(182,118,'N',10,'tm','end')+T(100,132,'coût en fonction de la taille N',10,'tm');}},

/* ───────── Correction d'erreurs ───────── */
{th:'Correction d’erreurs',term:'Groupe de Pauli',
 fx:'𝒫<sub>n</sub> = {±1, ±i} × {I, X, Y, Z}<sup>⊗n</sup>',
 def:'Les erreurs se décomposent sur les produits de Pauli. Deux éléments du groupe commutent ou anticommutent toujours, ce qui permet de les détecter.',
 art:()=>{const tb=[['I','iZ','−iY'],['−iZ','I','iX'],['iY','−iX','I']],h=['X','Y','Z'];let s='';h.forEach((n,i)=>{s+=T(f(76+i*32),22,n,11,'ta')+T(46,f(44+i*26),n,11,'ta');});
   tb.forEach((r,i)=>r.forEach((e,j)=>{s+=`<rect x="${62+j*32}" y="${30+i*26}" width="29" height="23" rx="3" class="${i===j?'sm':'sb'}"/>`+T(f(76+j*32),f(46+i*26),e,10,'');}));return s+T(100,124,'produits ligne × colonne',10,'tm');}},
{th:'Correction d’erreurs',term:'Code de répétition à 3 qubits',
 fx:'|0⟩ → |000⟩, |1⟩ → |111⟩  ;  p<sub>L</sub> = 3p² − 2p³',
 def:'Il corrige une erreur X sur un qubit en mesurant les parités Z<sub>1</sub>Z<sub>2</sub> et Z<sub>2</sub>Z<sub>3</sub>. L’erreur logique devient plus faible que p dès que p < ½.',
 art:()=>{const b=[28,16,150,88],r=[0,1];return AX(28,16,150,88,104)+P(fn(p=>p,0,1,...b,...r),'m w1 d')+P(fn(p=>3*p*p-2*p**3,0,1,...b,...r),'a')+D(103,60,3.5,'fb')
   +T(108,74,'p = ½',9,'tb','start')+T(60,64,'p',10,'tm')+T(76,100,'p'+sub('L'),10,'ta')+T(100,128,'sous p = ½, le code aide',10,'tm');}},
{th:'Correction d’erreurs',term:'Formalisme des stabilisateurs',
 fx:'code = {|ψ⟩ : S|ψ⟩ = |ψ⟩ pour tout S ∈ 𝒮}  ;  [[n, k, d]]',
 def:'n − k générateurs de Pauli qui commutent fixent un sous-espace de dimension 2<sup>k</sup>. La distance d est le poids minimal d’une erreur logique non détectée.',
 art:()=>{let s=`<circle cx="82" cy="56" r="30" class="sa" opacity=".6"/><circle cx="118" cy="56" r="30" class="sb" opacity=".6"/><circle cx="100" cy="86" r="30" class="sm" opacity=".8"/>`+C(82,56,30,'a w1')+C(118,56,30,'b w1')+C(100,86,30,'m w1');
   [[100,66],[100,44],[82.3,75.9],[117.7,75.9],[69.8,49.2],[130.2,49.2],[100,100]].forEach(p=>s+=D(p[0],p[1],3.5,'fi'));return s+T(100,134,'Steane [[7,1,3]] : chaque cercle est un stabilisateur',9,'tm');}},
{th:'Correction d’erreurs',term:'Codes de Shor et de Steane',
 fx:'Shor [[9,1,3]] : |0<sub>L</sub>⟩ = ((|000⟩ + |111⟩)/√2)<sup>⊗3</sup>  ;  Steane [[7,1,3]]',
 def:'Le code de Shor imbrique un code contre les inversions de bit dans un code contre les inversions de phase. Le code de Steane (CSS) atteint la même protection avec 7 qubits.',
 art:()=>{let s='';[30,82,134].forEach(x=>{s+=R(x,34,36,30,'b sb',8);for(let i=0;i<3;i++)s+=D(x+8+i*10,49,3.5,'fi');});return s+T(100,24,'1 qubit logique = 9 qubits physiques',9,'tm')+T(48,80,'|000⟩ ± |111⟩',8,'tb')+T(100,80,'|000⟩ ± |111⟩',8,'tb')+T(152,80,'|000⟩ ± |111⟩',8,'tb')
   +T(100,104,'à l’intérieur : erreurs de bit',9,'tm')+T(100,120,'entre les blocs : erreurs de phase',9,'tm');}},
{th:'Correction d’erreurs',term:'Mesure de syndrome',
 fx:'s<sub>i</sub> = ±1 : valeur propre du stabilisateur S<sub>i</sub>',
 def:'Une ancilla mesure un stabilisateur (par exemple Z<sub>1</sub>Z<sub>2</sub>) sans révéler l’état logique. Le syndrome indique quelle erreur s’est produite et comment la corriger.',
 art:()=>WI(28,30,180)+WI(52,30,180)+WI(76,30,180)+WI(104,30,150)+T(24,32,'q₁',10,'tm','end')+T(24,56,'q₂',10,'tm','end')+T(24,80,'q₃',10,'tm','end')+T(24,108,'|0⟩',10,'tm','end')
   +CT(80,28,104)+CT(115,52,104)+MS(160,104)+T(100,132,'mesure de Z₁Z₂ sans toucher l’état logique',9,'tm')},
{th:'Correction d’erreurs',term:'Code de surface et théorème du seuil',
 fx:'p<sub>L</sub> ≈ A (p/p<sub>th</sub>)<sup>⌊(d+1)/2⌋</sup>',
 def:'Si le taux d’erreur physique p est sous le seuil p<sub>th</sub> (environ 1 % pour le code de surface), augmenter la distance d fait chuter l’erreur logique exponentiellement.',
 art:()=>{const X=26,Y=14,W=156,H=92,lx=[-3,-1.5],ly=[-8,0],pX=p=>X+(Math.log10(p)-lx[0])/(lx[1]-lx[0])*W;let s=AX(X,Y,W,H,Y+H);[[3,'m'],[5,'b'],[7,'a']].forEach(([d,c])=>{s+=P(fn(l=>Math.log10(.1*Math.pow(10**l/.01,(d+1)/2)),lx[0],lx[1],X,Y,W,H,...ly),c);});
   s+=L(f(pX(.01)),Y,f(pX(.01)),Y+H,'m w1 d')+T(f(pX(.01)),Y+H+12,'p'+sub('th'),9,'tm');return s+T(40,40,'d = 3',9,'tm','start')+T(40,70,'d = 5',9,'tb','start')+T(46,98,'d = 7',9,'ta','start')+T(100,134,'échelles logarithmiques',9,'tm');}},
{th:'Correction d’erreurs',term:'Groupe de Clifford et Gottesman-Knill',
 fx:'C P C<sup>†</sup> ∈ 𝒫<sub>n</sub>  ;  HXH = Z, SXS<sup>†</sup> = Y',
 def:'Les portes H, S et CNOT envoient les Paulis sur des Paulis. Les circuits de Clifford sont donc simulables efficacement sur un ordinateur classique ; ajouter T rend l’ensemble universel.',
 art:()=>{let s=T(56,22,'H',13,'ta')+T(146,22,'S',13,'ta');[['X ↦ Z','X ↦ Y'],['Y ↦ −Y','Y ↦ −X'],['Z ↦ X','Z ↦ Z']].forEach((r,i)=>{s+=T(56,f(50+i*24),r[0],12,'')+T(146,f(50+i*24),r[1],12,'');});return s+L(100,10,100,110,'m w1')+T(100,130,'conjugaison : un Pauli reste un Pauli',10,'tm');}},
{th:'Correction d’erreurs',term:'Algèbre sur 𝔽₂',
 fx:'1 + 1 = 0 (XOR)  ;  syndrome s = H·e<sup>T</sup> mod 2',
 def:'Les codes quantiques CSS réutilisent les codes classiques et leurs matrices de parité. Pour le code de Hamming [7,4,3], le syndrome donne en binaire la position de l’erreur.',
 art:()=>{const M=[[],[],[]];for(let j=1;j<=7;j++)for(let b=0;b<3;b++)M[b].push((j>>(2-b))&1);let s=grid(M,37,24,18,()=>'fb');for(let j=1;j<=7;j++)s+=T(f(37+(j-1)*18+8),88,j,9,'tm');
   return s+T(100,108,'matrice de parité de Hamming',10,'tm')+T(100,126,'colonne j = j écrit en binaire',10,'tb');}},

/* ───────── Groupes et symétries ───────── */
{th:'Groupes et symétries',term:'Groupes U(n) et SU(2)',
 fx:'U(n) = {U : U<sup>†</sup>U = I}  ;  SU(2) : det U = 1',
 def:'Les portes à un qubit sont des éléments de U(2). SU(2) recouvre deux fois les rotations SO(3) : une rotation de 2π donne −I, il faut 4π pour revenir à I.',
 art:()=>{const b=[22,14,160,92],r=[-2.3,3.3];return L(22,py(0,...r,14,92),186,py(0,...r,14,92),'m w1')+P(fn(t=>1+2*Math.cos(t),0,4*PI,...b,...r),'b')+P(fn(t=>2*Math.cos(t/2),0,4*PI,...b,...r),'a')
   +T(102,f(py(0,...r,14,92)+12),'2π',9,'tm')+T(182,f(py(0,...r,14,92)+12),'4π',9,'tm')+T(56,128,'Tr R(θ), SO(3)',9,'tb')+T(146,128,'Tr U(θ), SU(2)',9,'ta');}},
{th:'Groupes et symétries',term:'Algèbre de Lie et générateurs',
 fx:'U = e<sup>−iθ n⃗·σ⃗/2</sup>  ;  [σ<sub>j</sub>, σ<sub>k</sub>] = 2i ε<sub>jkl</sub> σ<sub>l</sub>',
 def:'Les matrices de Pauli engendrent l’algèbre su(2) : tout élément de SU(2) s’obtient par exponentiation. Leurs commutateurs suivent l’ordre cyclique X → Y → Z.',
 art:()=>{const cx=100,cy=60,r=38,p=d=>[f(cx+r*Math.cos(d*PI/180)),f(cy-r*Math.sin(d*PI/180))];let s='';[[90,210],[210,330],[330,450]].forEach(([a,b])=>s+=P(pth(t=>[cx+r*Math.cos(t),cy-r*Math.sin(t)],(a+16)*PI/180,(b-16)*PI/180,30),'a','ma'));
   [[90,'X'],[210,'Y'],[330,'Z']].forEach(([d,n])=>s+=C(...p(d),11,'b sb')+T(p(d)[0],f(p(d)[1]+4),n,12,'tb'));return s+T(100,126,'[X, Y] = 2iZ, [Y, Z] = 2iX, [Z, X] = 2iY',9,'tm');}},
{th:'Groupes et symétries',term:'Moment cinétique et spin',
 fx:'[J<sub>x</sub>, J<sub>y</sub>] = iħJ<sub>z</sub>  ;  S⃗ = (ħ/2)σ⃗  ;  S² = s(s + 1)ħ²',
 def:'Le spin ½ n’a que deux projections possibles, ±ħ/2, alors que sa norme vaut (√3/2)ħ : le vecteur ne s’aligne jamais exactement sur l’axe.',
 art:()=>L(100,118,100,10,'m w1','mm')+E(100,38,49,9,'a w1 d')+E(100,98,49,9,'b w1 d')+L(100,68,149,38,'a','ma')+L(100,68,149,98,'b','mb')+D(100,68,2.5,'fi')
   +T(94,42,'+ħ/2',10,'ta','end')+T(94,102,'−ħ/2',10,'tb','end')+T(106,14,'z',10,'tm','start')+T(100,134,'|S| = (√3/2)ħ',10,'tm')},
{th:'Groupes et symétries',term:'Décomposition d’Euler d’une porte',
 fx:'U = e<sup>iα</sup> R<sub>z</sub>(β) R<sub>y</sub>(γ) R<sub>z</sub>(δ)',
 def:'Toute porte à un qubit s’écrit avec trois rotations et une phase globale. Dans le circuit, l’ordre est inversé : on applique d’abord R<sub>z</sub>(δ).',
 art:()=>WI(60,18,186)+GW(56,60,38,'Rz(δ)')+GW(102,60,38,'Ry(γ)')+GW(148,60,38,'Rz(β)')+T(100,100,'ordre d’application : de gauche à droite',9,'tm')+T(100,120,'U = e^(iα) Rz(β) Ry(γ) Rz(δ)',10,'ta')},

/* ───────── Constantes ───────── */
{th:'Constantes',term:'Relations de Planck-Einstein et de de Broglie',
 fx:'E = hν = ħω  ;  p = h/λ = ħk',
 def:'Elles relient les grandeurs de particule (énergie, impulsion) aux grandeurs d’onde (pulsation ω, nombre d’onde k = 2π/λ).',
 art:()=>{const y=64;return P(pth(x=>[x,y-22*Math.sin(2*PI*(x-20)/50+PI/2)],20,180,160),'b')+L(20,42,180,42,'m w1 d')+P(`M20 34 L70 34`,'a w1','ma','ma')+T(45,28,'λ',12,'ta')+T(100,112,'p = h/λ',12,'ta')+T(100,130,'E = ħω',12,'tb');}},
{th:'Constantes',term:'Constante de Planck réduite et unités naturelles',
 fx:'h ≈ 6,626 × 10<sup>−34</sup> J·s  ;  ħ = h/2π ≈ 1,055 × 10<sup>−34</sup> J·s',
 def:'ħ fixe l’échelle des effets quantiques. En informatique quantique, on travaille souvent en unités naturelles où ħ = 1 : on écrit alors U = e<sup>−iHt</sup>.',
 art:()=>`<text x="100" y="80" font-size="74" text-anchor="middle" font-style="italic" class="tx ta">ħ</text>`+T(100,108,'= h/2π ≈ 1,055 × 10⁻³⁴ J·s',11,'tm')+T(100,128,'unités naturelles : ħ = 1',11,'tb')}
];

const THEMES=[];CARDS_SRC.forEach(c=>{if(!THEMES.includes(c.th))THEMES.push(c.th);});
const CARDS=CARDS_SRC.map((c,i)=>({n:i+1,term:c.term,fx:c.fx,def:c.def,theme:c.th,art:c.art,_svg:null}));
const N=CARDS.length;

/* ---------- Raccordement au moteur ---------- */
window.JEU_DE_FICHES = {
  id: "maths",
  titre: "Fiches mathématiques",
  cle: "qflash-outils-maths-v1",       // même clé qu'avant : les marques déjà posées sont conservées
  themes: THEMES.slice(),
  symboles: {
    "Toutes": "Σ",
    "Complexes": "<i>e</i><sup><i>iθ</i></sup>",
    "Algèbre linéaire": "<i>λ</i>",
    "Dirac et Hilbert": "⟨<i>φ</i>|<i>ψ</i>⟩",
    "Opérateurs": "<i>Â</i>",
    "Produit tensoriel": "⊗",
    "Mesure et probabilités": "|<i>c</i>|²",
    "Dynamique": "<i>e</i><sup>−<i>iHt</i>/ħ</sup>",
    "Analyse": "∫",
    "Qubits et portes": "|0⟩",
    "Intrication": "|Φ<sup>+</sup>⟩",
    "Matrice densité": "<i>ρ</i>",
    "Information": "<i>S</i>",
    "Algorithmes": "√<i>N</i>",
    "Correction d’erreurs": "|0<sub>L</sub>⟩",
    "Groupes et symétries": "SU(2)",
    "Constantes": "ħ",
    "À revoir": "↺"
  },
  indice: "Touchez la carte pour voir la formule et la définition",
  cartes: CARDS
};
