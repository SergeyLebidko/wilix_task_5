import {TRootState} from './store';
import {TComment, TPost, TStatus, TTag, TUser} from '../types';

// Селектор, возвращающий признак полной загрузки всех списков данных
export const allListDoneSelector = (state: TRootState): boolean => {
    const {
        user_list: {status: us},
        post_list: {status: ps},
        comment_list: {status: cs},
        tag_list: {status: ts}
    } = state;
    return us === 'done' && ps === 'done' && ts === 'done' && cs === 'done';
}

// Селекторы залогиненного пользователя
export const loggedUserStatusSelector = (state: TRootState): TStatus => state.logged_user.status;
export const loggedUserErrorSelector = (state: TRootState): string | null => state.logged_user.error;
export const loggedUserSelector = (state: TRootState): TUser | null => state.logged_user.data;

// Селектор списка пользователей
export const userListSelector = (state: TRootState): TUser[] => state.user_list.data;

// Селекторы списка постов
export const postListSelector = (state: TRootState): TPost[] => state.post_list.data;
export const postListStatusSelector = (state: TRootState): TStatus => state.post_list.status;

// Селекторы списка комментариев
export const commentListSelector = (state: TRootState): TComment[] => state.comment_list.data;

// Селекторы списка тегов
export const tagListSelector = (state: TRootState): TTag[] => state.tag_list.data;
export const tagListStatusSelector = (state: TRootState): TStatus => state.tag_list.status;
