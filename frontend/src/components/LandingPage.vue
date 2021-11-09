<template>
<div ref="landingPage" class="container-fluid m=0 p=0 scrollable">
    
    <div id="homePage" class=" align-items-center" >
            <div class="row">
                <div class="col"> <img id="logo" src="../assets/logo.png" alt="GeoGateway Logo"> </div>
                <div class="col"> <b-button class="title-btn" @click="scrollTo('features')">Features</b-button></div>
                <div class="col"> <b-button class="title-btn" @click="scrollTo('userRes')">User Resources</b-button></div>
                <div class="col"> <b-button class="title-btn" @click="scrollTo('publications')">Publications</b-button></div>
                <div class="col"> <b-button class="title-btn" @click="scrollTo('contributors')">Contributors</b-button></div>
                <div class="col"> <b-button class="title-btn" @click="scrollTo('dataAttr')">Data Attribution</b-button></div>
            </div>
            <br><br><br><br><br><br><br><br><br><br>
            <h1 class="title align-items-center">
                GeoGateway
            </h1>
            
            <h3 class="title">
                A search and analysis gateway to geodetic imaging data for scientific discovery, 
            field use and disaster response
            </h3>
            <br>
            <b-button class="geogateway-button" @click="goToMap('/maptools')">Go to GeoGateway</b-button>
            <br><br><br><br><br><br><br><br>
    </div>


    <div id="features" ref="features">
        <span class="section-head">Features</span>
        <br>
        <span class="section">Tools for Analysis, Modeling and Response </span>
        <br><br><br>
        <div>
            <div class="row">
                <div class="col">
                    <h3>Map Tools</h3>
                    <p>Map tools are integrated from different sources/references</p>
                    <b-button class="btn btn-circle" @click="goToMap('/maptools')">
                        <i class="fas fa-map"></i>
                    </b-button>
                </div>
                <div class="col">
                    <h3>UAVSAR</h3>
                    <p>UAVSAR is an airborne, L-band, fully polarimetric radar, mounted 
                    to the belly of a piloted Gulfstream III aircraft</p>
                    <b-button class="btn btn-circle" @click="goToMap('/uavsar')">
                        <i class="fas fa-map"></i>
                    </b-button>
                </div>
                <div class="col">
                    <h3>GNSS</h3>
                    <p>Global Navigation Satellite System (GNSS) is any satellite 
                    constellation which provides positioning</p>
                    <b-button class="btn btn-circle" @click="goToMap('/gnss')">
                        <i class="fas fa-map"></i>
                    </b-button>
                </div>
            </div>
            <br><br>
            <div class="row">
                <div class="col">
                    <h3>Seismicity</h3>
                    <p>The seismicity tab allows users to display earthquakes in a region over a specified period.</p>
                    <b-button class="btn btn-circle" @click="goToMap('/seismicity')">
                        <i class="fas fa-map"></i>
                    </b-button>
                </div>
                <div class="col">
                    <h3>Nowcast</h3>
                    <p>GeoGateway’s Nowcast tab consists of useful tools to evaluate earthquake hazard</p>
                    <b-button class="btn btn-circle" @click="goToMap('/nowcast')">
                        <i class="fas fa-map"></i>
                    </b-button>
                </div>
                <div class="col">
                    <h3>Magnitude</h3>
                    <p>Magnitude is the physical size of an earthquake. </p>
                    <b-button class="btn btn-circle" @click="goToMap('/momentmagnitude')">
                        <i class="fas fa-map"></i>
                    </b-button>
                </div>
            </div>
            <br><br><br>
            <div class="row">
                <div class="col">
                    <b-button class="geogateway-button" @click="goToMap('/maptools')">Go to GeoGateway</b-button>
                </div>
            </div>
        </div>
        <br><br><br><br><br>
    </div>


    <div id="userRes" ref="userRes" class="">
        <span class="section-head">User Resources</span><br>
        <span class="section">Learn how to use GeoGateway</span>
        <div class="row">
            <div class="col">
                <img id="userGuide" src="../assets/userGuide.png" alt="User Guide"> 
                <p>User Guide</p>
                <span>The user guide has detailed information on all our map tools</span>
            </div>
            <div class="col">
                <img id="tutorials" src="../assets/tutorials.png" alt="Tutorials"> 
                <p>Tutorials</p>
                <span>Watch tutorials to understand how to use GeoGateway</span>
            </div>
            <div class="col">
                <img id="exercises" src="../assets/exercises.png" alt="Excersies"> 
                <p>Excersies</p>
                <span>Our thoughtfully designed exercies let you master GeoGateway</span>
            </div>
        </div>
        <br><br><br><br><br>
    </div>


    <div id="publications" ref="publications">
        <div class="row">
            <div class="col">
                <span class="section-head">Publication</span><br>
                <span class="section">See how GeoGateway is being used</span>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <span>Earth Science Informatics (2021)</span><br>
                <!--TODO: fix links-->
                <a class="pub-link">Improving access to geodetic imaging crustal deformation data using GeoGateway</a><br>
                <span>Donnellan, A., Parker, J., Heflin, M. et al.</span>
            </div>

            <div class="col">
                <span>Earth and Space Science (2020)</span><br>
                <a >Automated Estimation and Tools to Extract Positions, Velocities, Breaks...</a><br>
                <span>Heflin, M., Donnellan, A., Parker, J. et al.</span>
            </div>

            <div class="col">
                <span>Earth and Space Science (2021)</span><br>
                <a class="pub-link">Buried Aseismic Slip and Off‐Fault Deformation on the Southernmost San Andreas...</a><br>
                <span>Donnellan, A., Parker, J., Heflin, M. et al.</span>
            </div>

        </div>
        <br><br><br><br><br>
    </div>


