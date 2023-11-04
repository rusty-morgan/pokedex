import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pokemon, PokemonResultI } from './pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor(private http: HttpClient) {}

  fetchPokemons(params: string | null = null) {
    const paramsObj: { [key: string]: string } = {};
    if (params) {
      params
        .substring(1)
        .split('&')
        .forEach((pair) => {
          const parts = pair.split('=');
          paramsObj[parts[0]] = parts[1];
        });
    }
    return this.http.get<PokemonResultI>(`${environment.apiUrl}pokemon`, {
      params: paramsObj,
    });
  }

  fetchPokemonByName(name: string) {
    return this.http.get<Pokemon>(`${environment.apiUrl}pokemon/${name}`);
  }
}
