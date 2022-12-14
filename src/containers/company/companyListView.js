import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    RefreshControl,
    BackHandler
} from 'react-native';
import BaseView from 'containers/base/baseView';
import * as actions from "actions/userActions";
import * as commonActions from "actions/commonActions";
import * as sabbaticalActions from "actions/sabbaticalActions";
import { connect } from "react-redux";
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { Constants } from 'values/constants';
import Utils from 'utils/utils';
import { Content, Container, Root, Header } from 'native-base';
import styles from './styles';
import commonStyles from "styles/commonStyles";
import { Colors } from 'values/colors';
import ic_logout_white from "images/ic_logout_white.png";
import FlatListCustom from 'components/flatListCustom';
import { localizes } from 'locales/i18n';
import ItemCompany from './itemCompany';
import StorageUtil from 'utils/storageUtil';
import screenType from 'enum/screenType';
import ic_search_white from "images/ic_search_white.png";
import ic_search_black from 'images/ic_search_black.png';
import ic_cancel from 'images/ic_cancel.png';
import DialogCustom from 'components/dialogCustom';

class CompanyListView extends BaseView {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            enableLoadMore: false,
            enableRefresh: true,
            isLoadingMore: false,
            refreshing: true,
            companies: [],
            typing: false,
            typingTimeout: 0,
            isSearch: false,
            txtSearch: null,
            isAlert: false
        };
        this.filter = {
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            stringSearch: null
        };
        this.showNoData = false;
        this.fromScreen = navigation.getParam("screenType");
    }

    componentDidMount() {
        if (!Utils.isNull(this.fromScreen)) {
            BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
            this.getSourceUrlPath();
            this.handleRequest();
        } else {
            this.props.getConfig({ companyId: 1, branchId: null });
        }
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
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.isLoadingMore = false;
                if (this.props.action == getActionSuccess(ActionEvent.GET_COMPANIES)) {
                    this.state.refreshing = false;
                    if (!Utils.isNull(data)) {
                        if (data.paging.page == 0) {
                            this.state.companies = [];
                        }
                        this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE);
                        if (data.data.length > 0) {
                            data.data.forEach(item => {
                                this.state.companies.push({ ...item });
                            });
                        }
                        console.log("GET_COMPANIES", this.state.companies)
                    }
                    this.showNoData = true;
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_CONFIG)) {
                    this.configList = data;
                    StorageUtil.storeItem(StorageUtil.MOBILE_CONFIG, this.configList);
                    this.getSourceUrlPath();
                    this.handleRequest();
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
                this.state.refreshing = false;
            }
        }
    }

    //onHandleRequest
    handleRequest = () => {
        this.props.getCompanies(this.filter);
    }

    //onRefreshing
    handleRefresh = () => {
        this.state.refreshing = true;
        this.filter.paging.page = 0;
        this.handleRequest();
    }

    //onLoadMore
    onLoadMore = () => {
        if (!this.props.isLoading) {
            this.state.isLoadingMore = true;
            this.filter.paging.page += 1;
            this.handleRequest();
        }
    }

    componentWillUnmount() {
        !Utils.isNull(this.fromScreen) && BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }

    /**
     * Render mid menu
     */
    renderMidMenu = () => {
        return !this.state.isSearch && <View style={{ flex: 1 }} />
    }

    /**
     * On submit editing
     */
    onSubmitEditing = () => {

    }

    render() {
        const { companies, isSearch } = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <Header hasTabs style={commonStyles.header}>
                        {this.renderHeaderView({
                            visibleBack: !Utils.isNull(this.fromScreen),
                            title: "DANH S??CH C??NG TY",
                            titleStyle: { textAlign: 'center', color: Colors.COLOR_WHITE },
                            visibleSearchBar: isSearch,
                            onPressRightSearch: () => {
                                this.filter.stringSearch = null;
                                this.onToggleSearch();
                                this.handleRefresh();
                            },
                            iconRightSearch: ic_cancel,
                            placeholder: localizes("search"),
                            onRef: ref => {
                                this.txtSearch = ref
                            },
                            iconLeftSearch: ic_search_black,
                            styleIconLeftSearch: { width: 20, height: 20 },
                            autoFocus: true,
                            onSubmitEditing: this.onSubmitEditing,
                            onPressLeftSearch: () => { },
                            renderMidMenu: this.renderMidMenu,
                            onChangeTextInput: this.onChangeTextInput,
                            renderLeftMenu: Utils.isNull(this.fromScreen) && this.renderLeftMenu,
                            renderRightMenu: this.renderRightMenu
                        })}
                    </Header>
                    <FlatListCustom
                        ref={(r) => { this.listRef = r }}
                        // ListHeaderComponent={companies.length > 0 && this.renderListHeaderComponent}
                        contentContainerStyle={{
                            flexGrow: 1,
                            // paddingTop: Constants.PADDING_LARGE,
                            backgroundColor: companies.length > 0 ? Colors.COLOR_WHITE : Colors.COLOR_BACKGROUND
                        }}
                        style={{ flex: 1 }}
                        data={companies}
                        renderItem={this.renderItem}
                        enableRefresh={this.state.enableRefresh}
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        enableLoadMore={this.state.enableLoadMore}
                        onLoadMore={this.onLoadMore}
                        showsVerticalScrollIndicator={false}
                        isShowEmpty={this.showNoData}
                        isShowImageEmpty={true}
                        textForEmpty={localizes("noData")}
                        styleEmpty={{ marginTop: Constants.MARGIN_LARGE }}
                    />
                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                    {this.logoutDialog()}
                </Root>
            </Container>
        );
    }

    /**
     * Render left menu
     */
    renderLeftMenu = () => {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    justifyContent: "center",
                    padding: Constants.PADDING_LARGE
                }}
                onPress={() => this.setState({ isAlert: true })}
            >
                <Image source={ic_logout_white} />
            </TouchableOpacity>
        )
    }

    /**
     * Render right menu
     */
    renderRightMenu = () => {
        const { isSearch } = this.state;
        return (
            !isSearch
            && <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    justifyContent: "center",
                    padding: Constants.PADDING_LARGE
                }}
                onPress={() => this.onToggleSearch()}
            >
                <Image source={ic_search_white} />
            </TouchableOpacity>
        )
    }

    /**
     * Manager text input search 
     * @param {*} stringSearch 
     */
    onChangeTextInput = (stringSearch) => {
        const self = this;
        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout)
        }
        this.setState({
            txtSearch: stringSearch == "" ? null : stringSearch,
            typing: false,
            typingTimeout: setTimeout(() => {
                if (!Utils.isNull(stringSearch)) {
                    this.onSearch(stringSearch)
                } else {
                    this.handleRefresh()
                }
            }, 1000)
        });
    }

    onSearch(text) {
        this.filter.stringSearch = text;
        if (!Utils.isNull(text)) {
            this.handleRefresh();
        }
    }

    /**
     * on toggle search
     */
    onToggleSearch() {
        if (!this.state.isSearch) {
            this.setState({
                isSearch: !this.state.isSearch
            }, () => { this.txtSearch.focus() });
        } else {
            this.setState({
                txtSearch: null,
                isSearch: !this.state.isSearch
            })
        }
    }

    /**
     * Render list header component
     */
    renderListHeaderComponent = () => {
        return <Text style={[commonStyles.textBold, { marginHorizontal: Constants.MARGIN_X_LARGE }]}>
            Danh s??ch c??ng ty
        </Text>
    }

    /**
     * Render item
     */
    renderItem = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemCompany
                key={index.toString()}
                item={item}
                index={index}
                lengthData={this.state.companies.length}
                urlPathResize={this.resourceUrlPathResize.textValue}
                urlPath={this.resourceUrlPath.textValue}
                onPress={this.onPressItem}
            />
        )
    }

    /**
     * On press item
     */
    onPressItem = (data) => {
        let companyInfo = {
            company: data,
            branch: null
        }
        StorageUtil.storeItem(StorageUtil.COMPANY_INFO, companyInfo);
        if (!Utils.isNull(data.branches)) {
            this.props.navigation.navigate("BranchList", {
                company: data
            });
        } else {
            this.goHomeScreen();
        }
    }

    /**
     * show dialog logout
     */
    logoutDialog = () => (
        <DialogCustom
            visible={this.state.isAlert}
            isVisibleTitle={true}
            isVisibleContentText={true}
            isVisibleTwoButton={true}
            contentTitle={localizes("confirm")}
            textBtnOne={localizes("cancel")}
            textBtnTwo={localizes("setting.log_out")}
            contentText={localizes('slidingMenu.want_out')}
            onTouchOutside={() => { this.setState({ isAlert: false }) }}
            onPressX={() => { this.setState({ isAlert: false }) }}
            onPressBtnPositive={() => {
                StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN).then((token) => {
                    if (token != undefined) {
                        // const deviceId = DeviceInfo.getDeviceId();
                        let filter = {
                            deviceId: "",
                            deviceToken: token
                        }
                        this.props.deleteUserDeviceInfo(filter) // delete device info
                    } else {
                        console.log('token null')
                    }
                }).catch((error) => {
                    //this callback is executed when your Promise is rejected
                    this.saveException(error, 'logoutDialog')
                });
                StorageUtil.deleteItem(StorageUtil.USER_PROFILE)
                    .then(user => {
                        console.log("user setting", user);
                        if (Utils.isNull(user)) {
                            this.showMessage(localizes('setting.logoutSuccess'))
                            this.setState({ isAlert: false })
                            this.logout()
                            this.goLoginScreen()
                        } else {
                            this.showMessage(localizes('setting.logoutFail'))
                        }
                    })
                    .catch(error => {
                        this.saveException(error, 'logoutDialog')
                    });
                // this.signOutFB(this.state.userFB)
                // this.signOutGG(this.state.userGG)
            }}
        />
    )
}

const mapStateToProps = state => ({
    data: state.company.data,
    action: state.company.action,
    isLoading: state.company.isLoading,
    error: state.company.error,
    errorCode: state.company.errorCode
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyListView);