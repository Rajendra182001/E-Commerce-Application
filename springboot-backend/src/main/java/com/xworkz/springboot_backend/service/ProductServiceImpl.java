package com.xworkz.springboot_backend.service;

import com.xworkz.springboot_backend.dto.ProductDto;
import com.xworkz.springboot_backend.modal.Product;
import com.xworkz.springboot_backend.repo.ProductRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository repo;

    public List<ProductDto> getAllProducts() {
        List<Product> products = repo.findAll();
        return products.stream().map(product -> {
            ProductDto dto = new ProductDto();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setDescription(product.getDescription());
            dto.setBrand(product.getBrand());
            dto.setCategory(product.getCategory());
            dto.setPrice(product.getPrice()); // BigDecimal same
            dto.setQuantity(product.getQuantity()); // map correctly
            dto.setAvailable(product.isAvailable()); // correct field
            dto.setReleaseDate(product.getReleaseDate()); // Date same
            dto.setImageName(product.getImageName());
            return dto;
        }).collect(Collectors.toList());
    }

    public ProductDto getProduct(Integer id) {
        Product product = repo.findById(id).orElse(null);
        if (product != null) {
            ProductDto dto = new ProductDto();
            BeanUtils.copyProperties(product, dto);
            return dto;
        }
        return null;
    }

    public ProductDto addProduct(ProductDto productDto,MultipartFile imageFile) throws IOException {
        Product product = new Product();
        BeanUtils.copyProperties(productDto, product);
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageData(imageFile.getBytes());
        }
         repo.save(product);
        return productDto;
    }

    public ProductDto updateProduct(Integer id, ProductDto dto, MultipartFile multipartFile) throws IOException {
        Product existing = repo.findById(id).orElse(null);
        if (existing != null) {
            BeanUtils.copyProperties(dto, existing, "id", "imageData");

            if (multipartFile != null && !multipartFile.isEmpty()) {
                existing.setImageName(multipartFile.getOriginalFilename());
                existing.setImageType(multipartFile.getContentType());
                existing.setImageData(multipartFile.getBytes());
            }

            Product updated = repo.save(existing);

            ProductDto updatedDto = new ProductDto();
            BeanUtils.copyProperties(updated, updatedDto);
            return updatedDto;
        }
        return null;
    }

    public boolean deleteProduct(Integer id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
