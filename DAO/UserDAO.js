import {getK, setK} from './UserDAOImpl.js';

async function get(key){
    return await getK(key);
}

async function set(key,value){
    await setK(key,value);
};

export {set, get};