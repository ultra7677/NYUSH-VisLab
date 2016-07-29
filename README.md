# NYUSH-VisLab  

####技术栈介绍  
整个Web端采取MEAN.js框架。  
其中前端使用AngularJS框架, 后端服务器在Express框架用Node.js编写。  
数据库使用MongoDB。 
 
####如何运行本项目
1. 首先请确保MongoDB与Node.js已经在机器上安装  
>
MongoDB安装过程参考  
https://docs.mongodb.com/getting-started/shell/installation/  
安装完成后,需要使mongo处于运行状态。 
> 
Node.js(v4.4.7),安装过程参考  
https://nodejs.org/en/download/  

2. 下载本项目并进入项目目录,运行指令`npm install`
>
该指令会自动下载`package.json`内所需的包，并放置在`node_modules/`文件夹下

3. 接着运行指令`npm install --save mongoose`
>
该指令会安装Mongoose,一个提供与MongoDB的交互的library。  

4. 输入指令`npm start`，在浏览器内输入`localhost:3000/`即可看到项目首页。  

####文件目录
bin/  
>
bin文件夹内有一个默认的scipt文件www,用于启动node.js的服务

models/  
>
定义后端与数据库交互的Models

node_modules/  
>
项目所需外部的包

public/  
>
主要是前端代码，保存静态的css,html,js,这些文件分别位于对应的文件夹下。  

>
/javascripts/  
controller: AngularJS框架下的Controller  
directives: AngularJS框架下的自定义的directive  
visualization: 可视化部分的JS  
AngularApp.js: AngularJS的config文件
>
/templates/  
放置静态的html  
>
/stylesheets
放置CSS文件

routes/
>
后端代码，实现提供给前端的API,与数据库交互。  

views/
>
template文件，由于本项目采取前端路由，所以只提供一个基础的view。  

app.js  
>
用于配置Express框架

package.json
>
定义所需的外部package










