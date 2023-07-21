// main file for utils
import { phoneFormat, getLast4Digits } from './phoneFormat';
import { dateFormat, dateToISO, getCurrentTime, convertISOToUSA, convertUSAtoISO } from './dateFormat';
import { orderFormater } from './orderFormat';
import { downloadOrderFormat } from './downloadOrderFormat';
import { getRandomColor } from './randomColor';
import fetchAPI from './fetchAPI';
import { 
    convertOrderToAPI,
    convertAPItoOrder,
    convertAPItoCustomer, 
    convertAPItoIncome,  
    convertAPItoIncomeUpToDate,
    convertAPItoMenu,
    convertCustomerToAPI,
    convertIncomeToAPI,
    convertIncomeUpToDateToAPI,
    convertMenuToAPI,
    convertToAPI,
    convertFromAPI,
} from './apiDataConverter';
import databaseDownloader from './DatabaseDownloader';
// export all utils here
export {
    databaseDownloader,
    phoneFormat,
    dateFormat,
    dateToISO,
    convertISOToUSA,
    convertUSAtoISO,
    getCurrentTime,
    orderFormater,
    downloadOrderFormat,
    getRandomColor,
    getLast4Digits,
    fetchAPI,
    convertOrderToAPI,
    convertAPItoOrder,
    convertAPItoCustomer, 
    convertAPItoIncome,  
    convertAPItoIncomeUpToDate,
    convertAPItoMenu,
    convertCustomerToAPI,
    convertIncomeToAPI,
    convertIncomeUpToDateToAPI,
    convertMenuToAPI,
    convertToAPI,
    convertFromAPI,
};