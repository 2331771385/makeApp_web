<template>
  <div class="app-container home">
    <el-row :gutter="30">
    <el-col :lg="6" :sm="12" v-for="grid in grids" :key="grid.name">
      <div class="dashboard-statistic" :class="grid.backgroundColor" @click="$emit('onChangeType', grid.type)">
        <div class="grid-left">
          <svg-icon :icon-name="grid.icon" icon-class="grid-icon" />
        </div>

        <div class="grid-right">
          <p class="grid-name">{{grid.name}}</p>
          <countTo class="grid-number" :startVal="0" :endVal="grid.number" :duration="3000"></countTo>
        </div>
      </div>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import countTo from 'vue-count-to';
export default {
  name: "Index",
  components: { countTo },
  data() {
    return {
      grids: [{
        type: 'visite',
        icon: 'view',
        name: '访问量',
        number: 100,
        backgroundColor: 'grid--red',
      }, {
        type: 'user',
        icon: 'user_filled',
        name: '用户数量',
        number: 3060,
        backgroundColor: 'grid--blue',
      }, {
        type: 'comment',
        icon: 'message',
        name: '评论数量',
        number: 120,
        backgroundColor: 'grid--yellow',
      }]
    };
  },
  methods: {
    
  },
};
</script>

<style scoped lang="scss">
.dashboard-statistic {
    display: flex;
    position: relative;
    height: 108px;
    color: #fff;
    box-shadow: 0px 0px 10px rgba(100, 100, 100, .5);
    cursor: pointer;
    margin-bottom: 20px;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      height: 100%;
      width: 100px;
      background-color: rgba(0, 0, 0, 0.05);
      -webkit-transition: all 0.95s;
      transition: width 0.5s;
    }

    &:hover::before {
      width: 100%;
      box-sizing: border-box;
    }

    .grid-left {
      width: 100px;
      line-height: 108px;
      vertical-align: top;
      text-align: center;

      .grid-icon {
        font-size: 48px;
        vertical-align: middle;
      }
    }

    .grid-right {
      padding: 0 16px;

      p {
        color: #fff !important;
      }

      .grid-name {
        font-size: 20px;
        margin-bottom: 10px;
      }

      .grid-number {
        font-size: 30px;
      }
    }
  }

  .grid {
    &--green {
      background-color: #06d6a0;
    }

    &--yellow {
      background-color: #ffd166;
    }

    &--blue {
      background-color: #06aed5;
    }

    &--red {
      background-color: #ef476f;
    }
  }
</style>

