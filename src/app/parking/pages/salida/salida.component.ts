import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

import { Vehiculo } from '../../interfaces/vehiculos.interface';
import { ParkingService } from '../../services/parking.service';
import { switchMap } from 'rxjs/operators';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'app-salida',
  templateUrl: './salida.component.html',
  styleUrl: './salida.component.css'
})
export class SalidaComponent {
  @ViewChild('formSal') formSal!: NgForm;
  vehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = [];
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

  filaSeleccionada: Vehiculo = {
    tipo: '',
    placa: '',
    fec_ing: new Date(),
    estado: 'ingreso'
  }

  constructor( private parkingService: ParkingService, public dialog: MatDialog ) {
    this.dataSource = new MatTableDataSource<Vehiculo>([]);
  }

  ngOnInit(): void {
    this.parkingService.getVehiculos()
      .subscribe( vehiculos => {
        this.vehiculos = vehiculos.filter( vehiculo => vehiculo.estado === 'ingreso' )
        this.dataSource = new MatTableDataSource(this.vehiculos);
      });
  }

  openDialog() {
    this.dialog.open(SalidaComponent);
  }

  seleccionarFila(fila: any) {
    this.filaSeleccionada = fila;
    this.filaSeleccionada.fec_sal = new Date();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  actualizar(){
    if ( this.formSal.valid ) {
      const fechaLocalIng = new Date(this.formSal.value.fec_ing);
      const fechaLocalSal = new Date(this.formSal.value.fec_sal);
      if (fechaLocalSal < fechaLocalIng) {
        alert('La hora de salida no puede ser menor a la hora de entrada');
        return;
      }
      this.formSal.value.fec_ing = fechaLocalIng;
      this.formSal.value.fec_sal = fechaLocalSal;
      const diferenciaEnMilisegundos = fechaLocalSal.getTime() - fechaLocalIng.getTime();
      this.formSal.value.tie_tot = diferenciaEnMilisegundos / (1000 * 60);
      this.formSal.value.id = this.filaSeleccionada.id;
      this.formSal.value.estado = 'salida';
      switch (this.formSal.value.tipo) {
        case 'carro':
            this.formSal.value.val_pag = this.formSal.value.tie_tot * 110;
          break;
        case 'motocicleta':
            this.formSal.value.val_pag = this.formSal.value.tie_tot * 50;
          break;
        case 'bicicleta':
            this.formSal.value.val_pag = this.formSal.value.tie_tot * 10;
          break;
        default:
          break;
      }
      this.parkingService.actualizarVehiculo(this.formSal.value)
        .pipe(
          switchMap(updatedVehiculo => {
            this.filaSeleccionada = {
              tipo: '',
              placa: '',
              fec_ing: new Date(),
              estado: 'ingreso'
            }
            this.dialog.open(DialogComponent,{
              width: '500px',
              data: {
                fec_ing: updatedVehiculo.fec_ing,
                fec_sal: updatedVehiculo.fec_sal,
                placa: updatedVehiculo.placa,
                tie_tot: updatedVehiculo.tie_tot,
                val_pag: updatedVehiculo.val_pag
              }
            });
            return this.parkingService.getVehiculos();
          })
        )
        .subscribe(vehiculos => {
          this.vehiculos = vehiculos.filter(vehiculo =>
            vehiculo.estado === 'ingreso'
          );
          this.dataSource.data = this.vehiculos;
        });

    }
  }
}
