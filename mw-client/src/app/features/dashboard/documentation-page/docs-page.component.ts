import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-docs-page',
  standalone: false,
  templateUrl: './docs-page.component.html',
})
export class DocsPageComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = (e.target as HTMLAnchorElement).getAttribute('href');
        if (targetId) {
          document.querySelector(targetId)?.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }
}
