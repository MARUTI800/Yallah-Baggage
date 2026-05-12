import * as React from "react";

interface OtpEmailProps {
  otpCode: string;
}

export const OtpEmail: React.FC<Readonly<OtpEmailProps>> = ({ otpCode }) => (
  <div
    style={{
      fontFamily: '"Poppins", -apple-system, sans-serif',
      backgroundColor: "#F6F2EA",
      padding: "40px 20px",
      color: "#0A2E6D",
      textAlign: "center",
    }}
  >
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 10px 30px rgba(10, 46, 109, 0.05)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://gviboyquykrdbtwxebfi.supabase.co/storage/v1/object/public/brand/Logo_primary.png"
        alt="Yallah Baggage"
        style={{ height: "60px", marginBottom: "30px" }}
      />

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          margin: "0 0 10px 0",
          color: "#0A2E6D",
          letterSpacing: "-0.02em",
        }}
      >
        Verify Your Order
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "#8B7280",
          margin: "0 0 30px 0",
          lineHeight: "1.5",
        }}
      >
        Use the secure code below to confirm your luggage booking. This code
        will expire in 10 minutes.
      </p>

      <div
        style={{
          backgroundColor: "#F6F2EA",
          borderRadius: "16px",
          padding: "24px",
          fontSize: "36px",
          fontWeight: "800",
          letterSpacing: "8px",
          color: "#1E5BD7",
          margin: "0 0 30px 0",
          fontFamily: "monospace",
        }}
      >
        {otpCode}
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "#8B7280",
          margin: "0",
          lineHeight: "1.5",
        }}
      >
        If you didn&apos;t request this code, you can safely ignore this email.
      </p>

      <div
        style={{
          marginTop: "40px",
          paddingTop: "30px",
          borderTop: "1px solid #F6F2EA",
        }}
      >
        <p style={{ fontSize: "12px", color: "#8B7280", margin: "0" }}>
          &copy; {new Date().getFullYear()} Yallah Baggage. Dubai&apos;s
          Premier Luggage Concierge.
        </p>
      </div>
    </div>
  </div>
);
