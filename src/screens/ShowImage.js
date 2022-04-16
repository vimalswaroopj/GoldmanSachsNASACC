import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import * as Progress from 'react-native-progress';

export function ShowImage({ route }) {
    const [cache, setCache] = useState();
    const [progress, setProgress] = useState(true);
    let prop = route.params;
    useEffect(async () => {
        if (prop?.fromFavourite) {
            prop = await AsyncStorage.getItem(prop?.id)
            prop = JSON.parse(prop)
            setCache(prop)
        }
    }, [prop]);
    const dataView = (data) => (
        <>
            {progress && <Progress.Circle style={{ alignSelf: 'center' }} size={200}
                indeterminate={true}
                color={'black'}
            />
            }
            <Image source={{ uri: data?.image }}
                style={{ height: progress ? 0 : 300, }}
                onLoadEnd={() => {
                    setProgress(false)
                }}
            />
            <Text style={styles.title}>
                {data?.title} ({data?.date})
            </Text>
            <Text style={styles.explanation}>{data?.explanation}</Text>
        </>
    )
    return (
        <SafeAreaView style={styles.rootContainer}>
            <ScrollView>
                {
                    prop?.fromFavourite ?
                        <View>
                            {dataView(cache)}
                        </View>
                        :
                        <View>
                            {dataView(prop)}
                            <TouchableOpacity style={styles.favourite} onPress={async () => {
                                await AsyncStorage.setItem(prop.title, JSON.stringify(prop));
                            }} >
                                <Text style={{ color: 'white' }}>Add to favourites</Text>
                            </TouchableOpacity>
                        </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 16,
        padding: 8,
        borderBottomWidth: 1,
        borderColor: 'gray'
    },
    explanation: {
        padding: 8,
        marginBottom: 16,
        fontSize: 16,
        textAlign: 'justify',
        lineHeight: 25
    },
    favourite: {
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        height: 32
    },
});
