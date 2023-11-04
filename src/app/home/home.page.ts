import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  IonicModule,
  NavController,
} from '@ionic/angular';
import { HomeStore } from './home.store';
import { fadeInUpOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  providers: [HomeStore],
  animations: [
    fadeInUpOnEnterAnimation({
      anchor: 'enter',
      duration: 1000,
      delay: 100,
      translate: '30px',
    }),
  ],
})
export class HomePage implements OnInit {
  pokemons$ = this.homeStore.pokemons$;
  status$ = this.homeStore.status$;

  constructor(
    private readonly homeStore: HomeStore,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.homeStore.getPokemons();
  }

  onIonInfinite(ev: Event) {
    const event = ev as InfiniteScrollCustomEvent;
    this.homeStore.getMorePokemons(event);
  }

  getImgUrl(i: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png`;
  }

  navigateTo(pokemon: string) {
    this.navCtrl.navigateForward([`pokemon/${pokemon}`]);
  }
}
