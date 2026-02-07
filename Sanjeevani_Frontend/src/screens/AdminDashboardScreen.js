import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import axios from 'axios';

const THEME_COLOR = '#2D7D46';

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // ✅ Using 10.0.2.2 for Android Emulator, change to your IP (10.21.69.216) for physical device
      const response = await axios.get('http://10.0.2.2:8000/api/v1/admin-stats/');
      setStats(response.data);
    } catch (e) {
      console.error("Admin Stats Fetch Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={THEME_COLOR} />
      <Text style={{marginTop: 10, color: THEME_COLOR}}>Loading Analytics...</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>System Analytics</Text>

      {/* Main Stats Card */}
      <View style={styles.statCard}>
        <View>
          <Text style={styles.label}>Total Users Registered</Text>
          <Text style={styles.mainValue}>{stats?.total_users || 0}</Text>
        </View>
        <Text style={styles.statEmoji}>👥</Text>
      </View>

      <View style={styles.whiteBox}>
        <Text style={styles.sectionTitle}>Constitution (Prakriti) Distribution</Text>

        {stats?.dosha_distribution && stats.dosha_distribution.length > 0 ? (
          stats.dosha_distribution.map((item, index) => {
            // ✅ Calculate percentage for the bar width
            const percentage = stats.total_users > 0
                ? ((item.count / stats.total_users) * 100).toFixed(0)
                : 0;

            return (
              <View key={index} style={styles.barRow}>
                <View style={styles.barHeader}>
                  <Text style={styles.barLabel}>{item.prakriti || 'Pending'}</Text>
                  <Text style={styles.barValue}>{item.count} users ({percentage}%)</Text>
                </View>
                <View style={styles.barContainer}>
                  <View
                    style={[
                        styles.barFill,
                        { width: `${percentage}%` },
                        // Assign different colors for visual variety
                        { backgroundColor: index === 0 ? '#2D7D46' : index === 1 ? '#66BB6A' : '#A5D6A7' }
                    ]}
                  />
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noData}>No user data available yet.</Text>
        )}
      </View>

      <View style={styles.footerInfo}>
        <Text style={styles.footerText}>Data synced with MongoDB Cluster</Text>
        <Text style={styles.footerText}>Last Updated: {new Date().toLocaleTimeString()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F0', padding: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', color: THEME_COLOR, marginBottom: 25, marginTop: 10 },
  statCard: {
    backgroundColor: THEME_COLOR,
    padding: 25,
    borderRadius: 24,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  label: { color: '#FFF', opacity: 0.9, fontSize: 15, fontWeight: '600' },
  mainValue: { color: '#FFF', fontSize: 48, fontWeight: 'bold', marginTop: 5 },
  statEmoji: { fontSize: 40, opacity: 0.5 },

  whiteBox: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  barRow: { marginBottom: 20 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  barLabel: { fontSize: 15, fontWeight: 'bold', color: '#444' },
  barValue: { fontSize: 13, color: '#777', fontWeight: '600' },
  barContainer: { height: 12, backgroundColor: '#E8F5E9', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },

  noData: { textAlign: 'center', color: '#999', marginVertical: 20, fontStyle: 'italic' },
  footerInfo: { marginTop: 30, alignItems: 'center', paddingBottom: 40 },
  footerText: { fontSize: 11, color: '#AAA', marginBottom: 4 }
});

export default AdminDashboardScreen;