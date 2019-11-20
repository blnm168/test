<template>
  <div id="app">
    <img alt="Vue logo"
         src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <button @click="set()">set</button>
    <button @click="news()">news</button>
    <button>logout</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import {getUserInfo} from './utils/util'
export default {
  name: 'app',
  components: {
    HelloWorld
  },
  methods: {
    set () {
      this.axios.get('http://192.168.0.121:3000/set')
        .then(function (response) {
          console.log(response);

        })
        .catch(function (error) {
          console.log(error);
        });

    },
    news () {
      this.axios.get('http://192.168.0.121:3000/news')
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  created(){
      getUserInfo()
  }
  
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
