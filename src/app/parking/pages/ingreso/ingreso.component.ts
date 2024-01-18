import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';

import { Vehiculo } from '../../interfaces/vehiculos.interface';
import { ParkingService } from '../../services/parking.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css'
})
export class IngresoComponent {

  @ViewChild('formIng') formIng!: NgForm;
  vehiculos: Vehiculo[] = [];
  displayedColumns: string[] = ['id', 'tipo', 'placa', 'fec_ing', 'estado'];
  dataSource: MatTableDataSource<Vehiculo>;

  tipos: any[] = [
    {
      value: 'carro',
      viewValue: 'Carro'
    },
    {
      value: 'motocicleta',
      viewValue: 'Motocicleta'
    },
    {
      value: 'bicicleta',
      viewValue: 'Bicicleta'
    },
  ];

  vehiculo: Vehiculo = {
    tipo: '',
    placa: '',
    fec_ing: new Date(),
    estado: 'ingreso'
  }

  constructor( private parkingService: ParkingService ) {
    this.dataSource = new MatTableDataSource<Vehiculo>([]);
  }

  ngOnInit(): void {
    this.parkingService.getVehiculos()
      .subscribe( vehiculos => {
        this.vehiculos = vehiculos.filter( vehiculo => vehiculo.estado === 'ingreso' )
        this.dataSource.data = this.vehiculos;
      });

    //this.dataSource = new MatTableDataSource( this.vehiculos );
  }

  guardar(){
    if ( this.formIng.valid ) {
      const fechaLocal = new Date(this.formIng.value.fec_ing);
      this.formIng.value.fec_ing = fechaLocal;
      this.formIng.value.estado = 'ingreso';
      this.parkingService.agregarVehiculo( this.formIng.value )
        .pipe(
          switchMap(() => this.parkingService.getVehiculos())
        )
        .subscribe( vehiculos => {
          this.vehiculos = vehiculos.filter(vehiculo => vehiculo.estado === 'ingreso');
          this.dataSource.data = this.vehiculos;
          this.vehiculo = {
            tipo: '',
            placa: '',
            fec_ing: new Date(),
            estado: 'ingreso'
          }
        });
    }
  }
}
