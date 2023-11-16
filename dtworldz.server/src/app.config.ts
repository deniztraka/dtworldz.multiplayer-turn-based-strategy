import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { Server } from "colyseus";

/**
 * Import your Room files
 */
import { WorldRoomOld } from "./rooms/WorldRoomOld";
import { WorldRoom } from "./rooms/dtWorldz";

let gameServerRef: Server;
let latencySimulationMs: number = 0;

export default config({
    options: {
        devMode: false,
    },

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('dtworldz', WorldRoom);

        //
        // keep gameServer reference, so we can
        // call `.simulateLatency()` later through an http route
        //
        gameServerRef = gameServer;
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        // these latency methods are for development purpose only.
        app.get("/latency", (req, res) => res.json(latencySimulationMs));
        app.get("/simulate-latency/:milliseconds", (req, res) => {
            latencySimulationMs = parseInt(req.params.milliseconds || "100");

            // enable latency simulation
            gameServerRef.simulateLatency(latencySimulationMs);

            res.json({ success: true });
        });

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
