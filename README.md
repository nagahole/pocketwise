<div align="center">

<img src="docs/images/icon.png" alt="PocketWise logo" width="120" />

# PocketWise (formerly Easy Budgets)

**A clean, simple budgeting app for iOS and Android, built with React Native and Firebase.**

Track spending, set budgets per category, and see where your money goes, without the clutter.

![React Native](https://img.shields.io/badge/React_Native-0.71-61DAFB?logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%7C_Firestore-FFCA28?logo=firebase&logoColor=black)
![Platforms](https://img.shields.io/badge/platforms-iOS_%7C_Android-lightgrey)
![License](https://img.shields.io/badge/license-GPLv3-blue)

</div>

---

## Background

PocketWise started as a for-fun holiday project in the break between finishing high school at the end of 2022 and starting university in 2023. Every line was written by hand, without AI coding tools.

The app was published on the **App Store from 9 February 2023 to 24 February 2024**. I retired it at the renewal date rather than pay the US$99/year Apple Developer membership as an undergrad.

## Screenshots

<p align="center">
  <img src="https://github.com/nagahole/pocketwise/assets/61644420/3854517c-dca2-4495-a1f5-d6aafddfb08d" alt="Screenshot 1" width="200" />
  <img src="https://github.com/nagahole/pocketwise/assets/61644420/02348c45-8a08-4503-a3dc-764fb9beb560" alt="Screenshot 2" width="200" />
  <img src="https://github.com/nagahole/pocketwise/assets/61644420/c6d9536b-9a1a-4e16-aa1c-1afc1c8531fa" alt="Screenshot 3" width="200" />
  <img src="https://github.com/nagahole/pocketwise/assets/61644420/9ec0ead6-3fe3-4a4b-a259-4b7ed9128ac8" alt="Screenshot 4" width="200" />
</p>
<p align="center">
  <img src="https://github.com/nagahole/pocketwise/assets/61644420/991ff7be-717f-495c-9a1d-1882ec0f728d" alt="Screenshot 5" width="200" />
  <img src="https://github.com/nagahole/pocketwise/assets/61644420/314a7aea-ed03-4333-944d-8a4bb0161d43" alt="Screenshot 6" width="200" />
  <img src="https://github.com/nagahole/pocketwise/assets/61644420/0803b882-5c65-4cc2-ae61-a1872e22f3f5" alt="Screenshot 7" width="200" />
</p>

## Features

- **Transactions:** add, edit and swipe to manage income and expenses, with date picking and paginated history.
- **Category budgets:** set a monthly spending limit per category and watch your progress against it.
- **Custom categories:** create your own categories with a choice of icons and colours.
- **Analytics:** weekly and monthly spending charts, plus a per-category breakdown on a pie chart.
- **Cloud sync:** data lives in Cloud Firestore, so it follows you across devices.
- **Authentication:** email and password, Google Sign-In and Sign in with Apple, plus account, email and password management.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | [React Native](https://reactnative.dev/) 0.71, React 18 |
| UI | [NativeBase](https://nativebase.io/), Font Awesome, React Native Vector Icons |
| Navigation | [React Navigation](https://reactnavigation.org/) 6 (stack, bottom tabs, drawer, top tabs) |
| Charts | [Victory Native](https://formidable.com/open-source/victory/docs/native/), D3 scales |
| Backend | [React Native Firebase](https://rnfirebase.io/): Auth and Cloud Firestore |
| Lists | [FlashList](https://shopify.github.io/flash-list/) |

## Project Structure

```
.
├── App.tsx                 # Root: providers and navigation container
├── src/
│   ├── BudgetApp.js        # Top-level navigator (auth flow and main app)
│   ├── components/         # Reusable UI components
│   ├── data/               # Colours, constants, default categories, icons
│   ├── hooks/              # Custom React hooks
│   ├── screens/            # App screens (home, stats, budgets, settings, auth)
│   └── stacks/             # Navigators (tabs, drawer, stacks)
├── utils/                  # Transaction grouping, colour helpers, auth helpers
├── ios/                    # Native iOS project
└── android/                # Native Android project
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Ruby 2.7.6 and CocoaPods (for iOS)
- Xcode (iOS) and/or Android Studio (Android)
- A [Firebase](https://console.firebase.google.com/) project with **Authentication** and **Cloud Firestore** enabled

See the official [React Native environment setup guide](https://reactnative.dev/docs/environment-setup) for platform tooling.

### Installation

```bash
git clone https://github.com/nagahole/pocketwise.git
cd pocketwise
npm install
```

For iOS, install the native pods:

```bash
cd ios && bundle install && bundle exec pod install && cd ..
```

### Firebase Configuration

1. Register iOS and Android apps in your Firebase project.
2. Replace `ios/GoogleService-Info.plist` with your own, and add `google-services.json` to `android/app/`.
3. Enable the sign-in providers you want (Email/Password, Google, Apple) in Firebase Authentication.
4. For Google Sign-In, set your `webClientId` in `src/screens/LoginScreen.js`.

### Running the App

```bash
npm start          # Start the Metro bundler
npm run ios        # Build and run on the iOS simulator
npm run android    # Build and run on an Android emulator or device
```

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Metro dev server |
| `npm run ios` | Run on iOS |
| `npm run android` | Run on Android |
| `npm test` | Run the Jest test suite |
| `npm run lint` | Lint the project with ESLint |

## License

Distributed under the **GNU General Public License v3.0**. See [`LICENSE`](LICENSE) for details.
