import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToastService } from 'ng-devui';
import { HRequest } from 'src/app/@core/services/hrequest';

@Component({
  selector: 'analysis-pie',
  templateUrl: './analysis-pie.component.html',
  styleUrls: ['./analysis-pie.component.scss'],
})
export class AnalysisPieComponent implements OnInit, AfterViewInit {
  options: any;

  private historgram = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
    },
    legend: {
      data: ['总量', '系统用户', '一般用户']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '1%',
      top: '80',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: [],
      axisLabel: { interval: 'auto', fontSize: 16 },
    },
    yAxis: { type: 'value', axisLabel: { fontSize: 16 } },
    series: [
      {
        name: '总量',
        type: 'bar',
        barMaxWidth: 40,
        label: { show: false, color: '#ffffff' },
        emphasis: { focus: 'series' },
        data: [],
      },
      {
        name: '系统用户',
        type: 'bar',
        barMaxWidth: 40,
        label: { show: false, color: '#ffffff' },
        emphasis: { focus: 'series' },
        data: [],
      },
      {
        name: '一般用户',
        type: 'bar',
        barMaxWidth: 40,
        label: { show: false, color: '#ffffff' },
        emphasis: { focus: 'series' },
        data: [],
      }
    ]
  };

  constructor(private req:HRequest,
    private toastService:ToastService) {}
  ngOnInit(): void {
    this.req.httpGet("pri/user/get_portal_pie",null,res=>{
      if(res.code===200){
        this.dataForHistorgram(res.value);
        this.options=this.historgram;
      }else{
        this.showToast('error',res.value);
        console.log(res.value);
      }
    });
  }

  dataForHistorgram(arry){
    let year_array=[];
    let total_array=[];
    let pay_array=[];
    let free_array=[];

    arry.forEach(el => {
      year_array.push(el.ym);
      total_array.push(el.total);
      free_array.push(el.b_total);
      pay_array.push(el.c_total);
    });

    this.historgram.xAxis.data=year_array;
    this.historgram.series[0].data=total_array;
    this.historgram.series[1].data=free_array;
    this.historgram.series[2].data=pay_array;

   // console.log(this.historgram);
  }

  showToast(type, msg) {
    const results = this.toastService.open({
        value: [{ severity: type, summary: '提示', content: msg }],
    });
}

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
