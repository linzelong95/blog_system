import React, { Fragment } from 'react';
import { Modal, Button, List } from 'antd';
import LangConfig from '@/assets/LangConfig';
import { getIconFont } from '@/services/api';

const { CommonLang: { CLEAR, SINGLE_SELECTION, MULTIPLE_SELECTION, CLOSE, DROP, ICONFONT } } = LangConfig;

class CustomIconFont extends React.PureComponent {
  state = {
    customIconFontVisible: false,
    iconList: []
  };

  componentDidMount = () => {
    getIconFont().then(res => {
      const iconList = res.match(/icon-(\S*):/g).map(i => `icon iconfont ${i.substring(0, i.length - 1)}`);
      this.setState({ iconList });
    });
  }

  handleOnClick = (val) => {
    const { onSelectIconfont, selectedItems, mode } = this.props;
    let newItems = [];
    if (val) {
      if (selectedItems.includes(val)) {
        newItems = selectedItems.filter(i => i !== val);
      } else {
        newItems = mode === "multiple" ? [...selectedItems, val] : [val];
      }
    }
    onSelectIconfont(newItems);
  }

  toggleCustomIconFont = () => this.setState((oldState) => ({ customIconFontVisible: !oldState.customIconFontVisible }));

  render() {
    console.log(this.state.iconList)
    const { selectedItems, extraTip, selectBtnName, mode = "single", baseListGrid, showListGrid, baseListStyle, lang } = this.props;
    const { customIconFontVisible, iconList } = this.state;
    return (
      <Fragment>
        <Button type="primary" icon="folder-open" onClick={this.toggleCustomIconFont}>{selectBtnName || ICONFONT[lang]}</Button>&nbsp;&nbsp;
        {selectedItems.length > 0 && <Button type="danger" icon="delete" onClick={() => this.handleOnClick()}>{CLEAR[lang]}</Button>}
        <span style={{ color: "#1890FF", marginLeft: "10px" }}>{mode === "multiple" ? MULTIPLE_SELECTION[lang] : SINGLE_SELECTION[lang]}</span>&nbsp;&nbsp;
        <span style={{ color: "red", marginLeft: "10px" }}>{extraTip}</span>
        {selectedItems.length > 0 &&
          <List
            itemLayout="vertical"
            grid={{ gutter: 16, column: 12, ...showListGrid }}
            dataSource={selectedItems}
            renderItem={item => (
              <List.Item
                style={{ marginTop: "10px" }}
                actions={[<Button type="danger" size="small" onClick={() => this.handleOnClick(item)}>{DROP[lang]}</Button>]}
              >
                <span className={item} style={{ fontSize: "25px", marginLeft: "12px" }} />
              </List.Item>
            )}
          />
        }
        <Modal
          title={selectBtnName || ICONFONT[lang]}
          visible={customIconFontVisible}
          onCancel={this.toggleCustomIconFont}
          footer={<Button type="primary" onClick={this.toggleCustomIconFont}>{CLOSE[lang]}</Button>}
          maskClosable={false}
          width={baseListStyle && baseListStyle.width ? parseInt(baseListStyle.width, 10) + 50 : 850}
        >
          <List
            style={{ maxWidth: 800, maxHeight: 550, overflow: "auto", overflowX: "hidden", cursor: "pointer", ...baseListStyle }}
            grid={{ gutter: 16, column: 12, ...baseListGrid }}
            dataSource={iconList}
            renderItem={item => (
              <List.Item style={{ textAlign: "center", border: selectedItems.includes(item) ? "1px solid #1890FF" : "1px solid white" }} onClick={() => this.handleOnClick(item)}>
                <span className={item} style={{ fontSize: "30px", color: selectedItems.includes(item) ? "#1890FF" : "" }} />
              </List.Item>
            )}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default CustomIconFont;

