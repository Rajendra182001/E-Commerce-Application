package com.xworkz.springboot_backend.service;

import com.xworkz.springboot_backend.dto.ProductDto;
import com.xworkz.springboot_backend.modal.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProducts();

    ProductDto getProduct(Integer id);

    ProductDto addProduct(ProductDto productDto,MultipartFile multipartFile) throws IOException;

    ProductDto updateProduct(Integer id, ProductDto productDto, MultipartFile imageFile) throws IOException;

    boolean deleteProduct(Integer id);


}
