"use client";

import RegisterForm from "@/components/RegisterForm";

export default function Register() {
  return (
    <div className="register-container">
      {/* Background Ambience */}
      <div className="bg-gradient-spot bg-spot-1" />
      <div className="bg-gradient-spot bg-spot-2" />

      <RegisterForm />

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 35px;
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

