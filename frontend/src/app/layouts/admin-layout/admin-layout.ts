import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
