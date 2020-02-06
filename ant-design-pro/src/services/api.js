import { stringify } from 'qs';
import request from '@/utils/request';
import reqwest from 'reqwest';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function queryVuln(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/api/vulnbydomain/?${stringify(params)}`);
}


export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/vulndetail/`, {
    method: 'POST',
    data: params,
  });
}


export async function fakeAccountLogin(params) {
  return request('/api/auth/login/', {
    method: 'POST',
    data: params,
  });
}



export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}


export async function queryPorts(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/api/ports/?${stringify(params)}`);
}

export async function querySubdomain(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/api/subdomain/?${stringify(params)}`);
}

export async function deleteSubdomain(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/api/subdomain/?${stringify(params)}`, {
    method : 'DELETE',
    // data: params,
  });
}

export async function addSubdomain(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/api/subdomain/`, {
    method : 'POST',
    data: params,
  }).then(res => {
    return res;
  });
}




export async function queryDnslog(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/dnslog/api/record/?${stringify(params)}`);
}


export async function queryWvsStatus(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/api/wvs/?${stringify(params)}`);
}


export async function updateWvsStatus(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/api/wvs/`, {
    method : 'POST',
    data: params,
  }).then(res => {
    return res;
  });
}

export async function queryDomainDash(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/api/domaindash/`);
}

export async function scanDomain(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/api/domaindash/`, {
    method : 'POST',
    data: params,
  }).then(res => {
    return res;
  });
}


export async function fakeSubmitForm(params) {
  let headers = {};
  let token = localStorage.getItem('token');
  if (!(token == "undefined" )){
    console.info('token is : '+ token);
    headers = {
      'Authorization': `Token ${localStorage.getItem('token')}`,
      
    }
    return reqwest({
      url: '/api/form/',
      method: 'post',
      processData: false,
      data: params,
      crossOrigin: true,
      headers: headers,
      success: (result) => {
        // const result = ({
        //   "status": 200,
        // });
        console.log("on success..");
        console.log(result);
        return result;
      },
      error: (result) => {
        // const result = ({
        //   "status": 400,
        // });
        console.log("on error..");
        console.log(result);
        return result;
      },
    });    

  }

  // return request('/api/forms', {
  //   method: 'POST',
  //   data: params,
  // });
}


export async function queryXssStatus(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/xsser/api/record/?${stringify(params)}`);
}

export async function deleteXssRecord(params) {
  // return request(`/api/vulnbydomain/${stringify(params)}/`);
  return request(`/xsser/api/record/?${stringify(params)}`, {
    method : 'DELETE',
  });
}