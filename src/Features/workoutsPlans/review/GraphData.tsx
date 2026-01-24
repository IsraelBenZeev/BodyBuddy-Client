import { colors } from "@/colors";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
interface Props {
    data: { value: number; dataPointText: string }[];
}
const GraphData = ({ data }: Props) => {
    const lineData = [
        { value: 0, dataPointText: '0' },
        { value: 20, dataPointText: '20' },
        { value: 18, dataPointText: '18' },
        { value: 40, dataPointText: '40' },
        { value: 36, dataPointText: '36' },
        { value: 60, dataPointText: '60' },
        { value: 54, dataPointText: '54' },
        { value: 85, dataPointText: '85' }
    ];
    return (
        <View
            className="bg-background p-2 border border-background-400 rounded-2xl"
        >
            <LineChart
                areaChart // מוסיף מילוי מתחת לקו
                curved // הופך את הקו למעוגל וחלק
                data={lineData}
                initialSpacing={20} // נותן קצת אוויר בהתחלה
                spacing={50}
                thickness={3} // קו מעט עבה יותר נראה טוב יותר
                hideRules
                hideYAxisText
                yAxisThickness={0} // מעלים את הקו האנכי של הציר
                xAxisThickness={0} // מעלים את הקו האופקי של הציר

                // עיצוב הנקודות
                dataPointsColor={colors.lime[500]}
                dataPointsRadius={4}
                focusedDataPointColor={colors.lime[400]}

                // עיצוב המילוי (Gradient)
                startFillColor={colors.lime[500]}
                startOpacity={0.3}
                endFillColor={colors.lime[500]}
                endOpacity={0.01}

                // צבע הקו
                color={colors.lime[500]}

                // טקסט מעל הנקודות
                textColor1={colors.lime[500]}
                textShiftY={-12}
                textFontSize={12}
                // fontWeight="bold"

                // קווים אנכיים עדינים
                showVerticalLines
                verticalLinesColor="rgba(255,255,255,0.05)" // קווים כמעט שקופים
                isAnimated={true}
                animationDuration={1000}
            />
        </View>
    );
};
export default GraphData;