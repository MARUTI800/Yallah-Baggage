import * as React from "react";

interface OtpEmailProps {
  otpCode: string;
}

export const OtpEmail: React.FC<Readonly<OtpEmailProps>> = ({ otpCode }) => (
  <div
    style={{
      fontFamily: '"Poppins", "Segoe UI", -apple-system, sans-serif',
      backgroundColor: "#F6F2EA",
      padding: "40px 16px",
      color: "#0A2E6D",
    }}
  >
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(10, 46, 109, 0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#0A2E6D",
          padding: "28px 40px 24px",
          textAlign: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://yallah-baggage.vercel.app/logo-footer-white.png"
          alt="Yallah Baggage"
          style={{ height: "44px", display: "inline-block" }}
        />
      </div>

      {/* Body */}
      <div style={{ padding: "36px 36px 32px", textAlign: "center" }}>
        {/* Lock Icon */}
        <div
          style={{
            fontSize: "40px",
            marginBottom: "16px",
          }}
        >
          🔐
        </div>

        <h1
          style={{
            fontSize: "22px",
            fontWeight: "700",
            margin: "0 0 8px 0",
            color: "#0A2E6D",
            letterSpacing: "-0.02em",
          }}
        >
          Verify Your Booking
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "#666666",
            margin: "0 0 28px 0",
            lineHeight: "1.6",
          }}
        >
          Enter this code to confirm your luggage transfer.
          <br />
          It expires in <strong>10 minutes</strong>.
        </p>

        {/* OTP Code */}
        <div
          style={{
            backgroundColor: "#EEF4FF",
            borderRadius: "16px",
            padding: "24px 20px",
            marginBottom: "28px",
            border: "1px dashed #1E5BD7",
          }}
        >
          <div
            style={{
              fontSize: "38px",
              fontWeight: "800",
              letterSpacing: "10px",
              color: "#0A2E6D",
              fontFamily: '"Courier New", monospace',
              margin: "0",
            }}
          >
            {otpCode}
          </div>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "#999999",
            margin: "0",
            lineHeight: "1.5",
          }}
        >
          Didn&apos;t request this? No worries — just ignore this email.
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#F9F8F6",
          padding: "18px 36px",
          textAlign: "center",
          borderTop: "1px solid #F0EEE9",
        }}
      >
        <p style={{ fontSize: "11px", color: "#8B7280", margin: "0" }}>
          &copy; {new Date().getFullYear()} Yallah Baggage · Dubai&apos;s
          Premier Luggage Concierge
        </p>
      </div>
    </div>
  </div>
);
