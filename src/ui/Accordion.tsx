import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '@/colors';

// הפעלת אנימציות באנדרואיד
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: React.ReactNode; // יכול לקבל טקסט או JSX (למשל טקסט + מיני גרף)
  children: React.ReactNode; // התוכן שייחשף
  defaultOpen?: boolean;
}

const Accordion = ({ title, children, defaultOpen = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    // אנימציה חלקה של הפתיחה
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View 
      className={`mb-4 overflow-hidden rounded-3xl border ${
        isOpen ? 'border-lime-500/50 bg-background-800' : 'border-gray-800 bg-background-850'
      }`}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleAccordion}
        className="flex-row items-center justify-between p-4"
      >
        {/* כותרת - יכולה להיות מורכבת מ-JSX */}
        <View className="flex-1 mr-4">{title}</View>

        {/* חץ עם סיבוב לפי המצב */}
        <View 
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
          className="bg-gray-800 p-1 rounded-full"
        >
          <ChevronDown size={20} color={isOpen ? colors.lime[500] : colors.background[850]} />
        </View>
      </TouchableOpacity>

      {/* תוכן נפתח */}
      {isOpen && (
        <View className="p-4 pt-0 border-t border-gray-800/50">
          {children}
        </View>
      )}
    </View>
  );
};

export default Accordion;