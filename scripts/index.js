document.addEventListener("DOMContentLoaded", ()=>{
    const display = document.getElementById("main-display");
    const history = document.getElementById("history");
    const buttons = document.querySelectorAll("button");
    const dotButton = document.getElementById("dot");

    let expression = [];
    let start = true;

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            if(start){
                clear();
                start = false;
            }
            try{
                calculator(button.value);
            }catch(e){
                alert(e);
                console.log(e);
            }
            
        })
    });

    document.onkeydown = function (e) {
        if(start){
            clear();
            start = false;
        }
        console.log(`Key pressed: ${e.key}`);
        try{
            calculator(e.key);
        }catch(error){
            alert(error);
            console.log(error);
        }
    }
    
    function getHistory(){
        let history = "";
        expression.forEach((entry)=>{
            history += entry+' ';
        });
        return history;
    }

    function operate (factorA, operator, factorB){
        let result = 0;
        switch(operator){
            case '+':
                result = factorA + factorB;
                break;
            case '-':
                result = factorA - factorB;
                break;
            case '*':
                result = factorA * factorB;
                break;
            case "/":
                result = factorA / factorB;
                break;
            case "%":
                result = factorA % factorB;
                break;
            default:
                alert("ERROR");
                break;
        }
        if(result !== Math.floor(result)){
            result = parseFloat(result).toFixed(2);
        }
        return result;
    }

    const clear = () => {display.innerText = ""; history.innerText = ""; expression = [];enableDotButton();}
    const enableDotButton = () => {dotButton.disabled = false;}
    const disableDotButton = () => {dotButton.disabled = true;}
    const prepareForNextEntry = () => {history.innerText = getHistory();display.innerText = '';};
    const checkValidExpression = () =>{
        if(display.innerText.length===0){
            console.log("Display length is zero.");
            throw "INVALID EXPRESSION";
        }
    };
    
    const calculatePartialSolution = () =>{
        let partialSolution;
        if(expression.length === 3){
            partialSolution = parseFloat(operate(expression[0],expression[1],expression[2]));
            console.log(`Expression: [${expression}]`);
            console.log(`Partial solution: ${partialSolution}`);
            if(Math.abs(partialSolution) === Infinity || partialSolution !== partialSolution){
                expression.pop();
                console.log(`Partial solution was ${partialSolution}`);
                throw "CANNOT DIVIDE BY ZERO!";
            }
            expression = [];
            expression.push(partialSolution);
            
        }
        return partialSolution;
    }
    function calculator(value){
        switch(typeOfEntry(value)){
            case "DELETE":
                clear();
                break;
            case "BACKSPACE":
                if(display.innerText.charAt(display.innerText.length-1)==='.'){
                    enableDotButton();
                }
                display.innerText = display.innerText.slice(0,display.innerText.length-1);
                break;
            case "MOD":
                checkValidExpression();
                expression.push(parseFloat(display.innerText));
                calculatePartialSolution();
                expression.push('%');
                prepareForNextEntry();
                enableDotButton();
                break;
            case "PLUS":
                checkValidExpression();
                expression.push(parseFloat(display.innerText));
                calculatePartialSolution();
                expression.push('+');
                prepareForNextEntry();
                enableDotButton();                
                break;
            case "SUBTRACT":
                checkValidExpression();
                expression.push(parseFloat(display.innerText));
                calculatePartialSolution();
                expression.push('-');
                prepareForNextEntry();
                enableDotButton();
                break;
            case "MULTIPLY":
                checkValidExpression();
                expression.push(parseFloat(display.innerText));
                calculatePartialSolution();
                expression.push('*');
                prepareForNextEntry();
                enableDotButton(); 
                break;
            case "DIVIDE":
                checkValidExpression();
                expression.push(parseFloat(display.innerText));
                calculatePartialSolution();
                expression.push('/');
                prepareForNextEntry();
                enableDotButton(); 
                break;
            case "DOT":
                if(!dotButton.disabled){
                    checkValidExpression();
                    display.innerText += '.';
                    disableDotButton();
                }
                break;
            case "EQUALS":
                if(expression.length===0 && display.innerText.length > 0){
                    history.innerText = display.innerText + " = ";
                    start = true;
                    break;
                }
                checkValidExpression();
                expression.push(parseFloat(display.innerText));
                history.innerText = getHistory() + " = ";
                try{
                    display.innerText = calculatePartialSolution();
                    expression = [display.innerText];
                }catch(e){
                    alert(e);
                    clear();
                }
                start = true;
                break;
            case "NUMBER":
                if(display.innerText === '0'){
                    display.innerText = '';
                }
                display.innerText += value;
                break;
            default:
                break;
        }
    }
    const typeOfEntry = (value)=>{
        switch(value){
            case 'AC':
            case 'Delete':
                return "DELETE";
            case 'C':
            case 'Backspace':
                return "BACKSPACE";
            case '%':
            case ']':
                return "MOD";
            case '+':
                return "PLUS";
            case '-':
                return "SUBTRACT";
            case '*':
                return "MULTIPLY";
            case '/':
                return "DIVIDE";
            case ',':
            case '.':
                return "DOT";
            case 'Enter':
            case '=':
                return "EQUALS";
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                return "NUMBER";
            default:
                return "INVALID";
        }
    }
});