import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';
import { SlowBuffer } from 'buffer';
// import reqwest from 'reqwest';

export default {
  namespace: 'form',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
  },

  effects: {
    *submitRegularForm({ payload, callback }, { call }) {
      // console.log(JSON.stringify(payload));
  
      const response = yield call(fakeSubmitForm, payload);
      console.log("submitRegularForm");
      // console.log((response));
      if (response){
        const data = {
          fileList: [],
          uploading: false,
        }
        console.log(response);
        console.log(JSON.stringify(data));
        // yield put({
        //   type: 'saveStepFormData',
        //   payload: data,
        // });
        message.success(JSON.stringify(response));
        if (callback) callback(data);
      }else{
        message.fail("上传失败");
      };
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    saveStepFormData(state, action) {
      console.log("saveStepFormData");
      console.log(action.payload);
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
