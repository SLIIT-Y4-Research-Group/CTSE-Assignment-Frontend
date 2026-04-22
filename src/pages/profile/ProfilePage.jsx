import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/apiService.js";
import Loading from "../../components/Loading.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import ThemeToggle from "../../components/ThemeToggle.jsx";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCurrentUser();
      const data = response?.data?.user || response?.data || null;
      setProfile(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <Loading label="Loading profile..." />;

  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          <button className="btn btn-ghost w-fit" onClick={loadProfile}>
            Retry
          </button>
        }
      />
    );
  }

  if (!profile) {
    return <div className="card p-6">No profile data available.</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
              Profile
            </p>
            <h3 className="text-xl font-semibold text-ink-900">
              Account details
            </h3>
          </div>
          <ThemeToggle variant="icon-only" />
        </div>
        <div className="mt-6 grid gap-4">
          <div>
            <p className="text-xs font-semibold text-ink-500">Full name</p>
            <p className="text-base font-semibold text-ink-800">
              {profile.name || profile.fullName || ""}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Email address</p>
            <p className="text-base text-ink-700">{profile.email || ""}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Role</p>
            <p className="text-base text-ink-700">
              {profile?.role?.name || profile.role || profile.roleName || ""}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Status</p>
            <p className="text-base text-ink-700">
              {profile.status || (profile.isActive ? "active" : "disabled")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
