package pe.edu.upc.back_calmsphere.dtos;

public class EventoDTOInsert {
    private int idEvento;

    // Usamos Integer para mayor seguridad
    private Integer idUsuario;
    private Integer idProfesionalServicio;
    private Integer idMetodoPago;

    // String para evitar problemas de formato de fecha
    private String inicio;
    private String fin;
    private String monto; // String para evitar problemas de decimales

    private boolean estado;
    private String motivo;
    private String tokenPago;

    // --- GETTERS Y SETTERS ---
    public int getIdEvento() { return idEvento; }
    public void setIdEvento(int idEvento) { this.idEvento = idEvento; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdProfesionalServicio() { return idProfesionalServicio; }
    public void setIdProfesionalServicio(Integer idProfesionalServicio) { this.idProfesionalServicio = idProfesionalServicio; }

    public Integer getIdMetodoPago() { return idMetodoPago; }
    public void setIdMetodoPago(Integer idMetodoPago) { this.idMetodoPago = idMetodoPago; }

    public String getInicio() { return inicio; }
    public void setInicio(String inicio) { this.inicio = inicio; }

    public String getFin() { return fin; }
    public void setFin(String fin) { this.fin = fin; }

    public String getMonto() { return monto; }
    public void setMonto(String monto) { this.monto = monto; }

    public boolean isEstado() { return estado; }
    public void setEstado(boolean estado) { this.estado = estado; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getTokenPago() { return tokenPago; }
    public void setTokenPago(String tokenPago) { this.tokenPago = tokenPago; }
}