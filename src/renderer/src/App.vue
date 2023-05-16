<script setup>
// import Versions from './components/Versions.vue'
import FlipClockVue from './components/FlipClock.vue'
import { useAxios } from '@vueuse/integrations/useAxios'
const { data } = useAxios('https://v.api.aa1.cn/api/nl/')
</script>

<template>
  <div class="fc" flex flex-col>
    <FlipClockVue />
    <div v-if="data" mt-5 text-5 font-700 class="footer" p-1 rounded-1>
      {{ data.today }} {{ data.nl }} {{ data.jq }} {{ data.xq }}
    </div>
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';
.footer {
  background-color: #333;
}
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
  color: #ccc;
}
</style>
