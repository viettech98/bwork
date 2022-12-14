import React, { Component } from "react";
import { FlatList, ScrollView, Dimensions, ImageBackground, View, StatusBar, StyleSheet, Alert, Animated, Easing, Platform } from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Image } from "native-base";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import StorageUtil from "utils/storageUtil";
import Utils from 'utils/utils';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import screenType from "enum/screenType";
import userType from "enum/userType";
import { configConstants } from "values/configConstants";

class SplashView extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            companyInfo: null
        }
        this.animate = new Animated.Value(1)
    }

    render() {
        const animateStyle = this.animate.interpolate({
            inputRange: [0, 0],
            outputRange: [0.5, 1],
        })
        Platform.OS === 'android' ? StatusBar.setBackgroundColor(Colors.COLOR_PRIMARY, true) : null;
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: `center`
                }}>
                {/* <Animated.Image
                    style={{
                        transform: [{
                            scale: animateStyle
                        }
                        ],
                        resizeMode: 'contain'
                    }}
                    source={require('images/ic_logo.png')}
                /> */}
            </View>
        );
    }

    componentDidMount() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            //this callback is executed when your Promise is resolved
            this.state.user = user;
            StorageUtil.retrieveItem(StorageUtil.COMPANY_INFO).then((companyInfo) => {
                //this callback is executed when your Promise is resolved
                this.state.companyInfo = companyInfo;
                this.getToken();
            }).catch((error) => {
                //this callback is executed when your Promise is rejected
                console.log('Promise is rejected with error: ' + error);
            });
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
        });
    }

    /**
     * validate
     */
    validate(user) {
        const { name, email, phone, birthDate, personalId, domicile, address, avatarPath } = user;
        if (!Utils.isNull(name) && !Utils.isNull(email) && !Utils.isNull(phone)
            && !Utils.isNull(birthDate) && !Utils.isNull(personalId) && !Utils.isNull(domicile)
            && !Utils.isNull(address) && !Utils.isNull(avatarPath)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Validate company
     */
    validateCompany() {
        const { user, companyInfo } = this.state;
        if (user.company.id != 1) {
            if (!Utils.isNull(user.branch) || user.company.branches.length == 0) {
                this.goHomeScreen();
            } else {
                if (!Utils.isNull(companyInfo.company) && !Utils.isNull(companyInfo.branch)) {
                    this.goHomeScreen();
                } else {
                    if (!Utils.isNull(companyInfo.company.branches)) {
                        this.dispatchScreen("BranchList", {
                            company: companyInfo.company,
                            fromScreen: screenType.FROM_LOGIN
                        });
                    } else {
                        this.goHomeScreen();
                    }
                }
            }
        } else {
            if (!Utils.isNull(companyInfo)) {
                if (!Utils.isNull(companyInfo.company) && (!Utils.isNull(companyInfo.branch) || Utils.isNull(companyInfo.company.branches))) {
                    this.goHomeScreen();
                } else {
                    this.dispatchScreen("CompanyList");
                }
            } else {
                this.dispatchScreen("CompanyList");
            }
        }
    }

    /**
     * Login
     */
    login() {
        const { user } = this.state;
        if (!Utils.isNull(user)) {
            if (global.bundleId == configConstants.APP_ADMIN) {
                this.validateCompany();
            } else {
                if (Utils.isNull(user.branch) && !Utils.isNull(user.company.branches)) {
                    this.props.navigation.navigate("Department", {
                        userId: user.id,
                        company: user.company,
                        fromScreen: screenType.FROM_SPLASH,
                        callback: () => {
                            if (this.validate(user)) {
                                this.goHomeScreen();
                            } else {
                                this.gotoUserInfo();
                            }
                        }
                    });
                } else if (this.validate(user)) {
                    this.goHomeScreen();
                } else {
                    this.gotoUserInfo();
                }
            }
        } else {
            this.goLoginScreen();
        }
        SplashScreen.hide();
    }

    gotoUserInfo = () => {
        const { user } = this.state;
        this.props.navigation.navigate("UserInfo", {
            userInfo: user,
            callBack: null,
            screen: screenType.FROM_SPLASH
        });
    }

    /**
     * Get token
     */
    getToken() {
        StorageUtil.retrieveItem(StorageUtil.USER_TOKEN).then((token) => {
            //this callback is executed when your Promise is resolved
            global.token = token;
            this.login();
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
            this.login();
        });
        global.deviceId = DeviceInfo.getUniqueId();
    }
}

export default SplashView;