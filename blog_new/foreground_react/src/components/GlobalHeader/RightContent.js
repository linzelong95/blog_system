import React, { PureComponent, Fragment } from 'react';
import { FormattedMessage, formatMessage ,getLocale} from 'umi/locale';
import Link from 'umi/link';
import { Tag, Menu, Icon, Dropdown, Avatar, Tooltip, Modal, Button, List, Rate ,Row,Col} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
// import { imgPrefix } from '@/defaultSettings';
// import { MessageEnum, OrderEnum, UrlEnum,CommonEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';
import styles from './index.less';

const lang = getLocale() === "zh-CN" ? "zh_CN" : "en_US";
// const { LetterType } = MessageEnum;
// const { OrderStatus,PriceType } = OrderEnum;
// const { LetterAPI: { READ,DETAIL,DELETE },ReviewAPI: { TOP, UNTOP, SHOW, UNSHOW } ,OrderAPI: { CLOSE, SEND }} = UrlEnum;
// const {Bool, CheckStatus,Show ,Top,Read} = CommonEnum;
const {
  // CommonLang:{CANCEL,DELIVERY_DATE,STATUS},
  // LetterLang:{LETTER_READ_DATE},
  // ReviewLang:{REVIEW_NAME,REVIEW_PRODUCT,REVIEW_GIVE_FIRST_COMMENT,REVIEW_GIVE_SECOND_COMMENT},
  // OrderLang:{ORDER_NO,ORDER_DEAL_WITH,ORDER_USER,ORDER_TIME,ORDER_AMOUNT,ORDER_ACTIVITY_DISCOUNT,ORDER_COUPON_DISCOUNT,ORDER_TAX_DISCOUNT,ORDER_TOTAL_TAX,ORDER_FREIGHT_DISCOUNT,ORDER_TOTAL_FREIGHT,ORDER_VIP_DISCOUNT,ORDER_WAREHOUSE,ORDER_CLOSE_TIP_IN_NOTICE},
  // ProductLang:{PRODUCT_CODE},
  GlobalHeaderLang:{GLOBALHEADER_INFO,GLOBALHEADER_REVIEW,GLOBALHEADER_EVENT}
}=LangConfig;

export default class GlobalHeaderRight extends PureComponent {

