<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="查询条件">
                <el-select
                    v-model="queryParams.campusId"
                    filterable
                >
                    <el-option 
                        v-for="item in campusList" 
                        :key="item.id"
                        :value="item.id"
                        :label="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.typeId">
                    <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="操作日期">
                <el-date-picker
                    v-model="queryParams.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 创建echarts图标 -->
        <div :id="chartId"></div>
    </div>
</template>
<script>
import * as G2 from '@antv/g2'; 
import { currentTime, typeList } from './config'
import { listCampus } from "@/api/campus/campus";
import { listTbVisiLogAll } from '@/api/statistic/TbVisiLog'

export default {
    data() {
        return {
             queryParams: {
                date: currentTime(),
                campusId: 1,
                typeId: 3
            },
            typeList,
            chartId: 'chart' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''),
            chartData: [
                {
                    week: '2021-12-23',
                    value: 15
                }, 
                {
                    week: '2021-12-24',
                    value: 16
                }, 
                {
                    week: '2021-12-25',
                    value: 15
                }, 
                {
                    week: '2021-12-26',
                    value: 17
                }, 
                {
                    week: '2021-12-27',
                    value: 1
                }
            ],
            campusList: [],
            chart: null,
            chartDraw: true
        }
    },
    created() {
        this.getCampusList();
        this.getBuildData();
    },
    methods: {
        getCampusList() {
            listCampus({
                pageNum: 1,
                pageSize: 10
            }).then(response => {
                response.rows.forEach(item => {
                    this.campusList.push({
                        id: item.campusid,
                        value: item.campusname
                    })
                });

            }).catch(err => {
                this.$message.error('获取数据失败!');
            });
        },
        async getBuildData() {
            let data = {
                startTime: this.queryParams.date[0],
                endTime: this.queryParams.date[1],
                visiType: this.queryParams.typeId,
                campusId: this.queryParams.campusId,
            }
            let listTbVisi = await listTbVisiLogAll(data);
            this.chartData = listTbVisi.data;
            console.log(this.chartData);
            if (this.chartDraw) {
                this.createChart(this.chartData);
            } else {
                this.chart.changeData(this.chartData);
            }
        },

        createChart(data) {
            this.chart = new G2.Chart({
                container: this.chartId,
                height: 500,
                autoFit: true,
                // padding: [50],
                background: {
                    fill: "#fff"
                }
            });
            this.chart.source(data);
            this.chart.scale('value', {
                nice: true,
                min: 0,
                range: [0, 1]
            });

            this.chart.tooltip({
                showCrosshairs: true,
                shared: true,
            });

            this.chart.axis('value', {
                label: {
                    formatter(val) {
                        return (val) + '次';
                    }
                }
            });
            this.chart
                .line()
                .position('week*value')
                .color('poiName')
                .shape('smooth');

            this.chart
                .point()
                .position('week*value')
                .color('poiName')
                .shape('circle')
                .style({
                    stroke: '#fff',
                    lineWidth: 1,
                });
            // this.chart.area().position('week*value');
            // this.chart.line().position('week*value');
            this.chart.render();
            this.chartDraw = false;
        },
        // 查询
        handleQuery() {
            this.getBuildData();
        },
        // 重置
        resetQuery() {

        },
    },
}
</script>
