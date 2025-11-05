import React, { useEffect, useState } from "react";
import "./ExpenseTracker.css"; // CSS file ko import karein

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  // Edit/Update ke liye naya state
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const API_URL = "http://localhost:8080/api/expenses";

  // Expenses fetch karna
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => setExpenses(data))
      .catch((err) => setError(err.message));
  }, []);

  // Naya expense add karna
  const addExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) {
      alert("Please fill all required fields");
      return;
    }
    const newExpense = {
      title,
      amount: parseFloat(amount),
      category,
      date,
      description,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add expense");
      }
      const savedExpense = await res.json();
      setExpenses((prev) => [...prev, savedExpense]);
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      setDescription("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Expense delete karna (Naya function)
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      } else {
        throw new Error("Failed to delete expense");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit mode shuru karna (Naya function)
  const startEdit = (expense) => {
    setEditId(expense.id);
    setEditData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description || "",
    });
  };

  // Edit cancel karna (Naya function)
  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  // Edit input change handle karna (Naya function)
  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Edit save karna (Naya function)
  const saveEdit = async (id) => {
    if (
      !editData.title ||
      !editData.amount ||
      !editData.category ||
      !editData.date
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editData.title,
          amount: parseFloat(editData.amount),
          category: editData.category,
          date: editData.date,
          description: editData.description,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update expense");
      }

      const updatedExpense = await res.json();
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? updatedExpense : exp))
      );
      setEditId(null);
      setEditData({});
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const total = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);

  return (
    <div className="page-container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <h2 className="heading">Add Expense</h2>

        {error && <div className="error-box">Error: {error}</div>}

        <form onSubmit={addExpense} className="form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="input"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-full"
          />
          <button type="submit" className="button">
            Add
          </button>
        </form>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h2 className="heading-secondary">Your Expenses</h2>

        <div className="list-container">
          <ul>
            {expenses.map((exp) => (
              <li key={exp.id} className="expense-item">
                {editId === exp.id ? (
                  /* --- EDIT MODE --- */
                  <div className="edit-form">
                    <input
                      className="input-edit"
                      value={editData.title}
                      onChange={(e) => handleEditChange("title", e.target.value)}
                    />
                    <input
                      className="input-edit"
                      type="number"
                      value={editData.amount}
                      onChange={(e) =>
                        handleEditChange("amount", e.target.value)
                      }
                    />
                    <input
                      className="input-edit"
                      value={editData.category}
                      onChange={(e) =>
                        handleEditChange("category", e.target.value)
                      }
                    />
                    <input
                      className="input-edit"
                      type="date"
                      value={editData.date}
                      onChange={(e) => handleEditChange("date", e.target.value)}
                    />
                    <input
                      className="input-edit"
                      style={{ flexBasis: "100%" }} // Description input poori width le
                      placeholder="Description"
                      value={editData.description}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                    />
                    <div className="button-group">
                      <button
                        className="button-small save-btn"
                        onClick={() => saveEdit(exp.id)}
                      >
                        Save
                      </button>
                      <button
                        className="button-small cancel-btn"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- DISPLAY MODE --- */
                  <>
                    <span className="expense-info">
                      <span className="title">{exp.title}</span>
                      <span className="amount">₹{exp.amount.toFixed(2)}</span>
                      <span className="details"> {exp.category} | {exp.date}</span>
                      {exp.description && <span className="details" style={{marginTop: 4, display: 'block'}}>Desc: {exp.description}</span>}
                    </span>
                    <div className="button-group">
                      <button
                        className="button-small edit-btn"
                        onClick={() => startEdit(exp)}
                      >
                        Edit
                      </button>
                      <button
                        className="button-small delete-btn"
                        onClick={() => deleteExpense(exp.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        <h3 className="total">Total: ₹{total.toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default ExpenseTracker;