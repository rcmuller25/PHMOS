import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  backgroundColor: string;
  textColor: string;
}

export function DashboardCard({ title, value, icon, backgroundColor, textColor }: DashboardCardProps) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.value, { color: textColor }]}>{value}</Text>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>
      <View style={styles.iconContainer}>
        {icon}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    opacity: 0.8,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});