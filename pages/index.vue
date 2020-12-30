<template>
  <div class="container">
    <el-button v-on:click="test()">test</el-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {};
  },

  methods: {
    async test() {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        var notifTitle = "title";
        var notifBody = "body";
        var options = {
          body: notifBody
        };
        new Notification("test", options);
      }
    }
  }
});
</script>

<style>
</style>
