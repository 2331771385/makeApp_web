import request from '@/utils/request'

// 查询位置点类型管理列表
export function listType(query) {
  return request({
    url: '/TbPoiType/type/list',
    method: 'get',
    params: query
  })
}
export function listAllType() {
  return request({
    url: '/TbPoiType/type/listAll',
    method: 'get'
  })
}

// 查询位置点类型管理详细
export function getType(poitype) {
  return request({
    url: '/TbPoiType/type/' + poitype,
    method: 'get'
  })
}

// 新增位置点类型管理
export function addType(data) {
  return request({
    url: '/TbPoiType/type',
    method: 'post',
    data: data
  })
}

// 修改位置点类型管理
export function updateType(data) {
  return request({
    url: '/TbPoiType/type',
    method: 'put',
    data: data
  })
}

// 删除位置点类型管理
export function delType(poitype) {
  return request({
    url: '/TbPoiType/type/' + poitype,
    method: 'delete'
  })
}
