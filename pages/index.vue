<template>
  <v-app>
    <v-container>
      <v-row>
        <v-btn v-on:click="test()">test</v-btn>
      </v-row>
      <v-row v-for="timer of timers" :key="timer.id">
        <v-btn v-if="timer.state!=='play'" v-on:click="play(timer.id)">
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn v-if="timer.state==='play'" v-on:click="pause(timer.id)">
          <v-icon>mdi-pause</v-icon>
        </v-btn>
        <v-btn v-on:click="remove(timer.id)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <span>{{JSON.stringify(timer)}}</span>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { createDao } from "lib/dao";
import { timerStore } from "~/store";

export default Vue.extend({
  data() {
    return {};
  },
  async mounted() {
    await timerStore.load();
  },
  computed: {
    timers() {
      return timerStore.timers;
    }
  },
  methods: {
    async test() {
      await timerStore.add({
        duration: 10000,
        name: "test"
      });
    },
    async remove(id: string) {
      console.log("delete", { id });
      await timerStore.remove(id);
    },
    async toggle(id: string) {
      const timer = this.timers.find(item => item.id === id);
      if (timer) {
        if (timer.state === "pause") {
          await timerStore.play(id);
        } else {
          await timerStore.pause(id);
        }
      }
    },
    async play(id: string) {
      await timerStore.play(id);
    },
    async pause(id: string) {
      await timerStore.pause(id);
    }
  }
});
</script>

<style>
</style>
