import { colors } from '@/colors';
import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useSessionExerciseLogs } from '@/src/hooks/useSession';
import { Exercise } from '@/src/types/exercise';
import { ExerciseLogDBType, SessionDBType } from '@/src/types/session';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import Loading from '@/src/ui/Loading';
import AppButton from '@/src/ui/PressableOpacity';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import * as Print from 'expo-print';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { FileDown } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

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
  const { data: exerciseLogsData, isLoading: isLoadingExerciseLogs } =
    useSessionExerciseLogs(sessionId);
  const uniqueExerciseIds = useMemo(() => {
    if (!exerciseLogsData) return [];
    return [...new Set(exerciseLogsData.map((log) => log.exercise_id))];
  }, [exerciseLogsData]);
  const { data: exercisesData, isLoading: isLoadingExercises } =
    useGetExercisesByIds(uniqueExerciseIds);
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
    ? format(new Date(session.started_at), 'EEEE, d MMMM yyyy • HH:mm', { locale: he })
    : '';
  const dateForFilename = session?.started_at
    ? format(new Date(session.started_at), 'dd-MM-yyyy')
    : 'אימון';
  const totalSeconds = session?.total_time ?? 0;
  const durationMinutes = Math.floor(totalSeconds / 60);
  const durationSeconds = totalSeconds % 60;
  const durationDisplay = `${durationMinutes} דקות ${durationSeconds} שניות`;
  const fileName = `אימון_${dateForFilename}_${workoutPlanTitle}.pdf`;

  const LOGO_SVG = `<svg width="140" height="92" viewBox="0 0 239 157" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#f0)">
      <path d="M29.1561 116C27.7187 116 27 115.281 27 113.843V3.15679C27 1.71893 27.7187 1 29.1561 1H83.9214C85.2438 1 86.3937 1.46012 87.3712 2.38035L104.62 19.6347C105.54 20.6124 106 21.7627 106 23.0855V41.2026C106 41.7777 105.885 42.2378 105.655 42.5829C105.425 42.928 105.08 43.3306 104.62 43.7907L91.0797 55.8687L89.6135 58.198L91.0797 61.3901L104.62 73.4681C105.08 73.9282 105.425 74.3308 105.655 74.6759C105.885 74.9635 106 75.4236 106 76.0563V93.8282C106 95.2086 105.54 96.3588 104.62 97.2791L87.3712 114.533C86.3937 115.511 85.2438 116 83.9214 116H29.1561ZM66.5 87.3578C68.7999 87.3578 70.6972 86.6389 72.1921 85.2011C73.687 83.7057 74.4345 81.8077 74.4345 79.5071C74.4345 77.149 73.687 75.2511 72.1921 73.8132C70.6972 72.3178 68.7999 71.5701 66.5 71.5701C64.2001 71.5701 62.3028 72.3178 60.8079 73.8132C59.313 75.2511 58.5655 77.149 58.5655 79.5071C58.5655 81.8077 59.313 83.7057 60.8079 85.2011C62.3028 86.6389 64.2001 87.3578 66.5 87.3578ZM66.0688 44.9985C68.2536 44.9985 70.036 44.2796 71.4159 42.8417C72.8533 41.4039 73.5721 39.6209 73.5721 37.4929C73.5721 35.3073 72.8533 33.5244 71.4159 32.144C70.036 30.7062 68.2536 29.9872 66.0688 29.9872C63.9414 29.9872 62.159 30.7062 60.7216 32.144C59.2842 33.5244 58.5655 35.3073 58.5655 37.4929C58.5655 39.6209 59.2842 41.4039 60.7216 42.8417C62.159 44.2796 63.9414 44.9985 66.0688 44.9985Z" fill="#516070"/>
    </g>
    <g filter="url(#f1)">
      <path d="M213.844 115C215.281 115 216 114.281 216 112.843V2.15679C216 0.718931 215.281 0 213.844 0H159.079C157.756 0 156.606 0.46012 155.629 1.38035L138.38 18.6347C137.46 19.6124 137 20.7627 137 22.0855V40.2026C137 40.7777 137.115 41.2378 137.345 41.5829C137.575 41.928 137.92 42.3306 138.38 42.7907L151.92 54.8687L153.386 57.198L151.92 60.3901L138.38 72.4681C137.92 72.9282 137.575 73.3308 137.345 73.6759C137.115 73.9635 137 74.4236 137 75.0563V92.8282C137 94.2086 137.46 95.3588 138.38 96.2791L155.629 113.533C156.606 114.511 157.756 115 159.079 115H213.844ZM176.5 86.3578C174.2 86.3578 172.303 85.6389 170.808 84.2011C169.313 82.7057 168.566 80.8077 168.566 78.5071C168.566 76.149 169.313 74.2511 170.808 72.8132C172.303 71.3178 174.2 70.5701 176.5 70.5701C178.8 70.5701 180.697 71.3178 182.192 72.8132C183.687 74.2511 184.434 76.149 184.434 78.5071C184.434 80.8077 183.687 82.7057 182.192 84.2011C180.697 85.6389 178.8 86.3578 176.5 86.3578ZM176.931 43.9985C174.746 43.9985 172.964 43.2796 171.584 41.8417C170.147 40.4039 169.428 38.6209 169.428 36.4929C169.428 34.3073 170.147 32.5244 171.584 31.144C172.964 29.7062 174.746 28.9872 176.931 28.9872C179.059 28.9872 180.841 29.7062 182.278 31.144C183.716 32.5244 184.434 34.3073 184.434 36.4929C184.434 38.6209 183.716 40.4039 182.278 41.8417C180.841 43.2796 179.059 43.9985 176.931 43.9985Z" fill="#516070"/>
    </g>
    <path d="M104.07 45.5769C103.599 46.7189 103.553 47.7338 103.675 54.4618C103.781 60.3543 103.828 61.0417 104.19 62.0188C104.556 63.0052 104.672 63.1758 105.593 64.0908C107.354 65.8395 106.489 65.7314 120.723 65.9803C135.14 66.2323 134.462 66.2938 136.176 64.5797C137.062 63.6932 137.179 63.5151 137.514 62.5465C137.852 61.5699 137.872 60.9251 137.761 54.5054C137.618 46.1979 137.648 46.3523 135.809 44.513C134.748 43.4517 134.578 43.3298 133.785 43.0611C133.089 42.8254 130.493 42.7284 120.551 42.5667C106.409 42.3366 107.15 42.271 105.405 43.9075C104.56 44.6999 104.296 45.0302 104.07 45.5769Z" fill="#96C828"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M114.765 93.6792L114.58 81.9629C114.477 75.5189 114.417 70.2231 114.446 70.1946C114.474 70.166 117.437 70.1896 121.029 70.2471L127.561 70.3515L127.747 82.1193L127.933 93.8872L121.349 93.7832L114.765 93.6792ZM104.57 109.529C104.452 102.372 104.499 101.747 105.259 100.452C105.414 100.186 105.906 99.6381 106.351 99.234C106.645 98.9675 106.862 98.7522 107.11 98.5794C108.199 97.8196 109.876 97.8834 121.23 98.0436C132.772 98.2065 134.637 98.1859 135.829 99.0792C136.126 99.3016 136.382 99.5807 136.734 99.9333C137.649 100.848 137.772 101.03 138.138 102.01C138.506 102.998 138.547 103.643 138.639 110.063C138.726 116.131 138.763 117.685 138.082 118.776C137.831 119.179 137.482 119.518 137.001 119.998C135.971 121.029 135.807 121.143 135.011 121.393C134.303 121.614 131.862 121.627 121.775 121.463C111.833 121.301 109.236 121.204 108.541 120.969C107.748 120.7 107.578 120.578 106.517 119.517C106.021 119.021 105.66 118.669 105.396 118.258C104.681 117.145 104.67 115.592 104.57 109.529Z" fill="#96C828"/>
    <path d="M7.79102 126.104H20.0225C21.5166 126.104 22.8154 126.266 23.9189 126.588C25.0322 126.9 25.9551 127.335 26.6875 127.892C27.4199 128.448 27.9619 129.112 28.3135 129.884C28.6748 130.646 28.8555 131.471 28.8555 132.359C28.8555 133.814 28.3965 135.089 27.4785 136.183C28.5332 136.808 29.3193 137.618 29.8369 138.614C30.3545 139.61 30.6133 140.743 30.6133 142.013C30.6133 143.077 30.4326 144.039 30.0713 144.898C29.7197 145.758 29.1777 146.495 28.4453 147.11C27.7227 147.716 26.8047 148.185 25.6914 148.517C24.5879 148.839 23.2842 149 21.7803 149H7.79102V126.104ZM21.8096 134.894C22.21 134.894 22.6006 134.908 22.9814 134.938C23.6357 134.312 23.9629 133.6 23.9629 132.799C23.9629 131.969 23.6357 131.329 22.9814 130.88C22.3369 130.421 21.3896 130.191 20.1396 130.191H12.4346V134.894H21.8096ZM21.8975 144.957C23.1475 144.957 24.0947 144.688 24.7393 144.151C25.3936 143.614 25.7207 142.857 25.7207 141.881C25.7207 140.904 25.3936 140.143 24.7393 139.596C24.0947 139.049 23.1475 138.775 21.8975 138.775H12.4346V144.957H21.8975ZM33.748 140.357C33.748 139.117 33.9971 137.955 34.4951 136.871C35.0029 135.787 35.7207 134.84 36.6484 134.029C37.5859 133.219 38.7139 132.579 40.0322 132.11C41.3604 131.642 42.8496 131.407 44.5 131.407C46.1504 131.407 47.6348 131.642 48.9531 132.11C50.2812 132.579 51.4092 133.219 52.3369 134.029C53.2744 134.84 53.9922 135.787 54.4902 136.871C54.998 137.955 55.252 139.117 55.252 140.357C55.252 141.598 54.998 142.76 54.4902 143.844C53.9922 144.928 53.2744 145.875 52.3369 146.686C51.4092 147.496 50.2812 148.136 48.9531 148.604C47.6348 149.073 46.1504 149.308 44.5 149.308C42.8496 149.308 41.3604 149.073 40.0322 148.604C38.7139 148.136 37.5859 147.496 36.6484 146.686C35.7207 145.875 35.0029 144.928 34.4951 143.844C33.9971 142.76 33.748 141.598 33.748 140.357ZM38.3037 140.357C38.3037 141.051 38.4404 141.71 38.7139 142.335C38.9971 142.95 39.4023 143.497 39.9297 143.976C40.4668 144.444 41.1162 144.82 41.8779 145.104C42.6494 145.377 43.5234 145.514 44.5 145.514C45.4766 145.514 46.3457 145.377 47.1074 145.104C47.8789 144.82 48.5283 144.444 49.0557 143.976C49.5928 143.497 49.998 142.95 50.2715 142.335C50.5547 141.71 50.6963 141.051 50.6963 140.357C50.6963 139.664 50.5547 139.005 50.2715 138.38C49.998 137.755 49.5928 137.208 49.0557 136.739C48.5283 136.261 47.8789 135.885 47.1074 135.611C46.3457 135.328 45.4766 135.187 44.5 135.187C43.5234 135.187 42.6494 135.328 41.8779 135.611C41.1162 135.885 40.4668 136.261 39.9297 136.739C39.4023 137.208 38.9971 137.755 38.7139 138.38C38.4404 139.005 38.3037 139.664 38.3037 140.357ZM58.2988 140.431C58.2988 139.054 58.5576 137.813 59.0752 136.71C59.5928 135.597 60.3057 134.649 61.2139 133.868C62.1318 133.077 63.2158 132.472 64.4658 132.052C65.7256 131.622 67.0879 131.407 68.5527 131.407C69.1777 131.407 69.793 131.446 70.3984 131.524C71.0137 131.603 71.5996 131.71 72.1562 131.847C72.7227 131.983 73.25 132.149 73.7383 132.345C74.2363 132.53 74.6758 132.735 75.0566 132.96V124.698H79.3926V149H75.0566V147.374C74.6758 147.638 74.2266 147.887 73.709 148.121C73.1914 148.355 72.6348 148.561 72.0391 148.736C71.4434 148.912 70.8232 149.049 70.1787 149.146C69.5439 149.254 68.9141 149.308 68.2891 149.308C66.8242 149.308 65.4766 149.093 64.2461 148.663C63.0254 148.233 61.9756 147.628 61.0967 146.847C60.2178 146.065 59.5293 145.133 59.0312 144.049C58.543 142.955 58.2988 141.749 58.2988 140.431ZM62.8545 140.431C62.8545 141.124 62.9912 141.778 63.2646 142.394C63.5479 143.009 63.9482 143.551 64.4658 144.02C64.9932 144.479 65.623 144.845 66.3555 145.118C67.0977 145.382 67.9277 145.514 68.8457 145.514C69.4316 145.514 70.0176 145.46 70.6035 145.353C71.1895 145.235 71.751 145.074 72.2881 144.869C72.835 144.664 73.3428 144.415 73.8115 144.122C74.29 143.829 74.7051 143.502 75.0566 143.141V137.149C74.6172 136.798 74.1533 136.5 73.665 136.256C73.1768 136.012 72.6787 135.812 72.1709 135.655C71.6631 135.499 71.1504 135.387 70.6328 135.318C70.1152 135.24 69.6123 135.201 69.124 135.201C68.1279 135.201 67.2393 135.338 66.458 135.611C65.6865 135.875 65.0322 136.241 64.4951 136.71C63.9678 137.179 63.5625 137.73 63.2793 138.365C62.9961 139 62.8545 139.688 62.8545 140.431ZM86.7754 151.168C87.2246 151.461 87.7129 151.72 88.2402 151.944C88.7676 152.169 89.3145 152.354 89.8809 152.501C90.457 152.647 91.043 152.755 91.6387 152.823C92.2344 152.901 92.8252 152.94 93.4111 152.94C95.4033 152.94 96.9365 152.511 98.0107 151.651C99.0947 150.802 99.6367 149.522 99.6367 147.813V147.228C99.2559 147.491 98.8262 147.735 98.3477 147.96C97.8789 148.175 97.3711 148.36 96.8242 148.517C96.2871 148.673 95.7158 148.795 95.1104 148.883C94.5146 148.961 93.9092 149 93.2939 149C91.9756 149 90.7939 148.81 89.749 148.429C88.7139 148.038 87.835 147.472 87.1123 146.729C86.3994 145.978 85.8525 145.055 85.4717 143.961C85.0908 142.867 84.9004 141.617 84.9004 140.211V131.715H89.2217V139.01C89.2217 141.1 89.6172 142.643 90.4082 143.639C91.209 144.625 92.4688 145.118 94.1875 145.118C95.3984 145.118 96.4678 144.908 97.3955 144.488C98.333 144.059 99.0801 143.512 99.6367 142.848V131.715H103.973V147.022C103.973 148.673 103.738 150.104 103.27 151.314C102.801 152.535 102.117 153.546 101.219 154.347C100.33 155.147 99.2363 155.743 97.9375 156.134C96.6387 156.534 95.1641 156.734 93.5137 156.734C91.9023 156.734 90.3984 156.563 89.002 156.222C87.6055 155.88 86.3262 155.416 85.1641 154.83L86.7754 151.168ZM110.125 126.104H122.356C123.851 126.104 125.149 126.266 126.253 126.588C127.366 126.9 128.289 127.335 129.021 127.892C129.754 128.448 130.296 129.112 130.647 129.884C131.009 130.646 131.189 131.471 131.189 132.359C131.189 133.814 130.73 135.089 129.812 136.183C130.867 136.808 131.653 137.618 132.171 138.614C132.688 139.61 132.947 140.743 132.947 142.013C132.947 143.077 132.767 144.039 132.405 144.898C132.054 145.758 131.512 146.495 130.779 147.11C130.057 147.716 129.139 148.185 128.025 148.517C126.922 148.839 125.618 149 124.114 149H110.125V126.104ZM124.144 134.894C124.544 134.894 124.935 134.908 125.315 134.938C125.97 134.312 126.297 133.6 126.297 132.799C126.297 131.969 125.97 131.329 125.315 130.88C124.671 130.421 123.724 130.191 122.474 130.191H114.769V134.894H124.144ZM124.231 144.957C125.481 144.957 126.429 144.688 127.073 144.151C127.728 143.614 128.055 142.857 128.055 141.881C128.055 140.904 127.728 140.143 127.073 139.596C126.429 139.049 125.481 138.775 124.231 138.775H114.769V144.957H124.231ZM137.122 131.7H141.443V140.138C141.443 140.938 141.531 141.671 141.707 142.335C141.883 142.989 142.181 143.551 142.601 144.02C143.03 144.488 143.597 144.854 144.3 145.118C145.013 145.372 145.896 145.499 146.951 145.499C147.449 145.499 147.952 145.445 148.46 145.338C148.978 145.23 149.471 145.084 149.939 144.898C150.408 144.703 150.843 144.474 151.243 144.21C151.653 143.946 152.005 143.658 152.298 143.346V131.7H156.634V149H152.298V147.521C151.233 148.155 150.164 148.609 149.09 148.883C148.016 149.156 146.995 149.293 146.028 149.293C144.446 149.293 143.089 149.103 141.956 148.722C140.833 148.341 139.91 147.789 139.188 147.066C138.475 146.334 137.952 145.44 137.62 144.386C137.288 143.321 137.122 142.11 137.122 140.753V131.7ZM160.809 140.431C160.809 139.054 161.067 137.813 161.585 136.71C162.103 135.597 162.815 134.649 163.724 133.868C164.642 133.077 165.726 132.472 166.976 132.052C168.235 131.622 169.598 131.407 171.062 131.407C171.688 131.407 172.303 131.446 172.908 131.524C173.523 131.603 174.109 131.71 174.666 131.847C175.232 131.983 175.76 132.149 176.248 132.345C176.746 132.53 177.186 132.735 177.566 132.96V124.698H181.902V149H177.566V147.374C177.186 147.638 176.736 147.887 176.219 148.121C175.701 148.355 175.145 148.561 174.549 148.736C173.953 148.912 173.333 149.049 172.688 149.146C172.054 149.254 171.424 149.308 170.799 149.308C169.334 149.308 167.986 149.093 166.756 148.663C165.535 148.233 164.485 147.628 163.606 146.847C162.728 146.065 162.039 145.133 161.541 144.049C161.053 142.955 160.809 141.749 160.809 140.431ZM165.364 140.431C165.364 141.124 165.501 141.778 165.774 142.394C166.058 143.009 166.458 143.551 166.976 144.02C167.503 144.479 168.133 144.845 168.865 145.118C169.607 145.382 170.438 145.514 171.355 145.514C171.941 145.514 172.527 145.46 173.113 145.353C173.699 145.235 174.261 145.074 174.798 144.869C175.345 144.664 175.853 144.415 176.321 144.122C176.8 143.829 177.215 143.502 177.566 143.141V137.149C177.127 136.798 176.663 136.5 176.175 136.256C175.687 136.012 175.188 135.812 174.681 135.655C174.173 135.499 173.66 135.387 173.143 135.318C172.625 135.24 172.122 135.201 171.634 135.201C170.638 135.201 169.749 135.338 168.968 135.611C168.196 135.875 167.542 136.241 167.005 136.71C166.478 137.179 166.072 137.73 165.789 138.365C165.506 139 165.364 139.688 165.364 140.431ZM185.887 140.431C185.887 139.054 186.146 137.813 186.663 136.71C187.181 135.597 187.894 134.649 188.802 133.868C189.72 133.077 190.804 132.472 192.054 132.052C193.313 131.622 194.676 131.407 196.141 131.407C196.766 131.407 197.381 131.446 197.986 131.524C198.602 131.603 199.188 131.71 199.744 131.847C200.311 131.983 200.838 132.149 201.326 132.345C201.824 132.53 202.264 132.735 202.645 132.96V124.698H206.98V149H202.645V147.374C202.264 147.638 201.814 147.887 201.297 148.121C200.779 148.355 200.223 148.561 199.627 148.736C199.031 148.912 198.411 149.049 197.767 149.146C197.132 149.254 196.502 149.308 195.877 149.308C194.412 149.308 193.064 149.093 191.834 148.663C190.613 148.233 189.563 147.628 188.685 146.847C187.806 146.065 187.117 145.133 186.619 144.049C186.131 142.955 185.887 141.749 185.887 140.431ZM190.442 140.431C190.442 141.124 190.579 141.778 190.853 142.394C191.136 143.009 191.536 143.551 192.054 144.02C192.581 144.479 193.211 144.845 193.943 145.118C194.686 145.382 195.516 145.514 196.434 145.514C197.02 145.514 197.605 145.46 198.191 145.353C198.777 145.235 199.339 145.074 199.876 144.869C200.423 144.664 200.931 144.415 201.399 144.122C201.878 143.829 202.293 143.502 202.645 143.141V137.149C202.205 136.798 201.741 136.5 201.253 136.256C200.765 136.012 200.267 135.812 199.759 135.655C199.251 135.499 198.738 135.387 198.221 135.318C197.703 135.24 197.2 135.201 196.712 135.201C195.716 135.201 194.827 135.338 194.046 135.611C193.274 135.875 192.62 136.241 192.083 136.71C191.556 137.179 191.15 137.73 190.867 138.365C190.584 139 190.442 139.688 190.442 140.431ZM214.363 151.168C214.812 151.461 215.301 151.72 215.828 151.944C216.355 152.169 216.902 152.354 217.469 152.501C218.045 152.647 218.631 152.755 219.227 152.823C219.822 152.901 220.413 152.94 220.999 152.94C222.991 152.94 224.524 152.511 225.599 151.651C226.683 150.802 227.225 149.522 227.225 147.813V147.228C226.844 147.491 226.414 147.735 225.936 147.96C225.467 148.175 224.959 148.36 224.412 148.517C223.875 148.673 223.304 148.795 222.698 148.883C222.103 148.961 221.497 149 220.882 149C219.563 149 218.382 148.81 217.337 148.429C216.302 148.038 215.423 147.472 214.7 146.729C213.987 145.978 213.44 145.055 213.06 143.961C212.679 142.867 212.488 141.617 212.488 140.211V131.715H216.81V139.01C216.81 141.1 217.205 142.643 217.996 143.639C218.797 144.625 220.057 145.118 221.775 145.118C222.986 145.118 224.056 144.908 224.983 144.488C225.921 144.059 226.668 143.512 227.225 142.848V131.715H231.561V147.022C231.561 148.673 231.326 150.104 230.857 151.314C230.389 152.535 229.705 153.546 228.807 154.347C227.918 155.147 226.824 155.743 225.525 156.134C224.227 156.534 222.752 156.734 221.102 156.734C219.49 156.734 217.986 156.563 216.59 156.222C215.193 155.88 213.914 155.416 212.752 154.83L214.363 151.168Z" fill="#96C828"/>
    <defs>
      <filter id="f0" x="23" y="1" width="87" height="123" filterUnits="userSpaceOnUse">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/><feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
      <filter id="f1" x="133" y="0" width="87" height="123" filterUnits="userSpaceOnUse">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/><feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
    </defs>
  </svg>`;

  const buildHTML = () => {
    const exercisesHTML = groupedExercises
      .map((group) => {
        const exerciseInfo = exercisesData?.find(
          (ex: Exercise) => ex.exerciseId === group.exercise_id
        );
        const validSets = group.sets.filter((s) => !(s.weight === 0 && s.reps === 0));
        const setsHTML =
          validSets.length > 0
            ? validSets
                .map(
                  (s) => `
            <tr>
              <td class="set-num">${s.set_number}</td>
              <td class="value">${s.weight} ק"ג</td>
              <td class="value">${s.reps}</td>
            </tr>`
                )
                .join('')
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
      })
      .join('');

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
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .header-text h1 { color: rgb(150,200,40); font-size: 26px; margin: 0 0 6px; letter-spacing: -0.5px; }
          .header-text .plan-name { color: #e5e7eb; font-size: 15px; margin: 6px 0 0; font-weight: 600; }
          .header-text .subtitle { color: #9ca3af; font-size: 13px; margin-top: 6px; }
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
          <div class="header-text">
            <h1>⚡ סיכום אימון</h1>
            <div class="plan-name">${workoutPlanTitle}</div>
            <div class="subtitle">${dateStr} &nbsp;•&nbsp; משך: ${durationDisplay}</div>
          </div>
          ${LOGO_SVG}
        </div>
        <div class="content">
          ${notesHTML}
          ${exercisesHTML}
        </div>
        <div class="footer">נוצר על ידי <span class="brand">BodyBuddy</span></div>
      </body>
      </html>`;
  };

  const previewPDF = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await Print.printAsync({ html: buildHTML() });
    } catch (e) {
      console.error('Preview error:', e);
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, buildHTML]);

  const exportPDF = useCallback(async () => {
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
  }, [isExporting, buildHTML, fileName]);

  const handleNavigateToExercise = useCallback(
    (exerciseId: string) => {
      router.push({ pathname: '/exercise/[exerciseId]', params: { exerciseId } });
    },
    [router]
  );

  if (isLoadingExerciseLogs) return <Loading />;

  return (
    <View className="mt-4 pb-10 px-2">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row gap-2">
          {/* <TouchableOpacity
            onPress={previewPDF}
            disabled={isExporting}
            className="flex-row items-center gap-1.5 bg-background-800 px-3 py-2 rounded-xl border border-gray-700"
            accessibilityRole="button"
            accessibilityLabel="תצוגה מקדימה של PDF"
          >
            <Eye size={15} color={colors.background[400]} />
            <Text className="typo-label text-gray-400">תצוגה מקדימה</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={exportPDF}
            disabled={isExporting}
            className="flex-row items-center gap-1.5 bg-lime-500/10 px-3 py-2 rounded-xl border border-lime-500/30"
            accessibilityRole="button"
            accessibilityLabel="שמור PDF"
          >
            {isExporting ? (
              <ActivityIndicator size="small" color={colors.lime[500]} />
            ) : (
              <FileDown size={15} color={colors.lime[500]} />
            )}
            <Text className="typo-label text-lime-500">שמור PDF</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-white text-xl font-bold text-right">סיכום אימון</Text>
      </View>

      {groupedExercises.map((group) => {
        const exerciseInfo = exercisesData?.find(
          (ex: Exercise) => ex.exerciseId === group.exercise_id
        );
        const validSets = group.sets.filter((set) => !(set.weight === 0 && set.reps === 0));
        const hasValidSets = validSets.length > 0;
        return (
          <View
            key={group.exercise_id}
            className="mb-6 bg-background-850 rounded-2xl border border-gray-800 overflow-hidden shadow-sm"
          >
            <AppButton
              onPress={() => handleNavigateToExercise(group.exercise_id)}
              animationType="opacity"
              haptic="medium"
              accessibilityLabel={`הצג תרגיל: ${isLoadingExercises ? '' : (exerciseInfo?.name_he ?? '')}`}
            >
              <View className="flex-row items-center justify-between bg-background-800 px-4 py-3 border-b border-gray-800">
                <View className="bg-white/10 rounded-lg overflow-hidden border border-gray-700">
                  {isLoadingExercises ? (
                    <Loading size="small" />
                  ) : exerciseInfo?.gif_available === false ? (
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
                  <Text className="text-gray-400 text-xs text-right font-bold uppercase tracking-widest">
                    תרגיל
                  </Text>
                  <Text className="text-lime-500 font-bold text-right text-lg leading-6">
                    {isLoadingExercises ? 'טוען...' : exerciseInfo?.name_he}
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
                      <Text className="text-white w-1/3 text-center font-black text-base">
                        {set.reps}
                      </Text>
                      <Text className="text-white w-1/3 text-center font-black text-base">
                        {set.weight}kg
                      </Text>
                      <Text className="text-gray-400 w-1/3 text-center text-sm">
                        {set.set_number}
                      </Text>
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
