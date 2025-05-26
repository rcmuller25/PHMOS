import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About PHMOIS</Text>
      <Text style={styles.description}>
        Primary Healthcare Mobile Outreach Information System (PHMOIS) is designed specifically for Caledon Clinic.
      </Text>
      <Text style={styles.description}>
        This lightweight, offline-first solution helps healthcare professionals manage appointments and patient records in rural and outreach settings.
      </Text>
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 16,
    lineHeight: 24,
  },
  version: {
    fontSize: 14,
    color: '#718096',
    marginTop: 20,
  },
});