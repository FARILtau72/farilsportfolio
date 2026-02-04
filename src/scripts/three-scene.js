// Three.js 3D Scene for Hero Section
import * as THREE from 'three';

function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Scene Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, 
    antialias: true 
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Particle Material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x6366f1,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  // Create Particle System
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Create Floating Geometric Shapes
  const geometries = [
    new THREE.IcosahedronGeometry(0.3, 0),
    new THREE.OctahedronGeometry(0.25, 0),
    new THREE.TetrahedronGeometry(0.3, 0),
  ];

  const shapes: THREE.Mesh[] = [];
  const shapeCount = 15;

  for (let i = 0; i < shapeCount; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0x6366f1 : 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    shapes.push(mesh);
    scene.add(mesh);
  }

  // Create Connection Lines
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.1,
  });

  const connections: THREE.Line[] = [];

  function updateConnections() {
    connections.forEach(line => scene.remove(line));
    connections.length = 0;

    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const distance = shapes[i].position.distanceTo(shapes[j].position);
        if (distance < 3) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            shapes[i].position,
            shapes[j].position
          ]);
          const line = new THREE.Line(geometry, lineMaterial);
          connections.push(line);
          scene.add(line);
        }
      }
    }
  }

  // Camera Position
  camera.position.z = 5;

  // Mouse Movement
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate particles
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = targetY * 0.2;

    // Animate shapes
    shapes.forEach((shape, index) => {
      shape.rotation.x += 0.003 + index * 0.0005;
      shape.rotation.y += 0.002 + index * 0.0003;
      
      // Floating animation
      shape.position.y += Math.sin(elapsedTime + index) * 0.002;
      shape.position.x += Math.cos(elapsedTime + index) * 0.001;
    });

    // Update connections periodically
    if (Math.floor(elapsedTime * 10) % 5 === 0) {
      updateConnections();
    }

    // Camera movement based on mouse
    camera.position.x = targetX * 0.5;
    camera.position.y = targetY * 0.5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Start Animation
  animate();
  updateConnections();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroScene);
} else {
  initHeroScene();
}
