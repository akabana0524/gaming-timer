import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators'
import { createDao, BaseEntity } from '~/lib/dao';

export type TimerState = 'live' | 'ring' | 'stop';

export interface TimerData {
  id: string;
  begin: Date;
  duration: number;
  name: string;
  state: TimerState;
}

class TimerEntity extends BaseEntity {
  begin!: Date;
  duration!: number;
  name!: string;
  state!: TimerState;
}

const dao = createDao(TimerEntity);

@Module({ name: 'timer', stateFactory: true, namespaced: true })
export default class TimerModule extends VuexModule {
  _timerDatas: TimerData[] = [];
  _timerMap: { [id: string]: NodeJS.Timeout } = {};

  get timers() {
    return this._timerDatas;
  }
  @Mutation
  private timerProc(id: string) {
    if (id in this._timerMap) {
      clearInterval(this._timerMap[id]);
      delete this._timerMap[id];
    }
    console.log('timerProc', { list: JSON.stringify(this._timerDatas) });
    const timer = this._timerDatas.find(item => {
      console.log('timerProc', { id, item }); return item && item.id === id
    });
    if (!timer) {
      return;
    }
    switch (timer.state) {
      case "live":
        const left = new Date().getTime() - timer.begin.getTime() + timer.duration;
        this._timerMap[timer.id] = setTimeout(() => {
          console.log('timer ring!!!', { timer });
          timer.state = 'ring';
        }, left);
        break;
      case "stop":
      case 'ring':
        break;
    }
  }

  @Mutation
  private addTimer(timer: TimerData) {
    this._timerDatas.push(timer);
    console.log('addTimer', { timer, list: this._timerDatas });
  }

  @Mutation
  private updateTimer(timer: TimerData) {
    const index = this._timerDatas.findIndex(item => item.id === timer.id);
    if (index >= 0) {
      this._timerDatas[index] = timer;
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

  @Action
  async load() {
    const result = await dao.getAll();
    const rows = result.rows;
    rows.forEach(row => {
      const entity = row.doc;
      if (entity) {
        this.context.commit('addTimer', {
          id: entity._id,
          begin: entity.begin,
          duration: entity.duration,
          name: entity.name,
          state: entity.state
        });
      }
    });
  }

  @Action
  async add(request: Omit<TimerData, 'id'>) {
    const savedEntity = await dao.save(request);
    const timer: TimerData = { ...request, id: savedEntity.id };
    this.context.commit('addTimer', timer);
    this.timerProc(timer.id);
  }
  @Action
  async update(timer: TimerData) {
    this.context.commit('updateTimer', timer);
    this.timerProc(timer.id);
  }
  @Action
  async remove(id: string) {
    console.log('remove', { list: JSON.stringify(this._timerDatas) });
    const entity = await dao.get(id);
    await dao.delete(entity);
    this.context.commit('removeTimer', id);
    this.timerProc(id);
  }
}
