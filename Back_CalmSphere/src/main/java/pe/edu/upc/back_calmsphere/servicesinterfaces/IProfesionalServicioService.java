package pe.edu.upc.back_calmsphere.servicesinterfaces;

import pe.edu.upc.back_calmsphere.entities.ProfesionalServicio;

import java.util.List;

public interface IProfesionalServicioService {
    void insert(ProfesionalServicio ps);
    List<ProfesionalServicio> list();
    ProfesionalServicio listId(int id);
    void update(ProfesionalServicio ps);
    void delete(int id);

    List<ProfesionalServicio> findByUsuario(int idUsuario);
}
