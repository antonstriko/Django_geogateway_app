<template>
    <div id="app">
        <MyMap/>
    </div>
</template>

<script>

    import MyMap from "./components/MyMap";
    export default {
        name: 'app',
        components: {
            MyMap,
        },
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 100%;
    }
    .toolInfo {
      width: auto;
      height: auto;
      border: 2px solid #3388ff;
      box-sizing: border-box;
      border-radius: 8px;
      background-color: #bad7ff;
    }
</style>
