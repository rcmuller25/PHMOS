# Changelog
## [Unreleased]
- Supabase Integration
  - Planned migration to Supabase for authentication, session management, and secure API communication.
  - Preparation for user registration, password reset, and email verification flows.
- Security Enhancements
  - Password strength enforcement (minimum length, character requirements, real-time feedback).
  - Rate limiting for login attempts to prevent brute-force attacks.
  - Session timeout and auto-logout after inactivity.
  - Secure API communication with token-based authentication and refresh logic.
## [v1.0.0] - Initial Release
### Project Structure & Tooling
- Established modular folder structure: app/ , components/ , stores/ , hooks/ , utils/ , assets/ , and docs/ .
- Configured TypeScript, Prettier, and project settings for code quality and consistency.
- Added documentation: README.md , FOLDER_STRUCTURE.md , and ROADMAP.md .
### Navigation & Layout
- Implemented navigation using expo-router with stack and tab navigators.
- Defined root layout in app/_layout.tsx and tab layout in app/(tabs)/_layout.tsx .
- Added not-found page and route guards for protected screens.
### Authentication
- Created modular login screen ( app/login.tsx ) with email/password fields, validation, error handling, and "remember me" support.
- Developed Zustand-based authStore for authentication state, user data, and secure token storage using expo-secure-store .
- Integrated login/logout flows with navigation and protected route logic.
### UI Components
- Built reusable components: Button , FormField , AppointmentCard , PatientCard , DashboardCard , DashboardButton , SettingsItem , SettingsSection , and AppointmentSlot .
- Applied consistent styling and responsive layouts across screens.
### Appointments & Patients
- Implemented appointment management: list, add, edit, and detail views ( app/(tabs)/appointments.tsx , app/(tabs)/add-appointment.tsx , app/appointments/[id].tsx ).
- Developed patient management: list, add, edit, and detail views ( app/(tabs)/patients.tsx , app/patients/add.tsx , app/patients/[id].tsx ).
- Added search functionality for patients and appointments.
### Settings & Miscellaneous
- Added settings screen with sections for preferences and about page ( app/(tabs)/settings.tsx , app/settings/about.tsx ).
- Persisted user preferences using Zustand and local storage.
### Security & Performance
- Used expo-secure-store for sensitive data.
- Improved list rendering and state management for performance.
- Added input validation and error handling throughout forms.
### Code Quality & Maintainability
- Refactored for separation of concerns and DRY principles.
- Enforced TypeScript strictness and improved type coverage.
- Reduced duplicate code and improved error handling consistency.
- Added inline documentation and code comments for maintainability.