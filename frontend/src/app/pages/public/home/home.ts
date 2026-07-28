import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiaService, Noticia } from '../../../core/services/noticia.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  noticias = signal<Noticia[]>([]);
  cargando = signal(true);

  constructor(private noticiaService: NoticiaService) {}

  ngOnInit() {
    this.noticiaService
      .listPublicas()
      .then((res) => this.noticias.set(res.data.slice(0, 3)))
      .finally(() => this.cargando.set(false));
  }
}
