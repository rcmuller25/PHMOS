import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAppointmentsStore } from '../../stores/appointmentsStore';
import { formatDate, getDayOfWeek } from '../../utils/dateUtils';
import { AppointmentSlot } from '../../components/AppointmentSlot';

// Define service categories
const SERVICE_CATEGORIES = [
  'General Checkup',
  'Vaccination',
  'Prenatal',
  'HIV Treatment',
  'TB Screening',
  'Child Health',
];

// Define time slots (hourly from 8 AM to 4 PM)
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', 
  '12:00', '13:00', '14:00', '15:00'
];

export default function AppointmentsCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const appointments = useAppointmentsStore((state) => state.appointments);
  
  // Format date as YYYY-MM-DD for filtering
  const formattedDate = selectedDate.toISOString().split('T')[0];
  
  // Filter appointments for the selected date
  const dateAppointments = appointments.filter(
    (appointment) => appointment.date === formattedDate
  );

  // Function to navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  // Function to navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  // Function to get appointments for a specific time slot and category
  const getSlotAppointments = (timeSlot: string, category: string) => {
    return dateAppointments.filter(
      (appointment) => appointment.timeSlot === timeSlot && appointment.category === category
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateNavigator}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.navButton}>
          <ChevronLeft color="#0077B6" size={24} />
        </TouchableOpacity>
        <View style={styles.dateContainer}>
          <Text style={styles.dateDay}>{getDayOfWeek(selectedDate)}</Text>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>
        <TouchableOpacity onPress={goToNextDay} style={styles.navButton}>
          <ChevronRight color="#0077B6" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.calendarContainer}>
        <View style={styles.timelineHeader}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeHeaderText}>Time</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SERVICE_CATEGORIES.map((category) => (
              <View key={category} style={styles.categoryColumn}>
                <Text style={styles.categoryHeaderText}>{category}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.timeline}>
          {TIME_SLOTS.map((timeSlot) => (
            <View key={timeSlot} style={styles.timeRow}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{timeSlot}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {SERVICE_CATEGORIES.map((category) => {
                  const slotAppointments = getSlotAppointments(timeSlot, category);
                  return (
                    <View key={`${timeSlot}-${category}`} style={styles.categoryColumn}>
                      <AppointmentSlot
                        appointments={slotAppointments}
                        maxPatients={4}
                        category={category}
                        timeSlot={timeSlot}
                        date={formattedDate}
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  navButton: {
    padding: 8,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateDay: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  calendarContainer: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  timeColumn: {
    width: 60,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  categoryColumn: {
    width: 120,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  timeHeaderText: {
    fontWeight: '600',
    color: '#4A5568',
  },
  categoryHeaderText: {
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
  },
  timeline: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timeText: {
    fontSize: 14,
    color: '#4A5568',
  },
});