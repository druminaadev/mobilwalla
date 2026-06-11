import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ListRenderItemInfo,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Phone, MoreVertical, Paperclip, Mic, Send, Bot, Check, CheckCheck, X, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  FadeOutUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  SharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ProfileStackParamList } from '@/types/navigation';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useAuthStore } from '@/store/authStore';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════
type MessageType = 'text' | 'quickReply' | 'card' | 'typing' | 'separator';
type MessageSender = 'bot' | 'user' | 'system';
type TickStatus = 'sent' | 'delivered' | 'read';

interface QuickReply {
  id: string;
  label: string;
  value: string;
  used?: boolean;
}

interface ChatMessage {
  id: string;
  type: MessageType;
  sender: MessageSender;
  text?: string;
  quickReplies?: QuickReply[];
  timestamp: Date;
  tickStatus?: TickStatus;
  isRead?: boolean;
}

type Props = NativeStackScreenProps<ProfileStackParamList, 'Chatbot'>;

const ASYNC_STORAGE_KEY = 'support_chat';

// ═══════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════

const TopBanner = ({ onDismiss }: { onDismiss: () => void }) => {
  return (
    <Animated.View exiting={FadeOutUp.duration(300)} style={styles.bannerContainer}>
      <Text style={styles.bannerText}>⚡ Average response time: 2 minutes</Text>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <X size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const TypingIndicator = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const animateDot = (dot: SharedValue<number>, delay: number) => {
      dot.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-6, { duration: 300, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, [dot1, dot2, dot3]);

  const getStyle = (dot: SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: dot.value }],
    }));

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.typingDot, getStyle(dot1)]} />
      <Animated.View style={[styles.typingDot, getStyle(dot2)]} />
      <Animated.View style={[styles.typingDot, getStyle(dot3)]} />
    </View>
  );
};

