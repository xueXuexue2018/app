import React from 'react';
import {
	StackNavigator
} from 'react-navigation';
import Apply from "./UI/Apply";
import ApplyDetails from "./UI/ApplyDetails";
import ApplyList from "./UI/ApplyList";
import MapTest from "./UI/MapTest";

export const ApplyRoot = StackNavigator({
	ApplyList: {
		screen: ApplyList
	},
	ApplyDetails: {
		screen: ApplyDetails
	},
	Apply: {
		screen: Apply
	},
	Map : {
		screen: MapTest
	}
}, {
	headerMode: 'none',
	initialRoute: 'ApplyList'
});