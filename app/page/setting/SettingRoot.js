import React from 'react';
import {
    TouchableOpacity,
    Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import CancellM from './CancellM';
import SetUp from './SetUp';

export const SettingRoot = StackNavigator(
    {
        CancellM: {
            screen: CancellM,
        },
        SetUp:{
            screen: SetUp,
        }
    },
    {
        initialRouteName: 'CancellM',
        headerMode: 'none'
    }
);