// pokemons 是爬下来的数据list 这里直接当作全局变量 其实这是不好的做法
console.log(`总共有 ${pokemons.length} 只精灵宝可梦`) // 807
// 应该写到后端 再通过发送请求得到 这样保证了数据不会被污染

// 把得到的数字id转化成格式为三位的id字符串
handleIdInputValue = key => {
    let id = parseInt(key, 10)
    console.log(id)
    if (!id && id !== 0) {
        console.log(key)
        return key
    } else {
        if (id === 0) {
            return `807`
        } else if (id < 10) {
            return `00${id}`
        } else if (id < 100) {
            return `0${id}`
        } else {
            return `${id}`
        }
    }
}
// hanlde id offset
const handleIdOffset = (id, offset, length) => {
    id = parseInt(id)
    id = (id + offset + length) % length
    return handleIdInputValue(id)
}
// 根据 id 或者 name 找到具体的pokemon实例
const findPokemon = idOrName => {
    const searchOne = pokemons.filter(pokemon => pokemon.name === idOrName)[0]
    const searchTwo = pokemons.filter(pokemon => pokemon.id === idOrName)[0]
    if (searchOne) {
        return searchOne
    } else if (searchTwo) {
        return searchTwo
    } else {
        return undefined
    }
}
// 更新标题 为当前显示的pokemon
const updateTitle = (pokemon) => {
    const currentId  = document.querySelector('#id-pokemon-id')
    const currentName = document.querySelector('#id-pokemon-name')
    currentId.dataset.id = pokemon.id
    currentId.innerHTML = `#${pokemon.id}`
    currentName.innerHTML = `${pokemon.name}`
}
// 更新图片 为当前显示的pokemon
const updateImg = (pokemon) => {
    const img = document.querySelector('#id-pokemon-img')
    const imgTitle = document.querySelector('.pokemon-img-title')
    const name = pokemon.name
    const id = pokemon.id
    img.src = `pokemon_imgs/${id}${name}.png`
    img.alt = name
    imgTitle.innerHTML = `#${id} ${name}`
}
// 更新pokemon属性及弱点图标
const updateTypes = (pokemon) => {
    const typeListDiv = document.querySelector('#id-type-list')
    const typeList = pokemon.types
    let template = ''
    let mapper = {
        "虫": "bug-btn",
        "龙": "dragon-btn",
        "妖精": "fairy-btn",
        "火": "fire-btn",
        "幽灵": "ghost-btn",
        "地面": "ground-btn",
        "一般": "normal-btn",
        "超能力": "psychic-btn",
        "钢": "steel-btn",
        "恶": "dark-btn",
        "电": "eletric-btn",
        "格斗": "fighting-btn",
        "飞行": "flying-btn",
        "草": "grass-btn",
        "冰": "ice-btn",
        "毒": "poison-btn",
        "岩石": "rock-btn",
        "水": "water-btn",
    }
    typeList.forEach(type => {
        let btnClass = mapper[type]
        template += `<button class="type-btn ${btnClass}">${type}</button>`
    })
    typeListDiv.innerHTML = template
}
const updateWeakness = (pokemon) => {
    const weaknessListDiv = document.querySelector('#id-weakness-list')
    const weaknessList = pokemon.weaknesses
    let template = ''
    let mapper = {
        "虫": "bug-btn",
        "龙": "dragon-btn",
        "妖精": "fairy-btn",
        "火": "fire-btn",
        "幽灵": "ghost-btn",
        "地面": "ground-btn",
        "一般": "normal-btn",
        "超能力": "psychic-btn",
        "钢": "steel-btn",
        "恶": "dark-btn",
        "电": "eletric-btn",
        "格斗": "fighting-btn",
        "飞行": "flying-btn",
        "草": "grass-btn",
        "冰": "ice-btn",
        "毒": "poison-btn",
        "岩石": "rock-btn",
        "水": "water-btn",
    }
    weaknessList.forEach(type => {
        let btnClass = mapper[type]
        template += `<button class="type-btn ${btnClass}">${type}</button>`
    })
    weaknessListDiv.innerHTML = template
}
// 更新pokemon的简介
const updateInfo = (pokemon) => {

    const infoDiv = document.querySelector('#id-info-div')
    const info = pokemon.info
    const category = info.category
    const height = info.height
    const weight = info.weight
    const abilities = info.abilities

    let template = '<h3>Info.</h3>'
    template += `<p>分类: <span>${category}</span></p>`
    template += `<p>身高: <span>${height} m</span></p>`
    template += `<p>体重: <span>${weight} kg</span></p>`
    template += `<p>特性:<br>`
    abilities.forEach(a => {
        template += `<span>${a.name}</span><p>${a.detail}</p>`
    })
    template += '</p>'
    infoDiv.innerHTML = template
}
// 更新pokemon的描述
const updateStory = (pokemon) => {
    const storyDiv = document.querySelector(`#id-pokemon-story`)
    const story = pokemon.story
    storyDiv.innerHTML = story
}
// 更新pokemon的进化列表
const updateEvolution = (pokemon) => {
    const evolution = document.querySelector('#id-evolution-list')
    const pokemonEvolution = pokemon.evolution
    let template = ''
    if (pokemonEvolution.length !== 0) {
        pokemonEvolution.forEach((e, i) => {
            let branches = e.branches
            if (branches.length === 1) {
                template +=
                `
                <div class="pokemon-evo-item">
                    <img class="pokemon-evo-img" src="pokemon_imgs/${branches[0].id}${branches[0].name}.png" alt="${branches[0].name}">
                    <span class="pokemon-evo-id">${branches[0].id}</span><span class="pokemon-evo-name">${branches[0].name}</span>
                </div>
                `
            } else {
                branches.forEach(e => {
                    template +=
                    `
                    <div class="pokemon-evo-item">
                        <img class="pokemon-evo-img" src="pokemon_imgs/${e.id}${e.name}.png" alt="${e.name}">
                        <span class="pokemon-evo-id">${e.id}</span><span class="pokemon-evo-name">${e.name}</span>
                    </div>
                    `
                })
            }
        })
    } else {
        template = `<p>${pokemon.name}没有进化过程</p>`
    }
    evolution.innerHTML = template
}
// 更新页面上的 上一只 和 下一只 pokemon 的按钮显示
const updatePrevAndNextButton = (pokemon) => {
    const id = pokemon.id
    // const prevPokemon = pokemons.filter(pokemon => pokemon.id === handleIdOffset(id, -1, 807))[0]
    const prevPokemon = findPokemon(handleIdOffset(id, -1, 807))
    // const nextPokemon = pokemons.filter(pokemon => pokemon.id === handleIdOffset(id, 1, 807))[0]
    const nextPokemon = findPokemon(handleIdOffset(id, 1, 807))
    const prevButton = document.querySelector('#id-prev-pokemon')
    const nextButton = document.querySelector('#id-next-pokemon')
    prevButton.innerHTML = `${prevPokemon.id} ${prevPokemon.name} <`
    nextButton.innerHTML = `> ${nextPokemon.id} ${nextPokemon.name}`
}
// 把符合条件的pokemon显示到当前页面中
const showPokemonById = (id) => {
    const pokemon = findPokemon(id)
    if (pokemon === undefined) {
        alert("找不到该精灵宝可梦")
    } else {
        updateTitle(pokemon)
        updateImg(pokemon)
        updateTypes(pokemon)
        updateWeakness(pokemon)
        updateInfo(pokemon)
        updateStory(pokemon)
        updateEvolution(pokemon)
        updatePrevAndNextButton(pokemon)
    }
}
// banner背景图的上下左右坐标处理函数
const up = xy => {
    let x = parseInt(xy[0])
    let y = parseInt(xy[1])
    y = y === 0 ? 0 : y - 10
    return `${x}% ${y}%`
}

