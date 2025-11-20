package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.Suscripcion;
import pe.edu.upc.back_calmsphere.repositories.ISuscripcionRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.ISuscripcionService;

import java.util.List;
@Service
public class SuscripcionServiceImplement implements ISuscripcionService {
    @Autowired
    private ISuscripcionRepository sS;

    @Override
    public List<Suscripcion> list() {
        return sS.findAll();
    }

    @Override
    public void insert(Suscripcion s) {
        sS.save(s);
    }

    @Override
    public Suscripcion listId(int id) {
        return sS.findById(id).orElse(new Suscripcion());
    }

    @Override
    public void delete(int id) {
        sS.deleteById(id);
    }

    @Override
    public void update(Suscripcion s) {
        sS.save(s);
    }
}