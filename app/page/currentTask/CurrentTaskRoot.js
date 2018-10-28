import React from 'react';
import { StackNavigator } from 'react-navigation';
import  CurrentTaskDetails from  './CurrentTaskDetails';
import  CurrentTaskList from './CurrentTaskList';
import CurrentTaskListLeft from './CurrentTaskListLeft';
import CurrentTaskDetailsStop from "./CurrentTaskDetailsStop";
import CurrentTaskDetailsComplete from "./CurrentTaskDetailsComplete";

export const CurrentTaskRoot = StackNavigator(
    {
        CurrentTaskList: {
            screen: CurrentTaskList,
        },
        CurrentTaskListLeft: {
            screen: CurrentTaskListLeft,
        },
        CurrentTaskDetails: {
            screen: CurrentTaskDetails,
        },
        CurrentTaskDetailsStop: {
            screen: CurrentTaskDetailsStop,
        },
        CurrentTaskDetailsComplete: {
            screen: CurrentTaskDetailsComplete,
        }
    },
    {
        initialRouteName: 'CurrentTaskList',
        headerMode: 'none'
    }
);