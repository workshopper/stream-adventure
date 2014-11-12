中国所有城市信息。

数据格式如下：

```
{
  cn: { // 简体中文
    '吉林': {
       'cnName':'吉林',
       'pyName':'jilin',
       'center':'吉林',
       'x':'372', // gps信息
       'y':'210',
       'code':'101060201', // weather.com的编号
       'province':'吉林' // 上级省市自治区
    },
    ...
    ...
  },
  py: { // 拼音
    'jilin': {
       'cnName':'吉林',
       'pyName':'jilin',
       'center':'吉林',
       'x':'372', // gps信息
       'y':'210',
       'code':'101060201', // weather.com的编号
       'province':'吉林' // 上级省市自治区
    }
    ...
    ...
  }
}
```

## Installation

```
npm install chinesecities
```

## usage

```
var chinesecities= require('chinesecities');
console.log(chinesecities.cn['北京']);
console.log(chinesecities.py['beijing']);
```
