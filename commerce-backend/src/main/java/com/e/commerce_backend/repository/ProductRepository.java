package com.e.commerce_backend.repository;

import com.e.commerce_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();

    List<Product> findBySellerIdAndActiveTrue(Long sellerId);

    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);

    Optional<Product> findByIdAndActiveTrue(Long id);
}