import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAppointmentsStore } from '../../stores/appointmentsStore';
import { usePatientsStore } from '../../stores/patientsStore';
import { ChevronLeft, Calendar, Clock, User, CreditCard as Edit, Trash } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { formatDate } from '../../utils/dateUtils';

export default function AppointmentDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const appointment = useAppointmentsStore(
    (state) => state.appointments.find(a => a.id === id)
  );
  const { removeAppointment } = useAppointmentsStore();
  
  const patient = usePatientsStore(
    (state) => state.patients.find(p => p.id === appointment?.patientId)
  );
  
  // Handle appointment deletion
  const handleDelete = () => {
    Alert.alert(
      'Delete Appointment',
      'Are you sure you want to delete this appointment? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeAppointment(id as string);
            router.replace('/appointments');
          },
        },
      ]
    );
  };
  
  // If appointment not found
  if (!appointment) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Appointment not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()}
          backgroundColor="#0077B6"
        />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: 'Appointment Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View 
          style={[
            styles.header, 
            { backgroundColor: getCategoryColor(appointment.category) }
          ]}
        >
          <Text style={styles.headerCategory}>{appointment.category}</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeItem}>
              <Calendar color="#FFFFFF" size={20} />
              <Text style={styles.timeText}>{formatDate(new Date(appointment.date))}</Text>
            </View>
            <View style={styles.timeItem}>
              <Clock color="#FFFFFF" size={20} />
              <Text style={styles.timeText}>{appointment.timeSlot}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`/appointments/edit/${id}`)}
          >
            <Edit color="#0077B6" size={20} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Trash color="#EF476F" size={20} />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <TouchableOpacity 
            style={styles.patientCard}
            onPress={() => router.push(`/patients/${appointment.patientId}`)}
          >
            <View style={styles.patientInitials}>
              <Text style={styles.initialsText}>
                {patient ? patient.firstName.charAt(0) + patient.surname.charAt(0) : 'NA'}
              </Text>
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{appointment.patientName}</Text>
              {patient && (
                <Text style={styles.patientMeta}>
                  {patient.gender} • {patient.idType}: {patient.idNumber}
                </Text>
              )}
            </View>
            <User color="#0077B6" size={20} />
          </TouchableOpacity>
        </View>
        
        {appointment.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </View>
          </View>
        )}
        
        <Button 
          title="Reschedule Appointment" 
          onPress={() => router.push(`/add-appointment?patientId=${appointment.patientId}`)}
          backgroundColor="#0077B6"
          style={styles.rescheduleButton}
        />
      </ScrollView>
    </>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  content: {
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  headerCategory: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F3F8',
    padding: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    marginRight: 0,
    marginLeft: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#0077B6',
  },
  deleteText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#EF476F',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  patientInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  patientMeta: {
    fontSize: 14,
    color: '#718096',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  notesText: {
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 20,
  },
  rescheduleButton: {
    marginBottom: 24,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 24,
  },
});