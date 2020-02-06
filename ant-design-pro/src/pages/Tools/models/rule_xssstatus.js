import { queryXssStatus, deleteXssRecord, addRule, updateWvsStatus } from '@/services/api';

export default {
  namespace: 'rule_xssstatus',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryXssStatus, payload);
      console.info('to show response dat');
      console.log(JSON.stringify(response));
      let responsedata = {};
      let current_page = 1;
      let page_size = 10;
      if (payload && payload.page ){
        current_page = payload.page;
      }
      if (payload && payload.page_size ){
        page_size = payload.page_size;
      }
      // console.info(typeof response);
      // console.info(response.results);
      if (response.results){
        let result_list = [];
        console.log("####################");
        for(var i = 0; i< response.results.length; i++){
          let target = response.results[i];
          let content = JSON.parse(target.content);
          let servercontent = JSON.parse(target.servercontent);
          let res = {};
          res['urlkey'] = target.urlkey;
          res['id'] = target.id;
          res['addtime'] = target.addtime * 1000;
          res['location'] = content.location;
          res['cookie'] = content.cookie;
          res['http_referer'] = servercontent.HTTP_REFERER;
          res['http_useragent'] = servercontent.HTTP_USER_AGENT;
          res['remote_addr'] = servercontent.REMOTE_ADDR;
          console.log(res);
          result_list.push(res);

        }
        console.log(JSON.stringify(response.results));
        responsedata = {
          list: result_list,
          pagination : {
            current : current_page,
            pageSize: page_size,
            total: response.count,
            totalPage: response.count / page_size,
          },
        };

        console.log(JSON.stringify(responsedata));
        yield put({
          type: 'save',
          payload: responsedata,
        });
      };
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteXssRecord, payload);
      console.log("delete result");
      console.log(response);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response1 = yield call(updateWvsStatus, payload);
      if (callback) callback(response1);
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
