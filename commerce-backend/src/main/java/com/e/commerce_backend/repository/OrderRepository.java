package com.e.commerce_backend.repository;

import com.e.commerce_backend.entity.Order;
import com.e.commerce_backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Order> findByOrderNumberAndUserId(String orderNumber, Long userId);

    List<Order> findByStatus(OrderStatus status);
}