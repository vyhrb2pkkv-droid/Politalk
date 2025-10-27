
const QUESTIONS = {"economy": [["E1", "Credo che lo Stato debba tassare di più i redditi e i patrimoni molto alti per ridurre le disuguaglianze sociali."], ["E2", "Se aumentare i pagamenti digitali aiutasse a ridurre l’evasione fiscale, sarei favorevole a limitare l’uso del contante."], ["E3", "Se un’impresa riceve soldi pubblici e poi delocalizza all’estero, penso che lo Stato debba poter revocare gli aiuti e applicare sanzioni pesanti."], ["E4", "Preferisco uno Stato che offre più servizi pubblici (scuola, sanità, trasporti), anche se questo significa pagare più tasse."], ["E5", "Se un’azienda è considerata strategica per il Paese, accetto che lo Stato intervenga per salvarla con soldi pubblici."], ["E6", "Penso che le imprese dovrebbero avere meno burocrazia e meno vincoli, anche a costo di ridurre alcune tutele per semplificare il sistema."], ["E7", "Se una persona evade il fisco in modo grave, credo sia giusto che lo Stato possa sequestrare parte dei suoi beni."], ["E8", "Secondo me è più importante ridurre il debito pubblico che mantenere un elevato livello di spesa statale."], ["E9", "Penso che ogni persona dovrebbe poter trattenere una parte maggiore del proprio reddito, riducendo la pressione fiscale complessiva anche a costo di tagliare alcuni servizi."], ["E10", "Preferisco un sistema economico che garantisca competizione e meritocrazia, piuttosto che uno basato su forte intervento statale nell’economia."]], "rights": [["D1", "Penso che una donna debba avere il diritto di interrompere una gravidanza senza ostacoli o limitazioni indirette."], ["D2", "Credo che debba essere riconosciuto legalmente anche il matrimonio tra persone dello stesso sesso, con tutti i diritti e doveri del matrimonio tradizionale."], ["D3", "Se una persona malata terminale vuole porre fine alla propria vita, penso che lo Stato debba permettere l’eutanasia."], ["D4", "Sono favorevole alla legalizzazione e regolamentazione delle droghe leggere, per togliere potere alla criminalità e controllare il fenomeno."], ["D5", "Penso che chi nasce, cresce e studia stabilmente in Italia debba ottenere la cittadinanza in automatico."], ["D6", "Credo che la gestazione per altri (GPA) dovrebbe essere regolamentata e permessa, se tutte le parti sono consapevoli e tutelate."], ["D7", "Secondo me la libertà di espressione non deve giustificare contenuti che incitano odio o discriminazione: in certi casi lo Stato deve poter rimuovere quei contenuti."], ["D8", "Credo che la libertà personale debba venire prima delle tradizioni sociali e religiose, quando le due cose entrano in conflitto."]], "security": [["S1", "Se una persona commette un crimine violento grave, penso che le pene debbano essere più dure e con meno sconti automatici."], ["S2", "Penso che la polizia debba avere più libertà d’azione nelle operazioni di ordine pubblico, anche con margini più ampi sull’uso della forza."], ["S3", "Se una persona entra illegalmente nel Paese e commette reati, credo sia giusto che venga espulsa rapidamente e senza lunghi ricorsi."], ["S4", "Sono favorevole a più controlli, più telecamere e più sorveglianza nelle città, anche se questo riduce parte della privacy."], ["S5", "Penso che la pena di morte dovrebbe essere prevista per reati estremamente gravi e dimostrati oltre ogni dubbio."], ["S6", "Credo che la polizia stradale dovrebbe avere più poteri e applicare pene molto più dure per chi guida in stato di ebbrezza o sotto sostanze."]], "europe": [["G1", "Penso che l’Italia debba restare nell’Unione Europea e rafforzarne l’integrazione politica."], ["G2", "Sono favorevole all’euro e penso che abbandonare la moneta unica sarebbe un grave errore economico."], ["G3", "Credo che l’Europa debba avere un esercito unico europeo, anche rinunciando a parte della sovranità nazionale sulla difesa."], ["G4", "Secondo me l’Italia dovrebbe mantenere l’alleanza nell’area occidentale e restare nella NATO."], ["G5", "Se i trattati europei limitano la libertà dell’Italia su temi economici o migratori, penso che lo Stato debba potersi opporre e prendersi più autonomia."], ["G6", "Penso che l’economia europea dovrebbe proteggere maggiormente le imprese interne dalla concorrenza internazionale, anche se questo significa meno libero mercato globale."]]};

