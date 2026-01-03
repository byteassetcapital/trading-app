'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './settings.module.css';

// Types based on User Request
interface UserProfile {
    id: string; // Assuming 'id' matches auth.user.id or there's a user_id column
    first_name: string | null;
    last_name: string | null;
    date_of_birth: string | null;
    nationality: string | null;
    phone: string | null; // Editable?
    account_type: 'autonomous' | 'managed';
}

interface ExchangeConnection {
    user_id?: string;
    exchange_platform: 'binance' | 'bitget' | 'coinbase' | string;
    api_key_encrypted: string | null;
    api_secret_encrypted: string | null;
}

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [connection, setConnection] = useState<ExchangeConnection | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>('profile');

    // Form states
    const [phoneInput, setPhoneInput] = useState('');
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [apiSecretInput, setApiSecretInput] = useState('');
    const [selectedExchange, setSelectedExchange] = useState('binance');

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // 1. Get Auth User
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    console.error('Auth User Error:', authError);
                    // Redirect to login? Or just show empty
                    return;
                }
                setUser(user);

                // 2. Get Profile
                // Assuming 'id' in user_profiles matches the auth user id. 
                // If not, we might need to search by user_id column. 
                // Trying 'id' first as per common Supabase patterns for profiles.
                let { data: profileData, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', user.id) // Try 'id' first
                    .maybeSingle();

                if (!profileData && !profileError) {
                    // If not found by ID, maybe try user_id? Or just assume it doesn't exist yet.
                    // For now, let's stick to the assumption.
                }

                if (profileData) {
                    setProfile(profileData);
                    setPhoneInput(profileData.phone || '');
                }

                // 3. Get Exchange Connection
                // Assuming user_id column here
                const { data: connectionData, error: connectionError } = await supabase
                    .from('user_exchange_connections')
                    .select('*')
                    .eq('user_id', user.id) // Assuming user_id column for connections
                    .maybeSingle();

                if (connectionData) {
                    setConnection(connectionData);
                    setSelectedExchange(connectionData.exchange_platform || 'binance');
                    // We usually don't populate the inputs with the encrypted key directly for security, 
                    // but the user asked to see "Vlořžte API key", implying setting it.
                    // If we have it, maybe placeholder?
                    // "Jen zobrazeno" was NOT said for this. "Poté načtení: Vlořžte API key" -> Load: inputs.
                    // I'll leave inputs empty to imply "Update" or show placeholder "******"
                }

            } catch (err) {
                console.error('Unexpected error fetching settings:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const updateProfile = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ phone: phoneInput })
                .eq('id', user.id);

            if (error) throw error;
            // Update local state
            setProfile(prev => prev ? { ...prev, phone: phoneInput } : null);
            alert('Profil aktualizován');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Chyba při aktualizaci profilu');
        } finally {
            setSaving(false);
        }
    };

    const updateConnection = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // Check if exists
            if (connection) {
                const { error } = await supabase
                    .from('user_exchange_connections')
                    .update({
                        exchange_platform: selectedExchange,
                        api_key_encrypted: apiKeyInput || connection.api_key_encrypted, // Only update if provided
                        api_secret_encrypted: apiSecretInput || connection.api_secret_encrypted
                    })
                    .eq('user_id', user.id); // Assuming PK might be ID, but standard use is updating by user_id
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('user_exchange_connections')
                    .insert({
                        user_id: user.id,
                        exchange_platform: selectedExchange,
                        api_key_encrypted: apiKeyInput,
                        api_secret_encrypted: apiSecretInput
                    });
                if (error) throw error;
            }
            alert('API připojení uloženo');
            // Refresh data
            const { data } = await supabase.from('user_exchange_connections').select('*').eq('user_id', user.id).single();
            if (data) setConnection(data);

            setApiKeyInput('');
            setApiSecretInput('');

        } catch (err) {
            console.error('Error updating connection:', err);
            alert('Chyba při ukládání API');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Settings</h1>
                    <p className={styles.subtitle}>Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
                <p className={styles.subtitle}>Spravujte svůj účet a nastavení</p>
            </header>

            <div className={styles.sectionsList}>

                {/* 1. Nastavení profilu */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader} onClick={() => toggleSection('profile')}>
                        <span className={styles.sectionTitle}>
                            Nastavení profilu
                        </span>
                        <svg
                            className={`${styles.chevron} ${activeSection === 'profile' ? styles.open : ''}`}
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>

                    {activeSection === 'profile' && (
                        <div className={styles.sectionContent}>
                            <div style={{ marginTop: '1.5rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email</label>
                                    <div className={styles.readOnlyField}>{user?.email}</div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Telefon</label>
                                    <input
                                        type="tel"
                                        className={styles.input}
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                        placeholder="Zadejte telefonní číslo"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Jméno</label>
                                    <div className={styles.readOnlyField}>{profile?.first_name || '-'}</div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Přijmení</label>
                                    <div className={styles.readOnlyField}>{profile?.last_name || '-'}</div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Datum narození</label>
                                    <div className={styles.readOnlyField}>{profile?.date_of_birth || '-'}</div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Národnost</label>
                                    <div className={styles.readOnlyField}>{profile?.nationality || '-'}</div>
                                </div>

                                <button
                                    className="btnPrimary"
                                    onClick={updateProfile}
                                    disabled={saving}
                                    style={{ width: '100%', display: 'block' }}
                                >
                                    {saving ? 'Ukládám...' : 'Uložit změny'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Subscription */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader} onClick={() => toggleSection('subscription')}>
                        <span className={styles.sectionTitle}>
                            Subscription
                        </span>
                        <svg
                            className={`${styles.chevron} ${activeSection === 'subscription' ? styles.open : ''}`}
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>

                    {activeSection === 'subscription' && (
                        <div className={styles.sectionContent}>
                            <div style={{ marginTop: '1.5rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Aktuální Plán</label>
                                    <div className={styles.readOnlyField} style={{ textTransform: 'capitalize' }}>
                                        {profile?.account_type || 'Unknown'}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Změna plánu</label>
                                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                                        Tohle doděláme jindy
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Bankovní účet */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader} onClick={() => toggleSection('bank')}>
                        <span className={styles.sectionTitle}>
                            Bankovní účet
                        </span>
                        <svg
                            className={`${styles.chevron} ${activeSection === 'bank' ? styles.open : ''}`}
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                    {activeSection === 'bank' && (
                        <div className={styles.sectionContent}>
                            <div style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
                                Informace o bankovním účtu.
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Připojení API */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader} onClick={() => toggleSection('api')}>
                        <span className={styles.sectionTitle}>
                            Připojení API
                        </span>
                        <svg
                            className={`${styles.chevron} ${activeSection === 'api' ? styles.open : ''}`}
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>

                    {activeSection === 'api' && (
                        <div className={styles.sectionContent}>
                            <div style={{ marginTop: '1.5rem' }}>
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

                                <button className="btnPrimary" style={{ width: '100%', display: 'block' }} onClick={updateConnection} disabled={saving}>
                                    {saving ? 'Ukládám...' : 'Uložit připojení'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
