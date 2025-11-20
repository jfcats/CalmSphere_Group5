package pe.edu.upc.back_calmsphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upc.back_calmsphere.entities.ProfesionalServicio;

import java.util.List;

public interface IProfesionalServicioRepository extends JpaRepository<ProfesionalServicio, Integer> {
    List<ProfesionalServicio> findByUsuario_IdUsuario(int idUsuario);
}
