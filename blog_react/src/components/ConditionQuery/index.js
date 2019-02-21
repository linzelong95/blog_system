import React, { Component } from 'react';
import { Form, Button, Icon } from 'antd';
// import CustomForm from '@/components/CustomForm';
import CustomForm from '@/components/SeftForm';
import LangConfig from '@/assets/LangConfig';
import PropTypes from 'prop-types';

const { CommonLang: { QUERY, RESET, FOLD_UP, OPEN_UP } } = LangConfig;

@Form.create()
class ConditionQuery extends Component {
  static propTypes = {
    modalFormConfig: PropTypes.array,
    onQuery: PropTypes.func.isRequired,
  };

  static defaultProps = {
    modalFormConfig: [],
  };

  state = {
    expandForm: false,
  };

  componentWillReceiveProps=(nextProps)=>{
    const {condition:nextCondition}=nextProps;
    const {condition:thisCondition,form}=this.props;
    if(Object.keys(nextCondition).length===0 && Object.values(thisCondition).some(i=>![undefined,null,""].includes(i))){
      form.resetFields();
    }
  }

  handleSubmit = () => {
    const { form, onQuery } = this.props;
    form.validateFields((error, value) => {
      if (!error) {
        const v = value;
        delete v.buttonGroup;
        Object.keys(v).forEach(item => {
          if (v[item] === undefined) delete v[item]
        })
        onQuery(v);
      }
    });
  };

  handleFormReset = () => {
    const { form, onQuery } = this.props;
    form.resetFields();
    onQuery({});
  };

  toggleForm = () => {
    this.setState(prevState => ({
      expandForm: !prevState.expandForm,
    }));
  };

  render() {
    const { expandForm } = this.state;
    const { form, modalFormConfig, condition, lang } = this.props;
    const lenghtFlag = modalFormConfig.length > 2;
    const buttonGroup = (
      <div style={{ textAlign: lenghtFlag && expandForm ? 'right' : "left" }}>
        <Button type="primary" onClick={this.handleSubmit}>
          {QUERY[lang]}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
          {RESET[lang]}
        </Button>
        {lenghtFlag &&
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            {expandForm ? FOLD_UP[lang] : OPEN_UP[lang]} {expandForm ? <Icon type="up" /> : <Icon type="down" />}
          </a>
        }
      </div>
    );
    const btnGroupConfig = { fieldId: 'buttonGroup', fieldType: 'node', fieldNode: buttonGroup, colLayout: { span: 8, offset: expandForm ? 16 : 0 } }
    const [c1, c2] = modalFormConfig;
    const config1 = [...modalFormConfig, btnGroupConfig];
    const config2 = c1 ? (c2 ? [c1, c2, btnGroupConfig] : [c1, btnGroupConfig]) : [];
    const newConfig = expandForm ? config1 : config2;
    // return <CustomForm form={form} modalFormConfig={newConfig} initialFormData={condition} compact />;
    return <CustomForm form={form} modalFormConfig={newConfig} initialFormData={condition} compact gutter={24} lang={lang} />;
  }
}


export default ConditionQuery;