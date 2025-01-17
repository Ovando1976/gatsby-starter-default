import React from 'react';
import Notifications from '../src/components/Notifications';
import styles from './Notifications.module.css';


export default function NotificationsPage() { 
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Your Notifications</h1>
            <Notifications />
        </div>
    );
}