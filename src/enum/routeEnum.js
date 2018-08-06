import React from 'react';
import Index from '../route/index/index';
import StrategySelf from '../route/strategyManage/strategySelf/strategySelf';
import RelatedStare from '../route/stareManage/relatedStare/relatedStare';
import UnrelatedStare from '../route/stareManage/unrelatedStare/unrelatedStare';
import CombinationManage from '../route/talentManage/combinationManage/combinationManage';
import TalentViewpoint from '../route/talentManage/talentViewpoint/talentViewpoint';
import MyAccount from '../route/financialManage/myAccount/myAccount';
import AccountFlow from '../route/financialManage/accountFlow/accountFlow';
import UserPresentation from '../route/financialManage/userPresentation/userPresentation';
import UserData from '../route/statisticalData/userData/userData';
import MyUser from '../route/statisticalData/myUser/myUser';
import EmployeeManage from '../route/userManage/employeeManage/employeeManage/employeeManage';
import PersonalUser from '../route/userManage/personalUser/personalUser';
import MechanismUser from '../route/userManage/mechanismUser/mechanismUser';
import RoleManage from '../route/systemManage/roleManage/roleManage';
import ParameterSetting from '../route/systemManage/parameterSetting/parameterSetting';
import ContentManage from '../route/systemManage/contentManage/contentManage/contentManage';
import QuantClassroom from '../route/systemManage/quantClassroom/quantClassroom/quantClassroom';
import VersionManagement from '../route/systemManage/versionManagement/versionManagement';

export const RouteEnum = [
        { route: "/index", title: "首页", component: <Index /> },
        { route: "/index/strategySelf", title: "自营策略", component: <StrategySelf /> },
        { route: "/index/relatedStare", title: "关联盯盘", component: <RelatedStare /> },
        { route: "/index/unrelatedStare", title: "非关联盯盘", component: <UnrelatedStare /> },
        { route: "/index/combinationManage", title: "组合管理", component: <CombinationManage /> },
        { route: "/index/talentViewpoint", title: "达人观点", component: <TalentViewpoint /> },
        { route: "/index/myAccount", title: "我的账户", component: <MyAccount /> },
        { route: "/index/accountFlow", title: "账户流水", component: <AccountFlow /> },
        { route: "/index/userPresentation", title: "用户提现", component: <UserPresentation /> },
        { route: "/index/userData", title: "用户数据", component: <UserData /> },
        { route: "/index/myUser", title: "我的用户", component: <MyUser /> },
        { route: "/index/employeeManage", title: "员工管理", component: <EmployeeManage /> },
        { route: "/index/personalUser", title: "个人用户", component: <PersonalUser /> },
        { route: "/index/mechanismUser", title: "机构用户", component: <MechanismUser /> },
        { route: "/index/roleManage", title: "角色管理", component: <RoleManage /> },
        { route: "/index/parameterSetting", title: "参数设置", component: <ParameterSetting /> },
        { route: "/index/contentManage", title: "内容管理", component: <ContentManage /> },
        { route: "/index/quantClassroom", title: "量化课堂", component: <QuantClassroom /> },
        { route: "/index/versionManagement", title: "版本管理", component: <VersionManagement /> },
]