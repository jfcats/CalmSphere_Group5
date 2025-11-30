package pe.edu.upc.back_calmsphere.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.back_calmsphere.dtos.ProfesionalServicioDTOList;
// Asegúrate de importar tu DTOInsert si lo tienes en un archivo separado o usa el mismo si es compatible
import pe.edu.upc.back_calmsphere.dtos.ProfesionalServicioDTOInsert;
import pe.edu.upc.back_calmsphere.entities.ProfesionalServicio;
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IProfesionalServicioService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/profesional-servicios")
public class ProfesionalServicioController {

    @Autowired
    private IProfesionalServicioService service;

    // Método auxiliar para convertir a DTO (Ya NO mapea disponibilidad)
    private ProfesionalServicioDTOList toDTO(ProfesionalServicio ps) {
        ProfesionalServicioDTOList dto = new ProfesionalServicioDTOList();
        dto.setIdProfesionalServicio(ps.getIdProfesionalServicio());
        dto.setNombre(ps.getNombre());
        dto.setDuracionMin(ps.getDuracionMin());
        dto.setPrecioBase(ps.getPrecioBase());
        // Ya no mapeamos idDisponibilidad
        dto.setIdUsuario(ps.getUsuario() != null ? ps.getUsuario().getIdUsuario() : 0);
        return dto;
    }

    // Método auxiliar para convertir a Entidad
    private ProfesionalServicio toEntity(ProfesionalServicioDTOInsert dto) {
        ProfesionalServicio ps = new ProfesionalServicio();
        ps.setIdProfesionalServicio(dto.getIdProfesionalServicio());
        ps.setNombre(dto.getNombre());
        ps.setDuracionMin(dto.getDuracionMin());
        ps.setPrecioBase(dto.getPrecioBase());

        Usuario u = new Usuario();
        u.setIdUsuario(dto.getIdUsuario());
        ps.setUsuario(u);

        // Ya no seteamos disponibilidad aquí
        return ps;
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        List<ProfesionalServicio> lista = service.list();
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron servicios");
        }
        List<ProfesionalServicioDTOList> listaDTO = lista.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }

    @PostMapping
    public ResponseEntity<String> insertar(@RequestBody ProfesionalServicioDTOInsert dto) {
        ProfesionalServicio ps = toEntity(dto);
        // Nos aseguramos que el ID sea nulo para crear uno nuevo
        ps.setIdProfesionalServicio(null);
        service.insert(ps);
        return ResponseEntity.status(HttpStatus.CREATED).body("Servicio creado con ID: " + ps.getIdProfesionalServicio());
    }

    // ... Tus métodos PUT y DELETE se mantienen igual, usando toEntity() ...

    @GetMapping("/busquedas")
    public ResponseEntity<?> buscarPorUsuario(@RequestParam("idUsuario") int idUsuario) {
        List<ProfesionalServicio> lista = service.findByUsuario(idUsuario);
        // ... misma lógica ...
        List<ProfesionalServicioDTOList> listaDTO = lista.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }
}