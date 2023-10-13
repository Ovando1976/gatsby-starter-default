// File: Expenses.js

import React, { useState } from 'react';
import styles from './styles/expenses.module.css';
import { interpretReceipt } from './utils/interpretReceipt';  // Adjust the import path accordingly

function Expenses() {
    const [image, setImage] = useState(null);
    const [expenseDetails, setExpenseDetails] = useState('');
    const loading = true;

    const handleImageCapture = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = async () => {
            setImage(reader.result);
            try {
                const interpretation = await interpretReceipt(reader.result);
                setExpenseDetails(interpretation);
            } catch (interpretationError) {
                console.error('Interpretation failed:', interpretationError);
                setExpenseDetails('Failed to interpret receipt. Please try again.');
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    function handleRemoveImage(imageId) {
      // Find the image element with the given ID
      const imageElement = document.getElementById(imageId);
    
      // If the image element exists, remove it
      if (imageElement) {
        imageElement.parentNode.removeChild(imageElement);
      }
    } 


  return (
    <div className={styles.container}>
      <h1>Track Your Expenses</h1>

      <div className={styles.captureSection}>
        <label>
          Capture Receipt:
          <input type="file" accept="image/*" capture="camera" onChange={handleImageCapture} aria-label="Capture Receipt" />
        </label>
      </div>

      {loading && <p>Loading...</p>}

      {image && (
        <div className={styles.imagePreview}>
          <img src={image} alt="Captured receipt showing expense details" className={styles.receiptImage} />
          <button onClick={handleRemoveImage} className={styles.removeImageButton}>Remove Image</button>
        </div>
      )}

      <div className={styles.expenseDetails}>
        <h2>Expense Details</h2>
        <p>{expenseDetails}</p>
      </div>
    </div>
  );
}

export default Expenses;
