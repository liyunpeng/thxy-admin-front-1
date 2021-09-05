import request from '../utils/request';
import fetch from './fetch'

// const baseUrl = 
export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const getAllCourseIds = query => {
    return request({
        url: './api/adminGetAllCourseIds',
        method: 'post',
        params: query
    });
};

export const getAllCourseType = query => {
    return request({
        url: './api/adminGetAllCourseType',
        method: 'post',
        params: query
    });
};

export const findCourseByTypeId = query => {
    return request({
        url: './api/findCourseByTypeId',
        method: 'post',
        params: query
    });
};


// export const getCourseFileByCourseId = query => {
//     return request({
//         url: './api/findCourseFileByCourseId',
//         method: 'post',
//         params: query
//     });
// };

// export const getCourseFileByCourseId = query => {
//     return request({
//         url: './api/findCourseFileByCourseId',
//         method: 'post',
//         params: query
//     });
// };

export function getCourseFileByCourseId(data) {
    return fetch({
        url: "./api/findCourseFileByCourseId",
        method: 'post',
        data
    })
}


export function adminLogin(data) {
    return fetch({
        url: "./api/adminLogin",
        method: 'post',
        data
    })
}

// export function getCourseTypes(data) {
//     return fetch({
//         url: "./api/getCourseTypes",
//         method: 'post',
//         data
//     })
// }