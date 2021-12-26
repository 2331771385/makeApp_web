import request from '@/utils/request'

// 查询建筑论坛列表
export function listContent(query) {
  return request({
    url: '/TbTalkContent/content/list',
    method: 'get',
    params: query
  })
}

// 查询建筑论坛详细
export function getContent(id) {
  return request({
    url: '/TbTalkContent/content/' + id,
    method: 'get'
  })
}

// 新增建筑论坛
export function addContent(data) {
  return request({
    url: '/TbTalkContent/content',
    method: 'post',
    data: data
  })
}

// 修改建筑论坛
export function updateContent(data) {
  return request({
    url: '/TbTalkContent/content',
    method: 'put',
    data: data
  })
}

// 删除建筑论坛
export function delContent(id) {
  return request({
    url: '/TbTalkContent/content/' + id,
    method: 'delete'
  })
}
