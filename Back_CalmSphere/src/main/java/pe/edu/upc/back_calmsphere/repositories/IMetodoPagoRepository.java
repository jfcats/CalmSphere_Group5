package pe.edu.upc.back_calmsphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.upc.back_calmsphere.entities.MetodoPago;

import java.util.List;

@Repository
public interface IMetodoPagoRepository extends JpaRepository<MetodoPago, Integer> {

    // Buscar métodos de pago DE UN USUARIO ESPECÍFICO
    @Query("select m from MetodoPago m where m.usuario.idUsuario = :idUsuario")
    List<MetodoPago> findByUsuario(@Param("idUsuario") int idUsuario);
}