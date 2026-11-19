
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {

  skills_name = [

    {
      name: 'Angular',
      icon: 'fab fa-angular',
      color: '#dd0031',
      glow: 'rgba(221, 0, 49, 0.35)'
    },

    {
      name: 'TypeScript',
      icon: 'devicon-typescript-plain',
      color: '#3178c6',
      glow: 'rgba(49, 120, 198, 0.4)'
    },

    {
      name: 'JavaScript',
      icon: 'fab fa-js-square',
      color: '#f7df1e',
      glow: 'rgba(247, 223, 30, 0.35)'
    },

    {
      name: 'Node.js',
      icon: 'fab fa-node-js',
      color: '#68a063',
      glow: 'rgba(104, 160, 99, 0.35)'
    },

    {
      name: 'Express.js',
      icon: 'devicon-express-original',
      color: '#ffffff',
      glow: 'rgba(255, 255, 255, 0.25)'
    },

    {
      name: 'MongoDB',
      icon: 'devicon-mongodb-plain',
      color: '#47a248',
      glow: 'rgba(71, 162, 72, 0.4)'
    },

    {
      name: 'HTML5',
      icon: 'fab fa-html5',
      color: '#e34f26',
      glow: 'rgba(227, 79, 38, 0.35)'
    },

    {
      name: 'CSS3',
      icon: 'fab fa-css3-alt',
      color: '#1572b6',
      glow: 'rgba(21, 114, 182, 0.4)'
    },

    {
      name: 'SCSS',
      icon: 'devicon-sass-original',
      color: '#cc6699',
      glow: 'rgba(204, 102, 153, 0.35)'
    },

    {
      name: 'Git',
      icon: 'fab fa-git-alt',
      color: '#f05032',
      glow: 'rgba(240, 80, 50, 0.35)'
    },

    {
      name: 'GitHub',
      icon: 'fab fa-github',
      color: '#ffffff',
      glow: 'rgba(255, 255, 255, 0.25)'
    },

    {
      name: 'Bootstrap',
      icon: 'fab fa-bootstrap',
      color: '#7952b3',
      glow: 'rgba(121, 82, 179, 0.4)'
    }

  ];

  onCardMove(event: MouseEvent) {

    const card = event.currentTarget as HTMLElement;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-10px)
      scale3d(1.03, 1.03, 1.03)
    `;

  }

  onCardLeave(event: MouseEvent) {

    const card = event.currentTarget as HTMLElement;

    card.style.transform = '';

    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');

  }

}
