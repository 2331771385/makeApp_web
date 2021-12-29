<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="查询条件">
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
import { currentTime } from './config'
import { listTbVisiLogAll } from '@/api/statistic/TbVisiLog'

export default {
    data() {
        return {
            chartId: 'chart' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''),
            chartData: [
                { campusName: 'Asia', week: '1750', value: 502, id: 1 },
                { campusName: 'Asia', week: '1800', value: 635 , id: 1},
                { campusName: 'Asia', week: '1850', value: 809, id: 1 },
                { campusName: 'Asia', week: '1900', value: 5268 , id: 1},
                { campusName: 'Asia', week: '1950', value: 4400, id: 1 },
                // { campusName: 'Asia', week: '1999', value: 3634, id: 1 },
                // { campusName: 'Asia', week: '2050', value: 947, id: 1 },
                // { campusName: 'Africa', week: '1750', value: 106, id: 1 },
                { campusName: 'Africa', week: '1800', value: 107, id: 1 },
                { campusName: 'Africa', week: '1850', value: 111, id: 1 },
                { campusName: 'Africa', week: '1900', value: 1766 , id: 1},
                { campusName: 'Africa', week: '1950', value: 221, id: 1 },
                { campusName: 'Africa', week: '1999', value: 767, id: 1 },
                { campusName: 'Africa', week: '2050', value: 133, id: 1 },
                { campusName: 'Europe', week: '1750', value: 163, id: 1 },
                { campusName: 'Europe', week: '1800', value: 203, id: 1 },
                { campusName: 'Europe', week: '1850', value: 276, id: 1 },
                // { campusName: 'Europe', week: '1900', value: 628 , id: 1},
                // { campusName: 'Europe', week: '1950', value: 547, id: 1 },
                { campusName: 'Europe', week: '1999', value: 729, id: 1 },
                { campusName: 'Europe', week: '2050', value: 408, id: 1 },
                { campusName: 'Oceania', week: '1750', value: 200, id: 1 },
                { campusName: 'Oceania', week: '1800', value: 200, id: 1 },
                { campusName: 'Oceania', week: '1850', value: 200, id: 1 },
                { campusName: 'Oceania', week: '1900', value: 460, id: 1 },
                { campusName: 'Oceania', week: '1950', value: 230, id: 1 },
                { campusName: 'Oceania', week: '1999', value: 300, id: 1 },
                { campusName: 'Oceania', week: '2050', value: 300, id: 1 },
            ],
            queryParams: {
                date: currentTime()
            },
            campusList: [
                {
                    id: 1,
                    value: '中心校区'
                },
                {
                    id: 2,
                    value: '洪家楼校区'
                },
                {
                    id: 3,
                    value: '千佛山校区'
                },
                {
                    id: 4,
                    value: '趵突泉校区'
                },
                {
                    id: 5,
                    value: '兴隆山校区'
                },
                {
                    id: 6,
                    value: '软件园校区'
                },
                {
                    id: 7,
                    value: '威海校区'
                },
                {
                    id: 8,
                    value: '青岛校区'
                }
            ]
        }
    },
    created() {
        this.getCampusData();
    },
    mounted() {
        // this.createChart(this.chartId, this.chartData);
    },
    methods: {
        async getCampusData() {
            let data = {
                startTime: this.queryParams.date[0],
                endTime: this.queryParams.date[1],
                visiType: 2
            }
            let listTbVisi = await listTbVisiLogAll(data);
            this.chartData = listTbVisi.data
            this.createChart(this.chartId, this.chartData);
        },
        
        createChart(container, data) {
            data.forEach(item => {
                console.log(item.campusName,item.value);
            })
            let chart = new G2.Chart({
                container: container,
                forceFit: true,
                height: 500,
                width: 1000,
                background: {
                    fill: "#fff"
                }
            });
            chart.source(data);
            chart.scale('value', {
                nice: true,
            });

            chart.tooltip({
                showCrosshairs: true,
                shared: true,
            });

            chart
            .area()
            .adjust('stack')
            .position('week*value')
            .color('campusName');
            chart
            .line()
            .adjust('stack')
            .position('week*value')
            .color('campusName');

            chart.interaction('element-highlight');
            chart.render()
        },
        // 查询
        handleQuery() {

        },
        // 重置
        resetQuery() {

        },
    },
}
</script>