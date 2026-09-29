package com.udea.droolrules.service;

import com.udea.droolrules.model.CheckInRequest;
import com.udea.droolrules.model.CheckInResponse;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheckInService {

    @Autowired
    private KieContainer kieContainer;

    /**
     * Procesa la solicitud de Check-In ejecutando las reglas de Drools.
     *
     * @param request Solicitud con los datos del ticket, pasajero, asiento deseado y equipaje.
     * @return CheckInResponse con el resultado de las reglas aplicadas.
     */
    public CheckInResponse procesarCheckIn(CheckInRequest request) {
        // 1. Inicializar la respuesta
        CheckInResponse response = new CheckInResponse();
        response.setExitoso(true);
        response.setCostoAdicional(0.0);

        // 2. Crear una nueva sesión KIE en memoria
        KieSession kieSession = kieContainer.newKieSession();

        try {
            // 3. Insertar hechos en la sesión de Drools
            kieSession.insert(request);
            kieSession.insert(response);

            // También se pueden insertar sub-objetos para facilitar el emparejamiento de reglas
            if (request.getTicket() != null) {
                kieSession.insert(request.getTicket());
                if (request.getTicket().getPasajero() != null) {
                    kieSession.insert(request.getTicket().getPasajero());
                }
                if (request.getTicket().getVuelo() != null) {
                    kieSession.insert(request.getTicket().getVuelo());
                }
            }
            if (request.getEquipaje() != null) {
                kieSession.insert(request.getEquipaje());
            }
            if (request.getAsientoDeseado() != null) {
                kieSession.insert(request.getAsientoDeseado());
            }

            // 4. Disparar todas las reglas activadas
            kieSession.fireAllRules();

        } finally {
            // 5. Liberar recursos de la sesión
            kieSession.dispose();
        }

        return response;
    }
}
