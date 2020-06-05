<template>
    <div id="tabs">
        <b-tabs pills card >
            <b-tab title="Map Tools" active><b-card-text id="map-tools">
                <MapTools />
            </b-card-text></b-tab>
            <b-tab title="UAVSAR"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="GPS"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Seismicity"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Forecast"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Magnitude"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Disloc"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="3D Imaging"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Special Studies"><b-card-text>Tab contents 3</b-card-text></b-tab>
            <b-tab title="Help"><b-card-text>Tab contents 3</b-card-text></b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import MapTools from "./MapTools";
    export default {
        name: "ToolTabs",
        components: {
            MapTools
        }
    }
</script>

<style scoped>
#tabs{
    height: 1000px;

}
</style>