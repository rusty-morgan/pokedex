import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { PokemonService } from '../services/pokemon/pokemon.service';
import {
  EMPTY,
  Observable,
  concatMap,
  delay,
  exhaustMap,
  from,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

export interface Pokemon {
  name: string;
  url: string;
}
export interface HomeState {
  status: 'pending' | 'loading' | 'success' | 'error';
  pokemons: Pokemon[];
  next?: string | null;
}

@Injectable()
export class HomeStore extends ComponentStore<HomeState> {
  constructor(private readonly pokemonService: PokemonService) {
    super({ pokemons: [], status: 'pending' });
  }

  readonly pokemons$ = this.select((state) => state.pokemons);
  readonly status$ = this.select((state) => state.status);

  readonly getPokemons = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ status: 'loading' })),
      exhaustMap(() =>
        this.pokemonService.fetchPokemons().pipe(
          tapResponse({
            next: (data) =>
              this.patchState(() => ({
                status: 'success',
                next: data.next,
              })),
            error: (error: HttpErrorResponse) => EMPTY,
          }),
          map((res) => from(res.results)),
          switchMap((pokemons$) =>
            pokemons$.pipe(
              concatMap((val) => of(val).pipe(delay(100))),
              tapResponse({
                next: (data) =>
                  this.patchState((state) => ({
                    pokemons: [...state.pokemons, data],
                  })),
                error: () => EMPTY,
              })
            )
          )
        )
      )
    )
  );

  readonly getMorePokemons = this.effect(
    (ev$: Observable<InfiniteScrollCustomEvent>) =>
      ev$.pipe(
        tap(() => this.patchState({ status: 'loading' })),

        switchMap((event) =>
          this.select((state) => state.next).pipe(
            take(1),
            switchMap((urlString) => {
              let params = null;
              if (urlString) {
                const url = new URL(urlString);
                params = url.search;
              }
              return this.pokemonService.fetchPokemons(params).pipe(
                tapResponse({
                  next: (data) =>
                    this.patchState(() => ({
                      status: 'success',
                      next: data.next,
                    })),
                  error: (error: HttpErrorResponse) => EMPTY,
                  finalize: () => event.target.complete(),
                }),
                map((res) => from(res.results)),
                switchMap((pokemons$) =>
                  pokemons$.pipe(
                    concatMap((val) => of(val).pipe(delay(100))),
                    tapResponse({
                      next: (pokemon) =>
                        this.patchState((state) => ({
                          pokemons: [...state.pokemons, pokemon],
                        })),
                      error: () => EMPTY,
                    })
                  )
                )
              );
            })
          )
        )
      )
  );
}
