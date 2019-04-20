
const urls= {

  AccountAPI: {
    BASE_URL: "/account",
    REGISTER: { url: "/api/account/register", desc: { zh_CN: "注册", en_US: "register" } },
    LOGIN: { url: "/api/account/login", desc: { zh_CN: "登录", en_US: "login" } },
    LOGOUT: { url: "/api/account/logout", desc: { zh_CN: "注销", en_US: "logout" } },
    GET_PUBLICK_KEY: { url: "/api/account/getpublickey", desc: { zh_CN: "获取公钥", en_US: "get the public key" } },
    GET_WEBPAGE_CAPTCHA: { url: "/api/account/getcaptcha", desc: { zh_CN: "获取网页验证码", en_US: "get captcha of phone" } },
    VERIFY_WEBPAGE_CAPTCHA: { url: "/api/account/verifycaptcha", desc: { zh_CN: "验证网页验证码", en_US: "verify captcha of phone" } },

  },

  UserArticleAPI: {
    BASE_URL: "/user/article",
    LIST: { url: "/api/user/article/list", desc: { zh_CN: "获取文章列表", en_US: "getList" } },
    CONTENT: { url: "/api/user/article/content", desc: { zh_CN: "获取内容", en_US: "getContent" } },
  },
  UserCateAPI: {
    BASE_URL: "/user/cate",
    LIST: { url: "/api/user/cate/list", desc: { zh_CN: "获取分类列表", en_US: "getList" } },
  },
  UserSortAPI: {
    BASE_URL: "/user/sort",
    LIST: { url: "/api/user/sort/list", desc: { zh_CN: "获取分类列表", en_US: "getList" } },
  },
  UserReplyAPI: {
    LIST: { url: "/api/user/reply/list", desc: { zh_CN: "获取一级列表", en_US: "getList" } },
    DELETE: { url: "/api/user/reply/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
    INSERT: { url: "/api/user/reply/insert", desc: { zh_CN: "添加", en_US: "insert" } },
  },
  UserTagAPI: {
    BASE_URL: "/user/tag",
    LIST: { url: "/api/user/tag/list", desc: { zh_CN: "获取标签列表", en_US: "getList" } },
  },


  AdminArticleAPI: {
    BASE_URL: "/admin/article",
    LIST: { url: "/api/admin/article/list", desc: { zh_CN: "获取文章列表", en_US: "getList" } },
    INSERT:{url: "/api/admin/article/insert", desc: { zh_CN: "添加", en_US: "insert" }},
    UPDATE:{url: "/api/admin/article/update", desc: { zh_CN: "更新", en_US: "update" }},
    CONTENT: { url: "/api/admin/article/content", desc: { zh_CN: "获取内容", en_US: "getContent" } },
    DELETE: { url: "/api/admin/article/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
    FORM: { url: `/api/admin/article/form`, desc: { zh_CN: "编辑", en_US: "edit" }, actionTip: { zh_CN: "将处于可编辑状态，编辑时请注意核对！", en_US: "will be under editing. Please pay attention for information!" } },
    TOP: { url: `/api/admin/article/top`, desc: { zh_CN: "置顶", en_US: "up" }, actionTip: { zh_CN: "将被置顶，置顶后，在评论显示的状态下可取消置顶！", en_US: "will be stuck,and then can be downed when being shown!" } },
    UNTOP: { url: `/api/admin/article/untop`, desc: { zh_CN: "取置", en_US: "down" }, actionTip: { zh_CN: "将被取消置顶，取消置顶后，在评论显示的状态下可重新置顶！", en_US: "will be downed,and then can be stuck when being shown!" } },
    LOCK: { url: `/api/admin/article/lock`, desc: { zh_CN: "锁定", en_US: "lock" }, actionTip: { zh_CN: "将被锁定，锁定后可以解锁和删除，但不可编辑！", en_US: "will be lock,and then  can be released  or deleted, but can not be edited!" } },
    UNLOCK: { url: `/api/admin/article/unlock`, desc: { zh_CN: "解锁", en_US: "unlock" }, actionTip: { zh_CN: "将被解锁，解锁后可编辑和锁定,但不可删除！", en_US: "will be released,and then can be edited or locked,but can not be deleted!" } },
  },
  AdminReplyAPI: {
    BASE_URL: "/admin/reply",
    LIST: { url: "/api/admin/reply/list", desc: { zh_CN: "获取一级列表", en_US: "getList" } },
    DELETE: { url: "/api/admin/reply/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
    FORM: { url: `/api/admin/reply/form`, desc: { zh_CN: "编辑", en_US: "edit" }, actionTip: { zh_CN: "将处于可编辑状态，编辑时请注意核对！", en_US: "will be under editing. Please pay attention for information!" } },
    INSERT: { url: "/api/admin/reply/insert", desc: { zh_CN: "添加", en_US: "insert" } },
    TOP: { url: `/api/admin/reply/top`, desc: { zh_CN: "置顶", en_US: "up" }, actionTip: { zh_CN: "将被置顶，置顶后，在评论显示的状态下可取消置顶！", en_US: "will be stuck,and then can be downed when being shown!" } },
    UNTOP: { url: `/api/admin/reply/untop`, desc: { zh_CN: "取置", en_US: "down" }, actionTip: { zh_CN: "将被取消置顶，取消置顶后，在评论显示的状态下可重新置顶！", en_US: "will be downed,and then can be stuck when being shown!" } },
    APPROVE: { url: "/api/admin/reply/approve", desc: { zh_CN: "过审", en_US: "approve" }, actionTip: { zh_CN: "将被审核通过！", en_US: "will be shown,and then can be hidden after being shown!" } },
    DISAPPROVE: { url: "/api/admin/reply/disapprove", desc: { zh_CN: "拒审", en_US: "disapprove" }, actionTip: { zh_CN: "将被拒审！", en_US: "will be hidden,and then can be shown after being hidden!" } },
  },
  AdminCateAPI: {
    BASE_URL: "/admin/cate",
    LIST: { url: "/api/admin/cate/list", desc: { zh_CN: "获取分类列表", en_US: "getList" } },
    DELETE: { url: "/api/admin/cate/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
    FORM: { url: `/api/admin/cate/form`, desc: { zh_CN: "编辑", en_US: "edit" }, actionTip: { zh_CN: "将处于可编辑状态，编辑时请注意核对！", en_US: "will be under editing. Please pay attention for information!" } },
    LOCK: { url: `/api/admin/cate/lock`, desc: { zh_CN: "锁定", en_US: "lock" }, actionTip: { zh_CN: "将被锁定，锁定后可以解锁和删除，但不可编辑！", en_US: "will be lock,and then  can be released  or deleted, but can not be edited!" } },
    UNLOCK: { url: `/api/admin/cate/unlock`, desc: { zh_CN: "解锁", en_US: "unlock" }, actionTip: { zh_CN: "将被解锁，解锁后可编辑和锁定,但不可删除！", en_US: "will be released,and then can be edited or locked,but can not be deleted!" } },  
    INSERT:{url: "/api/admin/cate/insert", desc: { zh_CN: "添加", en_US: "insert" }},
    UPDATE:{url: "/api/admin/cate/update", desc: { zh_CN: "更新", en_US: "update" }},
  },
  AdminSortAPI: {
    BASE_URL: "/admin/sort",
    LIST: { url: "/api/admin/sort/list", desc: { zh_CN: "获取一级列表", en_US: "getList" } },
    DELETE: { url: "/api/admin/sort/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
    FORM: { url: `/api/admin/sort/form`, desc: { zh_CN: "编辑", en_US: "edit" }, actionTip: { zh_CN: "将处于可编辑状态，编辑时请注意核对！", en_US: "will be under editing. Please pay attention for information!" } },
    LOCK: { url: `/api/admin/sort/lock`, desc: { zh_CN: "锁定", en_US: "lock" }, actionTip: { zh_CN: "将被锁定，锁定后可以解锁和删除，但不可编辑！", en_US: "will be lock,and then  can be released  or deleted, but can not be edited!" } },
    UNLOCK: { url: `/api/admin/sort/unlock`, desc: { zh_CN: "解锁", en_US: "unlock" }, actionTip: { zh_CN: "将被解锁，解锁后可编辑和锁定,但不可删除！", en_US: "will be released,and then can be edited or locked,but can not be deleted!" } },
    INSERT:{url: "/api/admin/sort/insert", desc: { zh_CN: "添加", en_US: "insert" }},
    UPDATE:{url: "/api/admin/sort/update", desc: { zh_CN: "更新", en_US: "update" }},
  },
  AdminTagAPI: {
    BASE_URL: "/admin/tag",
    LIST: { url: "/api/admin/tag/list", desc: { zh_CN: "获取标签列表", en_US: "getList" } },
    DELETE: { url: "/api/admin/tag/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
    FORM: { url: `/api/admin/tag/form`, desc: { zh_CN: "编辑", en_US: "edit" }, actionTip: { zh_CN: "将处于可编辑状态，编辑时请注意核对！", en_US: "will be under editing. Please pay attention for information!" } },
    LOCK: { url: `/api/admin/tag/lock`, desc: { zh_CN: "锁定", en_US: "lock" }, actionTip: { zh_CN: "将被锁定，锁定后可以解锁和删除，但不可编辑！", en_US: "will be lock,and then  can be released  or deleted, but can not be edited!" } },
    UNLOCK: { url: `/api/admin/tag/unlock`, desc: { zh_CN: "解锁", en_US: "unlock" }, actionTip: { zh_CN: "将被解锁，解锁后可编辑和锁定,但不可删除！", en_US: "will be released,and then can be edited or locked,but can not be deleted!" } },
    INSERT:{url: "/api/admin/tag/insert", desc: { zh_CN: "添加", en_US: "insert" }},
    UPDATE:{url: "/api/admin/tag/update", desc: { zh_CN: "更新", en_US: "update" }},
  },
}




export default urls;
