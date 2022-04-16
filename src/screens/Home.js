import axios from "axios";
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { URL_CONSTANTS } from '../constants/constants'
import { useNetInfo } from "@react-native-community/netinfo";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

export function Home({ navigation }) {
    const [DTP, setDTP] = useState(new Date());
    const [show, setShow] = useState(false);
    const [text, setText] = useState(null);
    const [progress, setProgress] = useState(false)

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || d;
        console.log(currentDate)
        setShow(Platform.OS === 'ios');
        setDTP(currentDate);

        let temp = new Date(currentDate);
        let fDate = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
        setDate(fDate);
    }

    const netInfo = useNetInfo();
    const [date, setDate] = useState('Select date');
    onDateChange = (value) => {
        setDate(value)
    }
    return (
        <SafeAreaView style={styles.rootContainer}>
            {
                show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={DTP}
                        mode={'date'}
                        is24Hour={true}
                        display='default'
                        onChange={onChange}
                        maximumDate={new Date()}
                    />
                )
            }
            {
                netInfo.isConnected ?
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.date} onPress={() => setShow(true)}>
                            <Text
                                style={styles.input}>{date}</Text>
                            <Ionicons style={styles.icon} name={'calendar-outline'} size={18} />
                        </TouchableOpacity>
                        {
                            text && <Text style={styles.error}>{text}</Text>
                        }
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setProgress(true)
                            axios.get(`${URL_CONSTANTS.APOD}?api_key=${URL_CONSTANTS.API_KEY}&date=${date}`)
                                .then((response) => {
                                    if (text) {
                                        setText(null)
                                    }
                                    navigation.navigate('POD', {
                                        date: response.data?.date,
                                        title: response.data?.title,
                                        image: response.data?.url,
                                        explanation: response.data?.explanation,
                                    })
                                    setProgress(false)
                                })
                                .catch(() => {
                                    setText('no data available or invalid date.')
                                    setProgress(false)
                                })
                        }} >
                            {progress ? <Progress.Circle size={30}
                                indeterminate={true}
                                color={'white'}
                            />
                                : <Text style={{ color: 'white' }}>APOD</Text>}

                        </TouchableOpacity>
                    </View>
                    :
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>No network. Go to Favourites.</Text>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: "center",
        justifyContent: 'center'
    },
    container: {
        borderWidth: 1,
        height: 200,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: 'gray'
    },
    input: {
        fontSize: 24
    },
    button: {
        backgroundColor: 'red',
        width: 100,
        alignItems: "center",
        justifyContent: "center",
        height: 32,
    },
    date: {
        borderBottomWidth: 1,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        marginLeft: 8
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    }
});
