
// package com.eduvibe.backend.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//         @Bean
//         public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//             http
//                 .authorizeHttpRequests(auth -> auth
//                     .requestMatchers("/api/auth/signup", "/api/auth/login").permitAll()
//                     .anyRequest().authenticated()
//                 )
//                 .csrf(csrf -> csrf.disable()); // Disable CSRF for simplicity (enable in production with proper configuration)
//             return http.build();
//         }
// }

// package com.eduvibe.backend.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers("/api/auth/signup", "/api/auth/login", "/api/posts/**").permitAll()
//                 .anyRequest().authenticated()
//             )
//             .csrf(csrf -> csrf.disable());
//         return http.build();
//     }
// }

package com.eduvibe.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http

            .cors().and()
            .csrf().disable() // disable for APIs, or use token-based CSRF
            .authorizeHttpRequests((authz) -> authz
                .anyRequest().permitAll() // allow all requests
            );

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/signup", "/api/auth/login").permitAll()
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable()); // Disable CSRF for simplicity (enable in production with proper configuration)
        return http.build();
    }
}

                .requestMatchers("/api/auth/signup", "/api/auth/login", "/api/posts/**").permitAll()
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
