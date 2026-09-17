"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import RegistrationClosedModal from "@/components/RegistrationClosedModal";

interface RegistrationStatusContextType {
  isOpen: boolean | null;
  isLoading: boolean;
  isError: boolean;
  lastUpdated: string | null;
  openClosedModal: () => void;
  closeClosedModal: () => void;
  refetch: () => Promise<void>;
}

const RegistrationStatusContext = createContext<RegistrationStatusContextType | null>(null);

export function RegistrationStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [closedModalOpen, setClosedModalOpen] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      setIsError(false);
      const res = await fetch("/api/camp/status", {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsOpen(Boolean(data.registration_open));
        setLastUpdated(data.updated_at || null);
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error("[RegistrationStatus] Fetch failed:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Initial status fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // 2. Window focus & visibility change re-verification
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        fetchStatus();
      }
    }

    function handleFocus() {
      fetchStatus();
    }

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchStatus]);

  // 3. Supabase Realtime Subscription (Single centralized channel)
  useEffect(() => {
    const channel = supabaseBrowser
      .channel("camp-settings-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "camp_settings",
        },
        (payload) => {
          const newRow = payload.new as any;
          if (newRow && newRow.key === "registration_open") {
            setIsOpen(Boolean(newRow.value));
            setLastUpdated(newRow.updated_at || new Date().toISOString());
          }
        }
      )
      .on(
        "broadcast",
        { event: "registration_status_changed" },
        (payload) => {
          if (payload?.payload?.registration_open !== undefined) {
            setIsOpen(Boolean(payload.payload.registration_open));
            setLastUpdated(payload.payload.updated_at || new Date().toISOString());
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  const openClosedModal = useCallback(() => {
    setClosedModalOpen(true);
  }, []);

  const closeClosedModal = useCallback(() => {
    setClosedModalOpen(false);
  }, []);

  return (
    <RegistrationStatusContext.Provider
      value={{
        isOpen,
        isLoading,
        isError,
        lastUpdated,
        openClosedModal,
        closeClosedModal,
        refetch: fetchStatus,
      }}
    >
      {children}
      <RegistrationClosedModal isOpen={closedModalOpen} onClose={closeClosedModal} />
    </RegistrationStatusContext.Provider>
  );
}

export function useRegistrationStatus() {
  const context = useContext(RegistrationStatusContext);
  if (!context) {
    throw new Error("useRegistrationStatus must be used within a RegistrationStatusProvider");
  }
  return context;
}
