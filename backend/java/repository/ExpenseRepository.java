package com.dushyant.first.Expense.repository;

import com.dushyant.first.Expense.model.ExpenseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<ExpenseModel, Long> {
}