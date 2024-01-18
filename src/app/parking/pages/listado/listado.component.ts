import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { ParkingService } from '../../services/parking.service';
import { Vehiculo } from '../../interfaces/vehiculos.interface';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent {

  @ViewChild('picker_ing') pickerIngreso: any;
  @ViewChild('picker_sal') pickerSalida: any;
  vehiculos: Vehiculo[] = [];
  displayedColumns: string[] = ['id', 'tipo', 'placa', 'fec_ing', 'fec_sal', 'tiempo', 'val_pag', 'estado'];
  dataSource: MatTableDataSource<Vehiculo>;

  constructor( private parkingService: ParkingService) {
    this.dataSource = new MatTableDataSource<Vehiculo>([]);
  }

  ngOnInit(): void {
    this.parkingService.getVehiculos()
      .subscribe( vehiculos => {
        this.vehiculos = vehiculos.filter( vehiculo => vehiculo.estado === 'salida' )
        this.dataSource.data = this.vehiculos;
      });

    //this.dataSource = new MatTableDataSource( this.vehiculos );
  }

  applyFilter() {
    const fechaIngreso = new Date(this.pickerIngreso._model.selection);
    const fechaSalida = new Date(this.pickerSalida._model.selection);

    if (!fechaIngreso || !fechaSalida) {
      alert('Por favor, seleccione ambas fechas');
      return;
    }

    if (fechaSalida <= fechaIngreso) {
      alert('La fecha de salida debe ser mayor que la fecha de ingreso');
      return;
    }

    this.parkingService.getVehiculos()
      .subscribe( vehiculos => {
        this.vehiculos = vehiculos.filter(vehiculo =>
          vehiculo.estado === 'salida' &&
          new Date(vehiculo.fec_ing) >= fechaIngreso &&
          new Date(vehiculo.fec_ing) <= fechaSalida
        )
        this.dataSource.data = this.vehiculos;
      });
  }
}
