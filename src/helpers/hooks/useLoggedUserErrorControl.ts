import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {ERROR_SHOW_TIMEOUT} from '../../constants';
import {loggedUserSlice} from '../../redux/logged_user';
import {loggedUserErrorSelector, loggedUserStatusSelector} from '../../redux/selectors';

const {resetLoggedUserError} = loggedUserSlice.actions;

// Хук, позволяющий контролировать отображение ошибок при выполнении 'сетевых' операций
// с учетной записью, таких как вход и регистрация.
// Первый возвращаемый параметр - признак ожидания выполнения запроса.
// Второй возвращаемый параметр - ошибка, возникшая при выполнении операции.
function useLoggedUserErrorControl(): [boolean, string | null] {
    const dispatch = useDispatch();

    const loggedUserError = useSelector(loggedUserErrorSelector);
    const loggedUserStatus = useSelector(loggedUserStatusSelector);
    const isUserDataPending = loggedUserStatus === 'pending';
    const isUserDataError = loggedUserStatus === 'error';

    const errorTimer: { current: NodeJS.Timeout | undefined } = useRef();

    const resetError = (): void => {
        dispatch(resetLoggedUserError());
    }

    const resetTimer = (): void => {
        if (typeof errorTimer.current !== 'undefined') clearTimeout(errorTimer.current);
    }

    // Сбрасываем таймер при размонтировании компонента и удаляем ошибку немедленно
    useEffect(() => {
        return () => {
            resetError();
            resetTimer();
        }
    }, []);

    // Если возникла ошибка входа - запускаем таймер, которые отключит её отображение через заданное время
    useEffect(() => {
        if (isUserDataError) {
            errorTimer.current = setTimeout(() => resetError(), ERROR_SHOW_TIMEOUT);
        }
    }, [isUserDataError]);

    return [isUserDataPending, loggedUserError];
}

export default useLoggedUserErrorControl;
