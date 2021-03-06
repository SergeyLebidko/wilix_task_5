import React, {useState} from 'react';
import {Checkbox, Stack, TextField, Typography} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useDispatch, useSelector} from 'react-redux';
import {Color} from 'material-ui-color';

import {createPost} from '../../../redux/post_list';
import {loggedUserSelector, postListStatusSelector, tagListStatusSelector} from '../../../redux/selectors';
import useNavigator from '../../../helpers/hooks/useNavigator';
import PreloaderButton from '../../common/PreloaderButton/PreloaderButton';
import TagListCreator from '../../common/TagListCreator/TagListCreator';
import {createTagList} from '../../../redux/tag_list';
import {TUser, TTag, TTextColorMap, TColorParts} from '../../../types';
import {DEFAULT_TAG_COLOR_PARAMS} from '../../../constants';

type TFormFieldNames = 'title' | 'text';

type TCreatePostFormData = {
    title: string,
    text: string
}

const CreatePost: React.FC = () => {
    const {toMain} = useNavigator();
    const dispatch = useDispatch();
    const loggedUser = useSelector(loggedUserSelector);

    const [textColorMap, setTextColorMap] = useState<TTextColorMap>({});
    const [isCommentEnabled, setIsCommentEnabled] = useState(true);
    const [formData, setFormData] = useState<TCreatePostFormData>({
        title: '',
        text: ''
    });

    const postListStatus = useSelector(postListStatusSelector);
    const tagListStatus = useSelector(tagListStatusSelector);
    const isPostListPending = postListStatus === 'pending' || tagListStatus === 'pending';

    const getColorParts = (color: Color | string): TColorParts => {
        if (typeof color === 'string'){
            return DEFAULT_TAG_COLOR_PARAMS;
        } else {
            return color.rgb as TColorParts
        }
    }

    const fieldChangeHandler = (fieldName: TFormFieldNames) => {
        return (event: React.ChangeEvent) => {
            const nextValue = (event.target as HTMLInputElement).value;
            if (fieldName === 'title') {
                setFormData(oldData => ({
                    ...oldData,
                    title: nextValue
                }));
            }
            if (fieldName === 'text') {
                setFormData(oldData => ({
                    ...oldData,
                    text: nextValue
                }));
            }
        }
    };

    const commentEnabledChangeHandler = (): void => setIsCommentEnabled(oldValue => !oldValue);

    const createPostButtonClickHandler = async () => {
        // ?????????????? ????????
        const result = await dispatch(createPost({
            user_id: (loggedUser as TUser).id as number,
            title: formData.title,
            text: formData.text,
            is_comments_enabled: isCommentEnabled,
            dt_created: +new Date()
        }));

        // ?????????????? ???????????? ??????????, ?????????????????? ?? ????????????
        const tagList: TTag[] = [];
        for(const key of Object.keys(textColorMap)){
            tagList.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                post_id: result.payload.id,
                text: key,
                color:  getColorParts(textColorMap[key].color)
            });
        }
        await dispatch(createTagList(tagList));

        // ?????????? ???????????????????? "??????????????" ???????????????? - ?????????????????? ???????????????????????? ???? ?????????????? ????????????????
        toMain();
    };

    const isCreatePostButtonDisabled = !formData.title || !formData.text;

    return (
        <Stack spacing={2}>
            <Typography variant='h5' gutterBottom component='div' sx={{textAlign: 'center'}}>
                ?????????? ????????
            </Typography>
            <TextField
                id='post_title_field'
                label='??????????????????'
                variant='outlined'
                required
                value={formData.title}
                disabled={isPostListPending}
                onChange={fieldChangeHandler('title')}
                sx={{backgroundColor: 'white'}}
            />
            <TextField
                id='post_text_field'
                label='??????????'
                multiline
                rows={8}
                value={formData.text}
                disabled={isPostListPending}
                onChange={fieldChangeHandler('text')}
                sx={{backgroundColor: 'white'}}
            />
            <TagListCreator
                textColorMap={textColorMap}
                setTextColorMap={setTextColorMap}
                isDisabled={isPostListPending}
            />
            <FormControlLabel
                control={<Checkbox/>}
                label="?????????????????? ???????????? ?????????????????????????? ???????????????????????????? ???????????? ????????"
                onChange={commentEnabledChangeHandler}
            />
            <PreloaderButton
                isLoading={isPostListPending}
                isDisabled={isCreatePostButtonDisabled}
                clickHandler={createPostButtonClickHandler}
                label='????????????????????????'
            />
        </Stack>
    );
};

export default CreatePost;
