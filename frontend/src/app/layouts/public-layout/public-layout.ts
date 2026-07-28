import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { PaginaService, Pagina } from '../../core/services/pagina.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './public-layout.html',
})
export class PublicLayout implements OnInit {
  paginas = signal<Pagina[]>([]);
  menuAbierto = signal(false);

  constructor(private paginaService: PaginaService) {}

  ngOnInit() {
    this.paginaService.listPublicas().then((res) => this.paginas.set(res.data));
  }
}
