//package com.example.gateway.config;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
//import org.springframework.boot.web.server.WebServerFactoryCustomizer;
//import org.springframework.stereotype.Component;
//
//@Component
//public class PortConfig implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {
//
//    @Value("포트번호(7890이었음)")
//    private String gatewayPort;
//
//    @Override
//    public void customize(TomcatServletWebServerFactory factory) {
//        try {
//            int port = Integer.parseInt(gatewayPort);
//            factory.setPort(port);
//        } catch (NumberFormatException e) {
//            throw new IllegalArgumentException("유효하지 않은 포트번호입니다.");
//        }
//    }
//}
