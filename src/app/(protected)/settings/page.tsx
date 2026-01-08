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
    account_type: 'autonomous' | 'managed' | null;
    // Stripe subscription fields
    plan_type: 'autonomous' | 'managed' | null;
    subscription_status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing' | 'unpaid' | null;
    subscription_price_id: string | null;
    subscription_id: string | null;
    stripe_customer_id: string | null;
    access_until: string | null;
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
    const [portalLoading, setPortalLoading] = useState(false);

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

    // Handle opening Stripe Customer Portal
    const handleOpenPortal = async () => {
        if (!user) return;
        setPortalLoading(true);
        try {
            const response = await fetch('/api/stripe/portal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to open portal');
            }

            window.location.href = data.url;
        } catch (error) {
            console.error('Portal error:', error);
            alert('Nepodařilo se otevřít správu předplatného.');
        } finally {
            setPortalLoading(false);
        }
    };

    // Helper to get subscription status label
    const getStatusLabel = (status: string | null) => {
        switch (status) {
            case 'active': return { label: 'Aktivní', color: '#22c55e' };
            case 'trialing': return { label: 'Zkušební období', color: '#3b82f6' };
            case 'past_due': return { label: 'Po splatnosti', color: '#f59e0b' };
            case 'canceled': return { label: 'Zrušeno', color: '#ef4444' };
            case 'incomplete': return { label: 'Neúplné', color: '#f59e0b' };
            case 'unpaid': return { label: 'Nezaplaceno', color: '#ef4444' };
            default: return { label: 'Žádné', color: '#6b7280' };
        }
    };

    // Helper to get tier name from price ID
    const getTierName = (priceId: string | null) => {
        if (!priceId) return 'Žádný plán';
        const priceMap: Record<string, string> = {
            'price_1SnLEzCX3wuf0Ms8q7r93xEH': 'A1 (€19/měsíc)',
            'price_1SnLoCCX3wuf0Ms8bYWtK9BP': 'A2 (€29/měsíc)',
            'price_1SnLpwCX3wuf0Ms89rfUI0iA': 'A3 (€49/měsíc)',
            'price_1SnLqCCX3wuf0Ms8XfATKTbg': 'A4 (€79/měsíc)',
            'price_1SnNDbCX3wuf0Ms8QjmO5o84': 'A1 (€19/rok)',
            'price_1SnNEhCX3wuf0Ms8fWT3Hnbo': 'A2 (€29/rok)',
            'price_1SnNFkCX3wuf0Ms8VpcwjJzU': 'A3 (€49/rok)',
            'price_1SnNGMCX3wuf0Ms8kmhe7YRv': 'A4 (€79/rok)',
        };
        return priceMap[priceId] || 'Autonomous Plan';
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
                                {/* Current Plan Type */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Typ účtu</label>
                                    <div className={styles.readOnlyField} style={{ textTransform: 'capitalize' }}>
                                        {profile?.plan_type === 'autonomous' ? 'Autonomous Trading' :
                                            profile?.plan_type === 'managed' ? 'Managed Portfolio' :
                                                'Managed (Základní)'}
                                    </div>
                                </div>

                                {/* Subscription Tier */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Aktuální plán</label>
                                    <div className={styles.readOnlyField}>
                                        {getTierName(profile?.subscription_price_id || null)}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Stav předplatného</label>
                                    <div
                                        className={styles.readOnlyField}
                                        style={{
                                            color: getStatusLabel(profile?.subscription_status || null).color,
                                            fontWeight: 600
                                        }}
                                    >
                                        {getStatusLabel(profile?.subscription_status || null).label}
                                    </div>
                                </div>

                                {/* Access Until */}
                                {profile?.access_until && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Platnost do</label>
                                        <div className={styles.readOnlyField}>
                                            {new Date(profile.access_until).toLocaleDateString('cs-CZ', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {profile?.stripe_customer_id ? (
                                        <button
                                            className="btnPrimary"
                                            onClick={handleOpenPortal}
                                            disabled={portalLoading}
                                            style={{ width: '100%' }}
                                        >
                                            {portalLoading ? 'Otevírám...' : 'Spravovat předplatné'}
                                        </button>
                                    ) : (
                                        <a
                                            href="/#pricing"
                                            className="btnPrimary"
                                            style={{
                                                width: '100%',
                                                display: 'block',
                                                textAlign: 'center',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            Získat Autonomous Plan
                                        </a>
                                    )}

                                    {profile?.stripe_customer_id && profile?.subscription_status === 'active' && (
                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: 'rgba(255,255,255,0.5)',
                                            textAlign: 'center',
                                            margin: 0
                                        }}>
                                            Změna plánu, platební metody a zrušení předplatného je dostupné přes správu předplatného.
                                        </p>
                                    )}
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
