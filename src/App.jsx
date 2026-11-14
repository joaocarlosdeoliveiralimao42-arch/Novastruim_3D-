import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  ExternalLink, BookOpen, Activity, ArrowUpRight, Globe2,
  Languages, MapPin, Orbit, Search, Telescope, Layers3,
  GitCompareArrows, Satellite
} from 'lucide-react';
import './App.css';
import AtlasGeologico from './AtlasGeologico';

const regions = [
  {
    id: 'olympus',
    name: 'Olympus Mons',
    type: 'Volcano',
    lat: '18.65° N',
    lon: '226.2° E',
    elevation: '~21.9 km',
    diameter: '~600 km',
    details: 'Olympus Mons é o maior vulcão conhecido do Sistema Solar. É um vulcão em escudo formado por sucessivos fluxos de lava. Sua dimensão ajuda os cientistas a investigar a história vulcânica e a evolução da crosta marciana.',
    mission: 'Dados orbitais e modelos topográficos ajudam a estudar sua estrutura, escarpas e depósitos vulcânicos.',
    instrument: 'MOLA, Mars Orbiter Camera e HiRISE'
  },
  {
    id: 'jezero',
    name: 'Jezero Crater',
    type: 'Ancient lake basin',
    lat: '18.38° N',
    lon: '77.58° E',
    elevation: '~−2.6 km',
    diameter: '~45 km',
    details: 'A Cratera Jezero abrigou um antigo lago e apresenta um delta formado pela entrada de água. Rochas sedimentares e minerais encontrados na região ajudam a investigar a presença de água líquida no passado de Marte.',
    mission: 'O rover Perseverance explora a região, analisa rochas e coleta amostras para uma possível futura campanha de retorno à Terra.',
    instrument: 'Perseverance, Mastcam-Z, SuperCam e PIXL'
  },
  {
    id: 'valles',
    name: 'Valles Marineris',
    type: 'Canyon system',
    lat: '13.9° S',
    lon: '59.2° W',
    elevation: 'varies',
    diameter: '~4.000 km de extensão',
    details: 'Valles Marineris é um enorme sistema de cânions próximo à região equatorial de Marte. Suas paredes expõem diferentes camadas geológicas, permitindo investigar a história da crosta e os processos que modificaram a superfície.',
    mission: 'Imagens orbitais permitem estudar fraturas, deslizamentos, depósitos e possíveis evidências de alterações pela água.',
    instrument: 'MRO, HiRISE, CTX e MOLA'
  },
  {
    id: 'gale',
    name: 'Gale Crater',
    type: 'Impact crater',
    lat: '5.4° S',
    lon: '137.8° E',
    elevation: '~−4.5 km',
    diameter: '~154 km',
    details: 'A Cratera Gale é uma cratera de impacto com uma montanha central chamada Aeolis Mons, também conhecida como Monte Sharp. Suas camadas sedimentares registram mudanças ambientais ocorridas ao longo da história de Marte.',
    mission: 'O rover Curiosity investiga a composição das rochas, minerais e condições ambientais antigas.',
    instrument: 'Curiosity, ChemCam, SAM e Mastcam'
  },
  {
    id: 'hellas',
    name: 'Hellas Planitia',
    type: 'Impact basin',
    lat: '42.7° S',
    lon: '70° E',
    elevation: 'deep basin',
    diameter: '~2.300 km',
    details: 'Hellas Planitia é uma gigantesca bacia de impacto no hemisfério sul de Marte. Sua grande profundidade influencia a pressão atmosférica local e cria condições ambientais diferentes de outras regiões do planeta.',
    mission: 'Observações orbitais ajudam a investigar sua topografia, depósitos, clima e possíveis formações relacionadas ao gelo.',
    instrument: 'MOLA, THEMIS e HiRISE'
  },
  {
    id: 'elysium',
    name: 'Elysium Mons',
    type: 'Volcano',
    lat: '25° N',
    lon: '147° E',
    elevation: '~12 km',
    diameter: 'centenas de quilômetros',
    details: 'Elysium Mons é um grande vulcão em escudo localizado na província vulcânica de Elysium. A região possui estruturas vulcânicas e depósitos que ajudam a compreender a atividade geológica marciana.',
    mission: 'Dados orbitais são utilizados para analisar fluxos de lava, terrenos vulcânicos e a evolução da região.',
    instrument: 'MOLA, THEMIS e imagens orbitais'
  },
  {
    id: 'polar',
    name: 'North Polar Cap',
    type: 'Polar ice cap',
    lat: '90° N',
    lon: '0° E',
    elevation: 'varies',
    diameter: 'centenas de quilômetros',
    details: 'A calota polar norte contém gelo de água e apresenta depósitos sazonais de dióxido de carbono. Suas camadas podem preservar registros de mudanças climáticas ao longo de períodos muito extensos.',
    mission: 'Instrumentos orbitais observam a composição, espessura, variações sazonais e estruturas das camadas polares.',
    instrument: 'MOLA, SHARAD e instrumentos climáticos orbitais'
  }
];

