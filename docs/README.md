# PHMOIS - Primary Healthcare Mobile Outreach Information System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, offline-first appointment management solution designed specifically for the South African public health
sector—tailored for rural, mobile, satellite, and outreach clinical settings.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

### Core Functionality

- **Bottom-Tab Navigation**

  - Intuitive interface with Dashboard, Appointment Calendar, Add Appointment, Patient Management, Search, and Settings

- **Dashboard**

  - Real-time overview of total patients and key statistics
  - Quick access to common actions

- **Appointment Management**

  - Daily calendar view segmented by service categories
  - Time slots structured hourly (4 patients per slot max)
  - Simple form for adding new appointments

- **Patient Management**
  - Comprehensive patient records including:
    - Personal details (name, surname, gender, DOB)
    - Identification (ID/passport number)
    - Contact information (primary and secondary)
    - Address details

### Technical Features

- **Offline-First Design**

  - Local data persistence using SQLite/AsyncStorage
  - Automatic sync when connectivity is restored

- **Modular Architecture**
  - Easily extendable components
  - Isolated feature modules

## Technologies

- **Frontend**: React Native
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **Local Storage**: SQLite/AsyncStorage
- **Permissions**: react-native-permissions
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js v18+ (LTS recommended)
- npm v9+ or yarn v1.22+
- React Native CLI

#### Platform Specific

- **Android**:

  - Android Studio
  - Android SDK
  - Java Development Kit (JDK) 11+

- **iOS**:
  - Xcode 14+
  - CocoaPods

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/phmois.git
   cd phmois
   npm install
   yarn install
   ```
2. Run on Android:
   ```bash
   npx react-native run-android
   ```
3. Run on iOS:
   ```bash
   npx react-native run-ios
   ```
4. Usage:
   ```bash
   PHMOIS offers a straightforward interface to manage healthcare schedules and patient data effectively. Navigate via the bottom-tab menu to utilize the dashboard, view appointments in a calendar layout, add new appointments and patients, and configure app settings. Its offline-first design ensures uninterrupted service even in areas with limited connectivity.
   ```
5. Contributing:
   ```bash
   We welcome contributions from the community!
   ```
6. Fork the Repository:
   ```bash
   **Create a Feature Branch**
   git checkout -b feature/YourFeatureName
   Commit Your Changes
   git commit -m 'Add some feature'
   Push to the Branch
   git push origin feature/YourFeatureName
   -Open a Pull Request
   -For major changes, please open an issue first to discuss what you would like to modify.
   ```
7. License:
   ```bash
   -This project is licensed under the MIT License.
   ```
8. Contact:
   ```bash
   -For further details, suggestions, or questions, please reach out at rcmuller25@gmail.com.
   ```
