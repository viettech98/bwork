import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    BackHandler,
    RefreshControl,
    Dimensions
} from 'react-native';
import {
    Content,
    Container,
    Root,
    Header
} from 'native-base';
import BaseView from 'containers/base/baseView';
import * as actions from "actions/userActions";
import * as commonActions from "actions/commonActions";
import * as timekeepingActions from "actions/timekeepingActions";
import * as salaryAction from "actions/salaryAction";
import { connect } from "react-redux";
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { Constants } from 'values/constants';
import Utils from 'utils/utils';
import styles from './styles';
import commonStyles from "styles/commonStyles";
import { Colors } from 'values/colors';
import { localizes } from 'locales/i18n';
import ic_add_black from "images/ic_add_black.png";
import ic_check from "images/ic_check.png";
import TextInputCustom from 'components/textInputCustom';
import ic_calendar_grey from "images/ic_calendar_grey.png";
import Hr from 'components/hr';
import { TextInputMask } from 'react-native-masked-text'
import { CalendarScreen } from 'components/calendarScreen';
import DateUtil from 'utils/dateUtil';
import workingTimeShiftType from 'enum/workingTimeShiftType';
import ic_down_grey from 'images/ic_down_grey.png';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from "react-native-popup-menu";
import StringUtil from 'utils/stringUtil';
import sabbaticalOffType from 'enum/sabbaticalOffType';
import { RadioGroup, RadioButton } from 'react-native-ui-lib';
import salaryInputType from 'enum/salaryInputType';
import ModalConfigStaff from './modalConfigStaff';
import moment, { locales } from "moment";

const screen = Dimensions.get("window");

