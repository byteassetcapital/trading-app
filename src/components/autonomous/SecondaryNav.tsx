"use client";

import React from 'react';
import styles from './SecondaryNav.module.css';

interface SecondaryNavProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

const sections = [
    { id: 'overview', label: 'Přehled' },
    { id: 'trading_settings', label: 'Nastavení tradingu' },
    { id: 'funds', label: 'Správa prostředků' },
    { id: 'api', label: 'Nastavení API' }
];

export default function SecondaryNav({ activeSection, onSectionChange }: SecondaryNavProps) {
    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                {sections.map((section) => (
                    <button
                        key={section.id}
                        className={`${styles.navButton} ${activeSection === section.id ? styles.active : ''}`}
                        onClick={() => onSectionChange(section.id)}
                    >
                        {section.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
