<template>
  <!-- 城市列表 -->
  <div class="city_body">
    <div class="city_list">
      <Loading v-if="isLoading" />
      <Scroller v-else ref="city_List">
        <div>
          <!-- 热门城市 -->
          <div class="city_hot">
            <h2>热门城市</h2>
            <ul class="clearfix">
              <li v-for="item in hotList" :key="item.id" @tap="handleToCity(item.nm, item.id)">{{ item.nm }}</li>
            </ul>
          </div>
          <!-- 全部城市 -->
          <div class="city_sort" ref="city_sort">
            <div v-for="(item, index) in cityList" :key="index">
              <h2>{{item.index}}</h2>
              <ul>
                <li v-for="itemList in item.list" :key="itemList.id" @tap="handleToCity(itemList.nm, itemList.id)">{{itemList.nm}}</li>
              </ul>
            </div>
          </div>
        </div>
      </Scroller>
    </div>
    <!-- 字母索引 -->
    <div class="city_index">
      <ul>
        <li
          v-for="(item, index) in cityList"
          :key="item.index"
          @touchstart="handleToIndex(index)"
        >{{ item.index }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "City",
  data() {
    return {
      cityList: [],
      hotList: [],
      isLoading: true
    };
  },
  mounted() {
    //获取本地缓存
    var cityList = window.localStorage.getItem("cityList");
    var hotList = window.localStorage.getItem("hotList");
    if (cityList && hotList) {
      this.cityList = JSON.parse(cityList);
      this.hotList = JSON.parse(hotList);
      this.isLoading = false;
    }

    //请求获取城市数据
    this.axios.get("/api/cityList").then(res => {
      var msg = res.data.msg;
      if (msg === "ok") {
        var cities = res.data.data.cities;
        this.formatCityList(cities); //处理数据
        this.isLoading = false;
        //设置缓存
        window.localStorage.setItem("cityList", JSON.stringify(this.cityList));
        window.localStorage.setItem("hotList", JSON.stringify(this.hotList));
      }
    });
  },

  methods: {
    //处理获取的城市数据
    formatCityList(cities) {
      var cityList = [];
      var hotList = [];

      //处理热门城市数据
      for (var i = 0; i < cities.length; i++) {
        if (cities[i].isHot === 1) {
          hotList.push(cities[i]);
        }
      }

      //处理城市数据
      for (var i = 0; i < cities.length; i++) {
        //获得城市的首个大写字母
        var firstLetter = cities[i].py.substring(0, 1).toUpperCase();
        //根据城市的大写字母分类
        if (toCom(firstLetter)) {
          //新添加index
          cityList.push({
            index: firstLetter,
            list: [{ nm: cities[i].nm, id: cities[i].id }]
          });
        } else {
          //累加到已有index中
          for (var j = 0; j < cityList.length; j++) {
            if (cityList[j].index === firstLetter) {
              cityList[j].list.push({ nm: cities[i].nm, id: cities[i].id });
            }
          }
        }
      }
      //首字母排序
      cityList.sort((n1, n2) => {
        if (n1.index > n2.index) {
          return 1;
        } else if (n1.index < n2.index) {
          return -1;
        } else {
          return 0;
        }
      });
      //判断cityList的大写字母是否已存在
      function toCom(firstLetter) {
        for (var i = 0; i < cityList.length; i++) {
          if (cityList[i].index === firstLetter) {
            return false;
          }
        }
        return true;
      }
      //   return {
      //     cityList,
      //     hotList
      //   };
      this.cityList = cityList;
      this.hotList = hotList;
    },
    //根据首字母跳转
    handleToIndex(index) {
      var h2 = this.$refs.city_sort.getElementsByTagName("h2");
      // this.$refs.city_sort.parentNode.scrollTop = h2[index].offsetTop;

      this.$refs.city_List.toScrollTop(-h2[index].offsetTop);
    },
    //根据id跳转到相应的电影页面
    handleToCity(nm ,id){
      this.$store.commit('city/CITY_INFO', { nm , id});
      window.localStorage.setItem('nowNm', nm);
      window.localStorage.setItem('nowid', id)
      this.$router.push('/movie/nowPlaying')
    }
  }
};
</script>

<style scoped>
#content .city_body {
  display: flex;
  width: 95%;
  overflow: hidden;
  height: 520px;
}
.city_body .city_list {
  flex: 1;
  overflow: auto;
  background: #fff5f0;
}

.city_body .city_list::-webkit-scrollbar {
  background-color: transparent;
  width: 0;
}
.city_body .city_hot {
  margin-top: 20px;
}
.city_body .city_hot h2 {
  padding-left: 15px;
  line-height: 30px;
  font-size: 14px;
  background: #f0f0f0;
  font-weight: normal;
}
.city_body .city_hot ul li {
  float: left;
  background: #fff;
  width: 29%;
  height: 33px;
  margin-top: 15px;
  margin-left: 3%;
  padding: 0 4px;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  line-height: 33px;
  text-align: center;
  box-sizing: border-box;
}
.city_body .city_sort div {
  margin-top: 20px;
}
.city_body .city_sort h2 {
  padding-left: 15px;
  line-height: 30px;
  font-size: 14px;
  background: #f0f0f0;
  font-weight: normal;
}
.city_body .city_sort ul {
  padding-left: 10px;
  margin-top: 10px;
}
.city_body .city_sort ul li {
  line-height: 30px;
  line-height: 30px;
}
.city_body .city_index {
  width: 20px;
  position: fixed;
  top: 120px;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  border-left: 1px #e6e6e6 solid;
}
</style>



