import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface CompletionCalendarProps {
  completions: Array<{ completedAt: string }>;
  color: string;
}

export default function CompletionCalendar({ completions, color }: CompletionCalendarProps) {
  // Get last 42 days (6 weeks)
  const today = new Date();
  const days: Array<{ date: Date; count: number }> = [];

  for (let i = 41; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Count completions for this day
    const count = completions.filter(c => {
      const completedDate = new Date(c.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === date.getTime();
    }).length;

    days.push({ date, count });
  }

  // Group by weeks
  const weeks: Array<Array<{ date: Date; count: number }>> = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getOpacity = (count: number) => {
    if (count === 0) return 0.1;
    if (count === 1) return 0.4;
    if (count === 2) return 0.7;
    return 1.0;
  };

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <View>
      {/* Month labels */}
      <View style={{ flexDirection: 'row', marginBottom: 8, paddingLeft: 20 }}>
        {weeks.map((week, weekIndex) => {
          const firstDay = week[0];
          const showMonth = weekIndex === 0 || firstDay.date.getDate() <= 7;
          return (
            <View key={weekIndex} style={{ width: 32, marginRight: 4 }}>
              {showMonth && (
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '600' }}>
                  {monthNames[firstDay.date.getMonth()]}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Calendar grid */}
      <View style={{ flexDirection: 'row' }}>
        {/* Day labels */}
        <View style={{ marginRight: 8 }}>
          {dayNames.map((day, index) => (
            <View
              key={index}
              style={{
                height: 28,
                justifyContent: 'center',
                marginBottom: 4,
              }}
            >
              <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '600' }}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Weeks */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={{ marginRight: 4 }}>
                {week.map((day, dayIndex) => (
                  <View
                    key={dayIndex}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      backgroundColor: color,
                      opacity: getOpacity(day.count),
                      marginBottom: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {day.count > 0 && (
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'white' }}>
                        {day.count}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, justifyContent: 'center' }}>
        <Text style={{ fontSize: 11, color: '#6B7280', marginRight: 8 }}>Less</Text>
        {[0, 1, 2, 3].map((level) => (
          <View
            key={level}
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: color,
              opacity: getOpacity(level),
              marginRight: 4,
            }}
          />
        ))}
        <Text style={{ fontSize: 11, color: '#6B7280', marginLeft: 4 }}>More</Text>
      </View>
    </View>
  );
}