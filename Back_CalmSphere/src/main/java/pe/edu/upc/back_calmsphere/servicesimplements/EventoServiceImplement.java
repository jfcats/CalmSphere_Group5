package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.Evento;
import pe.edu.upc.back_calmsphere.repositories.IEventoRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IEventoService;

import java.util.List;

@Service
public class EventoServiceImplement implements IEventoService {
    @Autowired
    private IEventoRepository repository;

    @Override
    public void insert(Evento e) {
        repository.save(e);
    }

    @Override
    public List<Evento> list() {
        return repository.findAll();
    }

    @Override
    public Evento listId(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void update(Evento e) {
        repository.save(e);
    }

    @Override
    public void delete(int id) {
        repository.deleteById(id);
    }

    @Override
    public List<Evento> findByUsuario(int idUsuario) {
        return repository.findByUsuario(idUsuario);
    }

    @Override
    public List<Evento> findByProfesionalServicio(int idProfesionalServicio) {
        return repository.findByProfesionalServicio(idProfesionalServicio);
    }

    @Override
    public List<Evento> findByMetodoPago(int idMetodoPago) {
        return repository.findByMetodoPago(idMetodoPago);
    }

    // === IMPLEMENTACIÓN DE REPORTES ===

    @Override
    public List<String[]> reporteProfesional() {
        return repository.reporteEventosPorProfesional();
    }

    @Override
    public List<String[]> reporteMetodoPago() {
        return repository.reporteEventosPorMetodoPago();
    }
}