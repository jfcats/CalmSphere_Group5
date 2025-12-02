package pe.edu.upc.back_calmsphere.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder; // IMPORTANTE
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.back_calmsphere.dtos.UsuarioDTOInsert;
import pe.edu.upc.back_calmsphere.dtos.UsuarioDTOList;
import pe.edu.upc.back_calmsphere.dtos.UsuarioEventoEstresDTO;
import pe.edu.upc.back_calmsphere.entities.Rol; // IMPORTANTE
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IRolService; // IMPORTANTE
import pe.edu.upc.back_calmsphere.servicesinterfaces.IUsuarioService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private IUsuarioService service;

    @Autowired
    private IRolService rolService; // <--- AGREGADO: Para asignar rol

    @Autowired
    private PasswordEncoder passwordEncoder; // <--- AGREGADO: Para encriptar password

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> listar() {
        List<Usuario> usuarios = service.list();

        if (usuarios.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontraron usuarios");
        }

        List<UsuarioDTOList> listaDTO = usuarios.stream().map(u->{
            ModelMapper m = new ModelMapper();
            return m.map(u, UsuarioDTOList.class);
        }).collect(Collectors.toList());

        return ResponseEntity.ok(listaDTO);
    }

    @PostMapping
    public ResponseEntity<String> insertar(@RequestBody UsuarioDTOInsert dto) {
        // ... validaciones ...
        ModelMapper m = new ModelMapper();
        Usuario u = m.map(dto, Usuario.class);

        u.setIdUsuario(null);
        u.setFechaRegistro(LocalDate.now());

        // --- ESTA LÍNEA ES LA QUE ARREGLA EL LOGIN ---
        u.setContraseña(passwordEncoder.encode(u.getContraseña()));
        // ---------------------------------------------

        service.insert(u);

        // --- ESTO ASIGNA EL ROL ---
        Rol rolPaciente = new Rol();
        rolPaciente.setTipoRol("PACIENTE");
        rolPaciente.setUsuario(u);
        rolService.insert(rolPaciente);

        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> listarId(@PathVariable("id") Integer id) {
        Usuario u = service.listId(id);
        if (u == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No existe un usuario con el ID: " + id);
        }
        ModelMapper m = new ModelMapper();
        UsuarioDTOList dto = m.map(u, UsuarioDTOList.class);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> eliminar(@PathVariable("id") Integer id) {
        Usuario u = service.listId(id);
        if (u == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No existe un usuario con el ID: " + id);
        }
        service.delete(id);
        return ResponseEntity.ok("El usuario con ID " + id + " fue eliminado correctamente.");
    }

    @PutMapping
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> modificar(@RequestBody UsuarioDTOInsert dto) {
        if (dto.getNombre() == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos inválidos");
        }

        Usuario existente = service.listId(dto.getIdUsuario());

        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se puede modificar. No existe un usuario con el ID: " + dto.getIdUsuario());
        }

        ModelMapper m = new ModelMapper();
        Usuario u = m.map(dto, Usuario.class);

        u.setIdUsuario(existente.getIdUsuario());

        // Mantenemos datos sensibles del original
        u.setFechaRegistro(existente.getFechaRegistro());
        u.setRoles(existente.getRoles());

        // Solo encriptamos si la contraseña cambió (esto es una simplificación)
        // Lo ideal es validar si dto.password es diferente a existente.password
        if(!u.getContraseña().equals(existente.getContraseña())){
            u.setContraseña(passwordEncoder.encode(u.getContraseña()));
        }

        service.update(u);
        return ResponseEntity.ok("El usuario con ID " + u.getIdUsuario() + " fue modificado correctamente.");
    }

    @GetMapping("/busquedas")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> buscar(@RequestParam String n) {
        List<Usuario> usuarios = service.buscarNombre(n);
        if (usuarios.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron usuarios");
        }
        List<UsuarioDTOList> listaDTO = usuarios.stream().map(x -> new ModelMapper().map(x, UsuarioDTOList.class)).collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }

    @GetMapping("/busquedasEventoEstres")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> buscarEventoEstres() {
        List<String[]> usuarios = service.buscarEventoEstresPorUsuario();
        List<UsuarioEventoEstresDTO> listarPorEventoEstres = new ArrayList<>();
        if (usuarios.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron eventos.");
        }
        for(String[] columna:usuarios){
            UsuarioEventoEstresDTO dto = new UsuarioEventoEstresDTO();
            dto.setNombre_Usuario(columna[0]);
            dto.setId_EventoEstres(Integer.parseInt(columna[1]));
            dto.setDescripcion(columna[2]);
            dto.setFecha(LocalDate.parse(columna[3]));
            dto.setNivelEstres(Integer.parseInt(columna[4]));
            listarPorEventoEstres.add(dto);
        }
        return ResponseEntity.ok(listarPorEventoEstres);
    }

    @GetMapping("/buscarPorEmail/{email}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROFESIONAL', 'PACIENTE')")
    public ResponseEntity<?> buscarPorEmail(@PathVariable("email") String email) {
        Usuario u = service.listarPorEmail(email);
        if (u == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
        return ResponseEntity.ok(u);
    }
}