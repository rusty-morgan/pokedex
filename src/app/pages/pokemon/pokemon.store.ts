import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Pokemon } from 'src/app/services/pokemon/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon/pokemon.service';

export interface PokemonState {
  status: 'pending' | 'loading' | 'success' | 'error';
  pokemon: Pokemon | null;
  errorMsg?: string;
}

@Injectable()
export class PokemonStore extends ComponentStore<PokemonState> {
  constructor(private readonly pokemonService: PokemonService) {
    super({ pokemon: null, status: 'pending' });
  }

  readonly pokemon$ = this.select((state) => state.pokemon);
  readonly status$ = this.select((state) => state.status);
  readonly error$ = this.select((state) => state.errorMsg);
  readonly getPokemon = this.effect((name$: Observable<string>) =>
    name$.pipe(
      tap(() => this.patchState({ status: 'loading' })),
      switchMap((name) =>
        this.pokemonService.fetchPokemonByName(name).pipe(
          tapResponse({
            next: (result) =>
              this.setState({
                pokemon: result,
                status: 'success',
              }),
            error: (err: HttpErrorResponse) =>
              this.setState({
                pokemon: null,
                status: 'error',
                errorMsg: err.error,
              }),
          })
        )
      )
    )
  );
}
