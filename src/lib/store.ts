import { writable } from 'svelte/store';
import type { AccountDoc, AccountGroupDoc, CategoryDoc, CurrencyDoc, SettingsDoc } from '~/lib/db';

export const accounts = writable<AccountDoc[]>([]);
export const accountGroups = writable<AccountGroupDoc[]>([]);
export const categoires = writable<CategoryDoc[]>([]);
export const currencies = writable<CurrencyDoc[]>([]);
export const settings = writable<SettingsDoc[]>([]);
