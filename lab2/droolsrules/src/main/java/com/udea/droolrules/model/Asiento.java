package com.udea.droolrules.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class Asiento {

    @NotBlank(message = "La fila del asiento es obligatoria")
    private String fila;

    @NotBlank(message = "La columna del asiento es obligatoria")
    private String columna;

    @NotNull(message = "La ubicación o preferencia del asiento es obligatoria")
    private PreferenciaAsiento preferencia;

    @Valid
    private Vuelo vuelo;

    private boolean ocupado;

    public Asiento() {
    }

    public Asiento(String fila, String columna, PreferenciaAsiento preferencia, Vuelo vuelo, boolean ocupado) {
        this.fila = fila;
        this.columna = columna;
        this.preferencia = preferencia;
        this.vuelo = vuelo;
        this.ocupado = ocupado;
    }

    public String getFila() {
        return fila;
    }

    public void setFila(String fila) {
        this.fila = fila;
    }

    public String getColumna() {
        return columna;
    }

    public void setColumna(String columna) {
        this.columna = columna;
    }

    public PreferenciaAsiento getPreferencia() {
        return preferencia;
    }

    public void setPreferencia(PreferenciaAsiento preferencia) {
        this.preferencia = preferencia;
    }

    public Vuelo getVuelo() {
        return vuelo;
    }

    public void setVuelo(Vuelo vuelo) {
        this.vuelo = vuelo;
    }

    public boolean isOcupado() {
        return ocupado;
    }

    public void setOcupado(boolean ocupado) {
        this.ocupado = ocupado;
    }

    /**
     * Retorna el identificador completo del asiento (ej. 12A)
     */
    public String getCodigoAsiento() {
        return (fila != null ? fila : "") + (columna != null ? columna : "");
    }
}
