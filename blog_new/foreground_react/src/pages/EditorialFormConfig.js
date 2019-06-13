import React from 'react';
import { Modal } from 'antd';
import CustomFormTable from '@/components/CustomFormTable';
import CustomUpload from '@/components/CustomUpload';
import CustomForm from '@/components/CustomForm';
import CustomIconFont from '@/components/CustomIconFont';
import LangConfig from '@/assets/LangConfig';
import { ProductEnum, UrlEnum } from '@/assets/Enum';
import { getLocale } from 'umi/locale';
import { apiPrefix, adminType } from '@/defaultSettings';

const lang = getLocale() === "zh-CN" ? "zh_CN" : "en_US";
const { CommonLang: { PICTURE_UPLOAD_FAIL, PROPERTY_NO_MODIFY } } = LangConfig;
const { BrandSupplierAPI, AttributeValueAPI, ShipModeAPI, ExpressSupplierAPI, ShipTemplateAPI, ShowNavGroupAPI, ModuleAPI } = UrlEnum;
const { EditMode_POS } = ProductEnum;

const getIconfont = ({ stateName = "selectedItems", selectedItems, handleSetState, ...otherProps }) =>
  <CustomIconFont
    lang={lang}
    selectedItems={selectedItems}
    onSelectIconfont={(val) => handleSetState({ [stateName]: val })}
    {...otherProps}
  />

const getUpload = ({ stateName = "fileList", fileList, handleSetState, ...otherProps }) =>
  <CustomUpload
    fileList={fileList}
    action={`${apiPrefix}/${adminType}/control/upload?type=30&folder=11`}
    handleUpload={(list) => {
      const arr = list.filter(i => i.url || (i.response && i.response.list));
      if (arr.length < list.length) Modal.error({ title: PICTURE_UPLOAD_FAIL[lang] });
      handleSetState({ [stateName]: arr });
    }}
    {...otherProps}
  />

const getList = ({ payload, request, handleSetState, handleGetState }) => {
  const { netUrl, index = 1, size = 6, query = "" } = payload;
  const arr = netUrl.split("/");
  const containerName = `${arr[1]}Container`;
  const callback = (res) => handleSetState({ [containerName]: { ...handleGetState(containerName), ...res, index, size, query } });
  request({ ...payload, is_enable: 1, index, size, manager_type: undefined }, callback);
}

// funcObj={request,handleSetState,handleGetState}
const searchItem = ({ query, container, pageIndex, pageSize, ...funcObj }) => {
  const { index: preIndex, size: preSize, netUrl } = container;
  const index = pageIndex || preIndex;
  const size = pageSize || preSize;
  const arr = netUrl.split("/");
  const queryObj = { [arr[1]]: query };
  if (netUrl === BrandSupplierAPI.LIST.url) queryObj.brand = query;// 品牌搜索条件名称与baseUrl不相同，需特殊处理
  if (netUrl === ShipModeAPI.LIST.url) queryObj.mode = query;
  if (netUrl === ExpressSupplierAPI.LIST.url) queryObj.express = query;
  if (netUrl === ShipTemplateAPI.LIST.url) queryObj.template = query;
  if ([ShowNavGroupAPI.LIST.url, ModuleAPI.LIST.url].includes(netUrl)) queryObj.name = query;
  const payload = { netUrl, is_dict: 1, index, size, query, ...queryObj };
  getList({ payload, ...funcObj });
}

const getSelectorConfig = ({ container, request, handleSetState, handleGetState, ...otherProps }) => {
  const funcObj = { request, handleSetState, handleGetState };
  const { netUrl, list, total, index: current, size: pageSize } = container;
  let newList = list;
  if (netUrl === ExpressSupplierAPI.LIST.url) newList = list.map(i => i.express || i);
  if (netUrl === BrandSupplierAPI.LIST.url) newList = list.map(i => i.brand || i);
  const newContainer = { ...container, list: newList };
  return {
    pagination: {
      total,
      current,
      pageSize,
      defaultPageSize: 6,
      usePagination: total > 6,
      onChange: (i, s) => searchItem({ query: "", container: newContainer, pageIndex: i, pageSize: s, ...funcObj })
    },
    options: newList.map(i => ({ label: i.name, value: i.id })),
    labelInValue: true,
    filterOption: false,
    onChange: () => searchItem({ query: "", container: newContainer, ...funcObj }),
    onSearch: (query) => searchItem({ query, container: newContainer, ...funcObj }),
    onMouseEnter: () => searchItem({ query: "", container: newContainer, ...funcObj }),
    style: { width: "86%" },
    ...otherProps
  };
}


