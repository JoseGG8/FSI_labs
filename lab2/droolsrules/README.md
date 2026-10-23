# Laboratorio 2: Motor de Reglas de Negocio con Drools y Spring Boot

## 1. Introducción
Como estudiantes de ingeniería de software, nos enfrentamos continuamente al reto de modelar aplicaciones con lógicas de negocio complejas y cambiantes. Habitualmente, este tipo de decisiones (promociones, validaciones, políticas de cobro o excepciones) terminan incrustadas en el código fuente en cadenas interminables de `if-else` o `switch`, lo cual vuelve al sistema rígido, difícil de mantener y propenso a errores ante cambios en las directrices de la organización.

En esta práctica de laboratorio exploramos el uso de un **Motor de Reglas de Negocio (BRMS - Business Rules Management System)** mediante **Apache Drools** integrado con el ecosistema de **Spring Boot**. A través de la simulación del proceso de **Check-In de una aerolínea comercial**, transformamos un proyecto base de evaluación crediticia en un motor de decisiones capaz de evaluar equipajes, asignar asientos especiales, otorgar compensaciones por retrasos y asignar ascensos de categoría en función de 10 reglas de negocio declarativas.

---

## 2. Objetivos
* **Comprender el paradigma declarativo de Drools:** Entender cómo se desacopla la lógica de toma de decisiones del flujo de control imperativo tradicional de una aplicación Java.
* **Diseñar un modelo de dominio desacoplado:** Estructurar entidades de dominio (`Pasajero`, `Vuelo`, `Equipaje`, `Asiento`, `TicketCompraVuelo`) y objetos de transferencia de datos (`CheckInRequest`, `CheckInResponse`) con validaciones de **Jakarta EE**, sin ataduras al motor de reglas.
* **Implementar una arquitectura por capas:** Organizar la aplicación siguiendo el estándar Controlador - Servicio - Motor de Reglas (KIE - *Knowledge Is Everything*).
* **Gestionar la agenda de ejecución en Drools:** Utilizar atributos como `salience` y funciones reactivas como `modify()` para manejar dependencias y conflictos entre reglas que modifican el estado de los hechos en memoria de trabajo (*Working Memory*).
* **Integrar explicaciones asistidas por Inteligencia Artificial:** Explorar el uso de **Spring AI** con modelos de lenguaje (OpenAI) para traducir resultados automáticos de reglas a explicaciones comprensibles para el usuario final.

---

## 3. Herramientas y Tecnologías Utilizadas

| Componente | Tecnología | Rol en el Proyecto |
| :--- | :--- | :--- |
| **Entorno de Desarrollo (IDE)** | Visual Studio Code / Antigravity IDE | Edición de código, terminal integrada y depuración en Windows. |
| **Lenguaje de Programación** | Java 23 (OpenJDK 64-Bit Server VM) | Lenguaje base del proyecto, aprovechando características modernas. |
| **Framework Backend** | Spring Boot 3.4.10 | Framework principal para inyección de dependencias y exposición de API REST. |
| **Motor de Reglas** | Apache Drools 7.74.1.Final | Motor de inferencia y evaluación de reglas basado en el algoritmo Rete/Phreak. |
| **Validación de Datos** | Jakarta Validation (`spring-boot-starter-validation`) | Validación declarativa de entradas (`@NotNull`, `@NotBlank`, `@Min`, `@Positive`, etc.). |
| **Control de Versiones** | Git & GitHub | Control distribuido de versiones del repositorio. |

---

## 4. Metodología y Procedimiento

El desarrollo se llevó a cabo de manera iterativa, documentando los aprendizajes y resolviendo los desafíos técnicos surgidos en cada etapa:

### Paso 1: Diagnóstico inicial y resolución de incompatibilidades de dependencias
Al iniciar la migración del proyecto base nos encontramos con el siguiente error de Maven:
```text
Missing artifact org.springframework.ai:spring-ai-openai-spring-boot-starter:jar:2.0.1
```
* **Aprendizaje:** Investigando en Maven Central descubrimos que el artefacto fue renombrado en Spring AI a `spring-ai-starter-model-openai`. Adicionalmente, Spring AI 2.0.x requiere una línea base de Spring Boot 4.x, mientras que nuestro proyecto utiliza Spring Boot 3.4.x. 
* **Solución:** Se ajustó la versión de Spring AI a `1.1.0` en el BOM de Maven y se actualizó el nombre del artefacto.

### Paso 2: Análisis y diseño del modelo de datos
El paso a seguir naturalmente es crear la entidades de negocio teniendo en cuenta el caso a resolver.Después al analizar las clases en `model/`, identificamos inconsistencias que debían resolverse antes de escribir las reglas:

1. **Persistencia vs DTOs:** Inicialmente existía una clase `CheckIn`. Al determinar que este laboratorio se enfoca en la evaluación transaccional en memoria sin base de datos persistente, determinamos que `CheckIn` era redundante y se desacopló el flujo mediante **`CheckInRequest`** (datos de entrada) y **`CheckInResponse`** (resultado de la evaluación), manteniendo los objetos completamente independientes de Drools.
2. **Validación Jakarta:** Se aplicaron anotaciones como `@NotBlank`, `@Positive`, `@Min`, y `@Valid` para asegurar la integridad de los datos antes de alcanzar la lógica de reglas.

