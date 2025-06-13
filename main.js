'use strict';

var obsidian = require('obsidian');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/** Collect all checklist items under headings that are *exactly* "## To-Do". */
function buildTodoMap(md) {
    var headingRE = /^##\s+to-do\s*$/i; // "## To-Do" ONLY
    var checklistRE = /^\s*-\s*\[([ xX])\]\s+(.*)$/; // "- [ ] Task" or "- [x] Task"
    var lines = md.split(/\r?\n/);
    var map = {};
    for (var i = 0; i < lines.length; i++) {
        if (!headingRE.test(lines[i]))
            continue; // skip non-exact headings
        for (i = i + 1; i < lines.length && !/^##\s+/.test(lines[i]); i++) {
            var m = lines[i].match(checklistRE);
            if (m)
                map[m[2].trim()] = m[1].toLowerCase() === "x";
        }
    }
    return Object.keys(map).length ? map : null;
}

var DEFAULT_SETTINGS = {
    contentEndpoint: "http://localhost:5001/obsidian/content",
    authKey: "",
    debugMode: false,
};

var DailySyncSettingTab = /** @class */ (function (_super) {
    __extends(DailySyncSettingTab, _super);
    function DailySyncSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    DailySyncSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl("h2", { text: "DailySync Settings" });
        new obsidian.Setting(containerEl)
            .setName("Content endpoint")
            .setDesc("Endpoint called whenever the Daily directory gets edited.")
            .addText(function (text) {
            return text
                .setPlaceholder("e.g. http://localhost:5001/obsidian/content")
                .setValue(_this.plugin.settings.contentEndpoint)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.contentEndpoint = value.trim();
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName("Authorization key")
            .setDesc("Optional authorization key. Can be left blank.")
            .addText(function (text) {
            return text
                .setPlaceholder("secret123...")
                .setValue(_this.plugin.settings.authKey)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.authKey = value.trim();
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName("Debug mode")
            .setDesc("Unemployement (TM).")
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.debugMode)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.debugMode = value;
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return DailySyncSettingTab;
}(obsidian.PluginSettingTab));

var DailySyncPlugin = /** @class */ (function (_super) {
    __extends(DailySyncPlugin, _super);
    function DailySyncPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DailySyncPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("DailySync loaded.");
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new DailySyncSettingTab(this.app, this));
                        this.registerEvent(this.app.vault.on("modify", function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var raw, todoMap, debugMessage, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(file instanceof obsidian.TFile) || !file.path.startsWith("Daily/"))
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, this.app.vault.read(file)];
                                    case 2:
                                        raw = _a.sent();
                                        todoMap = buildTodoMap(raw);
                                        if (!todoMap)
                                            return [2 /*return*/];
                                        return [4 /*yield*/, obsidian.requestUrl({
                                                url: this.settings.contentEndpoint,
                                                method: "POST",
                                                headers: __assign({ "Content-Type": "application/json" }, (this.settings.authKey && {
                                                    Authorization: "Bearer ".concat(this.settings.authKey),
                                                })),
                                                body: JSON.stringify({
                                                    filePath: file.path,
                                                    fileName: file.name,
                                                    todoMap: todoMap,
                                                }),
                                                throw: true,
                                            })];
                                    case 3:
                                        _a.sent();
                                        debugMessage = "DailySync: pushed ".concat(Object.keys(todoMap).length, " tasks");
                                        console.info(debugMessage);
                                        if (this.settings.debugMode) {
                                            new obsidian.Notice(debugMessage);
                                        }
                                        return [3 /*break*/, 5];
                                    case 4:
                                        err_1 = _a.sent();
                                        console.error("DailySync push failed", err_1);
                                        new obsidian.Notice("DailySync: push failed (check console)");
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }));
                        return [2 /*return*/];
                }
            });
        });
    };
    DailySyncPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [{}, DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    DailySyncPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DailySyncPlugin;
}(obsidian.Plugin));

module.exports = DailySyncPlugin;
