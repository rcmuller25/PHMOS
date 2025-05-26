import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CirclePlus as PlusCircle, Calendar, Users, Clock, Search, List } from 'lucide-react-native';
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
    {/* Header */}
    <Text style={styles.headerTitle}>Dashboard</Text>
    
    {/* Primary Healthcare Card */}
    <View style={styles.outreachCard}>
      <Text style={styles.outreachTitle}>Primary Healthcare Mobile Outreach Information System</Text>
    </View>

    {/* Stats Container - Updated to match screenshot */}
    <View style={styles.statsContainer}>
      <DashboardCard 
        title="Today"
        value={todayAppointments.length.toString()}
        icon={<Calendar color="#FFFFFF" size={20} />}
        backgroundColor="#4CAF50"
        textColor="#FFFFFF"
      />
      <DashboardCard 
        title="Total Appts"
        value={appointments.length.toString()}
        icon={<Calendar color="#FFFFFF" size={20} />}
        backgroundColor="#2196F3"
        textColor="#FFFFFF"
      />
      <DashboardCard 
        title="Patients"
        value={patients.length.toString()}
        icon={<Users color="#FFFFFF" size={20} />}
        backgroundColor="#FF9800"
        textColor="#FFFFFF"
      />
    </View>

    <Text style={styles.sectionTitle}>Quick Actions</Text>
    
    {/* Updated Quick Actions Grid - 2 buttons only */}
    <View style={styles.quickActionsGrid}>
      <View style={styles.quickActionCard}>
        <TouchableOpacity 
          style={[styles.quickActionButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => router.push('/add-appointment')}
        >
          <View style={styles.iconContainer}>
            <PlusCircle color="#FFFFFF" size={24} />
          </View>
          <Text style={styles.quickActionText}>New Appointment</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.quickActionCard}>
        <TouchableOpacity 
          style={[styles.quickActionButton, { backgroundColor: '#2196F3' }]}
          onPress={() => router.push('/patients')}
        >
          <View style={styles.iconContainer}>
            <Search color="#FFFFFF" size={24} />
          </View>
          <Text style={styles.quickActionText}>Search Patients</Text>
        </TouchableOpacity>
      </View>
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
headerTitle: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#2D3748',
  marginBottom: 20,
  marginTop: 20,
},
outreachCard: {
  backgroundColor: '#1976D2',
  borderRadius: 12,
  padding: 20,
  marginBottom: 20,
  position: 'relative',
},
outreachTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#FFFFFF',
  marginBottom: 4,
},
outreachSubtitle: {
  fontSize: 16,
  color: '#E3F2FD',
  marginBottom: 15,
},
offlineMode: {
  alignSelf: 'flex-start',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},
offlineModeText: {
  color: '#FFFFFF',
  fontSize: 14,
},
statsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 24,
  gap: 10,
},
sectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 12,
  color: '#2D3748',
},
quickActionsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: 24,
  gap: 12,
},
quickActionCard: {
  width: '48%',
},
quickActionButton: {
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 120,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
iconContainer: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
},
quickActionText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'center',
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