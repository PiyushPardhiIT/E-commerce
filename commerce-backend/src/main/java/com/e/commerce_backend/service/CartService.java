package com.e.commerce_backend.service;

import com.e.commerce_backend.dto.request.AddToCartRequest;
import com.e.commerce_backend.dto.request.UpdateCartRequest;
import com.e.commerce_backend.dto.response.CartItemResponse;
import com.e.commerce_backend.dto.response.CartResponse;
import com.e.commerce_backend.entity.CartItem;
import com.e.commerce_backend.entity.Product;
import com.e.commerce_backend.entity.User;
import com.e.commerce_backend.exception.ResourceNotFoundException;
import com.e.commerce_backend.repository.CartRepository;
import com.e.commerce_backend.repository.ProductRepository;
import com.e.commerce_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // ── Add to cart ───────────────────────────────────────────────────
    public CartResponse addToCart(AddToCartRequest request, String userEmail) {

        User user = getUser(userEmail);

        Product product = productRepository
                .findByIdAndActiveTrue(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        // Check stock availability
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: "
                    + product.getStockQuantity());
        }

        // If product already in cart → update quantity
        Optional<CartItem> existingItem = cartRepository
                .findByUserIdAndProductId(user.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartRepository.save(item);
        } else {
            // Add new cart item
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartRepository.save(newItem);
        }

        return getCart(userEmail);
    }

    // ── Get cart ──────────────────────────────────────────────────────
    public CartResponse getCart(String userEmail) {
        User user = getUser(userEmail);
        List<CartItem> items = cartRepository.findByUserId(user.getId());
        return buildCartResponse(items);
    }

    // ── Update quantity ───────────────────────────────────────────────
    public CartResponse updateCartItem(Long cartItemId,
                                       UpdateCartRequest request,
                                       String userEmail) {
        User user = getUser(userEmail);

        CartItem item = cartRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart item not found"));

        // Security: make sure this cart item belongs to this user
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("This cart item does not belong to you");
        }

        // Check stock
        if (item.getProduct().getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: "
                    + item.getProduct().getStockQuantity());
        }

        item.setQuantity(request.getQuantity());
        cartRepository.save(item);

        return getCart(userEmail);
    }

    // ── Remove single item ────────────────────────────────────────────
    public CartResponse removeFromCart(Long cartItemId, String userEmail) {
        User user = getUser(userEmail);

        CartItem item = cartRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("This cart item does not belong to you");
        }

        cartRepository.delete(item);
        return getCart(userEmail);
    }

    // ── Clear entire cart ─────────────────────────────────────────────
    @Transactional
    public void clearCart(String userEmail) {
        User user = getUser(userEmail);
        cartRepository.deleteByUserId(user.getId());
    }

    // ── Private helpers ───────────────────────────────────────────────

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    private CartResponse buildCartResponse(List<CartItem> items) {

        List<CartItemResponse> itemResponses = items.stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        // Calculate total
        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .items(itemResponses)
                .totalItems(itemResponses.size())
                .totalAmount(totalAmount)
                .build();
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
        BigDecimal subtotal = item.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponse.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .imageUrl(item.getProduct().getImageUrl())
                .price(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .subtotal(subtotal)
                .addedAt(item.getAddedAt())
                .build();
    }
}