import React, { useMemo, useState } from 'react';
import './AtlasGeologico.css';
import GloboMarte3D from './GloboMarte3D';
// Descrições sintetizadas de fontes institucionais. Valores são aproximados;
// links levam aos arquivos e páginas oficiais para consulta dos dados originais.
const regions = [
  {
    id:'olympus', name:'Olympus Mons', type:'Vulcão-escudo', lat:'18,65° N', lon:'226,2° E',
    dimensions:'Base com cerca de 600 km de largura', relief:'Mais de 21 km acima do datum de referência em estimativas comuns',
    summary:'Gigantesco vulcão-escudo da região de Tharsis. Seu perfil amplo, com encostas relativamente suaves, registra episódios de construção vulcânica ao longo da história de Marte.',
    facts:['Vulcanismo de escudo','Região de Tharsis','Fluxos de lava','Caldeira no cume'],
    science:'O estudo de Olympus Mons ajuda a investigar a duração e a evolução do vulcanismo marciano, a espessura da crosta e a relação entre grandes províncias vulcânicas e a tectônica regional.',
    missions:'Dados de altimetria MOLA, imagens orbitais e mapas geológicos globais são usados para analisar a forma, as encostas, os fluxos e as estruturas do vulcão. Não há rover operando no cume.',
    sources:[['NASA — Mars facts','https://science.nasa.gov/mars/facts/'],['NASA Photojournal — Mars topography','https://science.nasa.gov/photojournal/mars-topography/'],['USGS — Mars geologic maps','https://astrogeology.usgs.gov/']]
  },
  {
    id:'jezero', name:'Cratera Jezero', type:'Cratera de impacto / antigo lago', lat:'18,38° N', lon:'77,58° E',
    dimensions:'Diâmetro aproximado de 45 km', relief:'Bacia com depósitos de delta e leques sedimentares',
    summary:'Cratera de impacto que abrigou um lago antigo. Canais de entrada e depósitos em forma de delta indicam que água líquida fluiu e transportou sedimentos para dentro da cratera.',
    facts:['Antigo ambiente lacustre','Delta preservado','Minerais relacionados à água','Amostras coletadas pelo Perseverance'],
    science:'Jezero é importante para investigar ambientes habitáveis antigos, a interação entre água e rochas e a preservação de possíveis bioassinaturas. A presença de minerais e camadas sedimentares orienta a seleção de amostras.',
    missions:'O rover Perseverance explora a cratera desde 2021, documenta rochas, coleta e armazena amostras. Imagens orbitais e dados de instrumentos do rover complementam o contexto geológico.',
    sources:[['NASA — Mars 2020 Perseverance','https://science.nasa.gov/mission/mars-2020-perseverance/'],['NASA — Jezero Crater','https://mars.nasa.gov/mars2020/'],['NASA PDS — dados de missão','https://pds.nasa.gov/']]
  },
  {
    id:'valles', name:'Valles Marineris', type:'Sistema de cânions', lat:'13,9° S', lon:'cerca de 59° W (referência regional)',
    dimensions:'Aproximadamente 4.000 km de extensão', relief:'Em alguns trechos, até cerca de 7–10 km entre planaltos e fundos',
    summary:'Enorme sistema de cânions próximo à elevação de Tharsis. O conjunto inclui fossas, escarpas, deslizamentos e depósitos que registram a evolução da crosta marciana.',
    facts:['Cânions tectônicos','Fraturas e falhas','Deslizamentos de encosta','Depósitos em camadas'],
    science:'A região permite estudar deformação da crosta, colapso, erosão e possíveis processos envolvendo água e gelo no subsolo. As dimensões variam conforme o segmento medido.',
    missions:'É investigada principalmente por orbitadores: imagens de alta resolução, espectroscopia e altimetria ajudam a mapear camadas, minerais e relevo. Não existe um único rover cobrindo todo o sistema.',
    sources:[['NASA — Mars facts','https://science.nasa.gov/mars/facts/'],['NASA Photojournal — topografia MOLA','https://science.nasa.gov/photojournal/mars-topography/'],['USGS Astrogeology','https://astrogeology.usgs.gov/']]
  },
  {
    id:'gale', name:'Cratera Gale', type:'Cratera de impacto', lat:'5,4° S', lon:'137,8° E',
    dimensions:'Diâmetro aproximado de 154 km', relief:'Monte Sharp ergue-se no interior da cratera',
    summary:'Cratera de impacto que contém o Monte Sharp (Aeolis Mons), uma montanha formada por camadas. Essas camadas preservam mudanças ambientais ocorridas ao longo do tempo.',
    facts:['Camadas sedimentares','Antigos lagos e riachos','Minerais de argila e sulfatos','Rover Curiosity'],
    science:'Gale oferece um registro estratificado para estudar como clima, água e química ambiental mudaram. A mineralogia e a sequência das camadas ajudam a reconstruir ambientes antigos.',
    missions:'O rover Curiosity explora Gale desde 2012. Seus instrumentos analisam rochas, solo e atmosfera; imagens orbitais fornecem o contexto regional.',
    sources:[['NASA — Curiosity rover','https://science.nasa.gov/mission/msl-curiosity/'],['NASA Mars Exploration — Curiosity','https://mars.nasa.gov/msl/'],['NASA PDS','https://pds.nasa.gov/']]
  },
  {
    id:'hellas', name:'Hellas Planitia', type:'Bacia de impacto', lat:'42,4° S', lon:'70,5° E',
    dimensions:'Cerca de 2.300 km de largura', relief:'Uma das maiores e mais profundas bacias de impacto de Marte',
    summary:'Grande bacia de impacto no hemisfério sul. Seu interior fica muito abaixo das regiões vizinhas e apresenta depósitos, dunas e sinais de processos atmosféricos e superficiais.',
    facts:['Bacia de impacto','Topografia muito baixa','Depósitos e dunas','Geada e processos sazonais'],
    science:'A profundidade da bacia influencia a pressão atmosférica local e cria um ambiente útil para estudar impactos gigantes, circulação atmosférica, poeira e gelo.',
    missions:'Mapas globais MOLA, imagens de orbitadores e observações atmosféricas são as principais fontes para estudar a bacia. A cobertura e a resolução variam por conjunto de dados.',
    sources:[['NASA Photojournal — Mars topography','https://science.nasa.gov/photojournal/mars-topography/'],['NASA Mars facts','https://science.nasa.gov/mars/facts/'],['NASA PDS','https://pds.nasa.gov/']]
  },
  {
    id:'elysium', name:'Elysium Mons', type:'Vulcão-escudo', lat:'25,0° N', lon:'147,2° E',
    dimensions:'Grande edifício vulcânico; medidas dependem do limite usado', relief:'Relevo vulcânico elevado na província de Elysium',
    summary:'Vulcão-escudo dominante da província de Elysium, no hemisfério norte. A região também contém estruturas vulcânicas e canais que ajudam a investigar a evolução geológica local.',
    facts:['Vulcanismo de escudo','Província de Elysium','Canais e depósitos próximos','História vulcânica marciana'],
    science:'A comparação entre Elysium e Tharsis ajuda a entender diferentes fases e estilos de vulcanismo em Marte. A interpretação depende de mapas geológicos e da datação relativa das superfícies.',
    missions:'A região é estudada por imagens orbitais, altimetria e mapeamento geológico. A missão InSight pousou em Elysium Planitia, uma planície próxima, não no topo de Elysium Mons.',
    sources:[['NASA — InSight mission','https://science.nasa.gov/mission/insight/'],['NASA Photojournal — topografia MOLA','https://science.nasa.gov/photojournal/mars-topography/'],['USGS Astrogeology','https://astrogeology.usgs.gov/']]
  },
  {
    id:'polar', name:'Calota Polar Norte', type:'Depósitos polares', lat:'Polo Norte (90° N)', lon:'Não aplicável ao polo',
    dimensions:'Extensão varia conforme estação e camada considerada', relief:'Camadas estratificadas de gelo de água, poeira e cobertura sazonal de CO₂',
    summary:'A região polar norte contém depósitos em camadas que registram variações climáticas. A cobertura sazonal de dióxido de carbono aumenta no inverno e recua durante a estação quente.',
    facts:['Gelo de água','Geada sazonal de CO₂','Camadas de poeira e gelo','Registro paleoclimático'],
    science:'As camadas polares preservam pistas sobre mudanças na inclinação do eixo, clima, transporte de poeira e ciclos de voláteis. A espessura e a composição são estudadas por radar, imagens e espectroscopia.',
    missions:'Orbitadores como Mars Reconnaissance Orbiter e Mars Express contribuem com imagens, radar e observações espectrais. MOLA também fornece contexto topográfico global.',
    sources:[['NASA Mars Reconnaissance Orbiter','https://science.nasa.gov/mission/mars-reconnaissance-orbiter/'],['ESA Mars Express','https://www.esa.int/Science_Exploration/Space_Science/Mars_Express'],['NASA PDS','https://pds.nasa.gov/']]
  }
];

