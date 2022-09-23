import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.GET_MEMBER_OF_CONVERSATION:
        case ActionEvent.GET_LIST_CONVERSATION:
        case ActionEvent.GET_FRIENDS_CHAT_VIEW:
        case ActionEvent.CREATE_CONVERSATION:
        case ActionEvent.EDIT_CHAT_GROUP:
        case ActionEvent.DELETE_CONVERSATION:
        case ActionEvent.SEARCH_CONVERSATION:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type
            }
        case getActionSuccess(ActionEvent.GET_MEMBER_OF_CONVERSATION):
        case getActionSuccess(ActionEvent.GET_LIST_CONVERSATION):
        case getActionSuccess(ActionEvent.GET_FRIENDS_CHAT_VIEW):
        case getActionSuccess(ActionEvent.CREATE_CONVERSATION):
        case getActionSuccess(ActionEvent.EDIT_CHAT_GROUP):
        case getActionSuccess(ActionEvent.DELETE_CONVERSATION):
        case getActionSuccess(ActionEvent.SEARCH_CONVERSATION):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
        case ActionEvent.REQUEST_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
                errorCode: action.payload.errorCode,
                action: action.type
            }
        default:
            return state;
    }
}