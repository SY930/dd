import { axios, getStore } from '@hualala/platform-base';
import { message } from 'antd';

const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'couponPackage/', '/api/v1/universal?'];

function getAccountInfo() {
  const { user } = getStore().getState();
  return user.get('accountInfo').toJS();
}

async function httpCreateOrUpdateDistributionParams(data = {}) {
  const { groupID } = getAccountInfo();
  Object.assign(data, { groupID });
  let method = '/crm/distribution/createDistributionParams.ajax';
  if (data.itemID) {
    method = '/crm/distribution/updateDistributionParams.ajax';
  }
  const params = {
    service,
    type,
    data: {
      record: data,
    },
    method,
  };
  const response = await axios.post(url + method, params);
  const { code, message: msg = '' } = response;
  if (code === '000') {
    return true
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
  httpQueryDistributionParams,
  httpCreateOrUpdateDistributionParams,
};

