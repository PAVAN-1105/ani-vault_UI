import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Anime } from './anime';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private http = inject(HttpClient);
   private dataUrl = 'https://ani-vault-backend.onrender.com/api/animes';
  //private dataUrl = 'http://localhost:3000/api/animes';

  // HELPER: Grabs the token and builds the header
  private getHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn("No token found in localStorage!");
    }
    // Ensure 'Bearer ' has the space after it
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAnimes(): Observable<Anime[]> {
    // We MUST pass { headers } so the backend knows WHO is asking
    return this.http.get<Anime[]>(this.dataUrl, { headers: this.getHeaders() });
  }

  getAnimeById(id: number): Observable<Anime | undefined> {
    return this.http.get<Anime[]>(this.dataUrl, { headers: this.getHeaders() }).pipe(
      map(animes => animes.find(anime => anime.id === id))
    );
  }

  addAnime(newAnime: Anime): Observable<Anime> {
    // Adding the token ensures the anime is "stamped" with your ID
    return this.http.post<Anime>(this.dataUrl, newAnime, { headers: this.getHeaders() });
  }

  deleteAnime(id: number): Observable<any> {
    // Adding the token prevents you from deleting someone else's anime
    return this.http.delete(`${this.dataUrl}/${id}`, { headers: this.getHeaders() });
  }

  // ✅ NEW: Update an existing anime's status
  updateAnime(anime: Anime): Observable<Anime> {
    // We send a PUT request to the specific anime's ID, and include the auth headers
    return this.http.put<Anime>(`${this.dataUrl}/${anime.id}`, anime, { headers: this.getHeaders() });
  }
}