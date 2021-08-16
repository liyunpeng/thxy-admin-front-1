import request from '../utils/request';


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
        url: './getAllCourseIds',
        method: 'post',
        params: query
    });
};
