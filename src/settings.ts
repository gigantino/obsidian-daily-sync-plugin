export interface DailySyncSettings {
  endpoint: string;
  authKey: string;
}

export const DEFAULT_SETTINGS: DailySyncSettings = {
  endpoint: "http://localhost:5001/obsidian/content",
  authKey: "",
};
