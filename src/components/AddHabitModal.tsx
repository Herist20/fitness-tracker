import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../store/habitStore';
import { getCategoryColor, getCategoryIcon } from '../utils/habitUtils';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Health', 'Fitness', 'Mindfulness', 'Productivity'];
const FREQUENCIES = ['Daily', 'Weekly', 'Custom'];
const ICONS = [
  'water',
  'fitness',
  'restaurant',
  'bed',
  'walk',
  'bicycle',
  'book',
  'code',
  'musical-notes',
  'brush',
  'leaf',
  'heart',
];

export default function AddHabitModal({ visible, onClose }: Props) {
  const { addHabit } = useHabitStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Health');
  const [frequency, setFrequency] = useState<string>('Daily');
  const [targetCount, setTargetCount] = useState('1');
  const [selectedIcon, setSelectedIcon] = useState('checkmark-circle');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Habit name is required';
    } else if (name.length < 3) {
      newErrors.name = 'Habit name must be at least 3 characters';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    const target = parseInt(targetCount);
    if (isNaN(target) || target < 1) {
      newErrors.targetCount = 'Target must be at least 1';
    } else if (target > 100) {
      newErrors.targetCount = 'Target cannot exceed 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await addHabit({
        name: name.trim(),
        description: description.trim(),
        category: category as any,
        frequency: frequency as any,
        targetCount: parseInt(targetCount),
        color: getCategoryColor(category),
        icon: selectedIcon,
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      // Reset form
      setName('');
      setDescription('');
      setCategory('Health');
      setFrequency('Daily');
      setTargetCount('1');
      setSelectedIcon('checkmark-circle');
      setErrors({});

      onClose();
      Alert.alert('Success', 'Habit created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: '90%',
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 24,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                Create New Habit
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 24 }} showsVerticalScrollIndicator={false}>
              {/* Habit Name */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Habit Name *
                </Text>
                <TextInput
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g., Drink 8 glasses of water"
                  placeholderTextColor="#9CA3AF"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 15,
                    color: '#111827',
                    borderWidth: 1,
                    borderColor: errors.name ? '#EF4444' : '#E5E7EB',
                  }}
                />
                {errors.name && (
                  <Text style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors.name}</Text>
                )}
              </View>

              {/* Description */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Description (Optional)
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add more details..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 15,
                    color: '#111827',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    minHeight: 80,
                    textAlignVertical: 'top',
                  }}
                />
              </View>

              {/* Category Selection */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Category *
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 12,
                          borderRadius: 12,
                          backgroundColor: isSelected ? getCategoryColor(cat) : '#F9FAFB',
                          borderWidth: 1,
                          borderColor: isSelected ? getCategoryColor(cat) : '#E5E7EB',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Ionicons
                          name={getCategoryIcon(cat) as any}
                          size={16}
                          color={isSelected ? 'white' : getCategoryColor(cat)}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: isSelected ? 'white' : '#374151',
                            marginLeft: 6,
                          }}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Icon Selection */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Icon
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {ICONS.map((icon) => {
                    const isSelected = selectedIcon === icon;
                    return (
                      <TouchableOpacity
                        key={icon}
                        onPress={() => setSelectedIcon(icon)}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          backgroundColor: isSelected ? getCategoryColor(category) : '#F9FAFB',
                          borderWidth: 1,
                          borderColor: isSelected ? getCategoryColor(category) : '#E5E7EB',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons
                          name={icon as any}
                          size={24}
                          color={isSelected ? 'white' : getCategoryColor(category)}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Frequency */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Frequency
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {FREQUENCIES.map((freq) => {
                    const isSelected = frequency === freq;
                    return (
                      <TouchableOpacity
                        key={freq}
                        onPress={() => setFrequency(freq)}
                        style={{
                          flex: 1,
                          paddingVertical: 12,
                          borderRadius: 12,
                          backgroundColor: isSelected ? '#3B82F6' : '#F9FAFB',
                          borderWidth: 1,
                          borderColor: isSelected ? '#3B82F6' : '#E5E7EB',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: isSelected ? 'white' : '#374151',
                          }}
                        >
                          {freq}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Target Count */}
              <View style={{ marginBottom: 32 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Daily Target *
                </Text>
                <TextInput
                  value={targetCount}
                  onChangeText={(text) => {
                    setTargetCount(text);
                    if (errors.targetCount) setErrors({ ...errors, targetCount: '' });
                  }}
                  placeholder="1"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 15,
                    color: '#111827',
                    borderWidth: 1,
                    borderColor: errors.targetCount ? '#EF4444' : '#E5E7EB',
                  }}
                />
                {errors.targetCount && (
                  <Text style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>
                    {errors.targetCount}
                  </Text>
                )}
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                  Number of times to complete this habit daily
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: '#F9FAFB',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: '#3B82F6',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                    Create Habit
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}