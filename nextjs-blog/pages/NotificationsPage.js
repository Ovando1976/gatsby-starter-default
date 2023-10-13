// Import styles
import styles from './styles/NotificationsPage.module.css';
import React from 'react';
import Notifications from './NotificationsPage';

export default function NotificationsPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Your Notifications</h1>
            <Notifications />
        </div>
    );
}

export { Notifications };


