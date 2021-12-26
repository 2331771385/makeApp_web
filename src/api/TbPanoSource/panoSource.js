import request from '@/utils/request'

// 查询全景图列表
export function listPanoSource(query) {
  return request({
    url: '/TbPanoSource/panoSource/list',
    method: 'get',
    params: query
  })
}

// 查询全景图详细
export function getPanoSource(sourceid) {
  return request({
    url: '/TbPanoSource/panoSource/' + sourceid,
    method: 'get'
  })
}

// 新增全景图
export function addPanoSource(data) {
  return request({
    url: '/TbPanoSource/panoSource',
    method: 'post',
    data: data
  })
}

// 修改全景图
export function updatePanoSource(data) {
  return request({
    url: '/TbPanoSource/panoSource',
    method: 'put',
    data: data
  })
}

// 删除全景图
export function delPanoSource(sourceid) {
  return request({
    url: '/TbPanoSource/panoSource/' + sourceid,
    method: 'delete'
  })
}
