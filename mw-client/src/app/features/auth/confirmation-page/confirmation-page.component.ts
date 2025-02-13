import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-confirmation-page',
  standalone: false,
  templateUrl: './confirmation-page.component.html',
})
export class ConfirmationPageComponent implements OnInit {
  email: string = '';
  faCheckCircle = faCheckCircle;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });

    // Redirect to login after 5 seconds
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 5000);
  }
} 