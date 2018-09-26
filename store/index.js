import Vuex from 'vuex'
import app from './modules/app'
import getters from './getters'

const createStore = () => {
    return new Vuex.Store({
        modules: {
            app
        },
        getters
    })
}

export default createStore
