import { axios, getStore } from '@hualala/platform-base';
import { message } from 'antd';

const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'couponPackage/', '/api/v1/universal?'];

function getAccountInfo() {
  const { user } = getStore().getState();
  return user.get('accountInfo').toJS();
}

async function httpCreateDistributionParams(data = {}) {
  const { groupID } = getAccountInfo();
  Object.assign(data, { groupID });
  const method = '/crm/distribution/createDistributionParams.ajax';
  const params = {
    service,
    type,
    data,
    method,
  };
  const response = await axios.post(url + method, params);
  console.log(33333, response);
  const { code, message: msg = '', list = [], totalSize: total = 0 } = response;
  if (code === '000') {
    return {
      list,
      total,
    };
  }
  message.error(msg);
  return false;
}

async function httpUpdateDistributionParams(data = {}) {
  const { groupID } = getAccountInfo();
  Object.assign(data, { groupID });
  const method = '/crm/distribution/updateDistributionParams.ajax';
  const params = {
    service,
    type,
    data,
    method,
  };
  const response = await axios.post(url + method, params);
  const { code, message: msg = '', list = [], totalSize: total = 0 } = response;
  if (code === '000') {
    return {
      list,
      total,
    };
  }
  message.error(msg);
  return false;
}

async function httpQueryDistributionParams() {
  const { groupID } = getAccountInfo();
  const method = '/crm/distribution/queryDistributionParams.ajax';
  const params = {
    service,
    type,
    data: { groupID },
    method,
  };
  const response = await axios.post(url + method, params);
  const { code, message: msg = '', item = {} } = response;
  if (code === '000') {
    return item;
  }
  message.error(msg);
  return false;
}

async function httpDistributionDetail(data = {}) {
  const { groupID } = getAccountInfo();
  Object.assign(data, { groupID });
  const method = '/crm/distribution/distributionDetail.ajax';
  const params = {
    service,
    type,
    data,
    method,
  };
  const response = await axios.post(url + method, params);
  const { code, message: msg = '', list = [], totalSize: total = 0 } = response;
  if (code === '000') {
    return {
      list,
      total,
    };
  }
  message.error(msg);
  return false;
}

async function httpDistributionWithdraw(data = {}) {
  const { groupID } = getAccountInfo();
  Object.assign(data, { groupID });
  const method = '/crm/distribution/distributionWithdraw.ajax';
  const params = {
    service,
    type,
    data,
    method,
  };
  const response = await axios.post(url + method, params);
  const { code, message: msg = '', list = [], totalSize: total = 0 } = response;
  if (code === '000') {
    return {
      list,
      total,
    };
  }
  message.error(msg);
  return false;
}

async function httpWithdrawDetails(data = {}) {
  const { groupID } = getAccountInfo();
  Object.assign(data, { groupID });
  const method = '/crm/distribution/withdrawDetails.ajax';
  const params = {
    service,
    type,
    data,
    method,
  };
  const response = await axios.post(url + method, params);
  const { code, message: msg = '', list = [], totalSize: total = 0 } = response;
  if (code === '000') {
    return {
      list,
      total,
    };
  }
  message.error(msg);
  return false;
}

export {
  httpDistributionDetail,
  httpDistributionWithdraw,
  httpWithdrawDetails,
  httpCreateDistributionParams,
  httpUpdateDistributionParams,
  httpQueryDistributionParams,
};

