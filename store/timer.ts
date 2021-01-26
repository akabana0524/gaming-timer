import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators'
import { createDao, BaseEntity } from '~/lib/dao';
import sound from '~/assets/sounds/se_maoudamashii_jingle03.mp3';

export type TimerState = 'play' | 'ring' | 'pause';

export interface TimerData {
  id: string;
  duration: number;
  begin: number | null;
  name: string;
  state: TimerState;
  left: number;
}

class TimerEntity extends BaseEntity {
  duration!: number;
  begin!: number | null;
  name!: string;
  state!: TimerState;
}

const dao = createDao(TimerEntity);

@Module({ name: 'timer', stateFactory: true, namespaced: true })
export default class TimerModule extends VuexModule {
  static readonly INTERVAL = 16;
  _timerDatas: TimerData[] = [];
  _globalTimer: NodeJS.Timeout | null = null;
  _jingle = new Audio(sound);

  @Action
  initialize() {
    console.log('TimerModule initialize');
    this._jingle.volume = 0.1;
  }

  get timers() {
    return this._timerDatas;
  }

  @Mutation
  private addTimer(timer: TimerData) {
    console.log('addTimer');
    this._jingle.muted = true;
    this._jingle.play();
    this._timerDatas.push(timer);
  }

  @Mutation
  private updateTimer(timer: TimerData) {
    const index = this._timerDatas.findIndex(item => item.id === timer.id);
    if (index >= 0) {
      Object.assign(this._timerDatas[index], timer);
    }
  }

  @Mutation
  private removeTimer(id: string) {
    console.log({ list: this._timerDatas });
    const index = this._timerDatas.findIndex(item => item.id === id);
    if (index >= 0) {
      this._timerDatas.splice(index, 1);
    }
  }

  @Mutation
  private setGlobalTimer(timer: NodeJS.Timeout | null) {
    this._globalTimer = timer;
  }

  @Action
  async load() {
    const result = await dao.getAll();
    const rows = result.rows;
    rows.forEach(row => {
      const entity = row.doc;
      if (entity) {
        this.addTimer({
          id: entity._id,
          begin: entity.begin,
          duration: entity.duration,
          name: entity.name,
          state: entity.state,
          left: entity.duration
        });
      }
    });
    await this.updateGlobalTimer();
  }

  @Action
  async add(request: Omit<TimerData, 'id' | 'left' | 'begin' | 'state'>) {
    console.log('add');
    const savedEntity = await dao.save(request);
    const timer: TimerData = { ...request, id: savedEntity.id, left: request.duration, begin: null, state: 'pause' };
    this.addTimer(timer);
    await this.updateGlobalTimer();
  }

  @Action
  async update(timer: TimerData) {
    const _timer = this.timers.find(item => item.id === timer.id);
    if (!_timer) {
      throw new Error('timer not found:' + timer.id);
    }
    let change = false;
    if (timer.state === 'play' && _timer.state === 'pause') {
      timer.begin = new Date().getTime();
      if (timer.left) {
        timer.begin -= timer.duration - timer.left;
      }
      change = true;
    }
    if (timer.state === 'pause' && _timer.state === 'play') {
      timer.begin = null;
      change = true;
    }
    if (change) {
      const entity = await dao.get(timer.id);
      const savedEntity = await dao.save({ ...entity, ...timer });
    }

    this.updateTimer(timer);
    await this.updateGlobalTimer();
  }

  @Action
  async remove(id: string) {
    console.log('remove', { list: JSON.stringify(this._timerDatas) });
    const entity = await dao.get(id);
    await dao.delete(entity);
    this.removeTimer(id);
    await this.updateGlobalTimer();
  }

  @Action
  async play(id: string) {
    const timer = this.timers.find(timer => timer.id === id);
    if (timer) {
      await this.update({ ...timer, state: 'play' });
    }
  }

  @Action
  async pause(id: string) {
    const timer = this.timers.find(timer => timer.id === id);
    if (timer) {
      await this.update({ ...timer, state: 'pause' });
    }
  }

  @Action
  async reset(id: string) {
    const timer = this.timers.find(timer => timer.id === id);
    if (timer) {
      await this.update({ ...timer, state: 'pause', left: timer.duration });
    }
  }

  @Action
  updateGlobalTimer() {
    let active = this._timerDatas.findIndex(timer => timer.state === "play") !== -1;
    if (active && !this._globalTimer) {
      this.setGlobalTimer(setInterval((context) => context.dispatch('updateLeft'), TimerModule.INTERVAL, this.context));
    }
    if (!active && this._globalTimer) {
      clearInterval(this._globalTimer);
      this.setGlobalTimer(null);
    }
  }

  @Action
  updateLeft() {
    console.log("updateLeft");
    const now = new Date().getTime();
    for (const timer of this._timerDatas) {
      if (timer.state !== 'play') {
        continue;
      }
      const begin = timer.begin || new Date().getTime();
      const left = Math.max(begin + timer.duration - now, 0);
      const state = left === 0 ? 'ring' : 'play';
      this.update({
        ...timer,
        left,
        state,
        begin
      });
      if (state === 'ring') {
        this._jingle.muted = false;
        this._jingle.play();
      }
    }
  }
}
