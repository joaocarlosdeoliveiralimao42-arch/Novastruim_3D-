
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const REGIONS = [
  { id: 'olympus', lat: 18.65, lon: 226.2 },
  { id: 'jezero', lat: 18.38, lon: 77.58 },
  { id: 'valles', lat: -13.9, lon: 300.8 },
  { id: 'gale', lat: -5.4, lon: 137.8 },
  { id: 'hellas', lat: -42.7, lon: 70 },
  { id: 'elysium', lat: 25, lon: 147 },
  { id: 'polar', lat: 82, lon: 0 }
];

export default function GloboMarte3D({
  selectedRegion = 'jezero',
  onSelectRegion = () => {},
  className = ''
}) {
  const mount = useRef(null);
  const selectedRef = useRef(selectedRegion);
  const selectRef = useRef(onSelectRegion);

  selectedRef.current = selectedRegion;
  selectRef.current = onSelectRegion;

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';

    host.appendChild(renderer.domElement);

    // Textura provisória
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

    // Textura MOLA
    let molaTexture = null;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      '/mola-texture',
      (texture) => {
        molaTexture = texture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(
          renderer.capabilities.getMaxAnisotropy(),
          8
        );

        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      (error) => {
        console.error('Falha ao carregar textura MOLA:', error);
      }
    );

    // Marcadores das sete regiões
    const markerGroup = new THREE.Group();
    const markerMeshes = [];

    REGIONS.forEach((region) => {
      const phi = (90 - region.lat) * Math.PI / 180;
      const theta = (region.lon - 180) * Math.PI / 180;

      const position = new THREE.Vector3(
        -1.305 * Math.sin(phi) * Math.cos(theta),
        1.305 * Math.cos(phi),
        1.305 * Math.sin(phi) * Math.sin(theta)
      );

      const markerMaterial = new THREE.MeshBasicMaterial({
        color: region.id === selectedRef.current ? 0xffffff : 0xffa078
      });

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.027, 16, 16),
        markerMaterial
      );

      marker.position.copy(position);
      marker.userData.regionId = region.id;
      markerGroup.add(marker);
      markerMeshes.push(marker);

      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.035, 0.047, 32),
        new THREE.MeshBasicMaterial({
          color: 0xffa078,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        })
      );

      halo.position.copy(position.clone().multiplyScalar(1.003));
      halo.lookAt(position.clone().multiplyScalar(2));
      markerGroup.add(halo);
    });

    mars.add(markerGroup);

    // Atmosfera
    const atmosphereGeometry = new THREE.SphereGeometry(1.34, 96, 72);

    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xf28b5e,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });

    const atmosphere = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );

    scene.add(atmosphere);

    scene.add(new THREE.AmbientLight(0x9d9aaa, 0.72));

    const sun = new THREE.DirectionalLight(0xffd4b5, 2.7);
    sun.position.set(4, 2, 4);
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x536b9a, 0.42);
    fill.position.set(-4, -1, -3);
    scene.add(fill);

    // Interação com mouse e toque
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    let startX = 0;
    let startY = 0;
    let frame;

    const down = (event) => {
      dragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;
      startX = event.clientX;
      startY = event.clientY;

      renderer.domElement.setPointerCapture?.(event.pointerId);
    };

    const move = (event) => {
      if (!dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      if (
        Math.abs(event.clientX - startX) +
        Math.abs(event.clientY - startY) > 5
      ) {
        moved = true;
      }

      mars.rotation.y += dx * 0.005;

      mars.rotation.x = THREE.MathUtils.clamp(
        mars.rotation.x + dy * 0.004,
        -1.1,
        1.1
      );

      lastX = event.clientX;
      lastY = event.clientY;
    };

    const up = (event) => {
      if (!dragging) return;

      dragging = false;

      if (!moved) {
        const rect = renderer.domElement.getBoundingClientRect();

        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const markerHits = raycaster.intersectObjects(markerMeshes);
        const planetHits = raycaster.intersectObject(mars, false);

        if (
          markerHits.length &&
          (!planetHits.length ||
            markerHits[0].distance < planetHits[0].distance)
        ) {
          selectRef.current(markerHits[0].object.userData.regionId);
        }
      }
    };

    const wheel = (event) => {
      camera.position.z = THREE.MathUtils.clamp(
        camera.position.z + event.deltaY * 0.002,
        2.75,
        5.7
      );
    };

    const element = renderer.domElement;

    element.addEventListener('pointerdown', down);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerup', up);
    element.addEventListener('pointercancel', up);
    element.addEventListener('wheel', wheel, { passive: true });

    // Ajuste de tamanho
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    // Rotação automática
    const animate = () => {
      frame = requestAnimationFrame(animate);

      if (!dragging) {
        mars.rotation.y += 0.00065;
      }

      markerMeshes.forEach((marker) => {
        marker.material.color.set(
          marker.userData.regionId === selectedRef.current
            ? 0xffffff
            : 0xffa078
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();

      element.removeEventListener('pointerdown', down);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerup', up);
      element.removeEventListener('pointercancel', up);
      element.removeEventListener('wheel', wheel);

      geometry.dispose();
      material.dispose();
      fallbackTexture.dispose();

      markerMeshes.forEach((marker) => {
        marker.geometry.dispose();
        marker.material.dispose();
      });

      markerGroup.children.forEach((child) => {
        if (child.geometry && child !== markerMeshes.find(m => m === child)) {
          child.geometry.dispose();
          child.material?.dispose();
        }
      });

      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();

      if (molaTexture) molaTexture.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mount}
      className={className}
      aria-label="Globo 3D de Marte com textura MOLA e regiões selecionáveis"
      style={{
        width: '100%',
        height: '390px',
        minHeight: '300px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'grab'
      }}
    />
  );
}

