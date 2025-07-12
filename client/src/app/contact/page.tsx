"use client";
import React, { useState } from "react";
import * as yup from "yup";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<any>({});

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().min(10, "Message must be at least 10 characters").required("Message is required"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});
    try {
      await schema.validate(form, { abortEarly: false });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess("Your message has been sent! We'll get back to you soon.");
        setForm({ name: "", email: "", subject: "", message: "" });
      }, 1500);
    } catch (err: any) {
      const fieldErrors: any = {};
      if (err.inner) {
        err.inner.forEach((e: any) => {
          fieldErrors[e.path] = e.message;
        });
      }
      setErrors(fieldErrors);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.subject && <div className="text-red-500 text-xs mt-1">{errors.subject}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 min-h-[100px]"
            required
          />
          {errors.message && <div className="text-red-500 text-xs mt-1">{errors.message}</div>}
        </div>
        {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
        <button
          type="submit"
          className="w-full bg-[#1980E5] hover:bg-[#1565C0] text-white font-semibold py-3 rounded text-lg transition"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
} 