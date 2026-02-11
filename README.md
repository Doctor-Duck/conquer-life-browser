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

#### Jobs
Work jobs across different areas of each city:
- **Metropolis**: Fast food, street dealing, and urban opportunities
- **Suburbs**: Farm work, retail, and quieter lifestyles
- **Industrial District**: Factory work, warehouses, and manufacturing
- **Downtown**: Corporate jobs, law firms, and high-stakes business

Jobs are categorized as:
- **Legal**: Safe but lower-paying opportunities
- **Illegal**: High-risk, high-reward activities
- **Government**: Stable careers with good benefits

**Work Shift Button**: 
- Accessible from the Player Sidebar Current Life section
- Validates your location before allowing you to work
- Disabled when you're in the wrong location or lack energy
- Provides quick access to work your current job

#### Businesses
Start and manage businesses for passive income:
- **Legal Businesses**: Restaurants, retail stores, law firms
- **Illegal Businesses**: Black market operations, smuggling networks
- Each business requires specific skills and capital to start
- Businesses generate daily profits (with variance) after expenses
- **Multi-City Ownership**: Own the same business type in multiple cities and areas
- Businesses are grouped by city in the Assets view with collapsible sections
- View total upkeep and net profit per day for each city

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
│   │   ├── Sidebar.jsx
│   │   ├── SmartTooltip.jsx
│   │   └── TopBar.jsx
│   ├── views/           # Game view components
│   │   ├── AssetsView.jsx
│   │   ├── BusinessesView.jsx
│   │   ├── HousingView.jsx
│   │   ├── InventoryView.jsx
│   │   ├── JobsView.jsx
│   │   ├── OverviewView.jsx
│   │   ├── SkillsView.jsx
│   │   └── TravelView.jsx
│   ├── App.jsx          # Main application component
│   ├── gameCore.js      # Core game logic and state management
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.mts     # Vite configuration
└── styles.css          # Additional styles
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
- More cities and locations
- Additional job types and career paths
- Housing system with property ownership
- Inventory and item management
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
