import { querySubdomain, deleteSubdomain, addSubdomain, updateRule } from '@/services/api';

export default {
  namespace: 'rule_fetchsubdomain',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySubdomain, payload);
      console.info('to show response dat');
      console.log(JSON.stringify(response));
      console.log(JSON.stringify(payload));
      let responsedata = {};
      let current_page = 1;
      let page_size = 10;
      if (payload && payload.page ){
        current_page = payload.page;
      }
      if (payload && payload.page_size ){
        page_size = payload.page_size;
      }
      // console.info(payload);
      // console.info(payload.page_size);
      // console.info(typeof response);
      console.info(response.results);
      if (response.results){
        // console.log(JSON.stringify(response.results));
        responsedata = {
          list: response.results,
          pagination : {
            current : current_page,
            pageSize: page_size,
            total: response.count,
            totalPage: response.count / page_size,
          },
        };

        // console.log(JSON.stringify(responsedata));
        yield put({
          type: 'save',
          payload: responsedata,
        });
      };
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addSubdomain, payload);
      console.log("response...");
      console.log(response);
      // const response2 = yield call(querySubdomain, {});
      // let responsedata = {};
      // let current_page = 1;
      // console.info("###################");
      // console.log(JSON.stringify(response2.results));
      // if (response2.results){
      //   responsedata = {
      //     list: response2.results,
      //     pagination : {
      //       current : current_page,
      //       pageSize: 10,
      //       total: response2.count,
      //       totalPage: response2.count / 10,
      //     },
      //   };
      //   yield put({
      //     type: 'save',
      //     payload: responsedata,
      //   });
      // };
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteSubdomain, payload);
      console.log("response...");
      console.log(response);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response1 = yield call(updateRule, payload);
      console.info(payload);
      const response = yield call(queryVuln, {});
      let responsedata = {};
      let current_page = 1;
      if (payload && payload.page ){
        current_page = payload.page;
      }
      console.info("###################");
      console.log(JSON.stringify(response.results));
      if (response.results){

        responsedata = {
          list: response.results,
          pagination : {
            current : current_page,
            pageSize: 10,
            total: response.count,
            totalPage: response.count / 10,
          },
        };
        yield put({
          type: 'save',
          payload: responsedata,
        });
        if (callback) callback();
      };
    },
  },

  reducers: {
    save(state, action) {
      // alert(JSON.stringify(action.payload));
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
