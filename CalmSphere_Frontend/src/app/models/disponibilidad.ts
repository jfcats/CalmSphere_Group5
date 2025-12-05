export class Disponibilidad {
  disponibilidadId: number = 0;
  diaSemana: number = 0;      // 1–7
  horaInicio: string = '';    // 'HH:mm'
  horaFin: string = '';       // 'HH:mm'
  idProfesionalServicio: number = 0; // <--- NUEVO: Vincula al servicio
}