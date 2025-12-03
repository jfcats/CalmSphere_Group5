package pe.edu.upc.back_calmsphere.controllers;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.param.ChargeCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pe.edu.upc.back_calmsphere.dtos.EventoDTOInsert;
import pe.edu.upc.back_calmsphere.dtos.EventoDTOList;
import pe.edu.upc.back_calmsphere.dtos.ReporteDTO;
import pe.edu.upc.back_calmsphere.entities.Evento;
import pe.edu.upc.back_calmsphere.entities.MetodoPago;
import pe.edu.upc.back_calmsphere.entities.ProfesionalServicio;
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IEventoService;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IUsuarioService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/eventos")
public class EventoController {

    @Autowired
    private IEventoService service;

    @Autowired
    private IUsuarioService usuarioService;

    private String STRIPE_API_KEY = "sk_test_51SZbSORxQ8RAFGuoDIxgNHhc0oATsTUHeNPEkatQxYAajARDaHeeGOnKcZ7IwepAabTtjYlIB341hFuM7WKZsM3f001OoTy4R9";

    // --- CONVERSORES ---
    private EventoDTOList toDTOList(Evento e){
        EventoDTOList dto = new EventoDTOList();
        dto.setIdEvento(e.getIdEvento());
        dto.setIdUsuario(e.getIdUsuario() != null ? e.getIdUsuario().getIdUsuario() : 0);
        dto.setIdProfesionalServicio(e.getProfesionalServicio() != null ? e.getProfesionalServicio().getIdProfesionalServicio() : 0);
        dto.setIdMetodoPago(e.getIdMetodoPago() != null ? e.getIdMetodoPago().getIdMetodoPago() : 0);

        if (e.getIdUsuario() != null) {
            dto.setNombreUsuario(e.getIdUsuario().getNombre() + " " + e.getIdUsuario().getApellido());
        }
        if (e.getProfesionalServicio() != null) {
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
        dto.setPagado(e.isPagado());
        dto.setMotivo(e.getMotivo());
        dto.setMonto(e.getMonto());
        return dto;
    }

    private EventoDTOInsert toDTOInsert(Evento e) {
        EventoDTOInsert dto = new EventoDTOInsert();
        dto.setIdEvento(e.getIdEvento());
        if (e.getIdUsuario() != null) dto.setIdUsuario(e.getIdUsuario().getIdUsuario());
        if (e.getProfesionalServicio() != null) dto.setIdProfesionalServicio(e.getProfesionalServicio().getIdProfesionalServicio());
        if (e.getIdMetodoPago() != null) dto.setIdMetodoPago(e.getIdMetodoPago().getIdMetodoPago());
        dto.setInicio(e.getInicio().toString());
        dto.setFin(e.getFin().toString());
        dto.setMonto(String.valueOf(e.getMonto()));
        dto.setEstado(e.isEstado());
        dto.setPagado(e.isPagado());
        dto.setMotivo(e.getMotivo());
        return dto;
    }

    private Evento toEntity(EventoDTOInsert dto) {
        Evento e = new Evento();
        e.setIdEvento(dto.getIdEvento());
        Usuario u = new Usuario(); u.setIdUsuario(dto.getIdUsuario());
        e.setIdUsuario(u);
        ProfesionalServicio ps = new ProfesionalServicio(); ps.setIdProfesionalServicio(dto.getIdProfesionalServicio());
        e.setProfesionalServicio(ps);
        MetodoPago mp = new MetodoPago(); mp.setIdMetodoPago(dto.getIdMetodoPago());
        e.setIdMetodoPago(mp);
        e.setInicio(LocalDateTime.parse(dto.getInicio()));
        e.setFin(LocalDateTime.parse(dto.getFin()));
        e.setMonto(Double.parseDouble(dto.getMonto()));
        e.setEstado(dto.isEstado());
        e.setPagado(dto.isPagado());
        e.setMotivo(dto.getMotivo());
        return e;
    }

    @GetMapping
    public ResponseEntity<?> listar(){
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            Usuario usuarioLogueado = usuarioService.listarPorEmail(username);

            if (usuarioLogueado == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");

            String rol = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst().orElse("PACIENTE");

            List<Evento> lista;

            if (rol.equals("ADMIN")) {
                lista = service.list();
            } else if (rol.equals("PROFESIONAL")) {
                lista = service.listarSoloMisCitasComoDoctor(usuarioLogueado.getIdUsuario());
            } else {
                lista = service.listarSoloMisReservas(usuarioLogueado.getIdUsuario());
            }

            List<EventoDTOList> listaDTO = lista.stream().map(this::toDTOList).collect(Collectors.toList());
            return ResponseEntity.ok(listaDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> insertar(@RequestBody EventoDTOInsert dto) {
        try {
            LocalDateTime inicio = LocalDateTime.parse(dto.getInicio());
            LocalDateTime fin = LocalDateTime.parse(dto.getFin());

            int cruces = service.contarCitasEnHorario(dto.getIdProfesionalServicio(), inicio, fin);
            if (cruces > 0) return ResponseEntity.badRequest().body("Horario ocupado");

            boolean pagoRealizado = false;

            if (dto.getTokenPago() != null && !dto.getTokenPago().isEmpty()) {
                Stripe.apiKey = STRIPE_API_KEY;
                long montoCentavos = (long) (Double.parseDouble(dto.getMonto()) * 100);
                ChargeCreateParams params = ChargeCreateParams.builder()
                        .setAmount(montoCentavos)
                        .setCurrency("pen")
                        .setDescription("Cita Médica - " + dto.getMotivo())
                        .setSource(dto.getTokenPago())
                        .build();
                Charge.create(params);
                pagoRealizado = true;
            }

            Evento e = toEntity(dto);
            e.setEstado(true);
            if (pagoRealizado) e.setPagado(true);

            service.insert(e);
            return ResponseEntity.status(HttpStatus.CREATED).body("Cita reservada.");

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> modificar(@RequestBody EventoDTOInsert dto) {
        try {
            Evento eventoOriginal = service.listId(dto.getIdEvento());
            if (eventoOriginal == null) return ResponseEntity.notFound().build();
            eventoOriginal.setMotivo(dto.getMotivo());
            service.update(eventoOriginal);
            return ResponseEntity.ok("Cita actualizada (solo motivo).");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar");
        }
    }

    @PostMapping("/pagar/{id}")
    public ResponseEntity<?> pagarCita(@PathVariable("id") int id, @RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            if (token == null || token.isEmpty()) return ResponseEntity.badRequest().body("Falta el token de pago");

            Evento evento = service.listId(id);
            if (evento == null) return ResponseEntity.notFound().build();
            if (evento.isPagado()) return ResponseEntity.badRequest().body("Esta cita ya está pagada");

            Stripe.apiKey = STRIPE_API_KEY;
            long montoCentavos = (long) (evento.getMonto() * 100);

            ChargeCreateParams params = ChargeCreateParams.builder()
                    .setAmount(montoCentavos)
                    .setCurrency("pen")
                    .setDescription("Pago de Cita #" + id + " - " + evento.getMotivo())
                    .setSource(token)
                    .build();
            Charge charge = Charge.create(params);

            // 🚨 ACTUALIZACIÓN FORZADA EN BD 🚨
            service.marcarComoPagado(id);

            return ResponseEntity.ok("Pago registrado exitosamente. ID Transacción: " + charge.getId());

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body("Error Stripe: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> listarId(@PathVariable("id") int id){
        Evento e = service.listId(id);
        if(e==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe ID: "+id);
        return ResponseEntity.ok(toDTOInsert(e));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable("id") int id){
        service.delete(id);
        return ResponseEntity.ok("Eliminado");
    }

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