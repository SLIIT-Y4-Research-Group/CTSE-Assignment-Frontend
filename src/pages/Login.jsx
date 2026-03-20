import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { changeMyPassword } from "../api/apiService.js";
import { useAuth } from "../auth/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [mustChangeOpen, setMustChangeOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, message: "", error: "" });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(form);
      if (result?.mustChangePassword) {
        setMustChangeOpen(true);
        setPasswordForm({ currentPassword: form.password, newPassword: "", confirmPassword: "" });
        return;
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPasswordForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordStatus({ loading: true, message: "", error: "" });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ loading: false, message: "", error: "New passwords do not match." });
      return;
    }
    try {
      await changeMyPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordStatus({ loading: false, message: "Password updated successfully.", error: "" });
      setMustChangeOpen(false);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setPasswordStatus({
        loading: false,
        message: "",
        error: err?.response?.data?.message || "Unable to change password."
      });
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-between gap-12 px-6 py-12">
        <div className="hidden w-1/2 flex-col gap-6 lg:flex">
          <span className="text-xs uppercase tracking-[0.2em] text-ink-400">Event Management System</span>
          <h1 className="text-4xl font-semibold leading-tight text-ink-900">
            Keep every attendee, organizer, and staff member in perfect sync.
          </h1>
          <p className="text-base text-ink-600">
            Login to manage user access, roles, and permissions across your entire event portfolio.
          </p>
          <div className="card grid grid-cols-2 gap-6 p-6">
            <div>
              <p className="text-2xl font-semibold text-ink-900">1.2k+</p>
              <p className="text-xs text-ink-500">Active users</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink-900">18</p>
              <p className="text-xs text-ink-500">Roles configured</p>
            </div>
          </div>
        </div>
        <div className="card w-full max-w-lg p-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Welcome back</p>
            <h2 className="text-2xl font-semibold text-ink-900">Sign in to EventHub</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-ink-600">Email address</label>
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
              <label className="text-xs font-semibold text-ink-600">Password</label>
              <input
                className="input mt-2"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && <div className="rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-700">{error}</div>}
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-sm text-ink-500">
            New to EventHub?{" "}
            <Link className="font-semibold text-ink-800 hover:text-ink-600" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {mustChangeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4">
          <div className="card w-full max-w-lg p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Security update</p>
              <h3 className="text-xl font-semibold text-ink-900">Change your password</h3>
            </div>
            <p className="mt-2 text-sm text-ink-500">
              Your account requires a password change before you can access the dashboard.
            </p>
            <form className="mt-5 space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <label className="text-xs font-semibold text-ink-600">Current password</label>
                <input
                  className="input mt-2"
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-600">New password</label>
                <input
                  className="input mt-2"
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-600">Confirm new password</label>
                <input
                  className="input mt-2"
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {passwordStatus.error && (
                <div className="rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-700">
                  {passwordStatus.error}
                </div>
              )}
              {passwordStatus.message && (
                <div className="rounded-xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm text-mint-700">
                  {passwordStatus.message}
                </div>
              )}
              <button className="btn btn-primary" type="submit" disabled={passwordStatus.loading}>
                {passwordStatus.loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
