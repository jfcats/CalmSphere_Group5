package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.UsuarioTip;
import pe.edu.upc.back_calmsphere.repositories.IUsuarioTipRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IUsuarioTipService;

import java.util.List;
@Service
public class UsuarioTipServiceImplement implements IUsuarioTipService {
    @Autowired
    private IUsuarioTipRepository repository;

    @Override
    public List<UsuarioTip> list() {
        return repository.findAll();
    }

    @Override
    public void insert(UsuarioTip u) {
        repository.save(u);
    }

    @Override
    public UsuarioTip listId(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void delete(int id) {
        repository.deleteById(id);
    }

    @Override
    public void update(UsuarioTip u) {
        repository.save(u);
    }
}