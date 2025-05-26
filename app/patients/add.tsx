import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import { usePatientsStore } from '../../stores/patientsStore';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { AppointmentPicker } from '../../components/AppointmentPicker';

// ID Type options
const ID_TYPES = ['ID Number', 'Passport Number'];

// Gender options
const GENDERS = ['Male', 'Female', 'Other'];

export default function AddPatient() {
  const router = useRouter();
  const { addPatient } = usePatientsStore();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [idType, setIdType] = useState('ID Number');
  const [idNumber, setIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [primaryContact, setPrimaryContact] = useState('');
  const [secondaryContact, setSecondaryContact] = useState('');
  
  // Picker visibility state
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showIdTypePicker, setShowIdTypePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Validate ID Number format
  const validateIdNumber = (id: string): boolean => {
    if (idType === 'ID Number') {
      // South African ID number is 13 digits
      return /^\d{13}$/.test(id);
    }
    // Passport can be more flexible but at least 6 characters
    return id.length >= 6;
  };
  
  // Validate form
  const validateForm = (): boolean => {
    if (!firstName || !surname || !gender || !dateOfBirth || !idNumber || !address || !primaryContact) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }
    
    if (!validateIdNumber(idNumber)) {
      Alert.alert(
        'Invalid ID Format', 
        idType === 'ID Number' ? 'South African ID number must be 13 digits.' : 'Please enter a valid passport number.'
      );
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Create new patient
    const newPatient = {
      id: Date.now().toString(),
      firstName,
      surname,
      gender,
      dateOfBirth,
      idType,
      idNumber,
      address,
      primaryContact,
      secondaryContact,
      createdAt: new Date().toISOString(),
    };
    
    // Add patient to store
    addPatient(newPatient);
    
    // Show success message
    Alert.alert(
      'Patient Added', 
      'The patient has been successfully added.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: 'Add New Patient',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {/* First Name */}
          <FormField label="First Name" required>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </FormField>
          
          {/* Surname */}
          <FormField label="Surname" required>
            <TextInput
              style={styles.input}
              placeholder="Enter surname"
              value={surname}
              onChangeText={setSurname}
            />
          </FormField>
          
          {/* Gender */}
          <FormField label="Gender" required>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowGenderPicker(true)}
            >
              <Text style={[styles.pickerText, !gender && styles.placeholderText]}>
                {gender || 'Select gender'}
              </Text>
              <ChevronDown color="#718096" size={20} />
            </TouchableOpacity>
          </FormField>
          
          {/* Date of Birth */}
          <FormField label="Date of Birth" required>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.pickerText, !dateOfBirth && styles.placeholderText]}>
                {dateOfBirth || 'Select date of birth'}
              </Text>
              <ChevronDown color="#718096" size={20} />
            </TouchableOpacity>
          </FormField>
          
          {/* ID Type */}
          <FormField label="ID Type" required>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowIdTypePicker(true)}
            >
              <Text style={styles.pickerText}>{idType}</Text>
              <ChevronDown color="#718096" size={20} />
            </TouchableOpacity>
          </FormField>
          
          {/* ID/Passport Number */}
          <FormField label={idType} required>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${idType.toLowerCase()}`}
              value={idNumber}
              onChangeText={setIdNumber}
              keyboardType="number-pad"
              maxLength={idType === 'ID Number' ? 13 : undefined}
            />
          </FormField>
          
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {/* Address */}
          <FormField label="Address" required>
            <TextInput
              style={styles.textArea}
              placeholder="Enter address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
          </FormField>
          
          {/* Primary Contact */}
          <FormField label="Primary Contact" required>
            <TextInput
              style={styles.input}
              placeholder="Enter primary contact number"
              value={primaryContact}
              onChangeText={setPrimaryContact}
              keyboardType="phone-pad"
            />
          </FormField>
          
          {/* Secondary Contact */}
          <FormField label="Secondary Contact (Optional)">
            <TextInput
              style={styles.input}
              placeholder="Enter secondary contact number"
              value={secondaryContact}
              onChangeText={setSecondaryContact}
              keyboardType="phone-pad"
            />
          </FormField>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Add Patient" 
              onPress={handleSubmit}
              backgroundColor="#0077B6"
            />
          </View>
        </ScrollView>
        
        {/* Gender Picker Modal */}
        <AppointmentPicker
          visible={showGenderPicker}
          title="Select Gender"
          data={GENDERS}
          onSelect={(item) => {
            setGender(item);
            setShowGenderPicker(false);
          }}
          onClose={() => setShowGenderPicker(false)}
        />
        
        {/* ID Type Picker Modal */}
        <AppointmentPicker
          visible={showIdTypePicker}
          title="Select ID Type"
          data={ID_TYPES}
          onSelect={(item) => {
            setIdType(item);
            setShowIdTypePicker(false);
          }}
          onClose={() => setShowIdTypePicker(false)}
        />
        
        {/* Date Picker Modal */}
        <AppointmentPicker
          visible={showDatePicker}
          title="Select Date of Birth"
          data={[]} // This will be populated with dates in the real app
          customContent={
            <Calendar 
              date={dateOfBirth ? new Date(dateOfBirth) : new Date()}
              onSelect={(selectedDate) => {
                setDateOfBirth(selectedDate.toISOString().split('T')[0]);
                setShowDatePicker(false);
              }}
            />
          }
          onClose={() => setShowDatePicker(false)}
        />
      </KeyboardAvoidingView>
    </>
  );
}

// Calendar component (simplified for this example)
function Calendar({ date, onSelect }: { date: Date, onSelect: (date: Date) => void }) {
  const [selectedDate, setSelectedDate] = useState(date);
  
  // In a real app, this would be a full calendar component
  // For simplicity, we're just showing a few date options
  
  const dateOptions = [
    new Date(2000, 0, 1),  // Jan 1, 2000
    new Date(1995, 5, 15), // Jun 15, 1995
    new Date(1990, 11, 31), // Dec 31, 1990
    new Date(1985, 3, 10), // Apr 10, 1985
    new Date(1980, 7, 22), // Aug 22, 1980
  ];
  
  return (
    <View style={calendarStyles.container}>
      {dateOptions.map((dateOption, index) => (
        <TouchableOpacity
          key={index}
          style={[
            calendarStyles.dateButton,
            selectedDate.toDateString() === dateOption.toDateString() && calendarStyles.selectedDate,
          ]}
          onPress={() => {
            setSelectedDate(dateOption);
            onSelect(dateOption);
          }}
        >
          <Text
            style={[
              calendarStyles.dateText,
              selectedDate.toDateString() === dateOption.toDateString() && calendarStyles.selectedDateText,
            ]}
          >
            {dateOption.toLocaleDateString('en-ZA')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const calendarStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#F1F5F9',
  },
  selectedDate: {
    backgroundColor: '#0077B6',
  },
  dateText: {
    fontSize: 16,
    color: '#2D3748',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
});

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
  backButton: {
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
    color: '#2D3748',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
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
    paddingVertical: 10,
  },
  pickerText: {
    fontSize: 16,
    color: '#2D3748',
  },
  placeholderText: {
    color: '#A0AEC0',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});