

async function getK(key){
    return await client.get(key);
}
async function setK(key,value){
    await client.set('key','value');
}

await client.set('key','xxx');

let all = await client.get('key');
console.log(all);


export  {getK , setK};