// Section order + intro
const SECTIONS = [
  ['economy','Economia','In questa sezione trovi scenari su tasse, mercato, imprese e welfare.'],
  ['rights','Diritti civili e sociali','Qui parliamo di libertà individuali, famiglia, espressione, droghe leggere, fine vita.'],
  ['security','Istituzioni & sicurezza','Pene, ordine pubblico, polizia, sorveglianza, privacy.'],
  ['europe','Europa & geopolitica','Unione Europea, euro, NATO, confini, esercito europeo.']
];

// State
const answers = {}; // id -> 1..5
let steps = []; // array of steps (intro or question refs)
for (const [key,title,intro] of SECTIONS) {
  steps.push({type:'intro', title, intro});
  (QUESTIONS[key]).forEach(([id,text]) => steps.push({type:'q', key, id, text}));
}
let stepIndex = 0;

// Elements
const progressEl = document.querySelector('.progress .bar');
const stage = document.getElementById('stage');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');

function updateProgress(){
  const totalQ = Object.values(QUESTIONS).flat().length;
  const answered = Object.keys(answers).length;
  const pct = Math.round((answered/totalQ)*100);
  progressEl.style.width = pct + '%';
  document.getElementById('count').textContent = answered + '/' + totalQ + ' domande';
}

function renderStep(){
  const s = steps[stepIndex];
  stage.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'slide';
  if (s.type==='intro') {
    box.innerHTML = `
      <div class="small">Sezione</div>
      <h2>${s.title}</h2>
      <p>${s.intro}</p>
    `;
    nextBtn.textContent = 'Inizia sezione';
  } else {
    const current = answers[s.id] ?? 3;
    box.innerHTML = `
      <div class="qmeta">Domanda ${s.id}</div>
      <div class="qtext">${s.text}</div>
      <input id="slider" class="slider" type="range" min="1" max="5" step="1" value="${current}" />
      <div class="slider-labels"><span>Per niente</span><span>Neutrale</span><span>Molto d’accordo</span></div>
    `;
    nextBtn.textContent = 'Avanti';
    setTimeout(()=>{
      const sl = document.getElementById('slider');
      sl.addEventListener('input', e => {
        answers[s.id] = Number(e.target.value);
        updateProgress();
      });
    },0);
  }
  stage.appendChild(box);
  backBtn.disabled = stepIndex===0;
  updateProgress();
}

backBtn.addEventListener('click', ()=>{
  if (stepIndex>0) stepIndex--;
  renderStep();
});

nextBtn.addEventListener('click', ()=>{
  if (stepIndex < steps.length-1) {
    stepIndex++;
    renderStep();
  } else {
    showResult();
  }
});

// ---------- scoring ----------
function mapSlider(v){ return ({1:-2,2:-1,3:0,4:1,5:2}[v] ?? 0); }
const sectionMax = { economy:20, rights:16, security:12, europe:12 };

function computeScores() {
  const sums = { economy:0, rights:0, security:0, europe:0 };
  for (const [id,val] of Object.entries(answers)) {
    const code = id[0];
    const mapped = mapSlider(val);
    if (code==='E') sums.economy += mapped;
    if (code==='D') sums.rights += mapped;
    if (code==='S') sums.security += mapped;
    if (code==='G') sums.europe += mapped;
  }
  const norm = {
    economy: Math.round((sums.economy/sectionMax.economy)*100),
    rights: Math.round((sums.rights/sectionMax.rights)*100),
    security: Math.round((sums.security/sectionMax.security)*100),
    europe: Math.round((sums.europe/sectionMax.europe)*100),
  };
  return { sums, norm };
}

