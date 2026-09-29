package com.udea.droolrules.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
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

    private int minutosRetraso;

    private double duracionHoras;

    public Vuelo() {
    }

    public Vuelo(String codigo, String origen, String destino, LocalDateTime fechaHoraSalida,
                 LocalDateTime horaLlegada, int minutosRetraso, double duracionHoras) {
        this.codigo = codigo;
        this.origen = origen;
        this.destino = destino;
        this.fechaHoraSalida = fechaHoraSalida;
        this.horaLlegada = horaLlegada;
        this.minutosRetraso = minutosRetraso;
        this.duracionHoras = duracionHoras;
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
        recalcularDuracionSiAplica();
    }

    public LocalDateTime getHoraLlegada() {
        return horaLlegada;
    }

    public void setHoraLlegada(LocalDateTime horaLlegada) {
        this.horaLlegada = horaLlegada;
        recalcularDuracionSiAplica();
    }

    public int getMinutosRetraso() {
        return minutosRetraso;
    }

    public void setMinutosRetraso(int minutosRetraso) {
        this.minutosRetraso = minutosRetraso;
    }

    public double getDuracionHoras() {
        if (duracionHoras <= 0 && fechaHoraSalida != null && horaLlegada != null) {
            return Duration.between(fechaHoraSalida, horaLlegada).toMinutes() / 60.0;
        }
        return duracionHoras;
    }

    public void setDuracionHoras(double duracionHoras) {
        this.duracionHoras = duracionHoras;
    }

    private void recalcularDuracionSiAplica() {
        if (fechaHoraSalida != null && horaLlegada != null && duracionHoras <= 0) {
            this.duracionHoras = Duration.between(fechaHoraSalida, horaLlegada).toMinutes() / 60.0;
        }
    }
}
