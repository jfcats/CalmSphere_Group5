package pe.edu.upc.back_calmsphere.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.back_calmsphere.dtos.UsuarioDTOInsert;
import pe.edu.upc.back_calmsphere.dtos.UsuarioDTOList;
import pe.edu.upc.back_calmsphere.dtos.UsuarioEventoEstresDTO;
import pe.edu.upc.back_calmsphere.entities.Usuario;
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
    //@PreAuthorize("hasAuthority('ADMIN')") // Comentado para registro público
    public ResponseEntity<String> insertar(@RequestBody UsuarioDTOInsert dto) {
        if (dto.getNombre() == null || dto.getApellido() == null || dto.getEmail() == null || dto.getContraseña() == null || dto.getFechaNacimiento() == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Por favor, complete todos los campos de forma válida.");
        }

        ModelMapper m = new ModelMapper();
        Usuario u = m.map(dto, Usuario.class);

        // --- CORRECCIÓN CLAVE ---
        // Al ser Integer, podemos asignar NULL.
        // Esto garantiza 100% que Hibernate lo trate como INSERT y no busque ID 0.
        u.setIdUsuario(null);

        service.insert(u);
        return ResponseEntity.ok("El usuario fue registrado correctamente");
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

        // Para modificar, buscamos el original por ID
        Usuario existente = service.listId(dto.getIdUsuario()); // Usamos el getter del DTO que devuelve int

        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se puede modificar. No existe un usuario con el ID: " + dto.getIdUsuario());
        }

        // Actualizamos campos manualmente o con map, pero sobre el ID existente
        ModelMapper m = new ModelMapper();
        // Mapeamos el DTO al objeto Usuario (esto crea uno nuevo o sobreescribe)
        Usuario u = m.map(dto, Usuario.class);

        // Aseguramos que el ID sea el correcto (aunque el DTO ya lo traiga)
        u.setIdUsuario(existente.getIdUsuario());

        // Mantenemos roles antiguos si el DTO no los trae (opcional)
        u.setRoles(existente.getRoles());

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
}