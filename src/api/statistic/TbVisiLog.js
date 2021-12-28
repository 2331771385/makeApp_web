import request from '@/utils/request'

// 查询访问量列表
export function listTbVisiLog(query) {
  return request({
    url: '/system/TbVisiLog/list',
    method: 'get',
    params: query
  })
}

export function listTbVisiLogAll(query) {
  return request({
    url: '/TbVisiLog/visi',
    method: 'post',
    data: query
  })
}

// 查询访问量详细
export function getTbVisiLog(id) {
  return request({
    url: '/system/TbVisiLog/' + id,
    method: 'get'
  })
}

// 新增访问量
export function addTbVisiLog(data) {
  return request({
    url: '/system/TbVisiLog',
    method: 'post',
    data: data
  })
}

// 修改访问量
export function updateTbVisiLog(data) {
  return request({
    url: '/system/TbVisiLog',
    method: 'put',
    data: data
  })
}

// 删除访问量
export function delTbVisiLog(id) {
  return request({
    url: '/system/TbVisiLog/' + id,
    method: 'delete'
  })
}
