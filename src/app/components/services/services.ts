
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { CommonModule } from '@angular/common';

interface ServiceCard {
  number: string;
  title: string;
  text: string;
  className: string;
  active: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services implements AfterViewInit {

  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLElement>;

  @ViewChildren('card')
  cardElements!: QueryList<ElementRef<HTMLElement>>;

  pathPercent = 0;

  cards: ServiceCard[] = [
    {
      number: '01',
      title: 'Define',
      text: 'We start by understanding your goals, user requirements, and technical constraints to build a solid project foundation.',
      className: 'card-one',
      active: false
    },
    {
      number: '02',
      title: 'Design',
      text: 'Creating modern, intuitive, and user-friendly interfaces that provide a seamless digital experience.',
      className: 'card-two',
      active: false
    },
    {
      number: '03',
      title: 'Build',
      text: 'Developing scalable frontend and backend applications using Angular, Node.js, Express.js and MongoDB.',
      className: 'card-three',
      active: false
    },
    {
      number: '04',
      title: 'Launch',
      text: 'Testing, deployment, optimisation and continuous support to keep your application reliable and secure.',
      className: 'card-four',
      active: false
    }
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateScrollAnimation();
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.updateScrollAnimation();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateScrollAnimation();
  }

  private updateScrollAnimation(): void {
    if (!this.container) return;

    const section = this.container.nativeElement;
    const rect = section.getBoundingClientRect();

    const viewport = window.innerHeight;
    const total = rect.height + viewport;

    const progress = (viewport - rect.top) / total;

    this.pathPercent = Math.max(
      0,
      Math.min(1, progress)
    );

    this.activateCards(rect.height);
  }

  private activateCards(containerHeight: number): void {
    if (!this.cardElements) return;

    const lineY = this.pathPercent * containerHeight;
    const containerRect =
      this.container.nativeElement.getBoundingClientRect();

    this.cardElements.forEach((card, index) => {
      const cardRect = card.nativeElement.getBoundingClientRect();
      const cardTop = cardRect.top - containerRect.top;

      this.cards[index].active = lineY >= cardTop + 50;
    });
  }

  // 3D Mouse Tilt
  onCardMove(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = ((centerY - y) / centerY) * 7;

    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);

    card.style.setProperty(
      '--mouse-x',
      `${(x / rect.width) * 100}%`
    );

    card.style.setProperty(
      '--mouse-y',
      `${(y / rect.height) * 100}%`
    );
  }

  onCardLeave(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;

    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  }
}
