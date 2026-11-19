
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  templateUrl: './custom-cursor.html',
  styleUrl: './custom-cursor.scss'
})
export class CustomCursor implements AfterViewInit, OnDestroy {

  @ViewChild('cursorRing') cursorRing!: ElementRef<HTMLDivElement>;
  @ViewChild('aura') aura!: ElementRef<HTMLDivElement>;
  @ViewChild('pulse') pulse!: ElementRef<HTMLDivElement>;

  private isBrowser: boolean;
  private enabled = false;

  private mouseX = -100;
  private mouseY = -100;

  private ringX = -100;
  private ringY = -100;

  private auraX = -100;
  private auraY = -100;

  private animationId = 0;
  private cleanups: (() => void)[] = [];

  private magneticElement: HTMLElement | null = null;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const finePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    );

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    if (!finePointer.matches || reducedMotion.matches) return;

    this.enabled = true;

    this.renderer.addClass(document.body, 'custom-cursor-enabled');

    this.cleanups.push(
      this.renderer.listen('document', 'pointermove', (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;

        this.mouseX = event.clientX;
        this.mouseY = event.clientY;

        this.handleMagnetic(event);
        this.handleSpotlight(event);
      }),

      this.renderer.listen('document', 'pointerover', (event: PointerEvent) => {
        const target = event.target as HTMLElement | null;

        if (target?.closest('a, button, [data-cursor-hover]')) {
          this.renderer.addClass(document.body, 'cursor-hover');
        }
      }),

      this.renderer.listen('document', 'pointerout', (event: PointerEvent) => {
        const target = event.target as HTMLElement | null;
        const related = event.relatedTarget as HTMLElement | null;

        if (
          target?.closest('a, button, [data-cursor-hover]') &&
          !related?.closest('a, button, [data-cursor-hover]')
        ) {
          this.renderer.removeClass(document.body, 'cursor-hover');
        }
      }),

      this.renderer.listen('document', 'pointerdown', () => {
        this.renderer.addClass(document.body, 'cursor-click');
      }),

      this.renderer.listen('document', 'pointerup', () => {
        this.renderer.removeClass(document.body, 'cursor-click');
      }),

      this.renderer.listen(document, 'mouseleave', () => {
        this.resetMagnetic();
        this.renderer.removeClass(document.body, 'cursor-hover');
      })
    );

    this.animateCursor();
  }

  private animateCursor(): void {
    if (!this.enabled) return;

    // Smooth ring follow
    this.ringX += (this.mouseX - this.ringX) * 0.18;
    this.ringY += (this.mouseY - this.ringY) * 0.18;

    // Slower aura follow
    this.auraX += (this.mouseX - this.auraX) * 0.09;
    this.auraY += (this.mouseY - this.auraY) * 0.09;

    this.cursorRing.nativeElement.style.transform =
      `translate3d(${this.ringX}px, ${this.ringY}px, 0) translate(-50%, -50%)`;

    this.aura.nativeElement.style.transform =
      `translate3d(${this.auraX}px, ${this.auraY}px, 0) translate(-50%, -50%)`;

    this.pulse.nativeElement.style.transform =
      `translate3d(${this.mouseX}px, ${this.mouseY}px, 0) translate(-50%, -50%)`;

    this.animationId = requestAnimationFrame(() => {
      this.animateCursor();
    });
  }

  private handleMagnetic(event: PointerEvent): void {
    const target = event.target as HTMLElement | null;

    const element = target?.closest(
      '[data-magnetic]'
    ) as HTMLElement | null;

    if (this.magneticElement && this.magneticElement !== element) {
      this.resetMagnetic();
    }

    this.magneticElement = element;

    if (!element) {
      this.renderer.removeClass(document.body, 'cursor-magnetic');
      return;
    }

    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (event.clientX - centerX) * 0.12;
    const y = (event.clientY - centerY) * 0.12;

    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    this.renderer.addClass(document.body, 'cursor-magnetic');
  }

  private handleSpotlight(event: PointerEvent): void {
    const target = event.target as HTMLElement | null;

    const card = target?.closest(
      '[data-cursor-spotlight]'
    ) as HTMLElement | null;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    card.style.setProperty(
      '--spotlight-x',
      `${event.clientX - rect.left}px`
    );

    card.style.setProperty(
      '--spotlight-y',
      `${event.clientY - rect.top}px`
    );
  }

  private resetMagnetic(): void {
    if (this.magneticElement) {
      this.magneticElement.style.transform = '';
      this.magneticElement = null;
    }

    this.renderer.removeClass(document.body, 'cursor-magnetic');
  }

  ngOnDestroy(): void {
    this.enabled = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.cleanups.forEach(cleanup => cleanup());

    if (this.isBrowser) {
      this.resetMagnetic();

      this.renderer.removeClass(document.body, 'custom-cursor-enabled');
      this.renderer.removeClass(document.body, 'cursor-hover');
      this.renderer.removeClass(document.body, 'cursor-click');
    }
  }
}
