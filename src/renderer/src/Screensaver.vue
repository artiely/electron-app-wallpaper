<script setup>
// import Versions from './components/Versions.vue'
import FlipClockVue from './components/FlipClock.vue'
</script>

<template>
  <div class="fc">
    <!-- <Versions></Versions> -->
    <FlipClockVue />
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';
.fc {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  background: #000;
  -webkit-app-region: no-drag;
  user-select: none;
  color: #333;
}
</style>
