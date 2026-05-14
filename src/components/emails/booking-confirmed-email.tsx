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
      fontFamily: '"Poppins", "Segoe UI", -apple-system, sans-serif',
      backgroundColor: "#F6F2EA",
      padding: "40px 16px",
      color: "#0A2E6D",
    }}
  >
    <div
      style={{
        maxWidth: "540px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(10, 46, 109, 0.08)",
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: "#0A2E6D",
          padding: "32px 40px 28px",
          textAlign: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://gviboyquykrdbtwxebfi.supabase.co/storage/v1/object/public/brand/Logo_primary.png"
          alt="Yallah Baggage"
          style={{ height: "44px", marginBottom: "16px", filter: "brightness(0) invert(1)" }}
        />
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "700",
            margin: "0",
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          Booking Confirmed! ✓
        </h1>
      </div>

      {/* Body */}
      <div style={{ padding: "32px 36px" }}>
        {/* Greeting */}
        <p
          style={{
            fontSize: "16px",
            color: "#3D3D3D",
            margin: "0 0 24px 0",
            lineHeight: "1.7",
          }}
        >
          Hi <strong>{firstName}</strong>,<br />
          Great news — your luggage transfer is all set! Here&apos;s a quick summary of your booking.
        </p>

        {/* Tracking Code */}
        <div
          style={{
            backgroundColor: "#EEF4FF",
            borderRadius: "16px",
            padding: "20px 24px",
            textAlign: "center",
            marginBottom: "28px",
            border: "1px dashed #1E5BD7",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase" as const,
              letterSpacing: "2px",
              color: "#1E5BD7",
              margin: "0 0 6px 0",
            }}
          >
            Your Tracking Code
          </p>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "800",
              letterSpacing: "6px",
              color: "#0A2E6D",
              fontFamily: '"Courier New", monospace',
              margin: "0",
            }}
          >
            {trackingCode}
          </div>
        </div>

        {/* Route Section */}
        <table
          cellPadding="0"
          cellSpacing="0"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "24px",
          }}
        >
          <tbody>
            {/* From / To */}
            <tr>
              <td style={{ padding: "14px 16px", borderBottom: "1px solid #F0EEE9", verticalAlign: "top" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#1E5BD7", marginBottom: "4px" }}>
                  📍 Pick-up From
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#0A2E6D", lineHeight: "1.4" }}>
                  {pickupLocation}
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "14px 16px", borderBottom: "1px solid #F0EEE9", verticalAlign: "top" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#1E5BD7", marginBottom: "4px" }}>
                  📦 Deliver To
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#0A2E6D", lineHeight: "1.4" }}>
                  {dropoffLocation}
                </div>
              </td>
            </tr>

            {/* Schedule */}
            <tr>
              <td style={{ padding: "14px 16px", borderBottom: "1px solid #F0EEE9" }}>
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%", verticalAlign: "top" }}>
                        <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#8B7280", marginBottom: "4px" }}>
                          🕐 Pick-up
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#0A2E6D" }}>
                          {pickupDate}
                        </div>
                        <div style={{ fontSize: "13px", color: "#8B7280" }}>
                          at {pickupTime}
                        </div>
                      </td>
                      <td style={{ width: "50%", verticalAlign: "top" }}>
                        <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#8B7280", marginBottom: "4px" }}>
                          🕐 Delivery
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#0A2E6D" }}>
                          {deliveryDate}
                        </div>
                        <div style={{ fontSize: "13px", color: "#8B7280" }}>
                          at {deliveryTime}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* Travellers & Bags */}
            <tr>
              <td style={{ padding: "14px 16px", borderBottom: "1px solid #F0EEE9" }}>
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%", verticalAlign: "top" }}>
                        <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#8B7280", marginBottom: "4px" }}>
                          👤 Travellers
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#0A2E6D" }}>
                          {adults} {adults === 1 ? "Adult" : "Adults"}
                          {children > 0 && `, ${children} ${children === 1 ? "Child" : "Children"}`}
                        </div>
                      </td>
                      <td style={{ width: "50%", verticalAlign: "top" }}>
                        <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#8B7280", marginBottom: "4px" }}>
                          🧳 Luggage
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#0A2E6D" }}>
                          {numberOfBags} Total
                        </div>
                        <div style={{ fontSize: "12px", color: "#8B7280" }}>
                          {regularBags} Regular{oddSizedItems > 0 ? `, ${oddSizedItems} Odd-sized` : ""}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Total Paid */}
        <div
          style={{
            backgroundColor: "#0A2E6D",
            borderRadius: "14px",
            padding: "18px 24px",
            marginBottom: "28px",
          }}
        >
          <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: "middle" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)" }}>
                    Total Paid
                  </div>
                </td>
                <td style={{ textAlign: "right", verticalAlign: "middle" }}>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>
                    AED {totalPrice}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <a
            href={trackingUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#1E5BD7",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "15px",
              padding: "14px 44px",
              borderRadius: "12px",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Track Your Order →
          </a>
        </div>

        {/* Help Text */}
        <p
          style={{
            fontSize: "13px",
            color: "#8B7280",
            margin: "0 0 4px 0",
            lineHeight: "1.6",
            textAlign: "center",
          }}
        >
          Need help? Simply reply to this email or reach us on WhatsApp.
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#F9F8F6",
          padding: "20px 36px",
          textAlign: "center",
          borderTop: "1px solid #F0EEE9",
        }}
      >
        <p style={{ fontSize: "11px", color: "#8B7280", margin: "0" }}>
          &copy; {new Date().getFullYear()} Yallah Baggage · Dubai&apos;s Premier Luggage Concierge
        </p>
      </div>
    </div>
  </div>
);
