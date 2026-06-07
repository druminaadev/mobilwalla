import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator,
} from 'react-native';
import { Send, Bot, User } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { colors } from '@/constants/colors';

type Message = { id: string; text: string; from: 'bot' | 'user'; time: string };

const QUICK_REPLIES = ['Book appointment', 'Cancel booking', 'Wallet & refunds', 'Working hours', 'Talk to agent'];

const BOT_REPLIES: Record<string, string> = {
  'book appointment': 'Go to Home → select a salon → pick services, staff & time slot.',
  'cancel booking': 'You can cancel up to 2 hours before. Go to Bookings → select booking → Cancel.',
  'wallet & refunds': 'Wallet refunds within 1–2 hours. Bank transfers take 5–7 business days.',
  'working hours': 'Mon–Sat: 9AM–8PM · Sunday: 10AM–6PM.',
  'talk to agent': 'Connecting you... Our team responds within minutes. Call +91 98765 43210.',
};

const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const getBotReply = (input: string) => {
  const lower = input.toLowerCase();
  for (const key of Object.keys(BOT_REPLIES)) {
    if (lower.includes(key)) return BOT_REPLIES[key];
  }
  return "I'm not sure about that. Call +91 98765 43210 or email support@hairahmedabad.com.";
};

const INITIAL: Message[] = [
  { id: '0', from: 'bot', text: "Hi! 👋 I'm the Hair Ahmedabad support bot. How can I help you?", time: getTime() },
];

export default function ChatbotScreen({ navigation }: any) {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: text.trim(), time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), from: 'bot', text: getBotReply(text), time: getTime() }]);
      setTyping(false);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isBot = item.from === 'bot';
    return (
      <View style={[styles.row, isBot ? styles.rowBot : styles.rowUser]}>
        {isBot && <View style={styles.avatar}><Bot size={16} color="#fff" /></View>}
        <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
          <Text style={[styles.bubbleText, !isBot && styles.bubbleTextUser]}>{item.text}</Text>
          <Text style={[styles.time, !isBot && styles.timeUser]}>{item.time}</Text>
        </View>
        {!isBot && <View style={[styles.avatar, styles.avatarUser]}><User size={16} color="#fff" /></View>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Support Chat" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={90}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {typing && (
          <View style={styles.typingRow}>
            <View style={styles.avatar}><Bot size={14} color="#fff" /></View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.typingText}>Typing...</Text>
            </View>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow} contentContainerStyle={styles.chips}>
          {QUICK_REPLIES.map(q => (
            <TouchableOpacity key={q} style={styles.chip} onPress={() => send(q)}>
              <Text style={styles.chipText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={[styles.sendButton, !input.trim() && styles.sendDisabled]} onPress={() => send(input)} disabled={!input.trim()}>
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  rowBot: { justifyContent: 'flex-start' },
  rowUser: { justifyContent: 'flex-end' },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarUser: { backgroundColor: '#6C63FF' },
  bubble: { maxWidth: '75%', borderRadius: 16, padding: 12 },
  bubbleBot: { backgroundColor: '#fff', borderBottomLeftRadius: 4, elevation: 1, borderWidth: 1, borderColor: colors.border },
  bubbleUser: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  bubbleTextUser: { color: '#fff' },
  time: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  timeUser: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', padding: 10, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  typingText: { fontSize: 13, color: colors.textSecondary },
  chipsRow: { paddingVertical: 10 },
  chips: { gap: 8, paddingHorizontal: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, paddingBottom: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, minHeight: 44, maxHeight: 100, backgroundColor: colors.background, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendDisabled: { opacity: 0.5 },
});
