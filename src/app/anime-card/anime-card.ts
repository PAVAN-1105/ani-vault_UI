import { Component, Input, Output, EventEmitter } from '@angular/core'; 
import { RouterModule } from '@angular/router';
import { Anime } from '../anime';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [RouterModule, UpperCasePipe],
  templateUrl: './anime-card.html'
})
export class AnimeCard {
  @Input() animeInfo!: Anime; 

  // --- UPDATED: Both emitters now send the full Anime object ---
  @Output() favoriteSelected = new EventEmitter<Anime>();
  @Output() deleteSelected = new EventEmitter<Anime>(); 

  onDeleteClick() {
    // ✅ CHANGED: Now emits 'this.animeInfo' instead of 'this.animeInfo.id'
    // This allows the Dashboard Modal to show "Are you sure you want to delete [Title]?"
    this.deleteSelected.emit(this.animeInfo);
  }
}