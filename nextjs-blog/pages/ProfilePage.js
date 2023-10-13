import React, { useState } from 'react';
import styles from './styles/ProfilePicturePage.module.css';

function ProfilePicturePage() {
    const [image, setImage] = useState(null);  // State to hold the image

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.match(/image.*/)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Update Profile Picture</h1>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className={styles.fileInput}
            />
            {image && <img src={image} alt="Profile" className={styles.profileImage} />}
            <button className={styles.updateButton}>Update Profile Picture</button>
        </div>
    );
}

export default ProfilePicturePage;
