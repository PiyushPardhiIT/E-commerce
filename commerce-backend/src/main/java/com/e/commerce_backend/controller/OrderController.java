package com.e.commerce_backend.controller;

import com.e.commerce_backend.dto.request.PlaceOrderRequest;
import com.e.commerce_backend.dto.request.UpdateOrderStatusRequest;
import com.e.commerce_backend.dto.response.OrderResponse;
import com.e.commerce_backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ── Customer endpoints ────────────────────────────────────────────

    @PostMapping("/api/customer/orders")
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                orderService.placeOrder(request, userDetails.getUsername())
        );
    }

    @GetMapping("/api/customer/orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                orderService.getMyOrders(userDetails.getUsername())
        );
    }

    @GetMapping("/api/customer/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                orderService.getOrderById(id, userDetails.getUsername())
        );
    }

    @PutMapping("/api/customer/orders/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                orderService.cancelOrder(id, userDetails.getUsername())
        );
    }

    // ── Seller/Admin endpoints ────────────────────────────────────────

    @PutMapping("/api/seller/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                orderService.updateOrderStatus(id, request)
        );
    }

    @GetMapping("/api/admin/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}