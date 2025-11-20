package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.EventoEstres;
import pe.edu.upc.back_calmsphere.repositories.IEventoEstresRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IEventoEstresService;

import java.util.List;

@Service
public class EventoEstresServiceImplement implements IEventoEstresService {
    @Autowired
    private IEventoEstresRepository repository;

    @Override
    public List<EventoEstres> list() {
        return repository.findAll();
    }

    @Override
    public void insert(EventoEstres e) {
        repository.save(e);
    }

    @Override
    public EventoEstres listId(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void delete(int id) {
        repository.deleteById(id);
    }

    @Override
    public void update(EventoEstres e) {
        repository.save(e);
    }

    @Override
    public List<String[]> buscarPorFecha() {
        return repository.buscarPorFecha();
    }
}