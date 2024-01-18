export interface Vehiculo {
  id?:      string;
  tipo:     string;
  placa:    string;
  fec_ing:  Date;
  fec_sal?: Date;
  tie_tot?: number;
  val_pag?: number;
  estado:   string;
}
