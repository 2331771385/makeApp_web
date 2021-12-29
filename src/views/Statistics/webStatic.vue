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
import { currentTime } from './config';
import { listTbVisiLogAll } from '@/api/statistic/TbVisiLog'

export default {
    name: 'webStatic',
    data() {
        return {
            // 查询参数
            queryParams: {
                date: currentTime(),
                typeId: 3
            },
            chartId: 'chart' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''),
            chartData: []
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            listTbVisiLogAll({
                startTime: this.queryParams.date[0],
                endTime: this.queryParams.date[1],
                visiType: 1
            }).then(res => {
                this.chartData = res.data;
                this.createChart(this.chartId, this.chartData);
            }).catch(err => {
                this.$message.error('获取数据失败！')
            })
        },
        // 创建echarts对象
        createChart(container, data) {
            data.forEach(item => {
                console.log(item.week);
            })
            let chart = new G2.Chart({
                container: container,
                autoFit: true,
                height: 500,
                padding: [50],
                background: {
                    fill: "#fff"
                }
            });
            chart.data(data);
            chart.scale({
                value: {
                    min: 0,
                    nice: true,
                },
                week: {
                    range: [0, 1]
                }
            });
            chart.tooltip({
                showCrosshairs: true,
                shared: true,
            });

            chart.axis('value', {
                label: {
                    formatter: (val) => {
                        return (val) + '次';
                    },
                },
            });

            chart.area().position('week*value');
            chart.line().position('week*value');

            chart.render();



            // chart.source(data);
            // chart.axis('value', {
            //     label: {
            //         formatter(val) {
            //         return (val) + '次';
            //         }
            //     }
            // });
            // chart.scale({
            //     value: {
            //         min: 0
            //     }
            // })
            // chart.tooltip({
            //     crosshairs: {
            //         type: 'cross'
            //     }
            // });
            // chart.area().position('week*value');
            // chart.line().position('week*value');
            // chart.render();
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