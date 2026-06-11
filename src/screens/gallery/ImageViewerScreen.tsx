import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';
import { X, Download, MoreVertical } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<HomeStackParamList, 'ImageViewer'>;

export default function ImageViewerScreen({ navigation, route }: Props) {
  const imageUri = route.params?.imageUri || 'https://via.placeholder.com/400';

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <X size={28} color="#fff" />
        </Pressable>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton}>
            <Download size={24} color="#fff" />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <MoreVertical size={24} color="#fff" />
          </Pressable>
        </View>
      </View>

      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />

      <View style={styles.footer}>
        <Text style={styles.caption}>Hair Transformation 💇♀️</Text>
        <Text style={styles.artist}>By Anjali Sharma</Text>
        <Text style={styles.tags}>#BridalMakeup #Glam</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 48 },
  closeButton: { padding: 8 },
  actions: { flexDirection: 'row', gap: 12 },
  actionButton: { padding: 8 },
  image: { width, height: height * 0.7, marginTop: 80 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  caption: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  artist: { fontSize: 14, color: '#E2E8F0', marginBottom: 8 },
  tags: { fontSize: 14, color: '#FF5C8A' },
});
