package com.e.commerce_backend.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private Long categoryId;
}