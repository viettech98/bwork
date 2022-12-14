import React from "react-native";
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts'
import commonStyles from 'styles/commonStyles';

const { StyleSheet } = React;
const HEIGHT_INPUT = 30
export default {
    textSmall: {
        marginLeft: Constants.MARGIN,
        marginRight: Constants.MARGIN,
        marginBottom: Constants.MARGIN,
        marginTop: Constants.MARGIN,
    },
    text: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        marginBottom: Constants.MARGIN,
        marginTop: Constants.MARGIN,
    },
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_BACKGROUND
    },
    staticComponent: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    input: {
        ...commonStyles.text,
        height: '100%',
        padding: Constants.PADDING,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        textAlignVertical: 'bottom',
        margin: 0,
        height: HEIGHT_INPUT,
    },
    checkText: {
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },

    images: {
        marginRight: 8, marginBottom: 2, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'flex-end'
    },

    checkboxGender: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        flex: 1,
        borderWidth: 0,
        margin: 0,
        marginRight: 0,
        padding: 0,
    },

    modalDropdown: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLOR_GREY,
        paddingLeft: Constants.PADDING_X_LARGE,
        paddingRight: 30,
        paddingVertical: Constants.PADDING
    },

    itemInputStyle: {
        marginBottom: 25,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
    },

    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    checkBox: {
        marginLeft: - Constants.MARGIN_LARGE,
        marginRight: Constants.MARGIN_X_LARGE
    }
};
