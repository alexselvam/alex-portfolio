import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
import { About } from './components/about/about';
import { Contact } from "./components/contact/contact";
import { Footer } from "./components/footer/footer";
import { Hero } from "./components/hero/hero";
import { Navbar } from "./components/navbar/navbar";
import { Preloader } from "./components/preloader/preloader";
import { Services } from "./components/services/services";
import { Skills } from './components/skills/skills';
import { Project } from './components/project/project';
import { CustomCursor } from './components/custom-cursor/custom-cursor';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, About, Contact, Footer, Hero, Navbar, Preloader, Services,Skills,Project,CustomCursor],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('portfolio');

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

}
