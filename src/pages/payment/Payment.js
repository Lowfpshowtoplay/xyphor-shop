import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const stripePromise = loadStripe("your_publishable_key_here"); // Replace with your Stripe public key

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.createPayment({
      payment_method: {
        card: card,
        billing_details: {
          name: "Test User",
        },
      },
      confirm: true,
    });

    if (error) {
      setMessage(`❌ Payment failed: ${error.message}`);
    } else if (paymentIntent) {
      setMessage("✅ Payment successful!");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 sm:p-10 max-w-lg mx-auto"
      style={{
        background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
        boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
      }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Secure Payment</h2>
      <p className="text-gray-600 text-sm mb-6 text-center">
        Use the form below to complete your payment.
      </p>
      <div className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-100">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 rounded-lg text-white font-medium text-lg"
        style={{
          background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {message && (
        <p
          className={`mt-4 text-center text-lg font-medium ${
            message.includes("successful") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

const Payment = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 py-10"
      style={{
        background: "linear-gradient(120deg, #E5E6E4 0%, #fda085 100%)",
      }}
    >
      <Breadcrumbs />
      <div className="text-center mb-8">
     <center>   <h1 className="text-4xl font-bold text-black">Make a Payment</h1></center>
        <p className="text-black text-lg mt-2">
          Securely complete your payment using our easy-to-use form.
        </p>
      </div>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
      <div className="mt-6">
        <Link to="/">
          <button
            className="w-40 h-12 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all"
            style={{
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Explore More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Payment;
