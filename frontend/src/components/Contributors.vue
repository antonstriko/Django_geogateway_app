<template>

<div id="contributors">
       
            <div class="row">

            <div class="col">
                <b-button class="btn btn-circle" @click="scroll(1)">
                        <i class="fas fa-angle-left"></i>
                    </b-button>
            </div>

            <div class="col">
                <img :src="getImgUrl(0)"><br>
                <span class="name">
                    {{getName(0)}}
                </span><br>
                <span class="title">
                    {{getTitle(0)}}
                </span>
            </div>


            <div class="col">
                <img :src="getImgUrl(1)"><br>
                <span class="name">
                    {{getName(1)}}
                </span><br>
                <span class="title">
                    {{getTitle(1)}}
                </span>
            </div>


            <div class="col">
                <img :src="getImgUrl(2)"><br>
                <span class="name">
                    {{getName(2)}}
                </span><br>
                <span class="title">
                    {{getTitle(2)}}
                </span>
            </div>


            <div class="col">
                <img :src="getImgUrl(3)"><br>
                <span class="name">
                    {{getName(3)}}
                </span><br>
                <span class="title">
                    {{getTitle(3)}}
                </span>
            </div>

            <div class="col">
                <b-button class="btn btn-circle" @click="scroll(-1)">
                        <i class="fas fa-angle-right"></i>
                    </b-button>
            </div>

        </div>

</div>
</template>

<script>
export default {
    name: 'Contributors',
    data() {
      return {
          imageIndex: 0,
          images: ["Ellipse1", "Ellipse2", "Ellipse3", "Ellipse4"],
          names: ["Andrea Donnellan", "Robert Granat", "Jay Parker", "Marlon Pierce"],
          titles: ["Principal Investigator", "Co-Investigator", "Co-Investigator", "Co-Investigator"],
      }
    },
    methods:{
        getImgUrl(index){
            var image = require.context('../assets/', false, /\.png$/)
            return image('./' + 
                    this.images[(index+this.imageIndex)%this.images.length] + 
                    ".png");
        },
        getName(index){
            console.log(this.imageIndex);
            console.log((index+this.imageIndex)%this.names.length);
            console.log(this.names[(index+this.imageIndex)%this.names.length]);
            return this.names[(index+this.imageIndex)%this.names.length];
        },
        getTitle(index){
            return this.titles[(index+this.imageIndex)%this.titles.length];
        },
        scroll(dir){
            this.imageIndex+=dir;
            if (this.imageIndex<0){
                this.imageIndex = this.images.length-1;
            }
        }
    }        
}
</script>

<style scoped>
    #contributors{
        padding-left:100px;
        padding-right:100px;
    }
    .name{
        font-style: normal;
        font-weight: bold;
        font-size: 25px;
        line-height: 34px;
        text-align: center;
        color: #000000;
    }
    .title{
        font-style: normal;
        font-weight: normal;
        font-size: 20px;
        line-height: 27px;
        text-align: center;
        color: #858585;
    }
</style>