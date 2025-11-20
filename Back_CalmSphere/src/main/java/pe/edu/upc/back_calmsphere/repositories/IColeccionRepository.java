package pe.edu.upc.back_calmsphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upc.back_calmsphere.entities.Coleccion;

import java.util.List;

public interface IColeccionRepository extends JpaRepository<Coleccion, Integer> {
    List<Coleccion> findByNombreContainingIgnoreCase(String nombre);
}
