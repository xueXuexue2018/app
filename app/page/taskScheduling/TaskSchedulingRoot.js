import React from 'react';
import {
    TouchableOpacity,
    Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import TaskSchedulingList from './TaskSchedulingList';
import TaskSchedulingSearch from './TaskSchedulingSearch';
import TaskScheduling from './TaskScheduling';

export const TaskSchedulingRoot = StackNavigator(
    {
        TaskSchedulingList: {
            screen: TaskSchedulingList,
        },
        TaskSchedulingSearch:{
            screen: TaskSchedulingSearch,
        },
        TaskScheduling:{
            screen: TaskScheduling,
        }
    },
    {
        initialRouteName: 'TaskSchedulingList',
        headerMode: 'none'
    }
);