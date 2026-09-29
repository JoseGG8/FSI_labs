package com.udea.droolrules.ai;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIExplanationService {
    private final ChatClient chatClient;

    public AIExplanationService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }
    
    public String explain(String decision) {
        String prompt = """
                Eres un experto en reglas bancarias.
                Explica el siguiente resultado generado por Drools.
                Resultado:
                %s
                Explica:
                - Qué regla se activó
                - Por qué se activó
                - Qué significa para el cliente
                """.formatted(decision);
        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}