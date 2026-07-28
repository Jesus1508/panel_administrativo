import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  data: { token: string; usuario: Usuario };
}

const TOKEN_KEY = 'panel_token';
const USUARIO_KEY = 'panel_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario = signal<Usuario | null>(this.leerUsuarioGuardado());

  constructor(private http: HttpClient) {}

  private leerUsuarioGuardado(): Usuario | null {
    const raw = localStorage.getItem(USUARIO_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get estaAutenticado(): boolean {
    return !!this.token;
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, password })
    );
    localStorage.setItem(TOKEN_KEY, res.data.token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(res.data.usuario));
    this.usuario.set(res.data.usuario);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuario.set(null);
  }
}
