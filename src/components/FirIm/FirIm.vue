<template>
  <div class="fir-im">
    <div class="black" v-if="sec<3"></div>
    <div class="cover" v-if="sec>1 && sec<3"></div>
    <div class="center" v-if="sec<2"></div>
    <div class="plane">
      <img class="planeImg" src="../../assets/plane.svg">
      <div class="rotate">
        <img class="rotateImg" src="../../assets/propeller.svg">
      </div>
    </div>
    <div class="title">Miss L</div>
    <div class="text">
      <pre class="textCon"><span v-show="count > 0">向</span><span v-show="count > 1">你</span><span v-show="count > 2">发</span><span v-show="count > 3">射</span><span v-show="count > 4">(</span><span v-show="count > 5">)</span>
      <br><span v-show="count > 6">{</span>
      <span v-show="count > 7">return </span><span v-show="count> 8" class="heart"> ❤</span>
      <br><span v-show="count > 9">}</span><br>
      </pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FirIm',
  data () {
    return {
      count: 0,
      sec: 0
    }
  },
  created () {
    setInterval(() => {
      this.sec++
    }, 1000)
    setInterval(() => {
      setInterval(() => {
        this.count++
      }, 150)
    }, 3500)
  }
}
</script>

<style lang="scss" scoped>
.fir-im{
  background-image: linear-gradient(#ffd200, #ffd200);
  height: 100vh;
  .black{
    display: inline-block;
    width: 100%;
    height: 100%;
    background: #000;
  }
  .cover{
    display: inline-block;
    width: 200%;
    height: 200%;
    position: absolute;
    top: -50%;
    left: -50%;
    border-radius: 50%;
    background-image: linear-gradient(#ffd200, #ffd200);
    animation: cover 2.5s;
  }
  @keyframes cover {
    from {
      transform: scale(0.01);
      -webkit-transform: scale(0.01);
    }
    to{
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
  .center{
    width: 280px;
    height: 210px;
    display: inline-block;
    background: url('../../assets/dong.gif');
    position: absolute;
    left: calc(50% - 150px);
    top: 0;
    animation: center 0.7s infinite alternate;
    @keyframes center{
      from{ margin-top: 400px;}
      to{margin-top: 410px;}
    }
  }
  .plane{
    width: 680px;
    display: inline-block;
    transition: all .5s;
    animation: plane 3.5s;
    perspective: 2500px;
    position: absolute;
    left: calc(50% - 250px);
    top: 50%;
    margin-top: -170px;
    @keyframes plane {
      0%{left: 100%}
      80%{left: 100%}
      100%{left: calc(50% - 250px)}
    }
    .planeImg{
      animation: planeImg 3s linear infinite alternate;
      @keyframes planeImg {
        from{ margin-top: -10px;}
        to{margin-top: 20px;}
      }
    }
    .rotate{
      position: absolute;
      top: 51.7003%;
      left: 18.1%;
      display: inline-block;
      width: 27.424%;
      height: 14.4474%;
      transform-origin: center center;
      animation: rotating .2s linear infinite reverse;
      .rotateImg{
        width: 100%;
        transform: rotateY(-28deg);
      }
    }
  }
  .title{
    position: absolute;
    top: 50px;
    left: 50px;
    font-size: 30px;
    color: #000;
    font-weight: bold;
  }
  .text{
    position: absolute;
    bottom: 0;
    left: 50px;
    text-align: left;
    font-size: 23px;
    font-weight: bold;
    color: black;
    .textCon{
    .heart{
      position: absolute;
      top: 98px;
      animation: heart 1.5s linear infinite reverse;
      @keyframes heart {
        form{font-size: 20px;}
        to{font-size: 27px;}
      }
    }
    }
  }
}
</style>
