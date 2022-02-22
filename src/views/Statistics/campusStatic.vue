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
            chartData: [],
            queryParams: {
                date: currentTime()
            },
            chart: null,
            firstDraw: true
        }
    },
    created() {
        this.getCampusData();
    },
    methods: {
        async getCampusData() {
            let data = {
                startTime: this.queryParams.date[0],
                endTime: this.queryParams.date[1],
                visiType: 2
            }
            let listTbVisi = await listTbVisiLogAll(data);
            this.chartData = listTbVisi.data;
            if (this.firstDraw) {
                this.createChart(this.chartData);
            } else {
                this.chart.changeData(this.chartData);
            }
        },
        
        createChart(data) {
            this.chart = new G2.Chart({
                container: this.chartId,
                // forceFit: true,
                height: 500,
                autoFit: true,
                background: {
                    fill: "#fff"
                }
            });
            this.chart.source(data);
            this.chart.scale('value', {
                nice: true,
                min: 0
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
                .color('campusName')
                .shape('smooth');

            this.chart
                .point()
                .position('week*value')
                .color('campusName')
                .shape('circle')
                .style({
                    stroke: '#fff',
                    lineWidth: 1,
                });
            this.chart.render();
            this.firstDraw = false;
        },
        // 查询
        handleQuery() {
            this.getCampusData();
        },
        // 重置
        resetQuery() {

        },
    },
}
</script>