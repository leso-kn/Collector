const ifWrapper = (condition, element) => {
    return condition ? element : null;
}

export function shortenLargeNumber(num, digits) {
    var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        decimal;

    for (var i = units.length - 1; i >= 0; i--) {
        decimal = Math.pow(1000, i + 1);

        if (num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }

    return num;
}

// const forWrapper = (ti)

export default ifWrapper;

export const reducer = (data, action) => {
    let newData = {...data}
    for (let i = 0; i < action.field.length; i++) {
        newData[action.field[i]] = action.val[i]
    }
    return newData
}

export const exists = (data, cmpData) =>{
    for(const [index, item] of data.entries()){
        if(item.name === cmpData.name && item.identifyName === cmpData.identifyName) return index
    }
    return -1;
}