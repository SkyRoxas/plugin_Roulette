import $ from 'jquery'
import velocity from 'velocity-animate'

$.fn.velocity = velocity

class Roulette {
  constructor(config) {
    this.el = config.el
    this.type = config.type
    this.items = config.items
    this.anglePointer = config.anglePointer
    this.angleOffset = config.angleOffset
    this.turnsNumber = config.turnsNumber
    this.duration = config.duration
    this.selectEvent = config.selectEvent
    this.events = config.events
    this.resultTypes = config.resultTypes
  }

  // 獲獎 ID
  resultId() {
    return 8
  }
  // scale 的總和
  totalScale() {
    return this.items.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.scale
    }, 0)
  }
  // 中獎 ID 項目要停止的角度
  resultAngle() {
    let id = this.resultId(),
      arr = this.items,
      filterArr = []
    filterArr = arr.filter((currentValue) => {
      if (currentValue.id === id) {
        return true
      } else {
        return false
      }
    })

    if (filterArr.length > 0) {
      let index = this.mathRandom(0, filterArr.length)
      return this.mathAngleStop(filterArr[index].angle)
    } else {
      alert('找不到對應的中獎ID')
      return
    }
  }

  // 取得 輪盤項目 物件
  getRouletteItem() {
    let arr = this.items,
      output = []
    this.init()
    output = arr.filter((currentValue, index) => {
      return arr.findIndex((el) => el.id === currentValue.id) === index
    })
    return output
  }

  // 初始化
  init() {
    this.initItemAngle()
    this.initItemId()
  }
  // 初始化經計算後的每個項目的角度範圍
  initItemAngle() {
    let arr = this.items,
      totalScale = this.totalScale(),
      angleMin = 0,
      angleMax = 0,
      angle = 0
    if (Array.isArray(arr)) {
      for (let key in arr) {
        let item = arr[key]
        angle = (360 / totalScale) * item.scale
        angleMax = angleMin + angle
        item.angle = {
          'min': angleMin + 1,
          'max': angleMax
        }
        angleMin = angleMax
      }
    }
  }
  // 初始化每個項目的 ID 值
  initItemId() {
    let arr = this.items
    arr.map((currentValue, index, array) => {
      currentValue.id = index
      array.map((el) => {
        if (this.regexMsg(el.msg) === this.regexMsg(currentValue.msg)) {
          el.id = currentValue.id
        }
      })
    })
  }

  // 計算範圍內任意取值
  mathRandom(min, max) {
    return Math.floor((Math.random() * (max - min)) + min)
  }
  // 計算旋轉圈數的角度
  mathTurnsAngle() {
    let turnsNumber = this.turnsNumber
    if (typeof turnsNumber !== 'number') {
      turnsNumber = 0
    }
    return turnsNumber * 360
  }
  // 計算停止角度
  mathAngleStop(angle) {
    let {min, max} = angle,
      angleRandom = this.mathRandom(min, max),
      angleOffset = this.angleOffset,
      anglePointer = this.anglePointer,
      angleTurnsNumper = this.mathTurnsAngle()
    return angleRandom + angleOffset + angleTurnsNumper + anglePointer
  }

  // 過濾訊息多餘的空白
  regexMsg($str) {
    return $str.replace(' ', '')
  }

  // 使輪盤旋轉到指定的位置
  run() {
    let el = this.el.circle,
      duration = this.duration,
      arr = this.items,
      id = this.resultId(),
      msg = arr[id].output
    this.init()
    $(el).velocity({
      'rotateZ': this.resultAngle()
    }, {
      duration: duration,
      easing: 'easeOutQuart'
    })
    setTimeout(() => {
      this.actionResult(msg)
    }, duration)
  }

  // 啟動輪盤： DOM 觸發
  eventByClick() {
    let obj = this.events.button_trigger,
      eventObj = obj.el, {trigger} = eventObj
    $(trigger).one('click', () => {
      this.run()
    })
  }
  // 啟動輪盤： 畫面載入
  eventByLoad() {
    this.run()
  }
  // 事件 hook 為觸發輪盤轉動時的事件啟動輪盤
  actionEvent() {
    let eventType = this.selectEvent.event
    switch (eventType) {
      case 'button_trigger':
        this.eventByClick()
        break
      case 'content_loaded':
        this.eventByLoad()
        break
      default:
        this.run()
    }
  }

  // 輪盤停止： alert 出提示訊息
  resultAlert() {
    let id = this.resultId(),
      arr = this.items,
      output = arr[id].output
    alert(output)
  }
  // 輪盤停止： 將提示訊息帶入指定的 dom 元素
  resultInnerHtml() {
    let id = this.resultId(),
      arr = this.items,
      output = arr[id].output,
      eventObj = this.resultTypes.text
    let {el} = eventObj
    $(el).html(output)
  }
  // 事件 hook 為輪盤停止轉動時，會觸發的事件
  actionResult() {
    let resultTypes = this.selectEvent.resultTypes
    switch (resultTypes) {
      case 'alert':
        this.resultAlert()
        break
      case 'text':
        this.resultInnerHtml()
        break
      default:
        this.run()
    }
  }

  // 啟用輪盤
  start() {
    this.actionEvent()
  }
}

// const data = {
//   id: '',
//   type: 'circle',
//   el: {
//     circle: '.circle_turn'
//   },
//   items: [
//     {
//       'msg': '$300',
//       'output': '恭喜你獲得 $300 禮券',
//       'scale': 1
//     }, {
//       'msg': '$100',
//       'output': '恭喜你獲得 $100 禮券',
//       'scale': 1
//     }, {
//       'msg': '$50',
//       'output': '恭喜你獲得 $50 禮券',
//       'scale': 1
//     }, {
//       'msg': '再接再厲',
//       'output': '請再接再厲',
//       'scale': 1
//     }, {
//       'msg': '$300',
//       'output': '恭喜你獲得 $300 禮券',
//       'scale': 1
//     }, {
//       'msg': '$100',
//       'output': '恭喜你獲得 $100 禮券',
//       'scale': 1
//     }, {
//       'msg': '$50',
//       'output': '恭喜你獲得 $50 禮券',
//       'scale': 1
//     }, {
//       'msg': '再接再 厲',
//       'output': '請再接再厲',
//       'scale': 1
//     }, {
//       'msg': '$300',
//       'output': '恭喜你獲得 $300 禮券',
//       'scale': 1
//     }, {
//       'msg': '＄100',
//       'output': '恭喜你獲得 $100 禮券',
//       'scale': 1
//     }, {
//       'msg': '＄50',
//       'output': '恭喜你獲得 $50 禮券',
//       'scale': 1
//     }, {
//       'msg': '再 接再厲',
//       'output': '請再接再厲',
//       'scale': 1
//     }
//   ],
//   anglePointer: 0,
//   angleOffset: -15,
//   turnsNumber: 10,
//   duration: 10500,
//   selectEvent: {
//     'event': 'content_loaded',
//     'resultTypes': 'alert'
//   },
//   events: {
//     'button_trigger': {
//       el: {
//         trigger: '.circle_bt'
//       }
//     },
//     'content_loaded': {}
//   },
//   resultTypes: {
//     'alert': {},
//     'text': {
//       el: '.message'
//     }
//   }
// }

// const roulette = config => {
//   let obj = new Roulette(config)
//   obj.resultId = () => {
//     return 6
//   }
//   obj.start()
// }
// roulette(data)

window.roulette = (config) => {
  for (let i = 0; i < config.length; i++) {
    let obj = new Roulette(config[i])
    obj.start()
  }
}
export default Roulette
