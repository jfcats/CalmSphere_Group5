package pe.edu.upc.back_calmsphere.servicesimplements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pe.edu.upc.back_calmsphere.entities.Usuario;
import pe.edu.upc.back_calmsphere.repositories.IUsuarioRepository;

import java.util.ArrayList;
import java.util.List;

//Clase 2
@Service
public class JwtUserDetailsService implements UserDetailsService {
    @Autowired
    private IUsuarioRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException { // Cambiado nombre del parametro para claridad
        // CAMBIO: Buscamos por EMAIL en lugar de por nombre/username
        Usuario user = repo.findOneByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException(String.format("User not exists with email: %s", email));
        }

        List<GrantedAuthority> roles = new ArrayList<>();

        user.getRoles().forEach(rol -> {
            roles.add(new SimpleGrantedAuthority(rol.getTipoRol()));
        });

        // Aquí pasamos el email como "username" para Spring Security
        UserDetails ud = new org.springframework.security.core.userdetails.User(
                user.getEmail(), // Usamos el email como identificador principal
                user.getContraseña(),
                true, true, true, true,
                roles
        );

        return ud;
    }
}