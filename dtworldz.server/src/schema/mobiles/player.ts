import { type } from "@colyseus/schema";
import { Position } from "../position";
import { BaseMobile } from "./baseMobile";
import { Client } from "colyseus";
import { Attributes } from "../../engines/attributeSystem/attributes";
import { CharacterDecorator } from "../../decorator/playerDecorator";



export class Player extends BaseMobile {
    @type("number") charIndex: number = Math.floor(Math.random() * 5);
    @type("number") private _health: number;
    @type("number") private _hunger: number;
    @type("number") private _energy: number;
    @type("string") title: string = '';
    @type("boolean") private isOwner: boolean = false;
    client: Client;

    constructor(client: Client, name: string, position: Position | undefined) {
        super(name, position);
        this.client = client;
        this.sessionId = client.sessionId;
        CharacterDecorator.decorate(this);
        //console.log(this._speed)
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

    get healthRegen(): number {
        const strength = this.attributes.get(Attributes.Strength);
        const dexterity = this.attributes.get(Attributes.Dexterity);
        const intelligence = this.attributes.get(Attributes.Intelligence);
    
        const baseRegen = Math.floor(strength / 20); // Reduced strength impact
        const intelligenceBonus = Math.floor(intelligence / 30); // Moderate intelligence impact
        const dexterityBonus = Math.floor(dexterity / 15); // Increased dexterity impact
    
        // Enhancing the hunger effect on health regeneration
        const hungerEffect = (this.hunger / this.maxHunger) * 3; // Ranges from 0 to 3
    
        // Calculating the final value, ensuring it's within 5-15
        return Math.min(Math.max((baseRegen + intelligenceBonus + dexterityBonus) * hungerEffect, 5), 15);
    }
    
    

    get hungerDecay(): number {
        const strength = this.attributes.get(Attributes.Strength);
        const dexterity = this.attributes.get(Attributes.Dexterity);
        const intelligence = this.attributes.get(Attributes.Intelligence);
    
        // Base decay is lower to allow for a wider range.
        const baseDecay = 5;
    
        // Significantly increasing the effect of dexterity; higher dexterity leads to faster hunger decay.
        const dexterityEffect = (dexterity / 2); // More impact from dexterity
    
        // Adding a moderate effect of intelligence.
        const intelligenceEffect = (intelligence / 30); 
    
        // Strength inversely affects hunger decay; higher strength slightly reduces hunger decay.
        const strengthEffect = (40 - strength) / 10;
    
        // Ensuring the final value falls within the 5-15 range.
        return Math.min(Math.max(Math.ceil(baseDecay + dexterityEffect + intelligenceEffect - strengthEffect), 5), 15);
    }
    
    
    
    


}