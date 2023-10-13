import React from 'react';
import styles from './FloatingCard.module.css';

function FloatingCard({ avatarSrc, title, description }) {
    return (
        <div className={styles.card}>
            <img src={avatarSrc} alt={title} className={styles.avatar} />
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
        </div>
    );
}

export default FloatingCard;
