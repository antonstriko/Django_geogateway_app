<template>
<div>
     <b-form-group label="Using sub-components:">
      <b-form-checkbox-group id="checkbox-group-2" v-model="selected" name="flavour-2">
        <b-form-checkbox value="ucerf" v-on:change="layers[0].active=!(layers[0].active)"><p>UCERF3 Faults</p></b-form-checkbox>
        <b-form-checkbox value="kml"><p>KML Mapper</p></b-form-checkbox>
        <b-form-checkbox value="states"><p>Show State Boundaries</p></b-form-checkbox>
        <b-form-checkbox value="coasts"><p>Show Coastlines</p></b-form-checkbox>
      </b-form-checkbox-group>
    </b-form-group>
</div>
</template>

<script>
    export default {
        name: "MapTools",
        data() {
            return {
                selected: [],
            }
        },
        methods: {

        },
        computed: {
            layers(){
                return this.$store.state.layers;
            }
        }

    }
</script>

<style scoped>
 p {
     color: #cccccc;
 }
</style>