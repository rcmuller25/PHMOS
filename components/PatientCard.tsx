import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { calculateAge } from '../utils/dateUtils';

interface Patient {
  id: string;
  firstName: string;
  surname: string;
  gender: string;
  dateOfBirth: string;
  idType: string;
  idNumber: string;
  address: string;
  primaryContact: string;
  secondaryContact?: string;
}

interface PatientCardProps {
  patient: Patient;
  onPress: () => void;
}

export function PatientCard({ patient, onPress }: PatientCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.initialsContainer}>
        <Text style={styles.initials}>
          {patient.firstName.charAt(0)}{patient.surname.charAt(0)}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{patient.firstName} {patient.surname}</Text>
        <Text style={styles.details}>
          {patient.gender} • {calculateAge(patient.dateOfBirth)} years
        </Text>
        <Text style={styles.details}>
          {patient.idType}: {patient.idNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  initialsContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initials: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 2,
  },
});