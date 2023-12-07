import { Attributes } from "../engines/attributeSystem/attributes";

const heroTitles = {
    0: 'The Tactical Guardian',
    1: 'The Agile Scout',
    2: 'The Energetic Ranger',
    3: 'The Mighty Mountaineer',
    4: 'The Wise Survivor',
};

export class CharacterDecorator {
    static decorate(player: any) {
        switch (player.charIndex) {
            // The Tactical Guardian
            // Play Style: Tough and strategic, with high health and efficient recovery, but slower movement.
            case 0:
                player.attributes.set(Attributes.Strength, 6);
                player.attributes.set(Attributes.Dexterity, 6);
                player.attributes.set(Attributes.Intelligence, 6);
                break;

            // The Agile Scout
            // Play Style: Fast and agile, adept at navigating Forests and Water.
            case 1:
                player.attributes.set(Attributes.Strength, 4);
                player.attributes.set(Attributes.Dexterity, 5);
                player.attributes.set(Attributes.Intelligence, 8);
                break;

            // The Energetic Ranger
            // Play Style: Swift and versatile, capable in Forests and Waters, with decent resource management.
            case 2:
                player.attributes.set(Attributes.Strength, 5);
                player.attributes.set(Attributes.Dexterity, 8);
                player.attributes.set(Attributes.Intelligence, 4);
                break;

            // The Mighty Mountaineer
            // Play Style: Strong and resilient, excels in Climbing and has high health.
            case 3:
                player.attributes.set(Attributes.Strength, 8);
                player.attributes.set(Attributes.Dexterity, 3);
                player.attributes.set(Attributes.Intelligence, 5);
                break;

            // The Wise Survivor
            // Play Style: Balanced and resourceful, good at managing health, hunger, and energy.
            case 4:
                player.attributes.set(Attributes.Strength, 6);
                player.attributes.set(Attributes.Dexterity, 7);
                player.attributes.set(Attributes.Intelligence, 2);
                break;
        }

        player._health = player.maxHealth;
        player._hunger = player.maxHunger;
        player._energy = player.maxEnergy;
        player._speed = player.speed;
        player.title = heroTitles[player.charIndex as keyof typeof heroTitles];
    }
}