const regionPT = {
  olympus: 'Vulcão',
  jezero: 'Antiga bacia lacustre',
  valles: 'Sistema de cânions',
  gale: 'Cratera de impacto',
  hellas: 'Bacia de impacto',
  elysium: 'Vulcão',
  polar: 'Calota polar'
};

const localizedType = (region, lang) =>
  lang === 'pt' ? regionPT[region.id] : region.type;

const sources = [
  {
    name: 'NASA Mars Exploration',
    url: 'https://science.nasa.gov/mars/'
  },
  {
    name: 'NASA — Mars Facts',
    url: 'https://science.nasa.gov/mars/facts/'
  },
  {
    name: 'NASA Perseverance Rover',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/'
  },
  {
    name: 'NASA Curiosity Rover',
    url: 'https://science.nasa.gov/mission/msl-curiosity/'
  },
  {
    name: 'NASA Planetary Data System',
    url: 'https://pds.nasa.gov/'
  },
  {
    name: 'USGS Astrogeology',
    url: 'https://astrogeology.usgs.gov/'
  },
  {
    name: 'ASU — MOLA Mars Data',
    url: 'https://www.mars.asu.edu/data/mola_color/'
  }
];

const labels = {
  pt: {
    eyebrow: 'PLATAFORMA DE EXPLORAÇÃO PLANETÁRIA',
    headline: 'Investigue Marte.\nLeia a história do terreno.',
    sub: 'Explore regiões marcianas, compare características geográficas e investigue informações científicas em um só ambiente.',
    explore: 'Começar exploração',
    status: 'SISTEMA ONLINE',
    globe: 'GLOBO MARCIANO 3D',
    overview: 'Visão geral',
    regions: 'Regiões',
    compare: 'Comparar regiões',
    about: 'Sobre o projeto',
    missionTitle: 'Um laboratório digital para explorar Marte',
    missionText: 'O NOVASTRIUM-3D+ reúne visualização tridimensional, informações geológicas e referências científicas para apoiar o estudo do Planeta Vermelho.',
    details: 'Ficha científica da região',
    compareTitle: 'Comparação de regiões',
    compareText: 'Compare características geológicas de diferentes regiões marcianas.',
    chooseA: 'Primeira região',
    chooseB: 'Segunda região',
    cardsTitle: 'Ferramentas de exploração',
    cards: [
      ['Globo 3D', 'Explore uma representação tridimensional de Marte.'],
      ['Atlas geológico', 'Investigue estruturas e formações da superfície.'],
      ['Comparação', 'Compare características de diferentes regiões.']
    ],
    footer: 'PROJETO EDUCACIONAL • NOVASTRIUM-3D+'
  },
  en: {
    eyebrow: 'PLANETARY EXPLORATION PLATFORM',
    headline: 'Investigate Mars.\nRead the terrain’s story.',
    sub: 'Explore Martian regions, compare geographic features, and investigate scientific information in one place.',
    explore: 'Start exploring',
    status: 'SYSTEM ONLINE',
    globe: '3D MARS GLOBE',
    overview: 'Overview',
    regions: 'Regions',
    compare: 'Compare regions',
    about: 'About',
    missionTitle: 'A digital laboratory to explore Mars',
    missionText: 'NOVASTRIUM-3D+ combines 3D visualization, geological information, and scientific references to support the study of the Red Planet.',
    details: 'Scientific region profile',
    compareTitle: 'Region comparison',
    compareText: 'Compare geological characteristics of different Martian regions.',
    chooseA: 'First region',
    chooseB: 'Second region',
    cardsTitle: 'Exploration tools',
    cards: [
      ['3D Globe', 'Explore a three-dimensional representation of Mars.'],
      ['Geological atlas', 'Investigate surface structures and formations.'],
      ['Comparison', 'Compare characteristics of different regions.']
    ],
    footer: 'EDUCATIONAL PROJECT • NOVASTRIUM-3D+'
  }
};


