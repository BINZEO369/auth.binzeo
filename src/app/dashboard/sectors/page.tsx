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
        <div className="w-6 h-6 border-2 border-[#777777] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] mb-1">Sectors</h1>
        <p className="text-sm text-[#6666666]">
          Join industry sectors to unlock related features
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-sm ${
            message.type === "success"
              ? "bg-[#eeeeee] border-[#d1d1d1] text-[#444444]"
              : "bg-[#f2f2f2] border-[#cccccc] text-[#333333]"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* My Sectors */}
      {mySectors.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-[#6666666] uppercase tracking-wider">
            My Sectors ({mySectors.length})
          </h2>
          <div className="space-y-2">
            {mySectors.map((s) => (
              <div
                key={s.sector_id}
                className="p-4 rounded-2xl border border-[#c9c9c9] bg-[#2b2b2b]/5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-[#333333] px-1.5 py-0.5 rounded bg-[#eeeeee]">
                      {s.sectors?.sector_code}
                    </span>
                    <span className="font-medium text-[#111111] text-sm truncate">
                      {s.sectors?.sector_name}
                    </span>
                  </div>
                  <div className="text-xs text-[#666666]">
                    Status:{" "}
                    <span
                      className={
                        s.status === "active"
                          ? "text-[#444444]"
                          : s.status === "paused"
                          ? "text-[#444444]"
                          : "text-[#6666666]"
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
                    className="text-xs px-2 py-1 rounded border border-[#dddddd] bg-[#f3f3f3] text-[#111111]"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => handleLeave(s.sector_id)}
                    disabled={busyId === s.sector_id}
                    className="text-xs text-[#333333] hover:text-[#6666666] disabled:opacity-50"
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
        <h2 className="text-xs font-semibold text-[#6666666] uppercase tracking-wider">
          Available Sectors
        </h2>

        {allSectors.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-[#dddddd] text-center">
            <Image
              src="/icons/building.svg"
              alt=""
              width={40}
              height={40}
              className="invert mx-auto mb-3"
            />
            <p className="text-[#6666666] text-sm">
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
                  className="p-5 rounded-2xl border border-[#dddddd] bg-white hover:border-[#cfcfcf] transition-colors flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-mono text-[10px] text-[#333333] px-1.5 py-0.5 rounded bg-[#eeeeee]">
                      {s.sector_code}
                    </div>
                    {joined && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#eeeeee] text-[#444444] border border-[#cccccc]">
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

                  <div className="font-medium text-[#111111] text-sm mb-1">
                    {s.sector_name}
                  </div>
                  {s.description && (
                    <p className="text-xs text-[#666666] mb-4 flex-1">
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
                        ? "border border-[#dddddd] text-[#444444] hover:border-[#cccccc] hover:text-[#333333]"
                        : "bg-[#111111] hover:bg-[#2b2b2b] text-white"
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
