<template>
    <div id="panel_forecast" style="margin-top: 10px; margin-bottom:10px;">
        <h3>Recent Earthquakes from USGS</h3>
        <hr />
        <p><i>Earthquake magnitude shown by circle size. Hotter colors are more recent events. Click on earthquake markers for event data.</i></p>
        <hr />
        <p><i>Earthquakes are color coded with most recent events in the last day represented by hotter colors, and older events by cooler colors</i></p>
        <hr />
        <input
                type="checkbox"
                v-model="day"
                @change="showDay()"
                id="day"
        ><label for="day"> M > 1.0, Last Day</label>
        <br/>
        <input
                type="checkbox"
                v-model="week"
                @change="showWeek()"
                id="week"
        ><label for="week"> M > 2.5, Last Week</label>
        <br/>
        <input
                type="checkbox"
                v-model="month"
                @change="showMonth()"
                id="month"
        ><label for="month"> M > 4.5, Last Month</label>
        <br/>
        <hr/>
        <input
                type="checkbox"
                v-model="showhide"
                @change="showSelected()"
                id="showhide"
        ><label for="showhide"> Show/Hide Selected Earthquakes</label>
        <br/>
    </div>
</template>

<script>
    export default {
        name: "seismicity",
        data(){
            return {
                day: false,

            }
        },
        methods: {
            showDay(){

            }
        }
    }
</script>

<style scoped>
    i {
        color: #2e6da4;
    }
    label {
        font-weight: bold;
    }

</style>