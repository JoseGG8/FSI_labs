package com.udea.droolrules.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class TicketCompraVuelo {

    private Long id;

    @NotNull(message = "El pasajero asignado al ticket es obligatorio")
    @Valid
    private Pasajero pasajero;

    @NotNull(message = "El vuelo asignado al ticket es obligatorio")
    @Valid
    private Vuelo vuelo;

    @Positive(message = "El precio del ticket debe ser mayor a 0")
    private double precio;

    @NotBlank(message = "La clase de la reserva es obligatoria (ej. ECONOMY, PREMIUM_ECONOMY, BUSINESS)")
    private String clase;

    public TicketCompraVuelo() {
    }

    public TicketCompraVuelo(Long id, Pasajero pasajero, Vuelo vuelo, double precio, String clase) {
        this.id = id;
        this.pasajero = pasajero;
        this.vuelo = vuelo;
        this.precio = precio;
        this.clase = clase;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pasajero getPasajero() {
        return pasajero;
    }

    public void setPasajero(Pasajero pasajero) {
        this.pasajero = pasajero;
    }

    public Vuelo getVuelo() {
        return vuelo;
    }

    public void setVuelo(Vuelo vuelo) {
        this.vuelo = vuelo;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public String getClase() {
        return clase;
    }

    public void setClase(String clase) {
        this.clase = clase;
    }
}
