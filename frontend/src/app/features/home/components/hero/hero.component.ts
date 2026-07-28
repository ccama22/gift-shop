import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  onShopBoutique(): void {
    console.log('Navigate to boutique');
  }

  onExploreRegistry(): void {
    console.log('Navigate to registry');
  }
}
