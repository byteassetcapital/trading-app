"use client";

import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="login-wrapper">
      {/* Background Ambience */}
      <div className="bg-gradient-spot bg-spot-1" />
      <div className="bg-gradient-spot bg-spot-2" />

      <LoginForm />

      <style jsx>{`
        .login-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div >
  );
}

