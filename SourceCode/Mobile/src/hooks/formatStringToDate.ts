
/**
 *  Input data is the current date and length of the previous string and the function returns a string with format DD/MM/YY
 * @param numbers 
 * 
 * @param lastLength 
 * @returns 
 */
export const formatStringtoDate = (numbers: string, lastLength: number) => {
    const newLength =  numbers.length
    const isLessThan = newLength > lastLength
    const newText = numbers.replace(/\//g, '')
    const day = newText.substring(0, 2)
    const month = newText.substring(2, 4)
    const year = newText.substring(4, 8)
    const textFormat = `${day.length > 1  ? `${lastLength > 0 && isLessThan ? `${day  }/` : (newLength > 2 && !isLessThan) ? `${day  }/` : day }` : day}${month ? `${ isLessThan && month.length > 1 ? `${month}/` : `${!isLessThan && newLength > 5 ? `${month}/` : month}` }` : ''}${year ? `${year}` : ''
    }`
    return textFormat
}