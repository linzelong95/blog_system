import React, { Fragment } from 'react';
import { Modal, Button, Table } from 'antd';
import StandardTable from '@/components/StandardTable';
import ConditionQuery from '@/components/ConditionQuery';
import LangConfig from '@/assets/LangConfig';

const { CommonLang: { CLEAR, SINGLE_SELECTION, MULTIPLE_SELECTION, CLOSE, ACTION, DROP } } = LangConfig;

class CustomFormTable extends React.PureComponent {
  state = {
    customFormTableVisible: false,
  };

  componentDidMount = () => {
    const { getList, netUrl, customValue = {}, index = 1, size = 6, conditionQuery: conditionQueryProp } = this.props;
    const { conditionQuery: conditionQueryCustom } = customValue;
    const conditionQuery = { ...conditionQueryProp, ...conditionQueryCustom };
    getList({ netUrl, index, size, ...customValue, conditionQuery });
  }

  cleanSelectedItem = () => this.handleSelectRows([], []);

  onQuery = (condition) => {
    const { getList, netUrl, customValue = {}, size, conditionQuery: conditionQueryProp } = this.props;
    const { conditionQuery: conditionQueryCustom } = customValue;
    let conditionQuery = { ...conditionQueryProp, ...conditionQueryCustom, ...condition };
    if (!Object.keys(condition).length) conditionQuery = { ...condition, ...conditionQueryCustom };
    getList({ netUrl, index: 1, size, ...customValue, conditionQuery });
  }

  toggleCustomFormTable = () => {
    const { doVerifyFunc = () => true } = this.props;
    const flag = doVerifyFunc();
    if (flag) this.setState((oldState) => ({ customFormTableVisible: !oldState.customFormTableVisible }));
  }

  handleSelectRows = (keys, items) => {
    const { onHandleCustomTableChange, formVerify } = this.props;
    onHandleCustomTableChange({ keys, items, formVerify });
  }

  dataChange = ({ current: index, pageSize: size }, filters, sorter) => {
    const { getList, netUrl, customValue = {}, conditionQuery: conditionQueryProp } = this.props;
    const { conditionQuery: conditionQueryCustom } = customValue;
    const { columnKey, order } = sorter;
    const orderBy = columnKey ? { name: columnKey, by: order === 'descend' ? 'desc' : 'asc' } : {};
    const conditionQuery = { ...conditionQueryProp, ...conditionQueryCustom, orderBy };
    getList({ netUrl, index, size, ...customValue, conditionQuery });
  };

  getTableScroll = (columns) => ({ x: !columns[0].width.toString().endsWith("%") ? columns.reduce((col_width, column) => col_width + column.width, 0) : undefined });

  render() {
    const {
      list = [],
      total = 6,
      index = 1,
      size = 6,
      selectedItems = [],
      hasConditionQuery = true,
      hasBaseTableRowSelection = true,
      hasBaseTableAction = true,
      hasShowTableAction = true,
      extraTip,
      selectBtnName,
      type = "checkbox",
      tableWidth,
      lang = "zh_CN",
      actionColumnConfig,
      onHandleCustomTableChange,
      actionColumn,
      netUrl,
      conditionQuery = {},
      itemTable: { COLUMNS, CONDITION },
      formVerify,
      notAllowChange,
      showTableConfig = {},
      additionalComponent = [],
      ...restProps
    } = this.props;
    const { customFormTableVisible } = this.state;
    const selectedRowKeys = selectedItems.map(i => i.id);
    const customActionColumn = actionColumn || {
      title: ACTION[lang],
      dataIndex: 'x',
      align: 'center',
      render: (_, item) => selectedItems.some(i => i.id === item.id) &&
        <Button size="small" style={{ color: "white", background: "red" }} onClick={() => onHandleCustomTableChange({ keys: selectedItems.filter(i => i.id !== item.id).map(i => i.id), items: [], formVerify, notAllowChange })}>{DROP[lang]}</Button>,
      ...actionColumnConfig
    };
    const baseTableColumns = hasBaseTableAction ? [...COLUMNS, customActionColumn] : COLUMNS;
    const showTableColumns = hasShowTableAction ? [...COLUMNS, customActionColumn] : COLUMNS;
    return (
      <Fragment>
        <Button type="primary" icon="folder-open" onClick={this.toggleCustomFormTable}>{selectBtnName}</Button>&nbsp;&nbsp;
        {selectedItems.length > 0 && <Button type="danger" icon="delete" onClick={this.cleanSelectedItem}>{CLEAR[lang]}</Button>}
        <span style={{ color: "#1890FF", marginLeft: "10px" }}>{type === "checkbox" ? MULTIPLE_SELECTION[lang] : SINGLE_SELECTION[lang]}</span>
        <span style={{ color: "red", marginLeft: "10px" }}>{extraTip}</span>
        {selectedItems.length > 0 &&
          <Table
            dataSource={selectedItems}
            columns={showTableColumns}
            rowKey={record => record.id}
            pagination={false}
            size="small"
            scroll={this.getTableScroll(showTableColumns)}
            style={{ ...tableWidth, marginTop: "10px" }}
            {...showTableConfig}
          />
        }
        <Modal
          title={selectBtnName}
          destroyOnClose
          visible={customFormTableVisible}
          onCancel={this.toggleCustomFormTable}
          footer={[
            ...additionalComponent.map(i => i.component),
            <Button type="primary" onClick={this.toggleCustomFormTable}>{CLOSE[lang]}</Button>
          ]}
          maskClosable={false}
          width={1200}
        >
          {hasConditionQuery && <ConditionQuery modalFormConfig={CONDITION} condition={conditionQuery} onQuery={this.onQuery} lang={lang} />}
          <StandardTable
            number={selectedItems.length}
            cleanSelectedItem={this.cleanSelectedItem}
            rowSelection={hasBaseTableRowSelection ? { selectedRowKeys, type, onChange: this.handleSelectRows, getCheckboxProps: (record) => ({ disabled: record.disabled }) } : undefined}
            dataSource={list}
            columns={baseTableColumns}
            rowKey={record => record.id}
            pagination={{ showQuickJumper: true, showSizeChanger: true, total, current: index, pageSize: size, defaultPageSize: size === 100 ? 100 : 6, pageSizeOptions: ["6", "12", "24", "36", "100"] }}
            onChange={this.dataChange}
            scroll={this.getTableScroll(baseTableColumns)}
            lang={lang}
            {...restProps}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default CustomFormTable;
