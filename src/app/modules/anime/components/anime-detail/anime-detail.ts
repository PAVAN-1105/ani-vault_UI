import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { AnimeService } from '../../services/anime.service'; // ✅ Up to anime services
import { AuthService } from '../../../auth/services/auth'; // ✅ Across to auth module
import { Anime } from '../../../../core/models/anime'; // ✅ Up to core models
// ✅ 1. Import switchMap from RxJS
import { switchMap } from 'rxjs/operators'; 

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './anime-detail.html'
})
export class AnimeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeService);
  public authService = inject(AuthService); 

  anime = signal<Anime | undefined>(undefined);

  ngOnInit(): void {
    // ✅ 2. The switchMap Implementation
    // Instead of taking a "snapshot", we listen to the URL parameters continuously
    this.route.paramMap.pipe(
      // switchMap takes the changing URL ID, cancels any pending API requests 
      // for the old ID, and instantly switches to the new API request.
      switchMap(params => {
        const id = Number(params.get('id'));
        // Return the inner Observable (the HTTP request)
        return this.animeService.getAnimeById(id);
      })
    ).subscribe({
      next: (data: Anime | undefined) => {
        this.anime.set(data);
      },
      error: (err: Error) => {
        console.error("Failed to load anime details:", err);
        this.authService.showToast("Failed to load anime details", true);
      }
    });
  }

  onStatusChange(newStatus: 'Watching' | 'Completed' | 'Plan to Watch') {
    const currentAnime = this.anime();
    if (!currentAnime) return;

    const updatedAnime: Anime = { ...currentAnime, status: newStatus };

    this.animeService.updateAnime(updatedAnime).subscribe({
      next: () => {
        this.anime.set(updatedAnime);
        this.authService.showToast(`✨ Status updated to ${newStatus}!`);
      },
      error: () => this.authService.showToast("Failed to update status", true)
    });
  }
}