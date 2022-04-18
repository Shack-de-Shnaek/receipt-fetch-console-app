import axios from 'axios';

interface ReceiptInterface {
    name: string,
    domestic: boolean,
    price: number,
    weight?: number,
    description: string
}
const uri = 'https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1';
const receiptData: Array<ReceiptInterface> = [];

const print = (array: Array<ReceiptInterface>) => {
    let returnString = '';
    let hasDomestic = false;
    let hasImported = false;
    let domesticCost = 0;
    let importedCost = 0;
    let domesticCount = 0;
    let importedCount = 0;
    array.forEach((item: ReceiptInterface) => {
        if (item.domestic) {
            if (!hasDomestic) {
                returnString += '. Domestic\n'
                hasDomestic = true;
            };
            domesticCost += item.price;
            domesticCount += 1;
        }
        if (!item.domestic) {
            if (!hasImported) {
                returnString += '. Imported\n'
                hasImported = true;
            };
            importedCost += item.price;
            importedCount += 1;
        }
        returnString += `... ${item.name}\n`;
        returnString += `    Price: $${item.price}\n`;
        returnString += `    ${(item.description.length > 10) ? item.description.slice(0, 10) + '...' : item.description}\n`;
        returnString += `    Weight: ${(item.weight) ? item.weight : 'N/A'}\n`;
    });
    returnString += `Domestic cost: $${domesticCost}\n`;
    returnString += `Imported cost: $${importedCost}\n`;
    returnString += `Domestic count: $${domesticCount}\n`;
    returnString += `Imported count: $${importedCount}`;
    console.log(returnString);
}

axios.get(uri)
    .then(res => {
        res.data.forEach((receiptItem: ReceiptInterface) => {
            receiptData.push(receiptItem);
        });        
        for (let i = 0; i < receiptData.length - 1; i++) {
            for (let o = 0; o < (receiptData.length - i - 1); o++) {
                if(receiptData[o].name > receiptData[o+1].name) {
                    const temp = receiptData[o];
                    receiptData[o] = receiptData[o + 1];
                    receiptData[o + 1] = temp;      
                }
            }
        }
        for (let i = 0; i < receiptData.length - 1; i++) {
            for (let o = 0; o < (receiptData.length - i - 1); o++) {
                if (!receiptData[o].domestic && receiptData[o + 1].domestic) {
                    const temp = receiptData[o];
                    receiptData[o] = receiptData[o + 1];
                    receiptData[o + 1] = temp;
                } 
            }
        }
        print(receiptData);
    })
    .catch(err => console.log(err));