import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { AnimeService } from '../../services/anime.service'; 
import { AuthService } from '../../../auth/services/auth'; 
import { Anime } from '../../../../core/models/anime'; 
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
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        
        // Satisfies TypeScript by ensuring 'id' is strictly a string
        if (!id) {
          throw new Error('Anime ID is missing from the URL');
        }
        
        // Passes the string ID (perfect for MongoDB ObjectIDs)
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