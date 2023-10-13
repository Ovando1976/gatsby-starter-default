import React, { useState } from 'react';
import styles from './styles/expenses.module.css';


function Expenses() {
  const [image, setImage] = useState(null);
  const [expenseDetails, setExpenseDetails] = useState('');

  // Simulating GPT-4 visual capabilities
  const interpretReceipt = (img) => {
    // TODO: Integrate with GPT-4 once it's officially available for image interpretation
    return 'Sample receipt interpretation: $10 for coffee, $20 for meal';
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      const interpretation = interpretReceipt(reader.result);
      setExpenseDetails(interpretation);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Track Your Expenses</h1>
      
      <div className={styles.captureSection}>
        <label>
          Capture Receipt:
          <input type="file" accept="image/*" capture="camera" onChange={handleImageCapture} />
        </label>
      </div>

      {image && <img src={image} alt="Captured receipt" className={styles.receiptImage} />}
      
      <div className={styles.expenseDetails}>
        <h2>Expense Details</h2>
        <p>{expenseDetails}</p>
      </div>
    </div>
  );
}

export default Expenses;
