import { useInfiniteSessions } from '@/src/hooks/useSession';
import { useAuthStore } from '@/src/store/useAuthStore';
import { SessionDBType } from '@/src/types/session';
import { FlashList } from '@shopify/flash-list';
import { Dispatch, memo, SetStateAction, useCallback, useMemo } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import SessionReviewCard from './SessionReviewCard';

interface Props {
  setSelectedSession: Dispatch<SetStateAction<SessionDBType | null>>;
  workoutPlanId: string;
  sheetRef: any;
}

const History = ({ setSelectedSession, workoutPlanId, sheetRef }: Props) => {
  const user = useAuthStore((state) => state.user);
  const { height } = useWindowDimensions();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingSessions,
  } = useInfiniteSessions(user?.id, workoutPlanId);
  const sessions = useMemo(() => data?.pages.flat() ?? [], [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: SessionDBType }) => (
      <SessionReviewCard session={item} setSelectedSession={setSelectedSession} sheetRef={sheetRef} />
    ),
    [setSelectedSession, sheetRef]
  );

  if (isLoadingSessions) return <Text>טוען היסטוריית אימונים...</Text>;

  return (
    <View className="pb-24">
      <Text className="typo-body-primary text-white text-left mb-3">{`${sessions.length} אימונים נטענו`}</Text>
      <FlashList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(session, index) => session.id ?? `session-${index}`}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={{ height: Math.max(320, height * 0.52) }}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<Text className="typo-h2 text-white text-left">אין אימונים עדיין</Text>}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-6 items-center">
              <Text className="typo-body text-lime-400">טוען אימונים נוספים...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default memo(History);