const onHandleCustomTableChange = ({ keys, items, netUrl, formVerify, form, handleGetState, handleSetState, notAllowChange }) => {
  if (notAllowChange) {
    Modal.error({ title: PROPERTY_NO_MODIFY[lang] });
    return;
  }
  const arr = netUrl.split("/");
  const containerName = `${arr[1]}Container`;
  const containerObj = handleGetState(containerName);
  const { selectedItems } = containerObj;
  let newItems = [];
  if (netUrl === AttributeValueAPI.LIST.url) {
    const lastItem = items[items.length - 1] || {};
    const { edit_mode = EditMode_POS.MULTIPLE.code } = lastItem;
    if (edit_mode === EditMode_POS.SINGLE.code) {
      newItems = [...selectedItems.filter(i => i.attribute.id !== lastItem.attribute.id), lastItem];
    } else {
      const notIncludingItems = selectedItems.filter(i => keys.every(v => i.id !== v));
      const restItems = selectedItems.filter(i => notIncludingItems.every(v => i.id !== v.id));
      newItems = restItems.length < keys.length ? [...restItems.filter(i => items.every(v => i.id !== v.id)), ...items] : restItems.filter(i => keys.some(v => v === i.id));
    }
    handleSetState({ [containerName]: { ...containerObj, selectedItems: newItems } });
    if (formVerify && !newItems.length) form.setFieldsValue({ [`${arr[1]}s`]: [] });
    return;
  }
  if (selectedItems.length === keys.length) {
    newItems = items;
  } else if (selectedItems.length < keys.length) {
    newItems = [...selectedItems.filter(i => items.every(v => i.id !== v.id)), ...items];
  } else {
    newItems = selectedItems.filter(i => keys.some(v => v === i.id));
  }
  if (formVerify && !newItems.length) form.setFieldsValue({ [`${arr[1]}s`]: [] });
  handleSetState({ [containerName]: { ...containerObj, selectedItems: newItems } });
}

const getCommonSelectedTable = ({ container, itemTable, selectBtnName, actionColumnConfig, tableWidth, type, netValue, formVerify, request, handleSetState, handleGetState, form, notAllowChange, ...otherProps }) => {
  const { list, total, netUrl, selectedItems } = container;
  const props = {
    onHandleCustomTableChange,
    getList,
    key: netUrl,
    itemTable,
    selectBtnName,
    list,
    total,
    netUrl,
    selectedItems,
    tableWidth,
    type,
    lang,
    netValue,
    actionColumnConfig,
    formVerify,
    request,
    handleSetState,
    handleGetState,
    form,
    notAllowChange,
    ...otherProps
  };
  return <CustomFormTable {...props} />;
}

const getModalForm = ({ initialFormData = {}, editorialPanelVisible, toggleEdit, form, formConfig, INSERT, UPDATE, ...otherProps }) =>
  <Modal
    title={initialFormData.id ? UPDATE.desc[lang] : INSERT.desc[lang]}
    visible={editorialPanelVisible}
    onOk={toggleEdit}
    onCancel={() => toggleEdit("cancel")}
    maskClosable={false}
    width={1200}
    {...otherProps}
  >
    <CustomForm {...{ formConfig, form, initialFormData, lang }} />
  </Modal>

const EditorialFormConfig = { getUpload, getModalForm, getList, searchItem, getSelectorConfig, onHandleCustomTableChange, getCommonSelectedTable, getIconfont };
export default EditorialFormConfig;




