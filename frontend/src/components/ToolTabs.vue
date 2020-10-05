<template>
    <div id="tabs">
        <b-tabs pills card >
            <b-tab title="Map Tools" active title-link-class="tab">
                <b-card-text id="map-tools" class="tab-text">
                <MapTools />
            </b-card-text></b-tab>
            <b-tab title="UAVSAR" title-link-class="tab">
                <UAVSAR />
            </b-tab>
            <b-tab title="GNSS" title-link-class="tab"><b-card-text>
                <GNSS />
            </b-card-text></b-tab>
            <b-tab title="Seismicity" title-link-class="tab"><b-card-text>
                <Seismicity />
            </b-card-text></b-tab>
            <b-tab title="Nowcast" title-link-class="tab"><b-card-text>
                <Nowcast />
            </b-card-text></b-tab>
            <b-tab title="Magnitude" title-link-class="tab"><b-card-text>
                <MMCalc/>
            </b-card-text></b-tab>
            <b-tab title="Disloc" title-link-class="tab"><b-card-text>
                <Disloc />
            </b-card-text></b-tab>
            <b-tab title="Saves" title-link-class="tab"><b-card-text>
                <Saves />
            </b-card-text></b-tab>
            <b-tab title="Report a Bug" title-link-class="tab"><b-card-text>
                <report />
            </b-card-text></b-tab>
            <b-tab title="Help" title-link-class="tab"><b-card-text>
                <help />
            </b-card-text></b-tab>
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
    import report from "./report";
    import help from "./help";
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
            UAVSAR,
            report,
            help


        }
    }
</script>

<style >
    #tabs {
        width: auto;
        background-color: #e6e6ff;

    }
    .tab-text {
        width: auto;
        position: relative;
        align-content: center;
        height: 100% ;
        overflow: auto;
    }

    .nav-pills .nav-link.active {
        background-color: #343a40;

    }
    .nav-link.tab {
        color: #343a40;
    }

    label {
        color: #343a40 ;
    }
    p {
        color: #343a40;
    }
</style>
