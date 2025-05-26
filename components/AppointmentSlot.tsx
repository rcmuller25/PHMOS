import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CirclePlus as PlusCircle, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Appointment {
  id: string;
  patientName: string;
  category: string;
  timeSlot: string;
  date: string;
}

interface AppointmentSlotProps {
  appointments: Appointment[];
  maxPatients: number;
  category: string;
  timeSlot: string;
  date: string;
}

export function AppointmentSlot({ 
  appointments, 
  maxPatients, 
  category, 
  timeSlot, 
  date 
}: AppointmentSlotProps) {
  const router = useRouter();
  const availableSlots = maxPatients - appointments.length;
  
  // Function to render patient slots
  const renderPatientSlots = () => {
    const slots = [];
    
    // Add filled slots
    for (const appointment of appointments) {
      slots.push(
        <TouchableOpacity
          key={appointment.id}
          style={styles.patientSlot}
          onPress={() => router.push(`/appointments/${appointment.id}`)}
        >
          <User size={14} color="#0077B6" />
          <Text style={styles.patientName} numberOfLines={1} ellipsizeMode="tail">
            {appointment.patientName}
          </Text>
        </TouchableOpacity>
      );
    }
    
    // Add empty slots
    for (let i = 0; i < availableSlots; i++) {
      slots.push(
        <TouchableOpacity
          key={`empty-${i}`}
          style={styles.emptySlot}
          onPress={() => router.push(`/add-appointment?date=${date}&timeSlot=${timeSlot}&category=${category}`)}
        >
          <PlusCircle size={14} color="#A0AEC0" />
          <Text style={styles.emptyText}>Available</Text>
        </TouchableOpacity>
      );
    }
    
    return slots;
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: appointments.length === 0 ? '#F7F9FC' : '#FFFFFF' }
      ]}
    >
      {renderPatientSlots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
    borderRadius: 4,
  },
  patientSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#E6F3F8',
    borderRadius: 4,
    marginBottom: 4,
  },
  patientName: {
    fontSize: 12,
    color: '#2D3748',
    marginLeft: 4,
    flex: 1,
  },
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginLeft: 4,
  },
});