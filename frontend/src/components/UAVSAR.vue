<template>
    <div>
        <input
                type="checkbox"
                v-model="overview"
                id="overview"
                @click="showOverview"
        ><label for="overview">UAVSAR</label>

        <div v-if="overview">
            <b-input-group prepend="Flight name/path">
                <b-form-input v-model="flight_path" name="flight_path" placeholder=""></b-form-input>
            </b-input-group>
            <b-input-group prepend="Latitude, Longitude">
                <b-form-input v-model="lat_lon" name="lat_lon" placeholder=""></b-form-input>
            </b-input-group>
        </div>
        <div v-if="uavsarQueries !== ''">
            <b-table :sticky-header="true"
                     :no-border-collapse="true"
                     responsive
                     :items="uavsarQueries"
            ></b-table>
        </div>
    </div>
</template>

<script>
    import {bus} from '../main'
    import axios from "axios";
    export default {
        name: "UAVSAR",
        data(){
          return {
              overview: false,
              flight_path: '',
              lat_lon: '',
              uavsarQueries: '',


          }
        },
        mounted() {
            bus.$on('markPlace', (lat, lon) =>
                this.pointQuery(lat, lon));
            bus.$on('uavsarGeom', (json) =>
                this.uavsarKML(json));
        },
        methods: {
            showOverview(){
                // var overviewUrl = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_overview/'
                // axios.get(overviewUrl).then( function(response){
                //     console.log(response.data)
                // })
                bus.$emit('UAVSAR_overview');
                bus.$emit('drawToolbar');
            },
            pointQuery(lat, lon){
                var queryResponse
                this.lat_lon = lat.toString() + ',' + lon.toString();
                var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_geom/'
                axios.get(baseURI, {
                    params: {
                        //
                        "lat": lat,
                        "lon": lon,
                    }
                }).then(function (response){
                    queryResponse = response.data;
                    console.log(queryResponse)
                    bus.$emit('uavsarGeom', queryResponse)
                })
            },
            uavsarKML(json){
                this.uavsarQueries = json;

                var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_KML/'
                console.log(json)
                for(var i = 0; i < json.length; i++) {

                    axios.get(baseURI, {
                        params: {
                            //
                            "json": JSON.stringify(json[i]),
                        }
                    }).then(function (response) {
                        var queryResponse = response.data;
                        console.log(queryResponse)
                        bus.$emit('uavsarKMLs', queryResponse)

                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>