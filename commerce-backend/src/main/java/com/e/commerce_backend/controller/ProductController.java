package com.e.commerce_backend.controller;

import com.e.commerce_backend.dto.request.CreateProductRequest;
import com.e.commerce_backend.dto.request.UpdateProductRequest;
import com.e.commerce_backend.dto.response.ProductResponse;
import com.e.commerce_backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ── Seller endpoints ──────────────────────────────────────────────

    @PostMapping("/api/seller/products")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                productService.createProduct(request, userDetails.getUsername())
        );
    }

    @PutMapping("/api/seller/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody UpdateProductRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                productService.updateProduct(id, request, userDetails.getUsername())
        );
    }

    @DeleteMapping("/api/seller/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        productService.deleteProduct(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/seller/products/my")
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                productService.getMyProducts(userDetails.getUsername())
        );
    }

    // ── Public endpoints ──────────────────────────────────────────────

    @GetMapping("/api/public/products")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllPublicProducts());
    }

    @GetMapping("/api/public/products/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/api/public/products/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(
                productService.searchProducts(name, categoryId)
        );
    }

    // ── Admin endpoints ───────────────────────────────────────────────

    @GetMapping("/api/admin/products")
    public ResponseEntity<List<ProductResponse>> getAllProductsAdmin() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }
}
