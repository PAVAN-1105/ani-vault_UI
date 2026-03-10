import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; // ✅ Required for ngModel dropdown
import { AnimeService } from '../anime.service';
import { AuthService } from '../auth'; // ✅ Required for Toast notifications
import { Anime } from '../anime';

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [RouterModule, FormsModule], // ✅ Added FormsModule here
  templateUrl: './anime-detail.html'
})
export class AnimeDetail implements OnInit {
  // 1. MODERN INJECTION
  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeService);
  public authService = inject(AuthService); // ✅ Injected for our global toast

  // 2. MODERN REACTIVITY (SIGNALS)
  anime = signal<Anime | undefined>(undefined);

  ngOnInit(): void {
    // 3. READ THE URL
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    // 4. FETCH THE DATA
    if (id) {
      this.animeService.getAnimeById(id).subscribe({
        next: (data: Anime | undefined) => {
          this.anime.set(data);
        },
        error: (err: Error) => {
          console.error("Failed to load anime details:", err);
          this.authService.showToast("Failed to load anime details", true);
        }
      });
    }
  }

  // --- 5. NEW: HANDLE STATUS UPDATES ---
  onStatusChange(newStatus: 'Watching' | 'Completed' | 'Plan to Watch') {
    const currentAnime = this.anime();
    
    // Safety check: Make sure we actually have an anime loaded before updating
    if (!currentAnime) return;

    // Create a copy of the anime with the newly selected status
    const updatedAnime: Anime = { ...currentAnime, status: newStatus };

    // Send the updated anime to the backend via PUT request
    this.animeService.updateAnime(updatedAnime).subscribe({
      next: () => {
        // Update the signal so the UI changes instantly
        this.anime.set(updatedAnime);
        
        // Fire the global toast to let the user know it worked!
        this.authService.showToast(`✨ Status updated to ${newStatus}!`);
      },
      error: () => {
        this.authService.showToast("Failed to update status", true);
      }
    });
  }
}