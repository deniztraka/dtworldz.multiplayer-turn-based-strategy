import { type } from "@colyseus/schema";
import { Position } from "../position";
import { BaseMobile } from "./baseMobile";
import { Client } from "colyseus";
import { Attributes } from "../../engines/attributeSystem/attributes";

export class Player extends BaseMobile {
    @type("number") charIndex: number = Math.floor(Math.random() * 5);
    @type("number") private _health: number = 100;
    @type("number") private _hunger: number = 24;
    @type("number") private _energy: number = 12;
    @type("boolean") private isOwner: boolean = false;
    client: Client;

    constructor(client: Client, name: string, position: Position | undefined) {
        super(name, position);
        this.client = client;
        this.sessionId = client.sessionId;
        this._health = this.maxHealth;
        this._hunger = this.maxHunger;
        this._energy = this.maxEnergy;
    }
    setOwner(val: boolean) {
        this.isOwner = val;
    }

    get health(): number {
        return this._health;
    }

    set health(newHealth: number) {
        if (newHealth < 0) {
            this._health = 0;
        } else if (newHealth > this.maxHealth) {
            this._health = this.maxHealth;
        } else {
            this._health = newHealth;
        }
    }

    get energy(): number {
        return this._energy;
    }

    set energy(newEnergy: number) {
        if (newEnergy < 0) {
            this._energy = 0;
        } else if (newEnergy > this.maxEnergy) {
            this._energy = this.maxEnergy;
        } else {
            this._energy = newEnergy;
        }
    }

    get hunger(): number {
        return this._hunger;
    }

    set hunger(newhunger: number) {
        if (newhunger < 0) {
            this._hunger = 0;
        } else if (newhunger > this.maxHunger) {
            this._hunger = this.maxHunger;
        } else {
            this._hunger = newhunger;
        }
    }

    // Intelligence could increase the efficiency of resource usage, leading to a higher maximum hunger.
    get maxHunger(): number {
        const strength = this.attributes.get(Attributes.Strength);
        const intelligence = this.attributes.get(Attributes.Intelligence);
        return Math.floor((strength * 2) + (intelligence / 5)); // Intelligence adds additional max hunger
    }


    // Intelligence could contribute to better energy management or mental stamina.
    get maxEnergy(): number {
        const dexterity = this.attributes.get(Attributes.Dexterity);
        const intelligence = this.attributes.get(Attributes.Intelligence);
        return Math.floor((dexterity * 2.5) + (intelligence / 4)); // Intelligence adds to max energy
    }

    // Intelligence might contribute to better overall health through knowledge of care and prevention.
    get maxHealth(): number {
        const strength = this.attributes.get(Attributes.Strength);
        const intelligence = this.attributes.get(Attributes.Intelligence);
        return Math.floor((strength * 10) + (intelligence / 2)); // Intelligence adds additional health
    }

    // Intelligence could play a role in more efficient recovery.
    get healthRegen(): number {
        const baseRegen = Math.floor(this.attributes.get(Attributes.Strength) / 10);
        const intelligenceBonus = Math.floor(this.attributes.get(Attributes.Intelligence) / 20);
        const hungerBonus = (this.hunger / this.maxHunger) > 0.5 ? 2 : 1;
        return (baseRegen + intelligenceBonus) * hungerBonus;
    }

    // The existing logic already integrates Intelligence, reducing hunger decay with higher intelligence.
    get hungerDecay(): number {
        const dexterity = this.attributes.get(Attributes.Dexterity);
        const intelligence = this.attributes.get(Attributes.Intelligence);
        const baseDecay = 5;
        const intelligenceEffect = 1 - (intelligence / 100);
        return Math.max(Math.ceil(baseDecay - (dexterity / 10)) * intelligenceEffect, 1);
    }


}