"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { locationService } from "@/services/locationService";

export type GeoPermission = "prompt" | "granted" | "denied";

interface Coordinates {
  lat: number;
  lng: number;
}

interface AddressInfo {
  country?: string;
  state?: string;
  city?: string;
}

interface LocationState {
  coords: Coordinates | null;
  address: AddressInfo | null;
  permission: GeoPermission;
  loading: boolean;
  lastUpdated?: number;
}

interface LocationContextValue extends LocationState {
  requestLocation: () => Promise<void>;
  setManualLocation: (coords: Coordinates, address?: AddressInfo) => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

const STORAGE_KEY = "siiqo.location";
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LocationState>({
    coords: null,
    address: null,
    permission: "prompt",
    loading: false,
    lastUpdated: undefined,
  });

  const persist = useCallback((next: Partial<LocationState>) => {
    setState((prev) => {
      const merged = { ...prev, ...next };
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            coords: merged.coords,
            address: merged.address,
            permission: merged.permission,
            lastUpdated: Date.now(),
          })
        );
      } catch {}
      return merged;
    });
  }, []);

  const loadFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<LocationState> & { lastUpdated?: number };
      if (parsed.lastUpdated && Date.now() - parsed.lastUpdated < STORAGE_TTL_MS) {
        setState((prev) => ({
          ...prev,
          coords: parsed.coords ?? null,
          address: parsed.address ?? null,
          permission: (parsed.permission as GeoPermission) || "prompt",
          lastUpdated: parsed.lastUpdated,
        }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, []);

  const reverseGeocode = useCallback(async (coords: Coordinates): Promise<AddressInfo | null> => {
    try {
      const data = await locationService.getAddressFromCoordinates(coords.lat, coords.lng);
      const address: AddressInfo = {
        country: data?.address?.country,
        state: data?.address?.state || data?.address?.region,
        city: data?.address?.city || data?.address?.town || data?.address?.village,
      };
      return address;
    } catch {
      return null;
    }
  }, []);

  const requestLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));

    const getViaNavigator = async (): Promise<boolean> => {
      if (typeof window === "undefined" || !("geolocation" in navigator)) return false;
      try {
        const position: GeolocationPosition = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge: 0,
          });
        });
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const address = await reverseGeocode(coords);
        console.log('[LocationContext] User coordinates detected:', coords);
        persist({
          coords,
          address: address || null,
          permission: "granted",
          loading: false,
          lastUpdated: Date.now(),
        });
        return true;
      } catch (err: any) {
        const code = (err && err.code) || 0;
        if (code === 1) {
          // PERMISSION_DENIED
          persist({ permission: "denied" });
        }
        return false;
      }
    };

    const getViaIP = async (): Promise<void> => {
      try {
        const data = await locationService.detectLocation();
        const coords: Coordinates | null =
          typeof data?.latitude === "number" && typeof data?.longitude === "number"
            ? { lat: data.latitude, lng: data.longitude }
            : null;
        const address: AddressInfo = {
          country: data?.country_name,
          state: data?.region,
          city: data?.city,
        };
        console.log('[LocationContext] IP-based coordinates:', coords);
        persist({
          coords,
          address: address || null,
          permission: state.permission === "denied" ? "denied" : "prompt",
          loading: false,
          lastUpdated: Date.now(),
        });
      } catch {
        setState((s) => ({ ...s, loading: false }));
      }
    };

    const success = await getViaNavigator();
    if (!success) await getViaIP();
  }, [persist, reverseGeocode, state.permission]);

  const setManualLocation = useCallback(async (coords: Coordinates, address?: AddressInfo) => {
    const resolvedAddress = address || (await reverseGeocode(coords));
    persist({ coords, address: resolvedAddress || null, permission: "granted", lastUpdated: Date.now() });
  }, [persist, reverseGeocode]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    // Auto-request on first load if no cached coords
    if (!state.coords) {
      requestLocation();
    }
  }, [state.coords, requestLocation]);

  const value = useMemo<LocationContextValue>(() => ({
    ...state,
    requestLocation,
    setManualLocation,
  }), [state, requestLocation, setManualLocation]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = (): LocationContextValue => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
};