function toXY(norm) { return { x: norm.economy, y: norm.rights }; }

// Families + Parties
const FAMILIES = [
  { code:'F1', label:'Socialdemocratica', vector:{economy:-50, rights:70, security:-20, europe:60} },
  { code:'F2', label:'Liberale', vector:{economy:60, rights:70, security:0, europe:50} },
  { code:'F3', label:'Popolare centrista', vector:{economy:0, rights:10, security:10, europe:50} },
  { code:'F4', label:'Conservatrice liberale', vector:{economy:50, rights:-50, security:30, europe:10} },
  { code:'F5', label:'Conservatrice sociale', vector:{economy:-20, rights:-60, security:50, europe:-20} },
  { code:'F6', label:'Sovranista', vector:{economy:30, rights:-40, security:80, europe:-80} },
  { code:'F7', label:'Libertaria', vector:{economy:80, rights:80, security:-50, europe:-10} },
  { code:'F8', label:'Autoritaria pro–ordine', vector:{economy:-10, rights:-70, security:90, europe:-50} },
];

const PARTIES = [
  { code:'PD', label:'Partito Democratico', vector:{economy:0, rights:60, security:5,  europe:60} },
  { code:'M5S', label:'Movimento 5 Stelle', vector:{economy:-30, rights:40, security:-20, europe:-10} },
  { code:'FDI', label:'Fratelli d’Italia', vector:{economy:40, rights:-60, security:70, europe:-50} },
  { code:'LEGA', label:'Lega', vector:{economy:30, rights:-60, security:70, europe:-40} },
  { code:'FI', label:'Forza Italia', vector:{economy:50, rights:10, security:20, europe:50} },
  { code:'AVS', label:'Alleanza Verdi–Sinistra', vector:{economy:-50, rights:70, security:-30, europe:70} },
  { code:'AZIV', label:'Azione / Italia Viva', vector:{economy:60, rights:40, security:10, europe:60} },
];

function distance(a,b){
  const dx=a.economy-b.economy, dy=a.rights-b.rights, dz=a.security-b.security, dw=a.europe-b.europe;
  return Math.hypot(dx,dy,dz,dw);
}
function bestMatch(vec, items){
  let best=items[0], bestD=Infinity;
  for(const it of items){
    const d=distance(vec,it.vector);
    if(d<bestD){bestD=d;best=it;}
  }
  return best;
}

// Result text builder
function bucket(v,neg,pos,mid='equilibrato'){
  if(v<=-40)return neg;
  if(v>=40)return pos;
  return mid;
}
function buildSummary(norm){
  const econ = bucket(norm.economy,'più Stato e protezioni','più mercato e autonomia');
  const rights = bucket(norm.rights,'più tradizione e cautela','priorità alle libertà individuali');
  const sec = bucket(norm.security,'garantista','ordine e controlli più severi');
  const eu = bucket(norm.europe,'autonomia nazionale','integrazione europea');
  const titleParts = [
    rights==='priorità alle libertà individuali'?'progressista sui diritti':(rights==='più tradizione e cautela'?'conservatore sui diritti':'equilibrato sui diritti'),
    econ==='più mercato e autonomia'?'liberale sull’economia':(econ==='più Stato e protezioni'?'interventista sull’economia':'equilibrato sull’economia'),
    eu==='integrazione europea'?'europeista':(eu==='autonomia nazionale'?'più sovrano sull’UE':'moderato sull’UE')
  ];
  const title = titleParts.join(', ').replace(/, ([^,]*)$/, ' e $1');
  const bullets = [
    'Economia: preferisci '+econ+'.',
    'Diritti: '+rights+'.',
    'Sicurezza: '+sec+'.',
    'Europa: '+eu+'.'
  ];
  return { title, bullets };
}

