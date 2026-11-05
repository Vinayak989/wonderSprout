package com.wondersprout;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaForwardingConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/games").setViewName("forward:/index.html");
        registry.addViewController("/games/**").setViewName("forward:/index.html");
        registry.addViewController("/club").setViewName("forward:/index.html");
        registry.addViewController("/club/**").setViewName("forward:/index.html");
    }
}
