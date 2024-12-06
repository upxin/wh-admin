import Mock from 'mockjs';
import { resultSuccess } from '../_util';
import { defineMock } from '@alova/mock';

const Random = Mock.Random;

const token = Random.string('upper', 32, 32);

const adminInfo = {
  userId: '1',
  username: 'admin',
  realName: 'Admin',
  avatar: Random.image(),
  desc: 'manager',
  password: Random.string('upper', 4, 16),
  token,
  // 权限逻辑是  这里配置的就代表这个角色有权限的路由。
  // route的mate也会配置对应的权限字段，匹配上了就显示。如果mate没有permissions那么默认就有权限。meta配置了,就要找这个角色列表。
  // 可以给任何级别的路由配置，如果一级没有权限，二级配了也不会生效
  permissions: [
    // {
    //   label: '主控台',
    //   value: 'dashboard_console',
    // },
    {
      label: '监控页',
      value: 'dashboard_monitor',
    },
    {
      label: '工作台',
      value: 'dashboard_workplace',
    },
    {
      label: '基础列表',
      value: 'basic_list',
    },
    {
      label: '基础列表删除',
      value: 'basic_list_delete',
    },
    {
      value:'dashboard'
    }
  ],
};

export default defineMock({
  '[POST]/api/login': () => resultSuccess({ token }),
  '/api/admin_info': () => resultSuccess(adminInfo),
});
