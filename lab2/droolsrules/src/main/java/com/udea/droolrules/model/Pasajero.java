package com.udea.droolrules.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class Pasajero {

    private Long id;

    @NotBlank(message = "El número de documento o pasaporte es obligatorio")
    private String documentoIdentidad;

    @NotBlank(message = "El nombre del pasajero es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @Min(value = 0, message = "La edad debe ser mayor o igual a 0")
    private int edad;

    @NotNull(message = "El tipo de pasajero es obligatorio")
    private TipoPasajero tipo;

    @Min(value = 0, message = "Los puntos de lealtad no pueden ser negativos")
    private int puntosLealtad;

    private boolean elegibleAscensos = true;

    @NotNull(message = "La preferencia de asiento es obligatoria")
    private PreferenciaAsiento preferenciaAsiento;

    @PositiveOrZero(message = "El saldo a favor no puede ser negativo")
    private double saldoFavor;

    private boolean viajaConNinos;

    public Pasajero() {
    }

    public Pasajero(Long id, String documentoIdentidad, String nombre, int edad, TipoPasajero tipo,
                    int puntosLealtad, boolean elegibleAscensos, PreferenciaAsiento preferenciaAsiento,
                    double saldoFavor, boolean viajaConNinos) {
        this.id = id;
        this.documentoIdentidad = documentoIdentidad;
        this.nombre = nombre;
        this.edad = edad;
        this.tipo = tipo;
        this.puntosLealtad = puntosLealtad;
        this.elegibleAscensos = elegibleAscensos;
        this.preferenciaAsiento = preferenciaAsiento;
        this.saldoFavor = saldoFavor;
        this.viajaConNinos = viajaConNinos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }

    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public TipoPasajero getTipo() {
        return tipo;
    }

    public void setTipo(TipoPasajero tipo) {
        this.tipo = tipo;
    }

    public int getPuntosLealtad() {
        return puntosLealtad;
    }

    public void setPuntosLealtad(int puntosLealtad) {
        this.puntosLealtad = puntosLealtad;
    }

    public boolean isElegibleAscensos() {
        return elegibleAscensos;
    }

    public void setElegibleAscensos(boolean elegibleAscensos) {
        this.elegibleAscensos = elegibleAscensos;
    }

    public PreferenciaAsiento getPreferenciaAsiento() {
        return preferenciaAsiento;
    }

    public void setPreferenciaAsiento(PreferenciaAsiento preferenciaAsiento) {
        this.preferenciaAsiento = preferenciaAsiento;
    }

    public double getSaldoFavor() {
        return saldoFavor;
    }

    public void setSaldoFavor(double saldoFavor) {
        this.saldoFavor = saldoFavor;
    }

    public boolean isViajaConNinos() {
        return viajaConNinos;
    }

    public void setViajaConNinos(boolean viajaConNinos) {
        this.viajaConNinos = viajaConNinos;
    }
}
