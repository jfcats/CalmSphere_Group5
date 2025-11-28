package pe.edu.upc.back_calmsphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.upc.back_calmsphere.entities.Evento;

import java.util.List;

@Repository
public interface IEventoRepository extends JpaRepository<Evento, Integer> {

    // Tus búsquedas existentes (NO BORRAR)
    @Query("select e from Evento e where e.idUsuario.idUsuario = :idUsuario")
    List<Evento> findByUsuario(@Param("idUsuario") int idUsuario);

    @Query("select e from Evento e where e.profesionalServicio.idProfesionalServicio = :idProfesionalServicio")
    List<Evento> findByProfesionalServicio(@Param("idProfesionalServicio") int idProfesionalServicio);

    @Query("select e from Evento e where e.idMetodoPago.idMetodoPago = :idMetodoPago")
    List<Evento> findByMetodoPago(@Param("idMetodoPago") int idMetodoPago);

    // === NUEVAS CONSULTAS PARA REPORTES ===

    // REPORTE 1: Cantidad de eventos por Profesional
    // Devuelve una lista de arrays: [NombreProfesional, Cantidad]
    @Query(value = "SELECT ps.nombre, COUNT(e.id_evento) " +
            "FROM evento e " +
            "JOIN profesional_servicio ps ON e.id_profesional_servicio = ps.id_profesional_servicio " +
            "GROUP BY ps.nombre", nativeQuery = true)
    public List<String[]> reporteEventosPorProfesional();

    // REPORTE 2: Cantidad de eventos por Método de Pago
    // Devuelve una lista de arrays: [NombreMetodoPago, Cantidad]
    @Query(value = "SELECT mp.nombre, COUNT(e.id_evento) " +
            "FROM evento e " +
            "JOIN metodo_pago mp ON e.id_metodo_pago = mp.id_metodo_pago " +
            "GROUP BY mp.nombre", nativeQuery = true)
    public List<String[]> reporteEventosPorMetodoPago();
}