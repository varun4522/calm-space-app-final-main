import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

let supabaseClient: any = null;

const initializeSupabase = () => {
  if (supabaseClient) return supabaseClient;

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('⚠️ Supabase credentials not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
    return null;
  }

  try {
    supabaseClient = createClient(url, key, {
      auth: {
        storage: ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return null;
  }
};

// Create a getter that initializes on first access
const getSupabase = () => {
  return initializeSupabase();
};

export const supabase = getSupabase();
