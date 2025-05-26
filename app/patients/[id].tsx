import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { usePatientsStore } from '../../stores/patientsStore';
import { useAppointmentsStore } from '../../stores/appointmentsStore';
import { ChevronLeft, Calendar, CreditCard as Edit, Trash } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { formatDate, calculateAge } from '../../utils/dateUtils';

export default function PatientDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const patient = usePatientsStore((state) => state.patients.find(p => p.id === id));
  const { removePatient } = usePatientsStore();
  
  const appointments = useAppointmentsStore(
    (state) => state.appointments.filter(a => a.patientId === id)
  );
  
  // Handle patient deletion
  const handleDelete = () => {
    Alert.alert(
      'Delete Patient',
      'Are you sure you want to delete this patient? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removePatient(id as string);
            router.replace('/patients');
          },
        },
      ]
    );
  };
  
  // If patient not found
  if (!patient) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Patient not found</Text>
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
          headerTitle: `${patient.firstName} ${patient.surname}`,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.patientInitials}>
            <Text style={styles.initialsText}>
              {patient.firstName.charAt(0)}{patient.surname.charAt(0)}
            </Text>
          </View>
          <View style={styles.patientHeaderInfo}>
            <Text style={styles.patientName}>{patient.firstName} {patient.surname}</Text>
            <Text style={styles.patientMeta}>
              {patient.gender} • {calculateAge(patient.dateOfBirth)} years old
            </Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push(`/patients/edit/${id}`)}
            >
              <Edit color="#0077B6" size={20} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Trash color="#EF476F" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{patient.firstName} {patient.surname}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{patient.gender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{formatDate(new Date(patient.dateOfBirth))}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{patient.idType}</Text>
              <Text style={styles.infoValue}>{patient.idNumber}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{patient.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Primary Contact</Text>
              <Text style={styles.infoValue}>{patient.primaryContact}</Text>
            </View>
            {patient.secondaryContact && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Secondary Contact</Text>
                <Text style={styles.infoValue}>{patient.secondaryContact}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Appointments</Text>
          {appointments.length > 0 ? (
            <View style={styles.infoCard}>
              {appointments.map((appointment) => (
                <TouchableOpacity
                  key={appointment.id}
                  style={styles.appointmentItem}
                  onPress={() => router.push(`/appointments/${appointment.id}`)}
                >
                  <View style={styles.appointmentIcon}>
                    <Calendar color="#0077B6" size={20} />
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentDate}>
                      {formatDate(new Date(appointment.date))} - {appointment.timeSlot}
                    </Text>
                    <Text style={styles.appointmentCategory}>{appointment.category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyAppointments}>
              <Text style={styles.emptyText}>No appointments scheduled</Text>
              <Button 
                title="Schedule Appointment" 
                onPress={() => router.push(`/add-appointment?patientId=${id}`)}
                backgroundColor="#0077B6"
                style={styles.scheduleButton}
              />
            </View>
          )}
        </View>
        
        <Button 
          title="Schedule New Appointment" 
          onPress={() => router.push(`/add-appointment?patientId=${id}`)}
          backgroundColor="#0077B6"
          style={styles.actionButton}
        />
      </ScrollView>
    </>
  );
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
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  patientInitials: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  patientHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  patientMeta: {
    fontSize: 14,
    color: '#718096',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: '#718096',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  appointmentIcon: {
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 4,
  },
  appointmentCategory: {
    fontSize: 12,
    color: '#718096',
  },
  emptyAppointments: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  scheduleButton: {
    alignSelf: 'center',
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