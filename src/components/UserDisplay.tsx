"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * UserDisplay component that dynamically fetches and shows the logged-in user's name.
 * Falls back to email prefix or "User" if profile is not available.
 */
export default function UserDisplay() {
    const [displayName, setDisplayName] = useState<string>("...");

    useEffect(() => {
        async function fetchUser() {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    setDisplayName("Guest");
                    return;
                }

                // Fetch display name from user_profiles table
                const { data, error: profileError } = await supabase
                    .from("user_profiles")
                    .select("first_name, last_name")
                    .eq("id", user.id)
                    .single();

                if (!profileError && data) {
                    const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
                    setDisplayName(fullName || user.email?.split("@")[0] || "User");
                } else {
                    // Fallback to email identifier if profile fetch fails or is incomplete
                    setDisplayName(user.email?.split("@")[0] || "User");
                }
            } catch (err) {
                console.error("Failed to fetch user display name:", err);
                setDisplayName("User");
            }
        }

        fetchUser();
    }, []);

    return (
        <div className="user-profile glow-text">
            User: {displayName}
        </div>
    );
}
