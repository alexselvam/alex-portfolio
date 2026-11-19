import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {

  @ViewChild('contactSection')
  section!: ElementRef<HTMLElement>;

  bgTranslate = -100;

  @HostListener('window:scroll')
  onScroll() {

    if (!this.section) return;

    const rect = this.section.nativeElement.getBoundingClientRect();

    const windowHeight = window.innerHeight;

    const progress =
      (windowHeight - rect.top) /
      (windowHeight + rect.height);

    this.bgTranslate = -150 + (progress * 250);

  }
}
