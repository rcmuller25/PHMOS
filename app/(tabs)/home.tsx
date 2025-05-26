import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CirclePlus as PlusCircle, Calendar, Users, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { usePatientsStore } from '../../stores/patientsStore';
import { useAppointmentsStore } from '../../stores/appointmentsStore';
import { DashboardCard } from '../../components/DashboardCard';
import { DashboardButton } from '../../components/DashboardButton';

export default function Dashboard() {
  const router = useRouter();
  const patients = usePatientsStore((state) => state.patients);
  const appointments = useAppointmentsStore((state) => state.appointments);
  
  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === today
  );
  
  // Get upcoming appointments (excluding today)
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.date > today
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statsContainer}>
        <DashboardCard 
          title="Total Patients"
          value={patients.length.toString()}
          icon={<Users color="#0077B6" size={24} />}
          backgroundColor="#E6F3F8"
          textColor="#0077B6"
        />
        <DashboardCard 
          title="Today's Appointments"
          value={todayAppointments.length.toString()}
          icon={<Clock color="#06D6A0" size={24} />}
          backgroundColor="#E3F9F3"
          textColor="#06D6A0"
        />
        <DashboardCard 
          title="Upcoming"
          value={upcomingAppointments.length.toString()}
          icon={<Calendar color="#FFAA00" size={24} />}
          backgroundColor="#FFF6E6"
          textColor="#FFAA00"
        />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsContainer}>
        <DashboardButton 
          title="New Patient"
          icon={<Users color="#FFFFFF" size={24} />}
          backgroundColor="#0077B6"
          onPress={() => router.push('/patients/add')}
        />
        <DashboardButton 
          title="New Appointment"
          icon={<Calendar color="#FFFFFF" size={24} />}
          backgroundColor="#06D6A0"
          onPress={() => router.push('/add-appointment')}
        />
        <DashboardButton 
          title="View Calendar"
          icon={<Calendar color="#FFFFFF" size={24} />}
          backgroundColor="#FFAA00"
          onPress={() => router.push('/appointments')}
        />
      </View>

      <Text style={styles.sectionTitle}>Today's Schedule</Text>
      {todayAppointments.length > 0 ? (
        <View style={styles.todayContainer}>
          {todayAppointments.slice(0, 3).map((appointment, index) => (
            <TouchableOpacity 
              key={appointment.id} 
              style={[styles.appointmentItem, { borderLeftColor: getCategoryColor(appointment.category) }]}
              onPress={() => router.push(`/appointments/${appointment.id}`)}
            >
              <View style={styles.appointmentTime}>
                <Text style={styles.timeText}>{appointment.timeSlot}</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.patientName}>{appointment.patientName}</Text>
                <Text style={styles.categoryText}>{appointment.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {todayAppointments.length > 3 && (
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/appointments')}
            >
              <Text style={styles.viewAllText}>View all {todayAppointments.length} appointments</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No appointments scheduled for today</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add-appointment')}
          >
            <PlusCircle color="#FFFFFF" size={16} />
            <Text style={styles.addButtonText}>Add Appointment</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2D3748',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  todayContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  appointmentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderLeftWidth: 4,
    paddingLeft: 12,
  },
  appointmentTime: {
    width: 60,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  appointmentDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#718096',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0077B6',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
});