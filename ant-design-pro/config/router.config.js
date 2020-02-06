export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      // { path: '/user/register', name: 'register', component: './User/Register' },
      // {
      //   path: '/user/register-result',
      //   name: 'register.result',
      //   component: './User/RegisterResult',
      // },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/domaindash', authority: ['admin', 'user'] },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          // {
          //   path: '/dashboard/analysis',
          //   name: 'analysis',
          //   component: './Dashboard/Analysis',
          // },
          {
            path: '/dashboard/domaindash',
            name: '域名概况',
            component: './Dashboard/DomainDash',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: '创建扫描对象',
        routes: [
          {
            path: '/form/create',
            name: '创建域名',
            component: './Forms/CreateForm',
          },
          // {
          //   path: '/form/basic-form',
          //   name: 'basicform',
          //   component: './Forms/BasicForm',
          // },
          // {
          //   path: '/form/step-form',
          //   name: 'stepform',
          //   component: './Forms/StepForm',
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: '/form/step-form',
          //       redirect: '/form/step-form/info',
          //     },
          //     {
          //       path: '/form/step-form/info',
          //       name: 'info',
          //       component: './Forms/StepForm/Step1',
          //     },
          //     {
          //       path: '/form/step-form/confirm',
          //       name: 'confirm',
          //       component: './Forms/StepForm/Step2',
          //     },
          //     {
          //       path: '/form/step-form/result',
          //       name: 'result',
          //       component: './Forms/StepForm/Step3',
          //     },
          //   ],
          // },
          // {
          //   path: '/form/advanced-form',
          //   name: 'advancedform',
          //   authority: ['admin'],
          //   component: './Forms/AdvancedForm',
          // },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: '资产列表',
        routes: [
          {
            path: '/list/vuln-list',
            name: '获取漏洞列表',
            component: './List/FetchVulnList',
          },
          {
            path: '/list/port-list',
            name: '获取端口列表',
            component: './List/FetchPortList',
          },
          {
            path: '/list/subdomain-list',
            name: '获取子域名信息',
            component: './List/FetchSubdomain',
          },
        ],
      },
      {
        path: '/tools',
        icon: 'table',
        name: '其他工具',
        routes: [
          {
            path: '/tools/dnslog',
            name: 'dnslog',
            component: './Tools/dnslog',
          },
          {
            path: '/tools/wvsstatus',
            name: 'wvs状态',
            component: './Tools/wvsStatus',
          },
          {
            path: '/tools/xsser',
            name: 'xss status',
            component: './Tools/xssStatus',
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
