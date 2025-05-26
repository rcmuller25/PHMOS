import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SettingsItemProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsItem({ title, description, children }: SettingsItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {description && <Text style={styles.itemDescription}>{description}</Text>}
      </View>
      <View style={styles.controlContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#718096',
  },
  controlContainer: {
    marginLeft: 16,
  },
});