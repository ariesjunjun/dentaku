let display = document.getElementById('display'); // 入力結果を表示するinputタグを取得
let currentInput = ''; // 現在入力中の数値（または結果）
let currentOperator = ''; // 現在選択されている演算子
let previousInput = ''; // 以前に入力された数値（演算子を押した後に記録される）

// DOMの読み込み完了時に、ボタン要素全てにクリックイベントを登録
// ボタンがクリックされると、、、
document.addEventListener('DOMContentLoaded', function(){
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(function(button){
        button.addEventListener('click', handleButtonClick);
    });
});

// ボタンの表示内容（textContent）に応じて適切な関数を呼び出す。
// 'C': クリア
// '=': 計算
// '+', '-', '*', '/': 四則演算子
// その他: 数字（０〜９）、小数点など
// event.target.textContent でクリックしたボタンのテキスト（例えば '1' や '+' 、'=' など）を取得
function handleButtonClick(event){

    //event.target は「クリックされた要素（ボタン）」を指します。.textContent はそのボタンに表示されている文字（例：'1', '+', '=' など）を取得します。この値を value に代入して、後の分岐で使います。

    const value = event.target.textContent; //valueを定義

    if(value === 'C'){
        clearDisplay(); // 自分で定義：クリアボタンが押されたら画面をリセットする関数

    } else if(value === '='){ //　＝を押されたら
        calculate();  // 自分で定義：イコールが押されたら計算する関数を呼ぶ

    } else if(['+', '-', '*', '/'].includes(value)){ //あるか確かめる、もしあれば
        setOperator(value); // 演算子ボタンが押されたらその演算子を設定する関数を実行

        //.contains() はJavaScriptの classList オブジェクトのメソッドの一つで、要素に指定したクラスが付いているかどうかを調べるためのもの

    }else if (event.target.classList.contains('tax')){
        applyTax();  //消費税
        // 「消費税ボタン」がクリックされたときに、そのボタンに .tax というクラスが付いていれば applyTax() 関数を実行する

    }else if (event.target.classList.contains('roundoff')){
        roundOff();  //四捨五入

    }else if (event.target.classList.contains('fortune')){
        fortune();  //運勢

    } else { //それ以外なら
        appendToDisplay(value); // 数字やその他の文字を表示に追加する関数を実行
    }
}


////////////////////////////////////////////////////////
//updateDisplay 表示するもの
////////////////////////////////////////////////////////

// currentInputがあればそれを表示
//まだ演算中で、previousInputとcurrentOperatorがあればその情報を表示
//すべてからであれば表示も空にする。
function updateDisplay(){  //updateDisplay関数を自分で定義

    //現在の入力があれば
    if(currentInput !== ''){
        //以前入力された数値を表示
        //.value は、HTMLの <input> 要素の「入力されている値（中身）」を意味します。
        display.value = currentInput;

        if (currentInput.startsWith('今日の運勢は')){
            display.classList.add("fortune");
        } else {
            display.classList.remove("fortune");
        }

        //以前の入力があれば
    } else if(previousInput !== ''){
        //空白と演算子を足して表示する
                //.value は、HTMLの <input> 要素の「入力されている値（中身）」を意味します。
        display.value = previousInput + ' ' + currentOperator;
        display.classList.remove("fortune");

    // 上記２つ以外なら、空白を表示
    } else {
        //.value は、HTMLの <input> 要素の「入力されている値（中身）」を意味します。
        display.value = '';
        display.classList.remove("fortune");
    }
}



////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////


// 入力された文字（文字や小数点など）をcurrentInputに追加し、表示を更新する。
function appendToDisplay(value){
    currentInput += value;  //valueを足したものをcurrentInput(現在の入力)に代入する。文字列の結合
    updateDisplay(); //自分で定義したupdateDisplay関数を実行
}

function clearDisplay(){ //空白の場合
    currentInput = '';
    currentOperator = '';
    previousInput = '';
    updateDisplay(); //自分で定義したupdateDisplay関数を実行
}

// 入力された演算子（+, -, *, /）を受け取り、状態を更新する。
function setOperator(operator){
    // currentInputに数値が入っているかをチェック。
    // つまり、「今まさに入力した数字があるか？」
    // 例：5と入力後に+を押した場合 → currentInput = '5'
    if(currentInput !== ''){  //空白じゃなければ

        // すでに別の演算（previousInput）が存在しているなら、ます先に計算を行う。
        // 例：5 + 3 の後に * を押したら、8 * に移行するようにする。
        // 連続計算をサポートしています。
        if(previousInput !== ''){ //空白じゃなければ
            calculate();  //自分で定義したcalculate関数を動かせ
        }
        // 演算子をセット：currentOperator = '+' など。
        // currentInput(現在入力していた数字)をpreviousInputに保存。
        // 次の数字の入力に備えてcurrentInputをクリア。
        currentOperator = operator;
        previousInput = currentInput;
        currentInput = '';
        updateDisplay();

    // すでに前の入力（previousInput）はあるが、今数字を入力していない時。
    // 例：5 + まで押した後に * を押したような状況。
    } else if(previousInput !== ''){

        // 数字は入力されていないので、演算子だけ変更している。（+ → * に変更）
        // 状態だけ変更して、次の数字入力に備える。
        currentOperator = operator;
        updateDisplay();
    }
}




