package com.e.commerce_backend.service;

import com.e.commerce_backend.dto.request.CreateProductRequest;
import com.e.commerce_backend.dto.request.UpdateProductRequest;
import com.e.commerce_backend.dto.response.ProductResponse;
import com.e.commerce_backend.entity.Category;
import com.e.commerce_backend.entity.Product;
import com.e.commerce_backend.entity.User;
import com.e.commerce_backend.exception.ResourceNotFoundException;
import com.e.commerce_backend.repository.CategoryRepository;
import com.e.commerce_backend.repository.ProductRepository;
import com.e.commerce_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // ── Create ────────────────────────────────────────────────────────
    public ProductResponse createProduct(CreateProductRequest request,
                                         String sellerEmail) {
        // Load seller
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seller not found"));

        // Load category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .category(category)
                .seller(seller)
                .active(true)
                .build();

        return mapToResponse(productRepository.save(product));
    }

    // ── Update ────────────────────────────────────────────────────────
    public ProductResponse updateProduct(Long productId,
                                         UpdateProductRequest request,
                                         String sellerEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        // ✅ Ownership check — most important security step
        if (!product.getSeller().getEmail().equals(sellerEmail)) {
            throw new AccessDeniedException(
                    "You are not allowed to edit this product"
            );
        }

        // Only update fields that are provided
        if (request.getName() != null)
            product.setName(request.getName());
        if (request.getDescription() != null)
            product.setDescription(request.getDescription());
        if (request.getPrice() != null)
            product.setPrice(request.getPrice());
        if (request.getStockQuantity() != null)
            product.setStockQuantity(request.getStockQuantity());
        if (request.getImageUrl() != null)
            product.setImageUrl(request.getImageUrl());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        return mapToResponse(productRepository.save(product));
    }

    // ── Soft Delete ───────────────────────────────────────────────────
    public void deleteProduct(Long productId, String sellerEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getEmail().equals(sellerEmail)) {
            throw new AccessDeniedException(
                    "You are not allowed to delete this product"
            );
        }

        product.setActive(false); // soft delete — not removed from DB
        productRepository.save(product);
    }

    // ── Get My Products (Seller) ──────────────────────────────────────
    public List<ProductResponse> getMyProducts(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seller not found"));

        return productRepository.findBySellerIdAndActiveTrue(seller.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Public: Get All ───────────────────────────────────────────────
    public List<ProductResponse> getAllPublicProducts() {
        return productRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Public: Get By Id ─────────────────────────────────────────────
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));
        return mapToResponse(product);
    }

    // ── Public: Search ────────────────────────────────────────────────
    public List<ProductResponse> searchProducts(String name, Long categoryId) {
        if (name != null && !name.isEmpty()) {
            return productRepository
                    .findByNameContainingIgnoreCaseAndActiveTrue(name)
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        if (categoryId != null) {
            return productRepository
                    .findByCategoryIdAndActiveTrue(categoryId)
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        return getAllPublicProducts();
    }

    // ── Admin: Get All ────────────────────────────────────────────────
    public List<ProductResponse> getAllProductsForAdmin() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Mapper ────────────────────────────────────────────────────────
    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .active(product.isActive())
                .categoryName(product.getCategory().getName())
                .sellerName(product.getSeller().getFullName())
                .createdAt(product.getCreatedAt())
                .build();
    }
}