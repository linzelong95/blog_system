# redis在linux系统上的安装
## 安装

```
选择一个路径，如usr/local
	cd /usr/local
下载redis压缩包
	wget http://download.redis.io/releases/redis-4.0.10.tar.gz
解压
	tar -xvzf redis-4.0.10.tar.gz
进入redis目录
	cd redis-4.0.10
最后输入make
	make
```

## 测试是否成功及可能的报错

```
测试redis是否可用
	make test
可能报错如下
    You need tcl 8.5 or newer in order to run the Redis test
    make[1]: *** [test] Error 1
    make[1]: Leaving directory `/usr/local/redis-4.0.10/src'
    make: *** [test] Error 2
解决方案，安装tcl
	yum install tcl
```

 ## 启动redis服务器端和客户端

```
启动redis服务器端，在 redis-4.0.10目录下，输入
	src/redis-server ./redis.conf
验证是否启动，另开一个窗口，输入
	netstat -tlnp
成功的话，将看到
	tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN 
启动redis客户端(无密码)
	src/redis-cli //默认连接本机redis 6379端口的
	src/redis-cli -h ip地址 -p 端口
```

## 关闭redis服务器端

```
在 redis-4.0.10目录下，输入
	src/redis-cli -h 127.0.0.1 shutdown
```

## 对外连接

```
对方开发6379端口
	具体请百度
在redis-4.0.10目录下编辑redis.conf
	vim redis.conf
将bind 127.0.0.1修改为
	bind 0.0.0.0
```

## 访问安全

```
设置访问密码
在redis-4.0.10目录下编辑redis.conf
	vim redis.conf
将 #requirepass foobared 修改为
	requirepass 你的密码  //去掉#就是去掉注释
有了密码后，登录需要输入密码才有权访问
	src/redis-cli -a 密码 //默认连接本机redis 6379端口的
	src/redis-cli -h ip地址 -p 端口 -a 密码
```

## 进阶

```
 配置让redis在后台运行
        这里要修改一下redis的配置文件了，主要是redis.conf这个文件。
打开文件redis.conf,修改 ”daemonize no“ 为 “daemonize yes”，然后重新启动下redis：
src/redis-server ./redis.conf
就可以看出 redis为后台运行了。

启动多个redis实例的配置
拷贝redis.conf 为 redis-test.conf(举例)
修改redis-test.conf文件中
 ”daemonize no“ 为 “daemonize yes”，”port 6379“ 为 “port 6380”，然后启动下redis：
src/redis-server ./redis—test.conf
```

##　参考连接

https://blog.csdn.net/qq_41376740/article/details/81007226

