import React, { useEffect, useMemo, useState } from "react";
import {
  createUser,
  getRoles,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../../api/apiService.js";
import Loading from "../../components/Loading.jsx";
import ErrorState from "../../components/ErrorState.jsx";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    roleId: "",
  });
  const [createStatus, setCreateStatus] = useState({
    loading: false,
    message: "",
    error: "",
  });
  const [inviteOpen, setInviteOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
      console.log("Users response", usersRes?.data);
      const usersData =
        usersRes?.data?.items || usersRes?.data?.users || usersRes?.data || [];
      const rolesData = rolesRes?.data?.roles || rolesRes?.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (err) {
      if (err?.response?.status === 403) {
        setError(
          "You do not have permission to view users. Ask an admin to grant users:read.",
        );
      } else {
        setError(err?.response?.data?.message || "Unable to load users.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resolveRoleName = (user) =>
    user?.role?.name || user?.roleName || user?.role || "Unassigned";
  const resolveRoleId = (user) =>
    user?.role?._id || user?.role?.id || user?.roleId || null;
  const resolveStatus = (user) => {
    const status = user?.status ?? user?.isActive;
    if (typeof status === "boolean") return status ? "active" : "disabled";
    return status || "active";
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        resolveRoleName(user).toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" ||
        resolveRoleId(user) === roleFilter ||
        resolveRoleName(user) === roleFilter;
      const matchesStatus =
        statusFilter === "all" || resolveStatus(user) === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const userSummary = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(
      (user) => resolveStatus(user) === "active",
    ).length;
    const adminUsers = users.filter(
      (user) => resolveRoleName(user).toLowerCase() === "admin",
    ).length;
    const disabledUsers = users.filter(
      (user) => resolveStatus(user) === "disabled",
    ).length;

    return { totalUsers, activeUsers, adminUsers, disabledUsers };
  }, [users]);

  const handleRoleChange = async (userId, roleId) => {
    const role =
      roles.find((item) => item.id === roleId || item._id === roleId) || null;
    try {
      await updateUserRole(userId, {
        roleId: role?.id || role?._id || roleId,
        role: role?.name || roleId,
      });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId || user.id === userId
            ? { ...user, role: role || roleId }
            : user,
        ),
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update role.");
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "disabled" : "active";
    try {
      await updateUserStatus(userId, { status: newStatus });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId || user.id === userId
            ? { ...user, status: newStatus, isActive: newStatus === "active" }
            : user,
        ),
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update status.");
    }
  };

  const handleCreateChange = (event) => {
    setCreateForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    setCreateStatus({ loading: true, message: "", error: "" });
    try {
      await createUser({
        name: createForm.name,
        email: createForm.email,
        roleId: createForm.roleId || undefined,
      });
      setCreateStatus({
        loading: false,
        message: "User created with default password.",
        error: "",
      });
      setCreateForm({ name: "", email: "", roleId: "" });
      setInviteOpen(false);
      await loadData();
    } catch (err) {
      setCreateStatus({
        loading: false,
        message: "",
        error: err?.response?.data?.message || "Unable to create user.",
      });
    }
  };

  const closeInvite = () => {
    setInviteOpen(false);
    setCreateStatus({ loading: false, message: "", error: "" });
  };

  if (loading) return <Loading label="Loading users..." />;

  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          <button className="btn btn-ghost w-fit" onClick={loadData}>
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="users-admin-shell space-y-6">
      <section className="users-admin-header card p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
              Users
            </p>
            <h3 className="text-2xl font-semibold text-ink-900">
              Manage your team
            </h3>
            <p className="mt-2 text-sm text-ink-500">
              Search users, update roles, and manage account status from one
              place.
            </p>
          </div>

          <div className="users-admin-toolbar grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[minmax(14rem,1fr),12rem,10rem,auto] lg:items-center">
            <input
              className="input users-toolbar-control"
              placeholder="Search by name, email, role"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              className="select users-toolbar-control"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="all">All roles</option>
              {roles.map((role) => (
                <option
                  key={role.id || role._id}
                  value={role.id || role._id || role.name}
                >
                  {role.name || role.title || "Role"}
                </option>
              ))}
            </select>

            <select
              className="select users-toolbar-control"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>

            <button
              className="btn btn-primary users-add-btn whitespace-nowrap lg:justify-self-end"
              onClick={() => setInviteOpen(true)}
            >
              <span aria-hidden="true">+</span>
              Add user
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="users-summary-card card px-5 py-4">
          <p className="users-summary-label">Total users</p>
          <p className="users-summary-value">{userSummary.totalUsers}</p>
        </div>
        <div className="users-summary-card card px-5 py-4">
          <p className="users-summary-label">Active users</p>
          <p className="users-summary-value">{userSummary.activeUsers}</p>
        </div>
        <div className="users-summary-card card px-5 py-4">
          <p className="users-summary-label">Admins</p>
          <p className="users-summary-value">{userSummary.adminUsers}</p>
        </div>
        <div className="users-summary-card card px-5 py-4">
          <p className="users-summary-label">Disabled users</p>
          <p className="users-summary-value">{userSummary.disabledUsers}</p>
        </div>
      </section>

      <section className="card users-table-wrap overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="users-table-head bg-ink-50 text-xs uppercase tracking-[0.2em] text-ink-400">
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filteredUsers.map((user) => {
                const roleName = resolveRoleName(user);
                const status = resolveStatus(user);
                const userId = user._id || user.id;

                return (
                  <tr
                    key={userId}
                    className="users-table-row hover:bg-ink-50/60"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold text-ink-800">
                        {user.name || user.fullName || "Unnamed"}
                      </div>
                      <div className="mt-1 text-xs text-ink-500">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        className="select users-role-select"
                        value={resolveRoleId(user) || roleName}
                        onChange={(event) =>
                          handleRoleChange(userId, event.target.value)
                        }
                      >
                        <option value={roleName}>{roleName}</option>
                        {roles.map((role) => (
                          <option
                            key={role.id || role._id}
                            value={role.id || role._id || role.name}
                          >
                            {role.name || role.title || "Role"}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`users-status-badge inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          status === "active"
                            ? "bg-mint-50 text-mint-700 border border-mint-200"
                            : "bg-ink-100 text-ink-600 border border-ink-200"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        className="btn btn-secondary users-action-btn"
                        onClick={() => handleStatusToggle(userId, status)}
                      >
                        {status === "active" ? "Disable" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-ink-500">
            No users match these filters.
          </div>
        )}
      </section>

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
                  Invite teammate
                </p>
                <h3 className="text-xl font-semibold text-ink-900">
                  Add a new user
                </h3>
              </div>
              <button
                className="text-ink-400 hover:text-ink-700"
                onClick={closeInvite}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm text-ink-500">
              Admins can create users with a default password. Assign a role now
              or later.
            </p>
            <form className="mt-5 space-y-4" onSubmit={handleCreateSubmit}>
              <div>
                <label className="text-xs font-semibold text-ink-600">
                  Full name
                </label>
                <input
                  className="input mt-2"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateChange}
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
                  value={createForm.email}
                  onChange={handleCreateChange}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-600">
                  Role (optional)
                </label>
                <select
                  className="select mt-2"
                  name="roleId"
                  value={createForm.roleId}
                  onChange={handleCreateChange}
                >
                  <option value="">Assign later</option>
                  {roles.map((role) => (
                    <option
                      key={role.id || role._id}
                      value={role.id || role._id}
                    >
                      {role.name || role.title || "Role"}
                    </option>
                  ))}
                </select>
              </div>
              {createStatus.error && (
                <div className="rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-700">
                  {createStatus.error}
                </div>
              )}
              {createStatus.message && (
                <div className="rounded-xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm text-mint-700">
                  {createStatus.message}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={createStatus.loading}
                >
                  {createStatus.loading ? "Creating..." : "Create user"}
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={closeInvite}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
