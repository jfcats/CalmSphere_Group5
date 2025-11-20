package pe.edu.upc.back_calmsphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.upc.back_calmsphere.entities.RegistroEstadoAnimo;

public interface IRegistroEstadoAnimoRepository extends JpaRepository<RegistroEstadoAnimo, Integer> {
}
