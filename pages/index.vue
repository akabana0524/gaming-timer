<template>
  <div class="container">
    <el-button v-on:click="test()">test</el-button>
    <div v-for="timer of timers" :key="timer.id">
      <span>{{timer.id}}</span>:
      <span>{{timer.name}}</span>
      <el-button icon="close" v-on:click="remove(timer.id)"></el-button>
    </div>
  </div>
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
        begin: new Date(),
        duration: 10000,
        name: "test",
        state: "live"
      });
    },
    async remove(id: string) {
      console.log("delete", { id });
      await timerStore.remove(id);
    }
  }
});
</script>

<style>
</style>
