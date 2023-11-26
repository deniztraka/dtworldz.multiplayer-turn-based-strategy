
![logo and background](https://github.com/deniztraka/dtworldz.multiplayer-turn-based-strategy/assets/11619491/7490eac2-258f-4c19-9bb9-ac78207f94e2)



# dtworldz.multiplayer-turn-based-strategy

Multiplayer Turn-Based Strategy/Adventure Game project

## Feature List
- Lobby System
- Players are able to join the lobby/game with room id
- Only game owner can start the game
- Option to create room up to 5 players including single player
- Chat system in lobby 
- Turn-based game play
- Path finding
- Movement system based on dynamically calculated cost of tiles
- Simple Procedural Generation of Game World

# ToDo List
- Different character play style focusing on exploration (minimum combat)
- Treasures
- Traps
- Different kind of enemies
- Animal Hunting
- Resource Gathering and Regeneration
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

