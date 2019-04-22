<template>
  <div id="register">
    <div class="container" v-if="!successFlag">
      <h1>
        <img src="../assets/logo.png">
        <span>注册账户</span>
      </h1>
      <p>欢迎注册账户，让我们共同学习与进步</p>
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
                'mail',
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
            :validate-status="passwordError() ? 'error' : ''"
            :help="passwordError() || ''"
          >
            <a-input
              v-decorator="[
                'rePassword',
                {rules: [{ required: true, message: '请再次输入密码!' }]}
              ]"
              type="password"
              placeholder="再次输入密码"
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
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :disabled="hasErrors(form.getFieldsError())"
              style="width:100%"
            >
              注册
            </a-button>
            <router-link to="/login">
              <a>已有账户？去登陆</a>
            </router-link>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="result" v-else>
      <img src="../assets/logo.png">
      <h1>
        <a-icon type="check-circle" />
        <span>恭喜您，注册成功！</span>
      </h1>
      <router-link to="/login">
        <a-button type="primary">去登录</a-button>
      </router-link>
    </div>
  </div>
</template>

<script>
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
        captcha:"",
        successFlag:false
      }
    },
    created(){
      this.onGetCaptcha();
    },
    mounted(){
      this.$nextTick(()=>{
        this.form.validateFields();
      });
    },
    methods:{
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
          const {password,rePassword}=values;
          if(password!==rePassword) return this.$error({title:"两次密码不一致"});
          this.$store.dispatch({type:"login/register",payload:values})
            .then(res=>{
              this.successFlag=res==="success";
            })
        })
      },
      onGetCaptcha(){
        this.$request(AccountAPI.GET_WEBPAGE_CAPTCHA.url,{t:Date.now()})
        .then(res=>{this.captcha=res.item;});
      },
    }
  }
</script>

<style lang="scss" scoped>
  #register{
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
      }
    }
    .result{
      img{
        width:100px;
        height:100px;
      }
      h1{
        color:green;
        font-weight: 900;
        margin:30px 0px 50px 0px;
      }
    }
  }
</style>
