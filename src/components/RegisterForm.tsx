"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function RegisterForm() {
  const supabase = createClient();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store plan selection from URL parameters
  const [returnPlan, setReturnPlan] = useState<string | null>(null);
  const [returnBilling, setReturnBilling] = useState<string | null>(null);
  const [shouldRedirectToCheckout, setShouldRedirectToCheckout] = useState(false);

  // Check URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    const billing = params.get('billing');
    const redirect = params.get('redirect');

    if (plan && billing && redirect === 'checkout') {
      setReturnPlan(plan);
      setReturnBilling(billing);
      setShouldRedirectToCheckout(true);
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }

    if (nationality && nationality.length !== 2) {
      setError("Nationality must be a 2-letter ISO country code (e.g., US, CZ, GB)");
      return;
    }

    setLoading(true);

    try {
      console.log("Starting registration...");

      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned from signup");

      console.log("User created in auth.users:", authData.user.id);

      // 2. MANUALLY CREATE PROFILE - fuck the trigger
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: authData.user.id,
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          date_of_birth: dob || null,
          nationality: nationality ? nationality.toUpperCase() : null,
          terms_accepted: termsAccepted,
          terms_accepted_at: termsAccepted ? new Date().toISOString() : null,
          privacy_accepted: privacyAccepted,
          privacy_accepted_at: privacyAccepted ? new Date().toISOString() : null,
          marketing_consent: marketingConsent,
          email_verified: false,
          two_factor_enabled: false,
          total_referrals: 0,
          status: 'active',
          kyc_level: 'basic',
          kyc_status: 'pending',
          risk_profile: 'medium'
        });

      if (profileError) {
        console.error("Profile creation failed:", profileError);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      console.log("Profile created successfully!");

      // 3. Success redirect
      if (authData.session) {
        // If user came from pricing, redirect back with plan selection
        if (shouldRedirectToCheckout && returnPlan && returnBilling) {
          const params = new URLSearchParams({
            plan: returnPlan,
            billing: returnBilling,
            redirect: 'checkout'
          });
          router.push(`/?${params.toString()}`);
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/login?checkEmail=true");
      }

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-panel register-card">
        <h1 className="title">
          Join <span className="gradient-text">Byte Asset</span>
        </h1>
        <p className="subtitle">Start your autonomous trading journey</p>

        <form onSubmit={handleRegister} className="form">
          <div className="row">
            <div className="input-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="row">
            <div className="input-group">
              <label htmlFor="phone">Phone (Optional)</label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 234 567 890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="dob">Date of Birth (Optional)</label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="nationality">Nationality (Optional - 2 letter code)</label>
            <input
              id="nationality"
              type="text"
              placeholder="e.g. US, CZ, GB"
              value={nationality}
              onChange={(e) => setNationality(e.target.value.toUpperCase())}
              maxLength={2}
            />
            <small style={{ color: '#888', fontSize: '0.8rem' }}>
              Use ISO country codes: US (USA), CZ (Czech), GB (UK), etc.
            </small>
          </div>

          <div className="checkbox-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>I accept the Terms of Service *</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
              />
              <span>I accept the Privacy Policy *</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
              />
              <span>I agree to receive marketing communications</span>
            </label>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btnPrimary full-width" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <Link
            href={shouldRedirectToCheckout && returnPlan && returnBilling
              ? `/login?plan=${returnPlan}&billing=${returnBilling}&redirect=checkout`
              : "/login"
            }
            className="link"
          >
            Log In
          </Link>
        </p>
      </div>

      <style jsx>{`
        .register-card {
          width: 100%;
          max-width: 520px;
          padding: 3rem 2.5rem;
          z-index: 10;
          animation: fadeIn 0.8s ease-out;
        }

        .title {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          text-align: center;
          font-weight: 700;
          color: #ffffff;

          
        }

        .subtitle {
          color: #aaa;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .row {
          display: flex;
          gap: 1rem;
        }

        .row .input-group {
          flex: 1;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.85rem;
          color: #ccc;
          margin-left: 0.2rem;
          font-weight: 500;
        }

        .input-group input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          padding: 0.9rem;
          border-radius: 12px;
          color: white;
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .input-group input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }

        .input-group input:focus {
          border-color: var(--accent-blue);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.1);
        }

        .checkbox-section {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-top: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: #ddd;
          user-select: none;
        }

        .checkbox-label input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .checkbox-label input[type="checkbox"]:checked {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
        }

        .checkbox-label input[type="checkbox"]:checked::after {
          content: '✓';
          position: absolute;
          color: white;
          font-size: 0.8rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .full-width {
          width: 100%;
          margin-top: 1rem;
          padding: 1rem;
          font-size: 1.1rem;
        }

        .footer-text {
          margin-top: 2rem;
          text-align: center;
          color: #888;
          font-size: 0.95rem;
        }

        .link {
          color: var(--accent-blue);
          font-weight: 600;
          transition: color 0.2s;
        }

        .link:hover {
          color: var(--primary-purple);
          text-decoration: underline;
        }

        .error-msg {
          color: #ff6b6b;
          background: rgba(255, 77, 77, 0.1);
          border: 1px solid rgba(255, 77, 77, 0.2);
          padding: 0.8rem;
          border-radius: 8px;
          text-align: center;
          font-size: 0.9rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .register-card {
            padding: 2rem 1.5rem;
          }
          .title {
            font-size: 1.8rem;
          }
          .row {
            flex-direction: column;
            gap: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}