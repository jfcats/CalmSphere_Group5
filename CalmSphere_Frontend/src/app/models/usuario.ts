import { Rol } from "./rol";

export class Usuario {
  idUsuario: number = 0;
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  contraseña: string = ''; 
  fechaNacimiento: string = '';
  fechaRegistro: string = '';
  roles: Rol[] = [];
}
