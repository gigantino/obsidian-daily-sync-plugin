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
    containerEl.createEl("h2", { text: "DailySync plugin settings" });

    new Setting(containerEl)
      .setName("API endpoint")
      .setDesc("Base URL that receives your daily note payload")
      .addText((text) =>
        text
          .setPlaceholder("https://example.com/obsidian/content")
          .setValue(this.plugin.settings.endpoint)
          .onChange(async (value) => {
            this.plugin.settings.endpoint = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Authorization key")
      .setDesc("Optional bearer/API key (left blank for none)")
      .addText((text) =>
        text
          .setPlaceholder("abc123…")
          .setValue(this.plugin.settings.authKey)
          .onChange(async (value) => {
            this.plugin.settings.authKey = value.trim();
            await this.plugin.saveSettings();
          })
      );
  }
}