export default function AtlasGeologico() {
  const [selected, setSelected] = useState('jezero');
  const [filter, setFilter] = useState('Todas');
  const [query, setQuery] = useState('');
  const current = regions.find(r => r.id === selected) || regions[0];
  const types = ['Todas', ...new Set(regions.map(r => r.type))];
  const visible = useMemo(() => regions.filter(r => (filter === 'Todas' || r.type === filter) && `${r.name} ${r.type} ${r.facts.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [filter, query]);
  const mapPoints = [
    {id:'olympus',x:390,y:104,label:'Olympus Mons'},
    {id:'jezero',x:492,y:183,label:'Jezero'},
    {id:'valles',x:300,y:204,label:'Valles Marineris'},
    {id:'gale',x:525,y:145,label:'Gale'},
    {id:'hellas',x:450,y:270,label:'Hellas Planitia'},
    {id:'elysium',x:565,y:105,label:'Elysium Mons'},
    {id:'polar',x:385,y:48,label:'Calota Polar Norte'}
  ];
  return <section className="na-atlas">
    <header className="na-head"><div><span className="na-kicker">NOVASTRIUM / EXPLORAÇÃO PLANETÁRIA</span><h2>Atlas científico de Marte</h2><p>Informações por região, missões relacionadas e fontes institucionais para aprofundamento.</p></div><div className="na-count"><b>07</b><span>regiões catalogadas</span></div></header>
    <div className="na-map-panel">
      <div className="na-map-heading"><div><span className="na-kicker">MAPA DE LOCALIZAÇÃO</span><h3>Explore as regiões de Marte</h3></div><span>Mapa esquemático · posições aproximadas</span></div>
      <GloboMarte3D
  selectedRegion={selected}
  onSelectRegion={setSelected}
  className="na-globe-map"
/>
      <div className="na-map-legend"><span><i/> Região selecionada</span><span>Selecione um ponto para abrir sua ficha científica</span></div>
    </div>
    <div className="na-layout">
      <aside className="na-sidebar"><label className="na-search">⌕ <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar região, missão ou formação" /></label>
        <select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Filtrar por formação">{types.map(t=><option key={t}>{t}</option>)}</select>
        <div className="na-region-list">{visible.map(r=><button key={r.id} className={selected===r.id?'active':''} onClick={()=>setSelected(r.id)}><span className="na-dot"/><span><b>{r.name}</b><small>{r.type}</small></span><span className="na-arrow">›</span></button>)}{!visible.length&&<p className="na-empty">Nenhuma região encontrada.</p>}</div>
      </aside>
      <article className="na-detail"><div className="na-detail-top"><div><span className="na-kicker">PERFIL CIENTÍFICO DA REGIÃO</span><h3>{current.name}</h3><span className="na-type">{current.type}</span></div><div className="na-symbol">{current.type.includes('Vulcão')?'△':current.type.includes('Cratera')||current.type.includes('Bacia')?'◉':current.type.includes('cânions')?'⌁':'❄'}</div></div>
        <p className="na-summary">{current.summary}</p>
        <div className="na-stats"><div><small>LATITUDE</small><b>{current.lat}</b></div><div><small>LONGITUDE</small><b>{current.lon}</b></div><div><small>DIMENSÕES</small><b>{current.dimensions}</b></div><div><small>RELEVO / ALTITUDE</small><b>{current.relief}</b></div></div>
        <h4>Características geológicas</h4><div className="na-tags">{current.facts.map(f=><span key={f}>{f}</span>)}</div>
        <div className="na-info-block"><h4>O que essa região ajuda a investigar?</h4><p>{current.science}</p></div>
        <div className="na-info-block"><h4>Missões e observações</h4><p>{current.missions}</p></div>
        <div className="na-note"><b>Transparência dos dados</b><p>Este perfil reúne informações descritivas publicadas por instituições científicas. Não representa uma extração em tempo real de todos os arquivos da NASA. Coordenadas e dimensões são referências aproximadas; para medições, consulte os produtos originais e seus metadados.</p></div>
        <div className="na-sources"><b>Fontes oficiais desta região</b>{current.sources.map(([name,url])=><a key={url} href={url} target="_blank" rel="noreferrer">{name} ↗</a>)}</div>
      </article>
    </div>
    <footer className="na-footer">NOVASTRIUM · Atlas científico educacional · Dados originais mantidos nos arquivos das missões e do NASA Planetary Data System.</footer>
  </section>;
}
