import React from "react";
import '../pages/Notifications.module.css';

export default function Notifications() { 
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Your Notifications</h1>
            <div className={styles.notification}>
                <p className={styles.message}>You have a new message from John Doe.</p>
                <button className={styles.replyButton}>Reply</button>   
                </div>
        </div>
    );
}