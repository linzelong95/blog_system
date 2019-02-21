import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Col, Row, Button, Tooltip, Tag, Icon, Drawer, Comment, Avatar,List,Divider,Form, Modal } from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Ellipsis from '@/components/Ellipsis';
import CustomForm from '@/components/SeftForm';
import Markdown from 'react-markdown/with-html';
import { timeFormat } from '@/utils/utils';
import styles from './index.less';
import moment from 'moment';

const CommentAPI={
    LIST: { url: "/api/admin/comment/list", desc: { zh_CN: "获取一级列表", en_US: "getList" } },
    DELETE: { url: "/api/admin/comment/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
    INSERT:{url: "/api/admin/comment/insert", desc: { zh_CN: "添加", en_US: "insert" }},
    CHECKPASS:{url: "/api/admin/comment/checkpass",desc: { zh_CN: "过审", en_US: "approve" }, actionTip: { zh_CN: "将审核通过！", en_US: "will be approved" }},
    CHECKUNPASS:{url: "/api/admin/comment/checkunpass",desc: { zh_CN: "拒审", en_US: "reject" }, actionTip: { zh_CN: "将审核不通过", en_US: "will be rejected" }},
}

// const data = [
//     {
//       actions: [<span>Reply to</span>],
//       author: 'Han Solo',
//       avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
//       content: (
//         <p>We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.</p>
//       ),
//       datetime: (
//         <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
//           <span>{moment().subtract(1, 'days').fromNow()}</span>
//         </Tooltip>
//       ),
//     },
//   ];

@connect(({ global }) => ({
  currentUser:global.currentUser
}))
@Form.create()
class ShowArticle extends React.Component {
    state = {
        reviewBoxVisible:false,
        clientHeight: document.documentElement.clientHeight,
        commentObj:{total:0,list:[]}
    };

    componentDidMount = () => {
        window.addEventListener("resize", this.onWindowResize);
        this.getCommentList();
    }

    componentWillUnmount = () => {
        window.removeEventListener("resize", this.onWindowResize);
    }

    getCommentList=()=>{
      const {request,item:{id:aid}}=this.props;
      request({netUrl:CommentAPI.LIST.url,aid},(commentObj)=>this.setState({commentObj}));
    }

    onWindowResize = () => this.setState({ clientHeight: document.documentElement.clientHeight });

    handleComment=(val)=>{
        const {request,form,item:{id:aid},currentUser}=this.props;
        if(val==="reset"){
            form.resetFields();
            return;
        }
        if(!currentUser.id){
          Modal.error({title:"请登录后再评论！"});
          return;
        }
        form.validateFields((err, values) => {
            console.log(values)
            if (err) return;
            const {to}=values;
            const from_id=currentUser.id;
            const netUrl = CommentAPI.INSERT.url;
            const to_id=to.key;
            const callback=(res)=>{
                this.toggleReviewBox();
                this.getCommentList();
            }
            request({ ...values, aid,from_id,to_id, netUrl },callback);
            form.resetFields();
        });
    }

    prepareToReply=(commentitem)=>{
        const {form,currentUser}=this.props;
        if(!currentUser.id){
          Modal.error({title:"请登录后再评论！"});
          return;
        }
        const {from_id:to_id,from_name:to_name,children,id,pid:p}=commentitem;
        const pid=p?p:id;
        this.setState({reviewBoxVisible:true},()=>form.setFieldsValue({pid:pid,to:{label:to_name,key:to_id}}));
    }

    toggleReviewBox=()=>this.setState(oldState=>({reviewBoxVisible:!oldState.reviewBoxVisible}));


    render() {
        const { visible, item, onClose,form } = this.props;
        const { clientHeight,commentObj,reviewBoxVisible } = this.state;
        const modalFormConfig = [
            { fieldId: 'to', label:"对象", fieldType: 'select', fieldProps: { options: [{key:item.author_id,label:"楼主"}],labelInValue:true,onChange:(obj)=>console.log(obj) },initialValue:{key:item.author_id,label:"楼主"}},
            { fieldId: 'content', label: '内容',  rules: [{ required: true, message: "内容不能为空" }], fieldType: 'textArea'},
            { fieldId: 'pid', style:{display:"none"} , fieldType: 'inputNumber',initialValue:0},
        ];
        return (
            <Drawer
                visible={visible}
                title={<div style={{ textAlign: "center" }}>{item.title}&nbsp;&nbsp;<Tag color="purple"><Icon type="tag" />&nbsp;{item.sort_name},{item.category_name}</Tag></div>}
                placement="bottom"
                height={clientHeight - 70}
                closable
                onClose={onClose}
            >
                <Row type="flex" justify="center" gutter={24}>
                    <Col span={12}>
                        <div style={{ maxHeight: clientHeight - 170, overflow: "auto" }}>
                            <div style={{ marginBottom: "10px", fontSize: "12px", textAlign: "CENTER" }}>
                                <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(item.create_time)))}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                <span><Icon type="edit" />&nbsp;{timeFormat(Number(new Date(item.modified_time)))}</span>
                            </div>
                            {item.label && <p style={{ textIndent: "2em" }}><b>标签：</b>{item.label.split("&&").map(i => <Tag color="volcano" style={{ textIndent: "0em" }}>{i}</Tag>)}</p>}
                            {item.abstract && <p style={{ textIndent: "2em" }}><b>摘要：</b>{item.abstract}</p>}
                            <Markdown source={item.content} escapeHtml={false} />
                        </div>
                    </Col>
                    <Col span={7}>
                    <div style={{marginBottom:"30px"}}>
                        <h2>回复区&nbsp;<Icon type={reviewBoxVisible?"down-circle":"up-circle"} style={{color:"#1890FF"}} onClick={this.toggleReviewBox} /></h2>
                        <Divider style={{marginTop:"-5px"}} />
                        {reviewBoxVisible&&
                            <Fragment>
                                <CustomForm {...{ modalFormConfig, form,formProps:{hideRequiredMark:true}}} />
                                <div style={{float:"right",marginTop:"10px"}}>
                                    <Button size="small" style={{marginRight:"10px"}} onClick={()=>this.handleComment("reset")}>重置</Button>
                                    <Button size="small" type="primary" onClick={this.handleComment}>发送</Button>
                                </div>
                            </Fragment>
                        }
                    </div>
                    <div>
                        <h2>{commentObj.total||0}&nbsp;条评论&nbsp;&nbsp;<Icon type="reload" style={{color:"#1890FF"}} onClick={this.getCommentList} /></h2>
                        <Divider style={{marginTop:"-5px"}} />
                        <div style={{ maxHeight: reviewBoxVisible?(clientHeight - 460):(clientHeight - 320), overflow: "auto" }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={commentObj.list||[]}
                                renderItem={listItem => (
                                    <Comment
                                        actions={[<span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(listItem.create_time)))}</span>,<a onClick={()=>this.prepareToReply(listItem)}>回复</a>]}
                                        author={listItem.from_name}
                                        avatar='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                        content={listItem.content}
                                    >
                                        {listItem.children.map(i=>
                                            <Comment
                                                actions={[<span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(i.create_time)))}</span>,<a onClick={()=>this.prepareToReply({...i,pid:listItem.id})}>回复</a>]}
                                                author={`${i.from_name} 回复@ ${i.to_name}`}
                                                avatar='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                                content={i.content}
                                            />
                                        )}
                                    </Comment>
                                )}
                            />
                        </div>
                    </div>
                    </Col>
                </Row>

            </Drawer>
        );
    }
}
export default ShowArticle;



