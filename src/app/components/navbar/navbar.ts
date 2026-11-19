
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  isOpen = false;
  isScrolled = false;

  activeSection = 'home';

  navLinks = [
    'Home',
    'About',
    'Skills',
    'Projects',
  ];

  @HostListener('window:scroll')
  onWindowScroll() {

    this.isScrolled = window.scrollY > 50;

    const sections = [
      'home',
      'about',
      'skills',
      'projects',
      'contact'
    ];

    let currentSection = 'home';

    for (const section of sections) {

      const element = document.getElementById(section);

      if (element) {

        const position = element.getBoundingClientRect();

        if (position.top <= 150) {
          currentSection = section;
        }

      }

    }

    this.activeSection = currentSection;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
  }

}
