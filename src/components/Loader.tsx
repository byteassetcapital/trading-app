"use client";

import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="spinner-ring"></div>
        <div className="spinner-core"></div>
        <p className="loading-text">Loading Dashboard</p>
      </div>

      <style jsx>{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--background);
          background: radial-gradient(circle at center, var(--rich-mahogany) 0%, var(--background) 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          position: relative;
        }

        .spinner-ring {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: var(--rosewood);
          border-right-color: var(--pink-mist);
          animation: spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          filter: drop-shadow(0 0 10px var(--rosewood));
        }

        .spinner-core {
          width: 60px;
          height: 60px;
          position: absolute;
          top: 10px; /* (80-60)/2 */
          border-radius: 50%;
          background: var(--night-bordeaux);
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
          animation: pulse 2s ease-in-out infinite;
        }
        
        .spinner-core::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: var(--pink-mist);
          border-radius: 50%;
          box-shadow: 0 0 15px var(--pink-mist);
        }

        .loading-text {
          color: var(--pink-mist);
          font-family: var(--font-main);
          font-size: 1rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: fadeInOut 2s ease-in-out infinite;
          text-shadow: 0 0 10px var(--rosewood);
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(149, 77, 95, 0.4);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 20px rgba(149, 77, 95, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(149, 77, 95, 0);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
