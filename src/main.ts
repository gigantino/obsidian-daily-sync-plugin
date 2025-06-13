import { Plugin, TAbstractFile, TFile, Notice, requestUrl } from "obsidian";
import { buildTodoMap } from "./utils/buildTodoMap";

export default class DailySyncPlugin extends Plugin {
  async onload() {
    this.registerEvent(
      this.app.vault.on("modify", async (file: TAbstractFile) => {
        if (!(file instanceof TFile) || !file.path.startsWith("Daily/")) return;

        try {
          const raw = await this.app.vault.read(file);
          const todoMap = buildTodoMap(raw);
          if (!todoMap) return;

          await requestUrl({
            url: "http://localhost:5001/obsidian/content",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: file.name, todoMap }),
            throw: true,
          });

          new Notice(`DailySync: pushed ${Object.keys(todoMap).length} tasks`);
        } catch (err) {
          console.error("DailySync push failed", err);
          new Notice("DailySync: push failed (check console)");
        }
      })
    );
  }

  onunload() {
    console.log("DailySyncPlugin unloaded");
  }
}
