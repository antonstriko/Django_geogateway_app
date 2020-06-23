<template>
    <div id="panel_forecast" style="margin-top: 10px; margin-bottom:10px;">
        <h3>Recent Earthquakes from USGS</h3>
        <hr />
        <p><i>Earthquake magnitude shown by circle size. Hotter colors are more recent events. Click on earthquake markers for event data.</i></p>
        <hr />
        <p><i>Earthquakes are color coded with most recent events in the last day represented by hotter colors, and older events by cooler colors</i></p>
        <hr />
        <fieldset id="group1">
            <input
                    type="radio"
                    v-model="day"
                    @change="showSelected('day')"
                    id="day"
                    name="group1"
            ><label for="day"> M > 1.0, Last Day</label>
            <br/>
            <input
                    type="radio"
                    v-model="week"
                    @change="showSelected('week')"
                    id="week"
                    name="group1"
            ><label for="week"> M > 2.5, Last Week</label>
            <br/>
            <input
                    type="radio"
                    v-model="month"
                    @change="showSelected('month')"
                    id="month"
                    name="group1"
            ><label for="month"> M > 4.5, Last Month</label>
        </fieldset>

        <!--        is this necessary? -->
        <!--        <input-->
        <!--                type="checkbox"-->
        <!--                v-model="showhide"-->
        <!--                @change="showSelected()"-->
        <!--                id="showhide"-->
        <!--        ><label for="showhide"> Show/Hide Selected Earthquakes</label>-->
        <!--        <br/>-->
        <br/>
        <h5>Filter By Magnitude</h5>
        <select class="form-control" v-model="mFilter" id="mFilters" >
            <option value="0" selected>No Filter</option>
            <option value='5'>M > 5</option>
            <option value='6.5'> M > 6.5</option>
        </select>
        <br/>
        <h5>Filter By Depth</h5>
        <select class="form-control" v-model="dFilter" id="dFilters">
            <option value="0">No Filter</option>
            <option value='30'>Depth &#8804; 30km </option>
        </select>
        <hr/>
        <h4>Search Earthquake Catalog</h4>
        <br/>
        <b-input-group prepend="Min Lat">
            <b-form-input v-model="minLat" placeholder="1 degree" name="minLat" value="32.0"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Min Lon">
            <b-form-input v-model="minLon" placeholder="1 degree" name="minLon" value="-130.0"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Max Lat">
            <b-form-input v-model="maxLat" placeholder="1 degree" name="maxLat" ></b-form-input>
        </b-input-group>
        <b-input-group prepend="Max Lon">
            <b-form-input v-model="maxLon" placeholder="1 degree" name="maxLon"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Starting Date">
            <b-form-input v-model="startDate" placeholder="1 degree" name="startD"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Starting Time">
            <b-form-input v-model="startTime" placeholder="1 degree" name="startT"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Ending Date">
            <b-form-input v-model="endDate" placeholder="1 degree" name="endDate"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Ending Time">
            <b-form-input v-model="endTime" placeholder="1 degree" name="endTime"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Minimum Magnitude">
            <b-form-input v-model="minMag" placeholder="1 degree" name="minMag"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Maximum Magnitude">
            <b-form-input v-model="maxMag" placeholder="1 degree" name="maxMag"></b-form-input>
        </b-input-group>
        <b-input-group prepend="Icon Display Scale">
            <b-form-input v-model="iconScale" placeholder="1 degree" name="iconScale"></b-form-input>
        </b-input-group>
        <br/>
        <button  class="btn btn-success" id="gs_submit" name="submit" type="submit" v-on:click.prevent="runSeismicity()">Search Catalog
        </button>
    </div>
</template>

<script>
    import axios from "axios";
    import {bus} from '../main'
    import 'leaflet-ajax';
    export default {
        name: "seismicity",
        data() {
            return {
                day: false,
                week: false,
                month: false,
                mFilter: '',
                dFilter: '',
                minLat: '32.0',
                minLon: '-130.0',
                maxLat: '35.0',
                maxLon: '-110.0',
                startDate: '2020-05-24',
                startTime: '00:00:00',
                endDate: '2020-06-23',
                endTime: '00:00:00',
                minMag: '3.0',
                maxMag: '10.0',
                iconScale: '1',
            }
        },
        methods: {
            showSelected(time) {
                var dFilter = this.dFilter;
                var mFilter = this.mFilter;
                var timeUrl;
                switch (time) {
                    case 'day':
                        timeUrl = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson'
                        break;
                    case 'week':
                        timeUrl = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'
                        break;
                    case 'month':
                        timeUrl = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson'
                        break;
                }
                axios.get(timeUrl).then(function(response){
                    bus.$emit('filterCat', response.data, dFilter, mFilter)
                })
            },
            runSeismicity(){
                var urlBase="https://earthquake.usgs.gov/fdsnws/event/1/query?";
                axios.get(urlBase, {
                    params: {
                        "format": "geojson",
                        "starttime": this.startDate + 'T' + this.startTime,
                        "endtime": this.endDate + 'T' + this.endTime,
                        "minmagnitude": this.minMag,
                        "maxmagnitude": this.maxMag,
                        "minlatitude": this.minLat,
                        "maxlatitude": this.maxLat,
                        "minlongitude": this.minLon,
                        "maxlongitude": this.maxLon,
                    }
                }).then(function (response){
                    console.log(response.data)
                    bus.$emit('searchCat', response.data)

                })
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