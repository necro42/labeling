import { handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
//액션 타입
const LOAD_IMAGE_DATA_PENDING = 'LOAD_IMAGE_DATA_PENDING';
const LOAD_IMAGE_DATA_SUCCESS = 'LOAD_IMAGE_DATA_SUCCESS';
const LOAD_IMAGE_DATA_FAILURE = 'LOAD_IMAGE_DATA_FAILURE';

const SET_IMAGE_LABEL = 'SET_IMAGE_LABEL';
const SET_IMAGE_LABEL_NAME = 'SET_IMAGE_LABEL_NAME';

// 액션생성자
export const loadImageData = (seq) => (dispatch) => {
    dispatch({ type: LOAD_IMAGE_DATA_PENDING })
    return api.loadImageData(seq)
        .then((response) => {
            dispatch({ type: LOAD_IMAGE_DATA_SUCCESS, payload: response.data });
        })
        .catch((error) => {
            dispatch({
                type: LOAD_IMAGE_DATA_FAILURE,
                payload: error
            })
            throw (error);
        });
}

export const setImageLabel = ({ id, firstClick, secondClick }) => (dispatch) => {
    return dispatch({ type: SET_IMAGE_LABEL, payload: { id, firstClick, secondClick } })
}

export const setImageLabelName = (id, index, name) => (dispatch) => {
    return dispatch({ type: SET_IMAGE_LABEL_NAME, payload: { id, index, name } })
}

//초기상태 정의
const initialState = {
    imageList: {},
    process: null,
    error: false,
}

// 기본 핸들 액션
export default handleActions({
    [LOAD_IMAGE_DATA_PENDING]: (state, action) => {
        return { ...state, process: 'LOAD_IMAGE_DATA_PENDING' };
    },
    [LOAD_IMAGE_DATA_SUCCESS]: (state, action) => {
        // albumId: 2
        // id: 89
        // thumbnailUrl: "https://via.placeholder.com/150/21d35"
        // title: "id at cum incidunt nulla dolor vero tenetur"
        // url: "https://via.placeholder.com/600/21d35"

        if (state.imageList[action.payload.id]) {
            return state
        } else {
            return {
                ...state, process: 'LOAD_IMAGE_DATA_SUCCESS',
                imageList: {
                    ...state.imageList,
                    [action.payload.id]: {
                        ...action.payload,
                        labels: [],
                    }
                },
            }
        }
    },
    [LOAD_IMAGE_DATA_FAILURE]: (state, action) => {
        return {
            ...state, process: 'LOAD_IMAGE_DATA_SUCCESS',
        }
    },
    [SET_IMAGE_LABEL]: (state, action) => {
        const { id, firstClick, secondClick } = action.payload;
        let imageList = state.imageList;
        imageList[id].labels.push({
            id: id,
            index: imageList[id].labels.length,
            label: 'Class' + imageList[id].labels.length,
            width: Math.abs(firstClick[0] - secondClick[0]),
            height: Math.abs(firstClick[1] - secondClick[1]),
            x: firstClick[0] < secondClick[0] ? firstClick[0] : secondClick[0],
            y: firstClick[1] < secondClick[1] ? firstClick[1] : secondClick[1],
            location: [
                firstClick[0] < secondClick[0] ? firstClick[0] : secondClick[0],
                firstClick[1] < secondClick[1] ? firstClick[1] : secondClick[1],
                firstClick[0] > secondClick[0] ? firstClick[0] : secondClick[0],
                firstClick[1] > secondClick[1] ? firstClick[1] : secondClick[1]
            ]
        })
        return {
            ...state, process: 'SET_IMAGE_LABEL',
            imageList
        }
    },
    [SET_IMAGE_LABEL_NAME]: (state, action) => {
        const { id, index, name } = action.payload;
        let imageList = { ...state.imageList }
        imageList[id].labels[index].label = name;
        console.log(imageList, imageList[id].labels)
        return {
            ...state, process: 'SET_IMAGE_LABEL_NAME',
            imageList
        }
    }
}, initialState);