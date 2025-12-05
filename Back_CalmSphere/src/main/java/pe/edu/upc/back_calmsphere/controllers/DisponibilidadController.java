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
import pe.edu.upc.back_calmsphere.entities.ProfesionalServicio;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IDisponibilidadService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/disponibilidades")
public class DisponibilidadController {

    @Autowired
    private IDisponibilidadService dS;

    @GetMapping
    public ResponseEntity<?> listar() {
        List<Disponibilidad> lista = dS.list();

        List<DisponibilidadDTOList> listaDTO = lista.stream().map(d -> {
            ModelMapper m = new ModelMapper();
            DisponibilidadDTOList dto = m.map(d, DisponibilidadDTOList.class);

            // --- CORRECCIÓN CRÍTICA ---
            // ModelMapper a veces falla si los nombres no son idénticos.
            // Forzamos el ID manualmente para asegurar que llegue al frontend.
            if(d.getProfesionalServicio() != null) {
                dto.setIdProfesionalServicio(d.getProfesionalServicio().getIdProfesionalServicio());
            }
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(listaDTO);
    }

    @PostMapping
    public ResponseEntity<String> insertar(@RequestBody DisponibilidadDTOInsert dto) {
        // Validamos que venga el ID del servicio
        if (dto.getIdProfesionalServicio() == 0) {
            return ResponseEntity.badRequest().body("Debe indicar el ID del ProfesionalServicio");
        }

        ModelMapper m = new ModelMapper();
        Disponibilidad d = m.map(dto, Disponibilidad.class);
        d.setDisponibilidadId(null); // ID Nulo para insertar

        // Vincular manualmente el Servicio
        ProfesionalServicio ps = new ProfesionalServicio();
        ps.setIdProfesionalServicio(dto.getIdProfesionalServicio());
        d.setProfesionalServicio(ps);

        dS.insert(d);
        return ResponseEntity.ok("Disponibilidad creada para el servicio ID: " + dto.getIdProfesionalServicio());
    }

    // ... Resto de métodos (GET por ID, PUT, DELETE) si los tienes ...
    @GetMapping("/{id}")
    public ResponseEntity<?> listarId(@PathVariable("id") int id) {
        Disponibilidad d = dS.listId(id);
        if (d == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No encontrado");
        return ResponseEntity.ok(new ModelMapper().map(d, DisponibilidadDTOList.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable("id") int id) {
        dS.delete(id);
        return ResponseEntity.ok("Eliminado");
    }

    @PutMapping
    public ResponseEntity<String> actualizar(@RequestBody DisponibilidadDTOInsert dto) {
        // Lógica de update...
        Disponibilidad d = new ModelMapper().map(dto, Disponibilidad.class);
        // Importante no perder la relación con el servicio aquí
        ProfesionalServicio ps = new ProfesionalServicio();
        ps.setIdProfesionalServicio(dto.getIdProfesionalServicio());
        d.setProfesionalServicio(ps);

        dS.update(d);
        return ResponseEntity.ok("Actualizado");
    }
}