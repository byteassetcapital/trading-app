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
          align-items: flex-start;
          justify-content: center;
          padding-top: 150px;
          padding-bottom: 40px;
          padding-left: 1rem;
          padding-right: 1rem;
          position: relative;
        }

        @media (max-width: 768px) {
          .register-container {
            padding-top: 160px;
          }
        }
      `}</style>
    </div>
  );
}

