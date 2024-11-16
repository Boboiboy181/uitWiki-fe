import { StateCreator } from 'zustand';

export const logger =
  <T extends object>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (args) => {
        console.log('📝 Previous state:', get());
        set(args);
        console.log('✅ New state:', get());
      },
      get,
      api,
    );
