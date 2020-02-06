import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['ignore扫描', '可扫描', '已忽略', '异常'];

const onClick = obj =>{
  console.log("click something");
}


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="域名ID">
        {form.getFieldDecorator('id_domain', {
          // rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="子域名">
        {form.getFieldDecorator('subdomain', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ rule_domaindash, loading }) => ({
  rule_domaindash,
  loading: loading.models.rule_domaindash,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '域名ID',
      dataIndex: 'id',
      // render: text => <Link to={`/profile/basic/${id}`}>{text}</Link>,
    },
    {
      title: '主域名',
      dataIndex: 'domain',
      // render: text => <Link to={`/profile/basic/${id}`}>{text}</Link>,
    },
    {
      title: '子域名个数',
      dataIndex: 'count_subdomain',
      render: (text, row) => {
        return <Link to={`/list/subdomain-list?id_domain=${row.id}`}>{text}</Link>
      },
    },

    {
      title: 'IP个数',
      dataIndex: 'count_ip',
      // textWrap: 'word-break',
    },
    {
      title: '端口个数',
      dataIndex: 'count_port',
      render: (text, row) => {
        return <Link to={`/list/port-list?id_domain=${row.id}`}>{text}</Link>
      },
    },
    {
      title: '漏洞个数',
      dataIndex: 'count_vul',
      render: (text, row) => {
        return <Link to={`/list/vuln-list?id_domain=${row.id}`}>{text}</Link>
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        const menu = (
          <Menu onClick={(key)=> this.onClickOpt(key, record)}>
            <Menu.Item key="scandomain">信息泄露扫描</Menu.Item>
            <Menu.Item key="masscan">masscan扫描全端口</Menu.Item>
            <Menu.Item key="nmapscan">nmap识别端口</Menu.Item>
            <Menu.Item key="updatehttptitle">更新http标题</Menu.Item>
            <Menu.Item key="poc">插件扫描</Menu.Item>
            <Menu.Item key="wvsscan">wvs扫描</Menu.Item>
            <Menu.Item key="subdomainbrute">更新域名</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="whatweb" disabled>3rd menu item</Menu.Item>
            <Menu.Item key="portcrack" disabled>3rd menu item</Menu.Item>
          </Menu>
        );

        let dropdown = (
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="#">
              扫描操作 <Icon type="down" />
            </a>
          </Dropdown>
        );
        return dropdown;

      }
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule_domaindash/fetch',
    });
  }

  onClickOpt = (key, record) => {
    const { dispatch } = this.props;
    let data = {
      'id': record.id,
      'scantype': key.key,
    }
    console.log(data);
    dispatch({
      type: 'rule_domaindash/scan',
      payload: data,
      callback: (result) => {
          console.log("in callback. result:....");
          console.log(result);
          if(result.status == 200){
            message.success(result.reason);
            console.log("data.list//");
          }else{
            message.error(result.reason);
          }
      },
    });
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule_domaindash/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule_domaindash/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule_domaindash/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  deleteSubdomain = (flag, record) => {
    // this.setState({
    //   modalVisible: !!flag,
    // });
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const { rule_domaindash: {data} } = this.props;
    // console.log("#############################");
    // console.log(selectedRows);
    // console.log(this.state);
    // console.log(this.props);
    // console.log(data.list);
    // console.log("#############################");
    let data2 = {
      'id': record.id,
      // 'verify': verify
    }
    dispatch({
      type: 'rule_domaindash/delete',
      payload: data2,
      callback: (result) => {
        // console.log("in callback function");
        // console.log(result);
          if(result.status == 200){

            data.list = data.list.filter(function(p){
                return p.id != data2.id;
            });
            message.success(result.reason);
            this.props.rule_domaindash.data.list = data.list;
          }else{
            message.error(result.reason);
          }
      },
    });

  }


  handleAdd = fields => {
    const { dispatch } = this.props;
    const { rule_domaindash: {data} } = this.props;
    dispatch({
      type: 'rule_domaindash/add',
      payload: {
        fields,
      },
      callback: (result) => {
        console.log("in callback function");
        console.log(result);
        if (result.status == 200){
          // message.success('添加成功');
          message.success(result.reason);
          data.list.push(result.result);
          this.props.rule_domaindash.data.list = data.list;
        }else{
          message.error(result.reason);
        }
      }
    });

    
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'rule/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="子域名">
              {getFieldDecorator('subdomain__icontains')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title__icontains')(<Input placeholder="输入标题" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="域名ID">
              {getFieldDecorator('id_domain')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  renderForm() {
    // const { expandForm } = this.state;
    return this.renderSimpleForm();
  }

  render() {
    const {
      rule_domaindash: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
