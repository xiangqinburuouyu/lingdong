/**
 * 打赏页面 - 支持微信、支付宝打赏
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

// 预设打赏金额
const PRESET_AMOUNTS = [1, 5, 10, 20, 50, 100];

const TippingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { author, articleId } = route.params || {};

  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null); // 'wechat' | 'alipay'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // 选择金额
  const selectAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  // 自定义金额
  const handleCustomAmount = (text) => {
    setCustomAmount(text);
    const value = parseFloat(text);
    if (!isNaN(value) && value > 0) {
      setSelectedAmount(value);
    }
  };

  // 发起打赏
  const startTipping = (method) => {
    if (!author) {
      Alert.alert('提示', '作者信息缺失');
      return;
    }

    const amount = customAmount || selectedAmount;
    if (!amount || amount <= 0) {
      Alert.alert('提示', '请输入有效金额');
      return;
    }

    setPaymentMethod(method);
    setShowPaymentModal(true);
  };

  // 确认支付
  const confirmPayment = async () => {
    setProcessing(true);
    try {
      // TODO: 调用支付 API
      // const response = await tippingAPI.create({
      //   authorId: author.id,
      //   articleId,
      //   amount: selectedAmount,
      //   method: paymentMethod,
      // });

      // 模拟支付过程
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert('成功', `打赏 ${selectedAmount} 元成功！`, [
        {
          text: '确定',
          onPress: () => {
            setShowPaymentModal(false);
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('打赏失败:', error);
      Alert.alert('错误', '打赏失败，请重试');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 作者信息 */}
      <View style={styles.authorCard}>
        {author?.avatar ? (
          <Image source={{ uri: author.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
        )}
        <Text style={styles.authorName}>{author?.nickname || '作者'}</Text>
        <Text style={styles.authorBio}>
          {author?.bio || '感谢你的支持！'}
        </Text>
      </View>

      {/* 说明文字 */}
      <View style={styles.infoCard}>
        <Ionicons name="heart" size={24} color="#FF4D4F" />
        <Text style={styles.infoText}>
          打赏是鼓励作者创作的最佳方式
        </Text>
        <Text style={styles.infoSubtext}>
          所有打赏将直接转入作者账户
        </Text>
      </View>

      {/* 金额选择 */}
      <View style={styles.amountSection}>
        <Text style={styles.sectionTitle}>选择金额</Text>
        <View style={styles.amountGrid}>
          {PRESET_AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.amountButton,
                selectedAmount === amount && styles.amountButtonActive,
              ]}
              onPress={() => selectAmount(amount)}
            >
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === amount && styles.amountTextActive,
                ]}
              >
                ¥{amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 自定义金额 */}
        <View style={styles.customAmountContainer}>
          <Text style={styles.customAmountLabel}>自定义金额</Text>
          <View style={styles.customAmountInput}>
            <Text style={styles.currencySymbol}>¥</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入金额"
              placeholderTextColor="#999"
              value={customAmount}
              onChangeText={handleCustomAmount}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* 支付方式 */}
      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>选择支付方式</Text>

        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'wechat' && styles.paymentButtonActive]}
          onPress={() => startTipping('wechat')}
        >
          <Ionicons name="logo-wechat" size={28} color="#07C160" />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>微信支付</Text>
            <Text style={styles.paymentDesc}>推荐使用</Text>
          </View>
          {paymentMethod === 'wechat' && (
            <Ionicons name="checkmark-circle" size={24} color="#0066FF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'alipay' && styles.paymentButtonActive]}
          onPress={() => startTipping('alipay')}
        >
          <Ionicons name="alipay" size={28} color="#1677FF" />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>支付宝</Text>
            <Text style={styles.paymentDesc}>快捷支付</Text>
          </View>
          {paymentMethod === 'alipay' && (
            <Ionicons name="checkmark-circle" size={24} color="#0066FF" />
          )}
        </TouchableOpacity>
      </View>

      {/* 打赏记录（示例） */}
      <View style={styles.recordsSection}>
        <Text style={styles.sectionTitle}>打赏记录</Text>
        <View style={styles.recordItem}>
          <Text style={styles.recordUser}>匿名用户</Text>
          <Text style={styles.recordAmount}>¥10</Text>
          <Text style={styles.recordTime}>刚刚</Text>
        </View>
        <View style={styles.recordItem}>
          <Text style={styles.recordUser}>张*三</Text>
          <Text style={styles.recordAmount}>¥50</Text>
          <Text style={styles.recordTime}>1 小时前</Text>
        </View>
      </View>

      {/* 支付弹窗 */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>确认打赏</Text>
            <Text style={styles.modalAmount}>¥{selectedAmount}</Text>
            <View style={styles.modalMethod}>
              <Ionicons
                name={paymentMethod === 'wechat' ? 'logo-wechat' : 'alipay'}
                size={24}
                color={paymentMethod === 'wechat' ? '#07C160' : '#1677FF'}
              />
              <Text style={styles.modalMethodText}>
                {paymentMethod === 'wechat' ? '微信支付' : '支付宝'}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPaymentModal(false)}
                disabled={processing}
              >
                <Text style={styles.modalCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmButton, processing && styles.modalButtonDisabled]}
                onPress={confirmPayment}
                disabled={processing}
              >
                {processing ? (
                  <Text style={styles.modalConfirmText}>支付中...</Text>
                ) : (
                  <Text style={styles.modalConfirmText}>确认支付</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  authorCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  authorBio: {
    fontSize: 14,
    color: '#999',
  },
  infoCard: {
    backgroundColor: '#FFF5F5',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    marginTop: 8,
    fontWeight: '500',
  },
  infoSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  amountSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  amountButton: {
    width: '30%',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: '5%',
    marginBottom: 12,
  },
  amountButtonActive: {
    backgroundColor: '#0066FF',
  },
  amountText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  amountTextActive: {
    color: '#fff',
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customAmountLabel: {
    fontSize: 15,
    color: '#666',
    marginRight: 12,
  },
  customAmountInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  paymentSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentButtonActive: {
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#0066FF',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentDesc: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  recordsSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 12,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
  },
  recordUser: {
    fontSize: 14,
    color: '#666',
  },
  recordAmount: {
    fontSize: 14,
    color: '#FF4D4F',
    fontWeight: '600',
  },
  recordTime: {
    fontSize: 13,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  modalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0066FF',
    marginBottom: 20,
  },
  modalMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  modalMethodText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#0066FF',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalConfirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default TippingScreen;
