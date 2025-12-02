package pe.edu.upc.back_calmsphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.upc.back_calmsphere.entities.Evento;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IEventoRepository extends JpaRepository<Evento, Integer> {

    @Query("select e from Evento e where e.idUsuario.idUsuario = :idUsuario")
    List<Evento> findByUsuario(@Param("idUsuario") int idUsuario);

    @Query("select e from Evento e where e.profesionalServicio.idProfesionalServicio = :idProfesionalServicio")
    List<Evento> findByProfesionalServicio(@Param("idProfesionalServicio") int idProfesionalServicio);

    @Query("select e from Evento e where e.idMetodoPago.idMetodoPago = :idMetodoPago")
    List<Evento> findByMetodoPago(@Param("idMetodoPago") int idMetodoPago);

    // REPORTES
    @Query(value = "SELECT ps.nombre, COUNT(e.id_evento) " +
            "FROM evento e " +
            "JOIN profesional_servicio ps ON e.id_profesional_servicio = ps.id_profesional_servicio " +
            "GROUP BY ps.nombre", nativeQuery = true)
    public List<String[]> reporteEventosPorProfesional();

    @Query(value = "SELECT mp.nombre, COUNT(e.id_evento) " +
            "FROM evento e " +
            "JOIN metodo_pago mp ON e.id_metodo_pago = mp.id_metodo_pago " +
            "GROUP BY mp.nombre", nativeQuery = true)
    public List<String[]> reporteEventosPorMetodoPago();

    // === VALIDACIÓN DE CRUCE DE HORARIOS ===
    // Cuenta cuántas citas existen del MISMO doctor que se solapen con el nuevo horario
    @Query("SELECT COUNT(e) FROM Evento e WHERE e.profesionalServicio.idProfesionalServicio = :idDoc " +
            "AND e.estado = true " +
            "AND ((e.inicio < :fin) AND (e.fin > :inicio))")
    int contarCitasEnHorario(@Param("idDoc") int idDoc,
                             @Param("inicio") LocalDateTime inicio,
                             @Param("fin") LocalDateTime fin);
}