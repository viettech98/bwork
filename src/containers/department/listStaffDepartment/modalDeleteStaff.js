import React, { Component } from "react";
import {
    ImageBackground, View, StatusBar, Image, ScrollView,
    TouchableWithoutFeedback, BackHandler, Alert,
    Linking, RefreshControl, StyleSheet, TextInput,
    Dimensions, FlatList, TouchableHighlight, TouchableOpacity
} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Form } from "native-base";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import ic_close_black from 'images/ic_close_black.png';
import commonStyles from "styles/commonStyles";
import BaseView from "containers/base/baseView"
import TextInputCustom from "components/textInputCustom";
import ModalDropdown from 'components/dropdown';
import I18n, { localizes } from "locales/i18n";
import StringUtil from "utils/stringUtil";
import { Fonts } from "values/fonts";
import { months } from "moment";
import FlatListCustom from "components/flatListCustom";
import Modal from 'react-native-modalbox';
import moment from 'moment';
import DateUtil from "utils/dateUtil";
import Hr from "components/hr";
import approvalStatusType from 'enum/approvalStatusType';
import Utils from 'utils/utils';
import sabbaticalOffType from 'enum/sabbaticalOffType';
import checkInType from "enum/checkInType";
import { RadioGroup, RadioButton } from 'react-native-ui-lib';
import styles from "./styles";
import statusType from "enum/statusType";

const screen = Dimensions.get("window");

export default class ModalConfigStaff extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            selected: statusType.SUSPENDED
        };
    }

    componentDidUpdate = (prevProps, prevState) => {
    }

    componentWillMount = () => {
    }

    /**
     * Show Modal
     */
    showModal() {
        this.refs.modalDeleteStaff.open();
    }

    /**
     * hide Modal
     */
    hideModal() {
        this.refs.modalDeleteStaff.close();
    }

    componentWillUnmount = () => {
    }

    render() {
        const { selected } = this.state;
        return (
            <Modal
                ref={"modalDeleteStaff"}
                style={{
                    backgroundColor: "#00000000",
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                backdrop={true}
                onClosed={() => {
                    this.hideModal()
                }}
                backButtonClose={true}
                swipeToClose={false}
                coverScreen={true}
            >
                <View style={[commonStyles.shadowOffset, {
                    maxHeight: "90%",
                    width: screen.width - Constants.MARGIN_X_LARGE * 2,
                    borderRadius: Constants.CORNER_RADIUS,
                    backgroundColor: Colors.COLOR_WHITE,
                    padding: Constants.PADDING_LARGE
                }]}>
                    <Text style={[commonStyles.text, { margin: Constants.MARGIN_LARGE }]}>
                        {"B???n mu???n x??a nh??n vi??n t???m th???i hay x??a v??nh vi???n?".toUpperCase()}
                    </Text>
                    <RadioGroup
                        style={{ flexDirection: "row", margin: Constants.MARGIN_X_LARGE }}
                        initialValue={selected}
                        onValueChange={(selected) => {
                            this.setState({ selected })
                        }}>
                        <RadioButton
                            color={Colors.COLOR_PRIMARY}
                            label={"X??a t???m th???i"}
                            value={statusType.SUSPENDED}
                            size={16}
                            labelStyle={{ marginRight: Constants.MARGIN_X_LARGE }}
                        />
                        <RadioButton
                            color={Colors.COLOR_PRIMARY}
                            label={"X??a v??nh vi???n"}
                            value={statusType.DELETE}
                            size={16}
                            labelStyle={{ marginRight: Constants.MARGIN_X_LARGE }}
                        />
                    </RadioGroup>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: Constants.MARGIN_X_LARGE }}>
                        {/* Button skip */}
                        <View style={{ marginVertical: Constants.MARGIN_LARGE }}>
                            <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                onPress={() => this.hideModal()}
                                style={{
                                    ...commonStyles.buttonStyle,
                                    backgroundColor: Colors.COLOR_WHITE,
                                    borderColor: Colors.COLOR_TEXT,
                                    borderWidth: Constants.BORDER_WIDTH,
                                    marginLeft: Constants.MARGIN_LARGE
                                }}>
                                <Text style={[commonStyles.text, { marginVertical: -1 }]}>
                                    {localizes("cancel")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* Button confirm */}
                        <View style={{ marginVertical: Constants.MARGIN_LARGE }}>
                            <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                onPress={() => this.props.onConfirm(selected)}
                                style={{
                                    ...commonStyles.buttonStyle,
                                    marginHorizontal: Constants.MARGIN_LARGE
                                }}>
                                <Text
                                    style={[commonStyles.text, { marginVertical: 0, color: Colors.COLOR_WHITE }]}
                                >
                                    {localizes("confirm")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}