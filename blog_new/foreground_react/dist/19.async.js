(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[19],{"le/K":function(e,t,l){"use strict";var a=l("u+rM"),r=l("CKcX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,l("TlP+");var n=a(l("Kvux"));l("Wew0");var i=a(l("6ari"));l("mkII");var o=a(l("gEQx"));l("G9XZ");var u=a(l("3W/2"));l("EmKL");var d=a(l("LVAb"));l("sv/Q");var c=a(l("y0qb"));l("juKg");var s=a(l("zbZp"));l("GMBr");var f=a(l("xmhh"));l("vmCv");var m=a(l("r1YA"));l("B0zW");var p=a(l("Jzy4"));l("Z8+P");var y=a(l("FZxh"));l("dgr1");var E=a(l("pG6y")),v=a(l("smUt")),h=a(l("Pjwa")),g=a(l("2cji")),b=a(l("sp3j")),w=a(l("vZkh")),x=a(l("+KCP"));l("mj0v");var D,R,k,C,I=a(l("5m8i")),A=r(l("uqIC")),S=l("LneV"),N=a(l("v99g")),F=a(l("b+yu")),V=a(l("Vc2f")),P=l("mstx"),T=l("+n12"),L=P.UrlEnum.UserArticleAPI,B=P.UrlEnum.UserReplyAPI,U=P.UrlEnum.AdminReplyAPI,W=(D=(0,S.connect)(function(e){var t=e.articleManagement,l=e.loading,a=e.global;return{articleManagement:t,loading:l.models.articleManagement,currentUser:a.currentUser}}),R=I.default.create(),D(k=R((C=function(e){function t(){var e,l;(0,h.default)(this,t);for(var a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];return l=(0,b.default)(this,(e=(0,w.default)(t)).call.apply(e,[this].concat(r))),l.state={reviewBoxVisible:!1,reviewDrawerVisible:!1,replyObj:{total:0,list:[]},conditionQuery:{},item:{}},l.componentDidMount=function(){var e=l.props.match.params.id,t=1*e;l.request({conditionQuery:{articleId:t}},function(e){l.request({netUrl:L.CONTENT.url,articleId:t},function(t){l.setState({item:(0,v.default)({},e.list[0],{content:t.list[0].content})})})})},l.componentWillUnmount=function(){l.props.dispatch({type:"articleManagement/save",payload:{list:[]}})},l.request=function(e,t){var a=l.state.conditionQuery,r=(0,v.default)({},a);delete r.filteredSortArr;var n=(0,v.default)({netUrl:L.LIST.url,conditionQuery:r},e);l.props.dispatch({type:"articleManagement/handleArticles",payload:n,callback:t})},l.getReplyList=function(){var e=l.props,t=e.match.params.id,a=e.currentUser.roleName,r=l.state.conditionQuery,n=(0,v.default)({},r,{articleIdsArr:[t]}),i="admin"===a?U.LIST.url:B.LIST.url;l.request({netUrl:i,conditionQuery:n,prettyFormat:!0},function(e){return l.setState({replyObj:e,conditionQuery:n})})},l.replySort=function(e){var t=e.currentTarget.id,a=l.state.conditionQuery.orderBy,r=void 0===a?{}:a;l.setState(function(e){return{conditionQuery:(0,v.default)({},e.conditionQuery,{orderBy:{name:t,by:"ASC"===r.by?"DESC":"ASC"}})}},function(){return l.getReplyList()})},l.handleWriteReply=function(e){var t=l.props,a=t.form,r=t.currentUser,n=r.id,i=r.roleName,o=l.state.item,u=o.id,d=o.user.id;"reset"!==e?n?a.validateFields(function(e,t){if(!e){var r=t.to,o=n,c="admin"===i?U.INSERT.url:B.INSERT.url,s=r.key,f=d===n?1:0;l.request((0,v.default)({},t,{isApproved:f,articleId:u,fromId:o,toId:s,netUrl:c}),function(){l.toggleReviewBox(),l.getReplyList(),y.default.success("\u8bc4\u8bba\u6210\u529f\uff0c\u5ba1\u6838\u901a\u8fc7\u540e\u5c06\u5f97\u4ee5\u5c55\u793a\uff01")}),a.resetFields()}}):E.default.error({title:"\u8bf7\u767b\u5f55\u540e\u518d\u8bc4\u8bba\uff01"}):a.resetFields()},l.handleDealWithReply=function(e,t){var a=l.props,r=a.form,n=a.currentUser.id;if(n){var i=e.from,o=i.id,u=i.nickName,d=e.id,c=e.parentId,s=e.reply;if(t&&[B.DELETE.url,U.DELETE.url,U.APPROVE.url,U.DISAPPROVE.url].includes(t.url)){var f=[{id:d,parentId:c,name:s}];l.request({netUrl:t.url,items:f},function(){return l.getReplyList()})}else{var m=c>0?c:d;l.setState({reviewBoxVisible:!0},function(){r.setFieldsValue({parentId:m,to:{label:u,key:o}})})}}else E.default.error({title:"\u767b\u5f55\u540e\u624d\u53ef\u8fdb\u884c\u64cd\u4f5c\uff01"})},l.toggleReviewBox=function(){return l.setState(function(e){return{reviewBoxVisible:!e.reviewBoxVisible}})},l.handlePageChange=function(e,t){return l.request({index:e,size:t})},l.toggleShowReviewDrawer=function(){var e=l.state.reviewDrawerVisible;e||l.getReplyList(),l.setState({reviewDrawerVisible:!e})},l}return(0,x.default)(t,e),(0,g.default)(t,[{key:"render",value:function(){var e=this,t=this.props,l=t.form,a=t.currentUser,r=t.loading,y=this.state,E=y.replyObj,h=y.reviewBoxVisible,g=y.conditionQuery,b=y.item,w=y.reviewDrawerVisible,x=[{fieldId:"to",label:"\u5bf9\u8c61",fieldType:"select",fieldProps:{options:[{key:b.user&&b.user.id,label:"\u697c\u4e3b"}],labelInValue:!0},initialValue:{key:b.user&&b.user.id,label:"\u697c\u4e3b"}},{fieldId:"reply",label:"\u5185\u5bb9",rules:[{required:!0,message:"\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a"}],fieldType:"textArea"},{fieldId:"parentId",style:{display:"none"},fieldType:"inputNumber",initialValue:0}];return A.default.createElement(N.default,null,A.default.createElement(n.default,{style:{position:"relative"}},A.default.createElement("div",{onClick:this.toggleShowReviewDrawer,style:{position:"fixed",right:"0px",top:"300px",height:"50px",width:"50px",background:"#1890FF",display:"flex",justifyContent:"center",alignItems:"center"}},A.default.createElement(p.default,{type:"form",style:{color:"white",fontWeight:"bold",fontSize:"20px"}})),A.default.createElement(s.default,{type:"flex",justify:w?"start":"center"},A.default.createElement(f.default,{span:w?16:22},A.default.createElement("div",{style:{marginBottom:"10px",fontSize:"12px",textAlign:"CENTER"}},A.default.createElement("h1",null,b.title),A.default.createElement("span",null,A.default.createElement(p.default,{type:"clock-circle"}),"\xa0",(0,T.timeFormat)(Number(new Date(b.createDate)))),"\xa0\xa0\xa0\xa0",A.default.createElement("span",null,A.default.createElement(p.default,{type:"edit"}),"\xa0",(0,T.timeFormat)(Number(new Date(b.updateDate))))),b.label&&A.default.createElement("p",{style:{textIndent:"2em"}},A.default.createElement("b",null,"\u6807\u7b7e\uff1a"),b.label.map(function(e){return A.default.createElement(m.default,{color:"volcano",style:{textIndent:"0em"}},e.name)})),b.abstract&&A.default.createElement("p",{style:{textIndent:"2em"}},A.default.createElement("b",null,"\u6458\u8981\uff1a"),b.abstract),A.default.createElement(V.default,{value:b.content}))),A.default.createElement(i.default,{visible:w,title:A.default.createElement("div",null,E.total||0,"\xa0\u6761\u8bc4\u8bba\xa0",A.default.createElement(p.default,{type:"reload",style:{color:"#1890FF"},onClick:this.getReplyList}),A.default.createElement(m.default,{color:"purple",id:"createDate",style:{marginLeft:"10px"},onClick:this.replySort},"\u65f6\u95f4",A.default.createElement(p.default,{type:g.orderBy&&"createDate"===g.orderBy.name&&"ASC"===g.orderBy.by?"up":"down"}))),onClose:this.toggleShowReviewDrawer,width:500},w&&A.default.createElement("div",{onClick:this.toggleShowReviewDrawer,style:{position:"absolute",left:"-50px",top:"300px",height:"50px",width:"50px",background:"#1890FF",display:"flex",justifyContent:"center",alignItems:"center"}},A.default.createElement(p.default,{type:"close",style:{color:"white",fontWeight:"bold",fontSize:"20px"}})),A.default.createElement("div",{style:{marginBottom:"30px"}},A.default.createElement("h2",null,"\u56de\u590d\u6846\xa0",A.default.createElement(p.default,{type:h?"down-circle":"up-circle",style:{color:"#1890FF"},onClick:this.toggleReviewBox})),A.default.createElement(c.default,{style:{marginTop:"-5px"}}),h&&A.default.createElement(A.Fragment,null,A.default.createElement(F.default,{formConfig:x,form:l,formProps:{hideRequiredMark:!0}}),A.default.createElement("div",{style:{float:"right",marginTop:"10px"}},A.default.createElement(d.default,{size:"small",style:{marginRight:"10px"},onClick:function(){return e.handleWriteReply("reset")}},"\u91cd\u7f6e"),A.default.createElement(d.default,{size:"small",type:"primary",onClick:this.handleWriteReply},"\u53d1\u9001")))),A.default.createElement("div",null,A.default.createElement(o.default,{loading:r,itemLayout:"horizontal",dataSource:E.list||[],renderItem:function(t){return A.default.createElement(u.default,{key:t.id,actions:[A.default.createElement("span",null,A.default.createElement(p.default,{type:"clock-circle"}),"\xa0",(0,T.timeFormat)(Number(new Date(t.createDate)))),A.default.createElement("span",null,A.default.createElement("a",{onClick:function(){return e.handleDealWithReply(t)}},"\u56de\u590d")),("admin"===a.roleName||a.id===t.from.id)&&A.default.createElement("span",null,A.default.createElement("a",{onClick:function(){return e.handleDealWithReply(t,"admin"===a.roleName?U.DELETE:B.DELETE)},style:{color:"red"}},"\u5220\u9664")),"admin"===a.roleName&&0===t.isApproved&&A.default.createElement("span",null,A.default.createElement("a",{onClick:function(){return e.handleDealWithReply(t,U.APPROVE)},style:{color:"#66CD00"}},"\u5c55\u793a")),"admin"===a.roleName&&1===t.isApproved&&A.default.createElement("span",null,A.default.createElement("a",{onClick:function(){return e.handleDealWithReply(t,U.DISAPPROVE)},style:{color:"#BF3EFF"}},"\u9690\u85cf")," ")],author:t.from.nickName,avatar:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",content:t.isApproved||"admin"===a.roleName?A.default.createElement("span",{style:{color:0===t.isApproved?"lightgray":""}},t.reply):"\uff08\u8be5\u8bc4\u8bba\u5f85\u5ba1\u6838\uff09"},t.children.map(function(l){return A.default.createElement(u.default,{key:l.id,actions:[A.default.createElement("span",null,A.default.createElement(p.default,{type:"clock-circle"}),"\xa0",(0,T.timeFormat)(Number(new Date(l.createDate)))),A.default.createElement("span",null,A.default.createElement("a",{onClick:function(){return e.handleDealWithReply((0,v.default)({},l,{parentId:t.id}))}},"\u56de\u590d")),("admin"===a.roleName||a.id===l.from.id)&&A.default.createElement("span",null,A.default.createElement("a",{onClick:function(){return e.handleDealWithReply(l,"admin"===a.roleName?U.DELETE:B.DELETE)},style:{color:"red"}},"\u5220\u9664")),"admin"===a.roleName&&0===l.isApproved&&A.default.createElement("span",null,A.default.createElement("a",{onClick:function(){return e.handleDealWithReply(l,U.APPROVE)},style:{color:"#66CD00"}},"\u5c55\u793a")),"admin"===a.roleName&&1===l.isApproved&&A.default.createElement("span",null,A.default.createElement("a",{onClick:function(){return e.handleDealWithReply(l,U.DISAPPROVE)},style:{color:"#BF3EFF"}},"\u9690\u85cf")," ")],author:"".concat(l.from.nickName," \u56de\u590d@ ").concat(l.to.nickName),avatar:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",content:l.isApproved||"admin"===a.roleName?A.default.createElement("span",{style:{color:0===l.isApproved?"lightgray":""}},l.reply):"\uff08\u8be5\u8bc4\u8bba\u5f85\u5ba1\u6838\uff09"})}))}})))))}}]),t}(A.default.Component),k=C))||k)||k),j=W;t.default=j}}]);