// Canvas charts (no external libs)
function drawRadar(canvas, values){ // values: [-100..100] x4
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth*2;
  const h = canvas.height = canvas.clientHeight*2;
  ctx.scale(2,2);
  const cx = canvas.clientWidth/2, cy = canvas.clientHeight/2, r = Math.min(cx,cy)-12;
  ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
  ctx.strokeStyle='rgba(255,255,255,.15)';
  for(let i=1;i<=4;i++){ const rr=r*(i/4); polygon(ctx,cx,cy,4,rr); }
  for(let i=0;i<4;i++){ const ang=i*Math.PI/2 - Math.PI/2; line(ctx,cx,cy,cx+Math.cos(ang)*r, cy+Math.sin(ang)*r); }
  const pts = values.map((v,i)=>{
    const ang=i*Math.PI/2 - Math.PI/2;
    const rr = (v+100)/200 * r;
    return [cx+Math.cos(ang)*rr, cy+Math.sin(ang)*rr];
  });
  ctx.fillStyle='rgba(216,179,107,.35)';
  ctx.strokeStyle='rgba(216,179,107,.9)';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.8)';
  ctx.font='12px system-ui';
  const labels=['Economia','Diritti','Sicurezza','Europa'];
  const offs=[[0,-r-6],[r+6,0],[0,r+16],[-r-6,0]];
  for(let i=0;i<4;i++){
    const txt=labels[i]; ctx.fillText(txt, cx+offs[i][0]-ctx.measureText(txt).width/2, cy+offs[i][1]);
  }
}
function polygon(ctx,cx,cy,n,r){ ctx.beginPath(); for(let i=0;i<n;i++){ const a=i*2*Math.PI/n - Math.PI/2; const x=cx+Math.cos(a)*r; const y=cy+Math.sin(a)*r; if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.closePath(); ctx.stroke(); }
function line(ctx,x1,y1,x2,y2){ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }

function drawScatter(canvas, point){ // point {x:-100..100, y:-100..100}
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth*2;
  const h = canvas.height = canvas.clientHeight*2;
  ctx.scale(2,2);
  ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
  const pad=14;
  const x0=pad, y0=canvas.clientHeight-pad, x1=canvas.clientWidth-pad, y1=pad;
  ctx.strokeStyle='rgba(255,255,255,.15)';
  ctx.strokeRect(x0,y1,x1-x0,y0-y1);
  ctx.beginPath(); ctx.moveTo((x0+x1)/2,y1); ctx.lineTo((x0+x1)/2,y0); ctx.moveTo(x0,(y0+y1)/2); ctx.lineTo(x1,(y0+y1)/2); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.8)'; ctx.font='12px system-ui';
  ctx.fillText('Stato', x0, y0+12); ctx.fillText('Mercato', x1-50, y0+12);
  ctx.save(); ctx.translate(x0-8,(y0+y1)/2); ctx.rotate(-Math.PI/2); ctx.fillText('Conservatore  ↔  Progressista', 0,0); ctx.restore();
  const nx = (point.x+100)/200; const ny = 1-((point.y+100)/200);
  const px = x0 + nx*(x1-x0); const py = y1 + ny*(y0-y1);
  ctx.fillStyle='rgba(216,179,107,.95)';
  ctx.beginPath(); ctx.arc(px,py,6,0,Math.PI*2); ctx.fill();
}

// Show result page
function showResult(){
  document.querySelector('.wizard').style.display='none';
  const res = document.getElementById('result');
  const { norm } = computeScores();
  const xy = toXY(norm);
  const fam = bestMatch(norm, FAMILIES);
  const party = bestMatch(norm, PARTIES);
  const sum = buildSummary(norm);
  document.getElementById('title').textContent = sum.title.charAt(0).toUpperCase()+sum.title.slice(1);
  const bullets = document.getElementById('bullets'); bullets.innerHTML=''; sum.bullets.forEach(b=>{const li=document.createElement('li'); li.textContent='• '+b; bullets.appendChild(li);});
  document.getElementById('fam').textContent = fam.label;
  document.getElementById('party').textContent = party.label;
  drawRadar(document.getElementById('radar'), [norm.economy, norm.rights, norm.security, norm.europe]);
  drawScatter(document.getElementById('scatter'), xy);
  res.style.display='block';
}

// Init
renderStep();
