package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.Tip;
import pe.edu.upc.back_calmsphere.repositories.ITipRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.ITipService;

import java.util.List;
@Service
public class TipServiceImplement implements ITipService {
    @Autowired
    private ITipRepository repository;

    @Override
    public List<Tip> list() {
        return repository.findAll();
    }

    @Override
    public void insert(Tip t) {
        repository.save(t);
    }

    @Override
    public Tip listId(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void delete(int id) {
        repository.deleteById(id);
    }

    @Override
    public void update(Tip t) {
        repository.save(t);
    }
}