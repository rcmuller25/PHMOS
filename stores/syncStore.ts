import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { usePatientsStore } from './patientsStore';
import { useAppointmentsStore } from './appointmentsStore';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
  syncData: () => Promise<void>;
  setSyncError: (error: string | null) => void;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  isSyncing: false,
  lastSyncTime: null,
  syncError: null,

  syncData: async () => {
    const { user } = useAuthStore.getState();
    const { patients } = usePatientsStore.getState();
    const { appointments } = useAppointmentsStore.getState();

    if (!user) return;

    set({ isSyncing: true, syncError: null });

    try {
      // Sync patients
      for (const patient of patients) {
        if (!patient.synced) {
          const { error } = await supabase
            .from('patients')
            .upsert({
              id: patient.id,
              first_name: patient.firstName,
              surname: patient.surname,
              gender: patient.gender,
              date_of_birth: patient.dateOfBirth,
              id_type: patient.idType,
              id_number: patient.idNumber,
              address: patient.address,
              primary_contact: patient.primaryContact,
              secondary_contact: patient.secondaryContact,
              created_by: user.id,
              synced: true,
            });

          if (error) throw error;
        }
      }

      // Sync appointments
      for (const appointment of appointments) {
        if (!appointment.synced) {
          const { error } = await supabase
            .from('appointments')
            .upsert({
              id: appointment.id,
              patient_id: appointment.patientId,
              date: appointment.date,
              time_slot: appointment.timeSlot,
              category: appointment.category,
              notes: appointment.notes,
              created_by: user.id,
              synced: true,
            });

          if (error) throw error;
        }
      }

      set({ 
        lastSyncTime: new Date(),
        syncError: null,
      });
    } catch (error: any) {
      set({ syncError: error.message });
    } finally {
      set({ isSyncing: false });
    }
  },

  setSyncError: (error) => set({ syncError: error }),
}));