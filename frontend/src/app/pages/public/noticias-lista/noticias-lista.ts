import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiaService, Noticia } from '../../../core/services/noticia.service';

@Component({
  selector: 'app-noticias-lista',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './noticias-lista.html',
})
export class NoticiasLista implements OnInit {
  noticias = signal<Noticia[]>([]);
  cargando = signal(true);

  constructor(private noticiaService: NoticiaService) {}

  ngOnInit() {
    this.noticiaService
      .listPublicas()
      .then((res) => this.noticias.set(res.data))
      .finally(() => this.cargando.set(false));
  }
}
