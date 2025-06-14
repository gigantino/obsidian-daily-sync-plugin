import { Plugin, TAbstractFile, TFile, Notice, requestUrl } from "obsidian";
import { buildTodoMap } from "./utils/buildTodoMap";
import { DailySyncSettings, DEFAULT_SETTINGS } from "./settings";
import { DailySyncSettingTab } from "./settingsTab";

export default class DailySyncPlugin extends Plugin {
  settings!: DailySyncSettings;

  async onload() {
    console.log("DailySync loaded.");
    await this.loadSettings();

    this.addSettingTab(new DailySyncSettingTab(this.app, this));

    this.registerEvent(
      this.app.vault.on("modify", async (file: TAbstractFile) => {
        if (!(file instanceof TFile) || !file.path.startsWith("Daily/")) return;

        try {
          const raw = await this.app.vault.read(file);
          const todoMap = buildTodoMap(raw);
          if (!todoMap) return;

          await requestUrl({
            url: this.settings.contentEndpoint,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(this.settings.authKey && {
                Authorization: `Bearer ${this.settings.authKey}`,
              }),
            },
            body: JSON.stringify({
              filePath: file.path,
              fileName: file.name,
              todoMap,
            }),
            throw: true,
          });

          const debugMessage = `DailySync: pushed ${
            Object.keys(todoMap).length
          } tasks`;
          console.info(debugMessage);
          if (this.settings.debugMode) {
            new Notice(debugMessage);
          }
        } catch (err) {
          console.error("DailySync push failed", err);
          new Notice("DailySync: push failed (check console)");
        }
      })
    );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
}
