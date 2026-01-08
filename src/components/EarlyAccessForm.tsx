"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EarlyAccessForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [phone, setPhone] = useState('');
    // 1. Přidán stav pro checkbox
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setMessage(null);

        try {
            // 2. Do insertu přidáváme 'checkbox: agreed'
            // Název klíče (checkbox) musí přesně odpovídat názvu sloupce v Supabase
            const { error } = await supabase
                .from('early_access')
                .insert([
                    {
                        email: email,
                        phone: phone || null, // pokud je prázdný, pošle NULL
                        source: 'home',
                        checkbox: agreed // odesílá true/false
                    }
                ]);

            if (error) throw error;

            setMessage({ text: 'Registrace úspěšná! Děkujeme.', type: 'success' });
            setEmail('');
            setPhone('');
            setAgreed(false); // Reset checkboxu
        } catch (error) {
            console.error('Error inserting email:', error);
            setMessage({ text: 'Něco se pokazilo. Zkuste to prosím znovu.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(0.9rem, 30vw, 1rem)' }}> Zaregistrujte se k předběžnému přístupu a my Vás upozorníme!</h2>
            </div>
            <form className="notifyForm" onSubmit={handleSubmit}>
                {message && (
                    <div style={{ color: message.type === 'success' ? '#4caf50' : '#f44336', marginBottom: '1rem', textAlign: 'center' }}>
                        {message.text}
                    </div>
                )}
                <div className="inputRow">
                    <input
                        type="email"
                        placeholder="Váš email"
                        className="emailInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="checkboxContainer">
                    <input
                        type="checkbox"
                        id="info-check"
                        className="customCheckbox"
                        // 3. Propojení checkboxu se stavovou proměnnou
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                    />
                    <label htmlFor="info-check" className="label">
                        Souhlas s GDPR a podmínkami
                    </label>
                </div>

                <button
                    type="submit"
                    className="btn1"
                    disabled={loading}
                >
                    {loading ? 'Odesílám...' : 'Chci 1 000$ Early Access'}
                </button>
            </form>

            <style jsx>{`
        .notifyForm {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          margin: 3rem auto;
          width: 100%;
          max-width: 600px;
          padding: 0 1.5rem;
        }

        .inputRow {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        @media (min-width: 768px) {
          .inputRow {
            flex-direction: row;
          }
        }

        .emailInput {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 12px;
          color: white;
          width: 100%;
          outline: none;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .emailInput:focus {
          border-color: #E49EAC;
          background: rgba(255, 255, 255, 0.1);
        }

        .checkboxContainer {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: #888;
          font-size: 0.9rem;
          width: 100%;
          justify-content: center;
        }
        
        .customCheckbox {
          accent-color: #E49EAC;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .label { cursor: pointer; }
      `}</style>
        </>
    );
}
