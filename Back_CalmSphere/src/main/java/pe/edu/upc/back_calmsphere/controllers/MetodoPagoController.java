package pe.edu.upc.back_calmsphere.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.back_calmsphere.dtos.MetodoPagoDTO;
import pe.edu.upc.back_calmsphere.dtos.MetodoPagoDTOList;
import pe.edu.upc.back_calmsphere.entities.MetodoPago;
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IMetodoPagoService;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IUsuarioService; // IMPORTANTE

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/metodopago")
public class MetodoPagoController {

    @Autowired
    private IMetodoPagoService cMP;

    @Autowired
    private IUsuarioService uS; // Para buscar al usuario logueado

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @GetMapping
    public ResponseEntity<?> listar() {
        // 1. Obtener usuario del Token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuarioLogueado = uS.listarPorEmail(username);

        if (usuarioLogueado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no identificado");
        }

        // 2. Listar SOLO los métodos de ese usuario
        List<MetodoPago> lista = cMP.listByUserId(usuarioLogueado.getIdUsuario());

        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(List.of()); // Retorna lista vacía en vez de 404
        }

        List<MetodoPagoDTOList> listaDTO = lista.stream()
                .map(c -> new ModelMapper().map(c, MetodoPagoDTOList.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> listarId(@PathVariable("id") int id) {
        MetodoPago c = cMP.listId(id);
        if (c == null || c.getIdMetodoPago() == 0) { // Validación extra si devuelve objeto vacío
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No existe metodo pago con el ID: " + id);
        }
        MetodoPagoDTO dto = new ModelMapper().map(c, MetodoPagoDTO.class);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @PostMapping
    public ResponseEntity<String> insertar(@RequestBody MetodoPagoDTO dto) {
        MetodoPago m = new ModelMapper().map(dto, MetodoPago.class);

        // 1. Asignar usuario logueado automáticamente
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuarioLogueado = uS.listarPorEmail(username);

        m.setUsuario(usuarioLogueado);

        cMP.insert(m);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Método de pago registrado con ID: " + m.getIdMetodoPago());
    }

    @PutMapping
    public ResponseEntity<String> actualizar(@RequestBody MetodoPagoDTO dto) {
        MetodoPago c = new ModelMapper().map(dto, MetodoPago.class);
        MetodoPago existente = cMP.listId(c.getIdMetodoPago());

        if (existente == null || existente.getIdMetodoPago() == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se puede modificar. No existe ID: " + c.getIdMetodoPago());
        }

        // Asegurar que no se pierda el usuario al actualizar
        c.setUsuario(existente.getUsuario());

        cMP.update(c);
        return ResponseEntity.ok("Método de pago actualizado.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable("id") int id) {
        MetodoPago c = cMP.listId(id);
        if (c == null || c.getIdMetodoPago() == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No existe un metodo de pago con el ID: " + id);
        }
        cMP.delete(id);
        return ResponseEntity.ok("Metodo de pago eliminado.");
    }
}