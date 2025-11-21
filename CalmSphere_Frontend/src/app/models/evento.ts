export class Evento {
  idEvento: number = 0;
  idUsuario: number = 0;
  idProfesionalServicio: number = 0;
  idMetodoPago: number = 0;
  inicio: string = ''; // formato 'YYYY-MM-DDTHH:mm'
  fin: string = '';
  estado: boolean = true;
  motivo: string = '';
  monto: number = 0;
}
