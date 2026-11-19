
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {

  projects = [

    {
      name: 'TetherOcean TOVA-X',
      category: 'Crypto Exchange',

      description:
        'A decentralized finance (DeFi) platform built with Angular.',

      link: 'https://tovax.tetherocean.com/',

      icon: 'fas fa-coins',

      color: '#35baff',
      glow: 'rgba(53, 186, 255, 0.35)',

      features: [
        'Token Swap',
        'Liquidity Pools',
        'Blockchain API',
        'Angular Frontend'
      ]
    },

    {
      name: 'Metatron Astroswap',
      category: 'Crypto Exchange',

      description:
        'Frontend development for AstroSwap decentralized exchange.',

      link: 'https://www.astroswap.dev/',

      icon: 'fas fa-chart-line',

      color: '#a78bfa',
      glow: 'rgba(167, 139, 250, 0.35)',

      features: [
        'Trading Dashboard',
        'Staking',
        'Portfolio',
        'Angular 21 Migration'
      ]
    },

    {
      name: 'Metatron BigBet',
      category: 'Crypto Trading',

      description:
        'Crypto trading platform with wallet integration.',

      link: 'https://grandescommessa.com/',

      icon: 'fas fa-wallet',

      color: '#00e5b0',
      glow: 'rgba(0, 229, 176, 0.35)',

      features: [
        'Wallet',
        'Order Book',
        'Trading',
        'Performance Optimization'
      ]
    },

    {
      name: 'Metatron Ecosystem',
      category: 'Landing Platform',

      description:
        'Landing page showcasing the complete Metatron ecosystem.',

      link: 'https://metatronecosystem.osizdemos.com/',

      icon: 'fas fa-cubes',

      color: '#ffb454',
      glow: 'rgba(255, 180, 84, 0.35)',

      features: [
        'Responsive UI',
        'Reusable Components',
        'YouTube Integration'
      ]
    },


    {
      name: 'Metatron Club',
      category: 'Membership & E-Commerce Platform',

      description:
        'A membership-based e-commerce platform that enables users to explore and purchase membership plans through a seamless experience with secure authentication and integrated payment functionality.',

      link: '',

      icon: 'fas fa-crown',

      color: '#a78bfa',
      glow: 'rgba(167, 139, 250, 0.35)',

      features: [
        'Membership Plan Purchase',
        'User Authentication',
        'Payment Gateway Integration',
        'Responsive Angular UI',
        'E-Commerce Functionality'
      ]
    }
    ,

    {
      name: 'AG Bouncers',
      category: 'Booking & Reservation Platform',

      description:
        'A freelance-developed bouncer booking platform that allows customers to book professional security services through a seamless online experience, featuring secure authentication and integrated payment functionality.',

      link: 'https://ag-bouncers.vercel.app/',

      icon: 'fas fa-shield-alt',

      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.35)',

      features: [
        'Online Bouncer Booking',
        'User Authentication',
        'Payment Gateway Integration',
        'Responsive Angular UI',
        'Freelance Client Project'
      ]
    }


  ];

  onCardMove(event: MouseEvent) {

    const card = event.currentTarget as HTMLElement;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX =
      ((y - centerY) / centerY) * -7;

    const rotateY =
      ((x - centerX) / centerX) * 7;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    card.style.transform = `
      perspective(1400px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
      scale3d(1.015, 1.015, 1.015)
    `;

  }

  onCardLeave(event: MouseEvent) {

    const card = event.currentTarget as HTMLElement;

    card.style.transform = '';

    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');

  }

}
