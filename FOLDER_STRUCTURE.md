# PHMOS Application Structure

## Root Directory
├── .gitignore
├── .npmrc
├── .prettierrc
├── .vscode/
│   └── .react/
├── README.md
├── app.json
├── app/
├── assets/
├── components/
├── eas.json
├── hooks/
├── package-lock.json
├── package.json
├── stores/
├── tsconfig.json
└── utils/
app/
├── (tabs)/               # Tab navigation screens
│   ├── _layout.tsx       # Tab navigation layout
│   ├── add-appointment.tsx
│   ├── appointments.tsx
│   ├── home.tsx
│   ├── patients.tsx
│   ├── search.tsx
│   └── settings.tsx
├── +not-found.tsx        # 404 page
├── _layout.tsx           # Root layout
├── appointments/         # Appointment related screens
│   └── [id].tsx          # Dynamic appointment detail
├── index.tsx             # Entry point
├── patients/             # Patient related screens
│   ├── [id].tsx          # Dynamic patient detail
│   └── add.tsx           # Add new patient
└── settings/             # Settings screens
    └── about.tsx         # About screen
assets/
└── images/
    ├── favicon.png
    └── icon.png
components/
├── AppointmentCard.tsx
├── AppointmentPicker.tsx
├── AppointmentSlot.tsx
├── Button.tsx
├── DashboardButton.tsx
├── DashboardCard.tsx
├── FormField.tsx
├── PatientCard.tsx
├── SettingsItem.tsx
└── SettingsSection.tsx
stores/
├── appointmentsStore.ts
├── patientsStore.ts
└── settingsStore.ts
hooks/            # Custom React hooks
utils/            # Utility functions