  state = {
    noticeModalConfig: {
      visible: false,
      title: "",
      content: "",
      footer: [],
      onCancel:null
    },
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  clickNoticeItem = (item, tabProps) => {
    // const { handleNoticeModal } = this.props;
    // const { name } = tabProps;
    // const onCancel=()=>this.setState({ noticeModalConfig: { visible: false } });
    // const handleItems = (netUrl,items) => {
    //   handleNoticeModal({ items, netUrl });
    //   this.setState({ noticeModalConfig: { visible: false } });
    // };
    // if (name === "letter") {
    //   const callback = (res) => {
    //     const { item: { id, title: t, content: c, send_date, read_date, is_read, msg_type } } = res;
    //     const title = <span><Tag color="blue">{LetterType[msg_type][lang]}</Tag>&nbsp;{t}&nbsp;[<b>{Read[is_read][lang]}</b>]</span>;
    //     const content = (
    //       <List>
    //         <List.Item.Meta
    //           avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />}
    //           title={<span>{t}</span>}
    //           description={
    //             <div>
    //               <p>{c}</p>
    //               <div style={{ float: "right" }}>
    //                 <div>{DELIVERY_DATE[lang]}：{send_date}</div>
    //                 <div>{LETTER_READ_DATE[lang]}：{read_date}</div>
    //               </div>
    //               <div style={{ clear: "both" }} />
    //             </div>
    //           }
    //         />
    //       </List>
    //     );
    //     const footer = [
    //       <Button key="ok" type="primary" onClick={() => handleItems(READ.url,[{ id, name: t }])}>{READ.desc[lang]}</Button>,
    //       <Button key="delete" onClick={() => handleItems(READ.url,[{ id, name: t }])}>{DELETE.desc[lang]}</Button>,
    //       <Button key="back" onClick={onCancel}>{CANCEL[lang]}</Button>,
    //     ];
    //     this.setState({ noticeModalConfig: { visible: true, title, content, footer ,onCancel} });
    //   }
    //   handleNoticeModal({netUrl: DETAIL.url, items: [{ id: item.id, name: item.title }]},callback);
    // }
    // if (name === "review") {
    //   const { id,order_no, product_code, is_top, is_show, check_status, user_name, has_add_to, product_name, text, text2, level } = item;
    //   const title = <span>{order_no}&nbsp;&nbsp;<Tag color="blue">{REVIEW_NAME[lang]}</Tag></span>;
    //   const content = (
    //     <List>
    //       <List.Item>
    //         <List.Item.Meta
    //           avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />}
    //           title={
    //             <a>{ORDER_NO[lang]}：{order_no}&nbsp;&nbsp;
    //               <Tag color="magenta">{Top[is_top][lang]}</Tag>
    //               <Tag color="orange">{Show[is_show][lang]}</Tag>
    //               <Tag color="cyan">{CheckStatus[check_status][lang]}</Tag>
    //             </a>
    //           }
    //           description={
    //             <div>
    //               <span style={{ color: "#1890FF" }}><i>{user_name}&nbsp;</i></span>
    //               <span>{has_add_to ? REVIEW_GIVE_SECOND_COMMENT[lang]: REVIEW_GIVE_FIRST_COMMENT[lang]}{REVIEW_PRODUCT[lang]}&nbsp;</span>
    //               <span style={{ color: "#A0522D" }}><i>{product_name}({PRODUCT_CODE[lang]}：{product_code})&nbsp;</i>:</span>
    //               <span style={{ color: "#2E2E2E" }}>
    //                 <Rate allowHalf defaultValue={level} count={5} disabled />
    //                 <i>{has_add_to ? text2 : text}</i>
    //               </span>
    //             </div>
    //           }
    //         />
    //       </List.Item>
    //     </List>
    //   );
    //   const footer = [
    //     <Button key="back" onClick={onCancel}>{CANCEL[lang]}</Button>,
    //     Bool[is_top].flag && Bool[is_show].flag &&<Button key="1" type="primary" onClick={() => handleItems(UNTOP.url,[{ id, name: product_name }])}>{UNTOP.desc[lang]}</Button>,
    //     !Bool[is_top].flag && Bool[is_show].flag &&<Button key="2" type="primary" onClick={() => handleItems(TOP.url,[{ id, name: product_name }])}>{TOP.desc[lang]}</Button>,
    //     !Bool[is_show].flag &&<Button key="3" type="primary" onClick={() => handleItems(SHOW.url,[{ id, name: product_name }])}>{SHOW.desc[lang]}</Button>,
    //     Bool[is_show].flag &&<Button key="4" type="primary" onClick={() => handleItems(UNSHOW.url,[{ id, name: product_name }])}>{UNSHOW.desc[lang]}</Button>,
    //   ];
    //   this.setState({ noticeModalConfig: { visible: true, title, content, footer ,onCancel} });
    // }
    // if (name === "order") {
    //   const { id,order_no,user_name, add_date,amount,activity_dcnt,coupon_dcnt,warehouse_name,member_dcnt,freight,freight_dcnt,tax,tax_dcnt,order_status, product_name,items:productItems } = item;
    //   const title = <span>{order_no}&nbsp;&nbsp;<Tag color="blue">{ORDER_DEAL_WITH[lang]}</Tag></span>;
    //   const content = (
    //     <div style={{margin:"0px 30px"}}>
    //       <table border="1px" cellPadding="10px">
    //         <tr>
    //           <th>ID</th><td>{id}</td>
    //           <th colSpan="2">{ORDER_NO[lang]}</th><td colSpan="4">{order_no}</td>
    //         </tr>
    //         <tr>
    //           <th>{ORDER_USER[lang]}</th><td>{user_name}</td>
    //           <th colSpan="2">{ORDER_TIME[lang]}</th><td colSpan="4">{add_date}</td>
    //         </tr>
    //         <tr>
    //           <th>{ORDER_AMOUNT[lang]}</th><td>{amount}</td>
    //           <th colSpan="2">{ORDER_ACTIVITY_DISCOUNT[lang]}</th><td>{activity_dcnt}</td>
    //           <th colSpan="2">{ORDER_COUPON_DISCOUNT[lang]}</th><td>{coupon_dcnt}</td>
    //         </tr>
    //         <tr>
    //           <th>{ORDER_WAREHOUSE[lang]}</th><td>{warehouse_name}</td>
    //           <th>{ORDER_VIP_DISCOUNT[lang]}</th><td>{member_dcnt}</td>
    //           <th>{ORDER_TOTAL_FREIGHT[lang]}</th><td>{freight}</td>
    //           <th>{ORDER_FREIGHT_DISCOUNT[lang]}</th><td>{freight_dcnt}</td>
    //         </tr>
    //         <tr>
    //           <th>{ORDER_TOTAL_TAX[lang]}</th><td>{tax}</td>
    //           <th colSpan="2">{ORDER_TAX_DISCOUNT[lang]}</th><td>{tax_dcnt}</td>
    //           <th colSpan="2">{STATUS[lang]}</th><td>{OrderStatus[order_status][lang]}</td>
    //         </tr>
    //       </table>
    //       <List
    //         itemLayout="horizontal"
    //         dataSource={productItems}
    //         renderItem={i => (
    //           <List.Item>
    //             <List.Item.Meta
    //               avatar={<Avatar size="large" src={`${imgPrefix}/${i.image_url}`} />}
    //               title={
    //                 <Row>
    //                   <Col span={16}>{i.name}&nbsp;<Tag color="green">{PriceType[i.price_type][lang]}</Tag></Col>
    //                   <Col span={2} />
    //                   <Col span={6} style={{ "textAlign": "right",color:"red" }}><Icon type="pay-circle-o" />&nbsp;{i.real_price}</Col>
    //                 </Row>
    //               }
    //               description={
    //                 <Row>
    //                   <Col span={16}>{i.attribute.join(" ")}</Col>
    //                   <Col span={8} style={{ "textAlign": "right" }}>x{i.quantity}</Col>
    //                 </Row>
    //               }
    //             />
    //           </List.Item>
    //       )}
    //       />
    //     </div>
    //   );
    //   const footer = [
    //     <Button key="back" onClick={onCancel}>{CANCEL}</Button>,
    //     order_status === 2 && <Button key="1" type="primary" onClick={() => handleItems(SEND.url,[{ id, name: product_name }])}>{SEND.desc[lang]}</Button>,
    //     order_status > 0 && item.order_status < 4 && <Button key="2" type="primary" onClick={() => Modal.info({title:ORDER_CLOSE_TIP_IN_NOTICE[lang],zIndex:9999})}>{CLOSE.desc[lang]}</Button>
    //   ];
    //   this.setState({ noticeModalConfig: { visible: true, title, content, footer ,onCancel} });
    // }
  }

  render() {
    const {
      currentUser,
      fetchingNotices,
      notifyCount,
      // onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
      localCity
    } = this.props;
    const { noticeModalConfig } = this.state;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {/* <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder={formatMessage({ id: 'component.globalHeader.search' })}
          dataSource={[
            formatMessage({ id: 'component.globalHeader.search.example1' }),
            formatMessage({ id: 'component.globalHeader.search.example2' }),
            formatMessage({ id: 'component.globalHeader.search.example3' }),
          ]}
          onSearch={value => {
            console.log('input', value); // eslint-disable-line
          }}
          onPressEnter={value => {
            console.log('enter', value); // eslint-disable-line
          }}
        />
        <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
        <NoticeIcon
          className={styles.action}
          count={notifyCount}
          onItemClick={this.clickNoticeItem}
          locale={{
            emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
            clear: formatMessage({ id: 'component.noticeIcon.clear' }),
          }}
          onClear={onNoticeClear}
          // onPopupVisibleChange={onNoticeVisibleChange}
          loading={fetchingNotices}
          popupAlign={{ offset: [20, -16] }}
          clearClose
        >
          <NoticeIcon.Tab
            list={noticeData.letter}
            title={GLOBALHEADER_INFO[lang]}
            name="letter"
            emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
          <NoticeIcon.Tab
            list={noticeData.review}
            title={GLOBALHEADER_REVIEW[lang]}
            name="review"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
          <NoticeIcon.Tab
            list={noticeData.order}
            title={GLOBALHEADER_EVENT[lang]}
            name="order"
            emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
          />
        </NoticeIcon> */}
        <span>
          <Icon type="environment" />
          <span style={{margin:"0px 15px 0px 3px"}}>{localCity}</span>
        </span>
        {currentUser.account ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.nick_name||currentUser.account}</span>
            </span>
          </Dropdown>
        ) : (
          <Fragment>
            <Link to="/user/login"><Button type="primary" size="small">登录</Button></Link>&nbsp;&nbsp;
            <Link to="/user/register"><Button type="danger" size="small">注册</Button></Link>
          </Fragment>
          )}
        <SelectLang className={styles.action} />
        <Modal
          {...noticeModalConfig}
          maskClosable={false}
          width={610}
          zIndex={5000}
        >
          {noticeModalConfig.content}
        </Modal>
      </div>

    );
  }
}
