package com.udea.droolrules.controller;

import com.udea.droolrules.model.CheckInRequest;
import com.udea.droolrules.model.CheckInResponse;
import com.udea.droolrules.service.CheckInService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    @Autowired
    private CheckInService checkInService;

    /**
     * Endpoint REST para procesar solicitudes de Check-In.
     * El controlador valida los datos de entrada y delega la ejecución al servicio.
     */
    @PostMapping
    public ResponseEntity<CheckInResponse> procesarCheckIn(@Valid @RequestBody CheckInRequest request, BindingResult result) {
        // Validación de datos de entrada vía Jakarta
        if (result.hasErrors()) {
            String errorMsg = result.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .reduce((m1, m2) -> m1 + "; " + m2)
                    .orElse("Error en los datos de entrada");

            CheckInResponse errorResponse = new CheckInResponse();
            errorResponse.setExitoso(false);
            errorResponse.setMensaje("Error de validación: " + errorMsg);
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Delegar procesamiento al servicio
        CheckInResponse response = checkInService.procesarCheckIn(request);
        return ResponseEntity.ok(response);
    }
}
