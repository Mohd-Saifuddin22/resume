/**
 * Three.js WebGL Particle Background
 * Creates an interactive particle field with parallax depth effect
 */

(function() {
  'use strict';

  const PARTICLE_COUNT = window.innerWidth < 768 ? 800 : 1500;
  const PARTICLE_SIZE = 2;
  const PARTICLE_COLOR = 0x00d4ff;
  const PARTICLE_OPACITY = 0.6;
  const PARALLAX_STRENGTH = 0.05;
  const ANIMATION_SPEED = 0.0005;

  let scene, camera, renderer, particles;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let animationId;

  function init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    createParticles();
    animate();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
  }

  function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const baseColor = new THREE.Color(PARTICLE_COLOR);
    const secondaryColor = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 2000;
      positions[i3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i3 + 2] = (Math.random() - 0.5) * 1000;

      const colorChoice = Math.random() > 0.7 ? secondaryColor : baseColor;
      colors[i3] = colorChoice.r;
      colors[i3 + 1] = colorChoice.g;
      colors[i3 + 2] = colorChoice.b;

      sizes[i] = Math.random() * PARTICLE_SIZE + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: PARTICLE_SIZE,
      vertexColors: true,
      transparent: true,
      opacity: PARTICLE_OPACITY,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2);
    mouseY = (event.clientY - window.innerHeight / 2);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    targetX += (mouseX * PARALLAX_STRENGTH - targetX) * 0.05;
    targetY += (mouseY * PARALLAX_STRENGTH - targetY) * 0.05;

    particles.rotation.y += ANIMATION_SPEED;
    particles.rotation.x += ANIMATION_SPEED * 0.5;

    particles.position.x = targetX;
    particles.position.y = -targetY;

    renderer.render(scene, camera);
  }

  function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', onWindowResize);
    window.removeEventListener('mousemove', onMouseMove);

    if (renderer) {
      renderer.dispose();
      const container = document.getElementById('canvas-container');
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('beforeunload', cleanup);
})();
