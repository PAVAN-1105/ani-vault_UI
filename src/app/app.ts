import { Component, signal, inject } from '@angular/core'; 
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './auth'; 
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Anime Vault');
  
  // Use 'public' so your HTML template can see the signals
  public authService = inject(AuthService); 
  
  // ✅ Inject the LoadingService here
  public loadingService = inject(LoadingService); 
}