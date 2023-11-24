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


# Login or Create Room Screen
<img width="1086" alt="Screenshot 2023-11-24 at 4 34 32 PM" src="https://github.com/deniztraka/dtworldz.multiplayer-turn-based-strategy/assets/11619491/33a4986f-b218-4de3-a730-217831767fec">

# Lobby Screen
<img width="699" alt="Screenshot 2023-11-24 at 4 36 37 PM" src="https://github.com/deniztraka/dtworldz.multiplayer-turn-based-strategy/assets/11619491/d5213c35-017f-4307-9910-dc7cfc0f318a">

# In Game Screen
<img width="1119" alt="Screenshot 2023-11-24 at 4 37 57 PM" src="https://github.com/deniztraka/dtworldz.multiplayer-turn-based-strategy/assets/11619491/e86b1548-35fb-4a7d-82ab-d7408926e80f">
