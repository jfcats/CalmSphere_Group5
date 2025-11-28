package pe.edu.upc.back_calmsphere.servicesinterfaces;

import pe.edu.upc.back_calmsphere.entities.Evento;
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

    // === MÉTODOS DE REPORTE ===
    public List<String[]> reporteProfesional();
    public List<String[]> reporteMetodoPago();
}