package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.repositories.IUsuarioRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IUsuarioService;

import java.util.List;

@Service
public class UsuarioServiceImplement implements IUsuarioService {

    @Autowired
    private IUsuarioRepository repository;

    // Eliminamos PasswordEncoder y la segunda inyección de repositorio (dR)
    // El Controller ya se encarga de la lógica de negocio.

    @Override
    public List<Usuario> list() {
        return repository.findAll();
    }

    @Override
    public void insert(Usuario u) {
        // CORRECCIÓN: Solo guardamos.
        // El Controller ya encriptó la contraseña y ya asignó la fecha.
        // El Controller ya se encargará de crear el Rol por separado.
        repository.save(u);
    }

    @Override
    public Usuario listId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public void update(Usuario u) {
        // CORRECCIÓN: Solo guardamos.
        // El Controller ya validó si había que encriptar o mantener la contraseña vieja.
        repository.save(u);
    }

    @Override
    public List<Usuario> buscarNombre(String nombre) {
        return repository.buscar(nombre);
    }

    @Override
    public List<String[]> buscarEventoEstresPorUsuario() {
        return repository.buscarEventoEstresPorUsuario();
    }

    @Override
    public Usuario listarPorEmail(String email) {
        return repository.findOneByEmail(email);
    }
}