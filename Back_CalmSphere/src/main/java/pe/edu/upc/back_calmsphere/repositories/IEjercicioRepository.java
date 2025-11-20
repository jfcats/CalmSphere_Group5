package pe.edu.upc.back_calmsphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upc.back_calmsphere.entities.Ejercicio;

import java.util.List;

public interface IEjercicioRepository extends JpaRepository<Ejercicio, Integer> {
    List<Ejercicio> findByCategoria(String categoria);
}