const down = xy => {
    let x = parseInt(xy[0])
    let y = parseInt(xy[1])
    y = y === 100 ? 100 : y + 10
    return `${x}% ${y}%`
}

const left = xy => {
    let x = parseInt(xy[0])
    let y = parseInt(xy[1])
    x = x === 0 ? 0 : x - 10
    return `${x}% ${y}%`
}

const right = xy => {
    let x = parseInt(xy[0])
    let y = parseInt(xy[1])
    x = x === 100 ? 100 : x + 10
    return `${x}% ${y}%`
}
// banner背景图处理函数
const handleDAndBG = (backgroundPosition, d) => {
    let xy = backgroundPosition.split(' ')
    let mapper = {
        'up': up,
        'down': down,
        'left': left,
        'right': right,
    }
    let action = mapper[d]
    return action(xy)
}

const moveHeaderBG = d => {
    const banner = document.querySelector('.banner')
    const backgroundPosition = window.getComputedStyle(banner).backgroundPosition
    let nextBackgroundPosition = handleDAndBG(backgroundPosition, d)
    banner.style.backgroundPosition = nextBackgroundPosition
}

const handleHeaderButtonClick = target => {
    let classList = target.classList
    if (classList.contains('header-up-button')) {
        moveHeaderBG('up')
    } else if (classList.contains('header-down-button')) {
        moveHeaderBG('down')
    } else if (classList.contains('header-left-button')) {
        moveHeaderBG('left')
    } else if (classList.contains('header-right-button')) {
        moveHeaderBG('right')
    }
}
// 显示所有属性类型
const showTypes = () => {
    let mapper = {
    "虫": "bug-btn",
    "龙": "dragon-btn",
    "妖精": "fairy-btn",
    "火": "fire-btn",
    "幽灵": "ghost-btn",
    "地面": "ground-btn",
    "一般": "normal-btn",
    "超能力": "psychic-btn",
    "钢": "steel-btn",
    "恶": "dark-btn",
    "电": "eletric-btn",
    "格斗": "fighting-btn",
    "飞行": "flying-btn",
    "草": "grass-btn",
    "冰": "ice-btn",
    "毒": "poison-btn",
    "岩石": "rock-btn",
    "水": "water-btn",
    }
    const c = document.querySelector('#id-types-container')
    if (c === null) {
        const typeEntries = Object.entries(mapper)
        let t = `<div id="id-types-container">`
        typeEntries.forEach(e => t += `<button class="type-btn ${e[1]}">${e[0]}</button>`)
        const searchDiv = document.querySelector('#id-find-pokemon')
        t += `</div>`
        searchDiv.insertAdjacentHTML('afterbegin', t)
    } else {
        c.remove()
    }
}

