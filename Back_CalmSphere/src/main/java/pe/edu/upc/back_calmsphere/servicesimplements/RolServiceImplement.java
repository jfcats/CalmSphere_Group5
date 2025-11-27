package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.Rol;
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.repositories.IRolRepository;
import pe.edu.upc.back_calmsphere.repositories.IUsuarioRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IRolService;

import java.util.List;

@Service
public class RolServiceImplement implements IRolService {
    @Autowired
    private IRolRepository repository;

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Override
    public List<Rol> list() {
        return repository.findAll();
    }

    @Override
    public void insert(Rol r) {
        repository.save(r);
    }

    @Override
    public Rol listId(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void delete(int id) {
        Rol r  = listId(id);
        Usuario u = r.getUsuario();
        if(u!=null){
            u.getRoles().remove(r);
            usuarioRepository.save(u);
        }
        repository.deleteById(id);
    }

    @Override
    public void update(Rol r) {
        repository.save(r);
    }

    @Override
    public List<Rol> buscarTipoRol(String tipo) {
        return repository.buscarTipoRol(tipo);
    }

    @Override
    public List<String[]> listarRolesPorUsuario() {
        return repository.listarRolesPorUsuario();
    }
}