<template>
  <div id="login">
    <div class="container">
      <h1>
        <img src="../assets/logo.png">
        <span>向上的博客</span>
      </h1>
      <p>这是我的个人博客，欢迎关注</p>
      <div class="form">
        <a-form
          :form="form"
          @submit="handleSubmit"
        >
          <a-form-item
            :validate-status="userNameError() ? 'error' : ''"
            :help="userNameError() || ''"
          >
            <a-input
              v-decorator="[
                'account',
                {rules: [{ required: true, message: 'Please input your username!' }]}
              ]"
              placeholder="账户名"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color:rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item
            :validate-status="passwordError() ? 'error' : ''"
            :help="passwordError() || ''"
          >
            <a-input
              v-decorator="[
                'password',
                {rules: [{ required: true, message: 'Please input your Password!' }]}
              ]"
              type="password"
              placeholder="密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                style="color:rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item
            :validate-status="captchaError() ? 'error' : ''"
            :help="captchaError() || ''"
            class="captcha"
          >
            <a-input
              v-decorator="[
                'captcha',
                {rules: [{ required: true, message: '请输入验证码!' }]}
              ]"
              placeholder="验证码"
              class="box"
            >
              <a-icon
                slot="prefix"
                type="mail"
                style="color:rgba(0,0,0,.25)"
              />
            </a-input>
            <img :src="'data:image/png;base64,'+captcha" @click="onGetCaptcha" />
          </a-form-item>
          <a-form-item class="option">
            <a-checkbox :checked="autoLogin" @change="changeAutoLogin" class="f_left">自动登录</a-checkbox>
            <a class="f_right" href="">忘记密码</a>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :disabled="hasErrors(form.getFieldsError())"
              style="width:100%"
            >
              登录
            </a-button>
            <router-link to="/register"><a>没有账户？去注册</a></router-link>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
  import store from 'store';
  import urls from '../api/urls';
  const {AccountAPI}=urls;
  function hasErrors (fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  export default {
    data () {
      return {
        hasErrors,
        form:this.$form.createForm(this),
        autoLogin:false,
        captcha:"",
      }
    },
    mounted(){
      const { autoLogin = false, autoLoginMark } = store.get('blog_account') || {};
      console.log(1111,autoLogin)
      this.autoLogin=autoLogin;
      if (!autoLogin || !autoLoginMark) {
        this.onGetCaptcha();
        return;
      }
      this.$store.dispatch({
        type:"login/login",
        payload:{autoLogin ,autoLoginMark: autoLoginMark!==false}
      });
    },
    methods:{
      changeAutoLogin(e){
        this.autoLogin=e.target.checked;
      },
      userNameError () {
        const { getFieldError, isFieldTouched } = this.form;
        return isFieldTouched('userName') && getFieldError('userName');
      },
      passwordError () {
        const { getFieldError, isFieldTouched } = this.form;
        return isFieldTouched('password') && getFieldError('password');
      },
      captchaError () {
        const { getFieldError, isFieldTouched } = this.form;
        return isFieldTouched('password') && getFieldError('password');
      },
      handleSubmit(e){
        e.preventDefault();
        this.form.validateFields((err,values)=>{
          if(err) return;
          this.$store.dispatch({type:"login/login",payload:{...values,autoLogin:this.autoLogin}});
        });
      },
      onGetCaptcha(){
        this.$request(AccountAPI.GET_WEBPAGE_CAPTCHA.url,{t:Date.now()})
        .then(res=>{this.captcha=res.item;});
      },
    }
  }
</script>

<style lang="scss" scoped>
  #login{
    width:100%;
    height:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .container{
      img{
        width:36px;
        height:36px;
      }
      .form{
        margin-top:50px;
        .captcha{
          width:100%;
          .box{
            width:70%;
          }
          img{
            display:inline-block;
            width:30%;
          }
        }
        .option{
          margin:-15px 0px 10px 0px;
        }
      }
    }
  }
</style>
