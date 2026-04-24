import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/dashboard/users", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to register. Please review your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-between gap-12 px-6 py-12">
        <div className="hidden w-1/2 flex-col gap-6 lg:flex">
          <span className="text-xs uppercase tracking-[0.2em] text-ink-400">
            GET STARTED
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-ink-900">
            Create your EventHub account and start managing events.
          </h1>
          <p className="text-base text-ink-600">
            Set up your account to create events, manage teams, assign roles,
            and handle event operations with ease.
          </p>
          <div className="card p-6">
            <p className="text-sm font-semibold text-ink-800">Quick setup</p>
            <p className="text-sm text-ink-500">
              Get started in minutes and begin managing your events right away.
            </p>
          </div>
        </div>
        <div className="card w-full max-w-lg p-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
              EVENTHUB ACCESS
            </p>
            <h2 className="text-2xl font-semibold text-ink-900">
              Create your account
            </h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-ink-600">
                Full name
              </label>
              <input
                className="input mt-2"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-600">
                Email address
              </label>
              <input
                className="input mt-2"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-600">
                Password
              </label>
              <input
                className="input mt-2"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <div className="rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-700">
                {error}
              </div>
            )}
            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-sm text-ink-500">
            Already have an account?{" "}
            <Link
              className="font-semibold text-ink-800 hover:text-ink-600"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
