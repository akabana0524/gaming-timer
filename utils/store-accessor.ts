/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import TimerModule from '~/store/timer'

let timerStore: TimerModule
function initialiseStores(store: Store<any>): void {
  timerStore = getModule(TimerModule, store);
  timerStore.initialize();
}

export { initialiseStores, timerStore }
