import { colors } from "@/colors";
import { useGetExercisesByIds } from "@/src/hooks/useEcercises";
import { useSessionExerciseLogs } from "@/src/hooks/useSession";
import { Exercise } from "@/src/types/exercise";
import { ExerciseLogDBType, SessionDBType } from "@/src/types/session";
import Loading from "@/src/ui/Loading";
import DumbbellAnimation from "@/src/ui/Animations/DumbbellAnimation";
import AppButton from "@/src/ui/PressableOpacity";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import { Eye, FileDown } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface Props {
  sessionId: string;
  session: SessionDBType | null;
  workoutPlanTitle: string;
}

interface GroupedExercise {
  exercise_id: string;
  sets: ExerciseLogDBType[];
}

const SessionInformation = ({ sessionId, session, workoutPlanTitle }: Props) => {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const { data: exerciseLogsData, isLoading: isLoadingExerciseLogs } = useSessionExerciseLogs(sessionId);
  const uniqueExerciseIds = useMemo(() => {
    if (!exerciseLogsData) return [];
    return [...new Set(exerciseLogsData.map(log => log.exercise_id))];
  }, [exerciseLogsData]);
  const { data: exercisesData, isLoading: isLoadingExercises } = useGetExercisesByIds(uniqueExerciseIds);
  const groupedExercises = useMemo(() => {
    if (!exerciseLogsData) return [];
    const grouped = exerciseLogsData.reduce((acc: Record<string, GroupedExercise>, log) => {
      const exerciseId = log.exercise_id;
      if (!acc[exerciseId]) {
        acc[exerciseId] = { exercise_id: exerciseId, sets: [] };
      }
      acc[exerciseId].sets.push(log);
      return acc;
    }, {});
    return Object.values(grouped);
  }, [exerciseLogsData]);

  const dateStr = session?.started_at
    ? format(new Date(session.started_at), "EEEE, d MMMM yyyy • HH:mm", { locale: he })
    : '';
  const dateForFilename = session?.started_at
    ? format(new Date(session.started_at), "dd-MM-yyyy")
    : 'אימון';
  const duration = session?.total_time ?? 0;
  const fileName = `אימון_${dateForFilename}_${workoutPlanTitle}.pdf`;

  const buildHTML = () => {
    const exercisesHTML = groupedExercises.map((group) => {
      const exerciseInfo = exercisesData?.find((ex: Exercise) => ex.exerciseId === group.exercise_id);
      const validSets = group.sets.filter((s) => !(s.weight === 0 && s.reps === 0));
      const setsHTML = validSets.length > 0
        ? validSets.map((s) => `
            <tr>
              <td class="set-num">${s.set_number}</td>
              <td class="value">${s.weight} ק"ג</td>
              <td class="value">${s.reps}</td>
            </tr>`).join('')
        : `<tr><td colspan="3" style="color:#4b5563;font-style:italic;padding:14px;">לא בוצעו חזרות</td></tr>`;

      return `
        <div class="exercise">
          <div class="exercise-header">
            <div class="exercise-name">${exerciseInfo?.name_he ?? 'תרגיל לא ידוע'}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>סט</th>
                <th>משקל</th>
                <th>חזרות</th>
              </tr>
            </thead>
            <tbody>${setsHTML}</tbody>
          </table>
        </div>`;
    }).join('');

    const notesHTML = session?.notes
      ? `<div class="notes">
           <div class="notes-title">הערות</div>
           <div class="notes-text">${session.notes}</div>
         </div>`
      : '';

    return `
      <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <style>
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
          @page { margin: 0; size: A4; }
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            direction: rtl;
            margin: 0; padding: 0;
          }
          .header {
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 60%, #1c2a0c 100%);
            padding: 32px;
            border-bottom: 2px solid rgb(150,200,40);
          }
          .header h1 { color: rgb(150,200,40); font-size: 26px; margin: 0 0 6px; letter-spacing: -0.5px; }
          .header .plan-name { color: #e5e7eb; font-size: 15px; margin: 6px 0 0; font-weight: 600; }
          .header .subtitle { color: #9ca3af; font-size: 13px; margin-top: 6px; }
          .content { padding: 24px 32px; }
          .exercise { margin-bottom: 20px; border: 1px solid #2a2a2a; border-radius: 10px; overflow: hidden; background: #141414; }
          .exercise-header {
            background: linear-gradient(90deg, #1c2a0c 0%, #141414 100%);
            border-bottom: 1px solid #2a2a2a;
            padding: 12px 16px;
          }
          .exercise-name { color: rgb(150,200,40); font-size: 16px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #1a1a1a; color: #6b7280; padding: 10px; font-size: 11px; letter-spacing: 0.5px; text-align: center; text-transform: uppercase; }
          td { padding: 10px; text-align: center; font-size: 14px; color: #e5e7eb; border-bottom: 1px solid #1f1f1f; }
          td.set-num { color: #6b7280; font-size: 12px; }
          td.value { color: rgb(150,200,40); font-weight: bold; }
          tr:last-child td { border-bottom: none; }
          .notes { background: #141414; border: 1px solid #2a2a2a; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
          .notes-title { color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
          .notes-text { color: #e5e7eb; font-size: 14px; line-height: 1.6; }
          .footer { margin: 8px 32px 32px; padding: 16px 0; border-top: 1px solid #2a2a2a; text-align: center; color: #4b5563; font-size: 11px; }
          .footer .brand { color: rgb(150,200,40); font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⚡ סיכום אימון</h1>
          <div class="plan-name">${workoutPlanTitle}</div>
          <div class="subtitle">${dateStr} &nbsp;•&nbsp; משך: ${duration} דקות</div>
        </div>
        <div class="content">
          ${notesHTML}
          ${exercisesHTML}
        </div>
        <div class="footer">נוצר על ידי <span class="brand">BodyBuddy</span></div>
      </body>
      </html>`;
  };

  const previewPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await Print.printAsync({ html: buildHTML() });
    } catch (e) {
      console.error('Preview error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const exportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const { uri } = await Print.printToFileAsync({ html: buildHTML() });
      const dest = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({ from: uri, to: dest });
      await Sharing.shareAsync(dest, { mimeType: 'application/pdf', UTI: '.pdf' });
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoadingExerciseLogs) return <Loading />;

  return (
    <View className="mt-4 pb-10 px-2">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={previewPDF}
            disabled={isExporting}
            className="flex-row items-center gap-1.5 bg-background-800 px-3 py-2 rounded-xl border border-gray-700"
          >
            <Eye size={15} color={colors.background[400]} />
            <Text className="text-gray-400 font-bold text-sm">תצוגה מקדימה</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={exportPDF}
            disabled={isExporting}
            className="flex-row items-center gap-1.5 bg-lime-500/10 px-3 py-2 rounded-xl border border-lime-500/30"
          >
            {isExporting
              ? <ActivityIndicator size="small" color={colors.lime[500]} />
              : <FileDown size={15} color={colors.lime[500]} />}
            <Text className="text-lime-500 font-bold text-sm">שמור PDF</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-white text-xl font-bold text-right">סיכום אימון</Text>
      </View>

      {groupedExercises.map((group) => {
        const exerciseInfo = exercisesData?.find((ex: Exercise) => ex.exerciseId === group.exercise_id);
        const validSets = group.sets.filter(set => !(set.weight === 0 && set.reps === 0));
        const hasValidSets = validSets.length > 0;
        return (
          <View key={group.exercise_id} className="mb-6 bg-background-850 rounded-2xl border border-gray-800 overflow-hidden shadow-sm">
            <AppButton
              onPress={() => router.push({
                pathname: '/exercise/[exerciseId]',
                params: { exerciseId: group.exercise_id },
              })}
              animationType="opacity"
              haptic="medium"
            >
              <View className="flex-row items-center justify-between bg-background-800 px-4 py-3 border-b border-gray-800">
                <View className="bg-white/10 rounded-lg overflow-hidden border border-gray-700">
                  {isLoadingExercises ? <Loading size="small" /> : exerciseInfo?.gif_available === false ? (
                    <DumbbellAnimation size={48} />
                  ) : exerciseInfo?.gifUrl ? (
                    <Image
                      source={{ uri: exerciseInfo.gifUrl }}
                      style={{ width: 48, height: 48 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={{ width: 48, height: 48 }} className="bg-gray-800" />
                  )}
                </View>
                <View className="flex-1 pr-3">
                  <Text className="text-gray-400 text-[10px] text-right font-bold uppercase tracking-widest">תרגיל</Text>
                  <Text className="text-lime-500 font-bold text-right text-lg leading-6">
                    {isLoadingExercises ? "טוען..." : exerciseInfo?.name_he}
                  </Text>
                </View>
              </View>
            </AppButton>
            {hasValidSets ? (
              <>
                <View className="flex-row justify-between px-4 py-2 bg-background-900/50">
                  <Text className="text-gray-500 w-1/3 text-center text-xs font-bold">חזרות</Text>
                  <Text className="text-gray-500 w-1/3 text-center text-xs font-bold">משקל</Text>
                  <Text className="text-gray-500 w-1/3 text-center text-xs font-bold">סט</Text>
                </View>
                <View className="px-2 pb-2">
                  {group.sets.map((set, index) => (
                    <View
                      key={set.id}
                      className={`flex-row justify-between py-3 ${index !== group.sets.length - 1 ? 'border-b border-gray-800/50' : ''}`}
                    >
                      <Text className="text-white w-1/3 text-center font-black text-base">{set.reps}</Text>
                      <Text className="text-white w-1/3 text-center font-black text-base">{set.weight}kg</Text>
                      <Text className="text-gray-400 w-1/3 text-center text-sm">{set.set_number}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View className="py-6 items-center justify-center">
                <Text className="text-gray-500 text-sm italic">לא בוצעו חזרות לתרגיל זה</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default SessionInformation;
