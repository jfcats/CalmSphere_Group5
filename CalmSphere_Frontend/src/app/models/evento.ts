export class Evento {
  idEvento: number = 0;
  idUsuario: number = 0;
  idProfesionalServicio: number = 0;
  idMetodoPago: number = 0;
  inicio: string = ''; 
  fin: string = '';
  estado: boolean = true;
  pagado: boolean = false; 
  motivo: string = '';
  monto: number = 0;
}