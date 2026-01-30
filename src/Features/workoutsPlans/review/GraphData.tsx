import { colors } from "@/colors";
import { ExerciseLogDBType } from "@/src/types/session";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface Props {
    logs: ExerciseLogDBType[];
}

type GraphType = "weight" | "reps" | "sets";

const GraphData = ({ logs }: Props) => {
    const [activeTab, setActiveTab] = useState<GraphType>("weight");

    // עיבוד נתונים למשקלים - מקסימום משקל לכל session
    const weightData = useMemo(() => {
        if (!logs || logs.length === 0) return [];

        const sessionData: Record<string, number> = {};
        logs.forEach((log) => {
            const sessionId = log.session_id;
            if (!sessionData[sessionId] || log.weight > sessionData[sessionId]) {
                sessionData[sessionId] = log.weight;
            }
        });

        const sortedSessions = Object.entries(sessionData)
            .sort((a, b) => {
                // מיון לפי created_at אם יש, אחרת לפי session_id
                const logA = logs.find((l) => l.session_id === a[0]);
                const logB = logs.find((l) => l.session_id === b[0]);
                if (logA?.created_at && logB?.created_at) {
                    return new Date(logA.created_at).getTime() - new Date(logB.created_at).getTime();
                }
                return a[0].localeCompare(b[0]);
            })
            .map(([, weight]) => weight);

        return sortedSessions.map((weight, index) => ({
            value: weight,
            dataPointText: `${weight}`,
            label: `${index + 1}`,
        }));
    }, [logs]);

    // עיבוד נתונים לחזרות - מקסימום חזרות לכל session
    const repsData = useMemo(() => {
        if (!logs || logs.length === 0) return [];

        const sessionData: Record<string, number> = {};
        logs.forEach((log) => {
            const sessionId = log.session_id;
            if (!sessionData[sessionId] || log.reps > sessionData[sessionId]) {
                sessionData[sessionId] = log.reps;
            }
        });

        const sortedSessions = Object.entries(sessionData)
            .sort((a, b) => {
                const logA = logs.find((l) => l.session_id === a[0]);
                const logB = logs.find((l) => l.session_id === b[0]);
                if (logA?.created_at && logB?.created_at) {
                    return new Date(logA.created_at).getTime() - new Date(logB.created_at).getTime();
                }
                return a[0].localeCompare(b[0]);
            })
            .map(([, reps]) => reps);

        return sortedSessions.map((reps, index) => ({
            value: reps,
            dataPointText: `${reps}`,
            label: `${index + 1}`,
        }));
    }, [logs]);

    // עיבוד נתונים לסטים - כמות סטים לכל session
    const setsData = useMemo(() => {
        if (!logs || logs.length === 0) return [];

        const sessionData: Record<string, number> = {};
        logs.forEach((log) => {
            const sessionId = log.session_id;
            sessionData[sessionId] = (sessionData[sessionId] || 0) + 1;
        });

        const sortedSessions = Object.entries(sessionData)
            .sort((a, b) => {
                const logA = logs.find((l) => l.session_id === a[0]);
                const logB = logs.find((l) => l.session_id === b[0]);
                if (logA?.created_at && logB?.created_at) {
                    return new Date(logA.created_at).getTime() - new Date(logB.created_at).getTime();
                }
                return a[0].localeCompare(b[0]);
            })
            .map(([, sets]) => sets);

        return sortedSessions.map((sets, index) => ({
            value: sets,
            dataPointText: `${sets}`,
            label: `${index + 1}`,
        }));
    }, [logs]);

    const getCurrentData = () => {
        switch (activeTab) {
            case "weight":
                return weightData;
            case "reps":
                return repsData;
            case "sets":
                return setsData;
        }
    };

    const getTabLabel = (type: GraphType) => {
        switch (type) {
            case "weight":
                return "משקל";
            case "reps":
                return "חזרות";
            case "sets":
                return "סטים";
        }
    };

    const currentData = getCurrentData();

    if (!logs || logs.length === 0 || currentData.length === 0) {
        return null;
    }

    return (
        <View className="mb-4">
            {/* כפתורי טאבים */}
            <View className="flex-row gap-2 mb-3">
                {(["weight", "reps", "sets"] as GraphType[]).map((type) => (
                    <Pressable
                        key={type}
                        onPress={() => setActiveTab(type)}
                        className={`flex-1 py-2 px-3 rounded-xl border ${activeTab === type
                            ? "bg-lime-500/20 border-lime-500/50"
                            : "bg-zinc-800/50 border-zinc-700/50"
                            }`}
                    >
                        <Text
                            className={`text-center font-bold text-sm ${activeTab === type ? "text-lime-500" : "text-zinc-400"
                                }`}
                        >
                            {getTabLabel(type)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* גרף */}
            <View className="bg-background p-2 border-b border-background-400 rounded-2xl">
                <LineChart
                    areaChart
                    curved
                    data={currentData}
                    initialSpacing={20}
                    spacing={currentData.length > 1 ? Math.max(30, 300 / currentData.length) : 50}
                    thickness={3}
                    hideRules
                    hideYAxisText
                    yAxisThickness={0}
                    xAxisThickness={0}
                    dataPointsColor={colors.lime[500]}
                    dataPointsRadius={4}
                    focusedDataPointColor={colors.lime[400]}
                    startFillColor={colors.lime[500]}
                    startOpacity={0.3}
                    endFillColor={colors.lime[500]}
                    endOpacity={0.01}
                    color={colors.lime[500]}
                    textColor1={colors.lime[500]}
                    textShiftY={-12}
                    textFontSize={12}
                    showVerticalLines
                    verticalLinesColor="rgba(255,255,255,0.05)"
                    isAnimated={true}
                    animationDuration={1000}
                />
            </View>
        </View>
    );
};

export default GraphData;