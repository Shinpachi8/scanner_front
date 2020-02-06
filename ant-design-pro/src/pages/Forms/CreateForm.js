import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Upload,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import reqwest from 'reqwest';
import { restElement } from '@babel/types';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Dragger } = Upload;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))



@Form.create()
class BasicForms extends PureComponent {
  state = {
    fileList: [],
    uploading: false,
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { fileList } = this.state;
    console.log(form);
    const formData = new FormData();
    console.log(fileList);
    fileList.forEach(file => {
      console.log("/////");
      console.log(file);
      console.log("push file done!");
      formData.append('file[]', file);
      console.log(formData);
    });
    console.log("..................");
    console.log(formData);
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        console.log("####################");
        console.log(values);
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  fileChange=(params)=>{
    const {file,fileList}=params;
    if(file.status==='uploading'){
        setTimeout(()=>{
            this.setState({
                percent:fileList.percent    
            })
        },1000)       
    }
  };
  拦截文件上传
  beforeUploadHandle=(file)=>{
    console.log("in beforuploadhandler..");
    console.log(file);
    this.setState(state => ({
      fileList: [...state.fileList, file],
      // fileList.push(file);
    }));
    console.log(this.state.fileList);
    return false;
  }


  文件列表的删除
  fileRemove=(file)=>{
    this.setState(({fileData})=>{
        const index=fileData.indexOf(file);
        const newFileList=fileData.slice();
        newFileList=splice(index,1);
        return {
           fileData:newFileList
        }
    })
  }
  
  handleUpload = () => {
    const { fileList } = this.state;
    const { dispatch, form } = this.props;
    
    const formData = new FormData();
    // form表单添加
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        console.log("####################");
        console.log(values);
        formData.append("domain", values.domain);
        formData.append("public", values.public);
      }
    });
    
    console.log(formData);
    fileList.forEach(file => {
      formData.append('files', file);
    });


    this.setState({
      uploading: true,
    });
    console.log("dispacher  submitRgularFrom");
    dispatch({
      type: 'form/submitRegularForm',
      payload: formData,
        callback: (result) => {
        console.log("in callback method");
        this.setState({
            fileList: result.fileList,
            uploading: result.uploading,
        });
      }
    });
    console.log("dispacher  submitRgularFrom done");
    // You can use any AJAX library you like
    // reqwest({
    //   url: '/api/form/',
    //   method: 'post',
    //   processData: false,
    //   data: formData,
    //   crossOrigin: true,
    //   // headers: {
    //   //   ''
    //   // }
    //   success: () => {
    //     this.setState({
    //       fileList: [],
    //       uploading: false,
    //     });
    //     message.success('upload successfully.');
    //   },
    //   error: () => {
    //     this.setState({
    //       uploading: false,
    //     });
    //     message.error('upload failed.');
    //   },
    // });
  }

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const { uploading, fileList } = this.state;

    const uploadProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
  
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="创建扫描" />}
        content={<FormattedMessage id="输入域名及子域名/IP, 生成待扫描对象" />}
      >
        <Card bordered={false}>

          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="公司域名" />}>
              {getFieldDecorator('domain', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: '公司域名' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="文件上传 upload" />}>
              <Upload {...uploadProps}>
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
              </Upload>
            </FormItem>
            {/* <FormItem  {...formItemLayout} label={<FormattedMessage id="文件上传" />}>
                {getFieldDecorator('customerFile', {
                    rules: [{ required: true, message: '请上传数据文件', }],
                    valuePropName: 'files',
                    getValueFromEvent: e => e.target.files,
                })(<Input type='file' name='customerFile' style={{height:35}}/>)}
            </FormItem> */}

            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="文件类型" />}
              help={<FormattedMessage id="单行子域名或者单行IP" />}
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="domain">
                      <FormattedMessage id="子域名" />
                    </Radio>
                    <Radio value="ip">
                      <FormattedMessage id="IP" />
                    </Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              {/* <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button> */}
              <Button
                type="primary"
                onClick={this.handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
              >
                {uploading ? 'Uploading' : 'Start Upload'}
              </Button>
            </FormItem>
          </Form> 
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
