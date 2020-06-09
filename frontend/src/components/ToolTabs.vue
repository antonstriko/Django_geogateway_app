<template>
    <div id="tabs">
        <b-tabs pills card >
            <b-tab title="Map Tools" active><b-card-text id="map-tools" class="tab-text">
                <MapTools />
            </b-card-text></b-tab>
            <b-tab title="UAVSAR"><b-card-text>Tab contents 2</b-card-text></b-tab>
            <b-tab title="GNSS"><b-card-text class="tab-text">
                <GNSS />
            </b-card-text></b-tab>
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
    import GNSS from './GNSS'
    export default {
        name: "ToolTabs",
        components: {
            MapTools,
            GNSS
        }
    }
</script>

<style scoped>

    .tab-text {
        width: 500px;
        position: relative;
        align-content: center;
        height: calc(100% - 500px);
        overflow: auto;
    }
</style>