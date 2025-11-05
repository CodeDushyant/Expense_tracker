package com.dushyant.first.Expense.controller;

import com.dushyant.first.Expense.model.ExpenseModel;
import com.dushyant.first.Expense.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public List<ExpenseModel> getAll() {
        return service.getAllExpenses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseModel> getById(@PathVariable Long id) {
        ExpenseModel e = service.getExpenseById(id);
        return ResponseEntity.ok(e);
    }

    @PostMapping
    public ResponseEntity<ExpenseModel> create(@Valid @RequestBody ExpenseModel expense) {
        ExpenseModel saved = service.createExpense(expense);
        return ResponseEntity.created(URI.create("/api/expenses/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseModel> update(@PathVariable Long id, @Valid @RequestBody ExpenseModel expense) {
        ExpenseModel updated = service.updateExpense(id, expense);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
