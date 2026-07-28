import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config';

export interface Noticia {
  id?: number;
  titulo: string;
  slug?: string;
  resumen: string;
  contenido: string;
  imagenUrl?: string | null;
  publicada: boolean;
  publicadaEn?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class NoticiaService {
  constructor(private http: HttpClient) {}

  listPublicas() {
    return firstValueFrom(this.http.get<ApiResponse<Noticia[]>>(`${API_URL}/noticias`));
  }

  getBySlug(slug: string) {
    return firstValueFrom(this.http.get<ApiResponse<Noticia>>(`${API_URL}/noticias/${slug}`));
  }

  listAdmin() {
    return firstValueFrom(this.http.get<ApiResponse<Noticia[]>>(`${API_URL}/noticias/admin/todas`));
  }

  create(formData: FormData) {
    return firstValueFrom(this.http.post<ApiResponse<Noticia>>(`${API_URL}/noticias/admin`, formData));
  }

  update(id: number, formData: FormData) {
    return firstValueFrom(this.http.put<ApiResponse<Noticia>>(`${API_URL}/noticias/admin/${id}`, formData));
  }

  remove(id: number) {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${API_URL}/noticias/admin/${id}`));
  }
}