const handleSubmit = () => {
    const idInput = document.querySelector('#id-pokemon-id-input')
    const idToSubmit = handleIdInputValue(idInput.value)
    showPokemonById(idToSubmit)
    idInput.value = ''
}

const updateSearch = (type, pokemonsByType, resultListDiv) => {
    const searchCondition = document.querySelector('#id-search-condition')
    if (searchCondition === null) {
        let t = `<h3 id="id-search-condition">搜索条件：${type}</h3>`
        const searchDiv = document.querySelector('#id-find-pokemon')
        searchDiv.insertAdjacentHTML('beforeend', t)
        insertPokemonList(pokemonsByType)
    } else {
        const currentSearchConditions = searchCondition.innerHTML.slice(5).split(' ')
        if (currentSearchConditions.includes(type)) {
            return
        } else {
            searchCondition.insertAdjacentHTML('beforeend', ` ${type}`)
            insertPokemonList(pokemonsByType)
            resultListDiv.remove()
        }
    }
}

const insertPokemonList = (list) => {
    let template = `<div id="id-result-list-div"><ul class="result-list">`
    list.forEach(pokemons => template += `<li data-id=${pokemons.id}><img data-id=${pokemons.id} src="pokemon_imgs/${pokemons.id}${pokemons.name}.png" alt=${pokemons.name}><span data-id=${pokemons.id}>#${pokemons.id} ${pokemons.name}</span></li>`)
    template += `</ul></div>`
    const searchDiv = document.querySelector('#id-find-pokemon')
    searchDiv.insertAdjacentHTML('beforeend', template)
}

