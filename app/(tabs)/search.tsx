import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, Filter, Calendar, Users, X } from 'lucide-react-native';
import { usePatientsStore } from '../../stores/patientsStore';
import { useAppointmentsStore } from '../../stores/appointmentsStore';
import { PatientCard } from '../../components/PatientCard';
import { AppointmentCard } from '../../components/AppointmentCard';

type SearchType = 'all' | 'patients' | 'appointments';
type FilterType = {
  dateRange: { start: string | null; end: string | null };
  categories: string[];
};

// Define service categories
const SERVICE_CATEGORIES = [
  'General Checkup',
  'Vaccination',
  'Prenatal',
  'HIV Treatment',
  'TB Screening',
  'Child Health',
];

export default function SearchScreen() {
  const router = useRouter();
  const patients = usePatientsStore((state) => state.patients);
  const appointments = useAppointmentsStore((state) => state.appointments);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    dateRange: { start: null, end: null },
    categories: [],
  });
  
  // Filter results based on search query and type
  const getFilteredResults = () => {
    if (!searchQuery.trim()) return { patients: [], appointments: [] };
    
    // Filter patients
    const filteredPatients = searchType !== 'appointments' 
      ? patients.filter(patient => 
          `${patient.firstName} ${patient.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.idNumber.includes(searchQuery)
        )
      : [];
    
    // Filter appointments
    const filteredAppointments = searchType !== 'patients'
      ? appointments.filter(appointment => {
          // Filter by patient name
          const patientNameMatch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Filter by date range if set
          const dateMatch = !filters.dateRange.start || !filters.dateRange.end 
            ? true 
            : appointment.date >= filters.dateRange.start && appointment.date <= filters.dateRange.end;
          
          // Filter by categories if any selected
          const categoryMatch = filters.categories.length === 0 
            ? true 
            : filters.categories.includes(appointment.category);
          
          return patientNameMatch && dateMatch && categoryMatch;
        })
      : [];
    
    return { patients: filteredPatients, appointments: filteredAppointments };
  };
  
  const { patients: filteredPatients, appointments: filteredAppointments } = getFilteredResults();
  
  // Toggle category filter
  const toggleCategory = (category: string) => {
    if (filters.categories.includes(category)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter(c => c !== category),
      });
    } else {
      setFilters({
        ...filters,
        categories: [...filters.categories, category],
      });
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateRange: { start: null, end: null },
      categories: [],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon color="#718096" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients or appointments"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color="#718096" size={18} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter color={showFilters ? '#0077B6' : '#718096'} size={20} />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.filterLabel}>Search in:</Text>
          <View style={styles.searchTypeContainer}>
            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'all' && styles.searchTypeActive,
              ]}
              onPress={() => setSearchType('all')}
            >
              <Text
                style={[
                  styles.searchTypeText,
                  searchType === 'all' && styles.searchTypeTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'patients' && styles.searchTypeActive,
              ]}
              onPress={() => setSearchType('patients')}
            >
              <Users size={16} color={searchType === 'patients' ? '#FFFFFF' : '#718096'} />
              <Text
                style={[
                  styles.searchTypeText,
                  searchType === 'patients' && styles.searchTypeTextActive,
                ]}
              >
                Patients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'appointments' && styles.searchTypeActive,
              ]}
              onPress={() => setSearchType('appointments')}
            >
              <Calendar size={16} color={searchType === 'appointments' ? '#FFFFFF' : '#718096'} />
              <Text
                style={[
                  styles.searchTypeText,
                  searchType === 'appointments' && styles.searchTypeTextActive,
                ]}
              >
                Appointments
              </Text>
            </TouchableOpacity>
          </View>
          
          {searchType !== 'patients' && (
            <>
              <Text style={styles.filterLabel}>Categories:</Text>
              <View style={styles.categoriesContainer}>
                {SERVICE_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      filters.categories.includes(category) && styles.categoryActive,
                    ]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        filters.categories.includes(category) && styles.categoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      )}
      
      <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
        {searchQuery.trim() === '' ? (
          <View style={styles.emptyStateContainer}>
            <SearchIcon color="#0077B6" size={48} />
            <Text style={styles.emptyStateTitle}>Search for patients or appointments</Text>
            <Text style={styles.emptyStateText}>
              Enter a name, ID number, or appointment details to find what you're looking for
            </Text>
          </View>
        ) : (
          <>
            {(searchType === 'all' || searchType === 'patients') && filteredPatients.length > 0 && (
              <View style={styles.resultSection}>
                <Text style={styles.sectionTitle}>Patients ({filteredPatients.length})</Text>
                {filteredPatients.map((patient) => (
                  <PatientCard
                    key={`patient-${patient.id}`}
                    patient={patient}
                    onPress={() => router.push(`/patients/${patient.id}`)}
                  />
                ))}
              </View>
            )}
            
            {(searchType === 'all' || searchType === 'appointments') && filteredAppointments.length > 0 && (
              <View style={styles.resultSection}>
                <Text style={styles.sectionTitle}>Appointments ({filteredAppointments.length})</Text>
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={`appointment-${appointment.id}`}
                    appointment={appointment}
                    onPress={() => router.push(`/appointments/${appointment.id}`)}
                  />
                ))}
              </View>
            )}
            
            {(filteredPatients.length === 0 && filteredAppointments.length === 0) && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsTitle}>No results found</Text>
                <Text style={styles.noResultsText}>
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
  filterButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    padding: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  resetText: {
    fontSize: 14,
    color: '#0077B6',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 8,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  searchTypeActive: {
    backgroundColor: '#0077B6',
  },
  searchTypeText: {
    fontSize: 14,
    color: '#718096',
    marginLeft: 4,
  },
  searchTypeTextActive: {
    color: '#FFFFFF',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryActive: {
    backgroundColor: '#0077B6',
  },
  categoryText: {
    fontSize: 14,
    color: '#718096',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
  },
  resultSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});