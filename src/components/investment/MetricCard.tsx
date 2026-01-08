"use client";

import React from 'react';
import styles from './MetricCard.module.css';

interface MetricCardProps {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    icon?: React.ReactNode;
}

export default function MetricCard({ title, value, change, isPositive, icon }: MetricCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                {icon && <div className={styles.icon}>{icon}</div>}
            </div>
            <div className={styles.value}>{value}</div>
            {change && (
                <div className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
                    <span>{isPositive ? '↑' : '↓'}</span>
                    <span>{change}</span>
                </div>
            )}
        </div>
    );
}
