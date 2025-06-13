import { App, PluginSettingTab, Setting } from "obsidian";
import DailySyncPlugin from "./main";

export class DailySyncSettingTab extends PluginSettingTab {
  plugin: DailySyncPlugin;

  constructor(app: App, plugin: DailySyncPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "DailySync Settings" });
    new Setting(containerEl)
      .setName("Content endpoint")
      .setDesc("Endpoint called whenever the Daily directory gets edited.")
      .addText((text) =>
        text
          .setPlaceholder("e.g. http://localhost:5001/obsidian/content")
          .setValue(this.plugin.settings.contentEndpoint)
          .onChange(async (value) => {
            this.plugin.settings.contentEndpoint = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Authorization key")
      .setDesc("Optional authorization key. Can be left blank.")
      .addText((text) =>
        text
          .setPlaceholder("secret123...")
          .setValue(this.plugin.settings.authKey)
          .onChange(async (value) => {
            this.plugin.settings.authKey = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Debug mode")
      .setDesc("Unemployement (TM).")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.debugMode)
          .onChange(async (value) => {
            this.plugin.settings.debugMode = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
