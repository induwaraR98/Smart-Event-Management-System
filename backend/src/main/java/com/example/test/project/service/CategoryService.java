package com.example.test.project.service;

import com.example.test.project.model.Category;
import com.example.test.project.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    public Optional<Category> getCategoryById(int id) {
        return categoryRepo.findById(id);
    }

    public Category createCategory(Category category) {
        if (categoryRepo.existsByName(category.getName())) {
            throw new RuntimeException("Category name already exists");
        }
        return categoryRepo.save(category);
    }

    public Optional<Category> updateCategory(int id, Category updatedCategory) {
        return categoryRepo.findById(id).map(existing -> {
            if (!existing.getName().equals(updatedCategory.getName()) && categoryRepo.existsByName(updatedCategory.getName())) {
                throw new RuntimeException("Category name already exists");
            }
            existing.setName(updatedCategory.getName());
            existing.setDescription(updatedCategory.getDescription());
            return categoryRepo.save(existing);
        });
    }

    public boolean deleteCategory(int id) {
        if (categoryRepo.existsById(id)) {
            categoryRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
