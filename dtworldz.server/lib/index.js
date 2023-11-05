"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to use Colyseus Cloud
 *
 * If you're self-hosting (without Colyseus Cloud), you can manually instantiate a
 * Colyseus Server as documented here: 👉 https://docs.colyseus.io/server/api/#constructor-options
 */
const tools_1 = require("@colyseus/tools");
// Import arena config
const app_config_1 = __importDefault(require("./app.config"));
// Create and listen on 2567 (or PORT environment variable.)
(0, tools_1.listen)(app_config_1.default);
