
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements AfterViewInit, OnDestroy {

  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef<HTMLVideoElement>;

  @ViewChild('sceneCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('heroSection')
  heroRef!: ElementRef<HTMLElement>;

  isPlaying = false;
  isMuted = true;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private particles!: THREE.Points;

  private floatingObjects: THREE.Mesh[] = [];

  private animationId = 0;

  private resizeObserver?: ResizeObserver;

  private mouseX = 0;
  private mouseY = 0;

  private targetX = 0;
  private targetY = 0;

  private reducedMotion = false;

  private clock = new THREE.Clock();

  // =========================
  // INITIALIZE
  // =========================

  ngAfterViewInit(): void {

    this.reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    this.initVideo();

    this.initThree();

    this.createParticles();

    this.createFloatingObjects();

    this.setupResize();

    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });

  }

  constructor(private ngZone: NgZone) {}

  // =========================
  // BACKGROUND VIDEO
  // =========================

  private initVideo(): void {

    const video = this.videoPlayer.nativeElement;

    video.muted = true;

    video.play()
      .then(() => {

        this.isPlaying = true;

      })
      .catch(() => {

        this.isPlaying = false;

      });

  }

  toggleVideo(): void {

    const video = this.videoPlayer.nativeElement;

    if (video.paused) {

      // User interaction allows playback with sound
      video.muted = false;

      this.isMuted = false;

      video.play()
        .then(() => {

          this.isPlaying = true;

        })
        .catch(() => {

          this.isPlaying = false;

        });

    } else {

      video.pause();

      this.isPlaying = false;

    }

  }

  // =========================
  // THREE JS INITIALIZATION
  // =========================

  private initThree(): void {

    const canvas = this.canvasRef.nativeElement;

    const section = this.heroRef.nativeElement;

    const width = section.clientWidth;
    const height = section.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      100
    );

    this.camera.position.set(0, 0, 9);

    this.renderer = new THREE.WebGLRenderer({

      canvas,

      alpha: true,

      antialias: true,

      powerPreference: 'high-performance'

    });

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.8)
    );

    this.renderer.setSize(
      width,
      height,
      false
    );

    this.renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    this.renderer.setClearColor(0x000000, 0);

  }

  // =========================
  // PARTICLE BACKGROUND
  // =========================

  private createParticles(): void {

    const isMobile = window.innerWidth < 600;

    const particleCount = isMobile ? 250 : 700;

    const positions = new Float32Array(
      particleCount * 3
    );

    const colors = new Float32Array(
      particleCount * 3
    );

    const colorOne = new THREE.Color(0x438dff);

    const colorTwo = new THREE.Color(0x9a8aff);

    for (let i = 0; i < particleCount; i++) {

      positions[i * 3] =
        (Math.random() - 0.5) * 22;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) * 14;

      positions[i * 3 + 2] =
        (Math.random() - 0.5) * 10;

      const mixedColor = colorOne.clone().lerp(
        colorTwo,
        Math.random()
      );

      colors[i * 3] = mixedColor.r;

      colors[i * 3 + 1] = mixedColor.g;

      colors[i * 3 + 2] = mixedColor.b;

    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({

      size: isMobile ? 0.025 : 0.035,

      vertexColors: true,

      transparent: true,

      opacity: 0.75,

      sizeAttenuation: true,

      depthWrite: false

    });

    this.particles = new THREE.Points(
      geometry,
      material
    );

    this.scene.add(this.particles);

  }

  // =========================
  // FLOATING 3D OBJECTS
  // =========================

  private createFloatingObjects(): void {

    // Main Icosahedron

    const geometryOne =
      new THREE.IcosahedronGeometry(1.1, 1);

    const materialOne =
      new THREE.MeshBasicMaterial({

        color: 0x438dff,

        wireframe: true,

        transparent: true,

        opacity: 0.24

      });

    const objectOne = new THREE.Mesh(
      geometryOne,
      materialOne
    );

    objectOne.position.set(4.5, 1.5, -2);

    objectOne.scale.setScalar(1.1);

    this.scene.add(objectOne);

    this.floatingObjects.push(objectOne);

    // Torus Ring

    const geometryTwo =
      new THREE.TorusGeometry(1.2, 0.025, 12, 90);

    const materialTwo =
      new THREE.MeshBasicMaterial({

        color: 0x9a80ff,

        transparent: true,

        opacity: 0.4

      });

    const objectTwo = new THREE.Mesh(
      geometryTwo,
      materialTwo
    );

    objectTwo.position.set(-4.5, -1.5, -3);

    objectTwo.rotation.set(1, 0.5, 0.3);

    this.scene.add(objectTwo);

    this.floatingObjects.push(objectTwo);

    // Small Floating Octahedron

    const geometryThree =
      new THREE.OctahedronGeometry(0.55, 0);

    const materialThree =
      new THREE.MeshBasicMaterial({

        color: 0x51d5ff,

        wireframe: true,

        transparent: true,

        opacity: 0.35

      });

    const objectThree = new THREE.Mesh(
      geometryThree,
      materialThree
    );

    objectThree.position.set(2.8, -2.5, -1);

    this.scene.add(objectThree);

    this.floatingObjects.push(objectThree);

  }

  // =========================
  // MOUSE INTERACTION
  // =========================

  onHeroPointerMove(event: PointerEvent): void {

    if (event.pointerType === 'touch') return;

    const rect =
      this.heroRef.nativeElement.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width;

    const y =
      (event.clientY - rect.top) / rect.height;

    this.targetX = (x - 0.5) * 2;

    this.targetY = (y - 0.5) * 2;

  }

  onHeroPointerLeave(): void {

    this.targetX = 0;

    this.targetY = 0;

  }

  // =========================
  // RESPONSIVE RESIZE
  // =========================

  private setupResize(): void {

    const section = this.heroRef.nativeElement;

    this.resizeObserver = new ResizeObserver(() => {

      const width = section.clientWidth;

      const height = section.clientHeight;

      if (!width || !height) return;

      this.camera.aspect = width / height;

      this.camera.updateProjectionMatrix();

      this.renderer.setSize(
        width,
        height,
        false
      );

      this.renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.8)
      );

    });

    this.resizeObserver.observe(section);

  }

  // =========================
  // ANIMATION LOOP
  // =========================

  private animate = (): void => {

    this.animationId = requestAnimationFrame(
      this.animate
    );

    const elapsed = this.clock.getElapsedTime();

    if (!this.reducedMotion) {

      // Smooth mouse movement

      this.mouseX = THREE.MathUtils.lerp(
        this.mouseX,
        this.targetX,
        0.035
      );

      this.mouseY = THREE.MathUtils.lerp(
        this.mouseY,
        this.targetY,
        0.035
      );

      // Camera Parallax

      this.camera.position.x = this.mouseX * 0.5;

      this.camera.position.y = -this.mouseY * 0.35;

      this.camera.lookAt(0, 0, 0);

      // Particle Rotation

      this.particles.rotation.y =
        elapsed * 0.025;

      this.particles.rotation.x =
        elapsed * 0.01;

      // Floating Objects

      this.floatingObjects.forEach(
        (object, index) => {

          object.rotation.x += 0.0015;

          object.rotation.y += 0.002;

          object.position.y +=
            Math.sin(
              elapsed + index * 2
            ) * 0.0015;

        }
      );

    }

    this.renderer.render(
      this.scene,
      this.camera
    );

  };

  // =========================
  // CLEANUP
  // =========================

  ngOnDestroy(): void {

    cancelAnimationFrame(this.animationId);

    this.resizeObserver?.disconnect();

    const video = this.videoPlayer?.nativeElement;

    if (video) {

      video.pause();

    }

    if (this.scene) {

      this.scene.traverse((object) => {

        if (object instanceof THREE.Mesh ||
            object instanceof THREE.Points) {

          object.geometry.dispose();

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach(material => {
            material.dispose();
          });

        }

      });

    }

    this.renderer?.dispose();

  }

}
