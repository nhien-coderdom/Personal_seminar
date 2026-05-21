import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * AIHintCard — Card gợi ý nổi ở dưới màn hình, glassmorphism style
 */
export function AIHintCard() {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={50} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="bulb-outline" size={22} color="#5EDFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Mẹo quét nhanh</Text>
            <Text style={styles.description}>
              Giữ camera ổn định và đảm bảo đủ ánh sáng để kết quả tốt nhất.
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  blur: {
    padding: 14,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(94,223,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    lineHeight: 17,
  },
});
