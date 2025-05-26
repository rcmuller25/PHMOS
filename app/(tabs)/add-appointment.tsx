import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppointmentsStore } from '../../stores/appointmentsStore';
import { usePatientsStore } from '../../stores/patientsStore';
import { FormField } from '../../components/FormField';
import { AppointmentPicker } from '../../components/AppointmentPicker';
import { Button } from '../../components/Button';

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

export default function AddAppointment() {
  const router = useRouter();
  const patients = usePatientsStore((state) => state.patients);
  const { appointments, addAppointment } = useAppointmentsStore();
  
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeSlot, setTimeSlot] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [category, setCategory] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Get patient name based on ID
  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.firstName} ${patient.surname}` : 'Select patient';
  };
  
  // Check if the selected time slot is available
  const checkSlotAvailability = () => {
    if (!date || !timeSlot || !category) return true;
    
    const slotAppointments = appointments.filter(
      appointment => appointment.date === date && 
                     appointment.timeSlot === timeSlot && 
                     appointment.category === category
    );
    
    // Each slot can accommodate up to 4 patients
    return slotAppointments.length < 4;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!date || !timeSlot || !category || !patientId) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    // Check slot availability
    if (!checkSlotAvailability()) {
      Alert.alert(
        'Slot Unavailable', 
        'This time slot is already full. Please select another time or category.'
      );
      return;
    }
    
    // Create new appointment
    const newAppointment = {
      id: Date.now().toString(),
      date,
      timeSlot,
      category,
      patientId,
      patientName: getPatientName(patientId),
      notes,
      createdAt: new Date().toISOString(),
    };
    
    // Add appointment to store
    addAppointment(newAppointment);
    
    // Show success message and navigate back
    Alert.alert(
      'Appointment Created', 
      'The appointment has been successfully created.',
      [{ text: 'OK', onPress: () => router.push('/appointments') }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Appointment Details</Text>
        
        {/* Date Selection */}
        <FormField label="Date" required>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.pickerText, !date && styles.placeholderText]}>
              {date ? date : 'Select date'}
            </Text>
            <ChevronDown color="#718096" size={20} />
          </TouchableOpacity>
        </FormField>
        
        {/* Time Slot Selection */}
        <FormField label="Time Slot" required>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={[styles.pickerText, !timeSlot && styles.placeholderText]}>
              {timeSlot ? timeSlot : 'Select time'}
            </Text>
            <ChevronDown color="#718096" size={20} />
          </TouchableOpacity>
        </FormField>
        
        {/* Service Category Selection */}
        <FormField label="Service Category" required>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={[styles.pickerText, !category && styles.placeholderText]}>
              {category ? category : 'Select category'}
            </Text>
            <ChevronDown color="#718096" size={20} />
          </TouchableOpacity>
        </FormField>
        
        {/* Patient Selection */}
        <FormField label="Patient" required>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => {
              if (patients.length === 0) {
                Alert.alert(
                  'No Patients', 
                  'Please add a patient first.',
                  [{ text: 'Add Patient', onPress: () => router.push('/patients/add') }]
                );
              } else {
                setShowPatientPicker(true);
              }
            }}
          >
            <Text style={[styles.pickerText, !patientId && styles.placeholderText]}>
              {patientId ? getPatientName(patientId) : 'Select patient'}
            </Text>
            <ChevronDown color="#718096" size={20} />
          </TouchableOpacity>
        </FormField>
        
        {/* Notes */}
        <FormField label="Notes (Optional)">
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            placeholder="Enter any additional notes"
            value={notes}
            onChangeText={setNotes}
          />
        </FormField>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Create Appointment" 
            onPress={handleSubmit}
            backgroundColor="#0077B6"
          />
        </View>
      </ScrollView>
      
      {/* Date Picker Modal */}
      <AppointmentPicker
        visible={showDatePicker}
        title="Select Date"
        data={[]} // This will be populated with available dates in the real app
        customContent={
          <Calendar 
            date={date ? new Date(date) : new Date()}
            onSelect={(selectedDate) => {
              setDate(selectedDate.toISOString().split('T')[0]);
              setShowDatePicker(false);
            }}
          />
        }
        onClose={() => setShowDatePicker(false)}
      />
      
      {/* Time Picker Modal */}
      <AppointmentPicker
        visible={showTimePicker}
        title="Select Time"
        data={TIME_SLOTS}
        onSelect={(item) => {
          setTimeSlot(item);
          setShowTimePicker(false);
        }}
        onClose={() => setShowTimePicker(false)}
      />
      
      {/* Category Picker Modal */}
      <AppointmentPicker
        visible={showCategoryPicker}
        title="Select Category"
        data={SERVICE_CATEGORIES}
        onSelect={(item) => {
          setCategory(item);
          setShowCategoryPicker(false);
        }}
        onClose={() => setShowCategoryPicker(false)}
      />
      
      {/* Patient Picker Modal */}
      <AppointmentPicker
        visible={showPatientPicker}
        title="Select Patient"
        data={patients.map(patient => ({
          id: patient.id,
          label: `${patient.firstName} ${patient.surname}`,
        }))}
        onSelect={(item) => {
          setPatientId(item.id);
          setShowPatientPicker(false);
        }}
        onClose={() => setShowPatientPicker(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2D3748',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#2D3748',
  },
  placeholderText: {
    color: '#A0AEC0',
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
});