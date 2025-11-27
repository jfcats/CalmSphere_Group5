package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.Rol; // <--- IMPORTANTE
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.repositories.IUsuarioRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IUsuarioService;

import java.util.ArrayList; // <--- IMPORTANTE
import java.util.List;

@Service
public class UsuarioServiceImplement implements IUsuarioService {
    @Autowired
    private IUsuarioRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Usuario> list() {
        return repository.findAll();
    }

    @Override
    public void insert(Usuario u) {
        // 1. Encriptar contraseña
        String contraseñaEncriptada = passwordEncoder.encode(u.getContraseña());
        u.setContraseña(contraseñaEncriptada);

        // 2. ASIGNAR ROL POR DEFECTO (PACIENTE)
        // Creamos el rol
        Rol rol = new Rol();
        rol.setTipoRol("PACIENTE");
        rol.setUsuario(u); // Importante: El hijo debe conocer al padre

        // Asignamos el rol a la lista del usuario
        // Inicializamos la lista por si viene nula para evitar NullPointerException
        if (u.getRoles() == null) {
            u.setRoles(new ArrayList<>());
        }

        u.getRoles().add(rol);

        // 3. Guardar (Gracias al CascadeType.ALL en Usuario, se guardan ambos)
        repository.save(u);
    }

    @Override
    public Usuario listId(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void delete(int id) {
        repository.deleteById(id);
    }

    @Override
    public void update(Usuario u) {
        // Si viene una contraseña nueva, la encripto
        if (u.getContraseña() != null && !u.getContraseña().isEmpty()) {
            String contraseñaEncriptada = passwordEncoder.encode(u.getContraseña());
            u.setContraseña(contraseñaEncriptada);
        }
        // Nota: En update ten cuidado de no borrar los roles existentes si 'u' viene sin roles.
        // Pero para el registro, el método insert de arriba es el que importa.
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
}