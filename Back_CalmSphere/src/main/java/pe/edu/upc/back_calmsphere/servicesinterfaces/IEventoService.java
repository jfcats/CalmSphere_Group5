package pe.edu.upc.back_calmsphere.servicesinterfaces;

import pe.edu.upc.back_calmsphere.entities.Evento;
import java.time.LocalDateTime;
import java.util.List;

public interface IEventoService {
    public void insert(Evento e);
    public List<Evento> list();
    public Evento listId(int id);
    public void update(Evento e);
    public void delete(int id);

    public List<Evento> findByUsuario(int idUsuario);
    public List<Evento> findByProfesionalServicio(int idProfesionalServicio);
    public List<Evento> findByMetodoPago(int idMetodoPago);

    public List<Object[]> reporteProfesional();
    public List<String[]> reporteMetodoPago();

    public int contarCitasEnHorario(int idDoc, LocalDateTime inicio, LocalDateTime fin);
    public List<Evento> listarSoloMisReservas(int uid);
    public List<Evento> listarSoloMisCitasComoDoctor(int uid);

    // 🚨 AGREGAR ESTO:
    public void marcarComoPagado(int id);
}