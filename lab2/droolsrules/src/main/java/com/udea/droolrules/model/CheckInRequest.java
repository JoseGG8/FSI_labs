package com.udea.droolrules.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * DTO puro para transportar la información de una solicitud de Check-In.
 * Completamente desacoplado del motor de reglas o cualquier tecnología específica.
 */
public class CheckInRequest {

    @NotNull(message = "El ticket de compra del vuelo es obligatorio")
    @Valid
    private TicketCompraVuelo ticket;

    @Valid
    private Asiento asientoDeseado;

    @Valid
    private Equipaje equipaje;

    public CheckInRequest() {
    }

    public CheckInRequest(TicketCompraVuelo ticket, Asiento asientoDeseado, Equipaje equipaje) {
        this.ticket = ticket;
        this.asientoDeseado = asientoDeseado;
        this.equipaje = equipaje;
    }

    public TicketCompraVuelo getTicket() {
        return ticket;
    }

    public void setTicket(TicketCompraVuelo ticket) {
        this.ticket = ticket;
    }

    public Asiento getAsientoDeseado() {
        return asientoDeseado;
    }

    public void setAsientoDeseado(Asiento asientoDeseado) {
        this.asientoDeseado = asientoDeseado;
    }

    public Equipaje getEquipaje() {
        return equipaje;
    }

    public void setEquipaje(Equipaje equipaje) {
        this.equipaje = equipaje;
    }
}
