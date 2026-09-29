package com.udea.droolrules.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class Vuelo {

    @NotBlank(message = "El código de vuelo es obligatorio")
    private String codigo;

    @NotBlank(message = "La ciudad o aeropuerto de origen es obligatorio")
    private String origen;

    @NotBlank(message = "La ciudad o aeropuerto de destino es obligatorio")
    private String destino;

    @NotNull(message = "La fecha y hora de salida es obligatoria")
    private LocalDateTime fechaHoraSalida;

    @NotNull(message = "La fecha y hora estimada de llegada es obligatoria")
    private LocalDateTime horaLlegada;

    public Vuelo() {
    }

    public Vuelo(String codigo, String origen, String destino, LocalDateTime fechaHoraSalida, LocalDateTime horaLlegada) {
        this.codigo = codigo;
        this.origen = origen;
        this.destino = destino;
        this.fechaHoraSalida = fechaHoraSalida;
        this.horaLlegada = horaLlegada;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getOrigen() {
        return origen;
    }

    public void setOrigen(String origen) {
        this.origen = origen;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public LocalDateTime getFechaHoraSalida() {
        return fechaHoraSalida;
    }

    public void setFechaHoraSalida(LocalDateTime fechaHoraSalida) {
        this.fechaHoraSalida = fechaHoraSalida;
    }

    public LocalDateTime getHoraLlegada() {
        return horaLlegada;
    }

    public void setHoraLlegada(LocalDateTime horaLlegada) {
        this.horaLlegada = horaLlegada;
    }
}