const MessageBubble = React.memo(({ item, showAvatar }: { item: ChatMessage; showAvatar: boolean }) => {
  const isBot = item.sender === 'bot';
  const isSystem = item.sender === 'system';

  if (isSystem && item.type === 'separator') {
    return (
      <View style={styles.separatorContainer}>
        <View style={styles.separatorPill}>
          <Text style={styles.separatorText}>{item.text}</Text>
        </View>
      </View>
    );
  }

  const translateX = useSharedValue(isBot ? -20 : 20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    opacity.value = withTiming(1, { duration: 300 });
  }, [item.id, translateX, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const timeString = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Animated.View
      layout={Layout.duration(300)}
      style={[
        styles.messageRow,
        isBot ? styles.messageRowBot : styles.messageRowUser,
        animatedStyle,
      ]}
    >
      {isBot && (
        <View style={styles.avatarContainer}>
          {showAvatar ? (
            <LinearGradient colors={[colors.primary, '#FF8FAB']} style={styles.botAvatar}>
              <Bot size={14} color={colors.white} />
            </LinearGradient>
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
      )}

      <View style={styles.bubbleContent}>
        <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
          {item.type === 'typing' ? (
            <TypingIndicator />
          ) : (
            <Text style={[styles.bubbleText, isBot ? styles.bubbleTextBot : styles.bubbleTextUser]}>
              {item.text}
            </Text>
          )}
        </View>

        {item.type !== 'typing' && (
          <View style={[styles.messageFooter, isBot ? styles.messageFooterBot : styles.messageFooterUser]}>
            <Text style={styles.timestamp}>{timeString}</Text>
            {!isBot && (
              <View style={styles.tickContainer}>
                {item.tickStatus === 'sent' && <Check size={12} color={colors.textTertiary} />}
                {item.tickStatus === 'delivered' && <CheckCheck size={12} color={colors.textTertiary} />}
                {item.tickStatus === 'read' && <CheckCheck size={12} color="#3B82F6" />}
              </View>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
});

const QuickReplyRow = ({ replies, onSelect }: { replies: QuickReply[]; onSelect: (q: QuickReply) => void }) => {
  if (!replies || replies.length === 0) return null;
  return (
    <Animated.View entering={FadeInUp.duration(400)} layout={Layout.duration(300)} style={styles.quickReplyContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={replies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.quickReplyList}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 100).duration(300)}>
            <TouchableOpacity
              style={styles.quickReplyChip}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickReplyText}>{item.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </Animated.View>
  );
};

// ═══════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════
export default function ChatbotScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onlinePulse = useSharedValue(1);
  useEffect(() => {
    onlinePulse.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [onlinePulse]);

  const onlineStyle = useAnimatedStyle(() => ({
    transform: [{ scale: onlinePulse.value }],
  }));

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      if (stored) {
        const parsed: ChatMessage[] = JSON.parse(stored);
        const fixed = parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(fixed);
      } else {
        startInitialConversation();
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
      startInitialConversation();
    }
  };

  const saveMessages = useCallback(async (msgs: ChatMessage[]) => {
    try {
      const trimmed = msgs.slice(0, 100);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => {
      const updated = [msg, ...prev];
      saveMessages(updated);
      return updated;
    });
  }, [saveMessages]);

  const removeTypingIndicator = useCallback(() => {
    setMessages((prev) => prev.filter(m => m.type !== 'typing'));
  }, []);

  const startInitialConversation = () => {
    addMessage({
      id: 'sep_today',
      type: 'separator',
      sender: 'system',
      text: 'Today',
      timestamp: new Date(),
    });

    setTimeout(() => {
      addMessage({
        id: 'bot_init_typing',
        type: 'typing',
        sender: 'bot',
        timestamp: new Date(),
      });

      setTimeout(() => {
        removeTypingIndicator();
        addMessage({
          id: 'bot_init_msg',
          type: 'text',
          sender: 'bot',
          text: `👋 Hi ${user?.name || 'there'}! Welcome to Salon Support.\nHow can I help you today?`,
          timestamp: new Date(),
          quickReplies: [
            { id: 'q1', label: '📅 Book Appointment', value: 'Book Appointment' },
            { id: 'q2', label: '❌ Cancel Booking', value: 'Cancel Booking' },
            { id: 'q3', label: '🔄 Reschedule', value: 'Reschedule' },
            { id: 'q4', label: '💳 Payment Issue', value: 'Payment Issue' },
            { id: 'q5', label: '🙋 Talk to Human', value: 'Talk to Human' },
          ]
        });
      }, 1500);
    }, 600);
  };

  const handleBotResponse = useCallback((userText: string) => {
    const textLower = userText.toLowerCase();

    addMessage({
      id: `bot_typing_${Date.now()}`,
      type: 'typing',
      sender: 'bot',
      timestamp: new Date(),
    });

    setTimeout(() => {
      removeTypingIndicator();
      let botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        type: 'text',
        sender: 'bot',
        timestamp: new Date(),
      };

      if (textLower.includes('book')) {
        botMsg.text = "I'd love to help you book an appointment!\nWhat service are you interested in?";
        botMsg.quickReplies = [
          { id: 'qr1', label: 'Hair', value: 'Hair' },
          { id: 'qr2', label: 'Nails', value: 'Nails' },
          { id: 'qr3', label: 'Spa', value: 'Spa' },
          { id: 'qr4', label: 'Bridal', value: 'Bridal' },
        ];
      } else if (textLower.includes('cancel')) {
        botMsg.text = "I can help with that. Please share your Booking ID and I'll look into it right away.";
      } else if (textLower.includes('human') || textLower.includes('agent')) {
        botMsg.text = "Connecting you to our support team... 🔄";
        
        addMessage(botMsg);
        
        setTimeout(() => {
          addMessage({
            id: `bot_typing_${Date.now()}`,
            type: 'typing',
            sender: 'bot',
            timestamp: new Date(),
          });
          setTimeout(() => {
            removeTypingIndicator();
            addMessage({
              id: `bot_${Date.now()}`,
              type: 'text',
              sender: 'bot',
              text: "✅ You're now connected to Priya from our support team. She'll be with you shortly!",
              timestamp: new Date(),
            });
          }, 2000);
        }, 1000);
        return;
      } else {
        botMsg.text = "Thanks for reaching out! Our team will respond shortly. Average wait: 2 minutes.";
      }

      addMessage(botMsg);
    }, 1500);
  }, [addMessage, removeTypingIndicator]);

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return;

    setMessages(prev => {
      const newMsgs = [...prev];
      const lastBotIndex = newMsgs.findIndex(m => m.sender === 'bot');
      if (lastBotIndex !== -1 && newMsgs[lastBotIndex].quickReplies) {
        newMsgs[lastBotIndex] = { ...newMsgs[lastBotIndex], quickReplies: undefined };
      }
      return newMsgs;
    });

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'text',
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
      tickStatus: 'sent',
    };

    addMessage(userMsg);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, tickStatus: 'delivered' } : m));
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, tickStatus: 'read' } : m));
      }, 500);
    }, 500);

    handleBotResponse(text);
  }, [addMessage, handleBotResponse]);

  const clearChat = useCallback(async () => {
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEY);
    setMessages([]);
    startInitialConversation();
  }, []);

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<ChatMessage>) => {
    const showAvatar = index === 0 || messages[index - 1]?.sender !== 'bot';
    return <MessageBubble item={item} showAvatar={showAvatar} />;
  }, [messages]);

  const activeQuickReplies = useMemo(() => {
    if (messages.length === 0) return undefined;
    if (messages[0].sender === 'bot' && messages[0].quickReplies) {
      return messages[0].quickReplies;
    }
    return undefined;
  }, [messages]);

  const hasText = inputText.trim().length > 0;
  const micScale = useSharedValue(1);
  const sendScale = useSharedValue(0);

  useEffect(() => {
    micScale.value = withTiming(hasText ? 0 : 1, { duration: 250, easing: Easing.out(Easing.quad) });
    sendScale.value = withTiming(hasText ? 1 : 0, { duration: 250, easing: Easing.out(Easing.quad) });
  }, [hasText]);

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
    opacity: micScale.value,
  }));
  const sendStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
    opacity: sendScale.value,
  }));

  // Dynamic padding for input area to properly avoid keyboard
  // On iOS, KeyboardAvoidingView does the heavy lifting via 'padding' behavior.
  // On Android, window adjustResize handles it natively, but we still respect bottom inset when keyboard is hidden.
  const paddingBottom = Platform.OS === 'ios' 
    ? (isKeyboardVisible ? 12 : Math.max(insets.bottom, 12))
    : (isKeyboardVisible ? 12 : Math.max(insets.bottom, 12));

  return (
    <View style={styles.container}>
      {/* 1. HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatarWrap}>
            <LinearGradient colors={[colors.primary, '#FF8FAB']} style={styles.headerAvatar}>
              <Bot size={20} color={colors.white} />
            </LinearGradient>
            <View style={styles.onlineDotWrap}>
              <Animated.View style={[styles.onlineDot, onlineStyle]} />
            </View>
          </View>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Support Team</Text>
            <View style={styles.headerSubWrap}>
              <View style={styles.statusDot} />
              <Text style={styles.headerSub}>Online • Replies in 2 min</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <Phone size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={clearChat}>
            <MoreVertical size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* TOP BANNER */}
      {showBanner && <TopBanner onDismiss={() => setShowBanner(false)} />}

      {/* KEYBOARD AVOIDING VIEW */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoiding} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 2. CHAT AREA */}
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle size={64} color={colors.border} />
            <Text style={styles.emptyTitle}>How can we help?</Text>
            <Text style={styles.emptySub}>Our team is here for you 24/7</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            inverted
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* QUICK REPLIES */}
        {activeQuickReplies && (
          <QuickReplyRow replies={activeQuickReplies} onSelect={(q) => handleSend(q.value)} />
        )}

        {/* INPUT BAR */}
        <View style={[styles.inputBar, { paddingBottom }]}>
          <TouchableOpacity style={styles.attachBtn}>
            <Paperclip size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={500}
          />
          
          <View style={styles.actionBtnWrap}>
            <Animated.View style={micStyle}>
              <TouchableOpacity style={styles.micBtn}>
                <Mic size={20} color={colors.primary} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={sendStyle}>
              <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend(inputText)}>
                <Send size={18} color={colors.white} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ═══════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingBottom: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerAvatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDotWrap: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  headerTitles: {
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.subtitle1,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 4,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 9,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    textAlign: 'center',
  },
  chatList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  separatorContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  separatorPill: {
    backgroundColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  separatorText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 24,
    height: 24,
    marginRight: 8,
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 24,
    height: 24,
  },
  bubbleContent: {
    maxWidth: '75%',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleBot: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextBot: {
    color: colors.textPrimary,
  },
  bubbleTextUser: {
    color: colors.white,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageFooterBot: {
    justifyContent: 'flex-start',
    marginLeft: 4,
  },
  messageFooterUser: {
    justifyContent: 'flex-end',
    marginRight: 4,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  tickContainer: {
    marginLeft: 4,
    height: 12,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textTertiary,
  },
  quickReplyContainer: {
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  quickReplyList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickReplyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  attachBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: colors.gray50,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    color: colors.textPrimary,
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnWrap: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
