import React from "react-native";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";

const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const { StyleSheet } = React;

export default {
	container: {
		width: null,
		height: null,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch',
		backgroundColor: Colors.COLOR_TRANSPARENT
	},
	guide: {
		position: 'absolute',
		bottom: 0
	}
};
