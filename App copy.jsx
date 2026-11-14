import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Download, ExternalLink, BookOpen, Activity, ArrowUpRight, Globe2, Languages, MapPin, Orbit, Search, Satellite, Telescope, Layers3, GitCompareArrows } from 'lucide-react';
import './App.css';

const regions = [
  { id:'olympus', name:'Olympus Mons', type:'Volcano', lat:'18.65° N', lon:'226.2° E', elevation:'~21.9 km', note:'The largest known volcano in the Solar System. A major landmark for studying Martian volcanic history.', score:92 },
  { id:'jezero', name:'Jezero Crater', type:'Ancient lake basin', lat:'18.38° N', lon:'77.58° E', elevation:'~−2.6 km', note:'A former lake and delta environment investigated for evidence of ancient water and past habitability.', score:88 },
  { id:'valles', name:'Valles Marineris', type:'Canyon system', lat:'13.9° S', lon:'59.2° W', elevation:'varies', note:'A vast canyon system that exposes layers and structures useful for understanding Martian geology.', score:85 },
  { id:'gale', name:'Gale Crater', type:'Impact crater', lat:'5.4° S', lon:'137.8° E', elevation:'~−4.5 km', note:'A crater explored by the Curiosity rover, with a central mountain made of layered sediments.', score:81 },
  { id:'hellas', name:'Hellas Planitia', type:'Impact basin', lat:'42.7° S', lon:'70° E', elevation:'deep basin', note:'An immense impact basin in the southern hemisphere, among the deepest regions on Mars.', score:79 },
  { id:'elysium', name:'Elysium Mons', type:'Volcano', lat:'25° N', lon:'147° E', elevation:'~12 km', note:'A large shield volcano in the Elysium volcanic province.', score:76 },
  { id:'polar', name:'North Polar Cap', type:'Polar ice cap', lat:'90° N', lon:'0° E', elevation:'varies', note:'A polar region with seasonal carbon dioxide frost and perennial water ice.', score:83 }
];

