<template>
    <div id="tabs">
        <b-tabs pills card>
            <b-tab title="Map Tools" active><b-card-text id="map-tools" class="tab-text">
                <MapTools />
            </b-card-text></b-tab>
            <b-tab title="UAVSAR">
                <UAVSAR />
            </b-tab>
            <b-tab title="GNSS"><b-card-text class="tab-text">
                <GNSS />
            </b-card-text></b-tab>
            <b-tab title="Seismicity"><b-card-text>
                <Seismicity />
            </b-card-text></b-tab>
            <b-tab title="Forecast"><b-card-text>
                <Nowcast />
            </b-card-text></b-tab>
            <b-tab title="Magnitude"><b-card-text>
                <MMCalc/>
            </b-card-text></b-tab>
            <b-tab title="Disloc"><b-card-text>
                <Disloc />
            </b-card-text></b-tab>
            <b-tab title="Saves"><b-card-text>
                <Saves />
            </b-card-text></b-tab>
            <b-tab title="Help"><b-card-text>Tab contents 3</b-card-text></b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import MapTools from "./MapTools";
    import GNSS from './GNSS'
    import MMCalc from "./MMCalc";
    import Nowcast from "./Nowcast";
    import Seismicity from "./Seismicity";
    import Disloc from "./Disloc";
    import Saves  from "./Saves";
    import UAVSAR from "./UAVSAR";
    export default {
        name: "ToolTabs",
        components: {
            MapTools,
            GNSS,
            MMCalc,
            Nowcast,
            Seismicity,
            Disloc,
            Saves,
            UAVSAR


        }
    }
</script>

<style scoped>
#tabs {
    width: 500px;
    background-color: #343a40;
}
    .tab-text {
        width: 500px;
        position: relative;
        align-content: center;
        height: calc(100% - 500px);
        overflow: auto;
    }
</style>