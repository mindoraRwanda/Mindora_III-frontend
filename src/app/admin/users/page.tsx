"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SuspendUserDialog } from "@/components/admin/SuspendUserDialog";
import { useAdminUsers } from "@/hooks/useAdmin";
import type { AdminUserRecord } from "@/types/domain";

type RoleFilter = "all" | "PATIENT" | "THERAPIST" | "ADMIN";
type StatusFilter = "all" | "active" | "suspended";

export default function AdminUsersPage() {
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [actionTarget, setActionTarget] = useState<AdminUserRecord | null>(null);

  const { data, isLoading, isError } = useAdminUsers({
    role: role === "all" ? undefined : role,
    isActive: status === "all" ? undefined : status === "active",
    limit: 50,
  });

  const users = data?.users ?? [];

  return (
    <div className="min-h-full bg-white px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Users</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Manage platform accounts — suspend or reactivate access.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Select value={role} onValueChange={(v) => setRole((v as RoleFilter) ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="PATIENT">Patient</SelectItem>
            <SelectItem value="THERAPIST">Therapist</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus((v as StatusFilter) ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <div className="mb-4 rounded-[10px] bg-red-100 px-4 py-3 text-[13px] font-semibold text-red-700">
          Could not load users.
        </div>
      )}

      {isLoading ? (
        <p className="py-5 text-[13.5px] text-muted-foreground">Loading users…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          {users.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13.5px] text-muted-foreground">
              No users match these filters.
            </p>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-foreground">{u.email}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {u.role.charAt(0) + u.role.slice(1).toLowerCase()} · Joined{" "}
                    {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={u.isActive ? "success" : "destructive"} className="shrink-0">
                  {u.isActive ? "Active" : "Suspended"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setActionTarget(u)}
                >
                  {u.isActive ? "Suspend" : "Reactivate"}
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      <SuspendUserDialog
        user={actionTarget}
        onOpenChange={(open) => !open && setActionTarget(null)}
      />
    </div>
  );
}
