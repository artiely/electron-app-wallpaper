<template>
  <div ref="containerRef" :class="playClass" class="flipper">
    <ul class="flip secondPlay">
      <li v-for="(i, _i) in timer" ref="liRef" :key="_i" :class="_i == 0 ? 'active' : 'before'">
        <div class="a">
          <div class="up" flex items-center justify-center>
            <div class="shadow"></div>
            <div class="inn">{{ i }}</div>
          </div>
          <div class="down" flex items-center justify-center>
            <div class="shadow"></div>
            <div class="inn">{{ i }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const date = ref(dayjs().format('HH:mm:ss'))
date.value = dayjs().format('HH:mm:ss')
const timer = ref([0, 0])

const activeIndex = ref(0)
const containerRef = ref(null)
const playClass = ref('play')
const liRef = ref(null)

const isFlipping = ref(false)

const play = (now, next) => {
  if (activeIndex.value == 0) {
    timer.value[0] = now
    timer.value[1] = next
  } else {
    timer.value[0] = next
    timer.value[1] = now
  }
  isFlipping.value = true
  playClass.value = ''
  let _hasActive = {
    active: false,
    index: -1
  }
  if (!liRef.value) return
  for (let i = 0; i < liRef.value.length; i++) {
    if (liRef.value[i].classList.contains('active')) {
      _hasActive.active = true
      _hasActive.index = i
    }
  }
  if (!_hasActive.index == -1) {
    liRef.value[0].classList.add('before')
    liRef.value[0].classList.remove('active')
    liRef.value[1].classList.add('active')
    activeIndex.value = 1
    playClass.value = 'play'
  } else {
    if (_hasActive.index == liRef.value.length - 1) {
      liRef.value[0].classList.remove('before')
      liRef.value[0].classList.add('active')
      liRef.value[1].classList.remove('active')
      liRef.value[1].classList.add('before')
      activeIndex.value = 0
      playClass.value = 'play'
    } else {
      liRef.value[0].classList.remove('active')
      liRef.value[0].classList.add('before')
      liRef.value[1].classList.remove('before')
      liRef.value[1].classList.add('active')
      activeIndex.value = 1
      playClass.value = 'play'
    }
  }
  // 自由落体动画
}

defineExpose({
  play
})
</script>

<style lang="less" scoped>
.flipper {
  --f-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
  --f-bg: rgba(0, 0, 0, 0.4);
  --f-up-shadow: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 1) 100%);
  --f-down-shadow: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 100%);
  --f-color: #ccc;
  * {
    box-sizing: border-box;
  }
}
ul {
  list-style: none;
}

.flipper {
  text-align: center;
  position: relative;
  display: inline-flex;
}

ul.flip {
  position: relative;
  float: left;
  margin: 5px;
  width: 60px;
  height: 90px;
  font-size: 80px;
  font-weight: bold;
  line-height: 87px;
  border-radius: 6px;
  box-shadow: var(--f-box-shadow);
  overflow: hidden;
}

ul.flip li {
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

ul.flip li:first-child {
  z-index: 2;
}

ul.flip li .a {
  display: block;
  height: 100%;
  perspective: 180px;
}

ul.flip li .a div {
  z-index: 1;
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
}

ul.flip li .a div .shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0;
}

ul.flip li .a div.up {
  transform-origin: 50% 100%;
  top: 0;
}

ul.flip li .a div.up:after {
  content: '';
  position: absolute;
  top: 44px;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 3px;
  background: var(--f-bg);
}

ul.flip li .a div.down {
  transform-origin: 50% 0%;
  bottom: 0;
}

ul.flip li .a div div.inn {
  position: absolute;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 200%;
  color: var(--f-color);
  text-shadow: 0 1px 2px #000;
  text-align: center;
  background-color: #333;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 6px;
}

ul.flip li .a div.up div.inn {
  top: 0;
}

ul.flip li .a div.down div.inn {
  bottom: 0;
}

/* PLAY */

.flipper.play ul li.before {
  z-index: 3;
}

.flipper.play ul li.active {
  animation: asd 0.5s 0.5s linear both;
  z-index: 2;
}

@keyframes asd {
  0% {
    z-index: 2;
  }
  5% {
    z-index: 4;
  }
  100% {
    z-index: 4;
  }
}

.flipper.play ul li.active .down {
  z-index: 2;
  animation: turn 0.5s 0.5s linear both;
}

@keyframes turn {
  0% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}

.flipper.play ul li.before .up {
  z-index: 2;
  animation: turn2 0.5s linear both;
}

@keyframes turn2 {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-90deg);
  }
}

/* SHADOW */

.flipper.play ul li.before .up .shadow {
  background: var(--f-up-shadow);
  animation: show 0.5s linear both;
}

.flipper.play ul li.active .up .shadow {
  background: var(--f-up-shadow);
  animation: hide 0.5s 0.3s linear both;
}

/*DOWN*/

.flipper.play ul li.before .down .shadow {
  background: var(--f-down-shadow);
  animation: show 0.5s linear both;
}

.flipper.play ul li.active .down .shadow {
  background: var(--f-down-shadow);
  animation: hide 0.5s 0.3s linear both;
}

@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes hide {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