const handleTypeSearch = (self) => {
    const type = self.innerHTML
    const pokemonsByType = pokemons.filter(pokemon => pokemon.types.includes(type))
    const resultListDiv = document.querySelector('#id-result-list-div')
    if (resultListDiv === null) {
        updateSearch(type, pokemonsByType, resultListDiv)
    } else {
        const resultList = document.querySelector('.result-list').children
        let currentResult = []
        for (let i = 0; i < resultList.length; i++) {
            let listItem = resultList[i]
            let pokemon = pokemons.find(e => e.id === listItem.dataset.id)
            currentResult.push(pokemon)
        }
        const newResult = currentResult.filter(pokemon => pokemon.types.includes(type))
        if (newResult.length === 0) {
            alert("找不到符合该条件的精灵宝可梦")
            resetResult()
        } else {
            updateSearch(type, newResult, resultListDiv)
        }
    }
}

const resetResult = () => {
    const searchDiv = document.querySelector('#id-find-pokemon')
    searchDiv.innerHTML = `
    <input type="text" name="pokemon-id" id="id-pokemon-id-input" placeholder="输入编号或者名字">
    <button id="id-pokemon-id-submit" class="search-btn">Submit</button>
    <button id="id-pokemon-types-button" class="search-btn">Types</button>
    <button id="id-pokemon-reset-button" class="search-btn">Reset</button>
    <button id="id-pokemon-all-button" class="search-btn">All</button>
    `
}

const bindEventPrevAndNextPokemon = () => {
    const nextButton = document.querySelector('#id-next-pokemon')
    nextButton.addEventListener('click', (event) => {
        const currentPokemonId = document.querySelector('#id-pokemon-id').dataset.id
        const nextPokemonId = handleIdOffset(currentPokemonId, 1, 807)
        showPokemonById(nextPokemonId)
    })

    const prevButton = document.querySelector('#id-prev-pokemon')
    prevButton.addEventListener('click', (event) => {
        const currentPokemonId = document.querySelector('#id-pokemon-id').dataset.id
        const nextPokemonId = handleIdOffset(currentPokemonId, -1, 807)
        showPokemonById(nextPokemonId)
    })
}

const bindEventEvoPokemonImgClick = () => {
    const evoList = document.querySelector('#id-evolution-list')
    evoList.addEventListener('click', (event) => {
        let target = event.target
        let mapper = {
            "pokemon-evo-img": target.alt,
            "pokemon-evo-id": target.innerHTML,
            "pokemon-evo-name": target.innerHTML,
        }
        console.log(mapper[target.classList.value])
        let key = mapper[target.classList.value]
        if (key === undefined) {
            return
        } else {
            showPokemonById(key)
        }
    })
}


const bindEventBannerBGMove = () => {
    const header = document.querySelector('.banner')
    header.addEventListener('click', (e) => {
        let target = e.target
        if (target.classList.contains('header-button')) {
            handleHeaderButtonClick(target)
        }
    })
}
const bindEventSearch = () => {
    const search = document.querySelector('#id-find-pokemon')
    search.addEventListener('click', (event) => {
        let self = event.target
        console.log(self)
        if (self === null || self.id === "id-find-pokemon" || self.id === "id-types-container" || self.id === "id-pokemon-id-input") {
            return
        } else if (self.id === "id-pokemon-types-button") {
            showTypes()
        } else if (self.id === "id-pokemon-reset-button") {
            resetResult()
        } else if (self.id === "id-pokemon-id-submit") {
            handleSubmit()
        } else if (self.id === "id-pokemon-all-button") {
            insertPokemonList(pokemons)
        } else if (self.classList.contains('type-btn')) {
            handleTypeSearch(self)
        } else if (self.dataset.length !== 0) {
            resetResult()
            showPokemonById(self.dataset.id)
        }
    })
}

const bindEvents = () => {
    bindEventPrevAndNextPokemon()
    bindEventBannerBGMove()
    bindEventEvoPokemonImgClick()
    bindEventSearch()
}

const __main = () => {
    bindEvents()
}

__main()
