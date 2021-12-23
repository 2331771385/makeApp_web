import request from '@/utils/request'

// 查询校园信息管理列表
export function listCampus(query) {
  return request({
    url: '/campus/campus/list',
    method: 'get',
    params: query
  })
}

// 查询校园信息管理详细
export function getCampus(campusid) {
  return request({
    url: '/campus/campus/' + campusid,
    method: 'get'
  })
}

// 新增校园信息管理
export function addCampus(data) {
  return request({
    url: '/campus/campus',
    method: 'post',
    data: data
  })
}

// 修改校园信息管理
export function updateCampus(data) {
  return request({
    url: '/campus/campus',
    method: 'put',
    data: data
  })
}

// 删除校园信息管理
export function delCampus(campusid) {
  return request({
    url: '/campus/campus/' + campusid,
    method: 'delete'
  })
}
