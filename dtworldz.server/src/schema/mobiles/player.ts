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
    @type("number") _speed: number;
    @type("string") title: string = '';
    @type("boolean") private isOwner: boolean = false;
    @type("boolean") isDead: boolean = false;
    
    private _deadBroadCasted: boolean = false;

    client: Client;

    constructor(client: Client, name: string, position: Position | undefined) {
        super(name, position);
        this.client = client;
        this.sessionId = client.sessionId;
        CharacterDecorator.decorate(this);
    }

    setOwner(val: boolean) {
        this.isOwner = val;
    }

    get isDeadBroadCasted(): boolean {
        return this._deadBroadCasted;
    }

    set isDeadBroadCasted(val: boolean) {
        this._deadBroadCasted = val;
    }

    get speed(): number {
        const dexterity = this.attributes.get(Attributes.Dexterity)

        // Base Speed (bs)
        const bs = 0.5; // means 0.5 tiles per second

        // Dexterity Speed Modifier (dsm)
        const dsm = dexterity / 10; //This modifier represents the additional speed a character gains from their dexterity.

        // Hunger Speed Modifier (HSM)
        const hsm = (this.hunger / this.maxHunger) * 0.5;

        const finalSpeed = bs + dsm - hsm;

        this._speed = finalSpeed;

        return finalSpeed
    }

    get health(): number {
        return this._health;
    }

    set health(newHealth: number) {
        if(newHealth <= 0) {
            this.isDead = true;
        }

        if (newHealth < 0) {
            this._health = 0;
        } else if (newHealth > this.maxHealth) {
            this._health = this.maxHealth;
        } else {
            this._health = parseFloat(newHealth.toFixed(0));
            
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
            this._energy = parseFloat(newEnergy.toFixed(0));
        }
    }

    get hungerDamage(): number {
        
        return 10;
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
            this._hunger = parseFloat(newhunger.toFixed(0));
        }
    }

    // Intelligence could increase the efficiency of resource usage, leading to a higher maximum hunger.
    get maxHunger(): number {
        const strength = this.attributes.get(Attributes.Strength);
        const intelligence = this.attributes.get(Attributes.Intelligence);
        return Math.floor(8 * (strength + intelligence * 0.75)); // Intelligence adds additional max hunger
    }


    get maxEnergy(): number {
        const dexterity = this.attributes.get(Attributes.Dexterity);
        return Math.floor(12 * dexterity); // Intelligence adds to max energy
    }

    get maxHealth(): number {
        const strength = this.attributes.get(Attributes.Strength);
        return Math.floor(10 * strength);
    }

    get healthRegen(): number {
        const baseHealthRegen = 2;

        return Math.floor(baseHealthRegen + (0.2 * this.hunger));
    }
    
    

    get hungerDecay(): number {
        const baseHungerDecay = 5;
        const dexterity = this.attributes.get(Attributes.Dexterity);
    
        // Ensuring the final value falls within the 5-15 range.
        return Math.floor(baseHungerDecay + (0.1 * dexterity));
    }

    get attackingEnergyDrain(): number {
        const dexterity = this.attributes.get(Attributes.Dexterity);

        // Base Energy Drain (BED)
        const bed = 10;

        // Weapon/Ability Intensity Modifier (WIM)
        // Light Attack (e.g., a quick jab): WIM = 5
        // Medium Attack (e.g., a standard swing): WIM = 10
        // Heavy Attack (e.g., a charged hit): WIM = 15
        const wim = 15;

        // Dexterity Efficiency (DE)
        const de = dexterity / 10

        return Math.floor(bed + wim - de);
    }
    
    attack(targetPlayer: Player): number {
        const baseWeaponDamage = 5;
        const strength = this.attributes.get(Attributes.Strength);

        // attack to target player
        let damageTaken = baseWeaponDamage + (strength * 1.5)

        targetPlayer.health -= damageTaken;
        this.energy -= this.attackingEnergyDrain;

        return damageTaken;
    }
    
    


}