import {Asset, Detail} from "./models";
const apiKey = `66683917a94e703e14ca150023f4ea7c`;
let stage;

export const init = (stageInstance) =>{
    stage = stageInstance;
};

let assetById = {};

export const getPopular = async(type)=> {
    if(!type){
        throw new Error("no type defined")
    }

    const assets = await get(`https://api.themoviedb.org/3/${type}/popular?api_key=${apiKey}`);
    const {results = []} = assets;

    assetById = {};

    if(results.length){
         let data = results.map((data)=>{
            const asset = new Asset(data);
            asset.type = type;
            assetById[asset.id] = asset;
            return asset;
        });
        return data;
    }
    return [];
};

export const getDetails = (type, id, streamUrl)=> {
    return get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`).then(response => {
        const asset = assetById[response.id];
        response.streamUrl = asset.stream;
        return new Detail(response);
    });
};

const get = (url)=> {
    return fetch(url, {
        'Accept': 'application/json'
    }).then(response => {
        return response.json();
    })
};

