import AddCustomExerciseModal from '@/src/Features/exercises/AddCustomExerciseModal';
import { useDeleteCustomExercise, useUserCustomExercisesRaw } from '@/src/hooks/useEcercises';
import { partsBodyHebrew } from '@/src/types/bodtPart';
import { UserCustomExercise } from '@/src/types/customExercise';
import ActionButton from '@/src/ui/ActionButton';
import DeleteConfirmModal from '@/src/ui/DeleteConfirmModal';
import ModalBottom from '@/src/ui/ModalButtom';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

// Trigger — rendered inline in a scrollable screen (e.g. inside ProfileScreen's ScrollView).
interface MyCustomExercisesTriggerProps {
  userId: string;
  onPress: () => void;
}

export const MyCustomExercisesTrigger = ({ userId, onPress }: MyCustomExercisesTriggerProps) => {
  const { data: customExercises = [] } = useUserCustomExercisesRaw(userId);

  return (
    <Pressable
      onPress={onPress}
      className="bg-background-800 border border-white/5 rounded-[30px] px-2 py-4 flex-row items-center gap-5"
      accessibilityRole="button"
      accessibilityLabel="פתח את רשימת התרגילים שהוספתי"
      accessibilityHint="פותח כרטיסייה עם התרגילים המותאמים אישית שלך"
    >
      <View className="bg-lime-500 p-3 rounded-2xl ml-4 shadow-lg shadow-lime-500/20">
        <Ionicons name="barbell" size={24} color="black" />
      </View>
      <View className="flex-1 items-start">
        <Text className="typo-caption-bold text-white/30 uppercase tracking-widest text-right">
          תרגילים אישיים
        </Text>
        <Text className="typo-h4 text-white text-right leading-tight">
          {customExercises.length > 0 ? `${customExercises.length} תרגילים שהוספתי` : 'התרגילים שהוספתי'}
        </Text>
      </View>
      <Ionicons name="chevron-back" size={20} color="#71717a" />
    </Pressable>
  );
};

// Sheet — must be rendered OUTSIDE any ScrollView (a top-level sibling), same as every
// other ModalBottom in this app (see ExercisesScreen.tsx) — a BottomSheet nested inside a
// ScrollView gets clipped by the scroll container instead of overlaying the screen.
interface MyCustomExercisesSheetProps {
  userId: string;
  visible: boolean;
  onClose: () => void;
}

export const MyCustomExercisesSheet = ({ userId, visible, onClose }: MyCustomExercisesSheetProps) => {
  const sheetRef = useRef<BottomSheet>(null);
  const { data: customExercises = [] } = useUserCustomExercisesRaw(userId);
  const { mutate: deleteCustomExercise, isPending: isDeleting } = useDeleteCustomExercise(userId);

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<UserCustomExercise | null>(null);
  const [exerciseToDelete, setExerciseToDelete] = useState<UserCustomExercise | null>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const handleAddNew = useCallback(() => {
    setExerciseToEdit(null);
    setShowAddExercise(true);
  }, []);

  const handleEdit = useCallback((exercise: UserCustomExercise) => {
    setExerciseToEdit(exercise);
    setShowAddExercise(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddExercise(false);
    setExerciseToEdit(null);
  }, []);

  const handleCancelDelete = useCallback(() => setExerciseToDelete(null), []);

  const handleConfirmDelete = useCallback(() => {
    if (!exerciseToDelete) return;
    const id = exerciseToDelete.id;
    setExerciseToDelete(null);
    deleteCustomExercise(id);
  }, [exerciseToDelete, deleteCustomExercise]);

  return (
    <>
      <ModalBottom
        ref={sheetRef}
        initialIndex={-1}
        enablePanDownToClose
        minHeight="60%"
        maxHeight="85%"
        title="התרגילים שהוספתי"
        onChange={(isOpen) => !isOpen && onClose()}
        onClosePress={() => sheetRef.current?.close()}
      >
        <View className="gap-3 pb-6">
          <ActionButton
            onPress={handleAddNew}
            label="הוסף תרגיל חדש"
            iconName="add-circle-outline"
            variant="secondary"
            size="sm"
            fullWidth
            accessibilityLabel="הוסף תרגיל מותאם אישית חדש"
          />

          {customExercises.length === 0 ? (
            <View className="bg-background-900 border border-white/5 rounded-3xl p-5 items-center mt-2">
              <Text className="typo-label text-background-400 text-center">
                עדיין לא הוספת תרגילים משלך. אפשר להוסיף תרגיל חסר גם ישירות ממסך בחירת התרגילים.
              </Text>
            </View>
          ) : (
            customExercises.map((exercise) => (
              <CustomExerciseRow
                key={exercise.id}
                exercise={exercise}
                onEdit={handleEdit}
                onDelete={setExerciseToDelete}
              />
            ))
          )}
        </View>
      </ModalBottom>

      <AddCustomExerciseModal
        visible={showAddExercise}
        onClose={handleCloseModal}
        exerciseToEdit={exerciseToEdit}
      />

      <DeleteConfirmModal
        visible={exerciseToDelete !== null}
        title="מחיקת תרגיל"
        message={`האם למחוק את "${exerciseToDelete?.name}" מהרשימה שלך?`}
        infoNote="מחיקת התרגיל לא תשפיע על תוכניות אימון או סשנים שכבר משתמשים בו"
        isDeleting={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

const CustomExerciseRow = ({
  exercise,
  onEdit,
  onDelete,
}: {
  exercise: UserCustomExercise;
  onEdit: (exercise: UserCustomExercise) => void;
  onDelete: (exercise: UserCustomExercise) => void;
}) => {
  const handleEdit = useCallback(() => onEdit(exercise), [onEdit, exercise]);
  const handleDelete = useCallback(() => onDelete(exercise), [onDelete, exercise]);

  return (
    <View className="bg-background-900 border border-white/5 rounded-2xl px-4 py-3 flex-row items-center justify-between">
      <View className="flex-1 items-start">
        <Text className="typo-body-primary text-white text-right" numberOfLines={1}>
          {exercise.name}
        </Text>
        <Text className="typo-caption text-background-400 text-right mt-0.5">
          {partsBodyHebrew[exercise.body_part]}
        </Text>
        <Text className="typo-caption text-background-400/70 text-right mt-0.5">
          {`נוצר ב-${format(new Date(exercise.created_at), 'dd/MM/yyyy')}`}
        </Text>
      </View>
      <View className="flex-row items-center gap-2 mr-2">
        <Pressable
          onPress={handleEdit}
          hitSlop={8}
          className="bg-white/5 rounded-xl p-2"
          accessibilityRole="button"
          accessibilityLabel={`ערוך את ${exercise.name}`}
        >
          <Ionicons name="pencil-outline" size={16} color="#a1a1aa" />
        </Pressable>
        <Pressable
          onPress={handleDelete}
          hitSlop={8}
          className="bg-red-500/10 rounded-xl p-2"
          accessibilityRole="button"
          accessibilityLabel={`מחק את ${exercise.name}`}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
};
