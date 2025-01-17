import React, { useState } from "react";
import styles from "./styles/expenses.module.css";
import { interpretReceipt } from "../src/utils/interpretReceipt"; // Adjust path if necessary

function Expenses() {
  const [image, setImage] = useState(null);
  const [expenseDetails, setExpenseDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]); // Array to store expenses
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      setImage(reader.result);
      setLoading(true);

      try {
        const interpretation = await interpretReceipt(reader.result);
        setExpenseDetails(interpretation);
      } catch (error) {
        console.error("Interpretation failed:", error);
        setExpenseDetails("Failed to interpret receipt. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses((prev) => [...prev, newExpense]);
      setNewExpense({ description: "", amount: "" });
    }
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
  };

  return (
    <div className={styles.container}>
      <h1>Track Your Expenses</h1>

      {/* Capture Receipt Section */}
      <div className={styles.captureSection}>
        <label>
          Capture Receipt:
          <input
            type="file"
            accept="image/*"
            capture="camera"
            onChange={handleImageCapture}
            aria-label="Capture Receipt"
          />
        </label>
      </div>

      {loading && <p>Loading...</p>}

      {/* Receipt Preview */}
      {image && (
        <div className={styles.imagePreview}>
          <img
            src={image}
            alt="Captured receipt showing expense details"
            className={styles.receiptImage}
          />
          <p>{expenseDetails}</p>
        </div>
      )}

      {/* Add Manual Expense */}
      <div className={styles.addExpenseSection}>
        <h2>Add Manual Expense</h2>
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) =>
            setNewExpense((prev) => ({ ...prev, description: e.target.value }))
          }
          className={styles.inputField}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense((prev) => ({ ...prev, amount: e.target.value }))
          }
          className={styles.inputField}
        />
        <button onClick={handleAddExpense} className={styles.addButton}>
          Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className={styles.expenseList}>
        <h2>Tracked Expenses</h2>
        {expenses.length > 0 ? (
          <table className={styles.expensesTable}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.description}</td>
                  <td>${parseFloat(expense.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses tracked yet.</p>
        )}
      </div>

      {/* Total Calculation */}
      <div className={styles.totalSection}>
        <h3>Total Expenses: ${calculateTotal()}</h3>
      </div>
    </div>
  );
}

export default Expenses;