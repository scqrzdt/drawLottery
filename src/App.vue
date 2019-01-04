<template>
  <div id="app">
    <Canvas />
  </div>
</template>

<script>
  import Canvas from '@/components/Canvas'

  export default {
    name: 'App',
    components: {
      Canvas
    }
  }
</script>

<style>
  * {margin: 0;padding: 0;}
  body {background-color: #880d0c;}
</style>