### Paso 3: Arquitectura desacoplada (Controlador y Servicio)
Se estructuró la aplicación en capas con responsabilidades únicas:
* **`CheckInController`:** Expone el endpoint `POST /api/checkin`, intercepta la petición, evalúa errores de formato con `BindingResult` y, si los datos son válidos, delega el procesamiento al servicio.
* **`CheckInService`:** Centraliza la interacción con el contenedor de Drools (`KieContainer`), instancia la sesión (`KieSession`), inserta los hechos (`request`, `response`, sub-objetos del pasajero, equipaje y vuelo), dispara el motor con `fireAllRules()` y asegura la liberación de memoria en el bloque `finally` con `kieSession.dispose()`.

### Paso 4: El desafío de compatibilidad con Java 23 (`java.lang.Compiler`)
Durante la ejecución de las pruebas bajo el JDK 23 nos encontramos con una excepción crítica al instanciar el `KieContainer`:
```text
Factory method 'kieContainer' threw exception with message: java/lang/Compiler
```
* **Causa técnica:** La clase `java.lang.Compiler` fue retirada permanentemente de la especificación Java a partir del JDK 21. Versiones antiguas de `mvel2` arrastradas transitivamente por Drools 7 aún intentaban invocarla.
* **Solución:** Se forzó en el `pom.xml` la inclusión explícita de `mvel2:2.5.2.Final`, la cual está parcheada y es totalmente compatible con entornos Java 21 y Java 23.

### Paso 5: Implementación de las 10 Reglas de Negocio en Drools (`checkin_rules.drl`)
Se implementaron las políticas de check-in requeridas:

1. **`UpgradeToBusinessClassForFrequentFlyersWithDelays`:** Otorga ascenso a clase ejecutiva a miembros Gold o Platinum en vuelos con retraso superior a 60 minutos, siempre que sean elegibles.
2. **`PriorityCheckInForSeniors`:** Activa check-in prioritario y asigna al Grupo 1 a pasajeros mayores de 65 años.
3. **`DiscountForLightLuggage`:** Aplica un 10% de descuento si el equipaje pesa menos de 10 kg.
4. **`DenyUpgradeForOverweightLuggage`:** Si el equipaje supera los 23 kg, inhabilita al pasajero para recibir ascensos (`setElegibleAscensos(false)`).
5. **`AssignEmergencyExitSeatToYoungAdults`:** Asigna asiento en salida de emergencia a adultos entre 18 y 40 años que no tengan preferencia de asiento fija (`ANY`) y marca el asiento como ocupado.
6. **`CompensationForExtremeDelays`:** Otorga $200 de compensación al saldo a favor si el retraso del vuelo es superior a 180 minutos (3 horas).
7. **`ExtraLoyaltyPointsForLongFlights`:** Añade 500 puntos de lealtad a miembros no básicos en vuelos con duración superior a 5 horas.
8. **`RestrictLuggageOnShortFlights`:** Marca el equipaje como no permitido e invalida el check-in si supera los 15 kg en un vuelo de menos de 2 horas.
9. **`VipLoungeAccessForPlatinumMembers`:** Otorga acceso al salón VIP a socios de categoría Platinum.
10. **`PreferentialSeatForFamilies`:** Asigna asiento preferencial para familias si el pasajero viaja acompañado de niños.

### Paso 6: Comprensión de la Reactividad en Drools (`salience` y `modify`)
Un momento clave del aprendizaje ocurrió al probar la interacción entre la **Regla 4** (denegar ascenso por sobrepeso de equipaje) y la **Regla 1** (ascenso por estatus y demora). 

Inicialmente, ambas reglas se activaban simultáneamente en la agenda de Drools basándose en el estado inicial del pasajero (`elegibleAscensos = true`). Cuando la Regla 4 se ejecutaba y llamaba a `$pasajero.setElegibleAscensos(false);`, el motor no se enteraba del cambio y procedía a ejecutar el ascenso de la Regla 1.

* **Descubrimiento y solución:** En Drools, cuando una regla altera un hecho del cual dependen otras activaciones, se debe invocar el bloque **`modify($pasajero) { setElegibleAscensos(false) }`** acompañado de un `salience` superior. Esto notifica al motor Rete para que revalúe la memoria de trabajo y desactive en tiempo real la activación del ascenso.

---

## 5. Resultados y Conclusiones

### Resultados Obtenidos

* **API REST Funcional:** La aplicación expone el endpoint `POST /api/checkin` listo para procesar solicitudes JSON y retornar el objeto `CheckInResponse` con todas las decisiones consolidadas.

### Conclusiones
1. **Separación de Responsabilidades:** Utilizar Drools permite que las reglas de negocio vivan en archivos `.drl` independientes. El código Java se mantiene enfocado en orquestar el flujo y validar la estructura de los datos, mientras que las reglas se concentran exclusivamente en el *qué* y el *cuándo*.
2. **Potencia de la Memoria de Trabajo:** Drools no es un simple evaluador de condiciones lineales; su capacidad de encadenamiento de hechos mediante `modify` y `insert` permite que unas reglas reaccionen dinámicamente a las decisiones tomadas por otras.
3. **Importancia del Desacoplamiento:** Diseñar DTOs limpios sin acoplar las clases del dominio a anotaciones o interfaces específicas de Drools garantiza que la arquitectura sea extensible, fácilmente testeable y adaptable a otros frameworks si el negocio lo requiere.
