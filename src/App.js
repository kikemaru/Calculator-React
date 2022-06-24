import React, {useEffect, useState} from 'react';
import './App.css';
import Display from "./Components/Display";
import Button from "./Components/Button";

const App = () => {
    //2й операнд
    const [number, setNumber] = useState('');
    //1й операнд
    const [storedNumber, setStoredNumber] = useState('');
    //тип выполняемого действия (+,-,*,/)
    const [functionType, setFunctionType] = useState('');


    //Очищает все - срабатывает при нажатии на кнопку AC
    const clearValue = () => {
        setNumber('');
        setFunctionType('');
        setStoredNumber('');
    };


    //Стирает последневведенную цифру - срабатывает при нажатии на КЛАВИШУ Backspace
    const backButton = () => {
        if (number !== '') {
            setNumber(number => number.slice(0, number.length - 1));
        }else{
            setNumber('');
            setStoredNumber('');
        }
    };

    //Ф-я для отображаения значения на экране
    const setDisplayValue = (value) => {
        if ((!number.includes('.') || value !== '.') && number.length < 8) {
            setNumber(`${(number + value).replace(/^0+/, '')}`);
        }
    };

    //Получает 1/100 числа - срабатывает при нажатии на кнопку %
    const moduleCalc = () => {
        if(number || storedNumber)
            setNumber(`${Math.round(parseFloat(number || storedNumber) * 100) / 10000}`);
    }


    //Перемещает значение в 1 операнд
    // изначально 1-e значение присваевается 2-му операнду,
    // а при нажатии на одну из кнопок(+,-,*,/) переносится в первый,
    // чтобы 2-е значение присвоить 2-му операнду
    const handleSetStoredValue = () => {
        setStoredNumber(number);
        setNumber('');
    };

    //Устанавливает тип выражения(+,-,*,/)
    const setCalcFunction = type => {
        if (number) {
            setFunctionType(type);
            handleSetStoredValue();
        }
        if (storedNumber) {
            setFunctionType(type);
        }
    };



    const trig = type => {

        if(number || storedNumber){
            const num = parseFloat(number || storedNumber);
            switch (type){
                case 'sqrt':
                    setNumber(`${Math.sqrt(num).toFixed(3)}`);
                    break;
                case 'sin':
                    setNumber(`${Math.sin(num * Math.PI / 180).toFixed(4)}`);
                    break;
                case 'cos':
                    setNumber(`${Math.cos(num * Math.PI / 180).toFixed(4)}`);
                    break;
                case 'tan':
                    setNumber(`${Math.tan(num * Math.PI / 180).toFixed(4)}`);
                    break;
                case 'ctn':
                    setNumber(`${(1/Math.tan(num * Math.PI / 180)).toFixed(4)}`);
                    break;


                case 'asin':
                    if(num <= 1 && num >= -1)
                        setNumber(`${(Math.asin(num) / Math.PI * 180).toFixed(3)}`);
                    else
                        setNumber('');
                    break;
                case 'acos':
                    if(num <= 1 && num >= -1)
                        setNumber(`${(Math.acos(num)/ Math.PI * 180).toFixed(3)}`);
                    else
                        setNumber('');
                    break;
                case 'atan':
                    setNumber(`${(Math.atan(num)/ Math.PI * 180).toFixed(3)}`);
                    break;

                    //-
                case 'actan':
                    setNumber(`${(90 - Math.atan(parseFloat(number || storedNumber) / Math.PI * 180)).toFixed(3)}`);
                    break;

                default:
                    return;
            }

        }
    }


    //Делает число отрицательным - срабатывает при нажатии на кнопку +/-
    const toggleNegative = () => {
        if (number) {
            if (number > 0) {
                setNumber(`-${number}`);
            } else {
                const positiveNumber = number.slice(1);
                setNumber(positiveNumber);
            }
        } else if (storedNumber > 0) {
            setStoredNumber(`-${storedNumber}`);
        } else {
            const positiveNumber = storedNumber.slice(1);
            setStoredNumber(positiveNumber);
        }
    };


    //При нажатии на = вычисляет значение выражения
    const doMath = () => {
        if (number && storedNumber) {
            switch (functionType) {
                case '+':
                    setStoredNumber(`${Math.round((parseFloat(storedNumber) + parseFloat(number)) * 100) / 100}`);
                    break;
                case '-':
                    setStoredNumber(`${Math.round((parseFloat(storedNumber) - parseFloat(number)) * 1000) / 1000}`);
                    break;
                case '/':
                    setStoredNumber(`${Math.round((parseFloat(storedNumber) / parseFloat(number)) * 1000) / 1000}`);
                    break;
                case '*':
                    setStoredNumber(`${Math.round(parseFloat(storedNumber) * parseFloat(number) * 1000) / 1000}`);
                    break;
                case '^':
                    setStoredNumber(`${Math.round(Math.pow(parseFloat(storedNumber), parseFloat(number))* 1000) / 1000}`);
                    break;
                default:
                    break;
            }
            setNumber('');
        }

    };


    //Обработчик события нажатия на клавиши
    const keydown = (e) => {
        switch (e.key){
            case 'Backspace':
                backButton();
                break;
            case 'Enter':
                doMath();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                setCalcFunction(e.key);
                break;
            default:
                if((e.key >= 0 && e.key <= 9) || e.key === '.'){
                    setDisplayValue(e.key);
                }
        }
    };


    //Привязываем событие ко всему документу
    useEffect(() => {
        document.addEventListener('keydown', keydown);
        return () => document.removeEventListener('keydown', keydown);
    }, [keydown]);


    //Кнопки для отображения
    // buttonValue - Название кнопки,
    // onClick - событие нажатия на кнопку,
    // className - css класс
    const btns = [
        {buttonValue: "AC", onClick: clearValue, className: "dark-button"},
        {buttonValue: "+/-", onClick: toggleNegative, className: "dark-button"},
        {buttonValue: "%", onClick: moduleCalc, className: "dark-button"},
        {buttonValue: "/", onClick: () => setCalcFunction("/"), className: "function-button"},

        {buttonValue: "√", onClick: () => trig('sqrt'), className: "function-button"},
        {buttonValue: "atan", onClick: () => trig("atan"), className: "function-button"},

        {buttonValue: 7, onClick: () => setDisplayValue(7), className: ""},
        {buttonValue: 8, onClick: () => setDisplayValue(8), className: ""},
        {buttonValue: 9, onClick: () => setDisplayValue(9), className: ""},
        {buttonValue: "*", onClick: () => setCalcFunction("*"), className: "function-button"},

        {buttonValue: "^", onClick: () => setCalcFunction("^"), className: "function-button"},
        {buttonValue: "actan", onClick: () => trig("actan"), className: "function-button"},


        {buttonValue: 4, onClick: () => setDisplayValue(4), className: ""},
        {buttonValue: 5, onClick: () => setDisplayValue(5), className: ""},
        {buttonValue: 6, onClick: () => setDisplayValue(6), className: ""},
        {buttonValue: "-", onClick: () => setCalcFunction("-"), className: "function-button"},

        {buttonValue: "sin", onClick: () => trig('sin'), className: "function-button"},
        {buttonValue: "asin", onClick: () => trig("asin"), className: "function-button"},

        {buttonValue: 1, onClick: () => setDisplayValue(1), className: ""},
        {buttonValue: 2, onClick: () => setDisplayValue(2), className: ""},
        {buttonValue: 3, onClick: () => setDisplayValue(3), className: ""},
        {buttonValue: "+", onClick: () => setCalcFunction("+"), className: "function-button"},

        {buttonValue: "cos", onClick: () => trig("cos"), className: "function-button"},
        {buttonValue: "acos", onClick: () => trig("acos"), className: "function-button"},

        {buttonValue: 0, onClick: () => setDisplayValue(0), className: "zero-button"},
        {buttonValue: ".", onClick: () => setDisplayValue("."), className: ""},
        {buttonValue: "=", onClick: doMath, className: "function-button"},

        {buttonValue: "tan", onClick: () => trig("tan"), className: "function-button"},
        {buttonValue: "ctn", onClick: () => trig("ctn"), className: "function-button"},
    ];


    return (
        <div className="App">
            <div className="container">
                <Display value={!number?.length && !storedNumber ? '0' : number || storedNumber}/>
                <div className="number-pad">
                    {btns.map(btn =>
                        <Button key={btn.buttonValue} {...btn}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
