import { useReducer } from "react";
import "./style.css";
import DigitButton from "./DigitButtons";
import OperationButton from "./OperationButtons";
import Demo from "./Demo";

export const ACTION = {
  ADD_DIGIT: "add_digit",
  CHOOSE_OPERATION: "choose_operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete_digit",
  EVALUATE: "evaluate",
  PERCENTAGE: "percentage",
  ROOT: "root",
  SIN: "sin",
  COS: "cos",
  TAN: "tan",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTION.CLEAR:
      return {};
    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTION.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    case ACTION.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTION.PERCENTAGE:
      if (state.operation == null || state.previousOperand == null) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: percentage(state),
      };

    case ACTION.ROOT:
      // if (state.operation == null || state.previousOperand == null) {
      //   return state;
      // }
      return {
        ...state,
        overwrite: true,
        operation: null,
        currentOperand: root(state),
      };

    case ACTION.SIN:
      // if (state.operation == null || state.previousOperand == null) {
      //   return state;
      // }
      return {
        ...state,
        overwrite: true,
        operation: null,
        currentOperand: sin(state),
      };

    case ACTION.COS:
      // if (state.operation == null || state.previousOperand == null) {
      //   return state;
      // }
      return {
        ...state,
        overwrite: true,
        operation: null,
        currentOperand: cos(state),
      };

    case ACTION.TAN:
      // if (state.operation == null || state.previousOperand == null) {
      //   return state;
      // }
      return {
        ...state,
        overwrite: true,
        operation: null,
        currentOperand: tan(state),
      };
  }
}

function root({ currentOperand }) {
  const current = parseFloat(currentOperand);
  if (isNaN(current)) return "";

  let computation = "";
  console.log(current);
  computation = Math.sqrt(current);
  return computation.toString();
}

function sin({ currentOperand }) {
  const current = parseFloat(currentOperand);
  if (isNaN(current)) return "";

  let computation = "";
  console.log(current);
  const radians = (current * Math.PI) / 180;
  computation = Math.sin(radians);
  return computation.toString();
}

function cos({ currentOperand }) {
  const current = parseFloat(currentOperand);
  if (isNaN(current)) return "";
  const tolerance = 1e-15;
  let computation = "";
  console.log(current);
  const radians = (current * Math.PI) / 180;
  computation = Math.cos(radians);

  if (Math.abs(computation) < tolerance) {
    computation = 0;
  }

  return computation.toString();
}

function tan({ currentOperand }) {
  const current = parseFloat(currentOperand);
  if (isNaN(current)) return "";

  let computation = "";
  console.log(current);
  const radians = (current * Math.PI) / 180;
  computation = Math.tan(radians);
  if (current == 90) {
    computation = Infinity;
  }
  return computation.toString();
}

function percentage({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + (prev * current) / 100;
      break;

    case "-":
      computation = prev - (prev * current) / 100;
      break;

    case "×":
      computation = (prev * current) / 100;
      break;

    case "÷":
      computation = prev / ((prev * current) / 100);
      break;
  }
  return computation.toString();
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;

    case "-":
      computation = prev - current;
      break;

    case "×":
      computation = prev * current;
      break;

    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER_EN = new Intl.NumberFormat("en-in", {
  maximumFractionDigits: 0,
});
// const INTEGER_FORMATTER_US = new Intl.NumberFormat("us", {
//   maximumFractionDigits: 0,
// });
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");

  if (decimal == null) return INTEGER_FORMATTER_EN.format(integer);
  return `${INTEGER_FORMATTER_EN.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button onClick={() => dispatch({ type: ACTION.ROOT })}>&#8730;</button>
      <button onClick={() => dispatch({ type: ACTION.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>
        DEL
      </button>
      <button onClick={() => dispatch({ type: ACTION.PERCENTAGE })}>%</button>
      <OperationButton operation="÷" dispatch={dispatch} />

      <button onClick={() => dispatch({ type: ACTION.SIN })}>SIN</button>
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="×" dispatch={dispatch} />

      <button onClick={() => dispatch({ type: ACTION.COS })}>COS</button>
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />

      <button onClick={() => dispatch({ type: ACTION.TAN })}>TAN</button>
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />

      <button></button>
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="00" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button onClick={() => dispatch({ type: ACTION.EVALUATE })}>=</button>
      <Demo />
    </div>
  );
}

export default App;
