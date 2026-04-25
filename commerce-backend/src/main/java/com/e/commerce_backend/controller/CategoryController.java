package com.e.commerce_backend.controller;

import com.e.commerce_backend.dto.request.CategoryRequest;
import com.e.commerce_backend.dto.response.CategoryResponse;
import com.e.commerce_backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // ── Admin endpoints ───────────────────────────────────────────────

    @PostMapping("/api/admin/categories")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @PutMapping("/api/admin/categories/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/api/admin/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // ── Public endpoints ──────────────────────────────────────────────

    @GetMapping("/api/public/categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/api/public/categories/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }
}