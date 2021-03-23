<template>
  <div class="map-data">
    <div class="map-data-body">
      <div class="maps">
        <div class="points">
          <div class="item avtive big am" v-for="i in data" :key="i.name" :style="`left:${i.left};top:${i.top}`">
            <span><i></i></span>
            <p>{{i.name}}</p>
            <b class="pb-1"></b>
            <b class="pb-2"></b>
            <b class="pb-3"></b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mapdata',
  data () {
    return {
      data: [
        { name: '北京', left: '662px', top: '270px' },
        { name: '上海', left: '740px', top: '435px' },
        { name: '广东', left: '610px', top: '570px' },
        { name: '四川', left: '486px', top: '440px' },
        { name: '河北', left: '647px', top: '296px' },
        { name: '江苏', left: '718px', top: '400px' },
        { name: '安徽', left: '676px', top: '422px' },
        { name: '浙江', left: '721px', top: '465px' },
        { name: '山东', left: '670px', top: '330px' },
        { name: '徐州', left: '672px', top: '376px' },
        { name: '黑龙江', left: '818px', top: '152px' },
        { name: '甘肃', left: '480px', top: '350px' },
        { name: '湖南', left: '587px', top: '490px' },
        { name: '湖北', left: '602px', top: '435px' },
        { name: '江西', left: '652px', top: '476px' },
        { name: '辽宁', left: '770px', top: '234px' },
        { name: '山西', left: '605px', top: '322px' },
        { name: '内蒙古', left: '556px', top: '252px' },
        { name: '云南', left: '463px', top: '537px' },
        { name: '河南', left: '624px', top: '380px' },
        { name: '福建', left: '680px', top: '520px' },
        { name: '重庆', left: '532px', top: '456px' },
        { name: '陕西', left: '552px', top: '377px' },
        { name: '贵阳', left: '522px', top: '500px' },
        { name: '银川', left: '510px', top: '320px' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.map-data{
  width: 100%;
  height: 960px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  .map-data-body{
    position: relative;
    width: 1300px;
    height: 100%;
    margin: auto;
    background: url('../../assets/map.png') center bottom no-repeat;
    .maps{
      width: 980px;
      height: 620px;
      position: absolute;
      right: 140px;
      bottom: 40px;
      .points{
        display: block;
        position: relative;
        .item{
          z-index: 2;
          padding: 0 0 0 25px;
          height: 18px;
          line-height: 18px;
          position: absolute;
          color: #666;
          font-weight: normal;
          &::after{
            background: #0a99ff;
          }
          span{
            border: 1px solid #0a99ff;
            background: #fff;
            display: block;
            border-radius: 100%;
            width: 16px;
            height: 16px;
            box-sizing: border-box;
            position: absolute;
            z-index: 2;
            left: 0;
            top: calc(50% - 8px);
            i{
              width: 8px;
              height: 8px;
              background: #0a99ff;
              display: inline-block;
              border-radius: 4px;
              margin-bottom: 3px;
            }
          }
          p{
            display: block;
            font-size: 14px;
            line-height: 18px;
            margin-block-start: 0;
          }
          b{
            border: 2px solid #0a99ff;
            position: absolute;
            width: 120px;
            height: 120px;
            box-sizing: border-box;
            display: block;
            border-radius: 100%;
            opacity: 0;
            z-index: 1;
            left: calc(-60px + 8px);
            top: calc(50% - 60px);
          }
          @keyframes rip
          {
            0% {
              transform: scale(0);
              opacity: 0;
              filter: alpha(opacity=0);
            }
            5% {
                opacity: 1;
                filter: alpha(opacity=100);
            }
            100% {
                transform: scale(1);
                opacity: 0;
                filter: alpha(opacity=0);
            }
          }
          .pb-1{
            animation: rip 5s ease-out infinite;
          }
          .pb-2{
            animation: rip 5s ease-out infinite 900ms;
          }
          .pb-3{
            box-shadow: inset 0 0 50px rgba(10, 153, 255, 0.2);
            animation: rip 5s ease-out infinite 900ms;
          }
        }
      }
    }
  }
}
</style>
