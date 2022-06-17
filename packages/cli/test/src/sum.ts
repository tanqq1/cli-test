/** 返回入参的所有数字相加的结果 */
const sum = (...args: number[]): number => {
  let sum = 0

  if (args.length) {
    args.forEach((i) => (sum += i))
  }

  return sum
}

export default sum
