# Space Invaders Game

A classic arcade-style Space Invaders game implementation using HTML, CSS, and JavaScript. Players defend against waves of descending aliens while trying to achieve the highest score possible.

## Game Features

- Three challenging levels with increasing difficulty
- Score tracking system
- Lives system with three lives per game
- Protective walls that can be destroyed
- Enemy ships with animated sprites
- Responsive ship controls
- Pause/Resume functionality

## Controls

- **Left Arrow**: Move ship left
- **Right Arrow**: Move ship right
- **Spacebar**: Shoot
- **Pause Button**: Pause/Resume game
- **Escape**:show menu

## Gameplay Elements

### Player Ship
- Located at the bottom of the screen
- Can move left and right
- Shoots bullets upward to destroy enemies

### Enemies
- Multiple rows of aliens that move side to side
- Descend towards the player
- Randomly shoot projectiles
- Feature alternating sprite animations
- Each enemy destroyed awards 5 points

### Protective Walls
- Three destructible barriers
- Provide cover from enemy fire
- Can be damaged by both player and enemy shots
- Strategically placed between player and enemies

### Scoring System
- Each enemy destroyed: 5 points
- Score displayed with leading zeros (e.g., "0005")

## Game Mechanics

### Level Progression
- Game features 3 levels
- Each level increases:
  - Number of enemies
  - Enemy movement speed
  - Challenge level

### Game Over Conditions
- Player loses all three lives
- Enemies reach the bottom of the screen
- Completing all three levels (Victory)

### Features
- Pause/Resume functionality
- Restart option
- Level indicator
- Life counter
- Score display
- Animated game over messages

## Technical Details

The game uses several key JavaScript features:
- RequestAnimationFrame for smooth animations
- Collision detection system
- Throttled shooting mechanics
- Dynamic element creation and removal
- Event listeners for user input
- Sprite animation system

## Installation

1. Clone or download the repository
2. Ensure all game assets (including sprite images 'InvaderB1.png' and 'InvaderB2.png') are in the correct directory
3. Open the HTML file in a web browser to start playing

## Future Enhancements

Potential areas for future development:
- High score system
- Sound effects and background music
- Additional enemy types
- Power-up system
- Mobile device support
- Difficulty settings

## Credits

This Space Invaders clone is inspired by the classic 1978 arcade game created by Tomohiro Nishikado and manufactured by Taito.
