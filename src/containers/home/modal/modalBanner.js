import React, { Component } from "react";
import {
    ImageBackground, View, StatusBar, Image, TouchableOpacity, BackHandler, Alert, Linking,
    RefreshControl, StyleSheet, TextInput, Dimensions, FlatList, TouchableHighlight, Platform
} from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Form } from "native-base";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import ic_next_white from 'images/ic_next_white.png';
import commonStyles from "styles/commonStyles";
import BaseView from "containers/base/baseView"
import TextInputCustom from "components/textInputCustom";
import ModalDropdown from 'components/dropdown';
import I18n, { localizes } from "locales/i18n";
import StringUtil from "utils/stringUtil";
import { Fonts } from "values/fonts";
import FlatListCustom from "components/flatListCustom";
import Modal from 'react-native-modalbox';
import DateUtil from "utils/dateUtil";
import actionClickBannerType from "enum/actionClickBannerType";
import ImageLoader from "components/imageLoader";
import ic_cancel_white from "images/ic_cancel_white.png";
import imageRatio from "enum/imageRatio";

const screen = Dimensions.get("window");

export default class ModalBanner extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            banner: null
        };
    }

    componentDidUpdate = (prevProps, prevState) => {
    }

    componentWillMount = () => {
        this.getSourceUrlPath();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
      * Handle data when request
      */
    handleData() { }

    /**
     * Show Model Banner
     */
    showModal(banner) {
        this.setState({
            banner: banner
        })
        this.refs.modalBanner.open();
    }

    /**
     * hide Modal Banner
     */
    hideModal() {
        this.refs.modalBanner.close();
    }

    componentWillUnmount = () => {
    }

    render() {
        const { banner } = this.state;
        return (
            <Modal
                ref={"modalBanner"}
                animationType={'fade'}
                transparent={true}
                style={{
                    backgroundColor: "#00000000",
                    width: screen.width,
                    height: screen.height,
                }}
                backdrop={true}
                swipeToClose={Platform.OS === 'android' ? false : true}
                backdropPressToClose={true}
                onClosed={() => {
                    this.hideModal()
                }}
                backButtonClose={true}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => this.hideModal()} style={{
                        marginTop: - Constants.MARGIN_X_LARGE,
                        marginBottom: Constants.MARGIN_X_LARGE,
                        marginRight: Constants.MARGIN_X_LARGE
                    }}>
                        <Image source={ic_cancel_white} />
                    </TouchableOpacity>
                    {!Utils.isNull(banner) ?
                        <TouchableOpacity
                            style={{ width: "100%", height: screen.width * this.sizeBanner(banner.ratio) }}
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            onPress={() => this.handleClickBanner(banner)}>
                            <ImageLoader
                                resizeAtt={{ type: 'resize', width: screen.width }}
                                path={!Utils.isNull(banner.pathToResource) && banner.pathToResource.indexOf('http') != -1 ?
                                    banner.pathToResource : this.resourceUrlPathResize.textValue + "=" + global.companyIdAlias + "/" + banner.pathToResource}
                                resizeModeType={"cover"}
                                style={{ height: "100%", width: "100%" }}
                            />
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </Modal>
        );
    }

    /**
     * Handle click banner
     */
    handleClickBanner(data) {
        switch (data.actionOnClickType) {
            case actionClickBannerType.DO_NOTHING:
                global.openModalBanner(data)
                break;
            case actionClickBannerType.GO_TO_SCREEN:

                break;
            case actionClickBannerType.OPEN_OTHER_APP:
                Linking.openURL('https://www.facebook.com/n/?ToHyun.TQT')
                break;
            case actionClickBannerType.OPEN_URL:
                this.props.navigation.navigate("QuestionAnswer", {
                    actionTarget: data.actionTarget
                })
                break;

            default:
                break;
        }
    }
}