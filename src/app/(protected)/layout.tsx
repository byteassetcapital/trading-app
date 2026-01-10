import React from 'react';
import Sidebar from '@/components/Sidebar';
import styles from './layout.module.css';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    let userProfile = null;
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

    userProfile = profile;

    return (
        <div className={styles.protectedLayout}>
            <Sidebar userProfile={userProfile} />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