const regionPT = {
  olympus:['Vulcão','O maior vulcão conhecido do Sistema Solar, importante para estudar a história vulcânica de Marte.'],
  jezero:['Antiga bacia lacustre','Ambiente de antigo lago e delta investigado em busca de evidências de água no passado e condições de habitabilidade.'],
  valles:['Sistema de cânions','Enorme sistema de cânions que expõe camadas e estruturas importantes para compreender a geologia marciana.'],
  gale:['Cratera de impacto','Cratera explorada pelo rover Curiosity, com uma montanha central formada por camadas sedimentares.'],
  hellas:['Bacia de impacto','Imensa bacia de impacto no hemisfério sul, entre as regiões mais profundas de Marte.'],
  elysium:['Vulcão','Grande vulcão em escudo na província vulcânica de Elysium.'],
  polar:['Calota polar','Região polar com geada sazonal de dióxido de carbono e gelo de água persistente.']
};
const localizedType = (r,lang) => lang==='pt' ? regionPT[r.id][0] : r.type;
const localizedNote = (r,lang) => lang==='pt' ? regionPT[r.id][1] : r.note;
const sources = [
 {name:'NASA Mars Exploration', url:'https://science.nasa.gov/mars/'},
 {name:'NASA Solar System Exploration — Mars', url:'https://science.nasa.gov/mars/facts/'},
 {name:'USGS Astrogeology', url:'https://astrogeology.usgs.gov/'},
 {name:'NASA Planetary Data System', url:'https://pds.nasa.gov/'}
];
const labels = {
  pt: {
    eyebrow:'PLATAFORMA DE EXPLORAÇÃO PLANETÁRIA', headline:'Investigue Marte.\\nLeia a história do terreno.',
    sub:'Explore regiões marcianas, compare características geográficas e organize informações científicas em um só ambiente.',
    explore:'Começar exploração', status:'SISTEMA ONLINE', globe:'GLOBO MARCIANO 3D',
    overview:'Visão geral', regions:'Regiões', compare:'Comparar regiões', about:'Sobre o projeto',
    missionTitle:'Um laboratório digital para explorar Marte', missionText:'O NOVASTRIUM-3D+ reúne visualização tridimensional e contexto geológico para apoiar o aprendizado e a investigação do Planeta Vermelho.',
    select:'Selecione uma região', details:'Ficha da região', terrain:'Indicador demonstrativo de interesse científico',
    caution:'Os indicadores e perfis visuais desta versão são demonstrativos. Não representam medições topográficas oficiais.',
    compareTitle:'Comparação de regiões', compareText:'Compare o tipo de formação e o contexto geológico de dois locais.',
    chooseA:'Primeira região', chooseB:'Segunda região', profile:'Perfil de exploração',
    cardsTitle:'Ferramentas de exploração', cards:[
      ['Globo 3D','Gire e observe uma representação tridimensional de Marte.'],
      ['Atlas geológico','Consulte regiões de interesse e seus contextos científicos.'],
      ['Comparação','Compare locais para orientar uma investigação inicial.']
    ],
    footer:'PROTÓTIPO • DADOS DESCRITIVOS DE REFERÊNCIA • NOVASTRIUM-3D+'
  },
  en: {
    eyebrow:'PLANETARY EXPLORATION PLATFORM', headline:'Investigate Mars.\\nRead the terrain’s story.',
    sub:'Explore Martian regions, compare geographic features, and organize scientific information in one place.',
    explore:'Start exploring', status:'SYSTEM ONLINE', globe:'3D MARS GLOBE',
    overview:'Overview', regions:'Regions', compare:'Compare regions', about:'About',
    missionTitle:'A digital laboratory to explore Mars', missionText:'NOVASTRIUM-3D+ brings together 3D visualization and geological context to support learning and investigation of the Red Planet.',
    select:'Select a region', details:'Region profile', terrain:'Demonstration scientific-interest indicator',
    caution:'Indicators and visual profiles in this version are illustrative. They are not official topographic measurements.',
    compareTitle:'Region comparison', compareText:'Compare formation types and geological context for two locations.',
    chooseA:'First region', chooseB:'Second region', profile:'Exploration profile',
    cardsTitle:'Exploration tools', cards:[
      ['3D Globe','Rotate and observe a three-dimensional representation of Mars.'],
      ['Geological atlas','Browse regions of interest and their scientific context.'],
      ['Comparison','Compare locations to guide an initial investigation.']
    ],
    footer:'PROTOTYPE • REFERENCE DESCRIPTIONS • NOVASTRIUM-3D+'
  }
};

function MarsGlobe({ selected, onSelect }) {
  const mount = useRef(null);
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.z = 4.1;
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);

    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0,0,1024,512);
    gradient.addColorStop(0,'#542016'); gradient.addColorStop(.48,'#c05a34'); gradient.addColorStop(1,'#32130f');
    ctx.fillStyle = gradient; ctx.fillRect(0,0,1024,512);
    for (let i=0;i<1800;i++) {
      const x=Math.random()*1024, y=Math.random()*512, r=Math.random()*16+2;
      ctx.beginPath(); ctx.ellipse(x,y,r*1.8,r,Math.random()*3,0,Math.PI*2);
      ctx.fillStyle=`rgba(${Math.random()>.5?'245,158,103':'35,10,8'},${Math.random()*.2})`; ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.SphereGeometry(1.25,96,96);
    const material = new THREE.MeshStandardMaterial({ map:texture, roughness:.96 });
    const mars = new THREE.Mesh(geometry,material); scene.add(mars);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.31,64,64),new THREE.MeshBasicMaterial({color:0xe47b50,transparent:true,opacity:.1,side:THREE.BackSide}));
    scene.add(atmosphere);
    scene.add(new THREE.AmbientLight(0xffffff,1.1));
    const sun = new THREE.DirectionalLight(0xffd6bd,2.2); sun.position.set(3,2,4); scene.add(sun);

    let frame, dragging=false, lastX=0, lastY=0;
    const down=e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture?.(e.pointerId);};
    const move=e=>{if(!dragging)return;mars.rotation.y+=(e.clientX-lastX)*.005;mars.rotation.x+=(e.clientY-lastY)*.005;lastX=e.clientX;lastY=e.clientY;};
    const up=()=>dragging=false;
    const wheel=e=>{camera.position.z=THREE.MathUtils.clamp(camera.position.z+e.deltaY*.002,2.8,5.8);};
    renderer.domElement.addEventListener('pointerdown',down);
    renderer.domElement.addEventListener('pointermove',move);
    renderer.domElement.addEventListener('pointerup',up);
    renderer.domElement.addEventListener('pointerleave',up);
    renderer.domElement.addEventListener('wheel',wheel,{passive:true});
    const resize=()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();renderer.setSize(w,h);};
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    const animate=()=>{frame=requestAnimationFrame(animate);if(!dragging)mars.rotation.y+=.0012;renderer.render(scene,camera);}; animate();
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerup',up);renderer.domElement.removeEventListener('pointerleave',up);renderer.domElement.removeEventListener('wheel',wheel);geometry.dispose();material.dispose();texture.dispose();atmosphere.geometry.dispose();atmosphere.material.dispose();renderer.dispose();host.removeChild(renderer.domElement);};
  },[]);
  return <div className="globe" ref={mount} aria-label="Interactive illustrative 3D Mars globe" />;
}

