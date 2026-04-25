package com.e.commerce_backend.service;

import com.e.commerce_backend.dto.request.CategoryRequest;
import com.e.commerce_backend.dto.response.CategoryResponse;
import com.e.commerce_backend.entity.Category;
import com.e.commerce_backend.exception.DuplicateResourceException;
import com.e.commerce_backend.exception.ResourceNotFoundException;
import com.e.commerce_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // ── Create ────────────────────────────────────────────────────────
    public CategoryResponse createCategory(CategoryRequest request) {

        // Check for duplicate name
        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Category already exists: " + request.getName()
            );
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    // ── Get All ───────────────────────────────────────────────────────
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get By Id ─────────────────────────────────────────────────────
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id)
                );
        return mapToResponse(category);
    }

    // ── Update ────────────────────────────────────────────────────────
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id)
                );

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updated = categoryRepository.save(category);
        return mapToResponse(updated);
    }

    // ── Delete ────────────────────────────────────────────────────────
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + id)
                );
        categoryRepository.delete(category);
    }

    // ── Mapper ────────────────────────────────────────────────────────
    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .build();
    }
}