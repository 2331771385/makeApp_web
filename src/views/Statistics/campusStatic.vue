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
                { country: 'Asia', year: '1750', value: 502 },
                { country: 'Asia', year: '1800', value: 635 },
                { country: 'Asia', year: '1850', value: 809 },
                { country: 'Asia', year: '1900', value: 5268 },
                { country: 'Asia', year: '1950', value: 4400 },
                { country: 'Asia', year: '1999', value: 3634 },
                { country: 'Asia', year: '2050', value: 947 },
                { country: 'Africa', year: '1750', value: 106 },
                { country: 'Africa', year: '1800', value: 107 },
                { country: 'Africa', year: '1850', value: 111 },
                { country: 'Africa', year: '1900', value: 1766 },
                { country: 'Africa', year: '1950', value: 221 },
                { country: 'Africa', year: '1999', value: 767 },
                { country: 'Africa', year: '2050', value: 133 },
                { country: 'Europe', year: '1750', value: 163 },
                { country: 'Europe', year: '1800', value: 203 },
                { country: 'Europe', year: '1850', value: 276 },
                { country: 'Europe', year: '1900', value: 628 },
                { country: 'Europe', year: '1950', value: 547 },
                { country: 'Europe', year: '1999', value: 729 },
                { country: 'Europe', year: '2050', value: 408 },
                { country: 'Oceania', year: '1750', value: 200 },
                { country: 'Oceania', year: '1800', value: 200 },
                { country: 'Oceania', year: '1850', value: 200 },
                { country: 'Oceania', year: '1900', value: 460 },
                { country: 'Oceania', year: '1950', value: 230 },
                { country: 'Oceania', year: '1999', value: 300 },
                { country: 'Oceania', year: '2050', value: 300 },
            ],
            queryParams: {
                date: currentTime()
            },
        }
    },
    created() {
        this.getCampusData();
    },
    mounted() {
        this.createChart(this.chartId, this.chartData);
    },
    methods: {
        getCampusData() {
            listTbVisiLogAll({
                startTime: this.queryParams.date[0],
                endTime: this.queryParams.date[1]
            }).then(res => {
                this.chartData = res.data;
                this.chartData.forEach(item => {
                    item.week = this.transLateTime(item.week)
                })
                console.log(this.chartData);
                this.createChart(this.chartId, this.chartData);
            }).catch(err => {
                this.$message.error('获取数据失败！')
            })
        },
        transLateTime(timestamp) {
            const date=new Date(timestamp)
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
            const dateString = Y + M + D;
            return dateString;
        },
        createChart(container, data) {
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
            chart.scale('year', {
                type: 'linear',
                tickInterval: 50,
            });
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
            .position('year*value')
            .color('country');
            chart
            .line()
            .adjust('stack')
            .position('year*value')
            .color('country');

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