export default function App() {
  const [lang,setLang]=useState('pt');
  const [tab,setTab]=useState('overview');
  const [selected,setSelected]=useState('jezero');
  const [first,setFirst]=useState('jezero');
  const [second,setSecond]=useState('olympus');
  const [query,setQuery]=useState('');
  const [kind,setKind]=useState('all');
  const t=labels[lang];
  const current=regions.find(r=>r.id===selected) || regions[0];
  const a=regions.find(r=>r.id===first) || regions[0];
  const b=regions.find(r=>r.id===second) || regions[1];
  const filtered=regions.filter(r=>(kind==='all'||r.type===kind) && (r.name.toLowerCase().includes(query.toLowerCase()) || localizedType(r,lang).toLowerCase().includes(query.toLowerCase())));
  const exportRegion=()=>{const payload={project:'NOVASTRIUM-3D+',disclaimer:'Descriptive educational reference; illustrative scores are not official measurements',region:{...current,type:localizedType(current,lang),note:localizedNote(current,lang)},sources:sources.map(x=>x.url)};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`novastrium-${current.id}.json`;a.click();URL.revokeObjectURL(url);};
  return <main className="app">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-icon"><Orbit size={20}/></span><span>NOVASTRIUM<span className="brand-accent">-3D+</span></span></a>
      <nav>{[['overview',t.overview],['regions',t.regions],['compare',t.compare],['about',t.about]].map(([id,name])=><button key={id} className={tab===id?'active':''} onClick={()=>{setTab(id);document.getElementById(id)?.scrollIntoView({behavior:'smooth'});}}>{name}</button>)}</nav>
      <button className="lang" onClick={()=>setLang(lang==='pt'?'en':'pt')}><Languages size={16}/>{lang.toUpperCase()}</button>
    </header>

    <section className="hero" id="overview">
      <div className="hero-copy"><div className="eyebrow"><span/> {t.eyebrow}</div>
        <h1>{t.headline.split('\\n').map((line,i)=><span key={i}>{line}<br/></span>)}</h1>
        <p>{t.sub}</p><button className="primary" onClick={()=>{setTab('regions');document.getElementById('regions')?.scrollIntoView({behavior:'smooth'});}}><Telescope size={17}/>{t.explore}<ArrowUpRight size={16}/></button>
        <div className="system-status"><span><Activity size={14}/>{t.status}</span><span>MISSION CONCEPT / MARS</span></div>
      </div>
      <div className="planet-wrap"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="planet-caption">{t.globe}</div><MarsGlobe selected={selected} onSelect={setSelected}/><div className="planet-coord"><MapPin size={13}/>{current.lat} · {current.lon}</div></div>
    </section>

    <section className="intro" id="about"><div><div className="eyebrow">01 / {t.about.toUpperCase()}</div><h2>{t.missionTitle}</h2></div><p>{t.missionText}</p></section>

    <section className="regions-section" id="regions">
      <div className="section-title"><div><div className="eyebrow">02 / MARTIAN ATLAS</div><h2>{t.regions}</h2></div>
        <label className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={lang==='pt'?'Buscar região...':'Search regions...'}/></label>
      </div>
      <div className="region-layout">
        <div className="region-list"><label className="filter-label">{lang==='pt'?'Filtrar formação':'Filter formation'}<select value={kind} onChange={e=>setKind(e.target.value)}><option value="all">{lang==='pt'?'Todas as formações':'All formations'}</option>{[...new Set(regions.map(r=>r.type))].map(k=><option key={k} value={k}>{lang==='pt'?localizedType(regions.find(r=>r.type===k),lang):k}</option>)}</select></label>{filtered.map(r=><button key={r.id} className={selected===r.id?'region-item selected':'region-item'} onClick={()=>setSelected(r.id)}><span><strong>{r.name}</strong><small>{localizedType(r,lang)}</small></span><ArrowUpRight size={16}/></button>)}{filtered.length===0&&<p className="muted">{lang==='pt'?'Nenhuma região encontrada':'No regions found'}</p>}</div>
        <article className="detail-panel"><div className="panel-top"><span className="eyebrow">{t.details}</span><span className="region-tag">{localizedType(current,lang)}</span></div><h3>{current.name}</h3><p>{localizedNote(current,lang)}</p><div className="coordinates"><div><small>{lang==='pt'?'LATITUDE':'LATITUDE'}</small><strong>{current.lat}</strong></div><div><small>{lang==='pt'?'LONGITUDE':'LONGITUDE'}</small><strong>{current.lon}</strong></div><div><small>{lang==='pt'?'ALTITUDE APROX.':'APPROX. ELEVATION'}</small><strong>{current.elevation}</strong></div></div><div className="interest"><div><span>{t.terrain}</span><strong>{current.score}/100</strong></div><div className="bar"><i style={{width:`${current.score}%`}}/></div></div><p className="disclaimer">{t.caution}</p><button className="download-region" onClick={exportRegion}><Download size={16}/>{lang==='pt'?'Exportar ficha JSON':'Export region JSON'}</button></article>
      </div>
    </section>

    <section className="compare-section" id="compare"><div className="eyebrow">03 / COMPARATIVE STUDY</div><h2>{t.compareTitle}</h2><p className="muted">{t.compareText}</p>
      <div className="compare-grid"><label>{t.chooseA}<select value={first} onChange={e=>setFirst(e.target.value)}>{regions.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label><div className="versus"><GitCompareArrows size={22}/></div><label>{t.chooseB}<select value={second} onChange={e=>setSecond(e.target.value)}>{regions.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label></div>
      <div className="compare-results"><div><span>{a.name}</span><strong>{localizedType(a,lang)}</strong><small>{localizedNote(a,lang)}</small></div><div><span>{b.name}</span><strong>{localizedType(b,lang)}</strong><small>{localizedNote(b,lang)}</small></div></div>
    </section>

    <section className="tools-section"><div className="eyebrow">04 / EXPLORATION MODULES</div><h2>{t.cardsTitle}</h2><div className="tool-grid">{t.cards.map((c,i)=>{const Icon=[Globe2,Layers3,GitCompareArrows][i];return <article key={c[0]}><div className="tool-icon"><Icon size={20}/></div><small>0{i+1}</small><h3>{c[0]}</h3><p>{c[1]}</p></article>;})}</div></section>
    <section className="sources-section" id="sources"><div className="eyebrow">05 / SCIENTIFIC REFERENCES</div><h2>{lang==='pt'?'Fontes para pesquisa':'Research sources'}</h2><p className="muted">{lang==='pt'?'Links de referência para consultar dados científicos. Esta versão ainda não consulta APIs em tempo real; o globo e os indicadores são ilustrativos.':'Reference links for scientific research. This version does not yet fetch live APIs; the globe and indicators are illustrative.'}</p><div className="sources-grid">{sources.map(x=><a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer"><BookOpen size={19}/><span>{x.name}</span><ExternalLink size={15}/></a>)}</div></section>
    <footer><span>{t.footer}</span><span>NOVASTRIUM-3D+ © 2026</span></footer>
  </main>;
}