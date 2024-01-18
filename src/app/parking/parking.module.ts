import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from "@angular/forms";

import { ParkingRoutingModule } from './parking-routing.module';
import { MaterialModule } from '../material/material.module';

import { IngresoComponent } from './pages/ingreso/ingreso.component';
import { SalidaComponent } from './pages/salida/salida.component';
import { ListadoComponent } from './pages/listado/listado.component';
import { HomeComponent } from './pages/home/home.component';
import { DialogComponent } from './components/dialog/dialog.component';



@NgModule({
  declarations: [
    IngresoComponent,
    SalidaComponent,
    ListadoComponent,
    HomeComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    ParkingRoutingModule,
    MaterialModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    FlexLayoutModule,
    FormsModule
  ],
})
export class ParkingModule { }
