import { type } from "@colyseus/schema";
import { Position } from "../position";
import { BaseMobile } from "./baseMobile";
import { Client } from "colyseus";

export class Player extends BaseMobile {
    @type("number") charIndex: number = Math.floor(Math.random() * 4);
    client: Client;
    constructor(client:Client, name:string, position: Position | undefined) {
        super(name, position);
        this.client = client;
    }
}