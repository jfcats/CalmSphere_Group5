package pe.edu.upc.back_calmsphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.upc.back_calmsphere.entities.Usuario;

import java.util.List;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Integer> { // Asegurate que sea Integer si cambiaste la entidad, o Long/int segun corresponda. Asumo Integer por consistencia con cambios recientes.

    // CAMBIO: Método para buscar por email (Spring Data JPA lo crea solo por el nombre)
    public Usuario findOneByEmail(String email);

    //Listar por nombre (para filtros, busquedas, etc)
    @Query("Select u from Usuario u where u.nombre like %:nombre%")
    public List<Usuario> buscar(@Param("nombre") String nombre);

    @Query(value = "select u.nombre, e.id_evento_estres, e.descripcion, e.fecha, e.nivel_estres\n" +
            " from usuario u inner join evento_estres e\n" +
            " on u.id_usuario = e.id_usuario\n" +
            " order by u.id_usuario, e.id_evento_estres ASC", nativeQuery = true)
    public List<String[]> buscarEventoEstresPorUsuario();

    // public Usuario findOneByNombre(String nombre); // Ya no se usará para login
}