import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokemonStore } from './pokemon.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.page.html',
  styleUrls: ['./pokemon.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [PokemonStore],
})
export class PokemonPage implements OnInit {
  pokemon$ = this.pokemonStore.pokemon$;
  status$ = this.pokemonStore.status$;
  error$ = this.pokemonStore.error$;

  constructor(
    private readonly pokemonStore: PokemonStore,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('pokemon');
    if (name) this.pokemonStore.getPokemon(name);
  }
}
