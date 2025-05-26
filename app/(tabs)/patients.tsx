import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { CirclePlus as PlusCircle, Search, Users } from 'lucide-react-native';
import { usePatientsStore } from '../../stores/patientsStore';
import { PatientCard } from '../../components/PatientCard';

export default function PatientManagement() {
  const router = useRouter();
  const patients = usePatientsStore((state) => state.patients);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter patients based on search query
  const filteredPatients = searchQuery
    ? patients.filter(patient => 
        `${patient.firstName} ${patient.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.idNumber.includes(searchQuery)
      )
    : patients;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#718096" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients by name or ID"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/patients/add')}
        >
          <PlusCircle color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
      
      {patients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Users color="#0077B6" size={60} />
          <Text style={styles.emptyTitle}>No Patients Yet</Text>
          <Text style={styles.emptyText}>
            Add your first patient to start scheduling appointments
          </Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={() => router.push('/patients/add')}
          >
            <PlusCircle color="#FFFFFF" size={16} />
            <Text style={styles.emptyAddButtonText}>Add Patient</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PatientCard
              patient={item}
              onPress={() => router.push(`/patients/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No patients found matching "{searchQuery}"
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#2D3748',
  },
  addButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  emptyAddButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8,
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
});