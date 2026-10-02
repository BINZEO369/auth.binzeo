"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Device = {
  id: string;
  device_id: string;
  device_name: string | null;
  device_type: string | null;
  operating_system: string | null;
  os_version: string | null;
  browser: string | null;
  browser_version: string | null;
  app_version: string | null;
  last_seen_at: string | null;
  is_trusted: boolean;
  created_at: string;
};

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[#1f1f2e] bg-[#0a0a0f] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors";

function timeAgo(iso: string | null) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const load = async () => {
    const res = await apiFetch<{ devices: Device[] }>("/api/user/devices");
    if (res.success) setDevices(res.data.devices);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleTrust = async (d: Device) => {
    setBusyId(d.id);
    setMessage(null);
    const res = await apiFetch(`/api/user/devices/${d.id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_trusted: !d.is_trusted }),
    });
    if (res.success) {
      setMessage({
        type: "success",
        text: d.is_trusted ? "Device untrusted" : "Device trusted",
      });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const handleRename = async (id: string) => {
    setBusyId(id);
    setMessage(null);
    const res = await apiFetch(`/api/user/devices/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ device_name: editName.trim() }),
    });
    if (res.success) {
      setMessage({ type: "success", text: "Device renamed" });
      setEditingId(null);
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this device? You may need to log in again.")) return;
    setBusyId(id);
    setMessage(null);
    const res = await apiFetch(`/api/user/devices/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      setMessage({ type: "success", text: "Device removed" });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const startEdit = (d: Device) => {
    setEditingId(d.id);
    setEditName(d.device_name ?? d.device_id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Devices</h1>
        <p className="text-sm text-gray-400">
          Devices that have accessed your Binzeo ID account
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-sm ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {devices.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-[#1f1f2e] text-center">
          <div className="text-4xl mb-3">💻</div>
          <p className="text-gray-400 text-sm">
            No devices recorded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-2xl border border-[#1f1f2e] bg-[#0d0d13] hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-lg">
                    {d.device_type === "mobile"
                      ? "📱"
                      : d.device_type === "tablet"
                      ? "📲"
                      : "💻"}
                  </div>

                  <div className="min-w-0 flex-1">
                    {editingId === d.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={inputCls + " !py-1.5 !text-sm"}
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(d.id)}
                          disabled={busyId === d.id}
                          className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs text-gray-500 hover:text-gray-300 shrink-0"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white text-sm truncate">
                          {d.device_name ?? "Unnamed device"}
                        </span>
                        {d.is_trusted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            ✓ Trusted
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {[
                        d.operating_system,
                        d.browser,
                        d.device_type,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      Last seen: {timeAgo(d.last_seen_at)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#1f1f2e]">
                <button
                  onClick={() => startEdit(d)}
                  className="text-xs text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  Rename
                </button>
                <button
                  onClick={() => toggleTrust(d)}
                  disabled={busyId === d.id}
                  className="text-xs text-gray-400 hover:text-indigo-400 transition-colors disabled:opacity-50"
                >
                  {d.is_trusted ? "Untrust" : "Trust"}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => handleRemove(d.id)}
                  disabled={busyId === d.id}
                  className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
