import React from 'react';
import EmployeeList from '../route/userManage/employeeList/employeeList';
import PersonalUser from '../route/userManage/personalUser/personalUser';
import StrategySelf from '../route/strategyManage/strategySelf/strategySelf';
import CustomerList from '../route/customerManage/customerList/customerList';
import CustomerViewpoint from '../route/customerManage/customerViewpoint/customerViewpoint';
import RelatedStare from '../route/intelligentStare/relatedStare/relatedStare';
import UnrelatedStare from '../route/intelligentStare/unrelatedStare/unrelatedStare';
import ParameterSetting from '../route/systemManage/parameterSetting/parameterSetting';
import ContentManage from '../route/systemManage/contentManage/contentManage/contentManage';
import AddContent from '../route/systemManage/contentManage/addContent/addContent';
import EditContent from '../route/systemManage/contentManage/editContent/editContent';
import VersionManagement from '../route/systemManage/versionManagement/versionManagement';







export const RouteEnum = [
       
        { route: "/employeeList", title: "员工列表", component: <EmployeeList/> },
        { route: "/personalUser", title: "个人用户", component: <PersonalUser/>},
        { route: "/strategySelf", title: "自营策略", component: <StrategySelf/> },
        { route: "/customerList", title: "投顾列表", component: <CustomerList/> },
        { route: "/customerViewpoint", title: "投顾观点", component: <CustomerViewpoint/> },
        { route: "/relatedStare", title: "关联盯盘", component: <RelatedStare/>},
        { route: "/unrelatedStare", title: "非关联盯盘", component: <UnrelatedStare/> },
        { route: "/parameterSetting", title: "参数设置", component: <ParameterSetting/> },
        { route: "/contentManage", title: "内容管理", component: <ContentManage/> },        
        { route: "/addContent", title: "添加内容", component:  <AddContent/>},
        { route: "/editContent", title: "添加内容", component: <EditContent/> },   
        { route: "/versionManagement", title: "版本管理", component: <VersionManagement/> },   
]