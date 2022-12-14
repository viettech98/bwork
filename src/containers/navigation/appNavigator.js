import BranchListView from "containers/branch/branchListView";
import ChatView from "containers/chat/chat/chatView";
import CreateConversationGroupView from "containers/chat/createGroup/createConversationGroupView";
import CreateConversationNewView from "containers/chat/createGroup/createConversationNewView";
import EditInfoChatView from "containers/chat/edit/editInfoChatView";
import ListChatView from "containers/chat/list/listChatView";
import ListMemberChatView from "containers/chat/member/listMemberChatView";
import CompanyListView from "containers/company/companyListView";
import ConfigStaffView from "containers/configStaff/configStaffView";
import Demo from 'containers/demo/demo';
import ListDepartmentView from "containers/department/listDepartment/listDepartment";
import ListStaffDepartmentView from "containers/department/listStaffDepartment/listStaffDepartment";
import CompanyDetailView from "containers/home/company/companyDetailView";
import Main from 'containers/main/bottomTabNavigator';
import MainAdmin from 'containers/main/bottomTabNavigatorAdmin';
import SabbaticalAdminView from "containers/sabbatical/admin/sabbaticalAdminView";
import RegisterSabbaticalView from "containers/sabbatical/register/registerSabbaticalView";
import SalaryHistoryDetailView from "containers/salary/detail/salaryHistoryDetailView";
import SalaryHistoryView from "containers/salary/history/salaryHistoryView";
import SplashView from 'containers/splash/splashView';
import TaskDetailView from 'containers/task/details/taskDetailView';
import TaskManagerView from 'containers/task/taskManagerView';
import TimekeepingHistoryDetailView from "containers/timekeeping/history/detail/timekeepingHistoryDetailView";
import TimekeepingHistoryView from "containers/timekeeping/history/timekeepingHistoryView";
import TimekeepingAdminView from "containers/timekeeping/timekeepingAdminView";
import ChangePasswordView from 'containers/user/changePassword/changePasswordView';
import QuestionAnswerView from 'containers/user/faq/questionAnswerView';
import WorkingPolicyView from "containers/user/faq/workingPolicyView";
import ConfirmPasswordView from 'containers/user/forgotPassword/confirmPassword/confirmPasswordView';
import ForgotPasswordView from 'containers/user/forgotPassword/forgotPasswordView';
import LoginAdminView from "containers/user/login/loginAdminView";
import LoginView from 'containers/user/login/loginView';
import NotificationView from 'containers/user/notification/notificationView';
import OTPView from 'containers/user/otp//otpView';
import UserInfoView from "containers/user/profile/info/userInfoView";
import UserProfileView from 'containers/user/profile/info/userProfileView';
import SettingAlarmView from 'containers/user/profile/setting/settingAlarmView';
import DepartmentView from "containers/user/register/department/departmentView";
import RegisterPartnerView from "containers/user/register/partner/registerPartnerView";
import RegisterView from 'containers/user/register/registerView';
import { Animated, Easing } from "react-native";
import { createAppContainer, createStackNavigator } from 'react-navigation';

const AppNavigator = createStackNavigator(
    {
        Splash: SplashView,
        Login: LoginView,
        LoginAdmin: LoginAdminView,
        Register: RegisterView,
        Profile: UserProfileView,
        Main: Main,
        MainAdmin: MainAdmin,
        Notification: NotificationView,
        QuestionAnswer: QuestionAnswerView,
        Demo: Demo,
        ChangePassword: ChangePasswordView,
        ForgotPassword: ForgotPasswordView,
        ConfirmPassword: ConfirmPasswordView,
        OTP: OTPView,
        RegisterPartner: RegisterPartnerView,
        UserInfo: UserInfoView,
        SalaryHistory: SalaryHistoryView,
        SalaryHistoryDetail: SalaryHistoryDetailView,
        TimekeepingHistory: TimekeepingHistoryView,
        TimekeepingHistoryDetail: TimekeepingHistoryDetailView,
        WorkingPolicy: WorkingPolicyView,
        SettingAlarm: SettingAlarmView,
        EditInfoChat: EditInfoChatView,
        ListMemberChat: ListMemberChatView,
        CompanyDetail: CompanyDetailView,
        RegisterSabbatical: RegisterSabbaticalView,
        Department: DepartmentView,
        DepartmentList: ListDepartmentView,
        StaffDepartmentList: ListStaffDepartmentView,
        CompanyList: CompanyListView,
        BranchList: BranchListView,
        SabbaticalAdminHome: SabbaticalAdminView,
        TimekeepingAdminHome: TimekeepingAdminView,
        // FaceDetection: FaceDetectionView,
        ConfigStaff: ConfigStaffView,
        CreateConversationGroup: CreateConversationGroupView,
        CreateConversationNew: CreateConversationNewView,
        Chat: ChatView,
        ListChat: ListChatView,
        TaskManager: TaskManagerView,
        TaskDetail: TaskDetailView
    }, {
    initialRouteName: 'Splash',
    headerMode: 'none',
    defaultNavigationOptions: {
        gesturesEnabled: true,
    },
    transitionConfig: () => ({
        transitionSpec: {
            duration: 500,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true
        },
        screenInterpolator: sceneProps => {
            const { position, layout, scene, index, scenes } = sceneProps
            const toIndex = index
            const thisSceneIndex = scene.index
            const height = layout.initHeight
            const width = layout.initWidth

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
                outputRange: [width, 0, 0]
            })

            // Since we want the card to take the same amount of time
            // to animate downwards no matter if it's 3rd on the stack
            // or 53rd, we interpolate over the entire range from 0 - thisSceneIndex
            const translateY = position.interpolate({
                inputRange: [0, thisSceneIndex],
                outputRange: [height, 0]
            })

            const slideFromRight = { transform: [{ translateX }] }
            const slideFromBottom = { transform: [{ translateY }] }

            const lastSceneIndex = scenes[scenes.length - 1].index

            // Test whether we're skipping back more than one screen
            // and slide from bottom if true
            if (lastSceneIndex - toIndex > 1) {
                // Do not transoform the screen being navigated to
                if (scene.index === toIndex) return
                // Hide all screens in between
                if (scene.index !== lastSceneIndex) return { opacity: 0 }
                // Slide top screen down
                return slideFromBottom
            }
            // Otherwise slide from right
            return slideFromRight
        },
    }),
});

const BaseNavigatorContainer = createAppContainer(AppNavigator);

export { BaseNavigatorContainer as AppNavigator };
