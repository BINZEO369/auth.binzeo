"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Sector = {
  id: string;
  sector_code: string;
  sector_name: string;
  description: string | null;
  is_active: boolean;
};

type SectorAccess = {
  sector_id: string;
  status: string;
  selected_at: string;
  updated_at: string;
  sectors: Sector | null;
};

export default function SectorsPage() {
  const [allSectors, setAllSectors] = useState<Sector[]>([]);
  const [mySectors, setMySectors] = useState<SectorAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const load = async () => {
    const [a, b] = await Promise.all([
      apiFetch<{ sectors: Sector[] }>("/api/sectors"),
      apiFetch<{ sector_access: SectorAccess[] }>("/api/user/sector-access"),
    ]);
    if (a.success) setAllSectors(a.data.sectors);
    if (b.success) setMySectors(b.data.sector_access);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const mySectorIds = new Set(mySectors.map((s) => s.sector_id));

  const handleJoin = async (sectorId: string) => {
    setBusyId(sectorId);
    setMessage(null);
    const res = await apiFetch("/api/user/sector-access", {
      method: "POST",
      body: JSON.stringify({ sector_id: sectorId, status: "active" }),
    });
    if (res.success) {
      setMessage({ type: "success", text: "Joined sector" });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const handleLeave = async (sectorId: string) => {
    if (!confirm("Leave this sector?")) return;
    setBusyId(sectorId);
    setMessage(null);
    const res = await apiFetch(`/api/user/sector-access/${sectorId}`, {
      method: "DELETE",
    });
    if (res.success) {
      setMessage({ type: "success", text: "Left sector" });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const handleStatusChange = async (sectorId: string, status: string) => {
    setBusyId(sectorId);
    setMessage(null);
    const res = await apiFetch(`/api/user/sector-access/${sectorId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.success) {
      setMessage({ type: "success", text: "Status updated" });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#79b9d5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#101820] mb-1">Sectors</h1>
        <p className="text-sm text-[#5c6b70]">
          Join industry sectors to unlock related features
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-sm ${
            message.type === "success"
              ? "bg-[#dff2e9] border-[#a8d9c4] text-[#2e8064]"
              : "bg-[#fbe5e2] border-[#efb8b0] text-[#b84f4b]"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* My Sectors */}
      {mySectors.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-[#5c6b70] uppercase tracking-wider">
            My Sectors ({mySectors.length})
          </h2>
          <div className="space-y-2">
            {mySectors.map((s) => (
              <div
                key={s.sector_id}
                className="p-4 rounded-2xl border border-[#b4ded3] bg-[#263746]/5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-[#216f9e] px-1.5 py-0.5 rounded bg-[#dff2eb]">
                      {s.sectors?.sector_code}
                    </span>
                    <span className="font-medium text-[#101820] text-sm truncate">
                      {s.sectors?.sector_name}
                    </span>
                  </div>
                  <div className="text-xs text-[#6d7c80]">
                    Status:{" "}
                    <span
                      className={
                        s.status === "active"
                          ? "text-[#2e8064]"
                          : s.status === "paused"
                          ? "text-[#a47618]"
                          : "text-[#5c6b70]"
                      }
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={s.status}
                    disabled={busyId === s.sector_id}
                    onChange={(e) =>
                      handleStatusChange(s.sector_id, e.target.value)
                    }
                    className="text-xs px-2 py-1 rounded border border-[#d5dfdd] bg-[#eef2f1] text-[#101820]"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => handleLeave(s.sector_id)}
                    disabled={busyId === s.sector_id}
                    className="text-xs text-[#b84f4b] hover:text-red-300 disabled:opacity-50"
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available Sectors */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-[#5c6b70] uppercase tracking-wider">
          Available Sectors
        </h2>

        {allSectors.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-[#d5dfdd] text-center">
            <Image
              src="/icons/building.svg"
              alt=""
              width={40}
              height={40}
              className="invert mx-auto mb-3"
            />
            <p className="text-[#5c6b70] text-sm">
              No sectors available right now.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {allSectors.map((s) => {
              const joined = mySectorIds.has(s.id);
              return (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl border border-[#d5dfdd] bg-white hover:border-[#9bd7c7] transition-colors flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-mono text-[10px] text-[#216f9e] px-1.5 py-0.5 rounded bg-[#dff2eb]">
                      {s.sector_code}
                    </div>
                    {joined && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#dff2e9] text-[#2e8064] border border-[#b6e1cf]">
                        <Image
                          src="/icons/check.svg"
                          alt=""
                          width={12}
                          height={12}
                          className="invert inline-block mr-1 align-[-2px]"
                        />
                        Joined
                      </span>
                    )}
                  </div>

                  <div className="font-medium text-[#101820] text-sm mb-1">
                    {s.sector_name}
                  </div>
                  {s.description && (
                    <p className="text-xs text-[#6d7c80] mb-4 flex-1">
                      {s.description}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      joined ? handleLeave(s.id) : handleJoin(s.id)
                    }
                    disabled={busyId === s.id}
                    className={`mt-auto w-full py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                      joined
                        ? "border border-[#d5dfdd] text-[#35454c] hover:border-[#efb8b0] hover:text-[#b84f4b]"
                        : "bg-[#101820] hover:bg-[#263746] text-[#101820]"
                    }`}
                  >
                    {busyId === s.id
                      ? "..."
                      : joined
                      ? "Leave"
                      : "Join"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
