import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, PanResponder, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryColor } from '../utils/habitUtils';
import ProgressRing from './ProgressRing';

interface Props {
  habit: any;
  onPress: () => void;
  onComplete: () => void;
  onDelete?: () => void;
}

export default function HabitCard({ habit, onPress, onComplete, onDelete }: Props) {
  const isCompleted = habit.todayCount >= habit.targetCount;
  const percentage = habit.completionPercentage;
  const translateX = useRef(new Animated.Value(0)).current;
  const fireScale = useRef(new Animated.Value(1)).current;

  // Animate fire icon when there's a streak
  useEffect(() => {
    if (habit.streak > 0) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(fireScale, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(fireScale, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [habit.streak, fireScale]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          // Swipe right to complete
          translateX.setValue(Math.min(gestureState.dx, 100));
        } else if (gestureState.dx < 0 && onDelete) {
          // Swipe left to delete
          translateX.setValue(Math.max(gestureState.dx, -100));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 80) {
          // Complete action
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          onComplete();
        } else if (gestureState.dx < -80 && onDelete) {
          // Delete action
          Animated.timing(translateX, {
            toValue: -300,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
          });
        } else {
          // Reset
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={{ marginBottom: 12 }}>
      {/* Background Actions */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: getCategoryColor(habit.category),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="checkmark" size={32} color="white" />
        </View>
        {onDelete && (
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: '#EF4444',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="trash" size={28} color="white" />
          </View>
        )}
      </View>

      {/* Main Card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX }],
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          borderLeftWidth: 4,
          borderLeftColor: getCategoryColor(habit.category),
        }}
      >
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Icon */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: `${getCategoryColor(habit.category)}20`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons
                name={habit.icon as any}
                size={24}
                color={getCategoryColor(habit.category)}
              />
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: 4,
                }}
              >
                {habit.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Animated.View style={{ transform: [{ scale: fireScale }] }}>
                  <Ionicons name="flame" size={14} color="#F59E0B" />
                </Animated.View>
                <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
                  {habit.streak} day{habit.streak !== 1 ? 's' : ''} streak
                </Text>
              </View>
            </View>

            {/* Progress Ring */}
            <View style={{ marginLeft: 8 }}>
              <ProgressRing
                size={60}
                strokeWidth={6}
                progress={percentage}
                color={getCategoryColor(habit.category)}
                showPercentage={false}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isCompleted ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={getCategoryColor(habit.category)}
                  />
                ) : (
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#111827' }}>
                    {habit.todayCount}/{habit.targetCount}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Category Badge */}
          <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: `${getCategoryColor(habit.category)}15`,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: getCategoryColor(habit.category),
                }}
              >
                {habit.category}
              </Text>
            </View>
            <Text style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 8 }}>
              Swipe right to complete, left to delete
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}