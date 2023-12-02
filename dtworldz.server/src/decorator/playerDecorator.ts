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
                player.attributes.set(Attributes.Strength, 35);
                player.attributes.set(Attributes.Dexterity, 15);
                player.attributes.set(Attributes.Intelligence, 35);
                break;

            // The Agile Scout
            // Play Style: Fast and agile, adept at navigating Forests and Water.
            case 1:
                player.attributes.set(Attributes.Strength, 10);
                player.attributes.set(Attributes.Dexterity, 40);
                player.attributes.set(Attributes.Intelligence, 30);
                break;

            // The Energetic Ranger
            // Play Style: Swift and versatile, capable in Forests and Waters, with decent resource management.
            case 2:
                player.attributes.set(Attributes.Strength, 25);
                player.attributes.set(Attributes.Dexterity, 45);
                player.attributes.set(Attributes.Intelligence, 20);
                break;

            // The Mighty Mountaineer
            // Play Style: Strong and resilient, excels in Climbing and has high health.
            case 3:
                player.attributes.set(Attributes.Strength, 40);
                player.attributes.set(Attributes.Dexterity, 30);
                player.attributes.set(Attributes.Intelligence, 5);
                break;

            // The Wise Survivor
            // Play Style: Balanced and resourceful, good at managing health, hunger, and energy.
            case 4:
                player.attributes.set(Attributes.Strength, 20);
                player.attributes.set(Attributes.Dexterity, 20);
                player.attributes.set(Attributes.Intelligence, 40);
                break;
        }

        player._health = player.maxHealth;
        player._hunger = player.maxHunger;
        player._energy = player.maxEnergy;
        player.title = heroTitles[player.charIndex as keyof typeof heroTitles];
    }
}