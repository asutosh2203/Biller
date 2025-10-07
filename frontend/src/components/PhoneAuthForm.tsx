"use client";
import { useState } from "react";

const PhoneAuthForm = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone) return alert("Please enter your phone number");
    setLoading(true);
    try {
      // TODO: replace with your backend endpoint
      const res = await fetch("http://localhost:5001/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      if (res.ok) {
        setOtpSent(true);
        alert("OTP sent successfully!");
      } else {
        console.log(
          res.status,
          res.text().then((data) => console.log(data)),
          res.statusText
        );
        alert("Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter the OTP");
    setLoading(true);
    try {
      // TODO: replace with your backend endpoint
      const res = await fetch("http://localhost:5001/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, otp }),
      });

      if (res.ok) {
        alert("OTP verified successfully!");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 max-w-sm mx-auto p-6 bg-white ">
      <div className="h-max shadow-xl flex flex-col gap-4 px-6 py-4 rounded-2xl">
        <h2 className="text-2xl font-semibold text-center">Login with Phone</h2>

        <input
          type="tel"
          placeholder="Enter phone number"
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneAuthForm;
