import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Favourites({ navigation }) {
    const [keys, setKeys] = useState([]);
    useEffect(async () => {
        const key = await AsyncStorage.getAllKeys();
        setKeys(key);
    });

    return (
        <SafeAreaView style={styles.rootContainer}>
            <>
                {
                    keys.length > 0 ?
                        <FlatList
                            data={keys}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <View style={styles.apod} key={item}>
                                    <TouchableOpacity activeOpacity={0.8}
                                        onPress={() => navigation.navigate('POD', {
                                            fromFavourite: true,
                                            id: item
                                        })}>
                                        <Text>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={async () => {
                                        await AsyncStorage.removeItem(item);
                                        let newKey = keys.filter((id) => id != item)
                                        setKeys(newKey)
                                    }}>
                                        <Text style={styles.deleteapod}>
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        :
                        <View style={styles.emptyContainer}>
                            <Text style={styles.empty}>
                                Your favourites is empty.
                            </Text>
                        </View>
                }
            </>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        padding: 8,
        backgroundColor: 'white',
        flex: 1
    },
    apod: {
        padding: 8,
        borderBottomWidth: 1,
        marginVertical: 4,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    deleteapod: {
        color: 'red'
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    empty: {
        fontSize: 20,
    }
});
