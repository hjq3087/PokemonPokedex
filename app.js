const fs = require('fs')

const request = require('request')
const cheerio = require('cheerio')

class Pokemon  {
    constructor() {
        this.id = ''
        this.name = ''
        this.subName = ''
        this.types = []
        this.weaknesses = []
        this.story = ''
        this.evolution = []
        this.imgSrc = ''
        this.abilities = []
        this.info = {}
        this.style = []
    }
}

const pokemonFromHtml = (html) => {
    let $ = cheerio.load(html)
    let p = new Pokemon()

    const nameDiv = $('.pokemon-slider__main-name')
    const subNameP = $('.pokemon-slider__main-subname')
    const idDiv = $('.pokemon-slider__main-no')
    const typeDivs = $('.pokemon-type').children('.pokemon-type__type')
    const weaknessDivs = $('.pokemon-weakness__items').children('div')
    const storySpan = $('.pokemon-story__body span')
    const img = $('.pokemon-img__front')
    const evolutionDivs = $('.pokemon-evolution-contents_flow').children('.pokemon-evolutionlevel')
    const abilitiesDivs = $('.pokemon-info__ability_info')
    const categoryDiv = $('.pokemon-info__category')
    const heightDiv = $('.pokemon-info__height')
    const weightDiv = $('.pokemon-info__weight')
    const styleDiv = $('.pokemon-style__boxes-inner')
    


    let name = nameDiv.text()
    let subName = subNameP.text()
    let id = idDiv.text()
    let story = storySpan.text()
    let imgSrc = `https://cn.portal-pokemon.com${img.attr('src')}`
    let types = []
    typeDivs.each((i, e) => {
        let type = $(e).children('a').children('span').text()
        types.push(type)
    })
    let weaknesses = []
    weaknessDivs.each((i, e) => {
        let weakness = $(e).children('a').children('span').text()
        weaknesses.push(weakness)
    })
    let evloution = []
    evolutionDivs.each((i, e) => {
        let evloutionLevel = i + 1
        let infoDiv = $(e).children('div')
        if (name.includes('伊布')) {
            if (i === 0) {
                let id = "133"
                let name = "伊布"
                evloution.push({
                    evloutionLevel,
                    branches: [{id, name}],
                })
            } else {
                evloution.push({
                    evloutionLevel,
                    branches: [
                        { "id": "134", "name": "水伊布", "subname": "" },
                        { "id": "135", "name": "雷伊布", "subname": "" },
                        { "id": "136", "name": "火伊布", "subname": "" },
                        { "id": "196", "name": "太阳伊布", "subname": "" },
                        { "id": "197", "name": "月亮伊布", "subname": "" },
                        { "id": "470", "name": "叶伊布", "subname": "" },
                        { "id": "471", "name": "冰伊布", "subname": "" },
                        { "id": "700", "name": "仙子伊布", "subname": "" },
                    ],
                })
            }
        } else if (infoDiv.length === 1) {
            let info = infoDiv.children('a').children('.pokemon-evolution-item__info')
            let id = info.children('.pokemon-evolution-box__no').text()
            let name = info.children('.pokemon-evolution-item__info-name').text()
            let subname = info.children('.pokemon-evolution-item__info-subname').text()
            let branches = [{id, name, subname}]
            evloution.push({evloutionLevel, branches})
        } else {
            let length = evloution.push({evloutionLevel, branches: []})
            infoDiv.each((i, e) => {
                let info = $(e).children('a').children('.pokemon-evolution-item__info')
                let id = info.children('.pokemon-evolution-box__no').text()
                let name = info.children('.pokemon-evolution-item__info-name').text()
                let subname = info.children('.pokemon-evolution-item__info-subname').text()
                evloution[length - 1].branches.push({id, name, subname})
            })
        }
    })
    let abilities = []
    abilitiesDivs.each((i, e) => {
        let abilityName = $(e).children('.pokemon-info__value--title').text()
        let abliityDetail = $(e).children('.pokemon-info__value--body').text()
        let ability = {
            name: abilityName,
            detail: abliityDetail,
        }
        abilities.push(ability)
    })
    let style = []
    let styles = styleDiv.children('.pokemon-style-box')
    if (styles.length > 0) {
        styles.each((i, e) => {
            let styleBox = $(e)
            let styleLink = styleBox.children('a')
            let styleId = styleLink.children('.pokemon-style-box__no').text()
            let styleName = styleLink.children('.pokemon-style-box__name').text()
            let styleSubName = styleLink.children('.pokemon-style-box__subname').text()
            style.push({
                styleId,
                styleName,
                styleSubName,
            })
        })
    }
    
    let category = categoryDiv.children('.pokemon-info__value').children('span').text()
    let height = parseFloat(heightDiv.children('.pokemon-info__value').text())
    let weight = parseFloat(weightDiv.children('.pokemon-info__value').text())


    p.name = name
    p.subName = subName
    p.id = id
    p.story = story
    p.types = types
    p.weaknesses = weaknesses
    p.imgSrc = imgSrc
    p.evolution = evloution
    p.style = style
    p.info = {
        category,
        height,
        weight,
        abilities,
    }
    return p
}


