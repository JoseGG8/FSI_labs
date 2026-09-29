package com.udea.droolrules;

import com.udea.droolrules.model.*;
import com.udea.droolrules.service.CheckInService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CheckInRulesTest {

    @Autowired
    private CheckInService checkInService;

    @Test
    void testUpgradeForFrequentFlyersWithDelays() {
        Pasajero pasajero = new Pasajero();
        pasajero.setNombre("Carlos Perez");
        pasajero.setTipo(TipoPasajero.GOLD);
        pasajero.setElegibleAscensos(true);

        Vuelo vuelo = new Vuelo();
        vuelo.setMinutosRetraso(75); // Más de 60 min

        TicketCompraVuelo ticket = new TicketCompraVuelo();
        ticket.setPasajero(pasajero);
        ticket.setVuelo(vuelo);
        ticket.setClase("ECONOMY");

        CheckInRequest request = new CheckInRequest();
        request.setTicket(ticket);

        CheckInResponse response = checkInService.procesarCheckIn(request);

        assertTrue(response.isAscensoOtorgado());
        assertEquals("BUSINESS", response.getNuevaClase());
    }

    @Test
    void testDenyUpgradeWhenOverweightLuggage() {
        Pasajero pasajero = new Pasajero();
        pasajero.setNombre("Ana Gomez");
        pasajero.setTipo(TipoPasajero.PLATINUM);
        pasajero.setElegibleAscensos(true);

        Vuelo vuelo = new Vuelo();
        vuelo.setMinutosRetraso(120);

        Equipaje equipaje = new Equipaje();
        equipaje.setPeso(25.0); // Más de 23 kg

        TicketCompraVuelo ticket = new TicketCompraVuelo();
        ticket.setPasajero(pasajero);
        ticket.setVuelo(vuelo);

        CheckInRequest request = new CheckInRequest();
        request.setTicket(ticket);
        request.setEquipaje(equipaje);

        CheckInResponse response = checkInService.procesarCheckIn(request);

        assertFalse(response.isAscensoOtorgado());
        assertFalse(pasajero.isElegibleAscensos());
    }

    @Test
    void testSeniorPriorityCheckInAndVipLounge() {
        Pasajero pasajero = new Pasajero();
        pasajero.setNombre("Martha Ruiz");
        pasajero.setEdad(70); // Mayor a 65
        pasajero.setTipo(TipoPasajero.PLATINUM); // VIP lounge

        TicketCompraVuelo ticket = new TicketCompraVuelo();
        ticket.setPasajero(pasajero);
        ticket.setVuelo(new Vuelo());

        CheckInRequest request = new CheckInRequest();
        request.setTicket(ticket);

        CheckInResponse response = checkInService.procesarCheckIn(request);

        assertTrue(response.isCheckInPrioritario());
        assertTrue(response.isAccesoSalonVip());
    }
}
