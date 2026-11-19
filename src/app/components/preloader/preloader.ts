
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader.html',
  styleUrl: './preloader.scss',
})
export class Preloader implements OnInit, OnDestroy {
  isLoading = true;

  private loadingTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.loadingTimer = setTimeout(() => {
      this.isLoading = false;
    }, 3800);
  }

  ngOnDestroy(): void {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
  }
}
