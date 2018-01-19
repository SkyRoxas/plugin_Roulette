# Gulp 與 Webpack 開發工具

## 如何使用

--------------------------------------------------------------------------------

Node 版本號 ： v5.7.0

npm 版本號 ： v3.6

--------------------------------------------------------------------------------

安裝：

```
$ npm install
```

啟用：

```
$ npm run start
```

## 目錄結構

```
|-- src
   |-- sass
   |-- app
   |-- html
   |-- images
|-- dest
   |-- css
   |-- js
   |-- html
   |-- images
|-- app.js             ## express 路徑 router 設定
|-- .eslintrc          ## ESLint 相關設定
|-- gulpfile.js
|-- webpack.config.js
|-- package.json
|-- README.md
```

--------------------------------------------------------------------------------

# Roultte

網頁輪盤套件

## 如何使用

### 定義設定參數

```
const data = {
  id: '',
  type: 'circle',
  el: {
    circle: '.circle_turn'
  },
  items: [
    {
      'msg': '$300',
      'output': '恭喜你獲得 $300 禮券',
      'scale': 1
    }, {
      'msg': '$100',
      'output': '恭喜你獲得 $100 禮券',
      'scale': 1
    }, {
      'msg': '$50',
      'output': '恭喜你獲得 $50 禮券',
      'scale': 1
    }, {
      'msg': '再接再厲',
      'output': '請再接再厲',
      'scale': 1
    }
  ],
  anglePointer: 0,
  angleOffset: -15,
  turnsNumber: 10,
  duration: 10500,
  selectEvent: {
    'event': 'content_loaded',
    'resultTypes': 'alert'
  },
  events: {
    'button_trigger': {
      el: {
        trigger: '.circle_bt'
      }
    },
    'content_loaded': {}
  },
  resultTypes: {
    'alert': {},
    'text': {
      el: '.message'
    }
  }
}
```

### 建立 Roulette 物件

```{.javascript}
let obj = new Roulette(data)

obj.resultId = () => {
  return 6
} // 指定中獎 ID

obj.start() // 啟用輪盤
```

### Method

#### 查詢輪盤項目 ID

```
getRouletteItem();
// return array
```

### 事件 Hook

輪盤停止時，觸發的事件

```
actionResult = (msg) => {
  // do something
}
```

> msg 為輪盤輸出結果
