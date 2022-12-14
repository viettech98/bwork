'use strict';
import React, { Component } from 'react';
import {
    View, TextInput, Image, StyleSheet, Text, ImageBackground,
    Alert, TouchableHighlight, TouchableOpacity, ToastAndroid, Platform, Keyboard, BackHandler
} from 'react-native';
import { Container, Form, Content, Item, Input, Button, Right, ListItem, Radio, Left, Icon, Header, Root, Toast } from 'native-base';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import commonStyles from 'styles/commonStyles';
import I18n from 'react-native-i18n';
import { Colors } from 'values/colors'
import * as actions from 'actions/userActions';
import { connect } from 'react-redux';
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import StorageUtil from 'utils/storageUtil';
import { Constants } from 'values/constants';
import Utils from "utils/utils";
import ic_unlock_grey from 'images/ic_unlock_grey.png'
import { Fonts } from 'values/fonts'
import ic_lock_grey from 'images/ic_lock_grey.png';
import TextInputCustom from 'components/textInputCustom';
import DialogCustom from 'components/dialogCustom';
import BackgroundTopView from 'components/backgroundTopView';
import shadow_horizontal from "images/shadow_horizontal.png";
import ic_key_grey from "images/ic_key_grey.png";
import ic_transparent from "images/ic_transparent.png";

