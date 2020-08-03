<template>
    <div>

    </div>
</template>

<script>
    import {bus} from '../main'
    import Dygraph from 'dygraphs'
    export default {
        name: "plots",
        data(){
          return {
              plotActive: false,
          }
        },
        mounted() {

        },
        methods: {

        }
    }
</script>

<style scoped>
 .bottom-plot {
     height: 100px;
     width: 400px;
     z-index: 400;


 }

</style>