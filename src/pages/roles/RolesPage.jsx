import React, { useEffect, useMemo, useState } from "react";
import { createRole, deleteRole, getRoles, updateRole } from "../../api/apiService.js";
import Loading from "../../components/Loading.jsx";
import ErrorState from "../../components/ErrorState.jsx";

const normalizePermissions = (permissions) => {
  if (!permissions) return [];
  if (Array.isArray(permissions)) return permissions;
  if (typeof permissions === "string") {
    return permissions.split(",").map((p) => p.trim()).filter(Boolean);
  }
  return [];
};

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", permissions: "" });
  const [editingId, setEditingId] = useState(null);

  const loadRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getRoles();
      const data = response?.data?.roles || response?.data || [];
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const payload = {
      name: form.name,
      permissions: normalizePermissions(form.permissions)
    };

    try {
      if (editingId) {
        await updateRole(editingId, payload);
      } else {
        await createRole(payload);
      }
      setForm({ name: "", permissions: "" });
      setEditingId(null);
      await loadRoles();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to save role.");
    }
  };

  const startEdit = (role) => {
    setEditingId(role.id || role._id);
    setForm({
      name: role.name || role.title || "",
      permissions: normalizePermissions(role.permissions).join(", ")
    });
  };

  const handleDelete = async (roleId) => {
    setError("");
    try {
      await deleteRole(roleId);
      await loadRoles();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete role.");
    }
  };

  const rolesWithPermissions = useMemo(() => {
    return roles.map((role) => ({
      ...role,
      permissions: normalizePermissions(role.permissions)
    }));
  }, [roles]);

  if (loading) return <Loading label="Loading roles..." />;

  if (error) {
    return <ErrorState message={error} action={<button className="btn btn-ghost w-fit" onClick={loadRoles}>Retry</button>} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-6">
        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Roles</p>
          <h3 className="text-xl font-semibold text-ink-900">Role catalog</h3>
          <p className="mt-2 text-sm text-ink-500">Maintain the permissions assigned to each role.</p>
        </div>
        <div className="grid gap-4">
          {rolesWithPermissions.map((role) => (
            <div key={role.id || role._id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-ink-800">{role.name || role.title || "Role"}</h4>
                  <p className="text-xs text-ink-400">{(role.permissions || []).length} permissions</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost" onClick={() => startEdit(role)}>
                    Edit
                  </button>
                  <button className="btn btn-ghost text-gold-700" onClick={() => handleDelete(role.id || role._id)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(role.permissions || ["No permissions"]).map((permission) => (
                  <span key={permission} className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{editingId ? "Edit role" : "Create role"}</p>
        <h3 className="text-xl font-semibold text-ink-900">{editingId ? "Update permissions" : "Add a new role"}</h3>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold text-ink-600">Role name</label>
            <input className="input mt-2" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-600">Permissions (comma-separated)</label>
            <textarea
              className="input mt-2 min-h-[120px]"
              name="permissions"
              value={form.permissions}
              onChange={handleChange}
              placeholder="manage-users, view-events, edit-roles"
              required
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Save changes" : "Create role"}
            </button>
            {editingId && (
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", permissions: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolesPage;
