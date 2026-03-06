// 1. Import Output and EventEmitter
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

  // 2. Create the Megaphone (@Output)
  // This says: "I am going to emit an event that contains an Anime object"
  @Output() favoriteSelected = new EventEmitter<Anime>();
  @Output() deleteSelected = new EventEmitter<number>();

  // 3. The function that clicks the megaphone's button
  onFavoriteClick() {
    // We emit the exact anime data that this card is holding!
    this.favoriteSelected.emit(this.animeInfo);
  }
  onDeleteClick() {
    this.deleteSelected.emit(this.animeInfo.id);
  }
}