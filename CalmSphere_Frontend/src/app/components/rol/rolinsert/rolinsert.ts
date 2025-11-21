import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Rol } from '../../../models/rol';
import { Usuario } from '../../../models/usuario';
import { Rolservice } from '../../../services/rolservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-rolinsert',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatSelectModule],
  templateUrl: './rolinsert.html',
  styleUrl: './rolinsert.css',
})
export class Rolinsert implements OnInit {
 form: FormGroup = new FormGroup({});
  rol: Rol = new Rol();
  id: number = 0;
  edicion: boolean = false;

  usuarios: Usuario[] = [];

  tipos = ['ADMIN', 'PACIENTE', 'PROFESIONAL'];

  constructor(
    private rS: Rolservice,
    private uS: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      idRol: [''],
      tipoRol: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });

    this.uS.list().subscribe((data) => {
      this.usuarios = data;
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      const v = this.form.value;

      this.rol.idRol = v.idRol;
      this.rol.tipoRol = v.tipoRol;
      this.rol.idUsuario = new Usuario();
      this.rol.idUsuario.idUsuario = v.idUsuario;

      if (this.edicion) {
        this.rS.update(this.rol).subscribe(() => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
            this.router.navigate(['roles']);
          });
        });
      } else {
        this.rS.insert(this.rol).subscribe(() => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
            this.router.navigate(['roles']);
          });
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idRol: new FormControl(data.idRol),
          tipoRol: new FormControl(data.tipoRol),
          idUsuario: new FormControl(data.idUsuario.idUsuario),
        });
      });
    }
  }
}
