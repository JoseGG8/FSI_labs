package com.udea.droolrules.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class Equipaje {

    private Long id;

    @Positive(message = "El peso del equipaje debe ser mayor a 0 kg")
    private double peso;

    @NotBlank(message = "El tipo de equipaje es obligatorio (ej. MANO, BODEGA, ESPECIAL)")
    private String tipo;

    private boolean checkedIn;

    @Valid
    private Vuelo vuelo;

    @Valid
    private Pasajero pasajero;

    public Equipaje() {
    }

    public Equipaje(Long id, double peso, String tipo, boolean checkedIn, Vuelo vuelo, Pasajero pasajero) {
        this.id = id;
        this.peso = peso;
        this.tipo = tipo;
        this.checkedIn = checkedIn;
        this.vuelo = vuelo;
        this.pasajero = pasajero;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getPeso() {
        return peso;
    }

    public void setPeso(double peso) {
        this.peso = peso;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public boolean isCheckedIn() {
        return checkedIn;
    }

    public void setCheckedIn(boolean checkedIn) {
        this.checkedIn = checkedIn;
    }

    public Vuelo getVuelo() {
        return vuelo;
    }

    public void setVuelo(Vuelo vuelo) {
        this.vuelo = vuelo;
    }

    public Pasajero getPasajero() {
        return pasajero;
    }

    public void setPasajero(Pasajero pasajero) {
        this.pasajero = pasajero;
    }
}
