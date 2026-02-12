# Conquer Life · Browser Life Sim RPG

A browser-based life simulation RPG where you build your character from the ground up, make choices between legal and illegal paths, and work your way to the top. Start with nothing and conquer life through jobs, skills, businesses, and strategic decision-making.

## 🎮 Game Overview

**Conquer Life** is an incremental life simulation game where you:
- Create a character with a unique background and starting location
- Work jobs (legal or illegal) to earn money
- Train skills to unlock better opportunities
- Start and manage businesses for passive income
- Travel between cities and areas
- Make choices that affect your notoriety, respect, and reputation
- Build your empire through strategic planning and risk management

## ✨ Features

### Character Creation
- **Customizable Character**: Choose your first name, last name, and full name
- **Starting Locations**: Begin your journey in major cities around the world:
  - Los Angeles, USA
  - Chicago, USA
  - New York, USA
  - London, UK
  - Moscow, Russia
  - Beijing, China
- **Character Backgrounds**: Select from various backgrounds that provide skill boosts:
  - Street Rat (Street Smarts +3, Charisma +1)
  - College Graduate (Intelligence +3, Law +1)
  - Business Heir (Business +3, Charisma +1)
  - Former Athlete (Strength +3, Charisma +1)
  - Military Veteran (Strength +2, Intelligence +1, Street Smarts +1)
  - Blank Slate (No bonuses, pure challenge)

### Game Systems

#### Skills
Train six core skills that unlock opportunities:
- **Strength**: Physical prowess for manual labor and combat
- **Intelligence**: Mental acuity for complex jobs and problem-solving
- **Charisma**: Social skills for negotiation and leadership
- **Street Smarts**: Street knowledge for illegal activities
- **Law**: Legal expertise for legitimate business and government work
- **Business**: Commercial acumen for entrepreneurship

#### Shifts (Work)
Work shifts across different areas of each city. Shifts are the main way to earn money and gain skills; a separate **Jobs** system (career paths) is planned for the future.

- **Metropolis**: Fast food, street dealing, and urban opportunities
- **Suburbs**: Farm work, retail, and quieter lifestyles
- **Industrial District**: Factory work, warehouses, and manufacturing
- **Downtown**: Police, law, government, and high-stakes business

Shifts are categorized as:
- **Legal**: Safe but lower-paying opportunities
- **Illegal**: High-risk, high-reward activities
- **Government**: Stable careers with good benefits

**Shift placement**: Each shift has an area (required) and an optional city. If no city is set, the shift is available in that area in all cities; if a city is set, the shift is unique to that city (enabling future city-specific opportunities).

**Work Shift flow**:
- Click **Work Shift** in the Jobs view (Shifts tab) or in the Player Sidebar. Your shift is resolved immediately and the **Shift menu** opens.
- The Shift menu shows: job name, **shift quality** (Very Bad, Bad, Normal, Good, Very Good), what happened during the shift, and rewards/penalties (money, skill EXP, notoriety for illegal work).
- **Shift quality** is random: 50% Normal, 25% Good, 15% Bad, 5% Very Good, 5% Very Bad. Each non-Normal quality has multiple random events per shift type (e.g. tips, accidents, bonuses).
- Use **Work Another Shift** in the Shift menu to work again; the menu updates with the new result. Buttons are anchored at the bottom so the layout stays fixed.
- **Close** dismisses the menu. Work Shift in the sidebar or Jobs view validates location (and city when the shift is city-specific) and energy before working.

**Work Shift button (Player Sidebar)**:
- Disabled when you're in the wrong area/city or have less than 15 energy
- Provides quick access to work your current shift

#### Businesses
Start and manage businesses for passive income:
- **Legal Businesses**: Restaurants, retail stores, law firms
- **Illegal Businesses**: Black market operations, smuggling networks
- Each business requires specific skills and capital to start
- Businesses generate daily profits (with variance) after expenses
- **Multi-City Ownership**: Own the same business type in multiple cities and areas
- Businesses are grouped by city in the Assets view with collapsible sections
- View total upkeep and net profit per day for each city

#### Shop System
- **24 Area-Based Shops**: Each city has 4 areas (Metropolis, Suburbs, Industrial, Downtown); each area has its own shop with unique items (same area = same items in every city).
- **Buy Only When Present**: You can only purchase items when you are in that area; otherwise the shop shows "Travel to [Area] to buy".
- **Area Preview**: Switch between area tabs in the Shop window to preview what each area sells before traveling.
- **Category Filters**: Filter items by **Clothing** (Head, Chest, Legs, Hands, Eye, Face), **Accessories** (Bag, Ring, Necklace), **Weapons** (Melee, Gun), **Food**, and **Consumables**.
- **Item Variety**: Area-specific equipment (e.g. Designer Blazer in Metropolis, Hard Hat in Industrial), bags that increase inventory slots, food and consumables.
- **Slot/Category Labels**: Each item shows its equipment slot or category (e.g. Chest, Bag, Food) in the shop and in your inventory (not when equipped).
- **Shop Button**: Located on the far right of the top bar navigation for quick access.

#### Inventory & Equipment
- **Equipment Slots**: Head, Chest, Legs, Hands, Eye, Face, Bag, Ring, Necklace, Melee, Gun.
- **Bags**: Equipping a bag increases inventory capacity; switching to a smaller bag may cause item loss (with confirmation).
- **Slot Labels**: Items in your inventory display their slot or category; equipped items are shown in the Equipment panel by slot.

#### Travel System
- Travel between cities and areas within cities
- Each travel action has a cooldown period
- Different areas offer different job and business opportunities
- Travel button is accessible from the Player Sidebar Location section
- Location validation ensures you're in the right place for actions

