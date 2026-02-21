package com.xworkz.springboot_backend.repo;

import com.xworkz.springboot_backend.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer> {
    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCategoryIgnoreCaseAndNameContainingIgnoreCase(String category, String name);


}
