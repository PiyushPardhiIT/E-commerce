package com.e.commerce_backend.service;

import com.e.commerce_backend.dto.request.PlaceOrderRequest;
import com.e.commerce_backend.dto.request.UpdateOrderStatusRequest;
import com.e.commerce_backend.dto.response.OrderItemResponse;
import com.e.commerce_backend.dto.response.OrderResponse;
import com.e.commerce_backend.entity.*;
import com.e.commerce_backend.exception.ResourceNotFoundException;
import com.e.commerce_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // ── Place Order ───────────────────────────────────────────────────
    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request,
                                    String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Get cart items
        List<CartItem> cartItems = cartRepository
                .findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Build order items + calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .shippingStreet(request.getStreet())
                .shippingCity(request.getCity())
                .shippingState(request.getState())
                .shippingZipCode(request.getZipCode())
                .shippingCountry(request.getCountry())
                .totalAmount(BigDecimal.ZERO) // set after items
                .build();

        Order savedOrder = orderRepository.save(order);

        // Create order items from cart
        List<OrderItem> orderItems = new java.util.ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            // Check stock
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for: " + product.getName()
                );
            }

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .productName(product.getName())       // snapshot
                    .priceAtPurchase(product.getPrice())  // snapshot
                    .quantity(cartItem.getQuantity())
                    .subtotal(subtotal)
                    .build();

            orderItems.add(orderItem);

            // Decrement stock
            product.setStockQuantity(
                    product.getStockQuantity() - cartItem.getQuantity()
            );
            productRepository.save(product);
        }

        // Update order total
        savedOrder.setTotalAmount(totalAmount);
        savedOrder.setOrderItems(orderItems);
        orderRepository.save(savedOrder);

        // Clear cart
        cartRepository.deleteByUserId(user.getId());

        return mapToResponse(savedOrder);
    }

    // ── Get My Orders ─────────────────────────────────────────────────
    public List<OrderResponse> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get Order By Id ───────────────────────────────────────────────
    public OrderResponse getOrderById(Long orderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        // Security: customer can only see their own orders
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(order);
    }

    // ── Update Order Status (Seller/Admin) ────────────────────────────
    public OrderResponse updateOrderStatus(Long orderId,
                                           UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        order.setStatus(request.getStatus());
        return mapToResponse(orderRepository.save(order));
    }

    // ── Get All Orders (Admin) ────────────────────────────────────────
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Cancel Order ──────────────────────────────────────────────────
    public OrderResponse cancelOrder(Long orderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        // Can only cancel PENDING or CONFIRMED orders
        if (order.getStatus() != OrderStatus.PENDING &&
                order.getStatus() != OrderStatus.CONFIRMED) {
            throw new RuntimeException(
                    "Cannot cancel order with status: " + order.getStatus()
            );
        }

        order.setStatus(OrderStatus.CANCELLED);
        return mapToResponse(orderRepository.save(order));
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems() == null
                ? List.of()
                : order.getOrderItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productName(item.getProductName())
                        .priceAtPurchase(item.getPriceAtPurchase())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        String shippingAddress = order.getShippingStreet() + ", "
                + order.getShippingCity() + ", "
                + order.getShippingState() + " "
                + order.getShippingZipCode() + ", "
                + order.getShippingCountry();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(shippingAddress)
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .build();
    }
}