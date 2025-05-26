import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { formatDate } from '../utils/dateUtils';

interface Appointment {
  id: string;
  patientName: string;
  category: string;
  timeSlot: string;
  date: string;
  notes?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
}

export function AppointmentCard({ appointment, onPress }: AppointmentCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.card,
        { borderLeftColor: getCategoryColor(appointment.category) }
      ]} 
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.category}>{appointment.category}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(appointment.date, appointment.timeSlot) }
        ]}>
          <Text style={styles.statusText}>{getStatusText(appointment.date, appointment.timeSlot)}</Text>
        </View>
      </View>
      
      <Text style={styles.patientName}>{appointment.patientName}</Text>
      
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Calendar size={14} color="#718096" />
          <Text style={styles.metaText}>{formatDate(new Date(appointment.date))}</Text>
        </View>
        <View style={styles.metaItem}>
          <Clock size={14} color="#718096" />
          <Text style={styles.metaText}>{appointment.timeSlot}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Helper function to get color based on appointment category
function getCategoryColor(category: string): string {
  const categories = {
    'General Checkup': '#0077B6',
    'Vaccination': '#06D6A0',
    'Prenatal': '#FFAA00',
    'HIV Treatment': '#EF476F',
    'TB Screening': '#8338EC',
    'Child Health': '#FB5607',
  };
  
  return categories[category as keyof typeof categories] || '#0077B6';
}

// Helper function to get status based on date and time
function getStatusText(date: string, timeSlot: string): string {
  const now = new Date();
  const appointmentDate = new Date(date);
  const [hour] = timeSlot.split(':').map(Number);
  
  // Set appointment end time (1 hour after start)
  const appointmentEnd = new Date(date);
  appointmentEnd.setHours(hour + 1, 0, 0, 0);
  
  // Set appointment start time
  appointmentDate.setHours(hour, 0, 0, 0);
  
  if (now > appointmentEnd) {
    return 'Completed';
  } else if (now >= appointmentDate && now <= appointmentEnd) {
    return 'In Progress';
  } else if (date === now.toISOString().split('T')[0]) {
    return 'Today';
  } else if (appointmentDate > now) {
    return 'Upcoming';
  } else {
    return 'Missed';
  }
}

// Helper function to get status color
function getStatusColor(date: string, timeSlot: string): string {
  const status = getStatusText(date, timeSlot);
  
  const colors = {
    'Completed': '#06D6A0',
    'In Progress': '#FFAA00',
    'Today': '#0077B6',
    'Upcoming': '#8338EC',
    'Missed': '#EF476F',
  };
  
  return colors[status as keyof typeof colors] || '#718096';
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#718096',
    marginLeft: 4,
  },
});