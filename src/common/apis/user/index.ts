import type * as Login from "./type"
import { request } from "@/http/axios"


// 获取用户详细信息
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: '/system/saas/user/getInfo',
    method: 'get'
  })
}


// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/saas/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/saas/user/'+userId,
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/saas/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/saas/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/saas/user/' + userId,
    method: 'delete'
  })
}
