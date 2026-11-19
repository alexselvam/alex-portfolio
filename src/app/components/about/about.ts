
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements AfterViewInit, OnDestroy {

  @ViewChild('sceneCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private particles!: THREE.Points;

  private floatingObjects: THREE.Mesh[] = [];
  private initialPositions: THREE.Vector3[] = [];

  private animationId = 0;
  private resizeObserver?: ResizeObserver;

  private reducedMotion = false;
  private clock = new THREE.Clock();

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {

    this.reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    this.initThreeScene();
    this.createParticles();
    this.createFloatingObjects();
    this.handleResize();

    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  // =====================================
  // INITIALIZE SCENE
  // =====================================

  private initThreeScene(): void {

    const canvas = this.canvasRef.nativeElement;

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      100
    );

    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.5)
    );

    this.renderer.setSize(width, height, false);

    this.renderer.setClearColor(0x000000, 0);

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  // =====================================
  // PARTICLES
  // =====================================

  private createParticles(): void {

    const particleCount = 220;

    const positions = new Float32Array(
      particleCount * 3
    );

    for (let i = 0; i < particleCount; i++) {

      positions[i * 3] =
        (Math.random() - 0.5) * 20;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 14;

      positions[i * 3 + 2] =
        (Math.random() - 0.5) * 10;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0x65bdff,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
      depthWrite: false
    });

    this.particles = new THREE.Points(
      geometry,
      material
    );

    this.scene.add(this.particles);
  }

  // =====================================
  // FLOATING OBJECTS
  // =====================================

  private createFloatingObjects(): void {

    const crystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x438dff,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
    );

    crystal.position.set(4, 1.5, -2);
    crystal.scale.setScalar(1.3);

    this.addFloatingObject(crystal);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.015, 8, 80),
      new THREE.MeshBasicMaterial({
        color: 0x46d9ff,
        transparent: true,
        opacity: 0.35
      })
    );

    ring.position.set(-4, -1.5, -3);
    ring.rotation.x = 0.8;

    this.addFloatingObject(ring);

    const smallCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.7, 0),
      new THREE.MeshBasicMaterial({
        color: 0x8b78ff,
        wireframe: true,
        transparent: true,
        opacity: 0.22
      })
    );

    smallCrystal.position.set(-4.5, 2.2, -4);

    this.addFloatingObject(smallCrystal);
  }

  private addFloatingObject(object: THREE.Mesh): void {

    this.scene.add(object);

    this.floatingObjects.push(object);

    this.initialPositions.push(
      object.position.clone()
    );
  }

  // =====================================
  // RESIZE
  // =====================================

  private handleResize(): void {

    const canvas = this.canvasRef.nativeElement;

    this.resizeObserver = new ResizeObserver(() => {

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (!width || !height) return;

      this.camera.aspect = width / height;

      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height, false);
    });

    this.resizeObserver.observe(canvas);
  }

  // =====================================
  // PROFILE CARD TILT
  // =====================================

  onCardMove(event: PointerEvent): void {

    if (event.pointerType === 'touch') return;

    const card = event.currentTarget as HTMLElement;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY =
      ((x - centerX) / centerX) * 10;

    const rotateX =
      -((y - centerY) / centerY) * 10;

    card.style.setProperty(
      '--rotate-x',
      `${rotateX}deg`
    );

    card.style.setProperty(
      '--rotate-y',
      `${rotateY}deg`
    );

    card.style.setProperty(
      '--mouse-x',
      `${x}px`
    );

    card.style.setProperty(
      '--mouse-y',
      `${y}px`
    );
  }

  onCardLeave(event: PointerEvent): void {

    const card = event.currentTarget as HTMLElement;

    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');

    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
  }

  // =====================================
  // ANIMATION
  // =====================================

  private animate = (): void => {

    this.animationId = requestAnimationFrame(
      this.animate
    );

    const elapsed = this.clock.getElapsedTime();

    if (!this.reducedMotion) {

      this.particles.rotation.y = elapsed * 0.025;
      this.particles.rotation.x = elapsed * 0.008;

      this.floatingObjects.forEach((object, index) => {

        object.rotation.x += 0.001;
        object.rotation.y += 0.0015;

        const initial = this.initialPositions[index];

        object.position.y =
          initial.y +
          Math.sin(elapsed * 0.7 + index) * 0.15;
      });
    }

    this.renderer.render(
      this.scene,
      this.camera
    );
  };

  // =====================================
  // CLEANUP
  // =====================================

  ngOnDestroy(): void {

    cancelAnimationFrame(this.animationId);

    this.resizeObserver?.disconnect();

    if (this.scene) {

      this.scene.traverse((object) => {

        const mesh = object as THREE.Mesh;

        mesh.geometry?.dispose();

        if (Array.isArray(mesh.material)) {

          mesh.material.forEach(material => {
            material.dispose();
          });

        } else {

          mesh.material?.dispose();
        }
      });
    }

    this.renderer?.dispose();
    this.clock.stop();
  }
}