class ChangePassword extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            oldPass: '',
            newPass: '',
            confirmPass: '',
            hideOldPassword: true,
            hideNewPassword: true,
            hideNewPasswordConfirm: true,
            isData: false,
            isAlertSuccess: false
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }

    // Hide & show old password
    manageOldPasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.oldPass
        this.setState({
            hideOldPassword: !this.state.hideOldPassword,
            oldPass: ""
        });
        setTimeout(() => {
            this.setState({
                oldPass: last
            })
        }, 0)
    }

    // Hide & show new password
    manageNewPasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.newPass
        this.setState({
            hideNewPassword: !this.state.hideNewPassword,
            newPass: ""
        });
        setTimeout(() => {
            this.setState({
                newPass: last
            })
        }, 0)
    }

    // Hide & show confirm new password
    manageNewPasswordConfirmVisibility = () => {
        let last = this.state.confirmPass
        this.setState({
            hideNewPasswordConfirm: !this.state.hideNewPasswordConfirm,
            confirmPass: ""
        });
        setTimeout(() => {
            this.setState({
                confirmPass: last
            })
        }, 0)
    }

    // On press change password
    onPressCommonButton = () => {
        let { oldPass, newPass, confirmPass } = this.state;
        if (oldPass.length == 0) {
            this.showMessage(localizes('setting.enterOldPass'))
            this.password.focus()
            return false
        } else if (newPass.length == 0) {
            this.showMessage(localizes('setting.enterNewPass'))
            this.newPassword.focus()
            return false
        } else if (newPass.length > 20 || newPass.length < 6) {
            this.showMessage(localizes('setting.passLength'))
            this.newPassword.focus()
            return false
        } else if (!Utils.validateContainUpperPassword(newPass)) {
            this.showMessage(localizes('setting.passLength'))
            this.newPassword.focus()
            return false
        } else if (confirmPass.length == 0) {
            this.showMessage(localizes('setting.enterConfPass'))
            this.confirmPassword.focus()
            return false
        } else if (newPass !== confirmPass) {
            this.showMessage(localizes('register.vali_confirm_password'))
            this.confirmPassword.focus()
            return false
        } else {
            this.props.changePass(oldPass, newPass);
            return true
        }
    }

    handleData() {
        let data = this.props.data
        console.log("Data pass", data)
        if (data != null && this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.CHANGE_PASS)) {
                    if (data) {
                        this.setState({
                            oldPass: '',
                            newPass: '',
                            confirmPass: '',
                            hideOldPassword: true,
                            hideNewPassword: true,
                            hideNewPasswordConfirm: true,
                            isAlertSuccess: true
                        })
                    } else {
                        this.showMessage(localizes('setting.oldPassFail'))
                        this.password.focus()
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
                this.state.refreshing = false;
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData();
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Root>
                    <Header style={commonStyles.header}>
                        {this.renderHeaderView({
                            title: "?????i m???t kh???u",
                            titleStyle: { color: Colors.COLOR_WHITE },
                            renderRightMenu: this.renderRightHeader
                        })}
                    </Header>
                    <Content contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                        <View style={{ flexGrow: 1 }}>
                            <Form style={{ flex: 1 }}>
                                <View style={{
                                    paddingHorizontal: Constants.PADDING_X_LARGE,
                                    backgroundColor: Colors.COLOR_WHITE,
                                    borderRadius: Constants.CORNER_RADIUS,
                                    margin: Constants.MARGIN_X_LARGE
                                }}>
                                    {/* Old password */}
                                    <TextInputCustom
                                        refInput={ref => (this.password = ref)}
                                        isInputNormal={true}
                                        placeholder="M???t kh???u c??"
                                        value={this.state.oldPass}
                                        underlineColorAndroid='transparent'
                                        secureTextEntry={this.state.hideOldPassword}
                                        onChangeText={(text) => {
                                            this.setState({
                                                oldPass: text
                                            })
                                        }}
                                        onSubmitEditing={() => {
                                            this.newPassword.focus();
                                        }}
                                        returnKeyType={"next"}
                                        inputNormalStyle={{
                                            paddingVertical: Constants.MARGIN_LARGE + Constants.MARGIN,
                                            paddingRight: Constants.PADDING_XX_LARGE
                                        }}
                                        contentLeft={ic_key_grey}
                                        autoFocus={true}
                                        contentRight={
                                            <TouchableHighlight
                                                onPress={this.manageOldPasswordVisibility}
                                                style={[commonStyles.shadowOffset, {
                                                    position: "absolute",
                                                    right: 0,
                                                    padding: Constants.PADDING_LARGE,
                                                    marginRight: -Constants.MARGIN_LARGE
                                                }]}
                                                underlayColor='transparent'
                                            >
                                                <Image style={{ resizeMode: 'contain', opacity: 0.5 }}
                                                    source={(this.state.hideOldPassword) ? ic_unlock_grey : ic_lock_grey} />
                                            </TouchableHighlight>
                                        }
                                    />
                                    {/* New password */}
                                    <TextInputCustom
                                        refInput={ref => this.newPassword = ref}
                                        isInputNormal={true}
                                        placeholder="M???t kh???u m???i(6 - 20 k?? t???)"
                                        value={this.state.newPass}
                                        underlineColorAndroid='transparent'
                                        secureTextEntry={this.state.hideNewPassword}
                                        onChangeText={
                                            (text) => {
                                                this.setState({
                                                    newPass: text
                                                })
                                            }
                                        }
                                        onSubmitEditing={() => {
                                            this.confirmPassword.focus();
                                        }}
                                        returnKeyType={"next"}
                                        inputNormalStyle={{
                                            paddingVertical: Constants.MARGIN_LARGE + Constants.MARGIN,
                                            paddingRight: Constants.PADDING_XX_LARGE
                                        }}
                                        contentLeft={ic_transparent}
                                        contentRight={
                                            <TouchableHighlight
                                                onPress={this.manageNewPasswordVisibility}
                                                style={[commonStyles.shadowOffset, {
                                                    position: "absolute",
                                                    right: 0,
                                                    padding: Constants.PADDING_LARGE,
                                                    marginRight: -Constants.MARGIN_LARGE
                                                }]}
                                                underlayColor='transparent'
                                            >
                                                <Image style={{ resizeMode: 'contain', opacity: 0.5 }}
                                                    source={(this.state.hideNewPassword) ? ic_unlock_grey : ic_lock_grey} />
                                            </TouchableHighlight>
                                        }
                                    />
                                    {/* Confirm new password */}
                                    <TextInputCustom
                                        refInput={ref => this.confirmPassword = ref}
                                        isInputNormal={true}
                                        placeholder="Nh???p l???i m???t kh???u m???i"
                                        value={this.state.confirmPass}
                                        onSubmitEditing={() => {
                                            Keyboard.dismiss()
                                        }}
                                        underlineColorAndroid='transparent'
                                        secureTextEntry={this.state.hideNewPasswordConfirm}
                                        onChangeText={
                                            (text) => {
                                                this.setState({
                                                    confirmPass: text
                                                })
                                            }
                                        }
                                        returnKeyType={"done"}
                                        inputNormalStyle={{
                                            paddingVertical: Constants.MARGIN_LARGE + Constants.MARGIN,
                                            paddingRight: Constants.PADDING_XX_LARGE
                                        }}
                                        contentLeft={ic_transparent}
                                        borderBottomWidth={0}
                                        contentRight={
                                            <TouchableHighlight
                                                onPress={this.manageNewPasswordConfirmVisibility}
                                                style={[{
                                                    position: "absolute",
                                                    right: 0,
                                                    padding: Constants.PADDING_LARGE,
                                                    marginRight: -Constants.MARGIN_LARGE
                                                }]}
                                                underlayColor='transparent'
                                            >
                                                <Image style={{ resizeMode: 'contain', opacity: 0.5 }}
                                                    source={(this.state.hideNewPasswordConfirm) ? ic_unlock_grey : ic_lock_grey} />
                                            </TouchableHighlight>
                                        }
                                    />
                                </View>
                                {/* Button save */}
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    {this.renderCommonButton(
                                        localizes('forgot_password.btnSave'),
                                        { color: Colors.COLOR_WHITE },
                                        { marginHorizontal: Constants.MARGIN_X_LARGE },
                                        () => {
                                            this.onPressCommonButton()
                                        }
                                    )}
                                </View>
                            </Form>
                        </View>
                        {this.renderAlertSuccess()}
                    </Content>
                    {this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        )
    }

    /**
     * Render alert success
     */
    renderAlertSuccess() {
        return (
            <DialogCustom
                visible={this.state.isAlertSuccess}
                isVisibleTitle={true}
                isVisibleOneButton={true}
                isVisibleContentText={true}
                contentTitle={"Th??ng b??o"}
                textBtn={"Ok"}
                contentText={localizes("setting.change_pass_success")}
                onPressBtn={() => {
                    this.setState({ isAlertSuccess: false })
                    this.props.navigation.goBack()
                }}
            />
        )
    }
}
const mapStateToProps = state => ({
    data: state.changePass.data,
    action: state.changePass.action,
    isLoading: state.changePass.isLoading,
    error: state.changePass.error,
    errorCode: state.changePass.errorCode
});
export default connect(mapStateToProps, actions)(ChangePassword);