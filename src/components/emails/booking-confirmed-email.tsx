import * as React from "react";

interface BookingConfirmedEmailProps {
  firstName: string;
  trackingCode: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  numberOfBags: number;
  regularBags: number;
  oddSizedItems: number;
  adults: number;
  children: number;
  totalPrice: string | number;
  trackingUrl: string;
}

export const BookingConfirmedEmail: React.FC<
  Readonly<BookingConfirmedEmailProps>
> = ({
  firstName,
  trackingCode,
  pickupLocation,
  dropoffLocation,
  pickupDate,
  pickupTime,
  deliveryDate,
  deliveryTime,
  numberOfBags,
  regularBags,
  oddSizedItems,
  adults,
  children,
  totalPrice,
  trackingUrl,
}) => (
  <div
    style={{
      fontFamily: '"Poppins", -apple-system, sans-serif',
      backgroundColor: "#F6F2EA",
      padding: "40px 20px",
      color: "#0A2E6D",
    }}
  >
    <div
      style={{
        maxWidth: "520px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 10px 30px rgba(10, 46, 109, 0.05)",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://gviboyquykrdbtwxebfi.supabase.co/storage/v1/object/public/brand/Logo_primary.png"
          alt="Yallah Baggage"
          style={{ height: "60px" }}
        />
      </div>

      {/* Success Icon */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            display: "inline-block",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#ecfdf5",
            lineHeight: "64px",
            fontSize: "32px",
            textAlign: "center",
          }}
        >
          ✓
        </div>
      </div>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          margin: "0 0 8px 0",
          color: "#0A2E6D",
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}
      >
        Payment Confirmed!
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "#8B7280",
          margin: "0 0 30px 0",
          lineHeight: "1.5",
          textAlign: "center",
        }}
      >
        Hi {firstName}, your luggage transfer has been booked successfully. Here
        are your details:
      </p>

      {/* Tracking Code Card */}
      <div
        style={{
          backgroundColor: "#F6F2EA",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase" as const,
            letterSpacing: "2px",
            color: "#8B7280",
            margin: "0 0 8px 0",
          }}
        >
          Your Tracking Code
        </p>
        <div
          style={{
            fontSize: "36px",
            fontWeight: "800",
            letterSpacing: "4px",
            color: "#1E5BD7",
            fontFamily: "monospace",
            margin: "0 0 8px 0",
          }}
        >
          {trackingCode}
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "#8B7280",
            margin: "0",
          }}
        >
          Use this code along with your email &amp; phone to track your order.
        </p>
      </div>

      {/* Booking Details */}
      <div
        style={{
          border: "1px solid #E5E5E5",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <div
          style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5" }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
              color: "#8B7280",
            }}
          >
            Route
          </span>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#0A2E6D",
              marginTop: "4px",
            }}
          >
            {pickupLocation} → {dropoffLocation}
          </div>
        </div>
        <div
          style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5" }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
              color: "#8B7280",
            }}
          >
            Pick-up
          </span>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#0A2E6D",
              marginTop: "4px",
            }}
          >
            {pickupDate} at {pickupTime}
          </div>
        </div>
        <div
          style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5" }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
              color: "#8B7280",
            }}
          >
            Delivery
          </span>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#0A2E6D",
              marginTop: "4px",
            }}
          >
            {deliveryDate} at {deliveryTime}
          </div>
        </div>
        <div
          style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5" }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
              color: "#8B7280",
            }}
          >
            Travellers
          </span>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#0A2E6D",
              marginTop: "4px",
            }}
          >
            {adults} {adults === 1 ? "Adult" : "Adults"}
            {children > 0
              ? `, ${children} ${children === 1 ? "Child" : "Children"}`
              : ""}
          </div>
        </div>
        <div
          style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5" }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
              color: "#8B7280",
            }}
          >
            Bags
          </span>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#0A2E6D",
              marginTop: "4px",
            }}
          >
            {numberOfBags} Total ({regularBags} Regular, {oddSizedItems}{" "}
            Odd-sized)
          </div>
        </div>
        <div style={{ padding: "14px 20px", backgroundColor: "#F9F9F9" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
              color: "#1E5BD7",
            }}
          >
            Final Quotation Paid
          </span>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#1E5BD7",
              marginTop: "4px",
            }}
          >
            AED {totalPrice}
          </div>
        </div>
      </div>

      {/* Track Order Button */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <a
          href={trackingUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#0A2E6D",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "16px",
            padding: "14px 40px",
            borderRadius: "12px",
            textDecoration: "none",
          }}
        >
          Track Your Order →
        </a>
      </div>

      {/* Footer */}
      <div
        style={{
          paddingTop: "24px",
          borderTop: "1px solid #F6F2EA",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "12px", color: "#8B7280", margin: "0 0 4px 0" }}>
          Questions? Reply to this email or contact us anytime.
        </p>
        <p style={{ fontSize: "12px", color: "#8B7280", margin: "0" }}>
          &copy; {new Date().getFullYear()} Yallah Baggage. Dubai&apos;s
          Premier Luggage Concierge.
        </p>
      </div>
    </div>
  </div>
);
