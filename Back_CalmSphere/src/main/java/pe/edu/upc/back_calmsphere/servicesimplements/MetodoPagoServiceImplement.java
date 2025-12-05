package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.MetodoPago;
import pe.edu.upc.back_calmsphere.repositories.IMetodoPagoRepository;
import pe.edu.upc.back_calmsphere.servicesinterfaces.IMetodoPagoService;

import java.util.List;

@Service
public class MetodoPagoServiceImplement implements IMetodoPagoService {
    @Autowired
    private IMetodoPagoRepository rMP;

    @Override
    public List<MetodoPago> list(){
        return rMP.findAll();
    }

    @Override
    public void insert(MetodoPago m) {
        rMP.save(m);
    }
    @Override
    public void update(MetodoPago m) {
        rMP.save(m);
    }
    @Override
    public void delete(int id) {
        rMP.deleteById(id);
    }

    @Override
    public MetodoPago listId(int id) {
        return rMP.findById(id).orElse(new MetodoPago());
    }

    // NUEVO
    @Override
    public List<MetodoPago> listByUserId(int idUsuario) {
        return rMP.findByUsuario(idUsuario);
    }
}