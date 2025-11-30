package pe.edu.upc.back_calmsphere.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.back_calmsphere.dtos.DisponibilidadDTOInsert;
import pe.edu.upc.back_calmsphere.dtos.DisponibilidadDTOList; // Asumo que este lo tienes
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
        if (lista.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vacío");

        List<DisponibilidadDTOList> listaDTO = lista.stream().map(d -> {
            ModelMapper m = new ModelMapper();
            return m.map(d, DisponibilidadDTOList.class);
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

        // CAMBIO CRÍTICO: Vincular manualmente el Servicio
        ProfesionalServicio ps = new ProfesionalServicio();
        ps.setIdProfesionalServicio(dto.getIdProfesionalServicio());
        d.setProfesionalServicio(ps);

        dS.insert(d);
        return ResponseEntity.ok("Disponibilidad creada para el servicio ID: " + dto.getIdProfesionalServicio());
    }

    // --- Nuevo Endpoint Útil: Ver horarios de un doctor específico ---
    @GetMapping("/por-servicio/{idServicio}")
    public ResponseEntity<?> listarPorServicio(@PathVariable("idServicio") int idServicio) {
        // Nota: Necesitarás crear este método 'findByProfesionalServicioId' en tu Service/Repository
        // Si no lo tienes, podemos agregarlo después.
        /* List<Disponibilidad> lista = dS.findByProfesionalServicioId(idServicio);
        ... mapear y retornar ...
        */
        return ResponseEntity.ok("Pendiente de implementar en Service");
    }

    // PUT y DELETE se mantienen similares, solo asegúrate de no perder la relación en el PUT.
}