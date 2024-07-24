export const fomatDate = (date: string, isminutes?: boolean) => {
    const dateString = new Date(date);
    const minutes = `00${dateString.getMinutes()}`.slice(-2);
    const hour =  `00${dateString.getHours()}`.slice(-2);
    const day =  `00${dateString.getDate()}`.slice(-2);
    const month =  `00${dateString.getMonth() + 1}`.slice(-2);
    const year = `${dateString.getFullYear()}`
    let resuilt =""
    if(isminutes) {
        resuilt =  day + "/" + month + "/" + year
    }else{
        resuilt = day + "/" + month + "/" + year + "   " + hour + ":" + minutes;
    }
    return resuilt;
}