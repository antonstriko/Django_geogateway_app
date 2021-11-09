<template>
    <div id="app">
      <router-view name="mainPage"/>
    </div>
</template>

<script>

    import 'vue-router';
    import {bus} from './main';
    export default {
        name: 'app',
        
        mounted(){
            bus.$on('switchPage',  (feature)=>{
                this.$router.push(feature);
            });
        }
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
    .overviewButtonGroup .active {
      color: #fff !important;
      background-color: #3388ff !important;
      border-color: #3388ff !important;

    }

</style>
