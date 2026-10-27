import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Lights (Sky Blue + Purple Holographic Palette)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x0ea5e9, 4.5, 30);
    blueLight.position.set(5, 5, 5);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 4.5, 30);
    purpleLight.position.set(-5, -4, 4);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 3.0, 25);
    cyanLight.position.set(0, 6, -3);
    scene.add(cyanLight);

    // 3. Generative Distorted 3D Mesh
    // Base icosahedron with subdivisions for organic surface deformation
    const baseGeometry = new THREE.IcosahedronGeometry(2.2, 14);
    // Clone position attributes to compute waves/distortions in loop
    const positionAttr = baseGeometry.attributes.position;
    const originalPositions = new Float32Array(positionAttr.array);

    // Glassmorphic / Holographic material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.15,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.65, // glassmorphic transparency
      ior: 1.45,
      reflectivity: 0.9,
      transparent: true,
      opacity: 0.88,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(baseGeometry, glassMaterial);
    
    // Wireframe accent overlay for holographic aesthetic
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireframeMesh = new THREE.Mesh(baseGeometry.clone(), wireframeMaterial);
    wireframeMesh.scale.set(1.02, 1.02, 1.02);

    // Floating orbital holographic ring
    const ringGeometry = new THREE.TorusGeometry(3.2, 0.04, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 3;

    // Grouping
    const rootGroup = new THREE.Group();
    rootGroup.add(mesh);
    rootGroup.add(wireframeMesh);
    rootGroup.add(ringMesh);
    scene.add(rootGroup);

    // 4. Mouse Tracking Interactivity with Smooth Ease
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 5. Scroll Effect via GSAP
    // As user scrolls down, scale down and transition to right side
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const progress = Math.min(scrollY / 700, 1);

      gsap.to(rootGroup.position, {
        x: progress * 2.8, // Smoothly transition to right side to make room for content
        y: -progress * 0.5,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      gsap.to(rootGroup.scale, {
        x: 1 - progress * 0.42, // Smoothly scale down
        y: 1 - progress * 0.42,
        z: 1 - progress * 0.42,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. RequestAnimationFrame Loop & Generative Wave Deformation
    let animationFrameId: number;
    let clock = new THREE.Clock();

    let frameCount = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return;

      frameCount++;
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Group rotation guided by time & cursor
      rootGroup.rotation.y = elapsedTime * 0.25 + mouse.x * 0.4;
      rootGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.2 + mouse.y * 0.3;

      ringMesh.rotation.z = -elapsedTime * 0.18;

      // Generative dynamic surface wave deformation (optimized update)
      if (frameCount % 2 === 0) {
        const positions = positionAttr.array as Float32Array;
        const count = positionAttr.count;

        for (let i = 0; i < count; i++) {
          const u = i * 3;
          const ox = originalPositions[u];
          const oy = originalPositions[u + 1];
          const oz = originalPositions[u + 2];

          // Harmonic wave oscillation
          const distance = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const wave = Math.sin(distance * 3.0 + elapsedTime * 2.0 + ox * 1.5) * 0.14
                     + Math.cos(distance * 2.0 - elapsedTime * 1.5 + oy * 1.5) * 0.08;

          const factor = 1 + wave / distance;
          positions[u] = ox * factor;
          positions[u + 1] = oy * factor;
          positions[u + 2] = oz * factor;
        }

        positionAttr.needsUpdate = true;
        baseGeometry.computeVertexNormals();
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      baseGeometry.dispose();
      glassMaterial.dispose();
      wireframeMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full"
      aria-hidden="true"
    />
  );
};
