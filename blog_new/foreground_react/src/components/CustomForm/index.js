import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { formatMessage } from 'umi/locale';
import { Form, Col, Row, Select, Input, Checkbox, InputNumber, Radio, Switch, Cascader, DatePicker, Pagination } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class CustomForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formProps: PropTypes.object,
    formConfig: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    defaultSpan: PropTypes.number,
    initialFormData: PropTypes.object,
  };

  static defaultProps = {
    loading: false,
    defaultSpan: 24,
    initialFormData: {},
    formProps: {}
  };

  render() {
    const { gutter = 0, defaultSpan, formConfig = [], initialFormData, form: { getFieldDecorator }, style: formStyle, formProps } = this.props;
    // const selectTip = formatMessage({ id: "common.tip.select" });
    // const inputTip = formatMessage({ id: "common.tip.input" });
    const selectTip = "请选择";
    const inputTip = "请输入";
    return (
      <Form className={styles.tableListForm} style={formStyle} {...formProps}>
        <Row gutter={gutter}>
          {formConfig.map(item => {
            const {
              fieldId,
              fieldType,
              label,
              formItemLayout = {},
              formItemProps = {},
              initialValue,
              rules = [],
              fieldProps = {},
              fieldNode,
              style = {},
              colLayout = {}
            } = item;
            const colHeightStyle = colLayout.span === 12 && style.display !== "none" ? { height: "56px" } : {};
            const colConfig = { span: defaultSpan, offset: 0, key: fieldId, ...colLayout, style: colHeightStyle };
            const formItemConfig = { style, label, ...formItemLayout, ...formItemProps };
            const initV = initialFormData[fieldId] === undefined ? initialValue : initialFormData[fieldId];
            switch (fieldType) {
              case 'input':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                        <Input {...{ placeholder: `${inputTip}${label}`, ...fieldProps }} />
                      )}
                    </FormItem>
                  </Col>
                );
              case 'inputNumber':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                        <InputNumber {...{ placeholder: `${inputTip}${label}`, style: { width: "100%" }, min: 0, ...fieldProps }} />
                      )}
                    </FormItem>
                  </Col>
                );
              case 'datePicker':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                        <DatePicker {...{ showTime: true, format: "YYYY-MM-DD HH:mm:ss", ...fieldProps }} />
                      )}
                    </FormItem>
                  </Col>
                );
              case 'rangePicker':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                        <DatePicker.RangePicker {...{ showTime: true, format: "YYYY-MM-DD HH:mm:ss", ...fieldProps }} />
                      )}
                    </FormItem>
                  </Col>
                );
              case 'textArea':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                        <TextArea {...fieldProps} />
                      )}
                    </FormItem>
                  </Col>
                );
              case 'select':
                {
                  const { pagination } = fieldProps;
                  return (
                    <Col {...colConfig}>
                      <FormItem {...formItemConfig}>
                        {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                          <Select
                            {...{ placeholder: `${selectTip}${label}`, ...fieldProps }}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {fieldProps.options.map(opt =>
                              <SelectOption value={opt.value} key={opt.value} disabled={opt.disabled}>{opt.label}</SelectOption>
                            )}
                            {pagination && pagination.usePagination &&
                              <Select.Option key={-1} disabled>
                                <Pagination {...{ size: "small", style: { textAlign: "center" }, ...pagination }} />
                              </Select.Option>
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  );
                }
              case 'cascader':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV || [] })(
                        <Cascader
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          {...{ placeholder: `${selectTip}${label}`, ...fieldProps }}
                        />
                      )}
                    </FormItem>
                  </Col>
                );
              case 'checkbox':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV || [] })(
                        <CheckboxGroup {...fieldProps} />
                      )}
                    </FormItem>
                  </Col>
                );
              case 'radio':
                {
                  const { radioType, options, ...otherProps } = fieldProps;
                  return (
                    <Col {...colConfig}>
                      <FormItem {...formItemConfig}>
                        {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                          <RadioGroup {...otherProps}>
                            {radioType === "radioButton" && options.map(opt =>
                              <Radio.Button key={opt.value} value={opt.value}>{opt.label}</Radio.Button>
                            )}
                            {radioType === "radioDefault" && options.map(opt =>
                              <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
                            )}
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Col>
                  );
                }
              case 'switch':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV, valuePropName: 'checked' })(
                        <Switch {...fieldProps} />
                      )}
                    </FormItem>
                  </Col>
                );
              case 'node':
                return (
                  <Col {...colConfig}>
                    <FormItem {...formItemConfig}>
                      {getFieldDecorator(fieldId, { rules, initialValue: initV })(
                        fieldNode
                      )}
                    </FormItem>
                  </Col>
                );
              default:
                return null;
            }
          })}
        </Row>
      </Form>
    );
  }
}
