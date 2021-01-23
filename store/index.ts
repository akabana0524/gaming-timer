import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { initialiseStores } from '~/utils/store-accessor'
Vue.use(Vuex);
const initializer = (store: Store<any>) => initialiseStores(store)
export const plugins = [initializer]
export * from '~/utils/store-accessor'
