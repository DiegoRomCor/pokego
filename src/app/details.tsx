import React from 'react'
import { Image, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { colorsByType } from '../constants/colorsByType'


export default function Details() {
    const { name, type = 'unknown', image } = useLocalSearchParams<{
        name?: string;
        type?: string;
        image?: string;
    }>();

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (colorsByType[type] ?? colorsByType.unknown) + 50,
            }}
        >
            <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>
                Name: {name}
            </Text>
            <Text style={{ fontSize: 22, textAlign: 'center' }}>Type: {type}</Text>
            {image && (
                <Image
                    source={{ uri: image }}
                    resizeMode="contain"
                    style={{ width: '80%', maxWidth: 280, aspectRatio: 1 }}
                />
            )}
        </View>
    )
}
