import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">สวัสดีครับคุณสมชาย</ThemedText>
        <ThemedText type="title" style={{ color: Colors[theme].tint }}>
          วันนี้ทานอะไรดี?
        </ThemedText>
      </View>

      <View style={[styles.statusCard, theme === 'dark' && styles.statusCardDark]}>
        <ThemedText style={styles.statusTitle}>สถานะวันนี้</ThemedText>
        <View style={styles.badgeContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <ThemedText style={styles.statusValue}>ยังไม่พบความเสี่ยง</ThemedText>
        </View>
      </View>

      <View style={styles.mainActions}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.iconCircle, { backgroundColor: '#F97316' }]}>
            <Ionicons name="camera" size={40} color="white" />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
            ถ่ายรูปอาหาร
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.iconCircle, { backgroundColor: '#8B5CF6' }]}>
            <Ionicons name="mic" size={40} color="white" />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
            บอกอาการ
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  statusCard: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  statusCardDark: {
    backgroundColor: '#1F2937',
  },
  statusTitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    aspectRatio: 0.8,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 18,
  },
});
