package pe.edu.upc.back_calmsphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upc.back_calmsphere.entities.ColeccionEjercicio;

import java.util.List;

public interface IColeccionEjercicioRepository extends JpaRepository<ColeccionEjercicio, Integer> {
    List<ColeccionEjercicio> findByColeccion_IdColeccion(int idColeccion);
}
