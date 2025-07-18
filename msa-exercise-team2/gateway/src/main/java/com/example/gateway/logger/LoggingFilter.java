package com.example.gateway.logger;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingFilter implements GatewayFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain){
        System.out.println("Request URI: " + exchange.getRequest().getURI());

        exchange.getResponse().beforeCommit(() -> {
            System.out.println("Response status: " + exchange.getResponse().getStatusCode());
            return Mono.empty();
        });

        return chain.filter(exchange);
    }
}
