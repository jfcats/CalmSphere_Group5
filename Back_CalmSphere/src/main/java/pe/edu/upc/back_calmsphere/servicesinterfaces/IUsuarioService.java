package pe.edu.upc.back_calmsphere.servicesinterfaces;

import pe.edu.upc.back_calmsphere.entities.Usuario;

import java.util.List;

public interface IUsuarioService {
    public List<Usuario> list();
    public void insert(Usuario u);
    public Usuario listId(Integer id);
    public void delete(Integer id);
    public void update(Usuario u);
    public List<Usuario> buscarNombre(String nombre);
    public List<String[]> buscarEventoEstresPorUsuario();
}