export interface ProgressRepository<T> {
  load(): Promise<T | null>;
  save(value: T): Promise<void>;
}

export class LocalStorageRepository<T> implements ProgressRepository<T> {
  constructor(private readonly key: string) {}

  async load(): Promise<T | null> {
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem(this.key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async save(value: T): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(this.key, JSON.stringify(value));
  }
}

// Кейін SupabaseProgressRepository осы интерфейсті іске асырады.
