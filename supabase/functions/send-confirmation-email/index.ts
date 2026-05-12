// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      bookingId,
      trackingCode,
      firstName,
      email,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      pickupTime,
      deliveryDate,
      deliveryTime,
      numberOfBags,
      trackingUrl
    } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      })
    }

    // HTML Email Template
    const html = `
      <div style="font-family: 'Poppins', -apple-system, sans-serif; background-color: #F6F2EA; padding: 40px 20px; color: #0A2E6D;">
        <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(10, 46, 109, 0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://gviboyquykrdbtwxebfi.supabase.co/storage/v1/object/public/brand/Logo_primary.png" alt="Yallah Baggage" style="height: 60px;" />
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background-color: #ecfdf5; line-height: 64px; font-size: 32px; text-align: center;">✓</div>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0; color: #0A2E6D; letter-spacing: -0.02em; text-align: center;">Payment Confirmed!</h1>
          <p style="font-size: 16px; color: #8B7280; margin: 0 0 30px 0; line-height: 1.5; text-align: center;">
            Hi ${firstName}, your luggage transfer has been booked successfully. Here are your details:
          </p>
          <div style="background-color: #F6F2EA; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #8B7280; margin: 0 0 8px 0;">Your Tracking Code</p>
            <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1E5BD7; font-family: monospace; margin: 0 0 8px 0;">${trackingCode}</div>
            <p style="font-size: 12px; color: #8B7280; margin: 0;">Use this code along with your email & phone to track your order.</p>
          </div>
          <div style="border: 1px solid #E5E5E5; border-radius: 16px; overflow: hidden; margin-bottom: 24px;">
            <div style="padding: 14px 20px; border-bottom: 1px solid #E5E5E5;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #8B7280;">Booking ID</span>
              <div style="font-size: 14px; font-weight: 600; color: #0A2E6D; margin-top: 4px; font-family: monospace;">${bookingId}</div>
            </div>
            <div style="padding: 14px 20px; border-bottom: 1px solid #E5E5E5;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #8B7280;">Route</span>
              <div style="font-size: 14px; font-weight: 600; color: #0A2E6D; margin-top: 4px;">${pickupLocation} → ${dropoffLocation}</div>
            </div>
            <div style="padding: 14px 20px; border-bottom: 1px solid #E5E5E5;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #8B7280;">Pick-up</span>
              <div style="font-size: 14px; font-weight: 600; color: #0A2E6D; margin-top: 4px;">${pickupDate} at ${pickupTime}</div>
            </div>
            <div style="padding: 14px 20px; border-bottom: 1px solid #E5E5E5;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #8B7280;">Delivery</span>
              <div style="font-size: 14px; font-weight: 600; color: #0A2E6D; margin-top: 4px;">${deliveryDate} at ${deliveryTime}</div>
            </div>
            <div style="padding: 14px 20px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #8B7280;">Bags</span>
              <div style="font-size: 14px; font-weight: 600; color: #0A2E6D; margin-top: 4px;">${numberOfBags} bag(s)</div>
            </div>
          </div>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${trackingUrl}" style="display: inline-block; background-color: #0A2E6D; color: #ffffff; font-weight: 600; font-size: 16px; padding: 14px 40px; border-radius: 12px; text-decoration: none;">Track Your Order →</a>
          </div>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Yallah Baggage <noreply@yallahbaggage.com>",
        to: [email],
        subject: `✅ Booking Confirmed — ${pickupLocation} → ${dropoffLocation}`,
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Failed to send email via Resend")
    }

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  }
})
