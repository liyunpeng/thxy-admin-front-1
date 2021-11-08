import request from '../utils/request';
import fetch from './fetch'

// const baseUrl =
// export const fetchData = query => {
//     return request({
//         url: './table.json',
//         method: 'get',
//         params: query
//     });
// };

// export const getAllCourseIds = query => {
//     return request({
//         url: './api/adminGetAllCourseIds',
//         method: 'post',
//         params: query
//     });
// };

export function getAllCourseIds() {
    return fetch({
        url: "./adminApi/adminGetAllCourseIds",
        method: 'post'
    })
}getCourseTypes

export function getLogList() {
    return fetch({
        url: "./adminApi/logList",
        method: 'post'
    })
}

// export const getAllCourseType = query => {
//     return request({
//         url: './adminApi/adminGetAllCourseType',
//         method: 'post',
//         params: query
//     });
// };

export function getAllCourseType() {
    return fetch({
        url: "./adminApi/adminGetAllCourseType",
        method: 'post'
    })
}

export function findCourseByTypeId(data) {
    return fetch({
        url: "./adminApi/findCourseByTypeId",
        method: 'post',
        data
    })
}

export function getCourseTypes(data) {
    return fetch({
        url: "./adminApi/getCourseTypes",
        method: 'post',
        data
    })
}

export function getLogFile(data) {
    // return fetch({
    //     url: "./adminApi/logDownload",
    //     method: 'get',
    //     data
    // })

    return request({
        url: './adminApi/logDownload',
        method: 'get',
        params: data
    })
}



export function addCourseType(data) {
    return fetch({
        url: "./adminApi/addCourseType",
        method: 'post',
        data
    })
}

export function updateCourseType(data) {
    return fetch({
        url: "./adminApi/updateCourseType",
        method: 'post',
        data
    })
}

export function addCourse(data) {
    return fetch({
        url: "./adminApi/addCourse",
        method: 'post',
        data
    })
}

export function updateCourse(data) {
    return fetch({
        url: "./adminApi/updateCourse",
        method: 'post',
        data
    })
}

export function getCourseFileByCourseId(data) {
    return fetch({
        url: "./adminApi/findCourseFileByCourseId",
        method: 'post',
        data
    })
}

export function adminLogin(data) {
    return fetch({
        url: "./adminLogin",
        method: 'post',
        data
    })
}

export function deleteCourse(data) {
    return fetch({
        url: "./adminApi/deleteCourse",
        method: 'post',
        data
    })
}

export function deleteCourseType(data) {
    return fetch({
        url: "./adminApi/deleteCourseType",
        method: 'post',
        data
    })
}

export function updatePwd(data) {
    return fetch({
        url: "./adminApi/updatePwd",
        method: 'post',
        data
    })
}
