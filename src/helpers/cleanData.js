function cleanData(arr) {
    let predata = {};
    let processedData = [];
    for (let i = 0; i < arr.length; i++) {
        const date = arr[i].date.split(',')[0];
        if (date in predata) {
            predata[date] += 1;
        } else {
            predata[date] = 1;
        }
    }
    for (let key in predata) {
        processedData.push({ date: key, sales: predata[key] })
    }
    return processedData;
}

function cleanSalesData(arr) {
    let predata = {};
    let processedData = [];
    for (let i = 0; i < arr.length; i++) {
        let date = arr[i].date.split(',')[0];
        let value = Number(Object.values(arr[i].total)[0]);
        console.log(value);
        if (date in predata) {
            predata[date] += value;
        }
        else {
            predata[date] = value;
        }
    }
    console.log(predata);
    for (let key in predata) {
        processedData.push({ date: key, sales: predata[key] });
    }
    return processedData;
}

function cleanCategory(arr) {
    let predata = {};
    let processData = [];
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        let description = arr[i].description;
        if (description in predata) {
            predata[description] += 1;
        }
        else {
            predata[description] = 1;
        }
        total += 1;
    }
    for (let key in predata) {
        processData.push({ item: key, count: predata[key], percent: predata[key] / total })
    }
    return processData;
}

const dataProcess = { cleanData, cleanSalesData, cleanCategory };

export default dataProcess;