<!--
    <div id="contributors" ref="contributors">
        <span class="section-head">Contributors</span><br>
        <span class="section">The team behind GeoGateway</span>
        <br><br><br><br><br>
    </div>

-->

    <div id="dataAttr" ref="dataAttr" >
        <span class="section-head">Data Data Attribution</span><br>
        <span class="section">We integrate map data from different sources</span>
    <br><br><br>
        <div class="row">
            <b-table class="tbl" striped hover :items="items" :fields="fields">
                <template slot=cell(source) slot-scope="data">
                     <a :href="data.item.link" target="_blank" rel="noreferrer noopener">{{data.item.text}}</a>
                </template>
            </b-table>
        </div>
        <br><br><br><br><br>
    </div>



    <div id="footer">
    </div>

</div>
</template>

<script>
import {bus} from '../main';
export default {
  name: "LandingPage",
  data() {
      return {
          fields: [
          {
            key: 'tool',
            name: 'Tool'
          },
          {
            key: 'source',
            name: 'Data Source / Reference'
          }
        ],
        items: [
          { tool: 'UCERF3 faults', text: 'USGS Open-File Report 2013–1165', link: 'https://pubs.usgs.gov/of/2013/1165/'},
          { tool: 'USGS Quarternary faults', text: 'https://doi.org/10.5066/F7S75FJM', link: 'https://doi.org/10.5066/F7S75FJM'},
          { tool: 'Show state boundaries', text: 'Cartographic Boundary shapefiles', link: 'https://www.census.gov/geographies/mapping-files/2010/geo/carto-boundary-file.html'},
          { tool: 'Show coastlines', text: 'Natural Earth Data', link: 'https://www.naturalearthdata.com/'},
          { tool: 'UAVSAR', text: 'Alaska Satellite Facility - ASF, Donnellan et al. 2010', link: 'https://asf.alaska.edu/'},
          { tool: 'GNSS', text: 'GPS.gov, Heflin et al. 2020', link: 'https://www.gps.gov/systems/gnss/'},
        ]
      }
    },
  methods:{
    scrollTo(section){
        var element = this.$refs[section];
        var top = element.offsetTop;
        this.$refs.landingPage.scrollTo(0, top);
    },
    goToMap(feature){
        bus.$emit('switchPage', feature);
    },
  },

}

</script>
<style>
#homePage{
    color: #FFFFFF;
    background: url('../assets/AdobeStock_288622149.png') no-repeat center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;   
}
#features{
    padding:50px;
}
#userRes{
    backgroundColor: #F9FAFC;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}
#footer{
    backgroundColor: black;
}
.title{
    color: #FFFFFF;
}
.title-btn{
    background-color: transparent !important;
    border-color:  transparent !important;
    color: #FFFFFF;
}
.geogateway-button{
    color: #FFFFFF;
    background-color: #007BFE;
    border-color: #007BFE;
}
.full-height{
    min-height: 100vh;
    min-width: 100vw;
}
.scrollable{
    height: 100%;
    overflow-y: scroll;

}

.btn-circle{
    width: 70px;
    height: 70px;
    padding: 10px 16px;
    border-radius: 35px;
    font-size: 24px;
    line-height: 1.33;
    background: #007bfe;
    opacity: 0.1;

}

.section-head{
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 33px;
    text-align: center;
    color: #858585;
}

.section{
    font-style: normal;
    font-weight: 600;
    font-size: 40px;
    line-height: 70px;
    /* or 175% */
    text-align: center;
    color: #202020;
}

#publications a.active{
    color: #007BFE;
    text-decoration:none;
}
.tbl{
    width: 75%;
    margin: auto;
}

</style>