#### Time & Energy System
- **Time System**: Track time throughout the day (9:00 AM - 11:59 PM)
- **Energy System**: Actions consume energy (0-100)
- Energy regenerates when you advance to the next day
- Manage your time and energy efficiently to maximize progress

### Save System
- **Multiple Save Slots**: Save up to 5 different game states
- **Auto-Save**: Configurable automatic saving at set intervals
- **Manual Save**: Save your progress at any time
- **Load Game**: Resume from any saved slot
- **Settings Persistence**: Game settings saved locally
- **Cheat Indicators**: Save files show indicators when cheats have been used

### Game Mechanics

#### Notoriety & Respect
- **Notoriety**: Increases with illegal activities
  - High notoriety (>40) can trigger random penalties
  - Legal costs and cleanup fees reduce notoriety
- **Respect**: Earned through achievements and accomplishments
  - Build your reputation in the game world

#### Journal System
Track your progress and accomplishments through the Journal tab in the Player Sidebar:
- **Recent Events**: View the last 30 game events with timestamps
- **Missions**: Track active missions and objectives (coming soon)
- **Achievements**: View unlocked achievements and track your accomplishments
  - Achievements are permanently disabled when cheats are enabled
  - Cheat indicators show when achievements are disabled

#### Cheat System
A comprehensive cheat menu for testing and experimentation:
- **Access**: Toggle cheat menu in Settings (per save file)
- **Cash Cheats**: Add money in various amounts
- **Energy Cheats**: Enable unlimited energy that persists across sessions
- **Business Cheats**: 
  - Unlock all businesses in a specific city
  - Unlock all businesses in all cities
- **Skill Cheats**: Increase skill levels or max all skills instantly
- **Cheat State**: 
  - Cheat usage is tracked per save file
  - Save files display cheat indicators
  - Enabling cheats permanently disables achievements for that save
  - Cheat state persists across game sessions

#### Health & Money
- **Health**: Decreases if you go into debt
  - Health at 0 ends your run
- **Money**: The foundation of your empire
  - Earn through jobs and businesses
  - Spend on training, businesses, and expenses

#### Day Progression
- Advance days to progress time
- Businesses generate profits daily
- Energy regenerates each day
- Random events can occur based on your choices

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Doctor-Duck/conquer-life-browser.git
cd conquer-life-browser
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Technology Stack

- **React 18**: UI framework
- **Vite**: Build tool and development server
- **LocalStorage**: Save game state persistence
- **Vanilla JavaScript**: Core game logic

## 📁 Project Structure

```
conquer-life-browser/
├── src/
│   ├── components/       # React components
│   │   ├── CharacterCreator.jsx
│   │   ├── CheatMenu.jsx
│   │   ├── LoadGameView.jsx
│   │   ├── MainMenu.jsx
│   │   ├── NewGameView.jsx
│   │   ├── PlayerSidebar.jsx
│   │   ├── SaveNotification.jsx
│   │   ├── Settings.jsx
│   │   ├── ShiftMenu.jsx   # Shift result modal (quality, events, rewards)
│   │   ├── ShopView.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SmartTooltip.jsx
│   │   └── TopBar.jsx
│   ├── data/             # Game data (separate from logic for easier editing)
│   │   ├── index.js      # Re-exports all data
│   │   ├── skills.js     # Skill IDs and base skills
│   │   ├── shifts.js     # Shift categories and shift list (area + optional city)
│   │   ├── shiftEvents.js # Shift quality rarities and per-shift random events
│   │   ├── businesses.js # Business definitions
│   │   ├── locations.js  # City areas, cities, starting locations
│   │   ├── character.js  # Character backgrounds
│   │   ├── items.js      # Equipment slots, item categories, items, shop items
│   │   └── constants.js # Save/settings keys, skill EXP constants
│   ├── views/            # Game view components
│   │   ├── AssetsView.jsx
│   │   ├── BusinessesView.jsx
│   │   ├── HousingView.jsx
│   │   ├── InventoryView.jsx
│   │   ├── JobsView.jsx   # Shifts tab + Businesses tab (Jobs tab coming later)
│   │   ├── OverviewView.jsx
│   │   ├── SkillsView.jsx
│   │   └── TravelView.jsx
│   ├── App.jsx           # Main application component
│   ├── gameCore.js       # Core game logic (imports data from src/data/)
│   ├── index.css         # Global styles
│   └── main.jsx          # Application entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.mts       # Vite configuration
└── styles.css            # Additional styles
```

## 🎯 Gameplay Tips

1. **Start Small**: Begin with legal jobs to build your skills and capital safely
2. **Train Strategically**: Focus on skills that unlock your desired career path
3. **Manage Risk**: Illegal activities pay more but increase notoriety and risk
4. **Invest Wisely**: Save money to start businesses for passive income
5. **Balance Energy**: Don't exhaust yourself - manage your time and energy
6. **Travel Smart**: Different areas offer different opportunities
7. **Save Often**: Use multiple save slots to experiment with different strategies
8. **Expand Your Empire**: Own the same business in multiple cities to maximize passive income
9. **Use Location Validation**: The Work Shift button validates your location - make sure you're in the right area
10. **Track Your Progress**: Check the Journal tab regularly to review events and achievements

## 🔮 Future Features

Potential additions and improvements:
- **Jobs system**: Long-term career paths (separate from one-off shifts)
- City-unique shifts: Add shifts with `cityId` set for location-specific opportunities
- More cities and locations
- Housing system with property ownership
- Relationships and NPCs
- Random events and storylines
- More achievements and milestones
- Leaderboards and statistics
- Mission system implementation

## 📝 License

This project is private and not licensed for public use.

## 👤 Author

**Doctor-Duck**

---

*Start with nothing. Build your empire. Conquer life.*
