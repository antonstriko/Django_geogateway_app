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
        <div v-if="layers !== ''">
            <div v-for="entry in layers" :key="entry.name">
                <input type="checkbox" v-model="entry.active" @change="kmlLayerChange(entry)"> <span class="checkbox-label" @click="entry.extended = true">{{entry.uid}}</span> <br>
            </div>
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
              uavsarQueries: [],
              layers: [],


          }
        },
        mounted() {
            bus.$on('markPlace', (lat, lon) =>
                this.pointQuery(lat, lon));
            bus.$on('uavsarGeom', (json) =>
                this.uavsarKML(json));

            bus.$on('assignKmls', (kml) =>
                this.assignKmls(kml));
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
                    bus.$emit('uavsarGeom', queryResponse)
                })
            },
            kmlLayerChange(entry){
                if(entry.active) {
                    bus.$emit('reactivateUavsarLayer', entry.name);
                }else {
                    bus.$emit('removeUavsarLayer', entry.name)
                }
            },
            uavsarKML(json){
                var baseURI = 'http://127.0.0.1:8000/geogateway_django_app/UAVSAR_KML/'
                var results = [];
                for(var i = 0; i < json.length; i++) {
                    var dataname = json[i]['dataname'];
                    var uid = json[i]['uid']
                    results[i] = {name:dataname, active:true, uid:uid, extended:false};
                    axios.get(baseURI, {
                        params: {
                            //
                            "json": JSON.stringify(json[i]),
                        }
                    }).then(function (response) {

                        var kml = response.data
                        console.log(kml)
                        bus.$emit('assignKmls', kml)
                    })
                }
                this.uavsarQueries = results;
            },
            assignKmls(kml){
                var entry = this.uavsarQueries.shift()
                this.layers.push(entry)
                bus.$emit('uavsarKMLs', kml, entry)
            }
        }
    }
</script>

<style scoped>

</style>