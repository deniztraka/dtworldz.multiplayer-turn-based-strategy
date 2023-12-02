import { type } from "@colyseus/schema";
import { Position } from "../position";
import { BaseMobile } from "./baseMobile";
import { Client } from "colyseus";

export class Player extends BaseMobile {
    @type("number") charIndex: number = Math.floor(Math.random() * 5);
    @type("number") health: number = 100;
    @type("number") hunger: number = 24;
    @type("number") energy: number = 12;
    @type("boolean") private isOwner: boolean = false;
    client: Client;
    constructor(client:Client, name:string, position: Position | undefined) {
        super(name, position);
        this.client = client;
        this.sessionId = client.sessionId;
    }
    setOwner(val: boolean) {
        this.isOwner = val;
    }
}