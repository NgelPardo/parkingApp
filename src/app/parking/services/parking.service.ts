import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehiculo } from '../interfaces/vehiculos.interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private baseURL: string = 'http://localhost:3000';

  constructor( private http: HttpClient ) { }

  getVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${ this.baseURL }/vehiculos`)
  }

  agregarVehiculo( vehiculo: Vehiculo ): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(`${ this.baseURL }/vehiculos`, vehiculo );
  }

  actualizarVehiculo( vehiculo: Vehiculo ): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${ this.baseURL }/vehiculos/${ vehiculo.id }`, vehiculo );
  }
}