function MarsGlobe() {
  const mount = useRef(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.75)
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    // Textura provisória caso o MOLA não carregue
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 1024, 512);

    gradient.addColorStop(0, '#713522');
    gradient.addColorStop(0.5, '#bd6846');
    gradient.addColorStop(1, '#55271f');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    const fallbackTexture = new THREE.CanvasTexture(canvas);
    fallbackTexture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(1.28, 128, 96);

    const material = new THREE.MeshStandardMaterial({
      map: fallbackTexture,
      roughness: 1,
      metalness: 0
    });

    const mars = new THREE.Mesh(geometry, material);
    scene.add(mars);

    // MOLA REAL - NASA MARSHOWEB
    const MOLA_URL =
    '/mola-texture';

    let molaTexture = null;

    const molaLoader = new THREE.TextureLoader();
    molaLoader.setCrossOrigin('anonymous');

    molaLoader.load(
      MOLA_URL,

      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;

        loadedTexture.anisotropy = Math.min(
          renderer.capabilities.getMaxAnisotropy(),
          8
        );

        molaTexture = loadedTexture;

        material.map = loadedTexture;
        material.needsUpdate = true;

        console.log('NOVASTRIUM: MOLA NASA carregado com sucesso!');
      },

      undefined,

      (error) => {
        console.error(
          'NOVASTRIUM: falha ao carregar o mapa MOLA.',
          error
        );
      }
    );

    // Marcadores aproximados das sete regiões
    const markerGroup = new THREE.Group();

    const markerData = [
      { lat: 18.65, lon: 226.2 },
      { lat: 18.38, lon: 77.58 },
      { lat: -13.9, lon: 300.8 },
      { lat: -5.4, lon: 137.8 },
      { lat: -42.7, lon: 70 },
      { lat: 25, lon: 147 },
      { lat: 82, lon: 0 }
    ];

    markerData.forEach((item) => {
      const phi = (90 - item.lat) * Math.PI / 180;
      const theta = (item.lon - 180) * Math.PI / 180;

      const position = new THREE.Vector3(
        -1.292 * Math.sin(phi) * Math.cos(theta),
        1.292 * Math.cos(phi),
        1.292 * Math.sin(phi) * Math.sin(theta)
      );

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 12, 12),
        new THREE.MeshBasicMaterial({
          color: 0xffa078
        })
      );

      dot.position.copy(position);
      markerGroup.add(dot);

      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.025, 0.034, 20),
        new THREE.MeshBasicMaterial({
          color: 0xffa078,
          transparent: true,
          opacity: 0.72,
          side: THREE.DoubleSide
        })
      );

      halo.position.copy(
        position.clone().multiplyScalar(1.002)
      );

      halo.lookAt(position.clone().multiplyScalar(2));
      markerGroup.add(halo);
    });

    mars.add(markerGroup);

    // Atmosfera
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.34, 96, 72),
      new THREE.MeshBasicMaterial({
        color: 0xf28b5e,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide
      })
    );

    scene.add(atmosphere);

    scene.add(new THREE.AmbientLight(0x9d9aaa, 0.72));

    const sun = new THREE.DirectionalLight(0xffd4b5, 2.7);
    sun.position.set(4, 2, 4);
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x536b9a, 0.42);
    fill.position.set(-4, -1, -3);
    scene.add(fill);

    // Rotação e zoom
    let frame;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const down = (event) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;

      renderer.domElement.setPointerCapture?.(event.pointerId);
    };

    const move = (event) => {
      if (!dragging) return;

      mars.rotation.y += (event.clientX - lastX) * 0.005;

      mars.rotation.x = THREE.MathUtils.clamp(
        mars.rotation.x + (event.clientY - lastY) * 0.004,
        -1.1,
        1.1
      );

      lastX = event.clientX;
      lastY = event.clientY;
    };

    const up = () => {
      dragging = false;
    };

    const wheel = (event) => {
      camera.position.z = THREE.MathUtils.clamp(
        camera.position.z + event.deltaY * 0.002,
        2.75,
        5.7
      );
    };

    renderer.domElement.addEventListener('pointerdown', down);
    renderer.domElement.addEventListener('pointermove', move);
    renderer.domElement.addEventListener('pointerup', up);
    renderer.domElement.addEventListener('pointercancel', up);
    renderer.domElement.addEventListener('pointerleave', up);
    renderer.domElement.addEventListener('wheel', wheel, {
      passive: true
    });

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;

      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const animate = () => {
      frame = requestAnimationFrame(animate);

      if (!dragging) {
        mars.rotation.y += 0.00065;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();

      renderer.domElement.removeEventListener('pointerdown', down);
      renderer.domElement.removeEventListener('pointermove', move);
      renderer.domElement.removeEventListener('pointerup', up);
      renderer.domElement.removeEventListener('pointercancel', up);
      renderer.domElement.removeEventListener('pointerleave', up);
      renderer.domElement.removeEventListener('wheel', wheel);

      geometry.dispose();
      material.dispose();
      fallbackTexture.dispose();

      if (molaTexture) {
        molaTexture.dispose();
      }

      atmosphere.geometry.dispose();
      atmosphere.material.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="globe"
      ref={mount}
      aria-label="Globo tridimensional de Marte com topografia MOLA"
    />
  );
}

 export default function App() {
  const [lang, setLang] = useState('pt');
  const [tab, setTab] = useState('overview');
  const [selected, setSelected] = useState('jezero');
  const [first, setFirst] = useState('jezero');
  const [second, setSecond] = useState('olympus');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');

  const t = labels[lang];

  const current =
    regions.find(region => region.id === selected) || regions[0];

  const a =
    regions.find(region => region.id === first) || regions[0];

  const b =
    regions.find(region => region.id === second) || regions[1];

  const filtered = regions.filter(region => {
    const matchesKind =
      kind === 'all' || region.type === kind;

    const search = query.toLowerCase();

    const matchesSearch =
      region.name.toLowerCase().includes(search) ||
      localizedType(region, lang).toLowerCase().includes(search);

    return matchesKind && matchesSearch;
  });

  const scrollTo = id => {
    setTab(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <main className="app">

      <header className="topbar">
        <a className="brand" href="#overview">
          <span className="brand-icon">
            <Orbit size={20} />
          </span>

          <span>
            NOVASTRIUM
            <span className="brand-accent">-3D+</span>
          </span>
        </a>

        <nav>
          {[
            ['overview', t.overview],
            ['regions', t.regions],
            ['compare', t.compare],
            ['about', t.about]
          ].map(([id, name]) => (
            <button
              key={id}
              className={tab === id ? 'active' : ''}
              onClick={() => scrollTo(id)}
            >
              {name}
            </button>
          ))}
        </nav>

        <button
          className="lang"
          onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
        >
          <Languages size={16} />
          {lang.toUpperCase()}
        </button>
      </header>

      <section className="hero" id="overview">

        <div className="hero-copy">
          <div className="eyebrow">
            <span />
            {t.eyebrow}
          </div>

          <h1>
            {t.headline.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </h1>

          <p>{t.sub}</p>

          <button
            className="primary"
            onClick={() => scrollTo('regions')}
          >
            <Telescope size={17} />
            {t.explore}
            <ArrowUpRight size={16} />
          </button>

          <div className="system-status">
            <span>
              <Activity size={14} />
              {t.status}
            </span>
            <span>MISSION CONCEPT / MARS</span>
          </div>
        </div>

        <div className="planet-wrap">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />

          <div className="planet-caption">
            {t.globe}
          </div>

          <MarsGlobe />

          <div className="planet-coord">
            <MapPin size={13} />
            {current.lat} · {current.lon}
          </div>
        </div>
      </section>

      <section className="intro" id="about">
        <div>
          <div className="eyebrow">
            01 / {t.about.toUpperCase()}
          </div>

          <h2>{t.missionTitle}</h2>
        </div>

        <p>{t.missionText}</p>
      </section>

      <section className="regions-section" id="regions">

        <div className="section-title">
          <div>
            <div className="eyebrow">
              02 / MARTIAN ATLAS
            </div>

            <h2>{t.regions}</h2>
          </div>

          <label className="search">
            <Search size={16} />

            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={
                lang === 'pt'
                  ? 'Buscar região...'
                  : 'Search regions...'
              }
            />
          </label>
        </div>

        <div className="region-layout">

          <div className="region-list">

            <label className="filter-label">
              {lang === 'pt'
                ? 'Filtrar formação'
                : 'Filter formation'}

              <select
                value={kind}
                onChange={event => setKind(event.target.value)}
              >
                <option value="all">
                  {lang === 'pt'
                    ? 'Todas as formações'
                    : 'All formations'}
                </option>

                {[...new Set(regions.map(region => region.type))].map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            {filtered.map(region => (
              <button
                key={region.id}
                className={
                  selected === region.id
                    ? 'region-item selected'
                    : 'region-item'
                }
                onClick={() => setSelected(region.id)}
              >
                <span>
                  <strong>{region.name}</strong>
                  <small>{localizedType(region, lang)}</small>
                </span>

                <ArrowUpRight size={16} />
              </button>
            ))}

            {filtered.length === 0 && (
              <p className="muted">
                {lang === 'pt'
                  ? 'Nenhuma região encontrada.'
                  : 'No regions found.'}
              </p>
            )}
          </div>

          <article className="detail-panel">

            <div className="panel-top">
              <span className="eyebrow">
                {t.details}
              </span>

              <span className="region-tag">
                {localizedType(current, lang)}
              </span>
            </div>

            <h3>{current.name}</h3>

            <p>
              {current.details}
            </p>

            <div className="coordinates">

              <div>
                <small>LATITUDE</small>
                <strong>{current.lat}</strong>
              </div>

              <div>
                <small>LONGITUDE</small>
                <strong>{current.lon}</strong>
              </div>

              <div>
                <small>
                  {lang === 'pt' ? 'ELEVAÇÃO' : 'ELEVATION'}
                </small>
                <strong>{current.elevation}</strong>
              </div>

            </div>

            <div className="scientific-info">
              <h4>
                {lang === 'pt'
                  ? 'Informações científicas'
                  : 'Scientific information'}
              </h4>

              <div className="science-item">
                <Satellite size={18} />
                <div>
                  <strong>
                    {lang === 'pt'
                      ? 'Missões e observações'
                      : 'Missions and observations'}
                  </strong>
                  <p>{current.mission}</p>
                </div>
              </div>

              <div className="science-item">
                <Layers3 size={18} />
                <div>
                  <strong>
                    {lang === 'pt'
                      ? 'Instrumentos e dados'
                      : 'Instruments and data'}
                  </strong>
                  <p>{current.instrument}</p>
                </div>
              </div>

              <div className="science-item">
                <Globe2 size={18} />
                <div>
                  <strong>
                    {lang === 'pt'
                      ? 'Dimensão aproximada'
                      : 'Approximate size'}
                  </strong>
                  <p>{current.diameter}</p>
                </div>
              </div>
            </div>

            <p className="disclaimer">
              {lang === 'pt'
                ? 'Informações descritivas reunidas a partir de referências científicas. Os dados apresentados não representam uma consulta em tempo real às bases da NASA.'
                : 'Descriptive information compiled from scientific references. The displayed data does not represent a real-time query to NASA databases.'}
            </p>

          </article>
        </div>
      </section>

      <section className="compare-section" id="compare">

        <div className="eyebrow">
          03 / COMPARATIVE STUDY
        </div>

        <h2>{t.compareTitle}</h2>

        <p className="muted">{t.compareText}</p>

        <div className="compare-grid">

          <label>
            {t.chooseA}

            <select
              value={first}
              onChange={event => setFirst(event.target.value)}
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>

          <div className="versus">
            <GitCompareArrows size={22} />
          </div>

          <label>
            {t.chooseB}

            <select
              value={second}
              onChange={event => setSecond(event.target.value)}
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>

        </div>

        <div className="compare-results">

          <div>
            <span>{a.name}</span>
            <strong>{localizedType(a, lang)}</strong>
            <small>{a.details}</small>
          </div>

          <div>
            <span>{b.name}</span>
            <strong>{localizedType(b, lang)}</strong>
            <small>{b.details}</small>
          </div>

        </div>
      </section>

      <section className="tools-section">

        <div className="eyebrow">
          04 / EXPLORATION MODULES
        </div>

        <h2>{t.cardsTitle}</h2>

        <div className="tool-grid">
          {t.cards.map((card, index) => {
            const Icon = [
              Globe2,
              Layers3,
              GitCompareArrows
            ][index];

            return (
              <article key={card[0]}>
                <div className="tool-icon">
                  <Icon size={20} />
                </div>

                <small>0{index + 1}</small>
                <h3>{card[0]}</h3>
                <p>{card[1]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="atlas-module-section"
        id="geological-atlas"
      >
        <AtlasGeologico />
      </section>

      <section className="sources-section" id="sources">

        <div className="eyebrow">
          05 / SCIENTIFIC REFERENCES
        </div>

        <h2>
          {lang === 'pt'
            ? 'Fontes científicas'
            : 'Scientific sources'}
        </h2>

        <p className="muted">
          {lang === 'pt'
            ? 'Consulte as fontes oficiais utilizadas como referência para aprofundar a investigação.'
            : 'Consult official sources used as references to deepen your research.'}
        </p>

        <div className="sources-grid">
          {sources.map(source => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen size={19} />
              <span>{source.name}</span>
              <ExternalLink size={15} />
            </a>
          ))}
        </div>

      </section>

      <footer>
        <span>{t.footer}</span>
        <span>NOVASTRIUM-3D+ © 2026</span>
      </footer>

    </main>
  );
 }

