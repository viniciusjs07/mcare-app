import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-scheduling-cid',
    templateUrl: './scheduling-cid.component.html',
    styleUrls: ['./scheduling-cid.component.scss']
})
export class SchedulingCidComponent implements OnInit {

    API_SCHEDULE_BY_CID = 'services/scheduling_get_by_cid';

    schedules = [];
    cids = [];

    colors: Color[] = [
        {
            backgroundColor: [
                'green',
                'green',
                'green'
            ]
        }
    ];

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    public barChartOptions: ChartOptions = {
        responsive: true,
    };

    public barChartLabels: Label[] = [];
    public barChartType: ChartType = 'horizontalBar';
    public barChartLegend = true;
    public barChartPlugins = [];

    public barChartData: ChartDataSets[] = [
        {data: [], label: 'Quantidade de agendamentos'}
    ];

    constructor(private readonly http: HttpClient) {
    }

    ngOnInit() {
        this.refreshData();
    }

    refreshData() {
        const apiRoute = environment.url + this.API_SCHEDULE_BY_CID;
        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response: any) => {
                this.cids = response['cids'];
                this.schedules = response['schedules_by_cid'];
                this.barChartLabels = this.cids;
                this.barChartData[0].data = this.schedules;
            }, (err) => {
                console.log(err);
            }
        );
    }

}
