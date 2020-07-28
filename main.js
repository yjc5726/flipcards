////////程式碼模組化///////
//12.定義遊戲狀態
const GAME_STATE = {
	FirstCardAwaits: "FirstCardAwaits",
	SecondCardAwaits: "SecondCardAwaits",
	CardsMatchFailed: "CardsMatchFailed",
	CardsMatched: "CardsMatched",
	GameFinished: "GameFinished",
}



///////基礎設施/////////
const Symbols = [
	'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
	'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
	'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
	'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

const view = {
	//[函式]3. 11、12、13 與 數字 1 在卡牌上的呈現應為 J、Q、K 與 A
	transformNumber(number) {
		switch (number) {
			case 1:
				return 'A'
			case 11:
				return 'J'
			case 12:
				return 'Q'
			case 13:
				return 'K'
			default:
				return number
		}
	},
	// [函式]1.負責生成卡片內容，包括花色和數字 //用到函式transformNumber
	// getCardElement(index) {
	// 	//4. 轉換JQKA
	// 	const number = this.transformNumber((index % 13) + 1)
	// 	const symbol = Symbols[Math.floor(index / 13)]
	// 	return `
	// 	      <div class="card">
	// 	        <p>${number}</p>
	// 	        <img src="${symbol}" />
	// 	        <p>${number}</p>
	// 	      </div>`
	// },

	//8.牌面與牌背分開處理
	//[函式]8.1 改成渲染牌背元件，遊戲初始化時會透過 view.displayCards 直接呼叫
	getCardElement(index) {
		//11. 運用 data-set 的技巧把卡片索引綁到 HTML 元素
		return `<div data-index="${index}" class="card back"></div>`
	},
	//[函式]8.2產生牌面元件，使用者點擊時才由負責翻牌的函式來呼叫
	getCardContent(index) {
		const number = this.transformNumber((index % 13) + 1)
		const symbol = Symbols[Math.floor(index / 13)]
		return `
	      <p>${number}</p>
	      <img src="${symbol}" />
	      <p>${number}</p>
	    `
	},

	//[函式]2.負責選出 #cards 並抽換內容 //用到函式getRandomNumberArray、getCardElement
	// displayCards() {
	// 	const rootElement = document.querySelector('#cards')
	// 	//5.迭代出52張牌
	// 	// rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join("");
	// 	//7.帶入演算法洗牌52張
	// 	rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join('')

	// },

	//[函式]15.
	displayCards(indexes) {
		const rootElement = document.querySelector('#cards')
		rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
	},

	//[函式]9.點擊一張覆蓋的卡片 → 回傳牌面內容 、點擊一張翻開的卡片 → 重新覆蓋卡片，意即把牌面內容清除，重新呼叫牌背樣式(背景) //用到函式getCardContent
	// flipCard(card) {
	// 	console.log(card)
	// 	if (card.classList.contains('back')) {
	// 		// 回傳正面
	// 		card.classList.remove('back')
	// 		// card.innerHTML = this.getCardContent(10) // 暫時給定 10
	// 		//11.翻牌時運用 card.dataset.index 來運算卡片內容
	// 		card.innerHTML = this.getCardContent(Number(card.dataset.index))

	// 		return
	// 	}
	// 	// 回傳背面
	// 	card.classList.add('back')
	// 	card.innerHTML = null
	// },

	//[函式]23.改寫flipCard變成flipCards
	flipCards(...cards) {
		cards.map(card => {
			if (card.classList.contains('back')) {
				card.classList.remove('back')
				card.innerHTML = this.getCardContent(Number(card.dataset.index))
				return
			}
			card.classList.add('back')
			card.innerHTML = null
		})
	},




	//[函式]22.改變卡片底色、讓我們能夠在視覺上判斷哪些卡片已經完成了配對。
	// pairCard(card) {
	// 	card.classList.add("paired")
	// }

	//[函式]24.改寫pairCard變成pairCards
	pairCards(...cards) {
		cards.map(card => {
			card.classList.add('paired')
		})
	},

	//[函式]27.選取前面新增的 .score 與 .tried，將分數渲染出來
	renderScore(score) {
		document.querySelector(".score").innerHTML = `Score: ${score}`;
	},

	renderTriedTimes(times) {
		document.querySelector(".tried").innerHTML = `You've tried: ${times} times`;
	},

	//[函式]29.
	appendWrongAnimation(...cards) {
		cards.map(card => {
			card.classList.add('wrong')
			card.addEventListener('animationend', event => event.target.classList.remove('wrong'), {
				once: true
			})
		})
	},

	//31.
	showGameFinished() {
		const div = document.createElement('div')
		div.classList.add('completed')
		div.innerHTML =
			`
	      <p>Complete!</p>
	      <p>Score: ${model.score}</p>
	      <p>You've tried: ${model.triedTimes} times</p>
	    `
		const header = document.querySelector('#header')
		const body = document.querySelector('body')
		body.insertBefore(div,header)
		// header.before(div)
	}
}


const utility = {
	//[函式]6.洗牌的演算法
	getRandomNumberArray(count) {
		const number = Array.from(Array(count).keys())
		for (let index = number.length - 1; index > 0; index--) {
			let randomIndex = Math.floor(Math.random() * (index + 1));
			[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
		}
		return number
	}
}

// view.displayCards()



///////JS主程式/////////
// //7.為每個牌都綁上監聽器可以抓取牌是哪一張
// document.querySelectorAll('.card').forEach(card => {
// 	card.addEventListener('click', event => {
// 		// console.log(card)
// 		//10.讓使用者點擊卡牌時，呼叫 flipCard(card)
// 		view.flipCard(card)
// 	})
// })


//13.宣告controller
const controller = {
	//定義一個 currentState 屬性，用來標記目前的遊戲狀態
	currentState: GAME_STATE.FirstCardAwaits, // 加在第一行
	//[函式]16.
	generateCards() {
		view.displayCards(utility.getRandomNumberArray(52))
	},

	//[函式]18.「使用者點擊卡片」以後，controller.dispatchCardAction 會依照當下的遊戲狀態，發派工作給 view 和 controller。
	dispatchCardAction(card) {
		if (!card.classList.contains('back')) {
			return
		}
		switch (this.currentState) {
			case GAME_STATE.FirstCardAwaits:
				// view.flipCard(card)
				view.flipCards(card)
				model.revealedCards.push(card)
				this.currentState = GAME_STATE.SecondCardAwaits
				break
				// case GAME_STATE.SecondCardAwaits:
				// 	view.flipCard(card)
				// 	model.revealedCards.push(card)
				// 	// 判斷配對是否成功
				// 	break
				//21.
			case GAME_STATE.SecondCardAwaits:
				//28.只要切換至 SecondCardAwaits，嘗試次數就要 +1
				view.renderTriedTimes(++model.triedTimes)
				// view.flipCard(card)
				view.flipCards(card)
				model.revealedCards.push(card)
				// 判斷配對是否成功
				if (model.isRevealedCardsMatched()) {
					// 配對成功
					//28.1 翻了兩張牌以後，如果配對成功，分數就要 +10
					view.renderScore(model.score += 10)
					this.currentState = GAME_STATE.CardsMatched
					// view.pairCard(model.revealedCards[0])
					// view.pairCard(model.revealedCards[1])
					view.pairCards(...model.revealedCards)
					model.revealedCards = []
					//32.結束條件
					if (model.score === 10) {
						console.log('showGameFinished')
						this.currentState = GAME_STATE.GameFinished
						view.showGameFinished() 
						return
					}
					
					
					this.currentState = GAME_STATE.FirstCardAwaits

				} else {
					// 配對失敗
					this.currentState = GAME_STATE.CardsMatchFailed
					// setTimeout(() => {
					// 	// view.flipCard(model.revealedCards[0])
					// 	// view.flipCard(model.revealedCards[1])
					// 	view.flipCards(...model.revealedCards)
					// 	model.revealedCards = []
					// 	this.currentState = GAME_STATE.FirstCardAwaits
					// }, 1000)

					//30.在配對失敗的流程中呼叫 view
					view.appendWrongAnimation(...model.revealedCards)

					//25.setTimeout() 裡的動作獨立成一個 resetCards 來管理並呼叫
					setTimeout(this.resetCards, 1000)
				}
				break
		}
	},

	// console.log('this.currentState', this.currentState)
	// console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))

	//[函式]25.1 把 setTimeout() 裡的動作獨立成一個 resetCards 來管理
	resetCards() {
		view.flipCards(...model.revealedCards)
		model.revealedCards = []
		controller.currentState = GAME_STATE.FirstCardAwaits
	}
}




//14.宣告model 
const model = {
	//先宣告一個最必要的資料 revealedCards 代表「被翻開的卡片」
	revealedCards: [],

	//[函式]20.檢查使用者翻開的兩張卡片是否相同
	isRevealedCardsMatched() {
		return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
	},
	//26.
	score: 0,
	triedTimes: 0
}

//17.
controller.generateCards() // 取代 view.displayCards()

//19.取代7、controller.dispatchCardAction 這個中樞系統
document.querySelectorAll('.card').forEach(card => {
	card.addEventListener('click', event => {
		controller.dispatchCardAction(card)
	})
})
