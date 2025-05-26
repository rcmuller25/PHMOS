import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Chrome as Home, Calendar, CirclePlus as PlusCircle, Users, Search, Settings, Info } from 'lucide-react-native';

const TabBarIcon = ({ color, size, icon: Icon }: { color: string; size: number; icon: any }) => {
  return <Icon color={color} size={size} />;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0077B6',
        tabBarInactiveTintColor: '#8B8B8B',
        tabBarStyle: styles.tabBar,
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <TabBarIcon icon={Home} color={color} size={size} />,
          headerTitle: 'PHMOS',
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <TabBarIcon icon={Calendar} color={color} size={size} />,
          headerTitle: 'Appointment Calendar',
        }}
      />
      <Tabs.Screen
        name="add-appointment"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => <TabBarIcon icon={PlusCircle} color={color} size={size} />,
          headerTitle: 'New Appointment',
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: 'Patients',
          tabBarIcon: ({ color, size }) => <TabBarIcon icon={Users} color={color} size={size} />,
          headerTitle: 'Patient Management',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <TabBarIcon icon={Search} color={color} size={size} />,
          headerTitle: 'Search Records',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <TabBarIcon icon={Settings} color={color} size={size} />,
          headerTitle: 'App Settings',
        }}
      />
      {/* Remove the following screen definition */}
      {/* <Tabs.Screen
        name="settings/about"
        options={{
          title: 'About Us',
          headerTitle: 'About PHMOS',
          href: null, // This hides the tab from the tab bar
        }}
      /> */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  header: {
    backgroundColor: '#0077B6',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});