package pe.edu.upc.back_calmsphere.controllers;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.param.ChargeCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.back_calmsphere.dtos.EventoDTOInsert;
import pe.edu.upc.back_calmsphere.dtos.EventoDTOList;
import pe.edu.upc.back_calmsphere.dtos.ReporteDTO;
import pe.edu.upc.back_calmsphere.entities.Evento;
import pe.edu.upc.back_calmsphere.entities.MetodoPago;
import pe.edu.upc.back_calmsphere.entities.ProfesionalServicio;
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.repositories.IEventoRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IEventoService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDateTime; // Asegúrate de tener este import
import java.time.format.DateTimeFormatter; // Y este

@RestController
@RequestMapping("/eventos")
public class EventoController {

    @Autowired
    private IEventoService service;

    @Autowired
    private IEventoRepository repo; // Repositorio para validaciones directas

    // === CONFIGURACIÓN STRIPE ===
    // NOTA: Idealmente esto iría en application.properties, pero para dev está bien aquí.
    private String STRIPE_API_KEY = "sk_test_51SZbSORxQ8RAFGuoDIxgNHhc0oATsTUHeNPEkatQxYAajARDaHeeGOnKcZ7IwepAabTtjYlIB341hFuM7WKZsM3f001OoTy4R9";

    // Método auxiliar: Convierte de Entidad a DTO (Para Listar)
    private EventoDTOList toDTO(Evento e){
        EventoDTOList dto = new EventoDTOList();
        dto.setIdEvento(e.getIdEvento());

        // ... (Ids igual que antes) ...
        dto.setIdUsuario(e.getIdUsuario() != null ? e.getIdUsuario().getIdUsuario() : 0);
        dto.setIdProfesionalServicio(e.getProfesionalServicio() != null ? e.getProfesionalServicio().getIdProfesionalServicio() : 0);
        dto.setIdMetodoPago(e.getIdMetodoPago() != null ? e.getIdMetodoPago().getIdMetodoPago() : 0);

        // NOMBRES (Aquí está la corrección)
        if (e.getIdUsuario() != null) {
            // Nombre del PACIENTE
            dto.setNombreUsuario(e.getIdUsuario().getNombre() + " " + e.getIdUsuario().getApellido());
        }

        if (e.getProfesionalServicio() != null) {
            // ANTES: dto.setNombreProfesional(e.getProfesionalServicio().getNombre()); // <-- Esto traía "Consulta Psicológica"

            // AHORA: Accedemos al Usuario dentro del ProfesionalServicio
            Usuario doctor = e.getProfesionalServicio().getUsuario();
            if (doctor != null) {
                dto.setNombreProfesional(doctor.getNombre() + " " + doctor.getApellido());
            } else {
                dto.setNombreProfesional("Sin asignar");
            }
        }

        if (e.getIdMetodoPago() != null) dto.setNombreMetodoPago(e.getIdMetodoPago().getNombre());

        dto.setInicio(e.getInicio());
        dto.setFin(e.getFin());
        dto.setEstado(e.isEstado());
        dto.setMotivo(e.getMotivo());
        dto.setMonto(e.getMonto());
        return dto;
    }

    // Método auxiliar: Convierte de DTO a Entidad (Para Insertar)
    // ESTA ES LA PARTE CLAVE CORREGIDA PARA EL ERROR 400
    private Evento toEntity(EventoDTOInsert dto) {
        Evento e = new Evento();
        e.setIdEvento(dto.getIdEvento());

        // Construcción segura
        Usuario u = new Usuario();
        u.setIdUsuario(dto.getIdUsuario());
        e.setIdUsuario(u);

        ProfesionalServicio ps = new ProfesionalServicio();
        ps.setIdProfesionalServicio(dto.getIdProfesionalServicio());
        e.setProfesionalServicio(ps);

        MetodoPago mp = new MetodoPago();
        mp.setIdMetodoPago(dto.getIdMetodoPago());
        e.setIdMetodoPago(mp);

        // Conversión de Texto a Fecha y Double
        e.setInicio(LocalDateTime.parse(dto.getInicio()));
        e.setFin(LocalDateTime.parse(dto.getFin()));
        e.setMonto(Double.parseDouble(dto.getMonto()));

        e.setEstado(dto.isEstado());
        e.setMotivo(dto.getMotivo());
        return e;
    }

    @GetMapping
    public ResponseEntity<?> listar(){
        List<Evento> lista = service.list();
        if(lista.isEmpty()) return ResponseEntity.ok(new ArrayList<>());

        List<EventoDTOList> listaDTO = lista.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(listaDTO);
    }

    // === INSERTAR CON VALIDACIÓN Y PAGO STRIPE ===
    @PostMapping
    public ResponseEntity<?> insertar(@RequestBody EventoDTOInsert dto) {
        try {
            System.out.println("Backend recibió usuario ID: " + dto.getIdUsuario()); // LOG DE DEPURACIÓN

            // Conversión temporal para validación
            LocalDateTime inicio = LocalDateTime.parse(dto.getInicio());
            LocalDateTime fin = LocalDateTime.parse(dto.getFin());

            int cruces = repo.contarCitasEnHorario(dto.getIdProfesionalServicio(), inicio, fin);
            if (cruces > 0) return ResponseEntity.badRequest().body("Horario ocupado");

            // ... (Lógica Stripe aquí) ...

            Evento e = toEntity(dto);
            e.setEstado(true);
            service.insert(e);
            return ResponseEntity.ok("Cita reservada.");

        } catch (Exception ex) {
            ex.printStackTrace(); // Ver error real en consola Java
            return ResponseEntity.internalServerError().body("Error: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> listarId(@PathVariable("id") int id){
        Evento e = service.listId(id);
        if(e==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe ID: "+id);
        return ResponseEntity.ok(toDTO(e));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable("id") int id){
        service.delete(id);
        return ResponseEntity.ok("Eliminado");
    }

    // --- REPORTES ---

    @GetMapping("/reporte-profesional")
    public List<ReporteDTO> obtenerReporteProfesional() {
        List<String[]> fila = service.reporteProfesional();
        List<ReporteDTO> dtoLista = new ArrayList<>();
        for (String[] columna : fila) {
            ReporteDTO dto = new ReporteDTO();
            dto.setNombre(columna[0]);
            dto.setCantidad(Integer.parseInt(columna[1]));
            dtoLista.add(dto);
        }
        return dtoLista;
    }

    @GetMapping("/reporte-pagos")
    public List<ReporteDTO> obtenerReportePagos() {
        List<String[]> fila = service.reporteMetodoPago();
        List<ReporteDTO> dtoLista = new ArrayList<>();
        for (String[] columna : fila) {
            ReporteDTO dto = new ReporteDTO();
            dto.setNombre(columna[0]);
            dto.setCantidad(Integer.parseInt(columna[1]));
            dtoLista.add(dto);
        }
        return dtoLista;
    }
}