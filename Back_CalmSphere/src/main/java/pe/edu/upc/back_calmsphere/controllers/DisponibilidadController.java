package pe.edu.upc.back_calmsphere.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.back_calmsphere.dtos.DisponibilidadDTOInsert;
import pe.edu.upc.back_calmsphere.dtos.DisponibilidadDTOList;
import pe.edu.upc.back_calmsphere.entities.Disponibilidad;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IDisponibilidadService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/disponibilidades")
public class DisponibilidadController {

    @Autowired
    private IDisponibilidadService dS;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    public ResponseEntity<?> listar() {
        List<Disponibilidad> lista = dS.list();
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron disponibilidades");
        }
        List<DisponibilidadDTOList> listaDTO = lista.stream()
                .map(x -> new ModelMapper().map(x, DisponibilidadDTOList.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> listarId(@PathVariable("id") int id) {
        Disponibilidad d = dS.listId(id);
        if (d == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Disponibilidad no encontrada");
        }
        DisponibilidadDTOList dto = new ModelMapper().map(d, DisponibilidadDTOList.class);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    public ResponseEntity<String> insertar(@RequestBody DisponibilidadDTOInsert dto) {
        Disponibilidad d = new ModelMapper().map(dto, Disponibilidad.class);

        // --- CORRECCIÓN DEFINITIVA ---
        // Al poner NULL, Hibernate sabe que es un INSERT (nuevo) y genera el ID.
        // Si ponemos 0, busca el ID 0 y falla.
        d.setDisponibilidadId(null);

        dS.insert(d);
        return ResponseEntity.ok("Disponibilidad insertada con ID: " + d.getDisponibilidadId());
    }

    @PutMapping
    public ResponseEntity<String> actualizar(@RequestBody DisponibilidadDTOInsert dto) {
        // Lógica segura: Buscamos el original y actualizamos sus campos
        Disponibilidad obj = dS.listId(dto.getDisponibilidadId());

        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Disponibilidad no encontrada");
        }

        // Actualizamos valores
        obj.setDiaSemana(dto.getDiaSemana());
        obj.setHoraInicio(dto.getHoraInicio());
        obj.setHoraFin(dto.getHoraFin());

        // Guardamos
        dS.update(obj);
        return ResponseEntity.ok("Disponibilidad actualizada con ID: " + obj.getDisponibilidadId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable("id") int id) {
        Disponibilidad obj = dS.listId(id);
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Disponibilidad no encontrada");
        }
        dS.delete(id);
        return ResponseEntity.ok("Disponibilidad eliminada con ID: " + id);
    }

    @GetMapping("/busquedas")
    public ResponseEntity<?> buscar(@RequestParam("d") Integer diaSemana) {
        List<Disponibilidad> lista = dS.findByDiaSemana(diaSemana);
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron disponibilidades para el día especificado");
        }
        List<DisponibilidadDTOList> listaDTO = lista.stream()
                .map(x -> new ModelMapper().map(x, DisponibilidadDTOList.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }
}