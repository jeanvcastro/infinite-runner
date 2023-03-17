export default class Helper {
  static getMax(firstNumber, secondNumber) {
    return Math.max(firstNumber, secondNumber);
  }

  static getRandom(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