////////////////////////////////////////////////////////
//計算実行用の関数
////////////////////////////////////////////////////////

// 入力が揃っていれば、計算を実行。
function calculate(){
    if(previousInput !== '' && currentInput !== '' && currentOperator !== ''){ //空白じゃなければ
    //parseFloat() 関数は、引数を (必要に応じてまず文字列に変換してから) 解釈し、浮動小数点値を返します。
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result; // let は変数の再代入が可能な宣言方法

        // switch 文は式を評価して、一連の case 節に対してその式の値を照合し、最初に値が一致した case 節の後の文を、break 文に出会うまで実行します。

        switch(currentOperator){ // 演算子
            case '+':
                result = prev + current; //上記で設定した変数
                break;
            case '-':
                result = prev - current; //上記で設定した変数
                break;
            case '*':
                result = prev * current; //上記で設定した変数
                break;
            case '/':
                if(current !== 0){ //0じゃなければ
                    result = prev / current;
                } else {
                    result = 'Error';  //割る数が 0 の場合は計算できないので、'Error' という文字列を result に代入してエラー表示
                }
                break;
        }
        // 計算が終わったあとの後処理
        currentInput = result.toString(); //計算結果（result）は数値。それを文字列に変換して、currentInput に代入
        currentOperator = ''; //演算子をリセットします（空にする）。なぜ？ → 計算が終わったので、次の計算のために演算子はクリアしておく。
        previousInput = '';
        updateDisplay();
    }
}



////////////////////////////////////////////////////////
//消費税の関数
////////////////////////////////////////////////////////
function applyTax(){  //`applyTax` という関数を定義
    if (currentInput === '' ) return; //入力が何もない（空文字）なら処理を中止

    const value = parseFloat(currentInput); //parseFloat() 関数は、引数を (必要に応じてまず文字列に変換してから) 解釈し、浮動小数点値を返します。

    if (!isNaN(value)){ //isNaN() 関数は引数が NaN (非数) かどうかを判定。value が数値なら true
        const taxedValue = value * 1.1;
        currentInput = taxedValue.toFixed(2); //結果を文字列にして、小数点以下2桁に丸めて、currentInput に代入。toFixed()とは
        // JavaScriptの関数。指定した少数点以下の桁数で数値を四捨五入してくれます。
        updateDisplay(); //表示を更新
    }
}



////////////////////////////////////////////////////////
//四捨五入の関数
////////////////////////////////////////////////////////

function roundOff(){ //四捨五入の関数
    if (currentInput === '' ) return; //入力が何もない（空文字）なら処理を中止

    const value = parseFloat(currentInput); //parseFloat() 関数は、引数を (必要に応じてまず文字列に変換してから) 解釈し、浮動小数点値を返します。

    if (!isNaN(value)){ //value が数値なら true
        const applyRoundoff = Math.round(value);
        //Math.round() 関数は、引数として与えた数を四捨五入して、もっとも近似の整数を返します
        currentInput = applyRoundoff.toString();
        //toString() は Object インスタンスのオブジェクトで、このオブジェクトを表す文字列を返します。
        updateDisplay(); //表示を更新
    }

}




////////////////////////////////////////////////////////
//占いの関数
////////////////////////////////////////////////////////

function fortune(){ //占いの関数

// 運勢の配列を作る
const fortune_result = [
    "今日の運勢は…大吉！最高の一日になりそう！✨",
    "今日の運勢は…中吉。まあまあラッキーな日！",
    "今日の運勢は…小吉。小さな幸せを見逃さないで。",
    "今日の運勢は…吉。落ち着いた運気です。",
    "今日の運勢は…末吉。ちょっとした変化が鍵かも。",
    "今日の運勢は…凶。慎重に行動すると吉。",
    "今日の運勢は…大凶！？でも気をつければ大丈夫！",
    "今日の運勢は…超大吉！！神がかってる一日！🌟",
    "今日の運勢は…平。穏やかに過ごせる日です。",
    "今日の運勢は…波乱！ハプニングが起こるかも！？",
    "今日の運勢は…冴えてる！自分の直感を信じて。",
    "今日の運勢は…転機！何かが変わる予感…！"
  ];

// ランダムで運勢を決める
        //Math.round() 関数は、引数として与えた数を四捨五入して、もっとも近似の整数を返します.
        //lengthで配列の数を返す
        //Math.random() は静的メソッドで、 0 以上 1 未満の範囲で浮動小数点の擬似乱数を返します。
const random = fortune_result[Math.floor(Math.random() * fortune_result.length)];

// コンソールに出力
console.log(random);

currentInput = random; //占い結果を代入

updateDisplay(); //表示を更新
}
