export interface DailySyncSettings {
  contentEndpoint: string;
  authKey: string;
  debugMode: boolean;
}

export const DEFAULT_SETTINGS: DailySyncSettings = {
  contentEndpoint: "http://localhost:5001/obsidian/content",
  authKey: "",
  debugMode: false,
};
