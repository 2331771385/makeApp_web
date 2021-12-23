import request from '@/utils/request'

// 查询位置信息管理列表
export function listPoi(query) {
  return request({
    url: '/campuspoi/poi/list',
    method: 'get',
    params: query
  })
}

// 查询位置信息管理详细
export function getPoi(poiid) {
  return request({
    url: '/campuspoi/poi/' + poiid,
    method: 'get'
  })
}

// 新增位置信息管理
export function addPoi(data) {
  return request({
    url: '/campuspoi/poi',
    method: 'post',
    data: data
  })
}

// 修改位置信息管理
export function updatePoi(data) {
  return request({
    url: '/campuspoi/poi',
    method: 'put',
    data: data
  })
}

// 删除位置信息管理
export function delPoi(poiid) {
  return request({
    url: '/campuspoi/poi/' + poiid,
    method: 'delete'
  })
}
