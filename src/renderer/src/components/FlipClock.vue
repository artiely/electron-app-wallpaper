<template>
  <div class="flipClock" w-460px h-90px data-w="460">
    <Timer2 ref="h1Ref" />
    <Timer2 ref="h2Ref" />
    <div w-20px h-full color-gray text-2em mt--3 flex items-center justify-center>:</div>
    <Timer2 ref="m1Ref" />
    <Timer2 ref="m2Ref" />
    <div w-20px h-full color-gray text-2em mt--3 flex items-center justify-center>:</div>
    <Timer2 ref="s1Ref" />
    <Timer2 ref="s2Ref" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onUnmounted } from 'vue'
import Timer2 from './Flipper.vue'
import dayjs from 'dayjs'
const date = ref(dayjs().format('HH:mm:ss'))
date.value = dayjs().format('HH:mm:ss')
const h1Ref = ref(null)
const h2Ref = ref(null)
const m1Ref = ref(null)
const m2Ref = ref(null)
const s1Ref = ref(null)
const s2Ref = ref(null)

const nowTime = ref([0, 0, 0, 0, 0, 0])

const nextTime = ref(dayjs().format('HH:mm:ss').split(':').join('').split(''))
let timer = null
onMounted(() => {
  nextTick(() => {
    run()
  })
})
timer = setInterval(() => {
  nowTime.value = dayjs(new Date() - 1000)
    .format('HH:mm:ss')
    .split(':')
    .join('')
    .split('')
  nextTime.value = dayjs().format('HH:mm:ss').split(':').join('').split('')

  run()
}, 1000)
onUnmounted(() => {
  clearInterval(timer)
})
const refArr = computed(() => [
  h1Ref.value,
  h2Ref.value,
  m1Ref.value,
  m2Ref.value,
  s1Ref.value,
  s2Ref.value
])
const run = () => {
  for (let i = 0; i < refArr.value.length; i++) {
    if (nowTime.value[i] !== nextTime.value[i]) {
      refArr.value[i].play(nowTime.value[i], nextTime.value[i])
    }
  }
}
</script>

<style lang="less" scoped>
.flipClock {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
}
</style>
