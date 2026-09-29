package com.udea.droolrules.model;

import java.time.LocalDateTime;

/**
 * DTO puro para representar el resultado del proceso de Check-In.
 * Completamente desacoplado del motor de reglas o cualquier tecnología específica.
 */
public class CheckInResponse {

    private boolean exitoso;
    private Asiento asientoAsignado;
    private double costoAdicional;
    private boolean ascensoOtorgado;
    private String nuevaClase;
    private String grupoAbordaje;
    private LocalDateTime horaAbordaje;
    private String mensaje;

    public CheckInResponse() {
    }

    public CheckInResponse(boolean exitoso, Asiento asientoAsignado, double costoAdicional,
                           boolean ascensoOtorgado, String nuevaClase, String grupoAbordaje,
                           LocalDateTime horaAbordaje, String mensaje) {
        this.exitoso = exitoso;
        this.asientoAsignado = asientoAsignado;
        this.costoAdicional = costoAdicional;
        this.ascensoOtorgado = ascensoOtorgado;
        this.nuevaClase = nuevaClase;
        this.grupoAbordaje = grupoAbordaje;
        this.horaAbordaje = horaAbordaje;
        this.mensaje = mensaje;
    }

    public boolean isExitoso() {
        return exitoso;
    }

    public void setExitoso(boolean exitoso) {
        this.exitoso = exitoso;
    }

    public Asiento getAsientoAsignado() {
        return asientoAsignado;
    }

    public void setAsientoAsignado(Asiento asientoAsignado) {
        this.asientoAsignado = asientoAsignado;
    }

    public double getCostoAdicional() {
        return costoAdicional;
    }

    public void setCostoAdicional(double costoAdicional) {
        this.costoAdicional = costoAdicional;
    }

    public boolean isAscensoOtorgado() {
        return ascensoOtorgado;
    }

    public void setAscensoOtorgado(boolean ascensoOtorgado) {
        this.ascensoOtorgado = ascensoOtorgado;
    }

    public String getNuevaClase() {
        return nuevaClase;
    }

    public void setNuevaClase(String nuevaClase) {
        this.nuevaClase = nuevaClase;
    }

    public String getGrupoAbordaje() {
        return grupoAbordaje;
    }

    public void setGrupoAbordaje(String grupoAbordaje) {
        this.grupoAbordaje = grupoAbordaje;
    }

    public LocalDateTime getHoraAbordaje() {
        return horaAbordaje;
    }

    public void setHoraAbordaje(LocalDateTime horaAbordaje) {
        this.horaAbordaje = horaAbordaje;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
