/*****打包发布流程******/
删除wabapp/js/revclient文件
删除wabapp/revclient文件

进入wabapp目录，打开cmd 执行 gulp js 命令,完成后
再执行gulp jsrev 命令，完成后，

将wabapp/client 文件名称改为client1
然后将 wabapp/revclient文件名称改为client

然后 将wabapp/js/client 名称改为 webapp/js/client1
然后将wabapp/js/revclient名称改为webapp/js/client

检查jdbc/mongodb 是否正确

转出为war文件 通过ftp上传

开发中
 将webapp/js/client 改为 webapp/js/revclient
将webapp/js/client1 改为 webapp/js/client

将 wabapp/client文件名称改为revclient
将wabapp/client1 文件名称改为client