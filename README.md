# AListServer

这是一个可以运行在iOS上的AList服务端应用

## 本地启动

1. 使用[sunzongzheng/alist-ios](https://github.com/sunzongzheng/alist-ios)打包iOS framework到本仓库下的`ios/alist/Alistlib.xcframework`目录

2. 启动应用

   ```bash
    yarn && yarn ios
   ```

关于如何安装到真机 / ipa签名等iOS开发问题请使用谷歌搜索

## 注意事项

1. 暂不支持在AList中添加`本地存储`
2. App置于后台时，服务可能不可用，再次回到App后服务通常可以恢复
3. App长时间置于后台后，服务可能被系统杀死，回到App后仍不可用时，重启服务即可

## 免自签版本

您也可以使用[Apple Store版本](https://apps.apple.com/cn/app/alistserver/id6502905107)，由于开发者账号每年都需付费，此版本也需要付费使用

由于Apple Store审核要求导致的特性：
- 在线安装ipa能力已移除
