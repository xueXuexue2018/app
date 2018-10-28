import React from 'react';
import { StackNavigator } from 'react-navigation';
import HandoverCar from './HandoverCar';
import HandoverCarDetail from './HandoverCarDetail';
import TaskDetails from './TaskDetails';
import { CurrentTaskRoot } from '../../page/currentTask/CurrentTaskRoot';

export const HandoverCarRoot = StackNavigator(
    {
        HandoverCar: {
            screen: HandoverCar,
        },
        HandoverCarDetail:{
            screen:HandoverCarDetail,
        },
        // CurrentTaskRoot:{
        //     screen:CurrentTaskRoot
        // },
        TaskDetails:{
            screen:TaskDetails
        }
    },
    {
        initialRouteName: 'HandoverCar',
        headerMode: 'none'
    }
);