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

export function findCourseByTypeId(data) {
    return fetch({
        url: "./api/findCourseByTypeId",
        method: 'post',
        data
    })
}

export function getCourseTypes(data) {
    return fetch({
        url: "./api/getCourseTypes",
        method: 'post',
        data
    })
}

export function addCourseType(data) {
    return fetch({
        url: "./api/addCourseType",
        method: 'post',
        data
    })
}

export function updateCourseType(data) {
    return fetch({
        url: "./api/updateCourseType",
        method: 'post',
        data
    })
}

export function addCourse(data) {
    return fetch({
        url: "./api/addCourse",
        method: 'post',
        data
    })
}

export function updateCourse(data) {
    return fetch({
        url: "./api/updateCourse",
        method: 'post',
        data
    })
}

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

export function deleteCourse(data) {
    return fetch({
        url: "./api/deleteCourse",
        method: 'post',
        data
    })
}

export function deleteCourseType(data) {
    return fetch({
        url: "./api/deleteCourseType",
        method: 'post',
        data
    })
}

export function updatePwd(data) {
    return fetch({
        url: "./api/updatePwd",
        method: 'post',
        data
    })
}
