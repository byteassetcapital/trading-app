"use client";
import React from 'react';
import Sidebar from '@/components/Sidebar';
import styles from './layout.module.css';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Ideally, add auth check here or middleware
    // For now, we assume middleware handles protection or we just show the layout

    return (
        <div className={styles.protectedLayout}>
            <Sidebar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
