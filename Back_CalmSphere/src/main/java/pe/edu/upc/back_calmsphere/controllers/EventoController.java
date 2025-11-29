package pe.edu.upc.back_calmsphere.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.back_calmsphere.dtos.EventoDTOInsert;
import pe.edu.upc.back_calmsphere.dtos.EventoDTOList;
import pe.edu.upc.back_calmsphere.dtos.ReporteDTO; // <--- IMPORTANTE: DTO DE REPORTE
import pe.edu.upc.back_calmsphere.entities.Evento;
import pe.edu.upc.back_calmsphere.entities.MetodoPago;
import pe.edu.upc.back_calmsphere.entities.ProfesionalServicio;
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IEventoService;

import java.util.ArrayList; // <--- IMPORTANTE
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/eventos")
public class EventoController {
    @Autowired
    private IEventoService service;

    private EventoDTOList toDTO(Evento e){
        EventoDTOList dto = new EventoDTOList();
        dto.setIdEvento(e.getIdEvento());

        // Mapeo de IDs
        dto.setIdUsuario(e.getIdUsuario()!=null? e.getIdUsuario().getIdUsuario():0);
        dto.setIdProfesionalServicio(e.getProfesionalServicio()!=null? e.getProfesionalServicio().getIdProfesionalServicio():0);
        dto.setIdMetodoPago(e.getIdMetodoPago()!=null? e.getIdMetodoPago().getIdMetodoPago():0);

        // --- NUEVO: Mapeo de Nombres ---
        // Validamos null para evitar NullPointerException
        if (e.getIdUsuario() != null) {
            dto.setNombreUsuario(e.getIdUsuario().getNombre() + " " + e.getIdUsuario().getApellido());
        }
        if (e.getProfesionalServicio() != null) {
            dto.setNombreProfesional(e.getProfesionalServicio().getNombre());
        }
        if (e.getIdMetodoPago() != null) {
            dto.setNombreMetodoPago(e.getIdMetodoPago().getNombre());
        }

        dto.setInicio(e.getInicio());
        dto.setFin(e.getFin());
        dto.setEstado(e.isEstado());
        dto.setMotivo(e.getMotivo());
        dto.setMonto(e.getMonto());
        return dto;
    }

    private Evento toEntity(EventoDTOInsert dto){
        Evento e = new Evento();
        e.setIdEvento(dto.getIdEvento());
        Usuario u = new Usuario();
        u.setIdUsuario(dto.getIdUsuario().getIdUsuario());
        ProfesionalServicio ps = new ProfesionalServicio();
        ps.setIdProfesionalServicio(dto.getIdProfesionalServicio().getIdProfesionalServicio());
        MetodoPago mp = new MetodoPago();
        mp.setIdMetodoPago(dto.getIdMetodoPago().getIdMetodoPago());
        e.setIdUsuario(u);
        e.setProfesionalServicio(ps);
        e.setIdMetodoPago(mp);
        e.setInicio(dto.getInicio());
        e.setFin(dto.getFin());
        e.setEstado(dto.isEstado());
        e.setMotivo(dto.getMotivo());
        e.setMonto(dto.getMonto());
        return e;
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @GetMapping
    public ResponseEntity<?> listar(){
        List<Evento> lista = service.list();
        if(lista.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron eventos");
        }
        List<EventoDTOList> listaDTO = lista.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }

    //@PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @GetMapping("/{id}")
    public ResponseEntity<?> listarId(@PathVariable("id") int id){
        Evento e = service.listId(id);
        if(e==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe un evento con ID: "+id);
        }
        return ResponseEntity.ok(toDTO(e));
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @PostMapping
    public ResponseEntity<String> insertar(@RequestBody EventoDTOInsert dto){
        Evento e = toEntity(dto);
        service.insert(e);
        return ResponseEntity.status(HttpStatus.CREATED).body("Evento creado con ID: "+e.getIdEvento());
    }

    // @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @PutMapping
    public ResponseEntity<String> actualizar(@RequestBody EventoDTOInsert dto){
        Evento e = toEntity(dto);
        Evento existente = service.listId(e.getIdEvento());
        if(existente==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se puede modificar. No existe con ID: "+e.getIdEvento());
        }
        service.update(e);
        return ResponseEntity.ok("Evento actualizado con ID: "+e.getIdEvento());
    }

    //@PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable("id") int id){
        Evento e = service.listId(id);
        if(e==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe un evento con ID: "+id);
        }
        service.delete(id);
        return ResponseEntity.ok("Evento eliminado con ID: "+id);
    }

    //@PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @GetMapping("/busquedas/usuario")
    public ResponseEntity<?> buscarPorUsuario(@RequestParam("idUsuario") int idUsuario){
        List<Evento> lista = service.findByUsuario(idUsuario);
        if(lista.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron eventos para el usuario ID: "+idUsuario);
        }
        List<EventoDTOList> listaDTO = lista.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }

    //@PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @GetMapping("/busquedas/profesional")
    public ResponseEntity<?> buscarPorProfesional(@RequestParam("idProfesionalServicio") int idProfesionalServicio){
        List<Evento> lista = service.findByProfesionalServicio(idProfesionalServicio);
        if(lista.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron eventos para el profesional-servicio ID: "+idProfesionalServicio);
        }
        List<EventoDTOList> listaDTO = lista.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }

    //@PreAuthorize("hasAuthority('ADMIN') || hasAuthority('PROFESIONAL') || hasAuthority('PACIENTE')")
    @GetMapping("/busquedas/metodo-pago")
    public ResponseEntity<?> buscarPorMetodoPago(@RequestParam("idMetodoPago") int idMetodoPago){
        List<Evento> lista = service.findByMetodoPago(idMetodoPago);
        if(lista.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron eventos para el método de pago ID: "+idMetodoPago);
        }
        List<EventoDTOList> listaDTO = lista.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }

    // =================================================================
    // MÉTODOS DE REPORTE (NUEVOS)
    // =================================================================

    // REPORTE 1: Gráfico de Barras (Eventos por Profesional)
    @GetMapping("/reporte-profesional")
    @PreAuthorize("hasAuthority('ADMIN')") // Descomenta si solo ADMIN puede ver reportes
    public List<ReporteDTO> obtenerReporteProfesional() {
        List<String[]> fila = service.reporteProfesional();
        List<ReporteDTO> dtoLista = new ArrayList<>();

        for (String[] columna : fila) {
            ReporteDTO dto = new ReporteDTO();
            dto.setNombre(columna[0]); // Nombre del Profesional
            dto.setCantidad(Integer.parseInt(columna[1])); // Cantidad
            dtoLista.add(dto);
        }
        return dtoLista;
    }

    // REPORTE 2: Gráfico Circular (Eventos por Método de Pago)
    @GetMapping("/reporte-pagos")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<ReporteDTO> obtenerReportePagos() {
        List<String[]> fila = service.reporteMetodoPago();
        List<ReporteDTO> dtoLista = new ArrayList<>();

        for (String[] columna : fila) {
            ReporteDTO dto = new ReporteDTO();
            dto.setNombre(columna[0]); // Nombre del Método de Pago
            dto.setCantidad(Integer.parseInt(columna[1])); // Cantidad
            dtoLista.add(dto);
        }
        return dtoLista;
    }
}