    import { Text, View } from "react-native";
    interface Props {
        id: string | string[] ;
    }
    const SessionManager = ({ id }: Props) => {
        console.log("id: ", id);
        
        return (
            <View>
                <Text>SessionManager: {id}</Text>
            </View>
        );
    };
    export default SessionManager;