class ConfigStaffView extends BaseView {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            enableRefresh: true,
            refreshing: true,
            salaryInput: salaryInputType.MONTH,
            salaryNumber: '',
            numWorkingHour: '',
            numDayOffInMonth: '',
            workingTimeShift: workingTimeShiftType.FULL_WORKING_DAY,
            startWorkingTime1: '',
            startWorkingTime2: '',
            endWorkingTime1: '',
            endWorkingTime2: ''
        };
        this.staffId = navigation.getParam('staffId');
        this.callback = navigation.getParam('callback');
        this.isApproval = navigation.getParam('isApproval');
        this.filter = {};
        this.shiftType = {
            START_1: 1,
            END_1: 2,
            START_2: 3,
            END_2: 4
        };
        this.shiftTypeSelected = null;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
        this.handleRequest();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
     * Get date from hour
     */
    getDateFromHour = (hour) => {
        let nowSqlString = DateUtil.convertFromFormatToFormat(DateUtil.now(), DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_DATE_SQL);
        return DateUtil.convertFromFormatToFormat(nowSqlString + " " + hour, DateUtil.FORMAT_DATE_TIME_SQL, DateUtil.FORMAT_DATE_TIME_ZONE_T);
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_WORKING_TIME_CONFIG_BY_USER_ID)) {
                    this.state.refreshing = false;
                    if (!Utils.isNull(data)) {
                        this.state.workingTimeShift = data.shiftType;
                        this.state.numWorkingHour = data.numWorkingHours + '';
                        this.state.numDayOffInMonth = data.numDayOffInMonth + '';
                        this.state.startWorkingTime1 = new Date(this.getDateFromHour(data.startWorkingTime1));
                        this.state.endWorkingTime1 = new Date(this.getDateFromHour(data.endWorkingTime1));
                        this.state.startWorkingTime2 = !Utils.isNull(data.startWorkingTime2) ? new Date(this.getDateFromHour(data.startWorkingTime2)) : '';
                        this.state.endWorkingTime2 = !Utils.isNull(data.endWorkingTime2) ? new Date(this.getDateFromHour(data.endWorkingTime2)) : '';
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_SALARY_CONFIG)) {
                    if (!Utils.isNull(data)) {
                        this.state.salaryNumber = data.salary + "";
                        this.state.salaryInput = data.inputType;
                    }
                    this.props.getWorkingTimeConfigByUserId(this.staffId);
                } else if (this.props.action == getActionSuccess(ActionEvent.CONFIG_STAFF)) {
                    if (data) {
                        this.showMessage("C???u h??nh th??nh c??ng.");
                        this.callback();
                        this.onBack();
                    }
                }
            } else if (this.props.errorCode == ErrorCode.HAS_SABBATICAL_REGISTERED) {
                this.showMessage("B???n ???? c?? ????n xin ngh??? v??o th???i gian n??y.");
            } else {
                this.handleError(this.props.errorCode, this.props.error);
                this.state.refreshing = false;
            }
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }

    /**
     * On register
     */
    onRegister = () => {
        const {
            salaryInput,
            salaryNumber,
            numWorkingHour,
            numDayOffInMonth,
            startWorkingTime1,
            startWorkingTime2,
            endWorkingTime1,
            endWorkingTime2,
            workingTimeShift
        } = this.state;
        let numHourSet = ((DateUtil.getTimestamp(endWorkingTime1) - DateUtil.getTimestamp(startWorkingTime1))
            + (DateUtil.getTimestamp(endWorkingTime2) - DateUtil.getTimestamp(startWorkingTime2))) / 1000 / 60 / 60;
        if (StringUtil.isNullOrEmpty(salaryNumber.trim())) {
            this.showMessage("Vui l??ng nh???p m???c l????ng!");
        } else if (StringUtil.isNullOrEmpty(numWorkingHour.trim())) {
            this.showMessage("Vui l??ng nh???p s??? gi??? l??m!");
        } else if (StringUtil.isNullOrEmpty(numDayOffInMonth.trim())) {
            this.showMessage("Vui l??ng nh???p s??? ng??y ngh??? trong th??ng!");
        } else if (StringUtil.isNullOrEmpty(startWorkingTime1)) {
            this.showMessage("Vui l??ng nh???p gi??? b???t ?????u!");
        } else if (StringUtil.isNullOrEmpty(endWorkingTime1)) {
            this.showMessage("Vui l??ng nh???p gi??? ngh??? gi???a tr??a!");
        } else if (workingTimeShift == workingTimeShiftType.FULL_WORKING_DAY && StringUtil.isNullOrEmpty(startWorkingTime2)) {
            this.showMessage("Vui l??ng nh???p gi??? b???t ?????u l???i!");
        } else if (workingTimeShift == workingTimeShiftType.FULL_WORKING_DAY && StringUtil.isNullOrEmpty(endWorkingTime2)) {
            this.showMessage("Vui l??ng nh???p gi??? k???t th??c!");
        } else if (
            Number(numWorkingHour) !== Number(numHourSet)
            || numWorkingHour <= 0
            || DateUtil.convertFromFormatToFormat(startWorkingTime1, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME_SECOND)
            === DateUtil.convertFromFormatToFormat(endWorkingTime1, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME_SECOND)
            || DateUtil.getTimestamp(startWorkingTime1) > DateUtil.getTimestamp(endWorkingTime1)
            || (workingTimeShift == workingTimeShiftType.FULL_WORKING_DAY && (DateUtil.convertFromFormatToFormat(startWorkingTime2, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME_SECOND)
                === DateUtil.convertFromFormatToFormat(endWorkingTime2, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME_SECOND)
                || DateUtil.getTimestamp(startWorkingTime2) < DateUtil.getTimestamp(endWorkingTime1)
                || DateUtil.getTimestamp(startWorkingTime2) > DateUtil.getTimestamp(endWorkingTime2)))
        ) {
            this.showMessage("B???n ???? nh???p sai s??? gi??? l??m ho???c th???i gian l??m.");
        } else {
            this.filter = {
                salaryInputType: salaryInput,
                salaryNumber: salaryNumber.trim().split('.').join(""),
                workingTimeShiftType: workingTimeShift,
                numWorkingHour: numWorkingHour.trim(),
                numDayOffInMonth: numDayOffInMonth.trim(),
                startWorkingTime1: DateUtil.convertFromFormatToFormat(startWorkingTime1, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME_SECOND),
                startWorkingTime2: !StringUtil.isNullOrEmpty(startWorkingTime2)
                    ? DateUtil.convertFromFormatToFormat(startWorkingTime2, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME_SECOND)
                    : null,
                endWorkingTime1: DateUtil.convertFromFormatToFormat(endWorkingTime1, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME_SECOND),
                endWorkingTime2: !StringUtil.isNullOrEmpty(endWorkingTime2)
                    ? DateUtil.convertFromFormatToFormat(endWorkingTime2, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME_SECOND)
                    : null,
                validFrom: null
            }
            if (this.isApproval) {
                let now = DateUtil.now();
                let validFrom = DateUtil.convertFromFormatToFormat(new Date(now.getFullYear(), now.getMonth(), 1), DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_DATE_SQL);
                this.filter.validFrom = validFrom;
                this.props.configStaff({ filter: this.filter, staffId: this.staffId });
            } else {
                this.openModal();
            }
        }
    }

    /**
     * Handle request
     */
    handleRequest = () => {
        this.props.getSalaryConfig({
            userId: this.staffId,
            firstDayOfMonth: `${DateUtil.convertFromFormatToFormat(DateUtil.now(), DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_MONTH_OF_YEAR)}-01`
        });
    }

    /**
     * Handle refresh
     */
    handleRefresh = () => {
        this.state.refreshing = true;
        this.handleRequest();
    }

    render() {
        const {
            salaryInput,
            salaryNumber,
            numWorkingHour,
            numDayOffInMonth,
            startWorkingTime1,
            startWorkingTime2,
            endWorkingTime1,
            endWorkingTime2,
            workingTimeShift
        } = this.state;
        let numHourSet = ((DateUtil.getTimestamp(endWorkingTime1) - DateUtil.getTimestamp(startWorkingTime1))
            + (DateUtil.getTimestamp(endWorkingTime2) - DateUtil.getTimestamp(startWorkingTime2))) / 1000 / 60 / 60
        return (
            <Container style={styles.container}>
                <Root>
                    <Header hasTabs style={commonStyles.header}>
                        {this.renderHeaderView({
                            title: "C???U H??NH NH??N VI??N",
                            titleStyle: { color: Colors.COLOR_WHITE },
                            renderRightMenu: this.renderRightMenu
                        })}
                    </Header>
                    <Content
                        contentContainerStyle={{ flexGrow: 1 }}
                        style={{ flex: 1 }}
                        enableRefresh={this.state.enableRefresh}
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        showsVerticalScrollIndicator={false}>
                        <View style={{ marginVertical: Constants.MARGIN_LARGE }}>
                            {/* Salary config */}
                            <Text style={[commonStyles.textBold, {
                                marginHorizontal: Constants.MARGIN_X_LARGE,
                                color: Colors.COLOR_PRIMARY
                            }]}>C???u h??nh l????ng</Text>
                            <RadioGroup
                                style={styles.radioGroup}
                                initialValue={salaryInput}
                                onValueChange={(salaryInput) => {
                                    this.setState({ salaryInput })
                                }}>
                                <RadioButton
                                    color={Colors.COLOR_PRIMARY}
                                    label={"L????ng th??ng"}
                                    value={salaryInputType.MONTH}
                                    size={16}
                                    labelStyle={{ marginRight: Constants.MARGIN_X_LARGE }}
                                />
                                <RadioButton
                                    color={Colors.COLOR_PRIMARY}
                                    label={"L????ng theo gi???"}
                                    value={salaryInputType.HOUR}
                                    size={16}
                                    labelStyle={{ marginRight: Constants.MARGIN_X_LARGE }}
                                />
                            </RadioGroup>
                            {/* Salary */}
                            <View style={{ marginHorizontal: Constants.MARGIN_X_LARGE }}>
                                <Text style={[commonStyles.text, {
                                    margin: 0
                                }]}>M???c l????ng</Text>
                                <TextInputMask
                                    style={[commonStyles.text, commonStyles.inputText, {
                                        paddingHorizontal: 0,
                                        flex: 1,
                                        elevation: 0
                                    }]}
                                    ref={input => (this.salaryNumber = input)}
                                    placeholder={"Nh???p m???c l????ng"}
                                    type={'money'}
                                    options={{
                                        precision: 0,
                                        separator: '.',
                                        delimiter: '',
                                        unit: '',
                                        suffixUnit: ''
                                    }}
                                    value={salaryNumber}
                                    onChangeText={salaryNumber => {
                                        this.setState({ salaryNumber });
                                    }}
                                    keyboardType="numeric"
                                    returnKeyType={"next"}
                                    blurOnSubmit={false} //focus 
                                />
                                <Hr />
                            </View>
                        </View>
                        {/* Working time config */}
                        <View style={{ marginVertical: Constants.MARGIN_LARGE }}>
                            <Text style={[commonStyles.textBold, {
                                marginHorizontal: Constants.MARGIN_X_LARGE,
                                color: Colors.COLOR_PRIMARY
                            }]}>C???u h??nh ca l??m vi???c</Text>
                            <RadioGroup
                                style={styles.radioGroup}
                                initialValue={workingTimeShift}
                                onValueChange={(workingTimeShift) => {
                                    let state = this.state;
                                    if (workingTimeShift == workingTimeShiftType.PARTLY_WORKING_DAY) {
                                        state.endWorkingTime2 = '';
                                        state.startWorkingTime2 = '';
                                    }
                                    state.workingTimeShift = workingTimeShift;
                                    this.setState(state);
                                }}>
                                <RadioButton
                                    color={Colors.COLOR_PRIMARY}
                                    label={"Ca g??y"}
                                    value={workingTimeShiftType.FULL_WORKING_DAY}
                                    size={16}
                                    labelStyle={{ marginRight: Constants.MARGIN_X_LARGE }}
                                />
                                <RadioButton
                                    color={Colors.COLOR_PRIMARY}
                                    label={"Ca nguy??n"}
                                    value={workingTimeShiftType.PARTLY_WORKING_DAY}
                                    size={16}
                                    labelStyle={{ marginRight: Constants.MARGIN_X_LARGE }}
                                />
                            </RadioGroup>
                            <View style={styles.boxInput}>
                                <View style={{ flex: 1, marginHorizontal: Constants.MARGIN_LARGE }}>
                                    <Text style={[commonStyles.text, {
                                        margin: 0
                                    }]}>S??? gi??? l??m</Text>
                                    <TextInputCustom
                                        inputNormalStyle={{
                                            paddingHorizontal: 0
                                        }}
                                        refInput={input => {
                                            this.numWorkingHour = input
                                        }}
                                        isInputNormal={true}
                                        placeholder={"Nh???p s??? gi??? l??m"}
                                        value={numWorkingHour}
                                        onChangeText={numWorkingHour => this.setState({ numWorkingHour })}
                                        onSubmitEditing={() => { }}
                                        returnKeyType={"done"}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 1, marginHorizontal: Constants.MARGIN_LARGE }}>
                                    <Text style={[commonStyles.text, {
                                        margin: 0
                                    }]}>S??? ng??y ngh??? trong th??ng</Text>
                                    <TextInputCustom
                                        inputNormalStyle={{
                                            paddingHorizontal: 0
                                        }}
                                        refInput={input => {
                                            this.numDayOffInMonth = input
                                        }}
                                        isInputNormal={true}
                                        placeholder={"Nh???p s??? ng??y ngh???"}
                                        value={numDayOffInMonth}
                                        onChangeText={numDayOffInMonth => this.setState({ numDayOffInMonth })}
                                        onSubmitEditing={() => { }}
                                        returnKeyType={"done"}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                            <View style={styles.boxInput}>
                                <View style={{ flex: 1, marginHorizontal: Constants.MARGIN_LARGE }}>
                                    <Text style={[commonStyles.text, {
                                        margin: 0
                                    }]}>Gi??? b???t ?????u</Text>
                                    <TextInputCustom
                                        inputNormalStyle={{
                                            paddingHorizontal: 0
                                        }}
                                        ref={input => (this.startWorkingTime1 = input)}
                                        isInputAction={true}
                                        placeholder={"Ch???n gi??? b???t ?????u"}
                                        value={!StringUtil.isNullOrEmpty(startWorkingTime1.trim)
                                            ? ''
                                            : DateUtil.convertFromFormatToFormat(startWorkingTime1, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME)}
                                        onPress={() => this.showCalendarTime(this.shiftType.START_1)}
                                    />
                                </View>
                                <View style={{ flex: 1, marginHorizontal: Constants.MARGIN_LARGE }}>
                                    <Text style={[commonStyles.text, {
                                        margin: 0
                                    }]}>{workingTimeShift == workingTimeShiftType.FULL_WORKING_DAY
                                        ? "Gi??? ngh??? gi???a tr??a" : "Gi??? k???t th??c"}</Text>
                                    <TextInputCustom
                                        inputNormalStyle={{
                                            paddingHorizontal: 0
                                        }}
                                        ref={input => (this.endWorkingTime1 = input)}
                                        isInputAction={true}
                                        placeholder={workingTimeShift == workingTimeShiftType.FULL_WORKING_DAY
                                            ? "Ch???n gi??? ngh??? gi???a tr??a" : "Ch???n gi??? k???t th??c"}
                                        value={!StringUtil.isNullOrEmpty(endWorkingTime1.trim)
                                            ? ''
                                            : DateUtil.convertFromFormatToFormat(endWorkingTime1, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME)}
                                        onPress={() => this.showCalendarTime(this.shiftType.END_1)}
                                    />
                                </View>
                            </View>
                            {workingTimeShift == workingTimeShiftType.FULL_WORKING_DAY
                                && <View style={styles.boxInput}>
                                    <View style={{ flex: 1, marginHorizontal: Constants.MARGIN_LARGE }}>
                                        <Text style={[commonStyles.text, {
                                            margin: 0
                                        }]}>Gi??? b???t ?????u l???i</Text>
                                        <TextInputCustom
                                            inputNormalStyle={{
                                                paddingHorizontal: 0
                                            }}
                                            ref={input => (this.startWorkingTime2 = input)}
                                            isInputAction={true}
                                            placeholder={"Nh???p gi??? b???t ?????u l???i"}
                                            value={!StringUtil.isNullOrEmpty(startWorkingTime2.trim)
                                                ? ''
                                                : DateUtil.convertFromFormatToFormat(startWorkingTime2, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME)}
                                            onPress={() => this.showCalendarTime(this.shiftType.START_2)}
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: Constants.MARGIN_LARGE }}>
                                        <Text style={[commonStyles.text, {
                                            margin: 0
                                        }]}>Gi??? k???t th??c</Text>
                                        <TextInputCustom
                                            inputNormalStyle={{
                                                paddingHorizontal: 0
                                            }}
                                            ref={input => (this.endWorkingTime2 = input)}
                                            isInputAction={true}
                                            placeholder={"Ch???n gi??? k???t th??c"}
                                            value={!StringUtil.isNullOrEmpty(endWorkingTime2.trim)
                                                ? ''
                                                : DateUtil.convertFromFormatToFormat(endWorkingTime2, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_TIME)}
                                            onPress={() => this.showCalendarTime(this.shiftType.END_2)}
                                        />
                                    </View>
                                </View>
                            }
                            {/* Total num working */}
                            <View style={{ marginVertical: Constants.MARGIN_LARGE }}>
                                <Text style={[commonStyles.textBold, {
                                    marginHorizontal: Constants.MARGIN_X_LARGE,
                                    color: Colors.COLOR_PRIMARY
                                }]}>
                                    T???ng s??? gi??? set ca: {numHourSet}
                                </Text>
                            </View>
                        </View>
                    </Content>
                    <ModalConfigStaff
                        ref={'modalConfigStaff'}
                        onConfirm={(validFrom) => {
                            this.filter.validFrom = validFrom;
                            this.props.configStaff({ filter: this.filter, staffId: this.staffId });
                            this.hideModal();
                        }}
                    />
                    <CalendarScreen
                        minimumDate={new Date(new Date().setDate(DateUtil.now().getDate() + 1))}
                        dateCurrent={DateUtil.now()}
                        chooseDate={this.chooseDate}
                        mode={"time"}
                        ref={ref => this.showCalendar = ref} />
                    {this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }

    /**
     * Date press
     */
    chooseDate = (day) => {
        switch (this.shiftTypeSelected) {
            case this.shiftType.START_1:
                this.setState({
                    startWorkingTime1: day
                })
                break;
            case this.shiftType.END_1:
                this.setState({
                    endWorkingTime1: day
                })
                break;
            case this.shiftType.START_2:
                this.setState({
                    startWorkingTime2: day
                })
                break;
            case this.shiftType.END_2:
                this.setState({
                    endWorkingTime2: day
                })
                break;
            default:
                break;
        }
    }

    /**
     * Show calendar time
     */
    showCalendarTime = (shiftType) => {
        this.shiftTypeSelected = shiftType;
        this.showCalendar.showDateTimePicker();
    }

    /**
     * Open modal
     */
    openModal() {
        this.refs.modalConfigStaff.showModal();
    }

    /**
     * Hide modal
     */
    hideModal() {
        this.refs.modalConfigStaff.hideModal();
    }


    /**
     * Render right menu
     */
    renderRightMenu = () => {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    justifyContent: "center",
                    padding: Constants.PADDING_LARGE
                }}
                onPress={this.onRegister}
            >
                <Image source={ic_check} />
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = state => ({
    data: state.configStaff.data,
    action: state.configStaff.action,
    isLoading: state.configStaff.isLoading,
    error: state.configStaff.error,
    errorCode: state.configStaff.errorCode

});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
    ...timekeepingActions,
    ...salaryAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigStaffView);