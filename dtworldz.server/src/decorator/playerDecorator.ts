import { Attributes } from "../engines/attributeSystem/attributes";
import characters from "../../data/characters";
import { Player } from "../schema/mobiles/player";

const heroTitles = {
    0: 'The Tactical Guardian',
    1: 'The Agile Scout',
    2: 'The Energetic Ranger',
    3: 'The Mighty Mountaineer',
    4: 'The Wise Survivor',
};

export class CharacterDecorator {
    static decorate(player: Player) {

        const character = characters[player.charIndex.toString() as unknown as keyof typeof characters];
        console.log(character);

        player.attributes.set(Attributes.Strength, character.stats.str);
        player.attributes.set(Attributes.Dexterity, character.stats.dex);
        player.attributes.set(Attributes.Intelligence, character.stats.int);

        

        player.health = player.maxHealth;
        player.hunger = player.maxHunger;
        player.energy = player.maxEnergy;

        player._speed = player.speed;
        player.title = character.title;
    }
}