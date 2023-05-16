#!/usr/bin/env zx
/* eslint-disable  */

/**
 * * 自动升级版本号并打标签 *
 * 相当于修改package.json里面version字段值，然后git commit -m 'xxx'，再git tag -a ${version}
 * */

// https://github.com/google/zx
import 'zx/globals'
const filename = './package.json'
const { version } = require(filename)
const prompts = require('prompts')

console.log(chalk.blue('Long long ago, there is a tiger.'))
console.log('Current version: ' + version)
;(async () => {
// next version
const [major, minor, patch] = version.split('.')
const nextMajor = String(Number(major) + 1) + '.0.0'
const nextMinor = major + '.' + String(Number(minor) + 1) + '.0'
const nextPatch = major + '.' + minor + '.' + String(Number(patch) + 1)

// remotes
const remotes = await $`git remote -v`;
const uniqueRemotes = [...new Set(remotes.stdout.split('\n').map(v=>{
  return v.split('\t')[0]
}).filter(Boolean))];

let questions = [
  {
    type: 'text',
    name: 'dish',
    message: 'Would you like some cocktail? ',
  },
  {
    type: 'select',
    name: 'version',
    message: 'Which part do you want to bump? ',
    choices: [
      { title: 'patch: ' + nextPatch, value: nextPatch },
      { title: 'minor: ' + nextMinor, value: nextMinor },
      { title: 'major: ' + nextMajor, value: nextMajor },
    ],
  },
  {
    type: prev => prev && 'confirm',
    name: 'commit',
    message: '是否执行git commit提交代码？',
    initial: true,
  },
  {
    type: prev => prev && 'text',
    name: 'message',
    message: "git commit的内容(留空则使用'Bump version')：",
  },
  {
    type: prev => (prev || prev === '') && 'confirm',
    name: 'tag',
    message: '是否执行git tag打标签？',
    initial: true,
  },
]

if (uniqueRemotes.length > 1) {
  questions = [
    ...questions,
    {
      type: 'select',
      name: 'remote',
      message: 'Which remote do you want to push? ',
      choices: uniqueRemotes.map(v => {
        return { title: v, value: v }
      }),
    },
  ]
}
const response = await prompts(questions)
const newVersion = response.version
if (newVersion) {
  const data = await fs.readFile(filename)
  const content = String(data).replace(`"version": "${version}"`, `"version": "${newVersion}"`)
  await fs.writeFile(filename, content)
  console.log(chalk.green('`package.json` updated!'))
}
if (response.commit) {
  let message = response.message
  await $`npm run changelog`
  if (message === '') {
    message = `Bump version: ${version} → ${newVersion}`
  }
  if (message) {
    // console.log(`git add . && git commit -m '${message}'`)
    await $`git add . && git commit -m ${message}`
    if (response.tag) {
      const tag = 'v' + newVersion
      await $`git tag -a ${tag} -m ''`
      if(response.remote){
        await $`git push ${response.remote} && git push ${response.remote} --tags`
        return
      }
      await $`git push && git push --tags`
    }
  } else {
    // message === undefined的情况
    console.log(chalk.yellow('I can see the first leaf falling.'))
  }
}

})()
