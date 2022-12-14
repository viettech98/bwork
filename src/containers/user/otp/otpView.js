'use strict';
import React, { Component } from 'react';
import {
    Dimensions, View, TextInput, Image, StyleSheet, Text, PixelRatio, ImageBackground, Platform,
    TouchableHighlight, TouchableOpacity, Keyboard, ToastAndroid, ScrollView, Modal, BackHandler
} from 'react-native';
import { Container, Form, Content, Input, Button, Right, Radio, center, ListItem, Left, Header, Item, Body, Root } from 'native-base';
import cover from 'images/bg_launch.png';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import index from '../../../reducers';
import Utils from 'utils/utils';
import { connect } from 'react-redux';
import { ErrorCode } from 'config/errorCode';
import { getActionSuccess, ActionEvent } from 'actions/actionEvent';
import * as actions from 'actions/userActions';
import ic_logo from "images/ic_logo.png";
import OTPType from 'enum/otpType';
import TextInputOTP from '../otp/textInputOtp';
import screenTypes from 'enum/screenType';
import BackgroundTopView from 'components/backgroundTopView';

class OTPView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            isSignUp: false
        }
        const { screenType, dataUser } = this.props.navigation.state.params
        this.screenType = screenType
        this.dataUser = dataUser
        if (screenType == screenTypes.FROM_REGISTER) {
            this.title = localizes("register.register_title")
        } else if (screenType == screenTypes.FROM_FORGET_PASSWORD) {
            this.title = localizes("forgot_password.titleForgotPassword")
        } else if (screenType == screenTypes.FROM_LOGIN_SOCIAL) {
            this.title = localizes("forgot_password.update_phone_number")
        }
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.SIGN_UP)) {
                    if (!Utils.isNull(data) && Utils.validatePhone(data)) {
                        let filter = {
                            sendType: OTPType.REGISTER,
                            phone: data
                        }
                        this.props.sendOTP(filter)
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.FORGET_PASS)) {
                    if (!Utils.isNull(data) && Utils.validatePhone(data)) {
                        let filter = {
                            sendType: OTPType.FORGOT_PASS,
                            phone: data
                        }
                        this.props.sendOTP(filter)
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.LOGIN_FB) || this.props.action == getActionSuccess(ActionEvent.LOGIN_GOOGLE)) {
                    if (!Utils.isNull(data) && Utils.validatePhone(data)) {
                        let filter = {
                            sendType: OTPType.REGISTER,
                            phone: data
                        }
                        this.props.sendOTP(filter)
                    }
                }
            } else if (this.props.errorCode == ErrorCode.USER_EXIST_TRY_LOGIN_FAIL) {
                this.showMessage(localizes('userProfileView.existMobile'))
            } else if (this.props.errorCode == ErrorCode.INVALID_ACCOUNT) {
                if (this.props.action == getActionSuccess(ActionEvent.FORGET_PASS)) {
                    this.showMessage(localizes('login.phoneNotExist'))
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
                this.state.refreshing = false;
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Root>
                    <BackgroundTopView />
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <Header style={[{ backgroundColor: Colors.COLOR_TRANSPARENT, borderBottomWidth: 0, elevation: 0 }]}>
                            {this.renderHeaderView({
                                title: this.title,
                                titleStyle: { marginRight: Constants.MARGIN_X_LARGE * 2, color: Colors.COLOR_WHITE }
                            })}
                        </Header>
                        <Content contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                            <View style={{ flexGrow: 1 }}>
                                <View style={[commonStyles.viewCenter]}>
                                    <Image source={ic_logo} />
                                    {/* <Text style={commonStyles.titleTop}>{localizes("title_app")}</Text> */}
                                </View>
                                {/* OTP */}
                                <View style={{ flex: 1, marginTop: Constants.MARGIN_XX_LARGE + Constants.MARGIN }}>
                                    <TextInputOTP
                                        screenType={this.screenType}
                                        dataUser={this.dataUser}
                                        navigation={this.props.navigation} />
                                </View>
                            </View>
                        </Content>
                        {this.showLoadingBar(this.props.isLoading)}
                    </View>
                </Root>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    data: state.otp.data,
    action: state.otp.action,
    isLoading: state.otp.isLoading,
    error: state.otp.error,
    errorCode: state.otp.errorCode
});

export default connect(mapStateToProps, actions)(OTPView);