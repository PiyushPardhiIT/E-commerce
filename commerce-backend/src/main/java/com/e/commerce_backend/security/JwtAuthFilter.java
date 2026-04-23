package com.e.commerce_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // ── Step 1: Get Authorization header ─────────────────────────
        final String authHeader = request.getHeader("Authorization");

        // ── Step 2: No token? Skip this filter entirely ───────────────
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ── Step 3: Extract token (cut off "Bearer " prefix) ──────────
        final String jwt = authHeader.substring(7);

        // ── Step 4: Extract email from token ──────────────────────────
        final String userEmail = jwtService.extractUsername(jwt);

        // ── Step 5: Only proceed if email exists + not yet authenticated
        if (userEmail != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // ── Step 6: Load user from DB ─────────────────────────────
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(userEmail);

            // ── Step 7: Validate token ────────────────────────────────
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // ── Step 8: Build authentication object ──────────────
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,                          // credentials (not needed after auth)
                                userDetails.getAuthorities()   // roles
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // ── Step 9: Register user in SecurityContext ──────────
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // ── Step 10: Always continue the filter chain ─────────────────
        filterChain.doFilter(request, response);
    }
}