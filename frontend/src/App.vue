<template>
    <div id="app">
        <TopNav />
        <ToolBar />
        <MyMap />
    </div>
</template>

<script>

    import MyMap from './components/map'
    import TopNav from "./components/TopNav";
    import ToolBar from "./components/ToolBar";
    export default {
        name: 'app',
        components: {
            MyMap,
            TopNav,
            ToolBar
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
</style>
