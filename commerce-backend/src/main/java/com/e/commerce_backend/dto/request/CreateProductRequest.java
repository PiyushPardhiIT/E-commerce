package com.e.commerce_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    private Integer stockQuantity;

    private String imageUrl;

    @NotNull(message = "Category is required")
    private Long categoryId;
}