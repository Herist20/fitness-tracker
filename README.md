# Fitness Tracker App

A React Native fitness tracking application built with Expo and TypeScript.

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **State Management**: Zustand
- **Database**: Expo SQLite
- **Styling**: NativeWind (Tailwind CSS)
- **Animations**: React Native Reanimated
- **Charts**: Victory Native
- **UI Components**: React Native Elements
- **Icons**: @expo/vector-icons

## Project Structure

```
fitness-tracker/
├── src/
│   ├── components/      # Reusable components
│   ├── database/        # SQLite database setup
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # Screen components
│   │   ├── DashboardScreen.tsx
│   │   ├── HabitsScreen.tsx
│   │   ├── WorkoutsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── App.tsx              # Main app component
├── app.d.ts            # NativeWind types
├── babel.config.js     # Babel configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Features

### Current Features
- ✅ Bottom tab navigation with 4 main screens
- ✅ TypeScript support with strict mode
- ✅ NativeWind for Tailwind CSS styling
- ✅ Zustand store setup for state management
- ✅ SQLite database initialization
- ✅ Responsive layouts with SafeAreaView

### Planned Features
- [ ] User authentication and profiles
- [ ] Habit tracking with streaks
- [ ] Workout logging and exercise database
- [ ] Progress charts and statistics
- [ ] Goal setting and achievements
- [ ] Data export functionality

## Development Notes

- The app uses NativeWind for styling, allowing you to use Tailwind CSS classes
- Navigation is handled by React Navigation with bottom tabs
- State management is handled by Zustand for a simple, lightweight solution
- SQLite database is set up for persistent local storage
- Victory Native is included for creating charts and visualizations

## Troubleshooting

If you encounter any issues:

1. Clear Metro cache:
```bash
npx expo start -c
```

2. Reinstall dependencies:
```bash
rm -rf node_modules
npm install
```

3. For iOS issues:
```bash
cd ios
pod install
cd ..
```