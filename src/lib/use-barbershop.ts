'use client';

import { useEffect, useState } from 'react';

/**
 * Shape of the barbershop record coming from /api/barbershop.
 * Mirrors the Prisma model. All strings default to '' in the DB,
 * so consumers should treat empty-string as "not configured".
 */
export type ShopData = {
  id?: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  scheduleJson: string;
};

const EMPTY: ShopData = {
  name: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  scheduleJson: '{}',
};

/**
 * Fetches /api/barbershop once on mount.
 * `no-store` cache option ensures we always read the latest value after admin saves.
 */
export function useBarbershop(): ShopData {
  const [shop, setShop] = useState<ShopData>(EMPTY);

  useEffect(() => {
    fetch('/api/barbershop', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: ShopData) => setShop({ ...EMPTY, ...d }))
      .catch(() => {});
  }, []);

  return shop;
}

/** Returns `dbValue` when non-empty, otherwise `fallback`. */
export function preferDb(dbValue: string | undefined | null, fallback: string): string {
  return dbValue && dbValue.trim() ? dbValue : fallback;
}
