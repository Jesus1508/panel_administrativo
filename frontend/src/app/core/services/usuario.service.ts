import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  list() {
    return firstValueFrom(this.http.get<ApiResponse<Usuario[]>>(`${API_URL}/usuarios`));
  }

  create(nombre: string, email: string, password: string) {
    return firstValueFrom(
      this.http.post<ApiResponse<Usuario>>(`${API_URL}/usuarios`, { nombre, email, password })
    );
  }

  remove(id: number) {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${API_URL}/usuarios/${id}`));
  }
}
