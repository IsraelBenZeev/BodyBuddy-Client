import { colors } from '@/colors';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Modal, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'react-native-svg';
import { TimerPicker } from 'react-native-timer-picker';
import ButtonLabelTime from './ButtonLabelTime';

type time = {
    hours: number;
    minutes: number;
}

interface Props {
    control: Control<any>;
    name: string;
    isPendingCreate: boolean;
}

const TimeInput = ({ control, name, isPendingCreate }: Props) => {
    const [visible, setVisible] = useState(false);
    const [tempTime, setTempTime] = useState<time>({ hours: 0, minutes: 0 });
    // פונקציה לפתיחת המודאל שבודקת חסימה
    const handleOpen = () => {
        if (isPendingCreate) return;
        setVisible(true);
    };
    return (
        <Controller
            control={control}
            name={name}
            disabled={isPendingCreate}
            
            rules={{
                validate: {
                    required: (value) => value > 0 || 'חובה להזין זמן',
                },
            }}
            defaultValue={0}
            render={({ field: { onChange, value }, fieldState: { error } }) => {

                const handleConfirm = () => {
                    const totalMins = (tempTime.hours * 60) + tempTime.minutes;
                    onChange(totalMins);
                    setVisible(false);
                };

                const handleCancel = () => {
                    setVisible(false);
                };

                return (
                    <View className='flex-1'>
                        <ButtonLabelTime
                            totalMinutes={value}
                            setVisible={handleOpen}
                            isPendingCreate={isPendingCreate}
                        />

                        <Modal visible={visible} animationType="slide" transparent={true}>
                            <View className='flex-1 justify-end bg-black/70'>
                                <View className='bg-background-800 p-4 rounded-t-2xl'>

                                    <View className="flex-row justify-between mb-4 px-3">
                                        <Pressable onPress={handleCancel}>
                                            <Text className="text-red-600 text-lg">ביטול</Text>
                                        </Pressable>
                                        <Pressable onPress={handleConfirm}>
                                            <Text className="text-lime-500 text-lg font-bold">אישור</Text>
                                        </Pressable>
                                    </View>

                                    <TimerPicker
                                        hideSeconds
                                        hourLabel="HR"
                                        minuteLabel="MIN"
                                        // מעדכן רק את הסטייט המקומי של המודאל בזמן הגלילה
                                        onDurationChange={(duration) => setTempTime(duration)}
                                        padHoursWithZero={true}
                                        padMinutesWithZero={true}
                                        minuteInterval={5}
                                        LinearGradient={LinearGradient}
                                        pickerFeedback={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                        initialValue={{
                                            hours: Math.floor(value / 60),
                                            minutes: value % 60
                                        }}

                                        styles={{
                                            pickerContainer: {
                                                backgroundColor: colors.background[700],
                                                borderRadius: 20,
                                                padding: 10,
                                                borderWidth: 1,
                                                borderColor: colors.lime[500],
                                            },
                                            pickerItem: {
                                                fontSize: 34,
                                                color: "#FFFFFF",
                                                fontWeight: "300",
                                            },
                                            pickerLabel: {
                                                fontSize: 16,
                                                fontWeight: "800",
                                                color: colors.lime[500],
                                                marginTop: 0,
                                            },
                                            pickerLabelContainer: {
                                                right: -10,
                                            },
                                        }}
                                    />
                                </View>
                            </View>
                        </Modal>
                        {error && <Text className="text-red-500 text-right">{error.message}</Text>}
                    </View>
                );
            }}
        />
    );
};

export default TimeInput;