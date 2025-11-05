package com.dushyant.first.Expense.service;

import com.dushyant.first.Expense.exception.ResourseNotFoundeException;
import com.dushyant.first.Expense.model.ExpenseModel;
import com.dushyant.first.Expense.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository repo;

    public ExpenseService(ExpenseRepository repo) {
        this.repo = repo;
    }

    public ExpenseModel createExpense(ExpenseModel e) {
        return repo.save(e);
    }

    public List<ExpenseModel> getAllExpenses() {
        return repo.findAll();
    }

    public ExpenseModel getExpenseById(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourseNotFoundeException("Expense not found with id " + id));
    }

    public ExpenseModel updateExpense(Long id, ExpenseModel updated) {
        ExpenseModel e = getExpenseById(id);
        e.setTitle(updated.getTitle());
        e.setAmount(updated.getAmount());
        e.setCategory(updated.getCategory());
        e.setDescription(updated.getDescription());
        e.setDate(updated.getDate());
        return repo.save(e);
    }

    public void deleteExpense(Long id) {
        ExpenseModel e = getExpenseById(id);
        repo.delete(e);
    }
}