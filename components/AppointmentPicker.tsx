import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView
} from 'react-native';
import { X } from 'lucide-react-native';

interface AppointmentPickerProps {
  visible: boolean;
  title: string;
  data: any[];
  onSelect: (item: any) => void;
  onClose: () => void;
  customContent?: React.ReactNode;
}

export function AppointmentPicker({ 
  visible, 
  title, 
  data, 
  onSelect, 
  onClose,
  customContent
}: AppointmentPickerProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#718096" size={24} />
            </TouchableOpacity>
          </View>
          
          {customContent ? (
            customContent
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemButton}
                  onPress={() => onSelect(item)}
                >
                  <Text style={styles.itemText}>
                    {item.label || item.toString()}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  list: {
    maxHeight: '90%',
  },
  itemButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemText: {
    fontSize: 16,
    color: '#2D3748',
  },
});