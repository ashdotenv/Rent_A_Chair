"use client";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { updateQuantity, removeFromCart, clearCart } from "@/redux/features/cart/cartSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { usePlaceRentalMutation } from "@/redux/features/rental/rentaApi";
import { useInitiatePaymentMutation } from "@/redux/features/khalti/khaltiApi";
import { toast } from "sonner";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  street: yup.string().required("Street is required"),
  city: yup.string().required("City is required"),
  stateVal: yup.string().required("State is required"),
  postalCode: yup.string().required("Postal code is required"),
  country: yup.string().required("Country is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup
    .string()
    .required("End date is required")
    .test("is-after", "End date must be after start date", function (value) {
      const { startDate } = this.parent;
      return value && startDate && new Date(value) > new Date(startDate);
    }),
});

export default function CheckoutPage() {
  const cart = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const [paymentMethod, setPaymentMethod] = useState("KHALTI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [discountCode, setDiscountCode] = useState("");
  const [formErrors, setFormErrors] = useState<any>({});

  // Calculate total days
  const getTotalDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };
  const totalDays = getTotalDays();
  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.dailyRate * totalDays, 0);

  const validate = async () => {
    try {
      await schema.validate({
        name,
        email,
        street,
        city,
        stateVal,
        postalCode,
        country,
        startDate,
        endDate,
      }, { abortEarly: false });
      setFormErrors({});
      setError("");
      return true;
    } catch (err: any) {
      const errors: any = {};
      err.inner.forEach((e: any) => {
        errors[e.path] = e.message;
      });
      setFormErrors(errors);
      setError("Please fix the errors in the form.");
      return false;
    }
  };

  const [initiatePayment] = useInitiatePaymentMutation();
  const [placeRental] = usePlaceRentalMutation();

  const handleCheckout = async () => {
    setError("");
    setSuccess("");
    const isValid = await validate();
    if (!isValid) return;
    setLoading(true);
    try {
      if (cart.length === 0) throw new Error("Cart is empty");
      const payload = {
        items: cart.map(item => ({
          furnitureId: item.id,
          quantity: item.quantity,
          rentalType: "DAILY",
          purchase_order_name: item.title,
          dailyRate: item.dailyRate,
        })),
        startDate,
        endDate,
        deliveryAddress: {
          street,
          city,
          state: stateVal,
          postalCode,
          country
        },
        customer_info: { name, email },
        discountCode: discountCode || undefined,
        paymentMethod,
      };
      if (paymentMethod === "KHALTI") {
        const { data, error: apiError } = await initiatePayment({
          ...payload,
          return_url: window.location.origin + "/payment/verify",
        });
        if (apiError || !data?.success) throw new Error(data?.message || "Khalti payment failed");
        window.location.href = data.khalti.payment_url;
        return;
      } else {
        const { data, error: apiError } = await placeRental({
          ...payload,
          paymentStatus: "PENDING",
          rentalStatus: "PENDING",
        });
        if (apiError || !data?.success) throw new Error(data?.message || "Cash payment failed");
        toast.success("Order placed successfully! Redirecting to your rentals...");
        dispatch(clearCart());
        // Redirect to dashboard/rentals after successful cash on delivery
        setRedirecting(true);
        setTimeout(() => {
          router.push("/dashboard/rentals");
        }, 900);
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {cart.length === 0 ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Form and Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded shadow p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Form fields */}
                <div>
                  <label className="block font-semibold mb-1">Name*</label>
                  <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
                  {formErrors.name && <div className="text-red-500 text-xs mt-1">{formErrors.name}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email*</label>
                  <input className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
                  {formErrors.email && <div className="text-red-500 text-xs mt-1">{formErrors.email}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Street*</label>
                  <input className="w-full border rounded px-3 py-2" value={street} onChange={e => setStreet(e.target.value)} required />
                  {formErrors.street && <div className="text-red-500 text-xs mt-1">{formErrors.street}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">City*</label>
                  <input className="w-full border rounded px-3 py-2" value={city} onChange={e => setCity(e.target.value)} required />
                  {formErrors.city && <div className="text-red-500 text-xs mt-1">{formErrors.city}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">State*</label>
                  <input className="w-full border rounded px-3 py-2" value={stateVal} onChange={e => setStateVal(e.target.value)} required />
                  {formErrors.stateVal && <div className="text-red-500 text-xs mt-1">{formErrors.stateVal}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Postal Code*</label>
                  <input className="w-full border rounded px-3 py-2" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
                  {formErrors.postalCode && <div className="text-red-500 text-xs mt-1">{formErrors.postalCode}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Country*</label>
                  <input className="w-full border rounded px-3 py-2" value={country} onChange={e => setCountry(e.target.value)} required />
                  {formErrors.country && <div className="text-red-500 text-xs mt-1">{formErrors.country}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Code</label>
                  <input className="w-full border rounded px-3 py-2" value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Start Date*</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                  {formErrors.startDate && <div className="text-red-500 text-xs mt-1">{formErrors.startDate}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date*</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                  {formErrors.endDate && <div className="text-red-500 text-xs mt-1">{formErrors.endDate}</div>}
                </div>
              </div>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b py-3 last:border-b-0">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-gray-600 text-sm">रु {item.dailyRate} per day</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-lg"
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                      >-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-lg"
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      >+</button>
                      <button
                        className="ml-2 text-red-500 hover:underline text-xs"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Payment, Summary, Place Order */}
          <div className="space-y-6">
            <div className="bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Select Payment Method</div>
              <div className="flex gap-4 mb-4">
                <button
                  className={`px-4 py-2 rounded border ${paymentMethod === "KHALTI" ? "bg-[#5C2D91] text-white border-[#5C2D91]" : "bg-white text-gray-900 border-gray-300"}`}
                  onClick={() => setPaymentMethod("KHALTI")}
                >
                  Pay with Khalti
                </button>
                <button
                  className={`px-4 py-2 rounded border ${paymentMethod === "CASH" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-300"}`}
                  onClick={() => setPaymentMethod("CASH")}
                >
                  Cash on Delivery
                </button>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold mb-2">
                <span>Total Days</span>
                <span>{totalDays}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold mb-4">
                <span>Total</span>
                <span>रु {cartTotal}</span>
              </div>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-green-800">{success}</p>
                      {redirecting && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              <span className="ml-2 text-sm text-green-600">Redirecting...</span>
                            </div>
                            <button
                              onClick={() => router.push("/dashboard/rentals")}
                              className="text-sm text-green-600 hover:text-green-800 underline"
                            >
                              Go now
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <button
                className="w-full bg-[#1980E5] hover:bg-[#1565C0] text-white font-semibold py-3 rounded text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={loading || !!success}
              >
                {loading ? "Processing..." : !!success ? "Order Placed!" : paymentMethod === "KHALTI" ? "Pay with Khalti" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 