const ensurePath = (directory) => {
    let exists = fs.existsSync(directory)
    if (!exists) {
        fs.mkdirSync(directory)
    }
}

const iToNo = (i) => {
    if (i < 10) {
        return `00${i}`
    } else if (i < 100) {
        return `0${i}`
    } else {
        return `${i}`
    }
}

const fetchPokemonById = (id) => {

    let pokemonNo = iToNo(id)
    let url = `https://cn.portal-pokemon.com/play/pokedex/${pokemonNo}`
    let dirName = 'cached_html'
    let cachedFile = `${dirName}/${pokemonNo}.html`

    ensurePath(dirName)

    let p = new Promise((resolve, reject) => {
        let isExists = fs.existsSync(cachedFile)
        if (isExists) {
            let data = fs.readFileSync(cachedFile)
            resolve(data)
        } else {
            request(url, (err, res, html) => {
                if (!err && res.statusCode == 200) {
                    // let data = res.body
                    fs.writeFileSync(cachedFile, html)
                    resolve(html)
                }
                reject(err)
            })
        }
    })
    return p
}

async function fetchAllPokemons() {

    let promiseList = []
    console.log('开始请求精灵宝可梦数据...')
    for (let id = 1; id <= 807; id++) {
        let p = fetchPokemonById(id)
        promiseList.push(p)
    }

    let pokemons = []
    await Promise.all(promiseList).then((dataList) => {
        dataList.forEach(data => {
            let pokemon = pokemonFromHtml(data)
            pokemons.push(pokemon)
        })
    })
    let stylePromiseList = []
    let pokemonStyles = []
    pokemons.forEach(pokemon => {
        let styleList = pokemon.style.slice(1)
        if (styleList.length >= 1) {
            styleList.forEach((style, index) => {
                let id = `${style.styleId}_${index + 1}`
                let p = fetchPokemonById(id)
                pokemonStyles.push(p)
            })
        }
    })
    await Promise.all(stylePromiseList).then((dataList) => {
        dataList.forEach(data => {
            let pokemon = pokemonFromHtml(data)
            pokemonStyles.push(pokemon)
        })
    })
    console.log('精灵宝可梦数据爬取完毕...')

    return pokemons
}

async function fetchAllStyles(pokemons) {

    let stylePromiseList = []
    console.log('开始请求精灵宝可梦style数据...')
    pokemons.forEach(pokemon => {
        let styleList = pokemon.style.slice(1)
        if (styleList.length >= 1) {
            styleList.forEach((style, index) => {
                let id = `${style.styleId}_${index + 1}`
                let p = fetchPokemonById(id)
                stylePromiseList.push(p)
            })
        }
    })
    let pokemonStyles = []
    await Promise.all(stylePromiseList).then((dataList) => {
        dataList.forEach(data => {
            let pokemon = pokemonFromHtml(data)
            pokemonStyles.push(pokemon)
        })
    })
    console.log('精灵宝可梦style数据爬取完毕...')

    return pokemonStyles
}

const savePokemonDatas = (pokemons) => {
    let json = JSON.stringify(pokemons, null, 2)
    let path = 'pokemons.json'
    fs.writeFileSync(path, json)
    console.log('精灵宝可梦数据写入完毕...')
}

const saveStyleDatas = (styleList) => {
    let json = JSON.stringify(styleList, null, 2)
    let path = 'styles.json'
    fs.writeFileSync(path, json)
    console.log('精灵宝可梦style数据写入完毕...')
}


const downloadImg = (url, path) => {
    request
        .get(url)
        .on('error', (error) => {
            console.log(error)
            console.log(`${path} 失败`)
            downloadImg(url, path)
        })
        .pipe(fs.createWriteStream(path))
}

const downloadPokemonImages = (pokemons) => {
    let dirName = 'pokemon_imgs'
    ensurePath(dirName)
    pokemons.forEach(pokemon => {
        let url = pokemon.imgSrc
        let fileName = `${pokemon.id}${pokemon.name}`
        let path =`${dirName}/${fileName}.png`
        downloadImg(url, path)
    })
}

const downloadStyleImages = (pokemons) => {
    let dirName = 'style_imgs'
    ensurePath(dirName)
    pokemons.forEach(pokemon => {
        let url = pokemon.imgSrc
        
        let fileName = `${pokemon.id}${pokemon.name}${pokemon.subName}`
        let path =`${dirName}/${fileName}.png`
        downloadImg(url, path)
    })
}


async function __main() {
    const pokemonList = await fetchAllPokemons()
    const styleList = await fetchAllStyles(pokemonList)
    savePokemonDatas(pokemonList)
    saveStyleDatas(styleList)
    // downloadPokemonImages(pokemonList)
    // downloadStyleImages(styleList)
}

// __main()

async function download() {
    const pokemonList = await fetchAllPokemons()
    console.log(pokemonList.length)
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i]
        console.log(pokemon.name)
        let dirName = 'pokemon_imgs'
        let url = pokemon.imgSrc
        let fileName = `${pokemon.id}${pokemon.name}${pokemon.subName}`
        let path =`${dirName}/${fileName}.png`
        downloadImg(url, path)
    }
}

download()