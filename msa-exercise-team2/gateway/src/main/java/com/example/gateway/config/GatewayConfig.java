//package com.example.gateway.config;
//
//import com.example.gateway.logger.LoggingFilter;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.cloud.gateway.route.RouteLocator;
//import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class GatewayConfig {
//
//    @Value("lb//SIMPLE")
//    private String gatewayServiceUri;
//
//    @Bean
//    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, LoggingFilter loggingFilter){
//        System.out.println("gateway-service-uri: " + gatewayServiceUri);
//
//        return null;
//    }
//}
