"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './ApiSettings.module.css';

interface ExchangeConnection {
    user_id?: string;
    exchange_platform: 'binance' | 'bitget' | 'coinbase' | string;
    api_key_encrypted: string | null;
    api_secret_encrypted: string | null;
}

export default function ApiSettings() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [connection, setConnection] = useState<ExchangeConnection | null>(null);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [apiSecretInput, setApiSecretInput] = useState('');
    const [selectedExchange, setSelectedExchange] = useState('binance');
    const [savingStr, setSavingStr] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);

    // Fetch User & Connection
    useEffect(() => {
        async function fetchData() {
            try {
                let authUser = null;
                const { data: { user: u1 }, error: e1 } = await supabase.auth.getUser();
                if (u1) authUser = u1;
                else {
                    // Fallback to session if getUser fails (e.g. strict token validation issues)
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) authUser = session.user;
                }

                if (authUser) {
                    setUser(authUser);
                    const { data: connectionData } = await supabase
                        .from('user_exchange_connections')
                        .select('*')
                        .eq('user_id', authUser.id)
                        .maybeSingle();

                    if (connectionData) {
                        setConnection(connectionData);
                        setSelectedExchange(connectionData.exchange_platform || 'binance');
                    }
                } else {
                    console.warn('No user found in ApiSettings');
                }
            } catch (error) {
                console.error('Error fetching user or connection:', error);
            } finally {
                setLoadingUser(false);
            }
        }
        fetchData();
    }, []);

    const updateConnection = async () => {
        let currentUser = user;
        if (!currentUser) {
            // Try one last time to get the user
            const { data: { user: u2 } } = await supabase.auth.getUser();
            if (u2) {
                currentUser = u2;
                setUser(u2);
            } else {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    currentUser = session.user;
                    setUser(session.user);
                }
            }
        }

        if (!currentUser) {
            alert('Chyba: Uživatel nebyl rozpoznán. Zkuste obnovit stránku nebo se znovu přihlásit.');
            return;
        }

        setSavingStr(true);
        try {
            if (connection) {
                const { error } = await supabase
                    .from('user_exchange_connections')
                    .update({
                        exchange_platform: selectedExchange,
                        api_key_encrypted: apiKeyInput || connection.api_key_encrypted,
                        api_secret_encrypted: apiSecretInput || connection.api_secret_encrypted,
                        is_active: true
                    })
                    .eq('user_id', currentUser.id);
                if (error) throw error;
            } else {
                // Double check if connection exists to avoid duplicates
                const { data: existing } = await supabase
                    .from('user_exchange_connections')
                    .select('id')
                    .eq('user_id', currentUser.id)
                    .maybeSingle();

                if (existing) {
                    const { error } = await supabase
                        .from('user_exchange_connections')
                        .update({
                            exchange_platform: selectedExchange,
                            api_key_encrypted: apiKeyInput,
                            api_secret_encrypted: apiSecretInput,
                            is_active: true
                        })
                        .eq('user_id', currentUser.id);
                    if (error) throw error;
                } else {
                    const { error } = await supabase
                        .from('user_exchange_connections')
                        .insert({
                            user_id: currentUser.id,
                            exchange_platform: selectedExchange,
                            api_key_encrypted: apiKeyInput,
                            api_secret_encrypted: apiSecretInput,
                            is_active: true
                        });
                    if (error) throw error;
                }
            }

            alert('API připojení úspěšně uloženo.');

            const { data } = await supabase.from('user_exchange_connections').select('*').eq('user_id', currentUser.id).single();
            if (data) setConnection(data);

            setApiKeyInput('');
            setApiSecretInput('');
        } catch (err: any) {
            console.error('Error updating connection:', err);
            alert('Chyba při ukládání API: ' + (err.message || 'Neznámá chyba'));
        } finally {
            setSavingStr(false);
        }
    };

    if (loadingUser) {
        return (
            <div className={styles.section}>
                <div className={styles.contentPanel}>
                    <h3 className={styles.panelTitle}>Načítání nastavení...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.section}>
            <div className={styles.contentPanel}>
                <h3 className={styles.panelTitle}>Připojení API</h3>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Výběr burzy</label>
                    <select
                        className={styles.select}
                        value={selectedExchange}
                        onChange={(e) => setSelectedExchange(e.target.value)}
                    >
                        <option value="binance">Binance</option>
                        <option value="bitget">Bitget</option>
                        <option value="coinbase">Coinbase</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>API Key</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder={connection?.api_key_encrypted ? "Klikněte pro změnu klíče" : "Vložte API Key"}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Secret Key</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={apiSecretInput}
                        onChange={(e) => setApiSecretInput(e.target.value)}
                        placeholder={connection?.api_secret_encrypted ? "Klikněte pro změnu klíče" : "Vložte Secret Key"}
                    />
                </div>

                <button
                    className={styles.saveButton}
                    onClick={updateConnection}
                    disabled={savingStr}
                >
                    {savingStr ? 'Ukládám...' : 'Uložit připojení'}
                </button>
            </div>
        </div>
    );
}
