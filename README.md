
![logo and background](https://github.com/deniztraka/dtworldz.multiplayer-turn-based-strategy/assets/11619491/7490eac2-258f-4c19-9bb9-ac78207f94e2)

# dtworldz.multiplayer-turn-based-strategy

Multiplayer Turn-Based Strategy/Adventure Game project

It's live and under development on: [https://dtworldz-client.onrender.com/](https://dtworldz-client.onrender.com/ ) 

## Feature List
- Lobby System
- Players can join the lobby/game with room ID
- Only the game owner can start the game
- Option to create room for up to 5 players including single player
- Chat system in lobby 
- Turn-based gameplay
- Pathfinding
- Movement system based on dynamically calculated cost of tiles
- Simple Procedural Generation of Game World
- Different character playstyle focusing on exploration (minimum combat)]

### Attributes System
- More strength means more max health.
- Dexterity makes the character quicker while moving but makes the character hungry quicker. Gives the character more energy.
- Intelligence provides better use of resources. It has bigger effects on health regain than the other attributes. Gives the character more energy.

### Hunger System
Less hungry characters will gain more health on every turn.
Intelligence and Dexterity have meaningful effects on the character's hunger decay
Intelligence provides better management of resources so the character will lose fewer hunger points each turn.
Dexterity means quick metabolism, which means losing more hunger points each turn.


### Traits System
- Swimming allows moving on Water tiles. Requires ->  30 Dexterity, 5 Strength 
- Climbing allows moving on Mountain tiles. Requires -> 30 Dexterity, 30 Strength
- Pathfinding allows moving on Forest tiles. requires -> 15 Intelligence, 20 Dexterity 

### 5 Different Characters
#### The Tactical Guardian: Tough and strategic, with high health and efficient recovery, but slower movement.
Strength 35, Dexterity: 15, Intelligence 35

#### The Agile Scout: Fast and agile, adept at navigating Forests and Water.
Strength 10, Dexterity: 40, Intelligence 30

#### The Energetic Ranger: Swift and versatile, capable in Forests and Waters, with decent resource management.
Strength 25, Dexterity: 45, Intelligence 20

#### The Mighty Mountaineer: Strong and resilient, excels in Climbing and has high health.
Strength 40, Dexterity: 30, Intelligence 5

#### The Wise Survivor: Balanced and resourceful, good at managing health, hunger, and energy.
Strength 20, Dexterity: 20, Intelligence 40



# ToDo List
- Animal Hunting
- Resource Gathering and Regeneration
- Treasures
- Traps
- Different kinds of enemies
- Villages
- Advanced Procedurally generated game world
- Different Biomes
- Minor base building system
- Dynamic World Events
- Better Graphics
- Better Animations
- Better UI

## Technical Details
This project is implemented on top of [Colyseus Framework](https://colyseus.io) for server side game logic. Client side is using [Phaser](https://phaser.io) as rendering engine.

## Installation
### Server
- Go to dtworldz.server folder
`cd dtworldz.server`

- Install package
`npm install`

- Run server
`npm run start`

### Client
- Go to dtworldz.client folder
`cd dtworldz.client`

- Install package
`npm install`

- Run client
`npm run dev`

### Shared Library
Shared library is obsolete and it doesnt have any usage for now.
It is intended to hold the code shared by both server and client side and will be improved later.


# Welcome Screen
<img width="1171" alt="Screenshot 2023-11-26 at 6 28 22 PM" src="https://github.com/deniztraka/dtworldz.multiplayer-turn-based-strategy/assets/11619491/df8156b6-7fea-4c3c-a1a0-61736187acd8">

# Lobby Screen
<img width="1169" alt="Screenshot 2023-11-26 at 6 30 18 PM" src="https://github.com/deniztraka/dtworldz.multiplayer-turn-based-strategy/assets/11619491/0a2b00f0-3323-4788-a06e-76accbc50280">


# In Game Screen
<img width="1119" alt="Screenshot 2023-11-24 at 4 37 57 PM" src="https://github.com/deniztraka/dtworldz.multiplayer-turn-based-strategy/assets/11619491/1b5e003b-8394-427b-b90d-8f3907ec7479">

