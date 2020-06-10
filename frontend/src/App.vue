<template>
    <div id="app">
        <TopNav />

        <MyMap/>
    </div>
</template>

<script>

    import TopNav from "./components/TopNav";
    import MyMap from "./components/MyMap";
    export default {
        name: 'app',
        components: {
            MyMap,
            TopNav,

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
