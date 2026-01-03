"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Nepodařilo se přihlásit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-panel login-container">
        <h2 className="title glow-text">Vítejte zpět</h2>
        <p className="subtitle">Zadejte své údaje pro přístup do terminálu.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>E-mailová adresa</label>
            <input
              type="email"
              placeholder="uzivatel@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Heslo</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btnSecondary" disabled={loading}>
            {loading ? "Přihlašování..." : "Vstoupit do dashboardu"}
          </button>
        </form>

        <div className="footer-links">
          <Link href="/register">Vytvořit účet</Link>
          <Link href="#">Zapomněli jste heslo?</Link>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #888;
          margin-bottom: 2rem;
          text-align: center;
          font-size: 0.9rem;
        }

        .login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.9rem;
          color: #ccc;
          margin-left: 0.5rem;
        }

        .input-group input {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--glass-border);
          padding: 1rem;
          border-radius: 12px;
          color: white;
          outline: none;
          transition: border-color 0.3s;
        }

        .input-group input:focus {
          border-color: var(--accent-blue);
        }

        .full-width {
          margin-top: 1rem;
          width: 100%;
        }

        .error-message {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff6b6b;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          text-align: center;
        }

        .footer-links {
          margin-top: 2rem;
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 0.8rem;
          color: #888;
        }

        .footer-links a:hover {
          color: white;
        }
      `}</style>
    </>
  );
}
